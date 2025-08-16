'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FlowProvider } from '../contexts/FlowContext'
import { HealthDataProvider } from '../contexts/HealthDataContext'
import { Web3Provider } from '../contexts/Web3Context'
import { HypergraphProvider } from './hypergraph/providers/HypergraphProvider'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <FlowProvider>
          <HealthDataProvider>
            <HypergraphProvider>
              {children}
            </HypergraphProvider>
          </HealthDataProvider>
        </FlowProvider>
      </Web3Provider>
    </QueryClientProvider>
  )
}