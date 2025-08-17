import { whoopApi } from './whoopApi'
import { flowAgent } from './flowAgent'

export interface SleepGoal {
  id: string
  title: string
  description: string
  targetScore: number
  duration: number // days
  rewardPerDay: number
  totalReward: number
  startDate: Date
  endDate: Date
  dailyChecks: DailyCheck[]
  status: 'active' | 'completed' | 'failed'
  contractAddress?: string
  blockchainGoalId?: string
}

export interface DailyCheck {
  date: string
  sleepScore: number
  passed: boolean
  verified: boolean
  blockchainTxHash?: string
  payoutTxHash?: string
}

export class SleepGoalWorkflow {
  private static instance: SleepGoalWorkflow
  private goals: Map<string, SleepGoal> = new Map()
  private dailyCheckTime: string = '09:00' // Check sleep data at 9 AM daily

  static getInstance(): SleepGoalWorkflow {
    if (!SleepGoalWorkflow.instance) {
      SleepGoalWorkflow.instance = new SleepGoalWorkflow()
    }
    return SleepGoalWorkflow.instance
  }

  // Step 1: Create the 30-day sleep goal
  async createSleepGoal(): Promise<SleepGoal> {
    console.log('🎯 Step 1: Creating 30-day sleep goal...')
    
    const goal: SleepGoal = {
      id: `sleep_goal_${Date.now()}`,
      title: '30-Day Sleep Improvement Challenge',
      description: 'Improve sleep score to >80 for 30 consecutive days',
      targetScore: 80,
      duration: 30,
      rewardPerDay: 1.0, // $1 per day
      totalReward: 30.0, // $30 total
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      dailyChecks: [],
      status: 'active'
    }

    // Calculate daily check dates
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(goal.startDate)
      checkDate.setDate(checkDate.getDate() + i)
      
      goal.dailyChecks.push({
        date: checkDate.toISOString().split('T')[0],
        sleepScore: 0,
        passed: false,
        verified: false
      })
    }

    this.goals.set(goal.id, goal)
    console.log('✅ Sleep goal created:', goal)
    
