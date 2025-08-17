import { whoopApi } from './whoopApi'

export interface GoalVerificationResult {
  isSuccessful: boolean
  message: string
  consecutiveDays: number
  data: any
  timestamp: Date
}

export interface SmartContractGoal {
  id: string
  title: string
  description: string
  targetValue: number
  reward: number
  deadline: Date
  sponsor: string
  healthDataType: string
  verificationConditions: string[]
  verificationType: 'automatic' | 'manual'
  isCompleted: boolean
  isVerified: boolean
  consecutiveSuccessDays: number
  lastVerificationAttempt?: Date
}

export class GoalVerificationService {
  private static instance: GoalVerificationService
  private verificationInterval: NodeJS.Timeout | null = null
  private isRunning = false

  static getInstance(): GoalVerificationService {
    if (!GoalVerificationService.instance) {
      GoalVerificationService.instance = new GoalVerificationService()
    }
    return GoalVerificationService.instance
  }

  // Start automated verification process
  async startAutomatedVerification(): Promise<void> {
    if (this.isRunning) {
      console.log('🔍 Automated verification already running')
      return
    }

    console.log('🚀 Starting automated goal verification service...')
    this.isRunning = true

    // Run verification every hour
    this.verificationInterval = setInterval(async () => {
      await this.runVerificationCycle()
    }, 60 * 60 * 1000) // 1 hour

    // Run initial verification
    await this.runVerificationCycle()
  }

  // Stop automated verification
  stopAutomatedVerification(): void {
    if (this.verificationInterval) {
      clearInterval(this.verificationInterval)
      this.verificationInterval = null
    }
    this.isRunning = false
    console.log('⏹️ Automated goal verification service stopped')
  }

  // Main verification cycle
  private async runVerificationCycle(): Promise<void> {
    try {
      console.log('🔄 Running verification cycle...')
      
      // Get active goals that need verification
      const activeGoals = await this.getActiveGoals()
      
      if (activeGoals.length === 0) {
        console.log('📝 No active goals to verify')
        return
      }

      console.log(`🎯 Found ${activeGoals.length} active goals to verify`)

      // Get latest WHOOP data
      const whoopData = await this.getLatestWhoopData()
      
      if (!whoopData || whoopData.length === 0) {
        console.log('⚠️ No WHOOP data available for verification')
        return
      }

      // Verify each goal
      for (const goal of activeGoals) {
        if (goal.verificationType === 'automatic') {
          await this.verifyGoal(goal, whoopData)
        }
      }

      console.log('✅ Verification cycle completed')
    } catch (error) {
      console.error('❌ Error in verification cycle:', error)
    }
  }

  // Get active goals from smart contract or local storage
  private async getActiveGoals(): Promise<SmartContractGoal[]> {
    try {
      // TODO: Integrate with Flow smart contract
      // For now, return goals from local storage
      const goals = this.getGoalsFromLocalStorage()
      return goals.filter(goal => 
        !goal.isCompleted && 
        goal.verificationType === 'automatic' &&
        new Date() <= goal.deadline
      )
    } catch (error) {
      console.error('Error getting active goals:', error)
      return []
    }
  }

  // Get latest WHOOP data for verification
  private async getLatestWhoopData(): Promise<any[]> {
    try {
      if (!whoopApi.isAuthenticated()) {
        console.log('🔐 WHOOP not authenticated, skipping verification')
        return []
      }

      // Get last 30 days of data for comprehensive verification
      const healthData = await whoopApi.getAllHealthData(30)
      
      if (!healthData || !Array.isArray(healthData)) {
        console.log('⚠️ Invalid WHOOP data received')
        return []
      }

      // Transform WHOOP data to verification format
      return this.transformWhoopDataForVerification(healthData)
    } catch (error) {
      console.error('Error getting WHOOP data:', error)
      return []
    }
  }

  // Transform WHOOP data to verification format
  private transformWhoopDataForVerification(whoopData: any[]): any[] {
    return whoopData.map(day => ({
      date: day.date || day.created_at,
      sleepScore: day.sleep?.score || day.sleep_score,
      steps: day.workout?.steps || day.steps,
      heartRate: day.workout?.heart_rate?.average || day.heart_rate,
      recoveryScore: day.recovery?.score || day.recovery_score,
      strainScore: day.workout?.strain || day.strain_score,
      weight: day.body?.weight || day.weight
    })).filter(day => day.date) // Filter out entries without dates
  }

