import { Entity, Type } from '@graphprotocol/hypergraph';

// ============================================================================
// BASE ENTITY TYPES
// ============================================================================

/**
 * Base health data entity that can be shared between public and private spaces
 */
export class HealthDataPoint extends Entity.Class<HealthDataPoint>('HealthDataPoint')({
  type: Type.String, // SLEEP, STEPS, HEART_RATE, BLOOD_PRESSURE, WEIGHT, CUSTOM, RECOVERY, STRAIN, ACTIVITY
  value: Type.Number,
  unit: Type.String,
  timestamp: Type.Number,
  verified: Type.Boolean,
  source: Type.String, // WHOOP, MANUAL, OTHER_DEVICE
  goalId: Type.optional(Type.String),
  metadata: Type.optional(Type.String), // JSON string for additional data
  privacyLevel: Type.String, // PUBLIC, PRIVATE, SHARED
  userId: Type.String, // Owner of this data point
}) {}

/**
 * User profile information
 */
export class UserProfile extends Entity.Class<UserProfile>('UserProfile')({
  userId: Type.String,
  username: Type.String,
  email: Type.optional(Type.String),
  displayName: Type.optional(Type.String),
  avatar: Type.optional(Type.String),
  bio: Type.optional(Type.String),
  dateOfBirth: Type.optional(Type.Number),
  height: Type.optional(Type.Number),
  weight: Type.optional(Type.Number),
  fitnessLevel: Type.optional(Type.String), // BEGINNER, INTERMEDIATE, ADVANCED
  goals: Type.optional(Type.String), // JSON string of goal IDs
  privacySettings: Type.optional(Type.String), // JSON string of privacy preferences
  createdAt: Type.Number,
  updatedAt: Type.Number,
}) {}

/**
 * Health goals and targets
 */
export class HealthGoal extends Entity.Class<HealthGoal>('HealthGoal')({
  goalId: Type.String,
  userId: Type.String,
  title: Type.String,
  description: Type.optional(Type.String),
  type: Type.String, // WEIGHT_LOSS, FITNESS, SLEEP, NUTRITION, CUSTOM
  targetValue: Type.Number,
  currentValue: Type.Number,
  unit: Type.String,
  deadline: Type.optional(Type.Number),
  status: Type.String, // ACTIVE, COMPLETED, PAUSED, CANCELLED
  progress: Type.Number, // 0-100 percentage
  milestones: Type.optional(Type.String), // JSON string of milestone objects
  createdAt: Type.Number,
  updatedAt: Type.Number,
}) {}

/**
 * Reward system for achieving health goals
 */
export class HealthReward extends Entity.Class<HealthReward>('HealthReward')({
  rewardId: Type.String,
  userId: Type.String,
  goalId: Type.String,
  type: Type.String, // TOKEN, BADGE, ACHIEVEMENT, CUSTOM
  amount: Type.Number,
  currency: Type.optional(Type.String), // For token rewards
  description: Type.String,
  earnedAt: Type.Number,
  claimed: Type.Boolean,
  claimedAt: Type.optional(Type.Number),
}) {}

/**
 * Privacy and access control settings
 */
export class PrivacySetting extends Entity.Class<PrivacySetting>('PrivacySetting')({
  settingId: Type.String,
  userId: Type.String,
  dataType: Type.String, // HEALTH_DATA, PROFILE, GOALS, REWARDS
  visibility: Type.String, // PUBLIC, PRIVATE, FRIENDS, CUSTOM
  allowedUsers: Type.optional(Type.String), // JSON string of user IDs
  allowedGroups: Type.optional(Type.String), // JSON string of group IDs
  restrictions: Type.optional(Type.String), // JSON string of restriction rules
  createdAt: Type.Number,
  updatedAt: Type.Number,
}) {}

/**
 * Access log for privacy auditing
 */
export class AccessLog extends Entity.Class<AccessLog>('AccessLog')({
  logId: Type.String,
  userId: Type.String, // Data owner
  requesterId: Type.String, // User requesting access
  dataType: Type.String, // Type of data accessed
  dataId: Type.optional(Type.String), // Specific data item ID
  accessType: Type.String, // READ, WRITE, DELETE
  granted: Type.Boolean, // Whether access was granted
  timestamp: Type.Number,
  ipAddress: Type.optional(Type.String),
  userAgent: Type.optional(Type.String),
  reason: Type.optional(Type.String), // Reason for access request
}) {}

/**
 * Health metrics and analytics
 */
export class HealthMetrics extends Entity.Class<HealthMetrics>('HealthMetrics')({
  metricsId: Type.String,
  userId: Type.String,
  date: Type.Number, // Date in YYYYMMDD format
  sleepScore: Type.optional(Type.Number),
  recoveryScore: Type.optional(Type.Number),
  strainScore: Type.optional(Type.Number),
  steps: Type.optional(Type.Number),
  calories: Type.optional(Type.Number),
  heartRate: Type.optional(Type.Number),
  weight: Type.optional(Type.Number),
  customMetrics: Type.optional(Type.String), // JSON string of custom metrics
  createdAt: Type.Number,
}) {}

/**
 * Community challenges and competitions
 */
export class HealthChallenge extends Entity.Class<HealthChallenge>('HealthChallenge')({
  challengeId: Type.String,
  title: Type.String,
  description: Type.String,
  type: Type.String, // STEPS, SLEEP, WEIGHT_LOSS, FITNESS, CUSTOM
  targetValue: Type.Number,
  unit: Type.String,
  startDate: Type.Number,
  endDate: Type.Number,
  participants: Type.optional(Type.String), // JSON string of participant IDs
  leaderboard: Type.optional(Type.String), // JSON string of leaderboard data
  rewards: Type.optional(Type.String), // JSON string of reward information
  privacyLevel: Type.String, // PUBLIC, PRIVATE, INVITE_ONLY
  createdBy: Type.String, // User ID of challenge creator
  createdAt: Type.Number,
  updatedAt: Type.Number,
}) {}

