"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowDownIcon, ArrowUpIcon, FilterIcon, EyeOffIcon, ChevronDownCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ColumnHeaderPopoverProps {
  children: React.ReactNode
  columnId: string
  enableSorting?: boolean
  enableFiltering?: boolean
  enableHiding?: boolean
  onSort?: (direction: 'asc' | 'desc' | null) => void
  onFilter?: () => void
  onHide?: () => void
  currentSort?: 'asc' | 'desc' | null
}

export function ColumnHeaderPopover({
  children,
  columnId,
  enableSorting = true,
  enableFiltering = true,
  enableHiding = true,
  onSort,
  onFilter,
  onHide,
  currentSort,
}: ColumnHeaderPopoverProps) {
  const [open, setOpen] = React.useState(false)

  const handleSort = (direction: 'asc' | 'desc') => {
    // If the same direction is clicked again, remove the sort
    const newDirection = currentSort === direction ? null : direction
    onSort?.(newDirection)
    setOpen(false)
  }

  const handleFilter = () => {
    onFilter?.()
    setOpen(false)
  }

  const handleHide = () => {
    onHide?.()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-full rounded-none w-full p-0 cursor-pointer font-medium justify-start data-[state=open]:bg-accent/50 gap-1 hover:bg-accent"
        >
          <ChevronDownCircle className="h-3.5 w-3.5" />
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        <div className="space-y-1">
          {enableFiltering && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-7 px-2 font-medium"
              onClick={handleFilter}
            >
              <FilterIcon className="h-3.5 w-3.5" />
              Filtrer
            </Button>
          )}
          {enableSorting && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 h-7 px-2 font-medium",
                  currentSort === 'asc' && "bg-accent"
                )}
                onClick={() => handleSort('asc')}
              >
                <ArrowUpIcon className="h-3.5 w-3.5" />
                Trier par ordre croissant
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2 h-7 px-2 font-medium",
                  currentSort === 'desc' && "bg-accent"
                )}
                onClick={() => handleSort('desc')}
              >
                <ArrowDownIcon className="h-3.5 w-3.5" />
                Trier par ordre décroissant
              </Button>
            </>
          )}
          {enableHiding && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-7 px-2 font-medium"
              onClick={handleHide}
            >
              <EyeOffIcon className="h-3.5 w-3.5" />
              Masquer la colonne
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}