'use client'

// import { motion } from 'framer-motion'
import { Heart, Target, TrendingUp, DollarSign, Users, Activity } from 'lucide-react'
import { useHealthData } from '../contexts/HealthDataContext'
import { useWeb3 } from '../contexts/Web3Context'
import { useFlow } from '../contexts/FlowContext'
import { Card } from './ui'

export const DashboardOverview = () => {
  const { healthMetrics, goals } = useHealthData()
  const { balance, isConnected } = useWeb3()
  const { user } = useFlow()

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')
  const totalRewardsEarned = completedGoals.reduce((sum, goal) => sum + goal.reward, 0)

  const recentMetrics = healthMetrics.slice(0, 5)

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
      value: `$${balance.toFixed(2)}`,
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
          Welcome to HealthChain
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px', margin: '0 0 24px 0' }}>
          {user.loggedIn 
            ? `Connected as ${user.addr?.slice(0, 8)}...${user.addr?.slice(-6)}`
            : 'Track your health, earn rewards, and take control of your data'
          }
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: user.loggedIn ? '#22c55e' : '#ef4444',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{ fontSize: '14px', color: 'white' }}>Flow {user.loggedIn ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: isConnected ? '#22c55e' : '#ef4444',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{ fontSize: '14px', color: 'white' }}>Coinbase {isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
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
                                 metric.type === 'heart_rate' ? '#ef4444' : '#3b82f6'
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
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>
                No health data yet
              </p>
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