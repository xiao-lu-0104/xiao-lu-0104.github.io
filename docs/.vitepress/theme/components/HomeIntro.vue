<script setup lang="ts">
import { profile } from '../../site'

/** 把 **粗体** 简单渲染成 strong，避免引入完整 Markdown 解析 */
function renderInline(text: string) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}
</script>

<template>
  <section class="home-block">
    <h2 class="block-title">关于我</h2>
    <div class="about-grid">
      <div class="about-bio">
        <p v-for="(paragraph, index) in profile.bio" :key="index" v-html="renderInline(paragraph)" />

        <div class="skill-groups">
          <div v-for="group in profile.skills" :key="group.title">
            <h4 class="skill-group-title">{{ group.icon }} {{ group.title }}</h4>
            <div class="skill-tags">
              <span v-for="item in group.items" :key="item" class="skill-tag">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>

      <aside class="info-card">
        <h3>个人信息</h3>
        <dl>
          <div v-for="item in profile.info" :key="item.label" class="info-row">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
        <div class="info-contact">
          <a :href="`mailto:${profile.email}`">✉️ 邮件</a>
          <a :href="profile.github" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </aside>
    </div>
  </section>

  <section class="home-block">
    <h2 class="block-title">我做过什么</h2>
    <div class="timeline">
      <div v-for="item in profile.timeline" :key="item.title" class="timeline-item">
        <div class="timeline-period">{{ item.period }}</div>
        <div class="timeline-title">{{ item.title }}</div>
        <p class="timeline-desc">{{ item.desc }}</p>
      </div>
    </div>
  </section>
</template>
