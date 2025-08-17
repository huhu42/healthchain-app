'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrivyProvider } from '@privy-io/react-auth'
import { FlowProvider } from '../contexts/FlowContext'
import { HealthDataProvider } from '../contexts/HealthDataContext'
import { Web3Provider } from '../contexts/Web3Context'
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
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clt1234567890'}
        config={{
          loginMethods: ['email'],
          appearance: {
            theme: 'dark',
            accentColor: '#00d4aa',
            showWalletLoginFirst: false,
          },
        }}
      >
        <Web3Provider>
          <FlowProvider>
            <HealthDataProvider>
              {children}
            </HealthDataProvider>
          </FlowProvider>
        </Web3Provider>
      </PrivyProvider>
    </QueryClientProvider>
  )
}