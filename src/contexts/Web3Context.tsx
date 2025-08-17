'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { ethers } from 'ethers'

interface Web3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  isConnected: boolean
  walletAddress: string | null
  balance: string
  walletId: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  sendPayment: (amount: number, recipient: string) => Promise<string>
  setupX402Payment: (goalId: string, amount: number, conditions?: any) => Promise<string>
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

// Initialize Coinbase Wallet SDK
const APP_NAME = 'GamifiedHealth'
const APP_LOGO_URL = 'https://example.com/logo.png' // Replace with your logo
const DEFAULT_ETH_JSONRPC_URL = 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
const DEFAULT_CHAIN_ID = 1

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState('0')
  const [walletId, setWalletId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateBalance = useCallback(async (address: string, provider: ethers.BrowserProvider) => {
    try {
      const balanceWei = await provider.getBalance(address)
      const balanceEth = ethers.formatEther(balanceWei)
      setBalance(balanceEth)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }, [])

  const connectWallet = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Initialize Coinbase Wallet SDK
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL
      })

      // Create provider
      const ethereum = coinbaseWallet.makeWeb3Provider()
      
      // Request account access
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[]

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Create ethers provider and signer
      const ethersProvider = new ethers.BrowserProvider(ethereum)
      const ethersSigner = await ethersProvider.getSigner()
      
      const address = accounts[0]
      
      setProvider(ethersProvider)
      setSigner(ethersSigner)
      setIsConnected(true)
      setWalletAddress(address)
      
      // Fetch balance
      await updateBalance(address, ethersProvider)

      // Create server-side wallet for advanced features
      try {
        const response = await fetch('/api/coinbase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'createWallet',
            params: {}
          })
        })

        if (response.ok) {
          const data = await response.json()
          setWalletId(data.walletId)
        }
      } catch (err) {
        console.log('Server-side wallet creation skipped:', err)
      }

      // Listen for account changes
      if (ethereum.on) {
        ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            disconnectWallet()
          } else {
            setWalletAddress(accounts[0])
            if (ethersProvider) {
              updateBalance(accounts[0], ethersProvider)
            }
          }
        })

        ethereum.on('chainChanged', () => {
          window.location.reload()
        })
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
      console.error('Wallet connection failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setIsConnected(false)
    setWalletAddress(null)
    setBalance('0')
    setWalletId(null)
    setError(null)
  }

  const sendPayment = async (amount: number, recipient: string): Promise<string> => {
    if (!signer) {
      throw new Error('Wallet not connected')
    }

    setIsLoading(true)
    try {
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount.toString())

      // Create transaction
      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountWei
      })

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      
      if (!receipt) {
        throw new Error('Transaction failed')
      }

      // Update balance after transaction
      if (walletAddress && provider) {
        await updateBalance(walletAddress, provider)
      }

      return receipt.hash
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const setupX402Payment = async (goalId: string, amount: number, conditions?: any): Promise<string> => {
    setIsLoading(true)
    try {
      if (!walletAddress) {
        throw new Error('Wallet not connected')
      }

      // For client-side, we'll create a smart contract interaction
      // that sets up automated payments through x402 protocol
      
      // For x402 protocol integration
      // This would be the actual x402 contract address on mainnet/testnet
      // const X402_CONTRACT_ADDRESS = '0x...' // Replace with actual x402 contract when available
      
      // Create x402 payment configuration
      const paymentConfig = {
        goalId,
        amount,
        payer: walletAddress,
        conditions: conditions || {
          trigger: 'goal_completion',
          verification: 'health_data_oracle',
          frequency: 'one_time'
        },
        protocol: 'x402',
        automate: true
      }

      // If we have a server-side wallet ID, use the API route for advanced features
      if (walletId) {
        const response = await fetch('/api/coinbase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'setupX402Payment',
            params: {
              walletId,
              goalId,
              amount,
              conditions: paymentConfig.conditions
            }
          })
        })

        if (!response.ok) {
          throw new Error('Failed to setup x402 payment')
        }

        const data = await response.json()
        return data.paymentId
      } else {
        // Fallback to client-side only implementation
        // In production, this would interact with x402 smart contracts
        const paymentId = `x402_client_${goalId}_${Date.now()}`
        
        console.log('X402 payment setup (client-side):', paymentConfig)
        
        // Store payment configuration locally or in smart contract
        localStorage.setItem(`x402_${paymentId}`, JSON.stringify(paymentConfig))
        
        return paymentId
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'X402 setup failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ 
            method: 'eth_accounts' 
          }) as string[]
          
          if (accounts.length > 0) {
            // Auto-connect if already authorized
            await connectWallet()
          }
        } catch (err) {
          console.log('No existing connection')
        }
      }
    }

    checkConnection()
  }, [])

  const value: Web3ContextType = {
    provider,
    signer,
    isConnected,
    walletAddress,
    balance,
    walletId,
    connectWallet,
    disconnectWallet,
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