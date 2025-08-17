'use client'

import { useState, useEffect } from 'react'
import { Layout } from '../../components/Layout'
import { sleepGoalWorkflow, SleepGoal } from '../../lib/sleepGoalWorkflow'

export default function SleepWorkflowDemo() {
  const [currentStep, setCurrentStep] = useState(1)
  const [goal, setGoal] = useState<SleepGoal | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // Step 1: Create the 30-day sleep goal
  const createSleepGoal = async () => {
    try {
      addLog('🎯 Step 1: Creating 30-day sleep goal...')
      const newGoal = await sleepGoalWorkflow.createSleepGoal()
      setGoal(newGoal)
      setCurrentStep(2)
      addLog('✅ Sleep goal created successfully!')
    } catch (error) {
      addLog(`❌ Error creating goal: ${error}`)
    }
  }

  // Step 2: Deploy smart contract
  const deploySmartContract = async () => {
    if (!goal) return
    
    try {
      addLog('📦 Step 2: Deploying smart contract to Flow blockchain...')
      const contractAddress = await sleepGoalWorkflow.deploySmartContract(goal)
      setGoal({ ...goal, contractAddress })
      setCurrentStep(3)
      addLog(`✅ Smart contract deployed! Address: ${contractAddress}`)
    } catch (error) {
      addLog(`❌ Error deploying contract: ${error}`)
    }
  }

  // Step 3: Start daily automation
  const startDailyAutomation = async () => {
    if (!goal) return
    
    try {
      addLog('🤖 Step 3: Starting daily automation...')
      await sleepGoalWorkflow.startDailyAutomation(goal)
      setIsRunning(true)
      addLog('✅ Daily automation started! Will check sleep data daily at 9 AM')
      addLog('💡 For demo purposes, you can trigger manual checks below')
    } catch (error) {
      addLog(`❌ Error starting automation: ${error}`)
    }
  }

  // Manual daily check for testing
  const triggerManualCheck = async () => {
    if (!goal) return
    
    try {
      addLog('🔧 Triggering manual daily check...')
      await sleepGoalWorkflow.triggerManualDailyCheck(goal.id)
      
      // Refresh goal status
      const updatedGoal = sleepGoalWorkflow.getGoalStatus(goal.id)
      if (updatedGoal) {
        setGoal(updatedGoal)
        addLog('✅ Manual check completed! Check goal status below')
      }
    } catch (error) {
      addLog(`❌ Error in manual check: ${error}`)
    }
  }

  // Reset demo
  const resetDemo = () => {
    setCurrentStep(1)
    setGoal(null)
    setIsRunning(false)
    setLogs([])
    addLog('🔄 Demo reset. Ready to start over!')
  }

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
        {/* Header */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.15)', 
          borderRadius: '20px', 
          padding: '32px', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0 0 16px 0' }}>
            30-Day Sleep Goal Workflow Demo
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px', margin: '0 0 24px 0' }}>
            Complete demonstration of the automated health goal verification system
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: currentStep >= 1 ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              1
            </div>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: currentStep >= 2 ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              2
            </div>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: currentStep >= 3 ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              3
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Create Goal</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>→</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Deploy Contract</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>→</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Start Automation</span>
          </div>
        </div>

        {/* Step Controls */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.15)', 
          borderRadius: '20px', 
          padding: '32px', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
            Workflow Steps
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Step 1 */}
            <div style={{ 
              background: currentStep >= 1 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${currentStep >= 1 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  Step 1: Create 30-Day Sleep Goal
                </h3>
                <span style={{ 
                  background: currentStep >= 1 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                  color: currentStep >= 1 ? '#22c55e' : '#9ca3af',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}>
                  {currentStep >= 1 ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
              
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '0 0 16px 0' }}>
                Create a sleep improvement goal: achieve sleep score >80 for 30 consecutive days, earning $1 per day.
              </p>
              
              <button
                onClick={createSleepGoal}
                disabled={currentStep > 1}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: currentStep > 1 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.8)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: currentStep > 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {currentStep > 1 ? '✅ Completed' : 'Create Sleep Goal'}
              </button>
            </div>

            {/* Step 2 */}
            <div style={{ 
              background: currentStep >= 2 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${currentStep >= 2 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  Step 2: Deploy Smart Contract
                </h3>
                <span style={{ 
                  background: currentStep >= 2 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                  color: currentStep >= 2 ? '#3b82f6' : '#9ca3af',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}>
                  {currentStep >= 2 ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
              
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '0 0 16px 0' }}>
                Deploy the HealthRewards smart contract to Flow testnet blockchain for automated verification.
              </p>
              
              <button
                onClick={deploySmartContract}
                disabled={currentStep < 2 || currentStep > 2}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: currentStep < 2 || currentStep > 2 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: currentStep < 2 || currentStep > 2 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {currentStep > 2 ? '✅ Completed' : currentStep < 2 ? 'Waiting for Step 1' : 'Deploy to Flow Testnet'}
              </button>
            </div>

            {/* Step 3 */}
            <div style={{ 
              background: currentStep >= 3 ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${currentStep >= 3 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                  Step 3: Start Daily Automation
                </h3>
                <span style={{ 
                  background: currentStep >= 3 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                  color: currentStep >= 3 ? '#8b5cf6' : '#9ca3af',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}>
                  {currentStep >= 3 ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
              
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '0 0 16px 0' }}>
                Start automated daily verification: WHOOP data → Blockchain → Flow Agent verification → Automatic payout.
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={startDailyAutomation}
                  disabled={currentStep < 3}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: currentStep < 3 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.8)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: currentStep < 3 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {currentStep < 3 ? 'Waiting for Step 2' : 'Start Daily Automation'}
                </button>
                
                {isRunning && (
                  <button
                    onClick={triggerManualCheck}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(34, 197, 94, 0.8)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🔧 Manual Check
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Goal Status */}
        {goal && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.15)', 
            borderRadius: '20px', 
            padding: '32px', 
            backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
              Goal Status
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 12px 0' }}>
                  Goal Details
                </h3>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                  <div><strong>Title:</strong> {goal.title}</div>
                  <div><strong>Target Score:</strong> {goal.targetScore}</div>
                  <div><strong>Duration:</strong> {goal.duration} days</div>
                  <div><strong>Reward per Day:</strong> ${goal.rewardPerDay}</div>
                  <div><strong>Total Reward:</strong> ${goal.totalReward}</div>
                  <div><strong>Status:</strong> {goal.status}</div>
                </div>
              </div>
              
              <div>
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 12px 0' }}>
                  Blockchain Info
                </h3>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                  {goal.contractAddress && (
                    <div><strong>Contract Address:</strong> {goal.contractAddress}</div>
                  )}
                  {goal.blockchainGoalId && (
                    <div><strong>Blockchain Goal ID:</strong> {goal.blockchainGoalId}</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Daily Progress */}
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>
              Daily Progress
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '8px' }}>
              {goal.dailyChecks.slice(0, 30).map((check, index) => (
                <div
                  key={index}
                  style={{
                    background: check.verified 
                      ? check.passed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(156, 163, 175, 0.2)',
                    border: `1px solid ${check.verified 
                      ? check.passed ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'
                      : 'rgba(156, 163, 175, 0.4)'}`,
                    borderRadius: '8px',
                    padding: '8px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'white',
                    fontWeight: '600'
                  }}
                >
                  {check.verified ? (check.passed ? '✅' : '❌') : '⏳'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Logs */}
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.3)', 
          borderRadius: '20px', 
          padding: '32px', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: 0 }}>
              System Logs
            </h2>
            <button
              onClick={resetDemo}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.8)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Reset Demo
            </button>
          </div>
          
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.5)', 
            borderRadius: '12px', 
            padding: '16px',
            maxHeight: '400px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.4'
          }}>
            {logs.length === 0 ? (
              <div style={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: '20px' }}>
                No logs yet. Start the workflow to see system activity.
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  marginBottom: '4px',
                  padding: '4px 0'
                }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
