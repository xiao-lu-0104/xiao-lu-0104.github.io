/**
 * 本地内容管理后台
 * ------------------------------------------------------------
 * 只监听 127.0.0.1，仅本机可访问。
 * 直接读写 docs/ 下的 Markdown 文件：
 *   - engineering/*.md  工程经历
 *   - blog/*.md         博客
 *   - research/*.md     科研经历
 *
 * 启动：npm run manage   然后打开 http://127.0.0.1:4317
 */
import http from 'node:http'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')
const UPLOAD_DIR = path.join(DOCS, 'public', 'uploads')
const PORT = Number(process.env.MANAGE_PORT || 4317)
const HOST = '127.0.0.1'

const CATEGORIES = {
  engineering: { label: '工程经历', dir: 'engineering', prefix: 'proj' },
  blog: { label: '博客', dir: 'blog', prefix: 'post' },
  research: { label: '科研经历', dir: 'research', prefix: 'paper' },
}

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

/* ---------------------------------------------------------------- 工具 */

const SLUG_RE = /^[\p{L}\p{N}][\p{L}\p{N}\-_]*$/u
const WIN_RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i

function isSafeSlug(slug) {
  return (
    typeof slug === 'string' &&
    slug.length > 0 &&
    slug.length <= 80 &&
    SLUG_RE.test(slug) &&
    !WIN_RESERVED.test(slug)
  )
}

function categoryConf(category) {
  const conf = CATEGORIES[category]
  if (!conf) throw new HttpError(400, '未知栏目')
  return conf
}

function itemPath(category, slug) {
  const conf = categoryConf(category)
  if (!isSafeSlug(slug)) {
    throw new HttpError(400, '文件名只允许中英文、数字、- 和 _')
  }
  const dir = path.join(DOCS, conf.dir)
  const full = path.resolve(dir, `${slug}.md`)
  if (!full.startsWith(dir + path.sep)) throw new HttpError(400, '非法路径')
  return full
}

function today() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function normalizeDate(value) {
  if (!value) return ''
  const raw = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(raw.getTime())) return String(value)
  const pad = (n) => String(n).padStart(2, '0')
  return `${raw.getFullYear()}-${pad(raw.getMonth() + 1)}-${pad(raw.getDate())}`
}

async function fileExists(file) {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

/* ------------------------------------------------------- frontmatter */

function unquote(value) {
  if (value.length >= 2) {
    const first = value[0]
    const last = value[value.length - 1]
    if (first === '"' && last === '"') {
      try {
        return JSON.parse(value)
      } catch {
        return value.slice(1, -1)
      }
    }
    if (first === "'" && last === "'") {
      return value.slice(1, -1).replace(/''/g, "'")
    }
  }
  return value
}

function parseValue(raw) {
  const value = raw.trim()
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null' || value === '~') return null
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim()
    if (!inner) return []
    return inner
      .split(',')
      .map((item) => unquote(item.trim()))
      .filter(Boolean)
  }
  return unquote(value)
}

function parseFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, '')
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/)
  if (!match) return { data: {}, content: normalized }

  const data = {}
  let currentKey = null

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue

    // YAML 列表项：  - item
    const listItem = line.match(/^\s*-\s+(.*)$/)
    if (listItem && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = []
      data[currentKey].push(unquote(listItem[1].trim()))
      continue
    }

    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    if (!key) continue
    const value = line.slice(idx + 1).trim()
    currentKey = key
    data[key] = value === '' ? [] : parseValue(value)
  }

  return { data, content: normalized.slice(match[0].length) }
}

function buildMarkdown(fields) {
  const lines = ['---']
  lines.push(`title: ${JSON.stringify(fields.title || '未命名')}`)
  lines.push(`date: ${fields.date || today()}`)

  const tags = (fields.tags || []).map((tag) => String(tag).trim()).filter(Boolean)
  if (tags.length) {
    lines.push(`tags: [${tags.map((tag) => JSON.stringify(tag)).join(', ')}]`)
  }
  if (fields.summary) {
    lines.push(`summary: ${JSON.stringify(fields.summary)}`)
  }
  if (fields.draft) lines.push('draft: true')

  lines.push('---', '')
  lines.push((fields.content || '').replace(/\r\n/g, '\n').trim())
  lines.push('')
  return lines.join('\n')
}

/* ------------------------------------------------------------- 数据层 */