    return goal
  }

  // Step 2: Deploy smart contract to blockchain
  async deploySmartContract(goal: SleepGoal): Promise<string> {
    console.log('📦 Step 2: Deploying smart contract to Flow blockchain...')
    
    try {
      // Simulate contract deployment
      const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      const blockchainGoalId = `goal_${Date.now()}`
      
      goal.contractAddress = contractAddress
      goal.blockchainGoalId = blockchainGoalId
      
      console.log('✅ Smart contract deployed!')
      console.log('📍 Contract Address:', contractAddress)
      console.log('🎯 Blockchain Goal ID:', blockchainGoalId)
      
      // Update goal in storage
      this.goals.set(goal.id, goal)
      
      return contractAddress
      
    } catch (error) {
      console.error('❌ Contract deployment failed:', error)
      throw error
    }
  }

  // Step 3: Daily automated data collection and blockchain writing
  async startDailyAutomation(goal: SleepGoal): Promise<void> {
    console.log('🤖 Step 3: Starting daily automation...')
    console.log(`⏰ Will check sleep data daily at ${this.dailyCheckTime}`)
    
    // Schedule daily check
    this.scheduleDailyCheck(goal)
    
    // Run initial check
    await this.performDailyCheck(goal)
  }

  private scheduleDailyCheck(goal: SleepGoal): void {
    // Calculate next check time
    const now = new Date()
    const [checkHour, checkMinute] = this.dailyCheckTime.split(':').map(Number)
    const nextCheck = new Date(now)
    nextCheck.setHours(checkHour, checkMinute, 0, 0)
    
    // If today's check time has passed, schedule for tomorrow
    if (nextCheck <= now) {
      nextCheck.setDate(nextCheck.getDate() + 1)
    }
    
    const timeUntilCheck = nextCheck.getTime() - now.getTime()
    
    console.log(`⏰ Next daily check scheduled for: ${nextCheck.toLocaleString()}`)
    console.log(`⏱️ Time until check: ${Math.round(timeUntilCheck / 1000 / 60)} minutes`)
    
    // Schedule the check
    setTimeout(async () => {
      await this.performDailyCheck(goal)
      // Schedule next day's check
      this.scheduleDailyCheck(goal)
    }, timeUntilCheck)
  }

  private async performDailyCheck(goal: SleepGoal): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    const dailyCheck = goal.dailyChecks.find(check => check.date === today)
    
    if (!dailyCheck) {
      console.log('⚠️ No daily check found for today')
      return
    }

    console.log(`🔍 Step 3a: Performing daily check for ${today}...`)
    
    try {
      // Step 3a: Get sleep data from WHOOP
      console.log('📊 Fetching sleep data from WHOOP...')
      const sleepData = await this.getWhoopSleepData(today)
      
      if (!sleepData) {
        console.log('⚠️ No sleep data available for today')
        return
      }
      
      dailyCheck.sleepScore = sleepData.sleepScore
      dailyCheck.passed = sleepData.sleepScore >= goal.targetScore
      
      console.log(`😴 Sleep Score: ${sleepData.sleepScore}/${goal.targetScore}`)
      console.log(`✅ Passed: ${dailyCheck.passed ? 'YES' : 'NO'}`)
      
      // Step 3b: Write sleep data to blockchain
      console.log('⛓️ Writing sleep data to Flow blockchain...')
      const blockchainTxHash = await this.writeSleepDataToBlockchain(goal, dailyCheck)
      dailyCheck.blockchainTxHash = blockchainTxHash
      
      console.log('✅ Sleep data written to blockchain')
      console.log('🔗 Transaction Hash:', blockchainTxHash)
      
      // Step 3c: Flow Agent queries blockchain and verifies
      console.log('🤖 Flow Agent querying blockchain for verification...')
      const verificationResult = await this.verifyDailyCheck(goal, dailyCheck)
      
      if (verificationResult.verified) {
        dailyCheck.verified = true
        console.log('✅ Daily check verified on blockchain')
        
        // Step 3d: Check if goal completion criteria met
        if (await this.checkGoalCompletion(goal)) {
          console.log('🎉 Goal completion criteria met!')
          await this.executeFinalPayout(goal)
        } else {
          console.log('📝 Goal still in progress...')
        }
      }
      
      // Update goal status
      this.goals.set(goal.id, goal)
      
    } catch (error) {
      console.error('❌ Daily check failed:', error)
    }
  }

  // Get WHOOP sleep data for specific date
  private async getWhoopSleepData(date: string): Promise<{ sleepScore: number } | null> {
    try {
      if (!whoopApi.isAuthenticated()) {
        console.log('🔐 WHOOP not authenticated')
        return null
      }
      
      // Get sleep data for the specific date
      const healthData = await whoopApi.getAllHealthData(1)
      
      if (healthData && healthData.length > 0) {
        const dayData = healthData[0]
        if (dayData.sleep?.score) {
          return { sleepScore: dayData.sleep.score }
        }
      }
      
      return null
      
    } catch (error) {
      console.error('Error getting WHOOP sleep data:', error)
      return null
    }
  }

  // Write sleep data to Flow blockchain
  private async writeSleepDataToBlockchain(goal: SleepGoal, dailyCheck: DailyCheck): Promise<string> {
    try {
      // Simulate blockchain transaction
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      console.log('📝 Writing to blockchain:')
      console.log('   - Goal ID:', goal.blockchainGoalId)
      console.log('   - Date:', dailyCheck.date)
      console.log('   - Sleep Score:', dailyCheck.sleepScore)
      console.log('   - Passed:', dailyCheck.passed)
      
      // In production, this would call the Flow smart contract
      // await flowContract.writeSleepData(goal.blockchainGoalId, dailyCheck)
      
      return txHash
      
    } catch (error) {
      console.error('Error writing to blockchain:', error)
      throw error
    }
  }

  // Flow Agent verifies daily check
  private async verifyDailyCheck(goal: SleepGoal, dailyCheck: DailyCheck): Promise<{ verified: boolean }> {
    try {
      console.log('🔍 Verifying daily check on blockchain...')
      
      // Simulate blockchain verification
      // In production, this would query the Flow smart contract
      const verified = Math.random() > 0.1 // 90% success rate for demo
      
      console.log(`✅ Verification result: ${verified ? 'SUCCESS' : 'FAILED'}`)
      
      return { verified }
      
    } catch (error) {
      console.error('Error verifying daily check:', error)
      return { verified: false }
    }
  }

  // Check if goal completion criteria met
  private async checkGoalCompletion(goal: SleepGoal): Promise<boolean> {
    const verifiedChecks = goal.dailyChecks.filter(check => check.verified && check.passed)
    
    console.log(`📊 Goal Progress: ${verifiedChecks.length}/${goal.duration} days completed`)
    
    if (verifiedChecks.length >= goal.duration) {
      console.log('🎯 Goal completion criteria met!')
      return true
    }
    
    return false
  }

  // Execute final payout
  private async executeFinalPayout(goal: SleepGoal): Promise<void> {
    console.log('💰 Step 3d: Executing final payout...')
    
    try {
      // Calculate total payout
      const successfulDays = goal.dailyChecks.filter(check => check.verified && check.passed).length
      const totalPayout = successfulDays * goal.rewardPerDay
      
      console.log(`🎉 Goal completed! Payout: $${totalPayout}`)
      
      // In production, this would call the Flow smart contract for payout
      const payoutTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      console.log('✅ Payout executed successfully')
      console.log('🔗 Payout Transaction Hash:', payoutTxHash)
      
      // Update goal status
      goal.status = 'completed'
      this.goals.set(goal.id, goal)
      
    } catch (error) {
      console.error('Error executing payout:', error)
    }
  }

  // Get goal status
  getGoalStatus(goalId: string): SleepGoal | null {
    return this.goals.get(goalId) || null
  }

  // Get all goals
  getAllGoals(): SleepGoal[] {
    return Array.from(this.goals.values())
  }

  // Manual trigger for testing
  async triggerManualDailyCheck(goalId: string): Promise<void> {
    const goal = this.goals.get(goalId)
    if (goal) {
      console.log('🔧 Manual daily check triggered')
      await this.performDailyCheck(goal)
    }
  }
}

// Export singleton instance
export const sleepGoalWorkflow = SleepGoalWorkflow.getInstance()
