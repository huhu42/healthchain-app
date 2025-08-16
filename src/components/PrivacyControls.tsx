'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Eye, Globe, Lock, UserPlus, Trash2 } from 'lucide-react'
import { useHealthData } from '../contexts/HealthDataContext'

export const PrivacyControls = () => {
  const { privacySettings, updatePrivacySetting, publishToHypergraph, isLoading } = useHealthData()
  const [showAddUser, setShowAddUser] = useState('')
  const [newUserAddress, setNewUserAddress] = useState('')

  const shareLevels = [
    { value: 'private', label: 'Private', icon: Lock, description: 'Only you can access this data' },
    { value: 'family', label: 'Family', icon: Users, description: 'Family members can access this data' },
    { value: 'medical', label: 'Medical', icon: Eye, description: 'Medical providers and family can access' },
    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can access this data' },
  ]

  const dataTypes = [
    { value: 'sleep', label: 'Sleep Data', icon: '🌙' },
    { value: 'steps', label: 'Steps & Activity', icon: '👟' },
    { value: 'heart_rate', label: 'Heart Rate', icon: '❤️' },
    { value: 'blood_pressure', label: 'Blood Pressure', icon: '🩺' },
    { value: 'weight', label: 'Weight', icon: '⚖️' },
  ]

  const handleShareLevelChange = (dataType: string, shareLevel: string) => {
    updatePrivacySetting(dataType, { shareLevel: shareLevel as any })
  }

  const handlePublicGraphToggle = (dataType: string, allow: boolean) => {
    updatePrivacySetting(dataType, { allowPublicGraph: allow })
  }

  const handleAddUser = (dataType: string) => {
    if (!newUserAddress.trim()) return
    
    const setting = privacySettings.find(s => s.dataType === dataType)
    if (setting) {
      const updatedUsers = [...setting.authorizedUsers, newUserAddress.trim()]
      updatePrivacySetting(dataType, { authorizedUsers: updatedUsers })
    }
    
    setNewUserAddress('')
    setShowAddUser('')
  }

  const handleRemoveUser = (dataType: string, userAddress: string) => {
    const setting = privacySettings.find(s => s.dataType === dataType)
    if (setting) {
      const updatedUsers = setting.authorizedUsers.filter(addr => addr !== userAddress)
      updatePrivacySetting(dataType, { authorizedUsers: updatedUsers })
    }
  }

  const handlePublishToHypergraph = async () => {
    try {
      const publicDataTypes = privacySettings
        .filter(s => s.allowPublicGraph)
        .map(s => s.dataType)
      
      if (publicDataTypes.length === 0) {
        alert('No data types are enabled for public graph publishing')
        return
      }

      const graphId = await publishToHypergraph(publicDataTypes, true)
      alert(`Successfully published to hypergraph! Graph ID: ${graphId}`)
    } catch (error) {
      console.error('Failed to publish to hypergraph:', error)
      alert('Failed to publish to hypergraph. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Privacy Controls</h2>
            <p className="text-gray-600 mt-1">Manage who can access your health data and how it's shared</p>
          </div>
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Privacy Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {shareLevels.map((level) => {
            const Icon = level.icon
            const count = privacySettings.filter(s => s.shareLevel === level.value).length
            
            return (
              <div key={level.value} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">{level.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Data Type Controls */}
      <div className="space-y-4">
        {dataTypes.map((dataType) => {
          const setting = privacySettings.find(s => s.dataType === dataType.value)
          if (!setting) return null
          
          const currentShareLevel = shareLevels.find(l => l.value === setting.shareLevel)
          
          return (
            <motion.div
              key={dataType.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{dataType.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{dataType.label}</h3>
                    <p className="text-sm text-gray-600">
                      Currently: {currentShareLevel?.label} - {currentShareLevel?.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {currentShareLevel && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full">
                      <currentShareLevel.icon className="w-4 h-4" />
                      <span className="text-sm">{currentShareLevel.label}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Level Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Share Level</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {shareLevels.map((level) => {
                    const Icon = level.icon
                    const isSelected = setting.shareLevel === level.value
                    
                    return (
                      <button
                        key={level.value}
                        onClick={() => handleShareLevelChange(dataType.value, level.value)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium text-sm">{level.label}</span>
                        </div>
                        <p className="text-xs text-gray-600">{level.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Authorized Users */}
              {setting.shareLevel !== 'private' && setting.shareLevel !== 'public' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Authorized Users</label>
                    <button
                      onClick={() => setShowAddUser(dataType.value)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add User</span>
                    </button>
                  </div>
                  
                  {setting.authorizedUsers.length > 0 ? (
                    <div className="space-y-2">
                      {setting.authorizedUsers.map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700 font-mono">
                            {user.slice(0, 8)}...{user.slice(-6)}
                          </span>
                          <button
                            onClick={() => handleRemoveUser(dataType.value, user)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No authorized users added</p>
                  )}
                  
                  {showAddUser === dataType.value && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 flex space-x-2"
                    >
                      <input
                        type="text"
                        value={newUserAddress}
                        onChange={(e) => setNewUserAddress(e.target.value)}
                        placeholder="Enter wallet address"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => handleAddUser(dataType.value)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddUser('')}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Public Graph Publishing */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Allow Public Graph Publishing</p>
                  <p className="text-sm text-gray-600">Enable this data to be published to The Graph hypergraph</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setting.allowPublicGraph}
                    onChange={(e) => handlePublicGraphToggle(dataType.value, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Hypergraph Publishing */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hypergraph Publishing</h3>
            <p className="text-gray-600">Publish your health data to The Graph Protocol hypergraph</p>
          </div>
          <Globe className="w-6 h-6 text-purple-600" />
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Data types enabled for public graph publishing:
          </p>
          <div className="flex flex-wrap gap-2">
            {privacySettings.filter(s => s.allowPublicGraph).map((setting) => {
              const dataType = dataTypes.find(d => d.value === setting.dataType)
              return (
                <span key={setting.dataType} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {dataType?.icon} {dataType?.label}
                </span>
              )
            })}
          </div>
          {privacySettings.filter(s => s.allowPublicGraph).length === 0 && (
            <p className="text-sm text-gray-500 italic">No data types enabled for public publishing</p>
          )}
        </div>
        
        <button
          onClick={handlePublishToHypergraph}
          disabled={isLoading || privacySettings.filter(s => s.allowPublicGraph).length === 0}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Publishing...' : 'Publish to Public Hypergraph'}
        </button>
        
        <p className="text-xs text-gray-500 mt-2">
          Publishing to the hypergraph makes your data discoverable and can help you connect with others on similar health journeys.
        </p>
      </div>

      {/* Access Log */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Access Log</h3>
        <div className="space-y-2">
          {/* Mock access log - in production this would come from the smart contract */}
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Eye className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Family Member Access</p>
                <p className="text-xs text-gray-500">0x742d...8b5e accessed your sleep data</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Eye className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Medical Provider Access</p>
                <p className="text-xs text-gray-500">Dr. Smith accessed your blood pressure data</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}