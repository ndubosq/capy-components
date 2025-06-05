'use client'

import type { FiltersState } from '@/components/data-table-filter/core/types'
import { parseAsJson, useQueryState } from 'nuqs'
import { z } from 'zod'
import { IssuesTable } from './_/issues-table'

const filtersSchema = z.custom<FiltersState>()

export default function SSRPage() {
  const [filters, setFilters] = useQueryState<FiltersState>(
    'filters',
    parseAsJson(filtersSchema.parse).withDefault([]),
  )

  return (
    <div className="flex flex-col h-full p-4">
      <IssuesTable state={{ filters, setFilters }} />
    </div>
  )
}
