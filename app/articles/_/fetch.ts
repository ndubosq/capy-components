import type { FiltersState } from '@/components/data-table-filter/core/types'
import {
  dateFilterFn,
  multiOptionFilterFn,
  numberFilterFn,
  optionFilterFn,
  textFilterFn,
} from '@/components/data-table-filter/lib/filter-fns'
import { ARTICLE_LABELS, ARTICLE_STATES, ARTICLE_TYPES, generateArticles, TVA_RATES } from './data'
import type { Article } from './types'
import { sleep } from './utils'

const ARTICLES_COUNT = process.env.NODE_ENV === 'production' ? 30000 : 1000
const ARTICLES = generateArticles(ARTICLES_COUNT)
const SLEEP = 150

export async function fetchArticles(filters?: FiltersState) {
  await sleep(SLEEP)

  if (!filters || filters.length === 0) return ARTICLES

  // Apply filters using AND logic
  // You can use a provided filterFn function from '@/components/data-table-filter/lib/filter-fns
  const filteredArticles = ARTICLES.filter((article) => {
    return filters.every((filter) => {
      const columnId = filter.columnId as keyof Article

      if (filter.type === 'text') {
        const value = article[columnId] as string | undefined
        if (!value) return false
        return textFilterFn(value, filter)
      }

      if (filter.type === 'option') {
        const value = (article[columnId] as any)?.id as string | undefined
        if (!value) return false
        return optionFilterFn(value, filter)
      }

      if (filter.type === 'multiOption') {
        const value = ((article[columnId] as any) ?? []).map(
          (l: any) => l.id,
        ) as string[]
        if (!value) return false
        return multiOptionFilterFn(value, filter)
      }

      if (filter.type === 'date') {
        const value = article[columnId] as Date | undefined
        if (!value) return false
        return dateFilterFn(value, filter)
      }

      if (filter.type === 'number') {
        const value = article[columnId] as number | undefined
        if (!value) return false
        return numberFilterFn(value, filter)
      }

      throw new Error(`Unknown filter type: ${filter.type}`)
    })
  })

  return filteredArticles
}

export async function fetchArticleLabels() {
  await sleep(SLEEP)
  return ARTICLE_LABELS
}

export async function fetchArticleTypes() {
  await sleep(SLEEP)
  return ARTICLE_TYPES
}

export async function fetchArticleTVA() {
  await sleep(SLEEP)
  return TVA_RATES
}

export async function fetchArticleStates() {
  await sleep(SLEEP)
  return ARTICLE_STATES
}

export async function fetchFacetedArticleTypes() {
  await sleep(SLEEP)
  const map = new Map<string, number>()

  for (const type of ARTICLE_TYPES) {
    map.set(type.id, 0)
  }

  for (const article of ARTICLES) {
    const typeId = article.type.id
    const curr = map.get(typeId) ?? 0
    map.set(typeId, curr + 1)
  }

  return map
}

export async function fetchFacetedTVA() {
  await sleep(SLEEP)
  const map = new Map<string, number>()

  for (const tva of TVA_RATES) {
    map.set(tva.id, 0)
  }

  for (const article of ARTICLES) {
    const tvaId = article.tva.id
    const curr = map.get(tvaId) ?? 0
    map.set(tvaId, curr + 1)
  }

  return map
}

export async function fetchFacetedArticleStates() {
  await sleep(SLEEP)
  const map = new Map<string, number>()

  for (const state of ARTICLE_STATES) {
    map.set(state.id, 0)
  }

  for (const article of ARTICLES) {
    const stateId = article.state.id
    const curr = map.get(stateId) ?? 0
    map.set(stateId, curr + 1)
  }

  return map
}

export async function fetchFacetedPriceRange(): Promise<{
  ht: [number, number]
  ttc: [number, number]
}> {
  await sleep(SLEEP)
  const initialRange = { ht: [Infinity, -Infinity], ttc: [Infinity, -Infinity] }
  
  const ranges = ARTICLES.reduce((acc, article) => {
    // HT (Hors Taxes)
    acc.ht[0] = Math.min(acc.ht[0], article.ht)
    acc.ht[1] = Math.max(acc.ht[1], article.ht)
    
    // TTC (Toutes Taxes Comprises)
    acc.ttc[0] = Math.min(acc.ttc[0], article.ttc)
    acc.ttc[1] = Math.max(acc.ttc[1], article.ttc)
    
    return acc
  }, initialRange)

  return {
    ht: [ranges.ht[0] === Infinity ? 0 : ranges.ht[0], ranges.ht[1] === -Infinity ? 0 : ranges.ht[1]],
    ttc: [ranges.ttc[0] === Infinity ? 0 : ranges.ttc[0], ranges.ttc[1] === -Infinity ? 0 : ranges.ttc[1]],
  }
}
