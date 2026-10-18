import { createContentLoader } from 'vitepress'
import { toEntries, type Entry } from './shared'

declare const data: Entry[]
export { data }

export default createContentLoader('research/*.md', {
  transform: (raw) => toEntries(raw, 'research'),
})
