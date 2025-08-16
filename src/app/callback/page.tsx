'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const state = searchParams.get('state')

        if (error) {
          setStatus('error')
          setMessage(`Authorization failed: ${error}`)
          return
        }

        if (!code) {
          setStatus('error')
          setMessage('No authorization code received')
          return
        }

        // Verify state parameter for security
        if (!state) {
          setStatus('error')
          setMessage('Missing state parameter for security verification')
          return
        }

        // Check if state matches what we stored
        const storedState = localStorage.getItem('whoop_oauth_state')
        if (state !== storedState) {
          setStatus('error')
          setMessage('Invalid state parameter - possible security issue')
          return
        }

        // Clear the stored state
        localStorage.removeItem('whoop_oauth_state')

        // Import WHOOP API dynamically
        const { whoopApi } = await import('../../lib/whoopApi')
        
        console.log('🔐 Exchanging authorization code for tokens...')
        console.log('📝 Code:', code)
        console.log('🔑 State:', state)
        
        try {
          // Exchange code for tokens
          const authResponse = await whoopApi.handleAuthCallback(code)
          console.log('✅ Token exchange successful:', authResponse)
          
          setStatus('success')
          setMessage('WHOOP connected successfully!')
          
          // Redirect back to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } catch (tokenError) {
          console.error('❌ Token exchange failed:', tokenError)
          setStatus('error')
          setMessage(`Token exchange failed: ${tokenError instanceof Error ? tokenError.message : 'Unknown error'}`)
        }
        
      } catch (err) {
        console.error('WHOOP callback error:', err)
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Failed to connect WHOOP')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        {status === 'loading' && (
          <>
            <Loader2 style={{ 
              width: '48px', 
              height: '48px', 
              color: '#3b82f6',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              Connecting to WHOOP...
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280',
              margin: 0
            }}>
              Please wait while we complete the connection
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle style={{ 
              width: '48px', 
              height: '48px', 
              color: '#22c55e',
              margin: '0 auto 20px'
            }} />
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              Success!
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280',
              margin: 0
            }}>
              {message}
            </p>
            <p style={{ 
              fontSize: '14px', 
              color: '#9ca3af',
              margin: '16px 0 0 0'
            }}>
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle style={{ 
              width: '48px', 
              height: '48px', 
              color: '#ef4444',
              margin: '0 auto 20px'
            }} />
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              Connection Failed
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280',
              margin: '0 0 20px 0'
            }}>
              {message}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = '#2563eb'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = '#3b82f6'
              }}
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
