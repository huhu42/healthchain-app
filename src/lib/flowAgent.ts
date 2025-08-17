import { goalVerificationService } from './goalVerificationService'
import { whoopApi } from './whoopApi'

export interface FlowAgentConfig {
  verificationInterval: number // milliseconds
  whoopDataDays: number // how many days of data to fetch
  autoPayout: boolean
  flowNetwork: 'emulator' | 'testnet' | 'mainnet'
}

export class FlowAgent {
  private static instance: FlowAgent
  private isRunning = false
  private verificationInterval: NodeJS.Timeout | null = null
  private config: FlowAgentConfig

  private constructor() {
    this.config = {
      verificationInterval: 60 * 60 * 1000, // 1 hour default
      whoopDataDays: 30,
      autoPayout: true,
      flowNetwork: 'emulator'
    }
  }

  static getInstance(): FlowAgent {
    if (!FlowAgent.instance) {
      FlowAgent.instance = new FlowAgent()
    }
    return FlowAgent.instance
  }

  // Start the Flow Agent
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('🔄 Flow Agent already running')
      return
    }

    // Check if we're in a server-side environment
    if (typeof window === 'undefined') {
      console.log('🖥️ Flow Agent: Server-side environment, cannot start agent')
      return
    }

    console.log('🚀 Starting Flow Agent...')
    console.log(`🌐 Network: ${this.config.flowNetwork}`)
    console.log(`⏰ Verification interval: ${this.config.verificationInterval / 1000 / 60} minutes`)
    console.log(`💰 Auto-payout: ${this.config.autoPayout ? 'Enabled' : 'Disabled'}`)

    this.isRunning = true

    // Start verification cycle
    this.verificationInterval = setInterval(async () => {
      await this.runVerificationCycle()
    }, this.config.verificationInterval)

    // Run initial verification
    await this.runVerificationCycle()
  }

  // Stop the Flow Agent
  stop(): void {
    if (this.verificationInterval) {
      clearInterval(this.verificationInterval)
      this.verificationInterval = null
    }
    this.isRunning = false
    console.log('⏹️ Flow Agent stopped')
  }

  // Main verification cycle
  private async runVerificationCycle(): Promise<void> {
    try {
      console.log('🔄 Flow Agent: Running verification cycle...')
      
      // Check if we're in a server-side environment
      if (typeof window === 'undefined') {
        console.log('🖥️ Flow Agent: Server-side environment, skipping verification cycle')
        return
      }
      
      // 1. Get active goals from Flow blockchain
      const activeGoals = await this.getActiveGoalsFromFlow()
      
      if (activeGoals.length === 0) {
        console.log('📝 Flow Agent: No active goals to verify')
        return
      }

      console.log(`🎯 Flow Agent: Found ${activeGoals.length} active goals to verify`)

      // 2. Fetch latest WHOOP data
      const whoopData = await this.getLatestWhoopData()
      
      if (!whoopData || whoopData.length === 0) {
        console.log('⚠️ Flow Agent: No WHOOP data available for verification')
        return
      }

      // 3. Verify each goal on Flow blockchain
      for (const goal of activeGoals) {
        await this.verifyGoalOnFlow(goal, whoopData)
      }

      console.log('✅ Flow Agent: Verification cycle completed')
    } catch (error) {
      console.error('❌ Flow Agent: Error in verification cycle:', error)
    }
  }

  // Get active goals from Flow blockchain
  private async getActiveGoalsFromFlow(): Promise<any[]> {
    try {
      // Check if we're in a server-side environment
      if (typeof window === 'undefined') {
        console.log('🖥️ Flow Agent: Server-side environment, returning empty goals array')
        return []
      }
      
      // TODO: Replace with actual Flow blockchain call
      // For now, use local storage as simulation
      const goals = this.getGoalsFromLocalStorage()
      return goals.filter(goal => 
        !goal.isCompleted && 
        goal.verificationType === 'automatic' &&
        new Date() <= goal.deadline
      )
    } catch (error) {
      console.error('Flow Agent: Error getting active goals from Flow:', error)
      return []
    }
  }

  // Get latest WHOOP data
  private async getLatestWhoopData(): Promise<any[]> {
    try {
      if (!whoopApi.isAuthenticated()) {
        console.log('🔐 Flow Agent: WHOOP not authenticated, skipping verification')
        return []
      }

      // Get last N days of data for comprehensive verification
      const healthData = await whoopApi.getAllHealthData(this.config.whoopDataDays)
      
      if (!healthData || !Array.isArray(healthData)) {
        console.log('⚠️ Flow Agent: Invalid WHOOP data received')
        return []
      }

      // Transform WHOOP data to Flow format
      return this.transformWhoopDataForFlow(healthData)
    } catch (error) {
      console.error('Flow Agent: Error getting WHOOP data:', error)
      return []
    }
  }

  // Transform WHOOP data to Flow blockchain format
  private transformWhoopDataForFlow(whoopData: any[]): any[] {
    return whoopData.map(day => ({
      date: day.date || day.created_at,
      sleepScore: day.sleep?.score || day.sleep_score,
      steps: day.workout?.steps || day.steps,
      heartRate: day.workout?.heart_rate?.average || day.heart_rate,
      recoveryScore: day.recovery?.score || day.recovery_score,
      strainScore: day.workout?.strain || day.strain_score,
      weight: day.body?.weight || day.weight
    })).filter(day => day.date)
  }

  // Verify goal on Flow blockchain
  private async verifyGoalOnFlow(goal: any, whoopData: any[]): Promise<void> {
    try {
      console.log(`🔍 Flow Agent: Verifying goal on Flow: ${goal.title}`)
      
      // 1. Call Flow smart contract verification
      const verificationResult = await this.callFlowVerification(goal, whoopData)
      
      if (verificationResult.isSuccessful) {
        console.log(`✅ Flow Agent: Goal verified on Flow: ${goal.title}`)
        
        // 2. If auto-payout enabled, execute payout
        if (this.config.autoPayout) {
          await this.executePayoutOnFlow(goal, verificationResult)
        }
      } else {
        console.log(`❌ Flow Agent: Goal verification failed on Flow: ${goal.title}`)
      }
      
    } catch (error) {
      console.error(`Flow Agent: Error verifying goal ${goal.title} on Flow:`, error)
    }
  }

  // Call Flow smart contract verification
  private async callFlowVerification(goal: any, whoopData: any[]): Promise<any> {
    try {
      // TODO: Replace with actual Flow smart contract call
      // This would use Flow SDK to call the verifyGoalWithWhoopData function
      
      console.log(`📡 Flow Agent: Calling Flow smart contract for goal: ${goal.id}`)
      
      // Simulate Flow smart contract call
      const result = await this.simulateFlowVerification(goal, whoopData)
      
      console.log(`📊 Flow Agent: Smart contract result:`, result)
      
      return result
      
    } catch (error) {
      console.error('Flow Agent: Error calling Flow smart contract:', error)
      throw error
    }
  }

  // Simulate Flow smart contract verification (for development)
  private async simulateFlowVerification(goal: any, whoopData: any[]): Promise<any> {
    // Simulate the verification logic from our smart contract
    const { healthDataType, targetValue, verificationConditions } = goal
    
    // Sort data by date (most recent first)
    const sortedData = whoopData
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(day => day.date)

    let consecutiveDays = 0

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
    }

    // Check if goal completion criteria are met
    const isSuccessful = this.checkGoalCompletionCriteria(verificationConditions, consecutiveDays)
    
    return {
      isSuccessful,
      message: isSuccessful ? 'Goal verification successful' : 'Goal verification failed',
      consecutiveDays,
      data: {},
      timestamp: new Date()
    }
  }

  // Goal verification logic (same as smart contract)
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

  // Execute payout on Flow blockchain
  private async executePayoutOnFlow(goal: any, verificationResult: any): Promise<void> {
    try {
      console.log(`💰 Flow Agent: Executing payout for goal: ${goal.title}`)
      console.log(`🎯 Reward: ${goal.reward} FLOW`)
      
      // TODO: Replace with actual Flow payout transaction
      // This would:
      // 1. Create a Flow transaction
      // 2. Call the claimRewards function on smart contract
      // 3. Sign and submit the transaction
      
      // Simulate payout execution
      await this.simulateFlowPayout(goal, verificationResult)
      
      console.log(`✅ Flow Agent: Payout executed successfully for goal: ${goal.title}`)
      
    } catch (error) {
      console.error(`Flow Agent: Error executing payout for goal ${goal.title}:`, error)
    }
  }

  // Simulate Flow payout (for development)
  private async simulateFlowPayout(goal: any, verificationResult: any): Promise<void> {
    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update local storage to simulate blockchain state change
    this.updateGoalCompletion(goal.id, verificationResult)
    
    // Emit event for UI updates
    this.emitPayoutExecuted(goal.id, goal.reward)
  }

  // Update goal completion status
  private updateGoalCompletion(goalId: string, result: any): void {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.log('Flow Agent: Server-side environment, skipping localStorage update')
        return
      }
      
      const goals = this.getGoalsFromLocalStorage()
      const goalIndex = goals.findIndex(g => g.id === goalId)
      
      if (goalIndex !== -1) {
        goals[goalIndex].isCompleted = true
        goals[goalIndex].isVerified = true
        goals[goalIndex].consecutiveSuccessDays = result.consecutiveDays
        
        localStorage.setItem('smartContractGoals', JSON.stringify(goals))
      }
    } catch (error) {
      console.error('Flow Agent: Error updating goal completion:', error)
    }
  }

  // Get goals from local storage (simulation)
  private getGoalsFromLocalStorage(): any[] {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.log('Flow Agent: Server-side environment, using empty goals array')
        return []
      }
      
      const goals = localStorage.getItem('smartContractGoals')
      return goals ? JSON.parse(goals) : []
    } catch (error) {
      console.error('Flow Agent: Error reading goals from localStorage:', error)
      return []
    }
  }

  private updateGoalInLocalStorage(goalId: string, result: any): void {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.log('Flow Agent: Server-side environment, skipping localStorage update')
        return
      }
      
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
      console.error('Flow Agent: Error updating goal in localStorage:', error)
    }
  }

  // Emit payout executed event
  private emitPayoutExecuted(goalId: string, reward: number): void {
    const event = new CustomEvent('flowPayoutExecuted', {
      detail: { goalId, reward, timestamp: new Date() }
    })
    window.dispatchEvent(event)
  }

  // Manual verification trigger
  async triggerManualVerification(): Promise<void> {
    if (!this.isRunning) {
      console.log('⚠️ Flow Agent: Cannot trigger verification - agent not running')
      return
    }
    
    console.log('🔧 Flow Agent: Manual verification triggered')
    await this.runVerificationCycle()
  }

  // Webhook-triggered verification for specific data type
  async triggerVerificationForDataType(healthDataType: string, webhookData: any): Promise<void> {
    try {
      console.log(`🔔 Flow Agent: Webhook-triggered verification for ${healthDataType}`)
      
      // Get active goals that match this health data type
      const relevantGoals = await this.getActiveGoalsByDataType(healthDataType)
      
      if (relevantGoals.length === 0) {
        console.log(`📝 Flow Agent: No active ${healthDataType} goals to verify`)
        return
      }

      console.log(`🎯 Flow Agent: Found ${relevantGoals.length} ${healthDataType} goals to verify`)

      // Get latest WHOOP data (just for this data type)
      const whoopData = await this.getLatestWhoopDataForType(healthDataType)
      
      if (!whoopData || whoopData.length === 0) {
        console.log(`⚠️ Flow Agent: No ${healthDataType} data available for verification`)
        return
      }

      // Verify each relevant goal
      for (const goal of relevantGoals) {
        await this.verifyGoalOnFlow(goal, whoopData)
      }

      console.log(`✅ Flow Agent: Webhook-triggered verification completed for ${healthDataType}`)
      
    } catch (error) {
      console.error(`❌ Flow Agent: Error in webhook-triggered verification for ${healthDataType}:`, error)
    }
  }

  // Get active goals by health data type
  private async getActiveGoalsByDataType(healthDataType: string): Promise<any[]> {
    try {
      // Check if we're in a server-side environment
      if (typeof window === 'undefined') {
        console.log('🖥️ Flow Agent: Server-side environment, returning empty goals array for data type filtering')
        return []
      }
      
      const goals = this.getGoalsFromLocalStorage()
      return goals.filter(goal => 
        !goal.isCompleted && 
        goal.verificationType === 'automatic' &&
        goal.healthDataType === healthDataType &&
        new Date() <= goal.deadline
      )
    } catch (error) {
      console.error('Flow Agent: Error getting goals by data type:', error)
      return []
    }
  }

  // Get latest WHOOP data for specific data type
  private async getLatestWhoopDataForType(healthDataType: string): Promise<any[]> {
    try {
      if (!whoopApi.isAuthenticated()) {
        console.log('🔐 Flow Agent: WHOOP not authenticated, skipping verification')
        return []
      }

      // Get last 7 days of data for this specific type (more focused)
      const healthData = await whoopApi.getAllHealthData(7)
      
      if (!healthData || !Array.isArray(healthData)) {
        console.log('⚠️ Flow Agent: Invalid WHOOP data received')
        return []
      }

      // Transform and filter data for specific type
      return this.transformWhoopDataForFlow(healthData).filter(day => {
        switch (healthDataType) {
          case 'sleep':
            return day.sleepScore !== undefined
          case 'steps':
            return day.steps !== undefined
          case 'recovery':
            return day.recoveryScore !== undefined
          case 'strain':
            return day.strainScore !== undefined
          default:
            return true
        }
      })
      
    } catch (error) {
      console.error('Flow Agent: Error getting WHOOP data for type:', error)
      return []
    }
  }

  // Update agent configuration
  updateConfig(newConfig: Partial<FlowAgentConfig>): void {
    this.config = { ...this.config, ...newConfig }
    console.log('⚙️ Flow Agent: Configuration updated:', this.config)
  }

  // Get agent status
  getStatus(): {
    isRunning: boolean
    config: FlowAgentConfig
    lastVerification: Date | null
    webhookEnabled: boolean
  } {
    return {
      isRunning: this.isRunning,
      config: this.config,
      lastVerification: null, // TODO: Track last verification time
      webhookEnabled: true // Webhook integration is enabled
    }
  }
}

// Export singleton instance
export const flowAgent = FlowAgent.getInstance()
