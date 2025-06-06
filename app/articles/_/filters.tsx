import { createColumnConfigHelper } from '@/components/data-table-filter/core/filters'
import {
  CircleDotDashedIcon,
  EuroIcon,
  Heading1Icon,
  PercentIcon,
  TagsIcon,
} from 'lucide-react'

import type { Article } from './types'

const dtf = createColumnConfigHelper<Article>()

export const columnsConfig = [
  dtf
    .text()
    .id('code')
    .accessor((row) => row.code)
    .displayName('Code')
    .icon(Heading1Icon)
    .build(),
  dtf
    .option()
    .accessor((row) => row.state.id)
    .id('state')
    .displayName('State')
    .icon(CircleDotDashedIcon)
    .build(),
  dtf
    .text()
    .accessor((row) => row.label)
    .id('label')
    .displayName('Label')
    .icon(Heading1Icon)
    .build(),
  dtf
    .number()
    .accessor((row) => row.ht)
    .id('ht')
    .displayName('HT')
    .icon(EuroIcon)
    .min(0)
    .max(1000)
    .build(),
  dtf
    .option()
    .accessor((row) => row.tva.id)
    .id('tva')
    .displayName('TVA')
    .icon(PercentIcon)
    .build(),
  dtf
    .number()
    .accessor((row) => row.ttc)
    .id('ttc')
    .displayName('TTC')
    .icon(EuroIcon)
    .min(0)
    .max(1000)
    .build(),
] as const
