/**
 * 三个栏目共用的数据整理逻辑。
 * 每个 *.data.ts 负责把一个目录下的 Markdown 读成 Entry 数组。
 */

export interface Entry {
  url: string
  title: string
  date: string
  summary: string
  tags: string[]
  category: string
}

interface RawPage {
  url: string
  frontmatter: Record<string, any>
}

export function toEntries(raw: RawPage[], category: string): Entry[] {
  return raw
    .filter((page) => page.url !== `/${category}/` && !page.url.endsWith(`/${category}/index`))
    .map((page) => {
      const fm = page.frontmatter ?? {}
      return {
        url: page.url,
        title: fm.title ?? '未命名',
        date: normalizeDate(fm.date),
        summary: fm.summary ?? '',
        tags: normalizeTags(fm.tags),
        category,
        draft: fm.draft === true,
      }
    })
    .filter((entry) => !(entry as any).draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .map(({ url, title, date, summary, tags, category }) => ({
      url,
      title,
      date,
      summary,
      tags,
      category,
    }))
}

function normalizeDate(value: unknown): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item))
  if (typeof value === 'string') {
    return value
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}
