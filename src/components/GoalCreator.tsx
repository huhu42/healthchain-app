'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, DollarSign, Calendar, Users, Zap, Plus, Smartphone, Shield, Play, Square, Settings, Activity } from 'lucide-react'
import { useHealthData } from '../contexts/HealthDataContext'
import { useWeb3 } from '../contexts/Web3Context'
import { useFlow } from '../contexts/FlowContext'
import { flowAgent } from '../lib/flowAgent'

export const GoalCreator = () => {
  const { createGoal, goals } = useHealthData()
  const { setupX402Payment, isConnected } = useWeb3()
  const { user: flowUser } = useFlow()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    reward: '',
    deadline: '',
    sponsor: 'self',
    healthDataType: 'sleep',
    conditions: [] as string[],
    verificationType: 'automatic' // automatic or manual
  })
  
  const [isCreating, setIsCreating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const healthDataTypes = [
    { value: 'sleep', label: 'Sleep Quality', unit: 'score (0-100)', icon: '😴' },
    { value: 'steps', label: 'Daily Steps', unit: 'steps', icon: '👟' },
    { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm', icon: '❤️' },
    { value: 'recovery', label: 'Recovery Score', unit: 'score (0-100)', icon: '🔄' },
    { value: 'strain', label: 'Daily Strain', unit: 'score (0-21)', icon: '⚡' },
    { value: 'weight', label: 'Weight', unit: 'lbs', icon: '⚖️' },
  ]

  const sponsors = [
    { value: 'self', label: 'Self-funded', icon: '💳' },
    { value: 'parents', label: 'Parents', icon: '👨‍👩‍👧‍👦' },
    { value: 'family', label: 'Family Members', icon: '🏠' },
    { value: 'community', label: 'Community Pool', icon: '🌍' },
    { value: 'employer', label: 'Employer Wellness', icon: '💼' },
  ]

  const predefinedGoals = [
    {
      title: 'Better Sleep Habits',
      description: 'Achieve a sleep score of 80+ for 5 consecutive nights',
      targetValue: 80,
      reward: 1.0,
      healthDataType: 'sleep',
      conditions: ['consecutive_nights >= 5', 'sleep_score >= 80'],
      verificationType: 'automatic'
    },
    {
      title: 'Daily Walking Goal',
      description: 'Walk 10,000 steps every day for a week',
      targetValue: 10000,
      reward: 0.5,
      healthDataType: 'steps',
      conditions: ['daily_steps >= 10000', 'consecutive_days >= 7'],
      verificationType: 'automatic'
    },
    {
      title: 'Recovery Optimization',
      description: 'Maintain recovery score above 70 for 3 consecutive days',
      targetValue: 70,
      reward: 1.5,
      healthDataType: 'recovery',
      conditions: ['recovery_score >= 70', 'consecutive_days >= 3'],
      verificationType: 'automatic'
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
      conditions: goal.conditions,
      verificationType: goal.verificationType
    }))
    setShowCreateForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.targetValue || !formData.reward) return

    setIsCreating(true)
    try {
      const deadline = formData.deadline 
        ? new Date(formData.deadline)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default

      // Create goal with smart contract integration
      const goalId = await createSmartContractGoal({
        title: formData.title,
        description: formData.description,
        targetValue: parseFloat(formData.targetValue),
        reward: parseFloat(formData.reward),
        deadline,
        sponsor: formData.sponsor,
        healthDataType: formData.healthDataType,
        conditions: formData.conditions,
        verificationType: formData.verificationType
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        targetValue: '',
        reward: '',
        deadline: '',
        sponsor: 'self',
        healthDataType: 'sleep',
        conditions: [],
        verificationType: 'automatic'
      })

      setShowCreateForm(false)
      alert('Smart contract goal created successfully! 🎯')
    } catch (error) {
      console.error('Failed to create smart contract goal:', error)
      alert('Failed to create goal. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  // Smart contract goal creation
  const createSmartContractGoal = async (goalData: any) => {
    if (flowUser.loggedIn) {
      // Use Flow smart contract
      return await createFlowGoal(goalData)
    } else {
      // Fallback to local storage with smart contract structure
      return createLocalSmartContractGoal(goalData)
    }
  }

  const createFlowGoal = async (goalData: any) => {
    // TODO: Implement Flow smart contract goal creation
    console.log('Creating Flow smart contract goal:', goalData)
    return `flow_${Date.now()}`
  }

  const createLocalSmartContractGoal = (goalData: any) => {
    const goalId = `local_${Date.now()}`
    
    // Create smart contract goal structure
    const smartContractGoal = {
      id: goalId,
      title: goalData.title,
      description: goalData.description,
      targetValue: goalData.targetValue,
      reward: goalData.reward,
      deadline: goalData.deadline,
      sponsor: goalData.sponsor,
      healthDataType: goalData.healthDataType,
      verificationConditions: goalData.conditions,
      verificationType: goalData.verificationType,
      isCompleted: false,
      isVerified: false,
      consecutiveSuccessDays: 0,
      lastVerificationAttempt: null
    }
    
    // Save to localStorage
    const existingGoals = JSON.parse(localStorage.getItem('smartContractGoals') || '[]')
    existingGoals.push(smartContractGoal)
    localStorage.setItem('smartContractGoals', JSON.stringify(existingGoals))
    
    console.log('✅ Smart contract goal created locally:', smartContractGoal)
    return goalId
  }

  // Filter goals - start with no active goals as requested
  const activeGoals = [] // No active goals initially
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
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>Smart Health Goals</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', margin: 0 }}>
              Create blockchain-powered goals with automatic verification and instant rewards
            </p>
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

      {/* No Active Goals State */}
      {activeGoals.length === 0 && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.15)', 
          borderRadius: '20px', 
          padding: '48px', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'rgba(59, 130, 246, 0.2)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px'
          }}>
            <Target style={{ width: '40px', height: '40px', color: '#3b82f6' }} />
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
            No Active Goals Yet
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', margin: '0 0 32px 0', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            Start your health journey by creating your first smart contract goal. 
            Our system automatically verifies your progress using WHOOP data and rewards you instantly when you succeed.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '16px 32px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-2px)'
              ;(e.target as HTMLElement).style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.4)'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)'
              ;(e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            Create Your First Goal
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        {/* Goal Creation Form */}
        {showCreateForm && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.15)', 
            borderRadius: '20px', 
            padding: '32px', 
            backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>Create Smart Goal</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Basic Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Daily Steps Challenge"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    Health Data Type
                  </label>
                  <select
                    value={formData.healthDataType}
                    onChange={(e) => handleInputChange('healthDataType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  >
                    {healthDataTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label} ({type.unit})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your goal and what you want to achieve..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) => handleInputChange('targetValue', e.target.value)}
                    placeholder="e.g., 10000"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    Reward (FLOW)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.reward}
                    onChange={(e) => handleInputChange('reward', e.target.value)}
                    placeholder="e.g., 1.0"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Sponsor
                </label>
                <select
                  value={formData.sponsor}
                  onChange={(e) => handleInputChange('sponsor', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px'
                  }}
                >
                  {sponsors.map(sponsor => (
                    <option key={sponsor.value} value={sponsor.value}>
                      {sponsor.icon} {sponsor.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Smart Contract Features */}
              <div style={{ 
                background: 'rgba(59, 130, 246, 0.1)', 
                borderRadius: '12px', 
                padding: '16px', 
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Shield style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                  <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '600' }}>
                    Smart Contract Features
                  </span>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', lineHeight: '1.4' }}>
                  ✅ Automatic verification using WHOOP data<br/>
                  ✅ Instant reward distribution<br/>
                  ✅ Immutable goal conditions<br/>
                  ✅ Transparent progress tracking
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  border: 'none',
                  background: isCreating 
                    ? 'rgba(59, 130, 246, 0.5)' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isCreating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginTop: '16px'
                }}
              >
                {isCreating ? (
                  <>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      border: '2px solid rgba(255,255,255,0.3)', 
                      borderTop: '2px solid white', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite' 
                    }}></div>
                    Deploying Smart Contract...
                  </>
                ) : (
                  <>
                    <Zap style={{ width: '20px', height: '20px' }} />
                    Deploy Smart Contract Goal
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Predefined Goals */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.15)', 
          borderRadius: '20px', 
          padding: '32px', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
            Quick Start Templates
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {predefinedGoals.map((goal, index) => (
              <div
                key={index}
                style={{
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
                onClick={() => handlePredefinedGoal(goal)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                    {goal.title}
                  </h4>
                  <span style={{ 
                    background: 'rgba(59, 130, 246, 0.2)', 
                    color: '#3b82f6', 
                    fontSize: '10px', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    fontWeight: '600'
                  }}>
                    SMART
                  </span>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                  {goal.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                      Target: {goal.targetValue} {healthDataTypes.find(t => t.value === goal.healthDataType)?.unit}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                    <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600' }}>
                      {goal.reward} FLOW
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Contract Goals Status */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.15)', 
          borderRadius: '20px', 
          padding: '32px', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
            Smart Contract Status
          </h3>
          
          {/* Verification Service Status */}
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '12px', 
            padding: '16px', 
            border: '1px solid rgba(59, 130, 246, 0.2)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: '#22c55e',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '600' }}>
                  Automated Verification Service
                </span>
              </div>
              <span style={{ 
                background: 'rgba(34, 197, 94, 0.2)', 
                color: '#22c55e', 
                fontSize: '10px', 
                padding: '4px 8px', 
                borderRadius: '12px',
                fontWeight: '600'
              }}>
                ACTIVE
              </span>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', margin: '8px 0 0 0' }}>
              Automatically verifies goals every hour using WHOOP data
            </p>
          </div>

          {/* Flow Agent Controls */}
          <div style={{ 
            background: 'rgba(139, 92, 246, 0.1)', 
            borderRadius: '12px', 
            padding: '16px', 
            border: '1px solid rgba(139, 92, 246, 0.2)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
                <span style={{ color: '#8b5cf6', fontSize: '14px', fontWeight: '600' }}>
                  Flow Agent Status
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={async () => {
                    try {
                      if (flowAgent.getStatus().isRunning) {
                        flowAgent.stop()
                      } else {
                        await flowAgent.start()
                      }
                      // Force re-render
                      setShowCreateForm(showCreateForm)
                    } catch (error) {
                      console.error('Error toggling Flow Agent:', error)
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: flowAgent.getStatus().isRunning 
                      ? 'rgba(239, 68, 68, 0.2)' 
                      : 'rgba(34, 197, 94, 0.2)',
                    color: flowAgent.getStatus().isRunning ? '#ef4444' : '#22c55e',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {flowAgent.getStatus().isRunning ? (
                    <>
                      <Square style={{ width: '14px', height: '14px' }} />
                      Stop Agent
                    </>
                  ) : (
                    <>
                      <Play style={{ width: '14px', height: '14px' }} />
                      Start Agent
                    </>
                  )}
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      await flowAgent.triggerManualVerification()
                      // Force re-render
                      setShowCreateForm(showCreateForm)
                    } catch (error) {
                      console.error('Error triggering manual verification:', error)
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Zap style={{ width: '14px', height: '14px' }} />
                  Verify Now
                </button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Status:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: flowAgent.getStatus().isRunning ? '#22c55e' : '#ef4444',
                    animation: flowAgent.getStatus().isRunning ? 'pulse 2s infinite' : 'none'
                  }}></div>
                  <span style={{ 
                    color: flowAgent.getStatus().isRunning ? '#22c55e' : '#ef4444', 
                    fontSize: '12px', 
                    fontWeight: '600' 
                  }}>
                    {flowAgent.getStatus().isRunning ? 'Running' : 'Stopped'}
                  </span>
                </div>
              </div>
              
              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>Network:</span>
                <div style={{ marginTop: '4px' }}>
                  <span style={{ 
                    color: '#8b5cf6', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {flowAgent.getStatus().config.flowNetwork}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.1)', 
              borderRadius: '8px', 
              padding: '12px',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.4'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Shield style={{ width: '12px', height: '12px', color: '#8b5cf6' }} />
                <span style={{ fontWeight: '600' }}>What Flow Agent Does:</span>
              </div>
              • Monitors goals every hour<br/>
              • Fetches WHOOP data automatically<br/>
              • Verifies goals on Flow blockchain<br/>
              • Executes automatic payouts<br/>
              • Updates goal status in real-time
            </div>

            {/* Webhook Integration Status */}
            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              borderRadius: '8px', 
              padding: '12px',
              marginTop: '12px',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: '#22c55e',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: '600' }}>
                    WHOOP Webhook Integration
                  </span>
                </div>
                <span style={{ 
                  background: 'rgba(34, 197, 94, 0.2)', 
                  color: '#22c55e', 
                  fontSize: '10px', 
                  padding: '2px 6px', 
                  borderRadius: '8px',
                  fontWeight: '600'
                }}>
                  ACTIVE
                </span>
              </div>
              
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px', margin: '0 0 8px 0' }}>
                Real-time verification triggered by WHOOP data updates
              </p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={async () => {
                    try {
                      // Test sleep webhook
                      const response = await fetch('/api/whoop/webhook/test', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ event_type: 'sleep_completed' })
                      })
                      const result = await response.json()
                      console.log('🧪 Sleep webhook test result:', result)
                      alert('Sleep webhook test completed! Check console for details.')
                    } catch (error) {
                      console.error('Webhook test failed:', error)
                      alert('Webhook test failed. Check console for details.')
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Test Sleep Webhook
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      // Test workout webhook
                      const response = await fetch('/api/whoop/webhook/test', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ event_type: 'workout_completed' })
                      })
                      const result = await response.json()
                      console.log('🧪 Workout webhook test result:', result)
                      alert('Workout webhook test completed! Check console for details.')
                    } catch (error) {
                      console.error('Webhook test failed:', error)
                      alert('Webhook test failed. Check console for details.')
                    }
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Test Workout Webhook
                </button>
              </div>
            </div>
          </div>

          {/* Smart Contract Goals List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(() => {
              try {
                const smartGoals = JSON.parse(localStorage.getItem('smartContractGoals') || '[]')
                if (smartGoals.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '24px' }}>
                      <Target style={{ width: '32px', height: '32px', color: 'rgba(255, 255, 255, 0.5)', margin: '0 auto 12px auto' }} />
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: '0 0 8px 0' }}>
                        No smart contract goals yet
                      </p>
                      <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', margin: 0 }}>
                        Create your first goal to see it here
                      </p>
                    </div>
                  )
                }

                return smartGoals.map((goal: any) => (
                  <div
                    key={goal.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                        {goal.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          background: goal.isCompleted 
                            ? 'rgba(34, 197, 94, 0.2)' 
                            : goal.isVerified 
                            ? 'rgba(59, 130, 246, 0.2)' 
                            : 'rgba(156, 163, 175, 0.2)', 
                          color: goal.isCompleted 
                            ? '#22c55e' 
                            : goal.isVerified 
                            ? '#3b82f6' 
                            : '#9ca3af', 
                          fontSize: '10px', 
                          padding: '4px 8px', 
                          borderRadius: '12px',
                          fontWeight: '600'
                        }}>
                          {goal.isCompleted ? 'COMPLETED' : goal.isVerified ? 'VERIFIED' : 'PENDING'}
                        </span>
                        <span style={{ 
                          background: 'rgba(59, 130, 246, 0.2)', 
                          color: '#3b82f6', 
                          fontSize: '10px', 
                          padding: '4px 8px', 
                          borderRadius: '12px',
                          fontWeight: '600'
                        }}>
                          {goal.verificationType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                      {goal.description}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          Target: {goal.targetValue} {healthDataTypes.find(t => t.value === goal.healthDataType)?.unit}
                        </span>
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          Reward: {goal.reward} FLOW
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign style={{ width: '14px', height: '14px', color: '#22c55e' }} />
                        <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600' }}>
                          {goal.reward} FLOW
                        </span>
                      </div>
                    </div>

                    {/* Progress and Verification Info */}
                    <div style={{ 
                      background: 'rgba(0, 0, 0, 0.1)', 
                      borderRadius: '8px', 
                      padding: '12px',
                      marginTop: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '500' }}>
                          Verification Progress
                        </span>
                        <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: '600' }}>
                          {goal.consecutiveSuccessDays} consecutive days
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        <span>
                          Last verified: {goal.lastVerificationAttempt 
                            ? new Date(goal.lastVerificationAttempt).toLocaleDateString() 
                            : 'Never'
                          }
                        </span>
                        <span>
                          Status: {goal.isCompleted ? 'Goal Completed! 🎉' : 'In Progress...'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              } catch (error) {
                return (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>
                      Error loading smart contract goals
                    </p>
                  </div>
                )
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}