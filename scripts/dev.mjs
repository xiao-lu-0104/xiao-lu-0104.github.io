/**
 * 一键启动：VitePress 开发服务器 + 内容管理台
 * 用 Ctrl+C 退出时会同时结束后台进程。
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const vitepressBin = path.join(root, 'node_modules', 'vitepress', 'bin', 'vitepress.js')

const children = []

function run(args, label) {
  const child = spawn(process.execPath, args, { cwd: root, stdio: 'inherit' })
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[${label}] 退出，代码 ${code}`)
    }
  })
  children.push(child)
  return child
}

let shuttingDown = false
function shutdown() {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) {
    if (!child.killed) child.kill()
  }
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

console.log('\n▶ 启动 VitePress 开发服务器（站点）…\n')
run([vitepressBin, 'dev', 'docs'], 'site')

console.log('▶ 启动内容管理台…\n')
run([path.join(root, 'admin', 'server.mjs')], 'manage')
