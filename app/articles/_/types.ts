import type { LucideIcon } from 'lucide-react'

export type Article = {
  id: string
  code: string
  type: ArticleType
  state: ArticleState
  label: string
  content?: string
  ht: number
  tva: ArticleTVA
  ttc: number
}

export type ArticleType = {
  id: 'product' | 'service' | 'annotation'
  name: string
  icon: LucideIcon
}

export type ArticleState = {
  id: 'active' | 'inactive' | 'draft'
  name: string
  icon: LucideIcon
}

export type ArticleLabel = {
  id: string
  name: string
  color: string
}

export type ArticleTVA = {
  id: '20' | '10' | '5.5' | '2.1'
  name: string
  rate: number
}
