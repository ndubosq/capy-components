import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { type Table as TanStackTable } from '@tanstack/react-table'
import { Columns3Icon, GripVertical } from 'lucide-react'
import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableColumn({ column, columnDisplayNames }: { 
  column: any, 
  columnDisplayNames: Record<string, string> 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-2"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical size={16} />
      </div>
      <Checkbox
        id={column.id}
        checked={column.getIsVisible()}
        onCheckedChange={(value) => column.toggleVisibility(!!value)}
      />
      <label
        htmlFor={column.id}
        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        {columnDisplayNames[column.id] || column.id}
      </label>
    </div>
  )
}

export function ColumnVisibility({ table }: { table: TanStackTable<any> }) {
  const columnDisplayNames: Record<string, string> = {
    select: 'Select',
    status: 'Status',
    title: 'Title',
    assignee: 'Assignee',
    estimatedHours: 'Estimated Hours',
    startDate: 'Start Date',
    endDate: 'End Date',
    labels: 'Labels',
  }

  const [columns, setColumns] = useState(() =>
    table.getAllColumns()
      .filter(column => column.getCanHide())
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newOrder = [...items]
        const [movedItem] = newOrder.splice(oldIndex, 1)
        newOrder.splice(newIndex, 0, movedItem)

        setTimeout(() => {
          // Get all non-hideable columns (like select) to preserve their position
          const nonHideableColumns = table.getAllColumns()
            .filter(column => !column.getCanHide())
            .map(col => col.id)
          
          // Combine non-hideable columns (at the start) with reordered hideable columns
          const finalOrder = [...nonHideableColumns, ...newOrder.map(col => col.id)]
          table.setColumnOrder(finalOrder)
        }, 0)
        return newOrder
      })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Columns3Icon className="h-4 w-4 mr-2" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-3">
        <div className="space-y-2">
          <div className="font-medium text-sm mb-3">Toggle Columns</div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columns}
              strategy={verticalListSortingStrategy}
            >
              {columns.map((column) => (
                <SortableColumn
                  key={column.id}
                  column={column}
                  columnDisplayNames={columnDisplayNames}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </PopoverContent>
    </Popover>
  )
}