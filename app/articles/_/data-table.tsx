import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { DataTableFilterActions } from '@/components/data-table-filter/core/types'
import { type Table as TanStackTable, flexRender } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, CircleDotDashed, XIcon } from 'lucide-react'
import { Article } from './types'

export function DataTable({
  table,
  actions,
}: { table: TanStackTable<Article>; actions?: DataTableFilterActions }) {
  return (
    <>
      <div className="border w-full [&>div]:max-h-[calc(100vh-150px)]">
        <Table className="border-separate border-spacing-0 [&_td]:border-border [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="sticky top-0 z-10 bg-background hover:bg-background">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="h-12"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="h-12" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-[calc(var(--spacing)*12*10)]"
                >
                  <div className="flex flex-col items-center justify-center gap-8">
                    <CircleDotDashed className="size-24 stroke-muted-foreground" />
                    <div className="flex flex-col gap-4 text-center font-[450]">
                      <span>Aucun résultat trouvé.</span>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-muted-foreground">
                          Ajustez ou effacez les filtres pour afficher les données.
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn('gap-1', !actions && 'hidden')}
                          onClick={actions?.removeAllFilters}
                        >
                          <XIcon className="text-muted-foreground" />
                          Effacer les filtres
                        </Button>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground tabular-nums">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <>
              {table.getFilteredSelectedRowModel().rows.length === 1 ? '1 sélectionné' : `${table.getFilteredSelectedRowModel().rows.length} sélectionnés`} sur{' '}
            </>
          )}
          <span className="text-primary font-medium">
            {table.getCoreRowModel().rows.length === 1 ? '1 résultat' : `${table.getCoreRowModel().rows.length} résultats`}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
