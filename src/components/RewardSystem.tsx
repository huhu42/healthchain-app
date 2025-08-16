'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Zap, TrendingUp, Users, Gift, ExternalLink } from 'lucide-react'
import { useHealthData } from '../contexts/HealthDataContext'
import { useWeb3 } from '../contexts/Web3Context'
import { useFlow } from '../contexts/FlowContext'

export const RewardSystem = () => {
  const { goals } = useHealthData()
  const { balance, setupX402Payment, sendPayment, isConnected } = useWeb3()
  const { user } = useFlow()
  
  const [showFundModal, setShowFundModal] = useState(false)
  const [fundAmount, setFundAmount] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('')

  const completedGoals = goals.filter(g => g.status === 'completed')
  const totalRewardsEarned = completedGoals.reduce((sum, goal) => sum + goal.reward, 0)
  const pendingRewards = goals.filter(g => g.status === 'active').reduce((sum, goal) => sum + goal.reward, 0)

  const rewardStats = [
    {
      label: 'Total Earned',
      value: `$${totalRewardsEarned.toFixed(2)}`,
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Pending Rewards',
      value: `$${pendingRewards.toFixed(2)}`,
      icon: TrendingUp,
      color: 'yellow'
    },
    {
      label: 'Wallet Balance',
      value: `${typeof balance === 'string' ? balance : balance.toFixed(2)} ETH`,
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Goals Completed',
      value: completedGoals.length,
      icon: Gift,
      color: 'purple'
    }
  ]

  const sponsors = [
    { name: 'Parents', funded: 25.0, active: 3, avatar: '👨‍👩‍👧‍👦' },
    { name: 'Self', funded: 5.0, active: 1, avatar: '💰' },
    { name: 'Community', funded: 12.0, active: 2, avatar: '🌍' },
  ]

  const recentTransactions = [
    { type: 'reward', amount: 1.0, description: 'Sleep goal completed', timestamp: '2 hours ago', status: 'completed' },
    { type: 'funding', amount: 10.0, description: 'Parents funded goals', timestamp: '1 day ago', status: 'completed' },
    { type: 'reward', amount: 0.5, description: 'Daily steps achieved', timestamp: '2 days ago', status: 'completed' },
    { type: 'x402_setup', amount: 2.0, description: 'Automated payment setup', timestamp: '3 days ago', status: 'pending' },
  ]

  const handleFundGoals = async () => {
    if (!fundAmount || !isConnected) return

    try {
      // In production, this would fund the smart contract
      const txId = await sendPayment(parseFloat(fundAmount), 'health_rewards_contract')
      console.log('Funding transaction:', txId)
      alert(`Successfully funded goals with $${fundAmount}`)
      setFundAmount('')
      setShowFundModal(false)
    } catch (error) {
      console.error('Funding failed:', error)
      alert('Funding failed. Please try again.')
    }
  }

  const handleSetupAutomatedPayment = async (goalId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    try {
      const goal = goals.find(g => g.id === goalId)
      if (!goal) return

      const paymentId = await setupX402Payment(goalId, goal.reward)
      console.log('X402 payment setup:', paymentId)
      alert('Automated payment setup successful!')
    } catch (error) {
      console.error('X402 setup failed:', error)
      alert('Automated payment setup failed. Please try again.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)', 
        borderRadius: '20px', 
        padding: '32px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Reward System</h2>
            <p style={{ opacity: 0.9, margin: 0, fontSize: '16px' }}>Earn rewards for achieving your health goals</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0' }}>${totalRewardsEarned.toFixed(2)}</p>
            <p style={{ opacity: 0.9, margin: 0 }}>Total Earned</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        {rewardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '0 0 8px 0' }}>{stat.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>{stat.value}</p>
                </div>
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <Icon style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        {/* Active Rewards */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>Active Rewards</h3>
            <button
              onClick={() => setShowFundModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
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
            >
              <DollarSign style={{ width: '16px', height: '16px' }} />
              <span>Fund Goals</span>
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {goals.filter(g => g.status === 'active').map((goal) => (
              <div key={goal.id} style={{
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ fontWeight: '500', color: 'white', margin: 0 }}>{goal.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#22c55e', fontWeight: 'bold' }}>${goal.reward}</span>
                    <button
                      onClick={() => handleSetupAutomatedPayment(goal.id)}
                      style={{
                        padding: '4px',
                        background: 'none',
                        border: 'none',
                        color: '#eab308',
                        cursor: 'pointer'
                      }}
                      title="Setup automated payment"
                    >
                      <Zap style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                    <span>Progress</span>
                    <span>{goal.currentValue} / {goal.targetValue}</span>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', height: '8px' }}>
                    <div 
                      style={{
                        background: '#22c55e',
                        height: '8px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <span>Sponsored by: {goal.sponsor}</span>
                  <span>Ends: {goal.deadline.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            
            {goals.filter(g => g.status === 'active').length === 0 && (
              <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', padding: '16px 0', margin: 0 }}>No active reward goals</p>
            )}
          </div>
        </div>

        {/* Sponsors */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>Sponsors</h3>
            <Users style={{ width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.5)' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sponsors.map((sponsor, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{sponsor.avatar}</span>
                  <div>
                    <p style={{ fontWeight: '500', color: 'white', margin: '0 0 4px 0' }}>{sponsor.name}</p>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>{sponsor.active} active goals</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', color: '#22c55e', margin: '0 0 4px 0' }}>${sponsor.funded.toFixed(2)}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Total funded</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X402 Automated Payments */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '32px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap style={{ width: '24px', height: '24px', color: '#eab308' }} />
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 4px 0' }}>X402 Automated Payments</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '14px' }}>Set up automatic reward distribution when goals are completed</p>
            </div>
          </div>
          <a
            href="https://www.x402.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#3b82f6',
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            <span>Learn more</span>
            <ExternalLink style={{ width: '16px', height: '16px' }} />
          </a>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            padding: '16px',
            background: 'rgba(234, 179, 8, 0.2)',
            borderRadius: '12px',
            border: '1px solid rgba(234, 179, 8, 0.3)'
          }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#eab308', margin: '0 0 8px 0' }}>Automated Payments</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#eab308', margin: 0 }}>2</p>
          </div>
          <div style={{
            padding: '16px',
            background: 'rgba(34, 197, 94, 0.2)',
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#22c55e', margin: '0 0 8px 0' }}>Successful Payouts</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>5</p>
          </div>
          <div style={{
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#3b82f6', margin: '0 0 8px 0' }}>Total Automated</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>$7.50</p>
          </div>
        </div>
        
        {!isConnected && (
          <div style={{
            padding: '16px',
            background: 'rgba(234, 179, 8, 0.2)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '12px'
          }}>
            <p style={{ fontSize: '14px', color: '#eab308', margin: 0 }}>
              Connect your Coinbase wallet to enable automated payments with x402 protocol
            </p>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '32px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>Recent Transactions</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentTransactions.map((tx, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: tx.type === 'reward' ? '#22c55e' :
                             tx.type === 'funding' ? '#3b82f6' :
                             '#eab308'
                }}></div>
                <div>
                  <p style={{ fontWeight: '500', color: 'white', margin: '0 0 4px 0' }}>{tx.description}</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>{tx.timestamp}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontWeight: 'bold',
                  color: tx.type === 'reward' ? '#22c55e' :
                         tx.type === 'funding' ? '#3b82f6' :
                         '#eab308',
                  margin: '0 0 4px 0'
                }}>
                  {tx.type === 'reward' ? '+' : tx.type === 'funding' ? '+' : ''}${tx.amount.toFixed(2)}
                </p>
                <span style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  borderRadius: '20px',
                  background: tx.status === 'completed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                  color: tx.status === 'completed' ? '#22c55e' : '#eab308',
                  border: `1px solid ${tx.status === 'completed' ? '#22c55e' : '#eab308'}`
                }}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fund Goals Modal */}
      {showFundModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setShowFundModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '400px',
              margin: '0 16px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>Fund Health Goals</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="Enter amount to fund"
                />
              </div>
              
              <div>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px', margin: '0 0 8px 0' }}>This will fund all active goals proportionally</p>
                <div style={{
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <p style={{ fontSize: '14px', color: '#3b82f6', margin: 0 }}>
                    Current wallet balance: {typeof balance === 'string' ? balance : balance.toFixed(2)} ETH
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowFundModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFundGoals}
                  disabled={!fundAmount || !isConnected}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: !fundAmount || !isConnected ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: !fundAmount || !isConnected ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  Fund Goals
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}