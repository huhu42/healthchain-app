'use client'

import { useState, useEffect } from 'react'
import { Activity, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { whoopApi } from '../lib/whoopApi'

export const WhoopSyncButton = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check connection status on mount
    setIsConnected(whoopApi.isAuthenticated())
    
    // Check for last sync from localStorage
    const lastSyncStr = localStorage.getItem('whoop_last_sync')
    if (lastSyncStr) {
      setLastSync(new Date(lastSyncStr))
    }
  }, [])

  const handleConnect = () => {
    const authUrl = whoopApi.getAuthUrl()
    window.location.href = authUrl
  }

  const handleSync = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Import dynamically to avoid SSR issues
      const { whoopApi } = await import('../lib/whoopApi')
      
      if (!whoopApi.isAuthenticated()) {
        handleConnect()
        return
      }

      // Trigger sync (this will be handled by the parent component)
      // For now, we'll just update the last sync time
      const now = new Date()
      setLastSync(now)
      localStorage.setItem('whoop_last_sync', now.toISOString())
      
      // Emit custom event for parent components to handle
      window.dispatchEvent(new CustomEvent('whoop-sync-requested'))
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    whoopApi.logout()
    setIsConnected(false)
    setLastSync(null)
    localStorage.removeItem('whoop_last_sync')
  }

  const formatLastSync = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (isConnected) {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleSync}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: isLoading 
              ? 'rgba(34, 197, 94, 0.5)' 
              : 'rgba(34, 197, 94, 0.1)',
            color: '#15803d',
            borderRadius: '24px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '120px',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              (e.target as HTMLElement).style.background = 'rgba(34, 197, 94, 0.2)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              (e.target as HTMLElement).style.background = 'rgba(34, 197, 94, 0.1)'
            }
          }}
        >
          {isLoading ? (
            <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
          ) : (
            <CheckCircle style={{ width: '16px', height: '16px' }} />
          )}
          <span>
            {isLoading ? 'Syncing...' : 'WHOOP Connected'}
          </span>
        </button>
        
        {lastSync && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '4px',
            fontSize: '11px',
            color: '#6b7280',
            whiteSpace: 'nowrap'
          }}>
            Last sync: {formatLastSync(lastSync)}
          </div>
        )}
        
        <button
          onClick={handleDisconnect}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '20px',
            height: '20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1
          }}
          title="Disconnect WHOOP"
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
      <button
        onClick={handleConnect}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#1d4ed8',
          borderRadius: '24px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '120px',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.background = 'rgba(59, 130, 246, 0.2)'
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.background = 'rgba(59, 130, 246, 0.1)'
        }}
      >
        <Activity style={{ width: '16px', height: '16px' }} />
        <span>Connect WHOOP</span>
      </button>
      

    </div>
  )
}


