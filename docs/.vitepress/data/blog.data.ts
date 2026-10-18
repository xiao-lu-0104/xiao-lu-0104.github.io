import { createContentLoader } from 'vitepress'
import { toEntries, type Entry } from './shared'

declare const data: Entry[]
export { data }

export default createContentLoader('blog/*.md', {
  transform: (raw) => toEntries(raw, 'blog'),
})
