---
title: 博客
description: 技术分享与日常吐槽
pageClass: wide-page
---

<script setup>
import { data as items } from '../.vitepress/data/blog.data'
</script>

# 博客

技术笔记、踩坑记录，以及一些无用的吐槽。

<EntryList :items="items" empty-text="还没有文章，去管理后台写第一篇吧。" />
