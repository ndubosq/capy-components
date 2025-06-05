'use client'

import { cn } from '@/lib/utils'
import {
  DataTableFilter,
  useDataTableFilters,
} from '@/components/data-table-filter'
import type { FiltersState } from '@/components/data-table-filter/core/types'
import type { FilterSelectorRef } from '@/components/data-table-filter/components/filter-selector'
// import { createTSTColumns } from '@/components/data-table-filter/integrations/tanstack-table'
import { useQuery } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { useState, useRef, createContext, useContext } from 'react'
import { LABEL_STYLES_BG, type TW_COLOR, tstColumnDefs } from './columns'
import { DataTable } from './data-table'
import { columnsConfig } from './filters'
import { queries } from './queries'
import { TableFilterSkeleton, TableSkeleton } from './table-skeleton'
import type { ArticleLabel, ArticleState, ArticleTVA, ArticleType } from './types'
import { ColumnVisibility } from './column-visibility'

// Create context for filter functionality
const FilterContext = createContext<{
  openFilter: (columnId: string) => void
} | null>(null)

export const useFilterContext = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilterContext must be used within FilterContext.Provider')
  }
  return context
}

function createLabelOptions(labels: ArticleLabel[] | undefined) {
  return labels?.map((l) => ({
    value: l.id,
    label: l.name,
    icon: (
      <div
        className={cn(
          'size-2.5 rounded-full',
          LABEL_STYLES_BG[l.color as TW_COLOR],
        )}
      />
    ),
  }))
}

function createStatusOptions(statuses: ArticleState[] | undefined) {
  return statuses?.map((s) => ({
    value: s.id,
    label: s.name,
    icon: (
      <div
        key={s.id}
        className={cn(
          'size-2.5 rounded-full',
          LABEL_STYLES_BG[s.color as TW_COLOR],
        )}
      />
    ),
  }))
}

function createTypeOptions(types: ArticleType[] | undefined) {
  return types?.map((t) => ({
    value: t.id,
    label: t.name,
    icon: (
      <div
        key={t.id}
        className={cn(
          'size-2.5 rounded-full',
          LABEL_STYLES_BG[t.color as TW_COLOR],
        )}
      />
    ),
  }))
}

function createTVAOptions(tvas: ArticleTVA[] | undefined) {
  return tvas?.map((t) => ({
    value: t.id,
    label: `${t.name}`,
    icon: (
      <div
        key={t.id}
        className={cn(
          'size-2.5 rounded-full',
          LABEL_STYLES_BG[t.color as TW_COLOR],
        )}
      />
    ),
  }))
}

export function IssuesTable({
  state,
}: {
  state: {
    filters: FiltersState
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>
  }
}) {
  const filterSelectorRef = useRef<FilterSelectorRef>(null)

  /* Step 1: Fetch data from the server */
  const labels = useQuery(queries.labels.all())
  const statuses = useQuery(queries.statuses.all())
  const types = useQuery(queries.users.all()) // Using 'users' query for types due to existing structure
  const tva = useQuery(queries.tva.all())

  const facetedLabels = useQuery(queries.labels.faceted())
  const facetedStatuses = useQuery(queries.statuses.faceted())
  const facetedTypes = useQuery(queries.users.faceted()) // Using 'users' query for types
  const facetedTVA = useQuery(queries.tva.faceted())
  const facetedPriceRange = useQuery(queries.estimatedHours.faceted())

  const issues = useQuery(queries.issues.all(state.filters))

  /* Step 2: Create ColumnOption[] for each option-based column */
  const labelOptions = createLabelOptions(labels.data)
  const statusOptions = createStatusOptions(statuses.data)
  const typeOptions = createTypeOptions(types.data)
  const tvaOptions = createTVAOptions(tva.data)

  const isOptionsDataPending =
    labels.isPending ||
    statuses.isPending ||
    types.isPending ||
    tva.isPending ||
    facetedLabels.isPending ||
    facetedStatuses.isPending ||
    facetedTypes.isPending ||
    facetedTVA.isPending ||
    facetedPriceRange.isPending

  /*
   * Step 3: Create our data table filters instance
   *
   * This instance will handle the logic for filtering the data and updating the filters state.
   * We expose an `options` prop to provide the options for each column dynamically, after fetching them above.
   * The same goes for `faceted` unique values and min/max values.
   * It exposes our filters state, for you to pass on as you wish - e.g. to a TanStack Table instance.
   */
  const { columns, filters, actions, strategy } = useDataTableFilters({
    strategy: 'server',
    data: issues.data ?? [],
    columnsConfig,
    filters: state.filters,
    onFiltersChange: state.setFilters,
    options: {
      state: statusOptions,
      type: typeOptions,
      tva: tvaOptions,
    },
    faceted: {
      state: facetedStatuses.data,
      type: facetedTypes.data,
      tva: facetedTVA.data,
      ht: facetedPriceRange.data?.ht,
      ttc: facetedPriceRange.data?.ttc,
    },
  })

  /* Step 4: Create our TanStack Table instance */
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const table = useReactTable({
    data: issues.data ?? [],
    columns: tstColumnDefs,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      rowSelection,
      sorting,
      columnVisibility
    },
  })

  /* Step 5: Render the table! */
  return (
    <FilterContext.Provider value={{ 
      openFilter: (columnId: string) => filterSelectorRef.current?.openWithColumn(columnId)
    }}>
      <div className="w-full col-span-2">
        <div className="flex items-center pb-4 gap-2">
          {isOptionsDataPending ? (
            <TableFilterSkeleton />
          ) : (
            <>
            <DataTableFilter
              ref={filterSelectorRef}
              filters={filters}
              columns={columns}
              actions={actions}
              strategy={strategy}
              />

              <ColumnVisibility table={table} />
            </>
          )}
        </div>
        {issues.isLoading ? (
          <div className="w-full col-span-2">
            <TableSkeleton numCols={tstColumnDefs.length} numRows={10} />
          </div>
        ) : (
          <DataTable table={table} actions={actions} />
        )}
      </div>
    </FilterContext.Provider>
  )
}
