'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface HealthMetric {
  id: string
  type: 'sleep' | 'steps' | 'heart_rate' | 'blood_pressure' | 'weight'
  value: number
  timestamp: Date
  unit: string
  verified: boolean
}

interface Goal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  reward: number
  deadline: Date
  sponsor: string
  status: 'active' | 'completed' | 'failed' | 'pending'
  healthDataType: string
  conditions: string[]
}

interface PrivacySetting {
  dataType: string
  shareLevel: 'private' | 'family' | 'medical' | 'public'
  authorizedUsers: string[]
  allowPublicGraph: boolean
}

interface HealthDataContextType {
  healthMetrics: HealthMetric[]
  goals: Goal[]
  privacySettings: PrivacySetting[]
  addHealthMetric: (metric: Omit<HealthMetric, 'id' | 'timestamp' | 'verified'>) => void
  createGoal: (goal: Omit<Goal, 'id' | 'status' | 'currentValue'>) => string
  updateGoalProgress: (goalId: string, value: number) => void
  completeGoal: (goalId: string) => void
  updatePrivacySetting: (dataType: string, setting: Partial<PrivacySetting>) => void
  publishToHypergraph: (dataTypes: string[], isPublic: boolean) => Promise<string>
  syncWithWearable: () => Promise<void>
  exportHealthData: (format: 'json' | 'csv' | 'pdf') => Promise<Blob>
  isLoading: boolean
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined)

export const useHealthData = () => {
  const context = useContext(HealthDataContext)
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider')
  }
  return context
}

interface HealthDataProviderProps {
  children: ReactNode
}

