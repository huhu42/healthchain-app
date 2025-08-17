'use client'

// import { motion } from 'framer-motion'
import { Heart, Target, TrendingUp, DollarSign, Users, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useHealthData } from '../contexts/HealthDataContext'
import { useWeb3 } from '../contexts/Web3Context'
import { usePrivy } from '@privy-io/react-auth'
import { Card } from './ui'

// Utility function to convert data to CSV
const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvRows = [headers.join(',')]
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      return typeof value === 'string' ? `"${value}"` : value
    })
    csvRows.push(values.join(','))
  }
  
  return csvRows.join('\n')
}

export const DashboardOverview = () => {
  const { healthMetrics, goals } = useHealthData()
  const { balance } = useWeb3()
  const { authenticated, user: privyUser, logout: privyLogout } = usePrivy()
  const [whoopConnected, setWhoopConnected] = useState(false)

  // Check WHOOP connection status
  useEffect(() => {
    const checkWhoopConnection = async () => {
      try {
        const { default: whoopApi } = await import('../lib/whoopApi')
        setWhoopConnected(whoopApi.isAuthenticated())
      } catch (error) {
        console.error('Failed to check WHOOP connection:', error)
        setWhoopConnected(false)
      }
    }
    
    checkWhoopConnection()
  }, [])

  // Only show data if WHOOP is connected
  const hasWhoopConnection = whoopConnected
  const hasPrivyConnection = authenticated

  // Start with 0 goals until connections are made
  const activeGoals = hasWhoopConnection ? goals.filter(g => g.status === 'active') : []
  const completedGoals = hasWhoopConnection ? goals.filter(g => g.status === 'completed') : []
  const totalRewardsEarned = hasWhoopConnection ? completedGoals.reduce((sum, goal) => sum + goal.reward, 0) : 0

  // For testing: show some mock data when WHOOP is connected
  const recentMetrics = hasWhoopConnection ? healthMetrics.slice(0, 5) : []
  
  // Debug logging
  console.log('🔍 Dashboard Debug Info:', {
    hasWhoopConnection,
    healthMetricsLength: healthMetrics.length,
    recentMetricsLength: recentMetrics.length,
    whoopConnected,
    healthMetrics: healthMetrics.slice(0, 2) // Log first 2 items
  })

  const stats = [
    {
      label: 'Active Goals',
      value: activeGoals.length,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Completed Goals',
      value: completedGoals.length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Total Rewards',
      value: `$${totalRewardsEarned.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Wallet Balance',
      value: `${typeof balance === 'string' ? balance : balance.toFixed(2)} ETH`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Header */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.15)', 
        borderRadius: '20px', 
        padding: '32px', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: 'white', margin: '0 0 8px 0' }}>
          Welcome to GamifiedHealth
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px', margin: '0 0 24px 0' }}>
          {hasPrivyConnection 
            ? `Welcome back, ${privyUser?.email?.address || 'User'}!`
            : 'Track your health, earn rewards, and take control of your data'
          }
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: whoopConnected ? '#22c55e' : '#ef4444',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{ fontSize: '14px', color: 'white' }}>WHOOP {whoopConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: '#ef4444',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{ fontSize: '14px', color: 'white' }}>Coinbase Disconnected</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Only show if WHOOP is connected */}
      {hasWhoopConnection ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px'
        }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const iconColors = {
              'text-blue-600': '#2563eb',
              'text-green-600': '#16a34a', 
              'text-purple-600': '#9333ea',
              'text-yellow-600': '#ca8a04'
            }
            const bgColors = {
              'bg-blue-100': 'rgba(59, 130, 246, 0.1)',
              'bg-green-100': 'rgba(34, 197, 94, 0.1)',
              'bg-purple-100': 'rgba(147, 51, 234, 0.1)',
              'bg-yellow-100': 'rgba(234, 179, 8, 0.1)'
            }
            
            return (
              <div 
                key={stat.label}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '16px',
                  padding: '24px',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '0 0 8px 0' }}>{stat.label}</p>
                    <p style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{stat.value}</p>
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: '12px', 
                    background: bgColors[stat.bgColor] || 'rgba(255, 255, 255, 0.1)'
                  }}>
                    <Icon style={{ width: '24px', height: '24px', color: iconColors[stat.color] || 'white' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
                        ) : (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '20px',
                      padding: '48px',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      textAlign: 'center'
                    }}>
                      {/* <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
                        Add a Health Quest
                      </h3> */}
                      <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', margin: '0 0 24px 0' }}>
                        Start your health journey by creating personalized goals and challenges
                      </p>
                      
                      {/* Pre-populated Goals */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)'
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)'
                        }}
                        onClick={() => {
                          // Add steps goal
                          console.log('Adding steps goal')
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>👟</span>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                              <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                                Daily Steps Challenge
                              </h4>
                              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                                Walk 10,000 steps every day for a week
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)'
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)'
                        }}
                        onClick={() => {
                          // Add sleep goal
                          console.log('Adding sleep goal')
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>😴</span>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                              <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                                Sleep Quality Goal
                              </h4>
                              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                                Get 8+ hours of quality sleep for 5 consecutive nights
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={async () => {
                          try {
                            console.log('🔄 Starting WHOOP data sync...')
                            
                            // Import and use WHOOP API
                            const { default: whoopApi } = await import('../lib/whoopApi')
                            console.log('📦 WHOOP API imported successfully:', whoopApi)
                            
                            // Check if authenticated
                            if (!whoopApi.isAuthenticated()) {
                              console.log('🔐 WHOOP not authenticated, redirecting to OAuth...')
                              window.location.href = whoopApi.getAuthUrl()
                              return
                            }
                            
                            console.log('✅ WHOOP is authenticated, proceeding with data fetch...')
                            
                            // Fetch latest data
                            console.log('📊 Fetching WHOOP health data...')
                            const healthData = await whoopApi.getAllHealthData(7) // Last 7 days
                            
                            // Log the raw data
                            console.log('📈 WHOOP Raw Data:', healthData)
                            console.log('📊 Data type:', typeof healthData)
                            console.log('📊 Data length:', Array.isArray(healthData) ? healthData.length : 'Not an array')
                            
                            if (healthData && Array.isArray(healthData) && healthData.length > 0) {
                              // Save data as JSON
                              const dataBlob = new Blob([JSON.stringify(healthData, null, 2)], { type: 'application/json' })
                              const url = URL.createObjectURL(dataBlob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `whoop-health-data-${new Date().toISOString().split('T')[0]}.json`
                              a.click()
                              URL.revokeObjectURL(url)
                              
                              // Also save as CSV
                              const csvData = convertToCSV(healthData)
                              const csvBlob = new Blob([csvData], { type: 'text/csv' })
                              const csvUrl = URL.createObjectURL(csvBlob)
                              const csvA = document.createElement('a')
                              csvA.href = csvUrl
                              csvA.download = `whoop-health-data-${new Date().toISOString().split('T')[0]}.csv`
                              csvA.click()
                              URL.revokeObjectURL(csvUrl)
                              
                              console.log('💾 Data saved as JSON and CSV files')
                              
                                                          // Update WHOOP connection status
                            setWhoopConnected(true)
                            console.log('✅ WHOOP connection status updated')
                            
                            // Force a page refresh to show the new data
                            console.log('🔄 Refreshing page to show new data...')
                            window.location.reload()
                            } else {
                              console.log('⚠️ No health data received from WHOOP')
                            }
                            
                          } catch (error) {
                            console.error('❌ WHOOP sync failed:', error)
                            console.error('❌ Error details:', error.message)
                            console.error('❌ Error stack:', error.stack)
                          }
                        }}
                        style={{
                          padding: '16px 32px',
                          borderRadius: '16px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #00d4aa 0%, #0099cc 100%)',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          margin: '0 auto',
                          boxShadow: '0 8px 24px rgba(0, 212, 170, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                          ;(e.target as HTMLElement).style.boxShadow = '0 12px 32px rgba(0, 212, 170, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.transform = 'translateY(0)'
                          ;(e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 212, 170, 0.3)'
                        }}
                      >
                        <div style={{ 
                          width: '20px', 
                          height: '20px', 
                          background: 'white', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          color: '#00d4aa',
                          fontWeight: 'bold'
                        }}>W</div>
                        <span>Connect WHOOP</span>
                      </button>
                    </div>
                  )}

      {/* Content Row - Side by Side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                              {/* Recent Health Metrics */}
                      <div style={{ 
                        background: 'rgba(255, 255, 255, 0.15)', 
                        borderRadius: '16px', 
                        padding: '24px', 
                        backdropFilter: 'blur(20px)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                      }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
                          Recent Health Data
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {recentMetrics.length > 0 ? (
                            recentMetrics.slice(0, 3).map((metric) => (
                              <div key={metric.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ 
                                    width: '8px', 
                                    height: '8px', 
                                    borderRadius: '50%', 
                                    background: metric.type === 'sleep' ? '#8b5cf6' :
                                               metric.type === 'steps' ? '#10b981' :
                                               metric.type === 'heart_rate' ? '#ef4444' : 
                                               metric.type === 'recovery' ? '#22c55e' :
                                               metric.type === 'strain' ? '#f59e0b' : '#3b82f6'
                                  }}></div>
                                  <span style={{ color: 'white', fontSize: '14px', textTransform: 'capitalize' }}>
                                    {metric.type.replace('_', ' ')}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                                    {metric.value} {metric.unit}
                                  </span>
                                  {metric.verified && (
                                    <span style={{ fontSize: '12px', color: '#22c55e' }}>✓</span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: '0 0 16px 0' }}>
                                No health data yet
                              </p>
                              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', margin: 0 }}>
                                Connect WHOOP to see your latest metrics
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

        {/* Active Goals - Only Show One */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.15)', 
          borderRadius: '16px', 
          padding: '24px', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
            Active Goals
          </h3>
          
          {activeGoals.length > 0 ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontWeight: '600', color: 'white', margin: 0, fontSize: '16px' }}>
                  {activeGoals[0].title}
                </h4>
                <span style={{ fontSize: '14px', color: '#22c55e', fontWeight: '600' }}>
                  ${activeGoals[0].reward}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 12px 0' }}>
                {activeGoals[0].description}
              </p>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                  <span>Progress</span>
                  <span>{activeGoals[0].currentValue} / {activeGoals[0].targetValue}</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', height: '4px' }}>
                  <div 
                    style={{ 
                      background: '#22c55e', 
                      height: '4px', 
                      borderRadius: '4px', 
                      width: `${Math.min((activeGoals[0].currentValue / activeGoals[0].targetValue) * 100, 100)}%`,
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Sponsored by: {activeGoals[0].sponsor}
              </div>
            </div>
          ) : (
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
              No active goals yet
            </p>
          )}
        </div>
      </div>
    </div>
  )
}