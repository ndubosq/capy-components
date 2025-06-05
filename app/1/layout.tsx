import { Suspense } from 'react'
import QueryClientProvider from '@/app/1/_/query-client-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <NuqsAdapter>
        <Suspense>{children}</Suspense>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}