async function listItems(category) {
  const conf = categoryConf(category)
  const dir = path.join(DOCS, conf.dir)
  let names = []
  try {
    names = await fs.readdir(dir)
  } catch {
    return []
  }

  const items = []
  for (const name of names) {
    if (!name.endsWith('.md') || name === 'index.md') continue
    const full = path.join(dir, name)
    const stat = await fs.stat(full).catch(() => null)
    if (!stat?.isFile()) continue

    const raw = await fs.readFile(full, 'utf8')
    const { data } = parseFrontmatter(raw)
    items.push({
      slug: name.replace(/\.md$/, ''),
      title: typeof data.title === 'string' ? data.title : name,
      date: normalizeDate(data.date),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      summary: typeof data.summary === 'string' ? data.summary : '',
      draft: data.draft === true,
      updatedAt: stat.mtime.toISOString(),
    })
  }

  return items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

async function readItem(category, slug) {
  const full = itemPath(category, slug)
  if (!(await fileExists(full))) throw new HttpError(404, '文件不存在')
  const raw = await fs.readFile(full, 'utf8')
  const { data, content } = parseFrontmatter(raw)
  return {
    slug,
    title: typeof data.title === 'string' ? data.title : '',
    date: normalizeDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    summary: typeof data.summary === 'string' ? data.summary : '',
    draft: data.draft === true,
    content: content.replace(/^\r?\n/, ''),
  }
}

async function saveItem(body) {
  const { category, slug, originalSlug } = body
  const conf = categoryConf(category)

  if (!isSafeSlug(slug)) {
    throw new HttpError(400, '文件名只允许中英文、数字、- 和 _（且不能以 - 或 _ 开头）')
  }

  const target = itemPath(category, slug)
  const renaming = Boolean(originalSlug) && originalSlug !== slug

  if (renaming && (await fileExists(target))) {
    throw new HttpError(409, `文件名 "${slug}.md" 已存在，请换一个`)
  }

  await fs.mkdir(path.join(DOCS, conf.dir), { recursive: true })
  await fs.writeFile(
    target,
    buildMarkdown({
      title: body.title,
      date: body.date || today(),
      tags: body.tags || [],
      summary: body.summary || '',
      draft: Boolean(body.draft),
      content: body.content || '',
    }),
    'utf8',
  )

  if (renaming) {
    await fs.rm(itemPath(category, originalSlug), { force: true })
  }

  return { slug, url: `/${conf.dir}/${encodeURIComponent(slug)}` }
}

async function deleteItem(category, slug) {
  const full = itemPath(category, slug)
  if (!(await fileExists(full))) throw new HttpError(404, '文件不存在')
  await fs.rm(full)
  return { ok: true }
}

async function uploadImage(body) {
  const dataUrl = String(body.dataUrl || '')
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/)
  if (!match) throw new HttpError(400, '图片格式不正确')

  const mime = match[1].toLowerCase()
  const extMap = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
  }
  const ext = extMap[mime]
  if (!ext) throw new HttpError(400, '只支持 png / jpg / gif / webp / svg')

  const buffer = Buffer.from(match[2].replace(/\s/g, ''), 'base64')
  if (buffer.length > 10 * 1024 * 1024) {
    throw new HttpError(413, '图片不能超过 10 MB')
  }

  const base = path
    .basename(String(body.filename || 'image'), path.extname(String(body.filename || '')))
    .replace(/[^\w.-]+/g, '_')
    .slice(0, 40) || 'image'

  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  const filename = `${Date.now()}-${base}${ext}`
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer)

  return { url: `/uploads/${filename}`, filename }
}

/* ------------------------------------------------------------- HTTP */

function sendJson(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
  })
  res.end(body)
}

async function readBody(req, limit = 20 * 1024 * 1024) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) throw new HttpError(413, '请求体过大')
    chunks.push(chunk)
  }
  const text = Buffer.concat(chunks).toString('utf8')
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    throw new HttpError(400, 'JSON 解析失败')
  }
}

async function serveIndex(res) {
  const file = path.join(__dirname, 'ui', 'index.html')
  const html = await fs.readFile(file, 'utf8')
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(html)
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || HOST}`)
    const { pathname } = url

    if (pathname === '/' || pathname === '/index.html') {
      return await serveIndex(res)
    }

    if (pathname === '/api/meta' && req.method === 'GET') {
      const data = Object.entries(CATEGORIES).map(([key, conf]) => ({
        key,
        label: conf.label,
        dir: conf.dir,
        prefix: conf.prefix,
      }))
      return sendJson(res, 200, { categories: data, today: today() })
    }

    if (pathname === '/api/list' && req.method === 'GET') {
      const category = url.searchParams.get('category') || ''
      return sendJson(res, 200, { items: await listItems(category) })
    }

    if (pathname === '/api/item' && req.method === 'GET') {
      const category = url.searchParams.get('category') || ''
      const slug = url.searchParams.get('slug') || ''
      return sendJson(res, 200, await readItem(category, slug))
    }

    if (pathname === '/api/save' && req.method === 'POST') {
      const body = await readBody(req)
      return sendJson(res, 200, await saveItem(body))
    }

    if (pathname === '/api/item' && req.method === 'DELETE') {
      const category = url.searchParams.get('category') || ''
      const slug = url.searchParams.get('slug') || ''
      return sendJson(res, 200, await deleteItem(category, slug))
    }

    if (pathname === '/api/upload' && req.method === 'POST') {
      const body = await readBody(req)
      return sendJson(res, 200, await uploadImage(body))
    }

    sendJson(res, 404, { error: '接口不存在' })
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500
    if (status >= 500) console.error('[manage]', err)
    if (!res.headersSent) {
      sendJson(res, status, { error: err?.message || '服务器错误' })
    } else {
      res.end()
    }
  }
})

server.listen(PORT, HOST, () => {
  console.log('')
  console.log('  🗂  内容管理台已启动')
  console.log(`      http://${HOST}:${PORT}`)
  console.log('')
  console.log('  提示：另开一个终端运行 `npm run docs:dev` 查看站点效果，')
  console.log('        或直接运行 `npm run dev` 同时启动两者。')
  console.log('')
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，可用 MANAGE_PORT=xxxx 换一个端口。`)
    process.exit(1)
  }
  throw err
})
