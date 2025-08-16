'use client'

import { useWeb3 } from '../contexts/Web3Context'
import { Wallet, LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'

export const ConnectButton = () => {
  const { 
    isConnected, 
    walletAddress, 
    balance, 
    connectWallet, 
    disconnectWallet,
    isLoading,
    error 
  } = useWeb3()
  
  const [showDropdown, setShowDropdown] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance: string) => {
    const numBalance = parseFloat(balance)
    if (numBalance < 0.0001) return '< 0.0001'
    return numBalance.toFixed(4)
  }

  if (isConnected && walletAddress) {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            borderRadius: '12px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = 'translateY(-2px)'
            ;(e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)'
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = 'translateY(0)'
            ;(e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)'
          }}
        >
          <Wallet style={{ width: '16px', height: '16px' }} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              {formatAddress(walletAddress)}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {formatBalance(balance)} ETH
            </div>
          </div>
        </button>

        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            padding: '8px',
            minWidth: '200px',
            zIndex: 1000
          }}>
            <div style={{
              padding: '12px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              marginBottom: '8px'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Connected to Coinbase
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                {formatAddress(walletAddress)}
              </div>
              <div style={{ fontSize: '13px', color: '#3b82f6', marginTop: '4px' }}>
                Balance: {formatBalance(balance)} ETH
              </div>
            </div>

            <button
              onClick={() => {
                disconnectWallet()
                setShowDropdown(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px 12px',
                background: 'transparent',
                color: '#ef4444',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(239, 68, 68, 0.1)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'transparent'
              }}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={connectWallet}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: isLoading 
            ? 'rgba(59, 130, 246, 0.5)' 
            : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          borderRadius: '12px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
          opacity: isLoading ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            (e.target as HTMLElement).style.transform = 'translateY(-2px)'
            ;(e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)'
          }
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = 'translateY(0)'
          ;(e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)'
        }}
      >
        {isLoading ? (
          <>
            <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
            Connecting...
          </>
        ) : (
          <>
            <Wallet style={{ width: '16px', height: '16px' }} />
            Connect Coinbase
          </>
        )}
      </button>
      
      {error && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          fontSize: '12px',
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}