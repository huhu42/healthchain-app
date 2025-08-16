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
      value: `$${balance.toFixed(2)}`,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Reward System</h2>
            <p className="opacity-90 mt-1">Earn rewards for achieving your health goals</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">${totalRewardsEarned.toFixed(2)}</p>
            <p className="opacity-90">Total Earned</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rewardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Rewards */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Rewards</h3>
            <button
              onClick={() => setShowFundModal(true)}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <DollarSign className="w-4 h-4" />
              <span>Fund Goals</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {goals.filter(g => g.status === 'active').map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{goal.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold">${goal.reward}</span>
                    <button
                      onClick={() => handleSetupAutomatedPayment(goal.id)}
                      className="p-1 text-yellow-600 hover:text-yellow-700"
                      title="Setup automated payment"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{goal.currentValue} / {goal.targetValue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Sponsored by: {goal.sponsor}</span>
                  <span>Ends: {goal.deadline.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            
            {goals.filter(g => g.status === 'active').length === 0 && (
              <p className="text-center text-gray-500 py-4">No active reward goals</p>
            )}
          </div>
        </div>

        {/* Sponsors */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sponsors</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{sponsor.avatar}</span>
                  <div>
                    <p className="font-medium text-gray-900">{sponsor.name}</p>
                    <p className="text-sm text-gray-600">{sponsor.active} active goals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${sponsor.funded.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Total funded</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X402 Automated Payments */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">X402 Automated Payments</h3>
              <p className="text-gray-600">Set up automatic reward distribution when goals are completed</p>
            </div>
          </div>
          <a
            href="https://www.x402.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <span>Learn more</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">Automated Payments</p>
            <p className="text-2xl font-bold text-yellow-600">2</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">Successful Payouts</p>
            <p className="text-2xl font-bold text-green-600">5</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Total Automated</p>
            <p className="text-2xl font-bold text-blue-600">$7.50</p>
          </div>
        </div>
        
        {!isConnected && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Connect your Coinbase wallet to enable automated payments with x402 protocol
            </p>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        
        <div className="space-y-3">
          {recentTransactions.map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  tx.type === 'reward' ? 'bg-green-500' :
                  tx.type === 'funding' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{tx.description}</p>
                  <p className="text-sm text-gray-500">{tx.timestamp}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  tx.type === 'reward' ? 'text-green-600' :
                  tx.type === 'funding' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {tx.type === 'reward' ? '+' : tx.type === 'funding' ? '+' : ''}${tx.amount.toFixed(2)}
                </p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowFundModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Health Goals</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount to fund"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">This will fund all active goals proportionally</p>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Current wallet balance: ${balance.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFundModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFundGoals}
                  disabled={!fundAmount || !isConnected}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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