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
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>Privacy Controls</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', margin: 0 }}>Manage who can access your health data and how it's shared</p>
          </div>
          <Shield style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
        </div>
      </div>

      {/* Privacy Overview */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
        borderRadius: '20px',
        padding: '32px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>Privacy Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          {shareLevels.map((level) => {
            const Icon = level.icon
            const count = privacySettings.filter(s => s.shareLevel === level.value).length
            
            return (
              <div key={level.value} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <Icon style={{ width: '24px', height: '24px', color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>{count}</p>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>{level.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Data Type Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {dataTypes.map((dataType) => {
          const setting = privacySettings.find(s => s.dataType === dataType.value)
          if (!setting) return null
          
          const currentShareLevel = shareLevels.find(l => l.value === setting.shareLevel)
          
          return (
            <motion.div
              key={dataType.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '32px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{dataType.icon}</span>
                  <div>
                    <h3 style={{ fontWeight: '600', color: 'white', margin: '0 0 4px 0', fontSize: '18px' }}>{dataType.label}</h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                      Currently: {currentShareLevel?.label} - {currentShareLevel?.description}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {currentShareLevel && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      <currentShareLevel.icon style={{ width: '16px', height: '16px', color: 'white' }} />
                      <span style={{ fontSize: '14px', color: 'white' }}>{currentShareLevel.label}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Level Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '12px' }}>Share Level</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {shareLevels.map((level) => {
                    const Icon = level.icon
                    const isSelected = setting.shareLevel === level.value
                    
                    return (
                      <button
                        key={level.value}
                        onClick={() => handleShareLevelChange(dataType.value, level.value)}
                        style={{
                          padding: '16px',
                          border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.4)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Icon style={{ width: '16px', height: '16px', color: isSelected ? '#3b82f6' : 'white' }} />
                          <span style={{ fontWeight: '500', fontSize: '14px', color: isSelected ? '#3b82f6' : 'white' }}>{level.label}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>{level.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Authorized Users */}
              {setting.shareLevel !== 'private' && setting.shareLevel !== 'public' && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)' }}>Authorized Users</label>
                    <button
                      onClick={() => setShowAddUser(dataType.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#3b82f6',
                        background: 'none',
                        border: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      <UserPlus style={{ width: '16px', height: '16px' }} />
                      <span>Add User</span>
                    </button>
                  </div>
                  
                  {setting.authorizedUsers.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {setting.authorizedUsers.map((user, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <span style={{ fontSize: '14px', color: 'white', fontFamily: 'monospace' }}>
                            {user.slice(0, 8)}...{user.slice(-6)}
                          </span>
                          <button
                            onClick={() => handleRemoveUser(dataType.value, user)}
                            style={{
                              color: '#ef4444',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic', margin: 0 }}>No authorized users added</p>
                  )}
                  
                  {showAddUser === dataType.value && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{ marginTop: '12px', display: 'flex', gap: '8px' }}
                    >
                      <input
                        type="text"
                        value={newUserAddress}
                        onChange={(e) => setNewUserAddress(e.target.value)}
                        placeholder="Enter wallet address"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          color: 'white',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => handleAddUser(dataType.value)}
                        style={{
                          padding: '8px 16px',
                          background: '#3b82f6',
                          color: 'white',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddUser('')}
                        style={{
                          padding: '8px 16px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '8px',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Public Graph Publishing */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div>
                  <p style={{ fontWeight: '500', color: 'white', margin: '0 0 4px 0' }}>Allow Public Graph Publishing</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Enable this data to be published to The Graph hypergraph</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={setting.allowPublicGraph}
                    onChange={(e) => handlePublicGraphToggle(dataType.value, e.target.checked)}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    background: setting.allowPublicGraph ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: setting.allowPublicGraph ? '22px' : '2px',
                      width: '20px',
                      height: '20px',
                      background: 'white',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease'
                    }}></div>
                  </div>
                </label>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Hypergraph Publishing */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '32px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 4px 0' }}>Hypergraph Publishing</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Publish your health data to The Graph Protocol hypergraph</p>
          </div>
          <Globe style={{ width: '24px', height: '24px', color: '#a855f7' }} />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px', margin: '0 0 12px 0' }}>
            Data types enabled for public graph publishing:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {privacySettings.filter(s => s.allowPublicGraph).map((setting) => {
              const dataType = dataTypes.find(d => d.value === setting.dataType)
              return (
                <span key={setting.dataType} style={{
                  padding: '6px 12px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#a855f7',
                  borderRadius: '20px',
                  fontSize: '14px',
                  border: '1px solid rgba(168, 85, 247, 0.3)'
                }}>
                  {dataType?.icon} {dataType?.label}
                </span>
              )
            })}
          </div>
          {privacySettings.filter(s => s.allowPublicGraph).length === 0 && (
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic', margin: 0 }}>No data types enabled for public publishing</p>
          )}
        </div>
        
        <button
          onClick={handlePublishToHypergraph}
          disabled={isLoading || privacySettings.filter(s => s.allowPublicGraph).length === 0}
          style={{
            width: '100%',
            background: isLoading || privacySettings.filter(s => s.allowPublicGraph).length === 0 
              ? 'rgba(168, 85, 247, 0.5)'
              : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
            color: 'white',
            padding: '14px 24px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading || privacySettings.filter(s => s.allowPublicGraph).length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(168, 85, 247, 0.3)'
          }}
        >
          {isLoading ? 'Publishing...' : 'Publish to Public Hypergraph'}
        </button>
        
        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '12px', margin: '12px 0 0 0' }}>
          Publishing to the hypergraph makes your data discoverable and can help you connect with others on similar health journeys.
        </p>
      </div>

      {/* Access Log */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '32px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>Recent Access Log</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Mock access log - in production this would come from the smart contract */}
          <div style={{
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
              <Eye style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.6)' }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: '0 0 4px 0' }}>Family Member Access</p>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>0x742d...8b5e accessed your sleep data</p>
              </div>
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>2 hours ago</span>
          </div>
          
          <div style={{
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
              <Eye style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.6)' }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: '0 0 4px 0' }}>Medical Provider Access</p>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Dr. Smith accessed your blood pressure data</p>
              </div>
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}