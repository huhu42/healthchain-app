'use client'

import React, { useState, useEffect } from 'react'
import { usePrivateHypergraph } from '../utils/privateHypergraph'
import { 
  IHealthDataPoint, 
  IUserProfile, 
  IHealthGoal,
  HealthDataType,
  PrivacyLevel,
  GoalType,
  GoalStatus
} from '../types/schema'

export const PrivateDataExample: React.FC = () => {
  const [userId] = useState('user_123') // In real app, get from auth context
  const [healthData, setHealthData] = useState<IHealthDataPoint[]>([])
  const [profile, setProfile] = useState<IUserProfile | null>(null)
  const [goals, setGoals] = useState<IHealthGoal[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const {
    createPrivateHealthDataPoint,
    getPrivateHealthDataPoints,
    upsertPrivateUserProfile,
    getPrivateUserProfile,
    createPrivateHealthGoal,
    updateGoalProgress,
    getAllPrivateUserData,
  } = usePrivateHypergraph()

  // Load all private data on component mount
  useEffect(() => {
    loadAllPrivateData()
  }, [userId])

  const loadAllPrivateData = async () => {
    setLoading(true)
    try {
      const allData = await getAllPrivateUserData(userId)
      setHealthData(allData.healthData)
      setProfile(allData.profile)
      setGoals(allData.goals)
      setMessage('Private data loaded successfully!')
    } catch (error) {
      setMessage(`Error loading data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  // Example: Create a private health data point
  const handleCreateHealthData = async () => {
    const newDataPoint: Omit<IHealthDataPoint, 'privacyLevel'> = {
      type: 'STEPS',
      value: 8500,
      unit: 'steps',
      timestamp: Date.now(),
      verified: true,
      source: 'WHOOP',
      userId: userId,
      metadata: JSON.stringify({ location: 'home', activity: 'walking' }),
    }

    try {
      const result = await createPrivateHealthDataPoint(newDataPoint)
      if (result.success) {
        setMessage('Health data point created successfully!')
        loadAllPrivateData() // Reload data
      } else {
        setMessage(`Failed to create data point: ${result.error}`)
      }
    } catch (error) {
      setMessage(`Error creating data point: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Example: Create a private user profile
  const handleCreateProfile = async () => {
    const newProfile: Omit<IUserProfile, 'createdAt' | 'updatedAt'> = {
      userId: userId,
      username: 'health_enthusiast',
      email: 'user@example.com',
      displayName: 'Health Enthusiast',
      bio: 'Passionate about health and wellness',
      fitnessLevel: 'INTERMEDIATE',
      goals: JSON.stringify([]),
      privacySettings: JSON.stringify({ defaultVisibility: 'PRIVATE' }),
    }

    try {
      const result = await upsertPrivateUserProfile(newProfile)
      if (result.success) {
        setMessage('Profile created successfully!')
        loadAllPrivateData() // Reload data
      } else {
        setMessage(`Failed to create profile: ${result.error}`)
      }
    } catch (error) {
      setMessage(`Error creating profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Example: Create a private health goal
  const handleCreateGoal = async () => {
    const newGoal: Omit<IHealthGoal, 'goalId' | 'createdAt' | 'updatedAt'> = {
      userId: userId,
      title: 'Daily Steps Goal',
      description: 'Walk 10,000 steps every day',
      type: 'FITNESS',
      targetValue: 10000,
      currentValue: 0,
      unit: 'steps',
      status: 'ACTIVE',
      progress: 0,
      milestones: JSON.stringify([
        { value: 5000, description: 'Halfway there!' },
        { value: 7500, description: 'Almost there!' },
        { value: 10000, description: 'Goal achieved!' }
      ]),
    }

    try {
      const result = await createPrivateHealthGoal(newGoal)
      if (result.success) {
        setMessage('Health goal created successfully!')
        loadAllPrivateData() // Reload data
      } else {
        setMessage(`Failed to create goal: ${result.error}`)
      }
    } catch (error) {
      setMessage(`Error creating goal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Example: Update goal progress
  const handleUpdateGoalProgress = async (goalId: string, currentValue: number) => {
    const progress = Math.min((currentValue / 10000) * 100, 100) // Assuming 10k step goal
    
    try {
      const result = await updateGoalProgress(goalId, currentValue, progress)
      if (result.success) {
        setMessage('Goal progress updated successfully!')
        loadAllPrivateData() // Reload data
      } else {
        setMessage(`Failed to update goal: ${result.error}`)
      }
    } catch (error) {
      setMessage(`Error updating goal: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Private Hypergraph Data Management
        </h2>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={handleCreateHealthData}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Health Data
          </button>
          
          <button
            onClick={handleCreateProfile}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Profile
          </button>
          
          <button
            onClick={handleCreateGoal}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Goal
          </button>
          
          <button
            onClick={loadAllPrivateData}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
            {message}
          </div>
        )}

        {/* Data Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Data Points */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Private Health Data ({healthData.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {healthData.map((data, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-gray-700">{data.type}</span>
                      <span className="ml-2 text-gray-600">{data.value} {data.unit}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(data.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Source: {data.source} • Privacy: {data.privacyLevel}
                  </div>
                </div>
              ))}
              {healthData.length === 0 && (
                <p className="text-gray-500 text-sm">No health data points yet</p>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Private User Profile
            </h3>
            {profile ? (
              <div className="bg-white p-3 rounded border">
                <div className="space-y-2">
                  <div><span className="font-medium">Username:</span> {profile.username}</div>
                  <div><span className="font-medium">Display Name:</span> {profile.displayName}</div>
                  <div><span className="font-medium">Fitness Level:</span> {profile.fitnessLevel}</div>
                  <div><span className="font-medium">Bio:</span> {profile.bio}</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No profile created yet</p>
            )}
          </div>

          {/* Health Goals */}
          <div className="bg-gray-50 rounded-lg p-4 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Private Health Goals ({goals.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal, index) => (
                <div key={index} className="bg-white p-4 rounded border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{goal.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      goal.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      goal.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span>{goal.progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                    </div>
                  </div>
                  
                  {/* Update Progress Button */}
                  <button
                    onClick={() => handleUpdateGoalProgress(goal.goalId, goal.currentValue + 1000)}
                    className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Update Progress (+1000)
                  </button>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="text-gray-500 text-sm lg:col-span-2">No health goals created yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivateDataExample
