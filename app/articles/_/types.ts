import type { LucideIcon } from 'lucide-react'

export type Article = {
  id: string
  code: string
  state: ArticleState
  label: string
  content?: string
  ht: number
  tva: ArticleTVA
  ttc: number
}

export type ArticleState = {
  id: 'active' | 'inactive' | 'draft'
  name: string
  icon: LucideIcon
  color: string
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
  color: string
}
