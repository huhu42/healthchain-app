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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.15)', 
        borderRadius: '20px', 
        padding: '32px', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>Health Goals</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', margin: 0 }}>Set goals, track progress, and earn rewards for healthy behaviors</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', margin: '0 0 4px 0' }}>{activeGoals.length}</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>Active</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e', margin: '0 0 4px 0' }}>{completedGoals.length}</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        {/* Goal Creation Form */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.15)', 
          borderRadius: '20px', 
          padding: '32px', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>Create New Goal</h3>
          
          {/* Predefined Goals */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>Quick start with predefined goals:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {predefinedGoals.map((goal, index) => (
                <button
                  key={index}
                  onClick={() => handlePredefinedGoal(goal)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                    (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                    (e.target as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '500', color: 'white', margin: '0 0 4px 0' }}>{goal.title}</p>
                      <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>{goal.description}</p>
                    </div>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>${goal.reward}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>Goal Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
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
                placeholder="e.g., Improve Sleep Quality"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                rows={3}
                placeholder="Describe your goal and what you want to achieve"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>Health Data Type</label>
                <select
                  value={formData.healthDataType}
                  onChange={(e) => handleInputChange('healthDataType', e.target.value)}
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
                >
                  {healthDataTypes.map(type => (
                    <option key={type.value} value={type.value} style={{ background: '#1a1a1a', color: 'white' }}>
                      {type.label} ({type.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>Target Value</label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => handleInputChange('targetValue', e.target.value)}
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
                  placeholder="Target to achieve"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>Reward Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.reward}
                  onChange={(e) => handleInputChange('reward', e.target.value)}
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
                  placeholder="1.00"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>Sponsor</label>
                <select
                  value={formData.sponsor}
                  onChange={(e) => handleInputChange('sponsor', e.target.value)}
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
                >
                  {sponsors.map(sponsor => (
                    <option key={sponsor.value} value={sponsor.value} style={{ background: '#1a1a1a', color: 'white' }}>
                      {sponsor.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>Deadline (Optional)</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
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
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Advanced Options */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </button>
              
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Zap style={{ width: '16px', height: '16px', color: '#eab308' }} />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>X402 Automated Payments</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px', margin: 0 }}>
                    Enable automatic reward distribution when goals are completed
                  </p>
                  {!isConnected && (
                    <p style={{ fontSize: '12px', color: '#ef4444', margin: 0 }}>
                      Connect your Coinbase wallet to enable automated payments
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={isCreating || !formData.title || !formData.targetValue || !formData.reward}
              style={{
                width: '100%',
                background: isCreating || !formData.title || !formData.targetValue || !formData.reward 
                  ? 'rgba(59, 130, 246, 0.5)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isCreating || !formData.title || !formData.targetValue || !formData.reward ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isCreating && formData.title && formData.targetValue && formData.reward) {
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
              }}
            >
              {isCreating ? 'Creating Goal...' : 'Create Goal'}
            </button>
          </form>
        </div>

        {/* Active Goals List */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.15)', 
          borderRadius: '20px', 
          padding: '32px', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>Your Goals</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {goals.length > 0 ? (
              goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '20px',
                    borderLeft: `4px solid ${
                      goal.status === 'completed' ? '#22c55e' :
                      goal.status === 'active' ? '#3b82f6' :
                      'rgba(255, 255, 255, 0.5)'
                    }`,
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ fontWeight: '500', color: 'white', margin: 0 }}>{goal.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#22c55e', fontWeight: '600' }}>${goal.reward}</span>
                      <span style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        borderRadius: '20px',
                        background: goal.status === 'completed' ? 'rgba(34, 197, 94, 0.2)' :
                                   goal.status === 'active' ? 'rgba(59, 130, 246, 0.2)' :
                                   'rgba(255, 255, 255, 0.2)',
                        color: goal.status === 'completed' ? '#22c55e' :
                               goal.status === 'active' ? '#3b82f6' :
                               'rgba(255, 255, 255, 0.8)',
                        border: `1px solid ${goal.status === 'completed' ? '#22c55e' :
                                             goal.status === 'active' ? '#3b82f6' :
                                             'rgba(255, 255, 255, 0.3)'}`
                      }}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px', margin: '0 0 16px 0' }}>{goal.description}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Progress</span>
                      <span style={{ fontWeight: '500', color: 'white' }}>
                        {goal.currentValue} / {goal.targetValue}
                      </span>
                    </div>
                    <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', height: '8px' }}>
                      <div 
                        style={{
                          height: '8px',
                          borderRadius: '10px',
                          background: goal.status === 'completed' ? '#22c55e' : 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                          width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%`,
                          transition: 'all 0.3s ease'
                        }}
                      ></div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      <span>Deadline: {goal.deadline.toLocaleDateString()}</span>
                      <span>Sponsored by: {goal.sponsor}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <Target style={{ width: '48px', height: '48px', color: 'rgba(255, 255, 255, 0.5)', margin: '0 auto 16px auto' }} />
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>No goals yet. Create your first goal to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}