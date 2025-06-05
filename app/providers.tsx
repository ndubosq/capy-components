import { Suspense } from 'react'
import QueryClientProvider from '@/app/issues/_/query-client-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <NuqsAdapter>
        <Suspense>{children}</Suspense>
      </NuqsAdapter>
    </QueryClientProvider>
  )
}