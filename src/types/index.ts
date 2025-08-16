// Core Health Data Types
export interface HealthMetric {
  id: string
  type: HealthDataType
  value: number
  timestamp: Date
  unit: string
  verified: boolean
  source?: string
  metadata?: Record<string, any>
}

export type HealthDataType = 'sleep' | 'steps' | 'heart_rate' | 'blood_pressure' | 'weight' | 'custom' | 'recovery' | 'strain' | 'activity'

// Goal Management Types
export interface Goal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  reward: number
  deadline: Date
  sponsor: string
  status: GoalStatus
  healthDataType: HealthDataType
  conditions: string[]
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type GoalStatus = 'active' | 'completed' | 'failed' | 'pending'

export interface GoalCreateInput {
  title: string
  description: string
  targetValue: number
  reward: number
  deadline: Date
  sponsor: string
  healthDataType: HealthDataType
  conditions: string[]
}

// Privacy and Sharing Types
export interface PrivacySetting {
  dataType: HealthDataType
  shareLevel: ShareLevel
  authorizedUsers: string[]
  allowPublicGraph: boolean
  updatedAt: Date
}

export type ShareLevel = 'private' | 'family' | 'medical' | 'public'

export interface AccessLog {
  id: string
  requester: string
  dataType: HealthDataType
  purpose: string
  granted: boolean
  timestamp: Date
}

// Blockchain Types
export interface FlowUser {
  addr?: string
  cid?: string
  loggedIn: boolean
}

export interface FlowTransaction {
  transactionId: string
  status: 'pending' | 'sealed' | 'failed'
  events: FlowEvent[]
}

export interface FlowEvent {
  type: string
  data: Record<string, any>
}

// Web3 and Payment Types
export interface PaymentProvider {
  name: string
  type: 'coinbase' | 'x402' | 'flow'
  isConnected: boolean
  balance?: number
  address?: string
}

export interface X402Payment {
  id: string
  goalId: string
  amount: number
  isActive: boolean
  conditions: X402Condition[]
  lastTriggered?: Date
  totalPayouts: number
  createdAt: Date
}

export interface X402Condition {
  type: 'goal_completion' | 'health_data_verification' | 'time_based'
  parameters: Record<string, any>
}

// Hypergraph and The Graph Types
export interface HypergraphData {
  id: string
  userId: string
  dataTypes: HealthDataType[]
  isPublic: boolean
  publishedAt: Date
  lastUpdated: Date
  graphQL: string
}

export interface SubgraphQuery {
  query: string
  variables?: Record<string, any>
}

export interface SubgraphResponse<T = any> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: string[]
  }>
}

// User and Profile Types
export interface UserProfile {
  address: string
  preferences: UserPreferences
  healthStats: UserHealthStats
  goals: Goal[]
  privacySettings: PrivacySetting[]
  createdAt: Date
  lastActiveAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: NotificationSettings
  healthDataSync: HealthDataSyncSettings
  defaultPrivacyLevel: ShareLevel
}

export interface NotificationSettings {
  goalReminders: boolean
  rewardAlerts: boolean
  privacyUpdates: boolean
  weeklyReports: boolean
  email: boolean
  push: boolean
}

export interface HealthDataSyncSettings {
  autoSync: boolean
  syncInterval: number // minutes
  enabledSources: HealthDataSource[]
}

export type HealthDataSource = 'fitbit' | 'apple_health' | 'google_fit' | 'manual' | 'wearable'

export interface UserHealthStats {
  avgSleepHours: number
  avgDailySteps: number
  avgHeartRate: number
  lastBloodPressure: number
  currentWeight: number
  healthScore: number
  lastUpdated: Date
}

// Reward and Sponsor Types
export interface Reward {
  id: string
  userId: string
  goalId: string
  amount: number
  transactionHash: string
  timestamp: Date
  sponsor: string
  claimed: boolean
  claimedAt?: Date
}

