<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const dateText = computed(() => {
  const value = frontmatter.value.date
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
})

const tags = computed<string[]>(() => {
  const value = frontmatter.value.tags
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') {
    return value.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
  }
  return []
})
</script>

<template>
  <div v-if="dateText || tags.length" class="post-meta">
    <span v-if="dateText" class="post-date">🗓 {{ dateText }}</span>
    <span v-for="tag in tags" :key="tag" class="post-tag"># {{ tag }}</span>
  </div>
</template>