  // Verify a specific goal against WHOOP data
  private async verifyGoal(goal: SmartContractGoal, whoopData: any[]): Promise<GoalVerificationResult> {
    try {
      console.log(`🔍 Verifying goal: ${goal.title}`)
      
      const result = await this.performGoalVerification(goal, whoopData)
      
      if (result.isSuccessful) {
        console.log(`✅ Goal verification successful: ${goal.title}`)
        await this.handleSuccessfulVerification(goal, result)
      } else {
        console.log(`❌ Goal verification failed: ${goal.title}`)
      }

      // Update goal status
      await this.updateGoalStatus(goal.id, result)
      
      return result
    } catch (error) {
      console.error(`Error verifying goal ${goal.title}:`, error)
      return {
        isSuccessful: false,
        message: `Verification error: ${error}`,
        consecutiveDays: 0,
        data: {},
        timestamp: new Date()
      }
    }
  }

  // Perform the actual goal verification logic
  private async performGoalVerification(goal: SmartContractGoal, whoopData: any[]): Promise<GoalVerificationResult> {
    const { healthDataType, targetValue, verificationConditions } = goal
    
    // Sort data by date (most recent first)
    const sortedData = whoopData
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(day => day.date)

    let consecutiveDays = 0
    let verificationData: any = {}

    // Check consecutive days based on health data type
    switch (healthDataType) {
      case 'sleep':
        consecutiveDays = this.checkSleepGoal(sortedData, targetValue, verificationConditions)
        break
      case 'steps':
        consecutiveDays = this.checkStepsGoal(sortedData, targetValue, verificationConditions)
        break
      case 'recovery':
        consecutiveDays = this.checkRecoveryGoal(sortedData, targetValue, verificationConditions)
        break
      case 'strain':
        consecutiveDays = this.checkStrainGoal(sortedData, targetValue, verificationConditions)
        break
      default:
        console.log(`⚠️ Unknown health data type: ${healthDataType}`)
        return {
          isSuccessful: false,
          message: `Unknown health data type: ${healthDataType}`,
          consecutiveDays: 0,
          data: {},
          timestamp: new Date()
        }
    }

    // Check if goal completion criteria are met
    const isSuccessful = this.checkGoalCompletionCriteria(verificationConditions, consecutiveDays)
    
    return {
      isSuccessful,
      message: isSuccessful ? 'Goal verification successful' : 'Goal verification failed',
      consecutiveDays,
      data: verificationData,
      timestamp: new Date()
    }
  }

  // Check sleep goal verification
  private checkSleepGoal(data: any[], target: number, conditions: string[]): number {
    let consecutiveDays = 0
    
    for (const day of data) {
      if (day.sleepScore && day.sleepScore >= target) {
        consecutiveDays++
      } else {
        break
      }
    }
    
    return consecutiveDays
  }

  // Check steps goal verification
  private checkStepsGoal(data: any[], target: number, conditions: string[]): number {
    let consecutiveDays = 0
    
    for (const day of data) {
      if (day.steps && day.steps >= target) {
        consecutiveDays++
      } else {
        break
      }
    }
    
    return consecutiveDays
  }

  // Check recovery goal verification
  private checkRecoveryGoal(data: any[], target: number, conditions: string[]): number {
    let consecutiveDays = 0
    
    for (const day of data) {
      if (day.recoveryScore && day.recoveryScore >= target) {
        consecutiveDays++
      } else {
        break
      }
    }
    
    return consecutiveDays
  }

  // Check strain goal verification
  private checkStrainGoal(data: any[], target: number, conditions: string[]): number {
    let consecutiveDays = 0
    
    for (const day of data) {
      if (day.strainScore && day.strainScore <= target) {
        consecutiveDays++
      } else {
        break
      }
    }
    
    return consecutiveDays
  }

  // Check if goal completion criteria are met
  private checkGoalCompletionCriteria(conditions: string[], consecutiveDays: number): boolean {
    for (const condition of conditions) {
      if (condition.includes('consecutive_days')) {
        const requiredDays = this.extractNumberFromCondition(condition)
        if (consecutiveDays >= requiredDays) {
          return true
        }
      } else if (condition.includes('consecutive_nights')) {
        const requiredNights = this.extractNumberFromCondition(condition)
        if (consecutiveDays >= requiredNights) {
          return true
        }
      }
    }
    return false
  }

  // Extract number from condition string
  private extractNumberFromCondition(condition: string): number {
    const parts = condition.split(' ')
    for (const part of parts) {
      const num = parseInt(part)
      if (!isNaN(num)) {
        return num
      }
    }
    return 0
  }

