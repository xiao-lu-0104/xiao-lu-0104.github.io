<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

interface Entry {
  url: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  category?: string
}

const props = defineProps<{
  items: Entry[]
  emptyText?: string
}>()

const activeTag = ref('')

const allTags = computed(() => {
  const set = new Set<string>()
  for (const item of props.items) {
    for (const tag of item.tags ?? []) set.add(tag)
  }
  return [...set]
})

const filtered = computed(() =>
  activeTag.value
    ? props.items.filter((item) => (item.tags ?? []).includes(activeTag.value))
    : props.items,
)

function formatDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
</script>

<template>
  <div class="entry-list">
    <div v-if="allTags.length > 1" class="tag-filter">
      <button class="tag-pill" :class="{ active: activeTag === '' }" @click="activeTag = ''">
        全部
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-pill"
        :class="{ active: activeTag === tag }"
        @click="activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>

    <div v-if="filtered.length" class="entry-grid">
      <a
        v-for="item in filtered"
        :key="item.url"
        class="entry-card"
        :href="withBase(item.url)"
      >
        <div class="entry-date">{{ formatDate(item.date) }}</div>
        <h3 class="entry-title">{{ item.title }}</h3>
        <p v-if="item.summary" class="entry-summary">{{ item.summary }}</p>
        <div v-if="item.tags?.length" class="entry-tags">
          <span v-for="tag in item.tags" :key="tag">#{{ tag }}</span>
        </div>
        <span class="entry-more">阅读更多 →</span>
      </a>
    </div>

    <p v-else class="entry-empty">
      {{ emptyText || '这里还空着，去写第一篇吧。' }}
    </p>
  </div>
</template>
