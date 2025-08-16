'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, DollarSign, Calendar, Users, Zap } from 'lucide-react'
import { useHealthData } from '../contexts/HealthDataContext'
import { useWeb3 } from '../contexts/Web3Context'

export const GoalCreator = () => {
  const { createGoal, goals } = useHealthData()
  const { setupX402Payment, isConnected } = useWeb3()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    reward: '',
    deadline: '',
    sponsor: 'self',
    healthDataType: 'sleep',
    conditions: [] as string[]
  })
  
  const [isCreating, setIsCreating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const healthDataTypes = [
    { value: 'sleep', label: 'Sleep Quality', unit: 'score (0-100)' },
    { value: 'steps', label: 'Daily Steps', unit: 'steps' },
    { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm' },
    { value: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg' },
    { value: 'weight', label: 'Weight', unit: 'lbs' },
  ]

  const sponsors = [
    { value: 'self', label: 'Self-funded' },
    { value: 'parents', label: 'Parents' },
    { value: 'family', label: 'Family Members' },
    { value: 'community', label: 'Community Pool' },
    { value: 'employer', label: 'Employer Wellness Program' },
  ]

  const predefinedGoals = [
    {
      title: 'Better Sleep Habits',
      description: 'Sleep by 10 PM and achieve a sleep score of 80+',
      targetValue: 80,
      reward: 1.0,
      healthDataType: 'sleep',
      conditions: ['bedtime_before_22:00', 'sleep_score >= 80']
    },
    {
      title: 'Daily Walking Goal',
      description: 'Walk 10,000 steps every day',
      targetValue: 10000,
      reward: 0.5,
      healthDataType: 'steps',
      conditions: ['daily_steps >= 10000']
    },
    {
      title: 'Lower Blood Pressure',
      description: 'Maintain systolic blood pressure below 120 mmHg',
      targetValue: 120,
      reward: 2.0,
      healthDataType: 'blood_pressure',
      conditions: ['systolic < 120']
    }
  ]

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePredefinedGoal = (goal: typeof predefinedGoals[0]) => {
    setFormData(prev => ({
      ...prev,
      title: goal.title,
      description: goal.description,
      targetValue: goal.targetValue.toString(),
      reward: goal.reward.toString(),
      healthDataType: goal.healthDataType,
      conditions: goal.conditions
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.targetValue || !formData.reward) return

    setIsCreating(true)
    try {
      const deadline = formData.deadline 
        ? new Date(formData.deadline)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default

      const goalId = createGoal({
        title: formData.title,
        description: formData.description,
        targetValue: parseFloat(formData.targetValue),
        reward: parseFloat(formData.reward),
        deadline,
        sponsor: formData.sponsor,
        healthDataType: formData.healthDataType,
        conditions: formData.conditions
      })

      // Set up automated payment with x402 if connected
      if (isConnected && formData.sponsor !== 'self') {
        try {
          await setupX402Payment(goalId, parseFloat(formData.reward))
          console.log('X402 payment setup successful')
        } catch (error) {
          console.error('X402 payment setup failed:', error)
        }
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        targetValue: '',
        reward: '',
        deadline: '',
        sponsor: 'self',
        healthDataType: 'sleep',
        conditions: []
      })

      alert('Goal created successfully!')
    } catch (error) {
      console.error('Failed to create goal:', error)
      alert('Failed to create goal. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Health Goals</h2>
            <p className="text-gray-600 mt-1">Set goals, track progress, and earn rewards for healthy behaviors</p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{activeGoals.length}</p>
              <p className="text-gray-600">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{completedGoals.length}</p>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Creation Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h3>
          
          {/* Predefined Goals */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Quick start with predefined goals:</p>
            <div className="space-y-2">
              {predefinedGoals.map((goal, index) => (
                <button
                  key={index}
                  onClick={() => handlePredefinedGoal(goal)}
                  className="w-full text-left p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{goal.title}</p>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                    <span className="text-green-600 font-medium">${goal.reward}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Improve Sleep Quality"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Describe your goal and what you want to achieve"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Data Type</label>
                <select
                  value={formData.healthDataType}
                  onChange={(e) => handleInputChange('healthDataType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {healthDataTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => handleInputChange('targetValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Target to achieve"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.reward}
                  onChange={(e) => handleInputChange('reward', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor</label>
                <select
                  value={formData.sponsor}
                  onChange={(e) => handleInputChange('sponsor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sponsors.map(sponsor => (
                    <option key={sponsor.value} value={sponsor.value}>
                      {sponsor.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (Optional)</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Advanced Options */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </button>
              
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">X402 Automated Payments</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Enable automatic reward distribution when goals are completed
                  </p>
                  {!isConnected && (
                    <p className="text-xs text-red-600">
                      Connect your Coinbase wallet to enable automated payments
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={isCreating || !formData.title || !formData.targetValue || !formData.reward}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creating Goal...' : 'Create Goal'}
            </button>
          </form>
        </div>

        {/* Active Goals List */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Goals</h3>
          
          <div className="space-y-4">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border-l-4 rounded-lg ${
                    goal.status === 'completed' ? 'border-green-500 bg-green-50' :
                    goal.status === 'active' ? 'border-blue-500 bg-blue-50' :
                    'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-medium">${goal.reward}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        goal.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {goal.currentValue} / {goal.targetValue}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          goal.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ 
                          width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Deadline: {goal.deadline.toLocaleDateString()}</span>
                      <span>Sponsored by: {goal.sponsor}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No goals yet. Create your first goal to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}