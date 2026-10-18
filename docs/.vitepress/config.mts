import { defineConfig } from 'vitepress'
import { profile } from './site'

/**
 * 部署到 GitHub Pages 时自动推导 base 路径：
 *   - 仓库名为 <用户名>.github.io  → 站点在根路径，base 为 '/'
 *   - 其他仓库名（如 my-web）      → base 为 '/my-web/'
 * 本地开发时始终为 '/'。
 */
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isUserSite = repoName.toLowerCase().endsWith('.github.io')
const base =
  process.env.GITHUB_ACTIONS === 'true' && repoName && !isUserSite ? `/${repoName}/` : '/'

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: profile.name,
  description: '个人主页 · 工程经历 · 博客 · 科研经历',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/avatar.svg' }],
    ['meta', { name: 'author', content: profile.name }],
    ['meta', { name: 'theme-color', content: '#4f6ef7' }],
  ],
  markdown: {
    lineNumbers: false,
  },
  themeConfig: {
    logo: profile.avatar,
    siteTitle: profile.name,

    nav: [
      { text: '首页', link: '/' },
      { text: '工程经历', link: '/engineering/', activeMatch: '/engineering/' },
      { text: '博客', link: '/blog/', activeMatch: '/blog/' },
      { text: '科研经历', link: '/research/', activeMatch: '/research/' },
      { text: '关于我', link: '/about' },
    ],

    socialLinks: [{ icon: 'github', link: profile.github }],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },

    footer: {
      message: '用 VitePress 构建 · 内容用 Markdown 管理',
      copyright: `© ${new Date().getFullYear()} ${profile.name}`,
    },
  },
})
