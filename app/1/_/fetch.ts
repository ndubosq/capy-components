import type { FiltersState } from '@/components/data-table-filter/core/types'
import {
  dateFilterFn,
  multiOptionFilterFn,
  numberFilterFn,
  optionFilterFn,
  textFilterFn,
} from '@/components/data-table-filter/lib/filter-fns'
import { ISSUE_LABELS, ISSUE_STATUSES, USERS, generateIssues } from './data'
import type { Issue } from './types'
import { sleep } from './utils'

const ISSUES_COUNT = process.env.NODE_ENV === 'production' ? 30000 : 1000
const ISSUES = generateIssues(ISSUES_COUNT)
const SLEEP = 150

export async function fetchIssues(filters?: FiltersState) {
  await sleep(SLEEP)

  if (!filters || filters.length === 0) return ISSUES

  // Apply filters using AND logic
  // You can use a provided filterFn function from '@/components/data-table-filter/lib/filter-fns
  const filteredIssues = ISSUES.filter((issue) => {
    return filters.every((filter) => {
      const columnId = filter.columnId as keyof Issue

      if (filter.type === 'text') {
        const value = issue[columnId] as string | undefined
        if (!value) return false
        return textFilterFn(value, filter)
      }

      if (filter.type === 'option') {
        const value = (issue[columnId] as any)?.id as string | undefined
        if (!value) return false
        return optionFilterFn(value, filter)
      }

      if (filter.type === 'multiOption') {
        const value = ((issue[columnId] as any) ?? []).map(
          (l: any) => l.id,
        ) as string[]
        if (!value) return false
        return multiOptionFilterFn(value, filter)
      }

      if (filter.type === 'date') {
        const value = issue[columnId] as Date | undefined
        if (!value) return false
        return dateFilterFn(value, filter)
      }

      if (filter.type === 'number') {
        const value = issue[columnId] as number | undefined
        if (!value) return false
        return numberFilterFn(value, filter)
      }

      throw new Error(`Unknown filter type: ${filter.type}`)
    })
  })

  return filteredIssues
}

export async function fetchLabels() {
  await sleep(SLEEP)
  return ISSUE_LABELS
}

export async function fetchUsers() {
  await sleep(SLEEP)
  return USERS
}

export async function fetchStatuses() {
  await sleep(SLEEP)
  return ISSUE_STATUSES
}

export async function fetchFacetedLabels() {
  const map = new Map<string, number>()

  for (const label of ISSUE_LABELS) {
    map.set(label.id, 0)
  }

  for (const issue of ISSUES) {
    const labelIds = issue.labels?.map((l) => l.id) ?? []

    for (const labelId of labelIds) {
      const curr = map.get(labelId) ?? 0
      map.set(labelId, curr + 1)
    }
  }

  return map
}

export async function fetchFacetedStatuses() {
  const map = new Map<string, number>()

  for (const status of ISSUE_STATUSES) {
    map.set(status.id, 0)
  }

  for (const issue of ISSUES) {
    const statusId = issue.status.id
    const curr = map.get(statusId) ?? 0
    map.set(statusId, curr + 1)
  }

  return map
}

export async function fetchFacetedUsers() {
  const map = new Map<string, number>()

  for (const user of USERS) {
    map.set(user.id, 0)
  }

  for (const issue of ISSUES) {
    const userId = issue.assignee?.id ?? ''
    const curr = map.get(userId) ?? 0
    map.set(userId, curr + 1)
  }

  return map
}

export async function fetchFacetedHours(): Promise<[number, number]> {
  return ISSUES.reduce(
    (acc, issue) => {
      const hours = issue.estimatedHours
      if (hours === undefined) return acc
      return [Math.min(acc[0], hours), Math.max(acc[1], hours)]
    },
    [0, 0],
  )
}
