'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface Web3ContextType {
  coinbase: any | null
  isConnected: boolean
  walletAddress: string | null
  balance: number
  initializeCoinbase: () => Promise<void>
  sendPayment: (amount: number, recipient: string) => Promise<string>
  setupX402Payment: (goalId: string, amount: number) => Promise<string>
  isLoading: boolean
  error: string | null
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

interface Web3ProviderProps {
  children: ReactNode
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [coinbase, setCoinbase] = useState<any | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializeCoinbase = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // For now, we'll use a mock implementation since Coinbase SDK requires server-side
      // In production, this would call an API route that uses the Coinbase SDK
      console.log('Initializing Coinbase connection (mock mode for development)')
      
      // Mock wallet connection
      const mockWalletAddress = '0x' + Math.random().toString(16).substring(2, 42)
      
      // Mock Coinbase instance
      const mockCoinbase = {
        apiKey: process.env.NEXT_PUBLIC_COINBASE_API_KEY,
        connected: true,
        mockMode: true
      }
      
      setCoinbase(mockCoinbase)
      setIsConnected(true)
      setWalletAddress(mockWalletAddress)
      setBalance(100.0) // Mock balance
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize Coinbase')
      console.error('Coinbase initialization failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const sendPayment = async (amount: number, recipient: string): Promise<string> => {
    if (!coinbase) {
      throw new Error('Coinbase not initialized')
    }

    setIsLoading(true)
    try {
      // Mock transaction for now - in production this would use the actual Coinbase SDK via API route
      console.log(`Sending ${amount} to ${recipient}`)
      const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update local balance
      setBalance(prev => prev - amount)
      
      return transactionId
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  const setupX402Payment = async (goalId: string, amount: number): Promise<string> => {
    setIsLoading(true)
    try {
      // Mock x402 payment setup - this would integrate with the x402 protocol
      const paymentSetup = {
        goalId,
        amount,
        payer: walletAddress,
        protocol: 'x402',
        automate: true,
        conditions: {
          trigger: 'goal_completion',
          verification: 'health_data_oracle'
        }
      }

      // Simulate x402 API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const paymentId = `x402_${goalId}_${Date.now()}`
      
      console.log('X402 payment setup:', paymentSetup)
      
      return paymentId
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'X402 setup failed')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Auto-initialize on component mount if we have API key
    if (process.env.NEXT_PUBLIC_COINBASE_API_KEY) {
      initializeCoinbase()
    }
  }, [])

  const value: Web3ContextType = {
    coinbase,
    isConnected,
    walletAddress,
    balance,
    initializeCoinbase,
    sendPayment,
    setupX402Payment,
    isLoading,
    error
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}