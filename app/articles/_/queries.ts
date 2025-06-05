import type { FiltersState } from '@/components/data-table-filter/core/types'
import type { QueryOptions } from '@tanstack/react-query'
import {
  fetchFacetedPriceRange,
  fetchFacetedArticleStates,
  fetchFacetedArticleTypes,
  fetchArticles,
  fetchArticleLabels,
  fetchArticleStates,
  fetchArticleTypes,
  fetchFacetedTVA,
  fetchArticleTVA,
} from './fetch'

export const queries = {
  issues: {
    all: (filters?: FiltersState) =>
      ({
        queryKey: ['articles', filters],
        queryFn: () => fetchArticles(filters),
      }) satisfies QueryOptions,
  },
  statuses: {
    all: () => ({
      queryKey: ['statuses'],
      queryFn: () => fetchArticleStates(),
    }),
    faceted: () =>
      ({
        queryKey: ['statuses', 'faceted'],
        queryFn: () => fetchFacetedArticleStates(),
      }) satisfies QueryOptions,
  },
  labels: {
    all: () => ({
      queryKey: ['labels'],
      queryFn: () => fetchArticleLabels(),
    }),
    faceted: () =>
      ({
        queryKey: ['labels', 'faceted'],
        queryFn: () => fetchFacetedArticleStates(),
      }) satisfies QueryOptions,
  },
  users: {
    all: () =>
      ({
        queryKey: ['types'],
        queryFn: () => fetchArticleTypes(),
      }) satisfies QueryOptions,
    faceted: () =>
      ({
        queryKey: ['types', 'faceted'],
        queryFn: () => fetchFacetedArticleTypes(),
      }) satisfies QueryOptions,
  },
  estimatedHours: {
    faceted: () => ({
      queryKey: ['priceRange', 'faceted'],
      queryFn: () => fetchFacetedPriceRange(),
    }),
  },
  tva: {
    all: () => ({
      queryKey: ['tva'],
      queryFn: () => fetchArticleTVA(),
    }),
    faceted: () => ({
      queryKey: ['tva', 'faceted'],
      queryFn: () => fetchFacetedTVA(),
    }),
  },
}
