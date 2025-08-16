import { Entity, Type } from '@graphprotocol/hypergraph';

// Base health data entity that can be shared between public and private spaces
export class HealthDataPoint extends Entity.Class<HealthDataPoint>('HealthDataPoint')({
  type: Type.String, // SLEEP, STEPS, HEART_RATE, BLOOD_PRESSURE, WEIGHT, CUSTOM
  value: Type.Number,
  unit: Type.String,
  timestamp: Type.Number,
  verified: Type.Boolean,
  source: Type.String,
  goalId: Type.optional(Type.String),
  metadata: Type.optional(Type.String), // JSON string for additional data
}) {}

// User profile entity for public spaces
export class UserProfile extends Entity.Class<UserProfile>('UserProfile')({
  address: Type.String,
  username: Type.optional(Type.String),
  bio: Type.optional(Type.String),
  avatar: Type.optional(Type.String),
  healthGoals: Type.optional(Type.String), // JSON string for public goals
  achievements: Type.optional(Type.String), // JSON string for public achievements
  isVerified: Type.Boolean,
  createdAt: Type.Number,
}) {}

// Goal entity for tracking health objectives
export class HealthGoal extends Entity.Class<HealthGoal>('HealthGoal')({
  title: Type.String,
  description: Type.optional(Type.String),
  targetValue: Type.Number,
  currentValue: Type.Number,
  reward: Type.Number,
  deadline: Type.Number,
  sponsor: Type.String,
  status: Type.String, // ACTIVE, COMPLETED, FAILED, PENDING
  healthDataType: Type.String,
  conditions: Type.optional(Type.String), // JSON string for conditions
  completedAt: Type.optional(Type.Number),
  createdAt: Type.Number,
  updatedAt: Type.Number,
}) {}

// Reward entity for tracking earned rewards
export class HealthReward extends Entity.Class<HealthReward>('HealthReward')({
  goal: Type.Relation(HealthGoal),
  amount: Type.Number,
  transactionHash: Type.String,
  timestamp: Type.Number,
  sponsor: Type.String,
  claimed: Type.Boolean,
  claimedAt: Type.optional(Type.Number),
}) {}

// Privacy settings for controlling data sharing
export class PrivacySetting extends Entity.Class<PrivacySetting>('PrivacySetting')({
  dataType: Type.String,
  shareLevel: Type.String, // PRIVATE, FAMILY, MEDICAL, PUBLIC
  authorizedUsers: Type.optional(Type.String), // JSON array of addresses
  allowPublicGraph: Type.Boolean,
  updatedAt: Type.Number,
}) {}

// Access log for tracking data access
export class AccessLog extends Entity.Class<AccessLog>('AccessLog')({
  requester: Type.String,
  dataType: Type.String,
  purpose: Type.String,
  granted: Type.Boolean,
  timestamp: Type.Number,
}) {}

// Health metrics aggregation for public spaces
export class HealthMetrics extends Entity.Class<HealthMetrics>('HealthMetrics')({
  userId: Type.String,
  dataType: Type.String,
  averageValue: Type.Number,
  totalCount: Type.Number,
  lastUpdated: Type.Number,
  isPublic: Type.Boolean,
}) {}

// Community challenges and competitions
export class HealthChallenge extends Entity.Class<HealthChallenge>('HealthChallenge')({
  title: Type.String,
  description: Type.String,
  startDate: Type.Number,
  endDate: Type.Number,
  targetMetric: Type.String,
  targetValue: Type.Number,
  reward: Type.Number,
  participants: Type.optional(Type.String), // JSON array of participant addresses
  winner: Type.optional(Type.String),
  status: Type.String, // UPCOMING, ACTIVE, COMPLETED
  createdAt: Type.Number,
}) {}

// Health insights and analytics
export class HealthInsight extends Entity.Class<HealthInsight>('HealthInsight')({
  userId: Type.String,
  insightType: Type.String, // TREND, PATTERN, RECOMMENDATION
  title: Type.String,
  description: Type.String,
  data: Type.String, // JSON string for insight data
  confidence: Type.Number, // 0-1 confidence score
  isPublic: Type.Boolean,
  createdAt: Type.Number,
}) {}