export interface Sponsor {
  id: string
  address: string
  name: string
  type: 'individual' | 'family' | 'organization' | 'community'
  totalFunded: number
  activeGoals: number
  completedGoals: number
  users: string[]
  reputation: number
  createdAt: Date
}

// Analytics and Statistics Types
export interface DailyStats {
  date: string
  totalUsers: number
  newUsers: number
  goalsCreated: number
  goalsCompleted: number
  totalRewards: number
  healthDataEntries: number
  publicGraphsPublished: number
}

export interface GlobalStats {
  totalUsers: number
  totalGoals: number
  totalRewards: number
  totalHealthDataEntries: number
  totalPublicGraphs: number
  averageHealthScore: number
  lastUpdated: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: Date
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Health Data Integration Types
export interface WearableDevice {
  id: string
  name: string
  type: 'smartwatch' | 'fitness_tracker' | 'smartphone'
  isConnected: boolean
  lastSync?: Date
  supportedMetrics: HealthDataType[]
}

export interface HealthDataSource {
  id: string
  name: string
  type: HealthDataSource
  isAuthenticated: boolean
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  permissions: string[]
}

// Export and Import Types
export interface HealthDataExport {
  format: 'json' | 'csv' | 'pdf' | 'xml'
  data: HealthMetric[]
  goals: Goal[]
  rewards: Reward[]
  exportedAt: Date
  userId: string
}

export interface HealthDataImport {
  source: HealthDataSource
  data: HealthMetric[]
  importedAt: Date
  duplicates: number
  errors: string[]
  success: boolean
}

// Community and Social Features
export interface HealthChallenge {
  id: string
  title: string
  description: string
  targetMetric: HealthDataType
  targetValue: number
  reward: number
  startDate: Date
  endDate: Date
  participants: string[]
  isActive: boolean
  createdBy: string
  rules: string[]
  createdAt: Date
}

export interface ChallengeParticipation {
  id: string
  challengeId: string
  userId: string
  currentValue: number
  completed: boolean
  completedAt?: Date
  joinedAt: Date
  rank?: number
}

// Error Types
export interface HealthChainError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}

export type ErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'BLOCKCHAIN_ERROR'
  | 'PAYMENT_ERROR'
  | 'SYNC_ERROR'
  | 'PRIVACY_VIOLATION'
  | 'GOAL_EXPIRED'
  | 'INSUFFICIENT_FUNDS'

// Hook Types for React
export interface UseHealthDataReturn {
  healthMetrics: HealthMetric[]
  goals: Goal[]
  privacySettings: PrivacySetting[]
  addHealthMetric: (metric: Omit<HealthMetric, 'id' | 'timestamp' | 'verified'>) => void
  createGoal: (goal: GoalCreateInput) => Promise<string>
  updateGoalProgress: (goalId: string, value: number) => void
  completeGoal: (goalId: string) => void
  updatePrivacySetting: (dataType: HealthDataType, setting: Partial<PrivacySetting>) => void
  publishToHypergraph: (dataTypes: HealthDataType[], isPublic: boolean) => Promise<string>
  syncWithWearable: () => Promise<void>
  exportHealthData: (format: 'json' | 'csv' | 'pdf') => Promise<Blob>
  isLoading: boolean
  error: HealthChainError | null
}

export interface UseFlowReturn {
  user: FlowUser
  login: () => Promise<void>
  logout: () => void
  executeTransaction: (cadence: string, args?: any[]) => Promise<string>
  executeScript: (cadence: string, args?: any[]) => Promise<any>
  isLoading: boolean
  error: HealthChainError | null
}

export interface UseWeb3Return {
  coinbase: any
  isConnected: boolean
  walletAddress: string | null
  balance: number
  initializeCoinbase: () => Promise<void>
  sendPayment: (amount: number, recipient: string) => Promise<string>
  setupX402Payment: (goalId: string, amount: number) => Promise<string>
  isLoading: boolean
  error: HealthChainError | null
}