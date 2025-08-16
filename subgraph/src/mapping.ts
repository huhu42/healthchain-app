import { BigInt, BigDecimal, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  GoalCompleted,
  RewardClaimed,
  FundsDeposited,
  HealthDataShared,
  PrivacySettingsUpdated,
  PublicGraphPublished
} from "../generated/HealthRewards/HealthRewards"
import {
  User,
  Goal,
  HealthData,
  Reward,
  PrivacySetting,
  PublicGraph,
  Sponsor,
  DailyStats,
  GlobalStats,
  UserHealthStats
} from "../generated/schema"

export function handleGoalCompleted(event: GoalCompleted): void {
  let user = loadOrCreateUser(event.params.user)
  let goalId = event.params.goalId.toString()
  let goal = Goal.load(goalId)
  
  if (goal) {
    goal.status = "COMPLETED"
    goal.completedAt = event.block.timestamp
    goal.updatedAt = event.block.timestamp
    goal.save()
    
    // Create reward entity
    let reward = new Reward(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
    reward.user = user.id
    reward.goal = goal.id
    reward.amount = BigDecimal.fromString(event.params.reward.toString()).div(BigDecimal.fromString("1000000000000000000")) // Convert from wei
    reward.transactionHash = event.transaction.hash
    reward.timestamp = event.block.timestamp
    reward.sponsor = goal.sponsor
    reward.claimed = false
    reward.save()
    
    // Update user stats
    user.goalsCompleted = user.goalsCompleted.plus(BigInt.fromI32(1))
    user.goalsActive = user.goalsActive.minus(BigInt.fromI32(1))
    user.totalRewardsEarned = user.totalRewardsEarned.plus(reward.amount)
    user.lastActivityAt = event.block.timestamp
    user.save()
    
    // Update daily stats
    updateDailyStats(event.block.timestamp, "goalCompleted", reward.amount)
    updateGlobalStats(event.block.timestamp)
  }
}

export function handleRewardClaimed(event: RewardClaimed): void {
  let user = loadOrCreateUser(event.params.user)
  let amount = BigDecimal.fromString(event.params.amount.toString()).div(BigDecimal.fromString("1000000000000000000"))
  
  // Find and update the reward
  let rewardId = findRewardByUserAndAmount(user.id, amount, event.block.timestamp)
  if (rewardId) {
    let reward = Reward.load(rewardId)
    if (reward) {
      reward.claimed = true
      reward.claimedAt = event.block.timestamp
      reward.save()
    }
  }
  
  user.lastActivityAt = event.block.timestamp
  user.save()
}

export function handleFundsDeposited(event: FundsDeposited): void {
  let sponsor = loadOrCreateSponsor(event.params.sponsor)
  let amount = BigDecimal.fromString(event.params.amount.toString()).div(BigDecimal.fromString("1000000000000000000"))
  
  sponsor.totalFunded = sponsor.totalFunded.plus(amount)
  sponsor.save()
  
  updateDailyStats(event.block.timestamp, "fundsDeposited", amount)
  updateGlobalStats(event.block.timestamp)
}

export function handleHealthDataShared(event: HealthDataShared): void {
  // This would typically be handled by the privacy mapping
  // but we can track general sharing statistics here
  updateDailyStats(event.block.timestamp, "dataShared", BigDecimal.fromString("0"))
}

export function handlePrivacySettingsUpdated(event: PrivacySettingsUpdated): void {
  let user = loadOrCreateUser(event.params.user)
  let settingId = user.id + "-" + event.params.setting
  
  let privacySetting = PrivacySetting.load(settingId)
  if (!privacySetting) {
    privacySetting = new PrivacySetting(settingId)
    privacySetting.user = user.id
    privacySetting.dataType = event.params.setting
    privacySetting.authorizedUsers = []
  }
  
  if (event.params.value) {
    privacySetting.shareLevel = "PUBLIC"
  } else {
    privacySetting.shareLevel = "PRIVATE"
  }
  
  privacySetting.updatedAt = event.block.timestamp
  privacySetting.save()
}

export function handlePublicGraphPublished(event: PublicGraphPublished): void {
  let user = loadOrCreateUser(event.params.user)
  let graphId = event.params.graphId
  
  let publicGraph = new PublicGraph(graphId)
  publicGraph.user = user.id
  publicGraph.graphId = graphId
  publicGraph.dataTypes = [] // Would be populated from event data in real implementation
  publicGraph.isPublic = true
  publicGraph.publishedAt = event.block.timestamp
  publicGraph.lastUpdated = event.block.timestamp
  publicGraph.save()
  
  updateDailyStats(event.block.timestamp, "graphPublished", BigDecimal.fromString("0"))
  updateGlobalStats(event.block.timestamp)
}

function loadOrCreateUser(address: Address): User {
  let user = User.load(address.toHex())
  
  if (!user) {
    user = new User(address.toHex())
    user.address = address
    user.totalRewardsEarned = BigDecimal.fromString("0")
    user.goalsCompleted = BigInt.fromI32(0)
    user.goalsActive = BigInt.fromI32(0)
    user.lastActivityAt = BigInt.fromI32(0)
    user.createdAt = BigInt.fromI32(0) // Would be set from event timestamp
    user.save()
    
    // Create initial user health stats
    let healthStats = new UserHealthStats(address.toHex())
    healthStats.user = user.id
    healthStats.avgSleepHours = BigDecimal.fromString("0")
    healthStats.avgDailySteps = BigInt.fromI32(0)
    healthStats.avgHeartRate = BigDecimal.fromString("0")
    healthStats.lastBloodPressure = BigDecimal.fromString("0")
    healthStats.currentWeight = BigDecimal.fromString("0")
    healthStats.healthScore = BigDecimal.fromString("0")
    healthStats.lastUpdated = BigInt.fromI32(0)
    healthStats.save()
  }
  
  return user
}

function loadOrCreateSponsor(address: Address): Sponsor {
  let sponsor = Sponsor.load(address.toHex())
  
  if (!sponsor) {
    sponsor = new Sponsor(address.toHex())
    sponsor.address = address
    sponsor.name = "Unknown" // Would be set from contract data
    sponsor.totalFunded = BigDecimal.fromString("0")
    sponsor.activeGoals = BigInt.fromI32(0)
    sponsor.completedGoals = BigInt.fromI32(0)
    sponsor.users = []
    sponsor.createdAt = BigInt.fromI32(0)
    sponsor.save()
  }
  
  return sponsor
}

function updateDailyStats(timestamp: BigInt, action: string, amount: BigDecimal): void {
  let date = new Date(timestamp.toI32() * 1000)
  let dateString = date.toISOString().split('T')[0] // YYYY-MM-DD format
  
  let dailyStats = DailyStats.load(dateString)
  if (!dailyStats) {
    dailyStats = new DailyStats(dateString)
    dailyStats.date = dateString
    dailyStats.totalUsers = BigInt.fromI32(0)
    dailyStats.newUsers = BigInt.fromI32(0)
    dailyStats.goalsCreated = BigInt.fromI32(0)
    dailyStats.goalsCompleted = BigInt.fromI32(0)
    dailyStats.totalRewards = BigDecimal.fromString("0")
    dailyStats.healthDataEntries = BigInt.fromI32(0)
    dailyStats.publicGraphsPublished = BigInt.fromI32(0)
  }
  
  if (action == "goalCompleted") {
    dailyStats.goalsCompleted = dailyStats.goalsCompleted.plus(BigInt.fromI32(1))
    dailyStats.totalRewards = dailyStats.totalRewards.plus(amount)
  } else if (action == "fundsDeposited") {
    // Track funding activity
  } else if (action == "graphPublished") {
    dailyStats.publicGraphsPublished = dailyStats.publicGraphsPublished.plus(BigInt.fromI32(1))
  }
  
  dailyStats.save()
}

function updateGlobalStats(timestamp: BigInt): void {
  let globalStats = GlobalStats.load("global")
  if (!globalStats) {
    globalStats = new GlobalStats("global")
    globalStats.totalUsers = BigInt.fromI32(0)
    globalStats.totalGoals = BigInt.fromI32(0)
    globalStats.totalRewards = BigDecimal.fromString("0")
    globalStats.totalHealthDataEntries = BigInt.fromI32(0)
    globalStats.totalPublicGraphs = BigInt.fromI32(0)
  }
  
  globalStats.lastUpdated = timestamp
  globalStats.save()
}

function findRewardByUserAndAmount(userId: string, amount: BigDecimal, timestamp: BigInt): string | null {
  // In a real implementation, this would query for unclaimed rewards
  // matching the user and amount within a time window
  return null
}