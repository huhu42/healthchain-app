'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Heart, Target, TrendingUp, Shield, Globe } from 'lucide-react'
import { ConnectButton } from './ConnectButton'
import { WhoopSyncButton } from './WhoopSyncButton'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
    { id: 'health', label: 'Health Data', icon: Heart, path: '/health' },
    { id: 'rewards', label: 'Rewards', icon: Globe, path: '/rewards' },
    { id: 'privacy', label: 'Privacy', icon: Shield, path: '/privacy' },
  ]

  const getActiveTab = () => {
    if (!pathname || pathname === '/' || pathname === '/dashboard') return 'dashboard'
    return pathname.slice(1) // Remove leading slash
  }

  const activeTab = getActiveTab()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
                <Heart style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>HealthChain ⚡</h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '24px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                <span style={{ fontSize: '14px', color: '#15803d', fontWeight: '500' }}>Flow Connected</span>
              </div>
              <WhoopSyncButton />
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ background: 'rgba(255, 255, 255, 0.1)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px 0' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => router.push(tab.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'transparent',
                    color: 'white',
                    fontWeight: '500',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: isActive ? 'blur(10px)' : 'none',
                    boxShadow: isActive ? '0 4px 16px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  <Icon style={{ width: '16px', height: '16px' }} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ background: 'rgba(255, 255, 255, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.2)', marginTop: '64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
            Powered by <span style={{ fontWeight: '600' }}>Flow Blockchain</span> • <span style={{ fontWeight: '600' }}>The Graph Protocol</span> • <span style={{ fontWeight: '600' }}>Coinbase</span> • <span style={{ fontWeight: '600' }}>x402</span>
          </p>
        </div>
      </footer>
    </div>
  )
}