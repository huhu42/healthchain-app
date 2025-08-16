import FungibleToken from 0x0000000000000002
import FlowToken from 0x0000000000000003

access(all) contract HealthRewards {
    
    access(all) let AdminStoragePath: StoragePath
    access(all) let RewardPoolStoragePath: StoragePath
    
    access(all) event GoalCompleted(user: Address, goalId: UInt64, reward: UFix64)
    access(all) event RewardClaimed(user: Address, amount: UFix64)
    access(all) event FundsDeposited(sponsor: Address, amount: UFix64)
    
    access(all) struct Goal {
        access(all) let id: UInt64
        access(all) let description: String
        access(all) let targetValue: UFix64
        access(all) let reward: UFix64
        access(all) let deadline: UFix64
        access(all) let sponsor: Address
        access(all) var isCompleted: Bool
        access(all) var verifiedData: {String: AnyStruct}
        
        init(id: UInt64, description: String, targetValue: UFix64, reward: UFix64, deadline: UFix64, sponsor: Address) {
            self.id = id
            self.description = description
            self.targetValue = targetValue
            self.reward = reward
            self.deadline = deadline
            self.sponsor = sponsor
            self.isCompleted = false
            self.verifiedData = {}
        }
        
        access(contract) fun complete(data: {String: AnyStruct}) {
            self.isCompleted = true
            self.verifiedData = data
        }
    }
    
    access(all) resource RewardPool {
        access(all) var totalFunds: UFix64
        access(all) let vault: @FlowToken.Vault
        access(all) var goals: {UInt64: Goal}
        access(all) var userGoals: {Address: [UInt64]}
        access(all) var nextGoalId: UInt64
        
        init() {
            self.totalFunds = 0.0
            self.vault <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>()) as! @FlowToken.Vault
            self.goals = {}
            self.userGoals = {}
            self.nextGoalId = 1
        }
        
        access(all) fun depositFunds(vault: @FlowToken.Vault) {
            let amount = vault.balance
            self.vault.deposit(from: <- vault)
            self.totalFunds = self.totalFunds + amount
            
            emit FundsDeposited(sponsor: self.owner?.address ?? panic("No owner"), amount: amount)
        }
        
        access(all) fun createGoal(
            user: Address,
            description: String,
            targetValue: UFix64,
            reward: UFix64,
            deadline: UFix64,
            sponsor: Address
        ): UInt64 {
            let goalId = self.nextGoalId
            let goal = Goal(
                id: goalId,
                description: description,
                targetValue: targetValue,
                reward: reward,
                deadline: deadline,
                sponsor: sponsor
            )
            
            self.goals[goalId] = goal
            
            if self.userGoals[user] == nil {
                self.userGoals[user] = []
            }
            self.userGoals[user]!.append(goalId)
            
            self.nextGoalId = self.nextGoalId + 1
            return goalId
        }
        
        access(all) fun completeGoal(goalId: UInt64, user: Address, healthData: {String: AnyStruct}): Bool {
            pre {
                self.goals[goalId] != nil: "Goal does not exist"
                self.goals[goalId]!.isCompleted == false: "Goal already completed"
                getCurrentBlock().timestamp <= self.goals[goalId]!.deadline: "Goal deadline passed"
            }
            
            let goal = self.goals[goalId]!
            
            // Verify health data meets target
            if self.verifyHealthData(goal: goal, data: healthData) {
                self.goals[goalId]!.complete(data: healthData)
                
                // Transfer reward
                let rewardVault <- self.vault.withdraw(amount: goal.reward)
                let userReceiver = getAccount(user).capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                    .borrow() ?? panic("Could not borrow receiver reference")
                
                userReceiver.deposit(from: <- rewardVault)
                self.totalFunds = self.totalFunds - goal.reward
                
                emit GoalCompleted(user: user, goalId: goalId, reward: goal.reward)
                emit RewardClaimed(user: user, amount: goal.reward)
                
                return true
            }
            
            return false
        }
        
        access(contract) fun verifyHealthData(goal: Goal, data: {String: AnyStruct}): Bool {
            // This would integrate with health data oracles in production
            // For now, we'll do basic validation
            
            if goal.description.toLower().contains("sleep") {
                if let sleepScore = data["sleepScore"] as? UFix64 {
                    return sleepScore >= goal.targetValue
                }
            } else if goal.description.toLower().contains("steps") {
                if let steps = data["steps"] as? UFix64 {
                    return steps >= goal.targetValue
                }
            } else if goal.description.toLower().contains("blood pressure") {
                if let systolic = data["systolic"] as? UFix64 {
                    return systolic <= goal.targetValue
                }
            }
            
            return false
        }
        
        access(all) fun getGoal(goalId: UInt64): Goal? {
            return self.goals[goalId]
        }
        
        access(all) fun getUserGoals(user: Address): [UInt64] {
            return self.userGoals[user] ?? []
        }
        
    }
    
    access(all) resource Admin {
        access(all) fun createRewardPool(): @RewardPool {
            return <- create RewardPool()
        }
    }
    
    access(all) fun createAdmin(): @Admin {
        return <- create Admin()
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