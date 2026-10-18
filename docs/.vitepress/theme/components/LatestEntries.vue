<script setup lang="ts">
import { withBase } from 'vitepress'

interface Entry {
  url: string
  title: string
  date: string
  category?: string
}

defineProps<{ items: Entry[] }>()

const categoryLabel: Record<string, string> = {
  engineering: '工程',
  blog: '博客',
  research: '科研',
}
</script>

<template>
  <section v-if="items.length" class="home-block">
    <h2 class="block-title">最新动态</h2>
    <div class="latest-list">
      <a
        v-for="item in items"
        :key="item.url"
        class="latest-item"
        :href="withBase(item.url)"
      >
        <span class="latest-cat">{{ categoryLabel[item.category ?? ''] ?? '记录' }}</span>
        <span class="latest-title">{{ item.title }}</span>
        <span class="latest-date">{{ item.date }}</span>
      </a>
    </div>
  </section>
</template>
