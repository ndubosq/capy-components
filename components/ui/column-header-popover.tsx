"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowDownIcon, ArrowUpIcon, FilterIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ColumnHeaderPopoverProps {
  children: React.ReactNode
  columnId: string
  enableSorting?: boolean
  enableFiltering?: boolean
  onSort?: (direction: 'asc' | 'desc') => void
  onFilter?: () => void
  currentSort?: 'asc' | 'desc' | null
}

export function ColumnHeaderPopover({
  children,
  columnId,
  enableSorting = true,
  enableFiltering = true,
  onSort,
  onFilter,
  currentSort,
}: ColumnHeaderPopoverProps) {
  const [open, setOpen] = React.useState(false)

  const handleSort = (direction: 'asc' | 'desc') => {
    onSort?.(direction)
    setOpen(false)
  }

  const handleFilter = () => {
    onFilter?.()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 font-medium justify-start hover:bg-transparent data-[state=open]:bg-accent/50"
        >
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        <div className="space-y-1">
          {enableFiltering && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-8 px-2 text-sm font-normal"
              onClick={handleFilter}
            >
              <FilterIcon className="h-4 w-4" />
              Filter
            </Button>
          )}
          {enableSorting && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 h-8 px-2 text-sm font-normal",
                  currentSort === 'asc' && "bg-accent"
                )}
                onClick={() => handleSort('asc')}
              >
                <ArrowUpIcon className="h-4 w-4" />
                Trier par ordre croissant
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 h-8 px-2 text-sm font-normal",
                  currentSort === 'desc' && "bg-accent"
                )}
                onClick={() => handleSort('desc')}
              >
                <ArrowDownIcon className="h-4 w-4" />
                Trier par ordre décroissant
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
} 