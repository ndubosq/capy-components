import { lorem } from '@ndaidong/txtgen'
import { sub } from 'date-fns'
import {
  PackageIcon,
  WrenchIcon,
  StickyNoteIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
} from 'lucide-react'
import { nanoid } from 'nanoid'
import { randomInteger, sample } from 'remeda'
import { Article, ArticleLabel, ArticleState, ArticleType, ArticleTVA } from './types'

export const ARTICLE_TYPES: ArticleType[] = [
  {
    id: 'product',
    name: 'Product',
    icon: PackageIcon,
  },
  {
    id: 'service',
    name: 'Service',
    icon: WrenchIcon,
  },
  {
    id: 'annotation',
    name: 'Annotation',
    icon: StickyNoteIcon,
  },
] as const;


export const TVA_RATES: ArticleTVA[] = [
  {
    id: '20',
    name: '20%',
    rate: 0.2
  },
  {
    id: '10', 
    name: '10%',
    rate: 0.1
  },
  {
    id: '5.5',
    name: '5.5%', 
    rate: 0.055
  },
  {
    id: '2.1',
    name: '2.1%',
    rate: 0.021
  }
] as const;

export const ARTICLE_STATES: ArticleState[] = [
  {
    id: 'active',
    name: 'Active',
    icon: CircleCheckIcon,
  },
  {
    id: 'inactive',
    name: 'Inactive',
    icon: CircleDashedIcon,
  },
  {
    id: 'draft',
    name: 'Draft',
    icon: CircleDotIcon,
  },
] as const

export const ARTICLE_LABELS: ArticleLabel[] = [
  { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Electronics', color: 'blue' },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Clothing',
    color: 'green',
  },
  { id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: 'Food', color: 'orange' },
  { id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8', name: 'Premium', color: 'purple' },
  {
    id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
    name: 'Seasonal',
    color: 'yellow',
  },
  {
    id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
    name: 'Digital',
    color: 'pink',
  },
]

export function generateArticleCode() {
  const prefixes = ['PRD', 'SRV', 'ANN']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `${prefix}-${number}`
}

export function generateArticleLabel() {
  const productNames = [
    'Laptop Computer',
    'Wireless Headphones',
    'Smart Watch',
    'Coffee Maker',
    'Desk Chair',
    'Monitor Stand',
    'Bluetooth Speaker',
    'Tablet Device',
    'Gaming Mouse',
    'Keyboard Mechanical',
    'Phone Case',
    'Power Bank',
    'USB Cable',
    'Webcam HD',
    'Microphone USB',
    'Printer Inkjet',
    'Scanner Document',
    'Hard Drive External',
    'Memory Card',
    'Router Wireless',
  ]
  
  const serviceNames = [
    'Technical Support',
    'Installation Service',
    'Maintenance Contract',
    'Training Session',
    'Consultation Hour',
    'Design Service',
    'Data Migration',
    'System Setup',
    'Repair Service',
    'Warranty Extension',
    'Cloud Storage',
    'Backup Service',
    'Security Audit',
    'Performance Optimization',
    'Custom Development',
  ]

  const annotationNames = [
    'Special Handling Required',
    'Fragile Item',
    'Express Delivery',
    'Gift Wrapping',
    'Extended Warranty',
    'Bulk Discount Available',
    'Limited Edition',
    'Discontinued Item',
    'Pre-order Item',
    'Digital Download',
  ]

  const allNames = [...productNames, ...serviceNames, ...annotationNames]
  return allNames[Math.floor(Math.random() * allNames.length)]
}

export function generateSampleArticle(): Article {
  const code = generateArticleCode()
  const label = generateArticleLabel()
  const content = Math.random() > 0.3 ? lorem(2, 6) : undefined

  const [type] = sample(ARTICLE_TYPES, 1)
  if (!type) throw new Error('No article type found')

  const [state] = sample(ARTICLE_STATES, 1)
  if (!state) throw new Error('No article state found')

  // Generate realistic prices
  const basePrice = randomInteger(10, 1000)
  const ht = Math.round(basePrice * 100) / 100
  const tvaRate = sample(TVA_RATES, 1)
  if (!tvaRate) throw new Error('No TVA rate found')
  const tva = tvaRate[randomInteger(0, tvaRate.length - 1)]
  const ttc = Math.round((ht + ht * tva.rate) * 100) / 100

  return {
    id: nanoid(),
    code,
    type,
    state,
    label,
    content,
    ht,
    tva,
    ttc,
  }
}

export function generateArticles(count: number) {
  const arr: Article[] = []

  for (let i = 0; i < count; i++) {
    arr.push(generateSampleArticle())
  }

  return arr
}