  // Handle successful goal verification
  private async handleSuccessfulVerification(goal: SmartContractGoal, result: GoalVerificationResult): Promise<void> {
    try {
      console.log(`🎉 Goal completed: ${goal.title}`)
      
      // TODO: Integrate with Flow smart contract for reward distribution
      // For now, update local storage
      this.updateGoalCompletion(goal.id, result)
      
      // Trigger reward distribution
      await this.distributeReward(goal)
      
    } catch (error) {
      console.error('Error handling successful verification:', error)
    }
  }

  // Update goal status after verification
  private async updateGoalStatus(goalId: string, result: GoalVerificationResult): Promise<void> {
    try {
      // TODO: Update Flow smart contract
      // For now, update local storage
      this.updateGoalInLocalStorage(goalId, result)
    } catch (error) {
      console.error('Error updating goal status:', error)
    }
  }

  // Distribute reward for completed goal
  private async distributeReward(goal: SmartContractGoal): Promise<void> {
    try {
      console.log(`💰 Distributing reward: ${goal.reward} FLOW for goal: ${goal.title}`)
      
      // TODO: Integrate with Flow smart contract for actual token transfer
      // For now, just log the reward
      
      // Emit event for UI updates
      this.emitRewardDistributed(goal.id, goal.reward)
      
    } catch (error) {
      console.error('Error distributing reward:', error)
    }
  }

  // Local storage methods (temporary until Flow integration)
  private getGoalsFromLocalStorage(): SmartContractGoal[] {
    try {
      const goals = localStorage.getItem('smartContractGoals')
      return goals ? JSON.parse(goals) : []
    } catch (error) {
      console.error('Error reading goals from localStorage:', error)
      return []
    }
  }

  private updateGoalInLocalStorage(goalId: string, result: GoalVerificationResult): void {
    try {
      const goals = this.getGoalsFromLocalStorage()
      const goalIndex = goals.findIndex(g => g.id === goalId)
      
      if (goalIndex !== -1) {
        goals[goalIndex].consecutiveSuccessDays = result.consecutiveDays
        goals[goalIndex].lastVerificationAttempt = result.timestamp
        
        if (result.isSuccessful) {
          goals[goalIndex].isVerified = true
        }
        
        localStorage.setItem('smartContractGoals', JSON.stringify(goals))
      }
    } catch (error) {
      console.error('Error updating goal in localStorage:', error)
    }
  }

  private updateGoalCompletion(goalId: string, result: GoalVerificationResult): void {
    try {
      const goals = this.getGoalsFromLocalStorage()
      const goalIndex = goals.findIndex(g => g.id === goalId)
      
      if (goalIndex !== -1) {
        goals[goalIndex].isCompleted = true
        goals[goalIndex].isVerified = true
        goals[goalIndex].consecutiveSuccessDays = result.consecutiveDays
        
        localStorage.setItem('smartContractGoals', JSON.stringify(goals))
      }
    } catch (error) {
      console.error('Error updating goal completion:', error)
    }
  }

  // Event emission for UI updates
  private emitRewardDistributed(goalId: string, reward: number): void {
    const event = new CustomEvent('goalRewardDistributed', {
      detail: { goalId, reward }
    })
    window.dispatchEvent(event)
  }

  // Manual goal verification (for testing)
  async verifyGoalManually(goalId: string): Promise<GoalVerificationResult> {
    try {
      const goals = this.getGoalsFromLocalStorage()
      const goal = goals.find(g => g.id === goalId)
      
      if (!goal) {
        throw new Error('Goal not found')
      }

      const whoopData = await this.getLatestWhoopData()
      return await this.verifyGoal(goal, whoopData)
      
    } catch (error) {
      console.error('Manual goal verification failed:', error)
      return {
        isSuccessful: false,
        message: `Manual verification failed: ${error}`,
        consecutiveDays: 0,
        data: {},
        timestamp: new Date()
      }
    }
  }

  // Get verification statistics
  getVerificationStats(): {
    totalGoals: number
    activeGoals: number
    completedGoals: number
    pendingVerification: number
  } {
    try {
      const goals = this.getGoalsFromLocalStorage()
      
      return {
        totalGoals: goals.length,
        activeGoals: goals.filter(g => !g.isCompleted).length,
        completedGoals: goals.filter(g => g.isCompleted).length,
        pendingVerification: goals.filter(g => 
          !g.isCompleted && 
          g.verificationType === 'automatic'
        ).length
      }
    } catch (error) {
      console.error('Error getting verification stats:', error)
      return {
        totalGoals: 0,
        activeGoals: 0,
        completedGoals: 0,
        pendingVerification: 0
      }
    }
  }
}

// Export singleton instance
export const goalVerificationService = GoalVerificationService.getInstance()
