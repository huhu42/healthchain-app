'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import * as fcl from '@onflow/fcl'
import * as types from '@onflow/types'

// Configure FCL
fcl.config({
  'app.detail.title': 'HealthChain',
  'app.detail.icon': 'https://fcl-discovery.onflow.org/images/blocto.png',
  'accessNode.api': process.env.NODE_ENV === 'production' 
    ? 'https://rest-testnet.onflow.org'
    : 'http://localhost:8888',
  'discovery.wallet': process.env.NODE_ENV === 'production'
    ? 'https://fcl-discovery.onflow.org/testnet/authn'
    : 'https://fcl-discovery.onflow.org/local/authn',
  'flow.network': process.env.FLOW_NETWORK || 'testnet'
})

interface FlowUser {
  addr?: string
  cid?: string
  loggedIn: boolean
}

interface FlowContextType {
  user: FlowUser
  login: () => Promise<void>
  logout: () => void
  executeTransaction: (cadence: string, args?: any[]) => Promise<string>
  executeScript: (cadence: string, args?: any[]) => Promise<any>
  isLoading: boolean
}

const FlowContext = createContext<FlowContextType | undefined>(undefined)

export const useFlow = () => {
  const context = useContext(FlowContext)
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider')
  }
  return context
}

interface FlowProviderProps {
  children: ReactNode
}

export const FlowProvider: React.FC<FlowProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FlowUser>({ loggedIn: false })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser)
    return () => unsubscribe()
  }, [])

  const login = async () => {
    setIsLoading(true)
    try {
      await fcl.authenticate()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    fcl.unauthenticate()
  }

  const executeTransaction = async (cadence: string, args: any[] = []): Promise<string> => {
    setIsLoading(true)
    try {
      const transactionId = await fcl.mutate({
        cadence,
        args: (_arg: any, _t: any) => args,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 1000
      })

      const transaction = await fcl.tx(transactionId).onceSealed()
      return transaction.transactionId
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const executeScript = async (cadence: string, args: any[] = []): Promise<any> => {
    try {
      const result = await fcl.query({
        cadence,
        args: (_arg: any, _t: any) => args
      })
      return result
    } catch (error) {
      console.error('Script execution failed:', error)
      throw error
    }
  }

  const value: FlowContextType = {
    user,
    login,
    logout,
    executeTransaction,
    executeScript,
    isLoading
  }

  return (
    <FlowContext.Provider value={value}>
      {children}
    </FlowContext.Provider>
  )
}