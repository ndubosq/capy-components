import { Checkbox } from '@/components/ui/checkbox'
import { ColumnHeaderPopover } from '@/components/ui/column-header-popover'
import { cn } from '@/lib/utils'
import { createColumnHelper } from '@tanstack/react-table'
import type { Article, ArticleTVA } from './types'
import { useFilterContext } from './issues-table'

export const LABEL_STYLES_MAP = {
  red: 'bg-red-100 border-red-200 text-red-800 dark:bg-red-800 dark:border-red-700 dark:text-red-100',
  orange:
    'bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-800 dark:border-orange-700 dark:text-orange-100',
  amber:
    'bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-800 dark:border-amber-700 dark:text-amber-100',
  yellow:
    'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:border-yellow-700 dark:text-yellow-100',
  lime: 'bg-lime-100 border-lime-200 text-lime-800 dark:bg-lime-800 dark:border-lime-700 dark:text-lime-100',
  green:
    'bg-green-100 border-green-200 text-green-800 dark:bg-green-800 dark:border-green-700 dark:text-green-100',
  emerald:
    'bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:border-emerald-700 dark:text-emerald-100',
  teal: 'bg-teal-100 border-teal-200 text-teal-800 dark:bg-teal-800 dark:border-teal-700 dark:text-teal-100',
  cyan: 'bg-cyan-100 border-cyan-200 text-cyan-800 dark:bg-cyan-800 dark:border-cyan-700 dark:text-cyan-100',
  sky: 'bg-sky-100 border-sky-200 text-sky-800 dark:bg-sky-800 dark:border-sky-700 dark:text-sky-100',
  blue: 'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-800 dark:border-blue-700 dark:text-blue-100',
  indigo:
    'bg-indigo-100 border-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:border-indigo-700 dark:text-indigo-100',
  violet:
    'bg-violet-100 border-violet-200 text-violet-800 dark:bg-violet-800 dark:border-violet-700 dark:text-violet-100',
  purple:
    'bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-800 dark:border-purple-700 dark:text-purple-100',
  fuchsia:
    'bg-fuchsia-100 border-fuchsia-200 text-fuchsia-800 dark:bg-fuchsia-800 dark:border-fuchsia-700 dark:text-fuchsia-100',
  pink: 'bg-pink-100 border-pink-200 text-pink-800 dark:bg-pink-800 dark:border-pink-700 dark:text-pink-100',
  rose: 'bg-rose-100 border-rose-200 text-rose-800 dark:bg-rose-800 dark:border-rose-700 dark:text-rose-100',
  neutral:
    'bg-neutral-100 border-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100',
  black: 'bg-black-100 border-black-200 text-black-800 dark:bg-black-800 dark:border-black-700 dark:text-black-100',
  gray: 'bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
  white: 'bg-white',
} as const

export const LABEL_STYLES_BG = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  yellow: 'bg-yellow-500',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  sky: 'bg-sky-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  purple: 'bg-purple-500',
  fuchsia: 'bg-fuchsia-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
  neutral: 'bg-neutral-500',
  black: 'bg-black-500',
  gray: 'bg-gray-500',
  white: 'bg-white',
} as const

export type TW_COLOR = keyof typeof LABEL_STYLES_MAP

const columnHelper = createColumnHelper<Article>()

