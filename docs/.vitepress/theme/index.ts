import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import type { Theme } from 'vitepress'

import PostMeta from './components/PostMeta.vue'
import EntryList from './components/EntryList.vue'
import HomeIntro from './components/HomeIntro.vue'
import LatestEntries from './components/LatestEntries.vue'

import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      // 在文档正文之前插入日期 / 标签信息
      'doc-before': () => h(PostMeta),
    }),
  enhanceApp({ app }) {
    app.component('EntryList', EntryList)
    app.component('HomeIntro', HomeIntro)
    app.component('LatestEntries', LatestEntries)
  },
} satisfies Theme
