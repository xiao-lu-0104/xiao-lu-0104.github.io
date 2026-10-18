---
layout: home

hero:
  name: 芦恩祈
  text: 嵌入式 · 芯片 · 量化
  tagline: 把踩过的坑记下来，因为下次一定还会踩。
  image:
    src: /avatar.jpg
    alt: 芦恩祈
  actions:
    - theme: brand
      text: 关于我
      link: /about
    - theme: alt
      text: 读读博客
      link: /blog/
    - theme: alt
      text: GitHub
      link: https://github.com/xiao-lu-0104

features:
  - icon: 🛠️
    title: 工程经历
    details: 电赛 G 题、西门子杯、一生一芯……做过的东西都在这里。
    link: /engineering/
    linkText: 看看项目
  - icon: ✍️
    title: 博客
    details: 技术笔记、踩坑记录，以及一些无用的吐槽。
    link: /blog/
    linkText: 随便翻翻
  - icon: 🔬
    title: 科研经历
    details: 大模型量化方向的论文阅读、实验与思考。
    link: /research/
    linkText: 了解研究
---

<script setup>
import { computed } from 'vue'
import { data as engineering } from './.vitepress/data/engineering.data'
import { data as blog } from './.vitepress/data/blog.data'
import { data as research } from './.vitepress/data/research.data'

const latest = computed(() =>
  [...engineering, ...blog, ...research]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 6),
)
</script>

<LatestEntries :items="latest" />

<HomeIntro />