export const tstColumnDefs = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Tout sélectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor((row) => row.code, {
    id: 'code',
    header: ({ column }) => {
      const { openFilter } = useFilterContext()
      return (
        <ColumnHeaderPopover
          columnId="code"
          currentSort={column.getIsSorted() || null}
          onSort={(direction) => column.toggleSorting(direction === 'desc')}
          onFilter={() => openFilter('code')}
          onHide={() => column.toggleVisibility(false)}
        >
          Code
        </ColumnHeaderPopover>
      )
    },
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ row }) => {
      const { code } = row.original
      return (
        <div className="flex items-center gap-2">
          <span>{code}</span>
        </div>
      )
    },
  }),
  columnHelper.accessor((row) => row.state.id, {
    id: 'state',
    header: ({ column }) => {
      const { openFilter } = useFilterContext()
      return (
        <ColumnHeaderPopover
          columnId="state"
          currentSort={column.getIsSorted() || null}
          onSort={(direction) => column.toggleSorting(direction === 'desc')}
          onFilter={() => openFilter('state')}
          onHide={() => column.toggleVisibility(false)}
        >
          État
        </ColumnHeaderPopover>
      )
    },
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ row }) => {
      const { state } = row.original
      const StateIcon = state.icon

      return (
        <div
          className={cn(
            'flex items-center gap-2 py-0.5 px-1.5 rounded-xl text-[12px] shadow-xs font-medium border max-w-fit',
            LABEL_STYLES_MAP[state.color as TW_COLOR],
          )}
        >
          <StateIcon className="size-3" />
          <span>{state.name}</span>
        </div>
      )
    },
  }),
  columnHelper.accessor((row) => row.label, {
    id: 'label',
    header: ({ column }) => {
      const { openFilter } = useFilterContext()
      return (
        <ColumnHeaderPopover
          columnId="label"
          currentSort={column.getIsSorted() || null}
          onSort={(direction) => column.toggleSorting(direction === 'desc')}
          onFilter={() => openFilter('label')}
          onHide={() => column.toggleVisibility(false)}
        >
          Libellé
        </ColumnHeaderPopover>
      )
    },
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ row }) => <div>{row.getValue('label')}</div>,
  }),
  columnHelper.accessor((row) => row.ht, {
    id: 'ht',
    header: ({ column }) => {
      const { openFilter } = useFilterContext()
      return (
        <ColumnHeaderPopover
          columnId="ht"
          currentSort={column.getIsSorted() || null}
          onSort={(direction) => column.toggleSorting(direction === 'desc')}
          onFilter={() => openFilter('ht')}
          onHide={() => column.toggleVisibility(false)}
        >
          Prix HT
        </ColumnHeaderPopover>
      )
    },
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ row }) => {
      const ht = row.getValue<number>('ht')
      return (
        <span className="tabular-nums tracking-tighter text-right w-full">
          {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(ht)}
        </span>
      )
    },
  }),
  columnHelper.accessor((row) => row.tva, {
    id: 'tva',
    header: ({ column }) => {
      const { openFilter } = useFilterContext()
      return (
        <ColumnHeaderPopover
          columnId="tva"
          currentSort={column.getIsSorted() || null}
          onSort={(direction) => column.toggleSorting(direction === 'desc')}
          onFilter={() => openFilter('tva')}
          onHide={() => column.toggleVisibility(false)}
        >
          TVA
        </ColumnHeaderPopover>
      )
    },
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ row }) => {
      const tva = row.getValue<ArticleTVA>('tva')
      return (
        <div
          className={cn(
            'flex items-center gap-2 py-0.5 px-1.5 rounded-xl text-[12px] shadow-xs font-medium border max-w-fit',
            LABEL_STYLES_MAP[tva.color as TW_COLOR],
          )}
        >
          {tva.name}
        </div>
      )
    },
  }),
  columnHelper.accessor((row) => row.ttc, {
    id: 'ttc',
    header: ({ column }) => {
      const { openFilter } = useFilterContext()
      return (
        <ColumnHeaderPopover
          columnId="ttc"
          currentSort={column.getIsSorted() || null}
          onSort={(direction) => column.toggleSorting(direction === 'desc')}
          onFilter={() => openFilter('ttc')}
          onHide={() => column.toggleVisibility(false)}
        >
          Prix TTC
        </ColumnHeaderPopover>
      )
    },
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ row }) => {
      const ttc = row.getValue<number>('ttc')
      return (
        <span className="tabular-nums tracking-tighter text-right w-full">
          {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(ttc)}
        </span>
      )
    },
  }),
]
