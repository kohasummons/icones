import type { IdCase } from '../utils/case'
import { idCases } from '../utils/case'

const RECENT_CAPACITY = 10

export type ActiveMode = 'normal' | 'select' | 'copy'

export const themeColor = useStorage('icones-theme-color', '#329672')
export const iconSize = useStorage('icones-icon-size', '2xl')
export const previewColor = useStorage('icones-preview-color', '#888888')
export const copyPreviewColor = useStorage('icones-copy-preview-color', false)
export const listType = useStorage('icones-list-type', 'grid')
export const favoritedCollectionIds = useStorage<string[]>('icones-fav-collections', [])
export const recentCollectionIds = useStorage<string[]>('icones-recent-collections', [])
export const recentIconIds = useStorage<string[]>('icones-recent-icons', [])
export const bags = useStorage<string[]>('icones-bags', [])
export const activeMode = useStorage<ActiveMode>('active-mode', 'normal')
export const preferredCase = useStorage<IdCase>('icones-preferfed-case', 'iconify')
export const sortAlphabetically = useStorage('icones-alpha-sort-collections', false)

export function getTransformedId(icon: string) {
  return idCases[preferredCase.value]?.(icon) || icon
}

export function isFavoritedCollection(id: string) {
  return favoritedCollectionIds.value.includes(id)
}

export function isRecentCollection(id: string) {
  return recentCollectionIds.value.includes(id)
}

export function pushRecentCollection(id: string) {
  recentCollectionIds.value = [id, ...recentCollectionIds.value.filter(i => i !== id)].slice(0, RECENT_CAPACITY)
}

export function removeRecentCollection(id: string) {
  recentCollectionIds.value = recentCollectionIds.value.filter(i => i !== id)
}

export function isRecentIcon(id: string) {
  return recentIconIds.value.includes(id)
}

export function pushRecentIcon(id: string) {
  recentIconIds.value = [id, ...recentIconIds.value.filter(i => i !== id)].slice(0, RECENT_CAPACITY)
}

export function removeRecentIcon(id: string) {
  recentIconIds.value = recentIconIds.value.filter(i => i !== id)
}

export function toggleFavoriteCollection(id: string) {
  const index = favoritedCollectionIds.value.indexOf(id)
  if (index >= 0)
    favoritedCollectionIds.value.splice(index, 1)
  else
    favoritedCollectionIds.value.push(id)
}

export function addToBag(id: string) {
  if (!bags.value.includes(id))
    bags.value.push(id)
}

export function removeFromBag(id: string) {
  const index = bags.value.indexOf(id)
  if (index >= 0)
    bags.value.splice(index, 1)
}

export function inBag(id: string) {
  return bags.value.includes(id)
}

export function toggleBag(id: string) {
  const index = bags.value.indexOf(id)
  if (index >= 0)
    bags.value.splice(index, 1)
  else
    bags.value.push(id)
}

export function clearBag() {
  bags.value = []
}