/**
 * AI-generated health insights and recommendations
 */
export class HealthInsight extends Entity.Class<HealthInsight>('HealthInsight')({
  insightId: Type.String,
  userId: Type.String,
  type: Type.String, // TREND, RECOMMENDATION, ALERT, PATTERN
  title: Type.String,
  description: Type.String,
  dataPoints: Type.optional(Type.String), // JSON string of related data point IDs
  confidence: Type.Number, // 0-100 confidence score
  actionable: Type.Boolean, // Whether the insight suggests an action
  actionItems: Type.optional(Type.String), // JSON string of suggested actions
  category: Type.String, // SLEEP, FITNESS, NUTRITION, RECOVERY, GENERAL
  priority: Type.String, // LOW, MEDIUM, HIGH, CRITICAL
  createdAt: Type.Number,
  expiresAt: Type.optional(Type.Number),
}) {}

// ============================================================================
// TYPE DEFINITIONS FOR ENTITY PROPERTIES
// ============================================================================

export type HealthDataType = 
  | 'SLEEP' 
  | 'STEPS' 
  | 'HEART_RATE' 
  | 'BLOOD_PRESSURE' 
  | 'WEIGHT' 
  | 'CUSTOM' 
  | 'RECOVERY' 
  | 'STRAIN' 
  | 'ACTIVITY';

export type PrivacyLevel = 'PUBLIC' | 'PRIVATE' | 'SHARED' | 'FRIENDS' | 'CUSTOM';

export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';

export type GoalType = 'WEIGHT_LOSS' | 'FITNESS' | 'SLEEP' | 'NUTRITION' | 'CUSTOM';

export type RewardType = 'TOKEN' | 'BADGE' | 'ACHIEVEMENT' | 'CUSTOM';

export type AccessType = 'READ' | 'WRITE' | 'DELETE';

export type InsightType = 'TREND' | 'RECOMMENDATION' | 'ALERT' | 'PATTERN';

export type InsightPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FitnessLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// ============================================================================
// INTERFACE TYPES FOR TYPE SAFETY
// ============================================================================

export interface IHealthDataPoint {
  type: HealthDataType;
  value: number;
  unit: string;
  timestamp: number;
  verified: boolean;
  source: string;
  goalId?: string;
  metadata?: string;
  privacyLevel: PrivacyLevel;
  userId: string;
}

export interface IUserProfile {
  userId: string;
  username: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: number;
  height?: number;
  weight?: number;
  fitnessLevel?: FitnessLevel;
  goals?: string;
  privacySettings?: string;
  createdAt: number;
  updatedAt: number;
}

export interface IHealthGoal {
  goalId: string;
  userId: string;
  title: string;
  description?: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: number;
  status: GoalStatus;
  progress: number;
  milestones?: string;
  createdAt: number;
  updatedAt: number;
}

export interface IHealthReward {
  rewardId: string;
  userId: string;
  goalId: string;
  type: RewardType;
  amount: number;
  currency?: string;
  description: string;
  earnedAt: number;
  claimed: boolean;
  claimedAt?: number;
}

export interface IPrivacySetting {
  settingId: string;
  userId: string;
  dataType: string;
  visibility: PrivacyLevel;
  allowedUsers?: string;
  allowedGroups?: string;
  restrictions?: string;
  createdAt: number;
  updatedAt: number;
}

export interface IAccessLog {
  logId: string;
  userId: string;
  requesterId: string;
  dataType: string;
  dataId?: string;
  accessType: AccessType;
  granted: boolean;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
}

export interface IHealthMetrics {
  metricsId: string;
  userId: string;
  date: number;
  sleepScore?: number;
  recoveryScore?: number;
  strainScore?: number;
  steps?: number;
  calories?: number;
  heartRate?: number;
  weight?: number;
  customMetrics?: string;
  createdAt: number;
}

export interface IHealthChallenge {
  challengeId: string;
  title: string;
  description: string;
  type: string;
  targetValue: number;
  unit: string;
  startDate: number;
  endDate: number;
  participants?: string;
  leaderboard?: string;
  rewards?: string;
  privacyLevel: PrivacyLevel;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface IHealthInsight {
  insightId: string;
  userId: string;
  type: InsightType;
  title: string;
  description: string;
  dataPoints?: string;
  confidence: number;
  actionable: boolean;
  actionItems?: string;
  category: string;
  priority: InsightPriority;
  createdAt: number;
  expiresAt?: number;
}

// ============================================================================
// UTILITY TYPES FOR HYPERGRAPH OPERATIONS
// ============================================================================

export type EntityType = 
  | 'HealthDataPoint'
  | 'UserProfile'
  | 'HealthGoal'
  | 'HealthReward'
  | 'PrivacySetting'
  | 'AccessLog'
  | 'HealthMetrics'
  | 'HealthChallenge'
  | 'HealthInsight';

export type PrivateEntityType = 
  | 'HealthDataPoint'
  | 'UserProfile'
  | 'HealthGoal'
  | 'HealthReward'
  | 'HealthMetrics'
  | 'HealthInsight';

export type PublicEntityType = 
  | 'HealthChallenge'
  | 'HealthMetrics'; // Only aggregated/anonymized data

export interface HypergraphQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  filters?: Record<string, any>;
}

export interface HypergraphMutationResult {
  success: boolean;
  entityId?: string;
  error?: string;
  timestamp: number;
}


