'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Shield, Zap } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, authenticated, user } = usePrivy()

  // Redirect to dashboard if already authenticated
  if (authenticated && user) {
    router.push('/dashboard')
    return null
  }

  const handlePrivyLogin = async () => {
    setIsLoading(true)
    
    try {
      // Use Privy to login - it will handle email input
      await login()
      setIsLoading(false)
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'rgba(255, 255, 255, 0.2)', 
          borderRadius: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 32px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <Heart style={{ width: '40px', height: '40px', color: 'white' }} />
        </div>

        {/* Main Title */}
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: 'white', 
          margin: '0 0 16px 0',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          Welcome to HealthChain
        </h1>

        {/* Subtitle */}
        <p style={{ 
          fontSize: '20px', 
          color: 'rgba(255, 255, 255, 0.9)', 
          margin: '0 0 48px 0',
          lineHeight: '1.5'
        }}>
          A place where you complete health quests to earn rewards
        </p>

        {/* Privy Login Button */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <button
            onClick={handlePrivyLogin}
            disabled={isLoading}
            style={{
              padding: '20px 40px',
              borderRadius: '16px',
              border: 'none',
              background: isLoading 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'linear-gradient(135deg, #00d4aa 0%, #0099cc 100%)',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: isLoading ? 'none' : '0 8px 24px rgba(0, 212, 170, 0.3)',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 12px 32px rgba(0, 212, 170, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)'
              ;(e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 212, 170, 0.3)'
            }}
          >
            {isLoading ? (
              <>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  border: '2px solid rgba(255,255,255,0.3)', 
                  borderTop: '2px solid white', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }}></div>
                Connecting...
              </>
            ) : (
              <>
                <Zap style={{ width: '24px', height: '24px' }} />
                Connect with Privy
              </>
            )}
          </button>
          
          {/* Privy Features */}
          <div style={{ 
            marginTop: '24px', 
            padding: '20px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Shield style={{ width: '16px', height: '16px', color: '#00d4aa' }} />
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
                Powered by Privy
              </span>
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', lineHeight: '1.4' }}>
              Secure, passwordless authentication with email verification. 
              No wallet setup required - just sign in with your email.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}