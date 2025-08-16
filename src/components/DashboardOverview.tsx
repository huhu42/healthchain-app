'use client'

import { motion } from 'framer-motion'
import { Heart, Target, TrendingUp, DollarSign, Users, Activity } from 'lucide-react'
import { useHealthData } from '../contexts/HealthDataContext'
import { useWeb3 } from '../contexts/Web3Context'
import { useFlow } from '../contexts/FlowContext'

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
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to HealthChain</h2>
        <p className="opacity-90">
          {user.loggedIn 
            ? `Connected as ${user.addr?.slice(0, 8)}...${user.addr?.slice(-6)}`
            : 'Track your health, earn rewards, and take control of your data'
          }
        </p>
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${user.loggedIn ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">Flow {user.loggedIn ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">Coinbase {isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Health Metrics */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Health Data</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {recentMetrics.length > 0 ? (
              recentMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      metric.type === 'sleep' ? 'bg-purple-500' :
                      metric.type === 'steps' ? 'bg-green-500' :
                      metric.type === 'heart_rate' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{metric.type.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{metric.timestamp.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{metric.value} {metric.unit}</p>
                    {metric.verified && (
                      <p className="text-xs text-green-600">✓ Verified</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No health data yet. Connect your wearable or add data manually.</p>
            )}
          </div>
        </div>

        {/* Active Goals */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {activeGoals.length > 0 ? (
              activeGoals.map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <span className="text-sm text-green-600 font-medium">${goal.reward}</span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{goal.currentValue} / {goal.targetValue}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Deadline: {goal.deadline.toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No active goals. Create your first health goal to start earning rewards!</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Target className="w-6 h-6 mx-auto mb-2" />
            <p className="font-medium">Create New Goal</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:border-green-500 hover:bg-green-50 transition-colors">
            <Heart className="w-6 h-6 mx-auto mb-2" />
            <p className="font-medium">Add Health Data</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <p className="font-medium">Share with Family</p>
          </button>
        </div>
      </div>
    </div>
  )
}