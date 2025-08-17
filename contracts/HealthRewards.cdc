import FungibleToken from 0x0000000000000002
import FlowToken from 0x0000000000000003

access(all) contract HealthRewards {
    
    access(all) let AdminStoragePath: StoragePath
    access(all) let RewardPoolStoragePath: StoragePath
    
    access(all) event GoalCompleted(user: Address, goalId: UInt64, reward: UFix64)
    access(all) event RewardClaimed(user: Address, amount: UFix64)
    access(all) event FundsDeposited(sponsor: Address, amount: UFix64)
    access(all) event GoalCreated(user: Address, goalId: UInt64, description: String, reward: UFix64)
    access(all) event GoalVerified(user: Address, goalId: UInt64, healthData: {String: AnyStruct})
    access(all) event AutomatedVerificationTriggered(goalId: UInt64, timestamp: UFix64)
    
    // Enhanced Goal structure with automated verification
    access(all) struct Goal {
        access(all) let id: UInt64
        access(all) let description: String
        access(all) let targetValue: UFix64
        access(all) let reward: UFix64
        access(all) let deadline: UFix64
        access(all) let sponsor: Address
        access(all) let healthDataType: String
        access(all) let verificationConditions: [String]
        access(all) let verificationType: String // "automatic" or "manual"
        access(all) var isCompleted: Bool
        access(all) var isVerified: Bool
        access(all) var verifiedData: {String: AnyStruct}
        access(all) var lastVerificationAttempt: UFix64
        access(all) var consecutiveSuccessDays: UInt64
        access(all) var totalAttempts: UInt64
        
        init(id: UInt64, description: String, targetValue: UFix64, reward: UFix64, deadline: UFix64, sponsor: Address, healthDataType: String, verificationConditions: [String], verificationType: String) {
            self.id = id
            self.description = description
            self.targetValue = targetValue
            self.reward = reward
            self.deadline = deadline
            self.sponsor = sponsor
            self.healthDataType = healthDataType
            self.verificationConditions = verificationConditions
            self.verificationType = verificationType
            self.isCompleted = false
            self.isVerified = false
            self.verifiedData = {}
            self.lastVerificationAttempt = 0.0
            self.consecutiveSuccessDays = 0
            self.totalAttempts = 0
        }
        
        access(contract) fun complete(data: {String: AnyStruct}) {
            self.isCompleted = true
            self.verifiedData = data
        }
        
        access(contract) fun verify(data: {String: AnyStruct}) {
            self.isVerified = true
            self.verifiedData = data
            self.lastVerificationAttempt = getCurrentBlock().timestamp
            self.totalAttempts = self.totalAttempts + 1
        }
        
        access(contract) fun updateConsecutiveDays(days: UInt64) {
            self.consecutiveSuccessDays = days
        }
    }
    
    // WHOOP health data structure for verification
    access(all) struct WhoopHealthData {
        access(all) let date: String
        access(all) let sleepScore: UFix64?
        access(all) let steps: UFix64?
        access(all) let heartRate: UFix64?
        access(all) let recoveryScore: UFix64?
        access(all) let strainScore: UFix64?
        access(all) let weight: UFix64?
        
        init(date: String, sleepScore: UFix64?, steps: UFix64?, heartRate: UFix64?, recoveryScore: UFix64?, strainScore: UFix64?, weight: UFix64?) {
            self.date = date
            self.sleepScore = sleepScore
            self.steps = steps
            self.heartRate = heartRate
            self.recoveryScore = recoveryScore
            self.strainScore = strainScore
            self.weight = weight
        }
    }
    
    // Goal verification result
    access(all) struct VerificationResult {
        access(all) let isSuccessful: Bool
        access(all) let message: String
        access(all) let data: {String: AnyStruct}
        access(all) let consecutiveDays: UInt64
        
        init(isSuccessful: Bool, message: String, data: {String: AnyStruct}, consecutiveDays: UInt64) {
            self.isSuccessful = isSuccessful
            self.message = message
            self.data = data
            self.consecutiveDays = consecutiveDays
        }
    }
    
    access(all) resource RewardPool {
        access(all) var totalFunds: UFix64
        access(all) let vault: @FlowToken.Vault
        access(all) var goals: {UInt64: Goal}
        access(all) var userGoals: {Address: [UInt64]}
        access(all) var nextGoalId: UInt64
        access(all) var pendingRewards: {Address: UFix64}
        access(all) var verificationQueue: [UInt64]
        
        init() {
            self.totalFunds = 0.0
            self.vault <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>()) as! @FlowToken.Vault
            self.goals = {}
            self.userGoals = {}
            self.nextGoalId = 1
            self.pendingRewards = {}
            self.verificationQueue = []
        }
        
        access(all) fun depositFunds(vault: @FlowToken.Vault) {
            let amount = vault.balance
            self.vault.deposit(from: <- vault)
            self.totalFunds = self.totalFunds + amount
            
            emit FundsDeposited(sponsor: self.owner?.address ?? panic("No owner"), amount: amount)
        }
        
        // Enhanced goal creation with verification parameters
        access(all) fun createGoal(
            user: Address,
            description: String,
            targetValue: UFix64,
            reward: UFix64,
            deadline: UFix64,
            sponsor: Address,
            healthDataType: String,
            verificationConditions: [String],
            verificationType: String
        ): UInt64 {
            let goalId = self.nextGoalId
            let goal = Goal(
                id: goalId,
                description: description,
                targetValue: targetValue,
                reward: reward,
                deadline: deadline,
                sponsor: sponsor,
                healthDataType: healthDataType,
                verificationConditions: verificationConditions,
                verificationType: verificationType
            )
            
            self.goals[goalId] = goal
            
            if self.userGoals[user] == nil {
                self.userGoals[user] = []
            }
            self.userGoals[user]!.append(goalId)
            
            // Add to verification queue if automatic
            if verificationType == "automatic" {
                self.verificationQueue.append(goalId)
            }
            
            self.nextGoalId = self.nextGoalId + 1
            
            emit GoalCreated(user: user, goalId: goalId, description: description, reward: reward)
            return goalId
        }
        
        // Automated goal verification using WHOOP data
        access(all) fun verifyGoalWithWhoopData(goalId: UInt64, whoopData: [WhoopHealthData]): VerificationResult {
            pre {
                self.goals[goalId] != nil: "Goal does not exist"
                self.goals[goalId]!.verificationType == "automatic": "Goal is not set for automatic verification"
                getCurrentBlock().timestamp <= self.goals[goalId]!.deadline: "Goal deadline passed"
            }
            
            let goal = self.goals[goalId]!
            let healthDataType = goal.healthDataType
            let targetValue = goal.targetValue
            let conditions = goal.verificationConditions
            
            // Process WHOOP data for verification
            var consecutiveSuccessDays: UInt64 = 0
            var verificationData: {String: AnyStruct} = {}
            
            // Sort data by date (most recent first)
            let sortedData = whoopData.sort(by: fun(a: WhoopHealthData, b: WhoopHealthData): Bool {
                return a.date > b.date
            })
            
            // Check consecutive days based on health data type
            if healthDataType == "sleep" {
                consecutiveSuccessDays = self.checkSleepGoal(sortedData, targetValue, conditions)
            } else if healthDataType == "steps" {
                consecutiveSuccessDays = self.checkStepsGoal(sortedData, targetValue, conditions)
            } else if healthDataType == "recovery" {
                consecutiveSuccessDays = self.checkRecoveryGoal(sortedData, targetValue, conditions)
            } else if healthDataType == "strain" {
                consecutiveSuccessDays = self.checkStrainGoal(sortedData, targetValue, conditions)
            }
            
            // Determine if goal is completed
            let isSuccessful = consecutiveSuccessDays > 0
            
            if isSuccessful {
                goal.updateConsecutiveDays(consecutiveSuccessDays)
                goal.verify(verificationData)
                
                // Check if goal completion criteria met
                if self.checkGoalCompletionCriteria(goal, consecutiveSuccessDays) {
                    goal.complete(verificationData)
                    self.distributeReward(goal)
                }
            }
            
            // Update verification timestamp
            goal.lastVerificationAttempt = getCurrentBlock().timestamp
            
            emit GoalVerified(user: goal.sponsor, goalId: goalId, healthData: verificationData)
            emit AutomatedVerificationTriggered(goalId: goalId, timestamp: getCurrentBlock().timestamp)
            
            return VerificationResult(
                isSuccessful: isSuccessful,
                message: isSuccessful ? "Goal verification successful" : "Goal verification failed",
                data: verificationData,
                consecutiveDays: consecutiveSuccessDays
            )
        }
        
        // Sleep goal verification
        access(all) fun checkSleepGoal(data: [WhoopHealthData], target: UFix64, conditions: [String]): UInt64 {
            var consecutiveDays: UInt64 = 0
            
            for healthData in data {
                if healthData.sleepScore != nil && healthData.sleepScore! >= target {
                    consecutiveDays = consecutiveDays + 1
                } else {
                    break
                }
            }
            
            return consecutiveDays
        }
        
        // Steps goal verification
        access(all) fun checkStepsGoal(data: [WhoopHealthData], target: UFix64, conditions: [String]): UInt64 {
            var consecutiveDays: UInt64 = 0
            
            for healthData in data {
                if healthData.steps != nil && healthData.steps! >= target {
                    consecutiveDays = consecutiveDays + 1
                } else {
                    break
                }
            }
            
            return consecutiveDays
        }
        
        // Recovery goal verification
        access(all) fun checkRecoveryGoal(data: [WhoopHealthData], target: UFix64, conditions: [String]): UInt64 {
            var consecutiveDays: UInt64 = 0
            
            for healthData in data {
                if healthData.recoveryScore != nil && healthData.recoveryScore! >= target {
                    consecutiveDays = consecutiveDays + 1
                } else {
                    break
                }
            }
            
            return consecutiveDays
        }
        
        // Strain goal verification
        access(all) fun checkStrainGoal(data: [WhoopHealthData], target: UFix64, conditions: [String]): UInt64 {
            var consecutiveDays: UInt64 = 0
            
            for healthData in data {
                if healthData.strainScore != nil && healthData.strainScore! <= target {
                    consecutiveDays = consecutiveDays + 1
                } else {
                    break
                }
            }
            
            return consecutiveDays
        }
        
        // Check if goal completion criteria are met
        access(all) fun checkGoalCompletionCriteria(goal: Goal, consecutiveDays: UInt64): Bool {
            // Check conditions like "consecutive_days >= 7" or "consecutive_nights >= 5"
            for condition in goal.verificationConditions {
                if condition.contains("consecutive_days") {
                    let requiredDays = self.extractNumberFromCondition(condition)
                    if consecutiveDays >= requiredDays {
                        return true
                    }
                } else if condition.contains("consecutive_nights") {
                    let requiredNights = self.extractNumberFromCondition(condition)
                    if consecutiveDays >= requiredNights {
                        return true
                    }
                }
            }
            return false
        }
        
        // Extract number from condition string (e.g., "consecutive_days >= 7" -> 7)
        access(all) fun extractNumberFromCondition(condition: String): UInt64 {
            let parts = condition.split(separator: " ")
            for part in parts {
                if part.isNumber() {
                    return UInt64(part) ?? 0
                }
            }
            return 0
        }
        
        // Distribute reward when goal is completed
        access(all) fun distributeReward(goal: Goal) {
            if goal.isCompleted && !goal.isVerified {
                // Add to pending rewards
                if self.pendingRewards[goal.sponsor] == nil {
                    self.pendingRewards[goal.sponsor] = 0.0
                }
                self.pendingRewards[goal.sponsor] = self.pendingRewards[goal.sponsor]! + goal.reward
                
                emit GoalCompleted(user: goal.sponsor, goalId: goal.id, reward: goal.reward)
            }
        }
        
        // Manual goal completion (for non-automated goals)
        access(all) fun completeGoal(goalId: UInt64, user: Address, healthData: {String: AnyStruct}): Bool {
            pre {
                self.goals[goalId] != nil: "Goal does not exist"
                self.goals[goalId]!.isCompleted == false: "Goal already completed"
                getCurrentBlock().timestamp <= self.goals[goalId]!.deadline: "Goal deadline passed"
            }
            
            let goal = self.goals[goalId]!
            
            // Verify user owns the goal
            if self.userGoals[user] == nil {
                return false
            }
            
            let userGoalIds = self.userGoals[user]!
            if !userGoalIds.contains(goalId) {
                return false
            }
            
            // Complete the goal
            goal.complete(healthData)
            self.distributeReward(goal)
            
            return true
        }
        
        // Claim pending rewards
        access(all) fun claimRewards(user: Address): UFix64 {
            let amount = self.pendingRewards[user] ?? 0.0
            if amount > 0.0 {
                self.pendingRewards[user] = 0.0
                
                // Transfer FLOW tokens
                let rewardVault = self.vault.withdraw(amount: amount) as! @FlowToken.Vault
                let userVault = getAccount(user).getCapability(/public/flowTokenReceiver)
                    .borrow<&{FungibleToken.Receiver}>(from: /storage/flowTokenVault)
                    ?? panic("Could not borrow receiver capability")
                
                userVault.deposit(from: <- rewardVault)
                
                emit RewardClaimed(user: user, amount: amount)
            }
            return amount
        }
        
        // Get user's goals
        access(all) fun getUserGoals(user: Address): [Goal] {
            if self.userGoals[user] == nil {
                return []
            }
            
            let goalIds = self.userGoals[user]!
            var userGoals: [Goal] = []
            
            for goalId in goalIds {
                if self.goals[goalId] != nil {
                    userGoals.append(self.goals[goalId]!)
                }
            }
            
            return userGoals
        }
        
        // Get goal by ID
        access(all) fun getGoal(goalId: UInt64): Goal? {
            return self.goals[goalId]
        }
        
        // Get verification queue for automated processing
        access(all) fun getVerificationQueue(): [UInt64] {
            return self.verificationQueue
        }
        
        // Remove completed goals from verification queue
        access(all) fun cleanupVerificationQueue() {
            var newQueue: [UInt64] = []
            
            for goalId in self.verificationQueue {
                let goal = self.goals[goalId]
                if goal != nil && !goal!.isCompleted {
                    newQueue.append(goalId)
                }
            }
            
            self.verificationQueue = newQueue
        }
    }
    
    // Admin resource for managing the contract
    access(all) resource Admin {
        access(all) fun updateVerificationSettings(goalId: UInt64, newConditions: [String]) {
            // Admin can update verification conditions for goals
            // This would require proper access control in production
        }
        
        access(all) fun emergencyPause() {
            // Emergency pause functionality
        }
    }
    
    init() {
        self.AdminStoragePath = /storage/HealthRewardsAdmin
        self.RewardPoolStoragePath = /storage/HealthRewardsPool
        
        let admin <- create Admin()
        self.account.storage.save(<- admin, to: self.AdminStoragePath)
        
        let rewardPool <- create RewardPool()
        self.account.storage.save(<- rewardPool, to: self.RewardPoolStoragePath)
        
        self.account.capabilities.publish(
            self.account.capabilities.storage.issue<&RewardPool>(self.RewardPoolStoragePath),
            at: /public/HealthRewardsPool
        )
    }
}