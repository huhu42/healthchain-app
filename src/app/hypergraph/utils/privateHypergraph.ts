import { useHypergraph } from '@graphprotocol/hypergraph-react';
import {
  IHealthDataPoint,
  IUserProfile,
  IHealthGoal,
  IHealthReward,
  IHealthMetrics,
  IHealthInsight,
  IPrivacySetting,
  IAccessLog,
  HealthDataType,
  PrivacyLevel,
  GoalStatus,
  GoalType,
  RewardType,
  FitnessLevel,
  HypergraphQueryOptions,
  HypergraphMutationResult,
  PrivateEntityType,
} from '../types/schema';

// ============================================================================
// PRIVATE HYPERGRAPH UTILITY FUNCTIONS
// ============================================================================

/**
 * Utility class for managing private hypergraph operations
 */
export class PrivateHypergraphManager {
  private client: any; // Hypergraph client instance

  constructor(client: any) {
    this.client = client;
  }

  // ============================================================================
  // HEALTH DATA POINT OPERATIONS
  // ============================================================================

  /**
   * Create a new private health data point
   */
  async createPrivateHealthDataPoint(
    data: Omit<IHealthDataPoint, 'privacyLevel'> & { privacyLevel?: PrivacyLevel }
  ): Promise<HypergraphMutationResult> {
    try {
      const healthDataPoint = {
        ...data,
        privacyLevel: data.privacyLevel || 'PRIVATE',
        timestamp: data.timestamp || Date.now(),
      };

      const result = await this.client.mutate({
        mutation: `
          mutation CreateHealthDataPoint($input: HealthDataPointInput!) {
            createHealthDataPoint(input: $input) {
              id
              type
              value
              unit
              timestamp
              verified
              source
              goalId
              metadata
              privacyLevel
              userId
            }
          }
        `,
        variables: {
          input: healthDataPoint,
        },
      });

      return {
        success: true,
        entityId: result.data?.createHealthDataPoint?.id,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get private health data points for a user
   */
  async getPrivateHealthDataPoints(
    userId: string,
    options: HypergraphQueryOptions = {}
  ): Promise<IHealthDataPoint[]> {
    try {
      const result = await this.client.query({
        query: `
          query GetPrivateHealthDataPoints($userId: String!, $limit: Int, $offset: Int) {
            healthDataPoints(
              filter: { userId: $userId, privacyLevel: "PRIVATE" }
              limit: $limit
              offset: $offset
              orderBy: "timestamp"
              orderDirection: DESC
            ) {
              id
              type
              value
              unit
              timestamp
              verified
              source
              goalId
              metadata
              privacyLevel
              userId
            }
          }
        `,
        variables: {
          userId,
          limit: options.limit || 50,
          offset: options.offset || 0,
        },
      });

      return result.data?.healthDataPoints || [];
    } catch (error) {
      console.error('Error fetching private health data points:', error);
      return [];
    }
  }

  /**
   * Update a private health data point
   */
  async updatePrivateHealthDataPoint(
    id: string,
    updates: Partial<IHealthDataPoint>
  ): Promise<HypergraphMutationResult> {
    try {
      const result = await this.client.mutate({
        mutation: `
          mutation UpdateHealthDataPoint($id: ID!, $input: HealthDataPointUpdateInput!) {
            updateHealthDataPoint(id: $id, input: $input) {
              id
              type
              value
              unit
              timestamp
              verified
              source
              goalId
              metadata
              privacyLevel
              userId
            }
          }
        `,
        variables: {
          id,
          input: {
            ...updates,
            updatedAt: Date.now(),
          },
        },
      });

      return {
        success: true,
        entityId: result.data?.updateHealthDataPoint?.id,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  // ============================================================================
  // USER PROFILE OPERATIONS
  // ============================================================================

  /**
   * Create or update a private user profile
   */
  async upsertPrivateUserProfile(
    profile: Omit<IUserProfile, 'createdAt' | 'updatedAt'>
  ): Promise<HypergraphMutationResult> {
    try {
      const now = Date.now();
      const profileData = {
        ...profile,
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.client.mutate({
        mutation: `
          mutation UpsertUserProfile($input: UserProfileInput!) {
            upsertUserProfile(input: $input) {
              id
              userId
              username
              email
              displayName
              avatar
              bio
              dateOfBirth
              height
              weight
              fitnessLevel
              goals
              privacySettings
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          input: profileData,
        },
      });

      return {
        success: true,
        entityId: result.data?.upsertUserProfile?.id,
        timestamp: now,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get private user profile
   */
  async getPrivateUserProfile(userId: string): Promise<IUserProfile | null> {
    try {
      const result = await this.client.query({
        query: `
          query GetUserProfile($userId: String!) {
            userProfile(filter: { userId: $userId }) {
              id
              userId
              username
              email
              displayName
              avatar
              bio
              dateOfBirth
              height
              weight
              fitnessLevel
              goals
              privacySettings
              createdAt
              updatedAt
            }
          }
        `,
        variables: { userId },
      });

      return result.data?.userProfile || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // ============================================================================
  // HEALTH GOALS OPERATIONS
  // ============================================================================

  /**
   * Create a new private health goal
   */
  async createPrivateHealthGoal(
    goal: Omit<IHealthGoal, 'goalId' | 'createdAt' | 'updatedAt'>
  ): Promise<HypergraphMutationResult> {
    try {
      const now = Date.now();
      const goalData = {
        ...goal,
        goalId: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.client.mutate({
        mutation: `
          mutation CreateHealthGoal($input: HealthGoalInput!) {
            createHealthGoal(input: $input) {
              id
              goalId
              userId
              title
              description
              type
              targetValue
              currentValue
              unit
              deadline
              status
              progress
              milestones
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          input: goalData,
        },
      });

      return {
        success: true,
        entityId: result.data?.createHealthGoal?.id,
        timestamp: now,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(
    goalId: string,
    currentValue: number,
    progress: number
  ): Promise<HypergraphMutationResult> {
    try {
      const result = await this.client.mutate({
        mutation: `
          mutation UpdateGoalProgress($goalId: String!, $currentValue: Float!, $progress: Float!) {
            updateHealthGoal(
              id: $goalId
              input: { currentValue: $currentValue, progress: $progress, updatedAt: "${Date.now()}" }
            ) {
              id
              currentValue
              progress
              updatedAt
            }
          }
        `,
        variables: {
          goalId,
          currentValue,
          progress,
        },
      });

      return {
        success: true,
        entityId: result.data?.updateHealthGoal?.id,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  // ============================================================================
  // PRIVACY SETTINGS OPERATIONS
  // ============================================================================

  /**
   * Create or update privacy settings for a data type
   */
  async upsertPrivacySetting(
    setting: Omit<IPrivacySetting, 'settingId' | 'createdAt' | 'updatedAt'>
  ): Promise<HypergraphMutationResult> {
    try {
      const now = Date.now();
      const settingData = {
        ...setting,
        settingId: `privacy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.client.mutate({
        mutation: `
          mutation UpsertPrivacySetting($input: PrivacySettingInput!) {
            upsertPrivacySetting(input: $input) {
              id
              settingId
              userId
              dataType
              visibility
              allowedUsers
              allowedGroups
              restrictions
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          input: settingData,
        },
      });

      return {
        success: true,
        entityId: result.data?.upsertPrivacySetting?.id,
        timestamp: now,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get privacy settings for a user and data type
   */
  async getPrivacySettings(
    userId: string,
    dataType: string
  ): Promise<IPrivacySetting | null> {
    try {
      const result = await this.client.query({
        query: `
          query GetPrivacySetting($userId: String!, $dataType: String!) {
            privacySetting(filter: { userId: $userId, dataType: $dataType }) {
              id
              settingId
              userId
              dataType
              visibility
              allowedUsers
              allowedGroups
              restrictions
              createdAt
              updatedAt
            }
          }
        `,
        variables: { userId, dataType },
      });

      return result.data?.privacySetting || null;
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      return null;
    }
  }

  // ============================================================================
  // BULK OPERATIONS FOR PRIVATE DATA
  // ============================================================================

  /**
   * Bulk create private health data points
   */
  async bulkCreatePrivateHealthData(
    dataPoints: Array<Omit<IHealthDataPoint, 'privacyLevel' | 'timestamp'> & { 
      privacyLevel?: PrivacyLevel;
      timestamp?: number;
    }>
  ): Promise<HypergraphMutationResult[]> {
    const results: HypergraphMutationResult[] = [];
    
    for (const dataPoint of dataPoints) {
      const result = await this.createPrivateHealthDataPoint({
        ...dataPoint,
        privacyLevel: dataPoint.privacyLevel || 'PRIVATE',
        timestamp: dataPoint.timestamp || Date.now(),
      });
      results.push(result);
    }

    return results;
  }

  /**
   * Get all private data for a user (health data, goals, metrics, etc.)
   */
  async getAllPrivateUserData(userId: string): Promise<{
    healthData: IHealthDataPoint[];
    profile: IUserProfile | null;
    goals: IHealthGoal[];
    metrics: IHealthMetrics[];
    insights: IHealthInsight[];
    privacySettings: IPrivacySetting[];
  }> {
    const [healthData, profile, goals, metrics, insights, privacySettings] = await Promise.all([
      this.getPrivateHealthDataPoints(userId, { limit: 1000 }),
      this.getPrivateUserProfile(userId),
      this.getPrivateGoals(userId),
      this.getPrivateMetrics(userId),
      this.getPrivateInsights(userId),
      this.getPrivatePrivacySettings(userId),
    ]);

    return {
      healthData,
      profile,
      goals,
      metrics,
      insights,
      privacySettings,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async getPrivateGoals(userId: string): Promise<IHealthGoal[]> {
    try {
      const result = await this.client.query({
        query: `
          query GetPrivateGoals($userId: String!) {
            healthGoals(filter: { userId: $userId }) {
              id
              goalId
              userId
              title
              description
              type
              targetValue
              currentValue
              unit
              deadline
              status
              progress
              milestones
              createdAt
              updatedAt
            }
          }
        `,
        variables: { userId },
      });

      return result.data?.healthGoals || [];
    } catch (error) {
      console.error('Error fetching private goals:', error);
      return [];
    }
  }

  private async getPrivateMetrics(userId: string): Promise<IHealthMetrics[]> {
    try {
      const result = await this.client.query({
        query: `
          query GetPrivateMetrics($userId: String!) {
            healthMetrics(filter: { userId: $userId }) {
              id
              metricsId
              userId
              date
              sleepScore
              recoveryScore
              strainScore
              steps
              calories
              heartRate
              weight
              customMetrics
              createdAt
            }
          }
        `,
        variables: { userId },
      });

      return result.data?.healthMetrics || [];
    } catch (error) {
      console.error('Error fetching private metrics:', error);
      return [];
    }
  }

  private async getPrivateInsights(userId: string): Promise<IHealthInsight[]> {
    try {
      const result = await this.client.query({
        query: `
          query GetPrivateInsights($userId: String!) {
            healthInsights(filter: { userId: $userId }) {
              id
              insightId
              userId
              type
              title
              description
              dataPoints
              confidence
              actionable
              actionItems
              category
              priority
              createdAt
              expiresAt
            }
          }
        `,
        variables: { userId },
      });

      return result.data?.healthInsights || [];
    } catch (error) {
      console.error('Error fetching private insights:', error);
      return [];
    }
  }

  private async getPrivatePrivacySettings(userId: string): Promise<IPrivacySetting[]> {
    try {
      const result = await this.client.query({
        query: `
          query GetPrivatePrivacySettings($userId: String!) {
            privacySettings(filter: { userId: $userId }) {
              id
              settingId
              userId
              dataType
              visibility
              allowedUsers
              allowedGroups
              restrictions
              createdAt
              updatedAt
            }
          }
        `,
        variables: { userId },
      });

      return result.data?.privacySettings || [];
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      return [];
    }
  }
}

// ============================================================================
// REACT HOOK FOR PRIVATE HYPERGRAPH OPERATIONS
// ============================================================================

/**
 * React hook for managing private hypergraph operations
 */
export function usePrivateHypergraph() {
  const { client } = useHypergraph();
  
  if (!client) {
    throw new Error('Hypergraph client not available. Make sure you are wrapped in HypergraphProvider.');
  }

  const manager = new PrivateHypergraphManager(client);

  return {
    // Health Data Operations
    createPrivateHealthDataPoint: manager.createPrivateHealthDataPoint.bind(manager),
    getPrivateHealthDataPoints: manager.getPrivateHealthDataPoints.bind(manager),
    updatePrivateHealthDataPoint: manager.updatePrivateHealthDataPoint.bind(manager),
    
    // User Profile Operations
    upsertPrivateUserProfile: manager.upsertPrivateUserProfile.bind(manager),
    getPrivateUserProfile: manager.getPrivateUserProfile.bind(manager),
    
    // Health Goals Operations
    createPrivateHealthGoal: manager.createPrivateHealthGoal.bind(manager),
    updateGoalProgress: manager.updateGoalProgress.bind(manager),
    
    // Privacy Settings Operations
    upsertPrivacySetting: manager.upsertPrivacySetting.bind(manager),
    getPrivacySettings: manager.getPrivacySettings.bind(manager),
    
    // Bulk Operations
    bulkCreatePrivateHealthData: manager.bulkCreatePrivateHealthData.bind(manager),
    getAllPrivateUserData: manager.getAllPrivateUserData.bind(manager),
  };
}

export default PrivateHypergraphManager;