export const HealthDataProvider: React.FC<HealthDataProviderProps> = ({ children }) => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    { dataType: 'sleep', shareLevel: 'private', authorizedUsers: [], allowPublicGraph: false },
    { dataType: 'steps', shareLevel: 'family', authorizedUsers: [], allowPublicGraph: true },
    { dataType: 'heart_rate', shareLevel: 'medical', authorizedUsers: [], allowPublicGraph: false },
    { dataType: 'blood_pressure', shareLevel: 'medical', authorizedUsers: [], allowPublicGraph: false },
    { dataType: 'weight', shareLevel: 'private', authorizedUsers: [], allowPublicGraph: false },
  ])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with mock data
  useEffect(() => {
    const mockHealthData: HealthMetric[] = [
      {
        id: '1',
        type: 'sleep',
        value: 7.5,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        unit: 'hours',
        verified: true
      },
      {
        id: '2',
        type: 'steps',
        value: 8500,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        unit: 'steps',
        verified: true
      },
      {
        id: '3',
        type: 'heart_rate',
        value: 72,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unit: 'bpm',
        verified: true
      }
    ]

    const mockGoals: Goal[] = [
      {
        id: '1',
        title: 'Improve Sleep Quality',
        description: 'Sleep by 10 PM and achieve a sleep score of 80+',
        targetValue: 80,
        currentValue: 75,
        reward: 1.0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sponsor: 'parents',
        status: 'active',
        healthDataType: 'sleep',
        conditions: ['bedtime_before_22:00', 'sleep_score >= 80']
      },
      {
        id: '2',
        title: 'Daily Steps Goal',
        description: 'Walk 10,000 steps daily',
        targetValue: 10000,
        currentValue: 8500,
        reward: 0.5,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sponsor: 'self',
        status: 'active',
        healthDataType: 'steps',
        conditions: ['daily_steps >= 10000']
      }
    ]

    setHealthMetrics(mockHealthData)
    setGoals(mockGoals)
  }, [])

  const addHealthMetric = (metric: Omit<HealthMetric, 'id' | 'timestamp' | 'verified'>) => {
    const newMetric: HealthMetric = {
      ...metric,
      id: Date.now().toString(),
      timestamp: new Date(),
      verified: false // Would be verified by oracles in production
    }
    
    setHealthMetrics(prev => [newMetric, ...prev])
    
    // Check if this metric helps complete any goals
    goals.forEach(goal => {
      if (goal.healthDataType === metric.type && goal.status === 'active') {
        updateGoalProgress(goal.id, metric.value)
      }
    })
  }

  const createGoal = (goal: Omit<Goal, 'id' | 'status' | 'currentValue'>): string => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      status: 'active',
      currentValue: 0
    }
    
    setGoals(prev => [...prev, newGoal])
    return newGoal.id
  }

  const updateGoalProgress = (goalId: string, value: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updated = { ...goal, currentValue: value }
        
        // Check if goal is completed
        if (value >= goal.targetValue) {
          updated.status = 'completed'
        }
        
        return updated
      }
      return goal
    }))
  }

  const completeGoal = (goalId: string) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId ? { ...goal, status: 'completed' } : goal
    ))
  }

  const updatePrivacySetting = (dataType: string, setting: Partial<PrivacySetting>) => {
    setPrivacySettings(prev => prev.map(ps =>
      ps.dataType === dataType ? { ...ps, ...setting } : ps
    ))
  }

  const publishToHypergraph = async (dataTypes: string[], isPublic: boolean): Promise<string> => {
    setIsLoading(true)
    try {
      // Mock hypergraph publishing
      const graphId = `graph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const graphData = {
        id: graphId,
        dataTypes,
        isPublic,
        timestamp: new Date().toISOString(),
        data: healthMetrics.filter(metric => dataTypes.includes(metric.type)),
        privacy: privacySettings.filter(ps => dataTypes.includes(ps.dataType))
      }
      
      // Simulate API call to The Graph Protocol
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Published to hypergraph:', graphData)
      
      return graphId
    } catch (error) {
      throw new Error('Failed to publish to hypergraph')
    } finally {
      setIsLoading(false)
    }
  }

  const syncWithWearable = async () => {
    setIsLoading(true)
    try {
      // Import WHOOP API dynamically to avoid SSR issues
      const { whoopApi } = await import('../lib/whoopApi')
      
      if (!whoopApi.isAuthenticated()) {
        // Redirect to WHOOP OAuth
        const authUrl = whoopApi.getAuthUrl()
        window.location.href = authUrl
        return
      }
      
      // Fetch real data from WHOOP
      const whoopData = await whoopApi.getAllHealthData(7)
      
      // Convert WHOOP data to HealthMetric format
      const syncData: HealthMetric[] = whoopData.map(data => ({
        id: data.id,
        type: data.type === 'recovery' ? 'heart_rate' : data.type === 'strain' ? 'activity' : data.type,
        value: data.value,
        timestamp: new Date(data.timestamp),
        unit: data.unit,
        verified: data.verified,
        source: data.source,
        metadata: data.metadata
      }))
      
      setHealthMetrics(prev => [...syncData, ...prev])
    } catch (error) {
      console.error('WHOOP sync error:', error)
      throw new Error('Failed to sync with WHOOP')
    } finally {
      setIsLoading(false)
    }
  }

  const exportHealthData = async (format: 'json' | 'csv' | 'pdf'): Promise<Blob> => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const exportData = {
        healthMetrics,
        goals,
        exportedAt: new Date().toISOString(),
        format
      }
      
      let content: string
      let mimeType: string
      
      switch (format) {
        case 'json':
          content = JSON.stringify(exportData, null, 2)
          mimeType = 'application/json'
          break
        case 'csv':
          content = healthMetrics.map(m => 
            `${m.timestamp.toISOString()},${m.type},${m.value},${m.unit},${m.verified}`
          ).join('\n')
          mimeType = 'text/csv'
          break
        case 'pdf':
          content = JSON.stringify(exportData) // Would use PDF library in production
          mimeType = 'application/pdf'
          break
        default:
          throw new Error('Unsupported format')
      }
      
      return new Blob([content], { type: mimeType })
    } finally {
      setIsLoading(false)
    }
  }

  const value: HealthDataContextType = {
    healthMetrics,
    goals,
    privacySettings,
    addHealthMetric,
    createGoal,
    updateGoalProgress,
    completeGoal,
    updatePrivacySetting,
    publishToHypergraph,
    syncWithWearable,
    exportHealthData,
    isLoading
  }

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  )
}