import { useState, useEffect } from 'react';
import { useHypergraph } from '@graphprotocol/hypergraph-react';

// Types for health data
export interface HealthDataPoint {
  id: string;
  type: string;
  value: number;
  unit: string;
  timestamp: number;
  verified: boolean;
  source: string;
  goalId?: string;
  metadata?: string;
}

export interface PrivacySetting {
  dataType: string;
  shareLevel: 'PRIVATE' | 'FAMILY' | 'MEDICAL' | 'PUBLIC';
  authorizedUsers: string[];
  allowPublicGraph: boolean;
  updatedAt: number;
}

export interface HealthGoal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  reward: number;
  deadline: number;
  sponsor: string;
  status: string;
  healthDataType: string;
  conditions?: string[];
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
}

// Custom hook for managing health data
export function useHealthData() {
  const { client } = useHypergraph();
  const [healthData, setHealthData] = useState<HealthDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch health data
  const fetchHealthData = async () => {
    if (!client) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.query(`
        query GetHealthData {
          HealthDataPoint {
            id
            type
            value
            unit
            timestamp
            verified
            source
            goalId
            metadata
          }
        }
      `);

      if (result?.HealthDataPoint) {
        setHealthData(result.HealthDataPoint);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  // Add new health data point
  const addHealthData = async (data: Omit<HealthDataPoint, 'id'>) => {
    if (!client) return;
    
    try {
      const result = await client.mutate(`
        mutation AddHealthData($data: HealthDataPointInput!) {
          createHealthDataPoint(data: $data) {
            id
            type
            value
            unit
            timestamp
            verified
            source
            goalId
            metadata
          }
        }
      `, {
        data: {
          ...data,
          timestamp: Date.now()
        }
      });

      if (result?.createHealthDataPoint) {
        setHealthData(prev => [...prev, result.createHealthDataPoint]);
      }
      
      return result?.createHealthDataPoint;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add health data');
      throw err;
    }
  };

  // Update health data point
  const updateHealthData = async (id: string, updates: Partial<HealthDataPoint>) => {
    if (!client) return;
    
    try {
      const result = await client.mutate(`
        mutation UpdateHealthData($id: ID!, $updates: HealthDataPointInput!) {
          updateHealthDataPoint(id: $id, updates: $updates) {
            id
            type
            value
            unit
            timestamp
            verified
            source
            goalId
            metadata
          }
        }
      `, {
        id,
        updates: {
          ...updates,
          updatedAt: Date.now()
        }
      });

      if (result?.updateHealthDataPoint) {
        setHealthData(prev => 
          prev.map(item => 
            item.id === id ? result.updateHealthDataPoint : item
          )
        );
      }
      
      return result?.updateHealthDataPoint;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update health data');
      throw err;
    }
  };

  // Delete health data point
  const deleteHealthData = async (id: string) => {
    if (!client) return;
    
    try {
      await client.mutate(`
        mutation DeleteHealthData($id: ID!) {
          deleteHealthDataPoint(id: $id)
        }
      `, { id });

      setHealthData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete health data');
      throw err;
    }
  };

  // Filter health data by type
  const getHealthDataByType = (type: string) => {
    return healthData.filter(item => item.type === type);
  };

  // Get verified health data
  const getVerifiedHealthData = () => {
    return healthData.filter(item => item.verified);
  };

  useEffect(() => {
    fetchHealthData();
  }, [client]);

  return {
    healthData,
    loading,
    error,
    fetchHealthData,
    addHealthData,
    updateHealthData,
    deleteHealthData,
    getHealthDataByType,
    getVerifiedHealthData,
  };
}

// Custom hook for managing privacy settings
export function usePrivacySettings() {
  const { client } = useHypergraph();
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch privacy settings
  const fetchPrivacySettings = async () => {
    if (!client) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.query(`
        query GetPrivacySettings {
          PrivacySetting {
            dataType
            shareLevel
            authorizedUsers
            allowPublicGraph
            updatedAt
          }
        }
      `);

      if (result?.PrivacySetting) {
        setPrivacySettings(result.PrivacySetting);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch privacy settings');
    } finally {
      setLoading(false);
    }
  };

  // Update privacy setting
  const updatePrivacySetting = async (
    dataType: string, 
    shareLevel: string, 
    allowPublic: boolean
  ) => {
    if (!client) return;
    
    try {
      const result = await client.mutate(`
        mutation UpdatePrivacySetting($dataType: String!, $shareLevel: String!, $allowPublic: Boolean!) {
          updatePrivacySetting(
            dataType: $dataType
            shareLevel: $shareLevel
            allowPublicGraph: $allowPublic
          ) {
            dataType
            shareLevel
            authorizedUsers
            allowPublicGraph
            updatedAt
          }
        }
      `, {
        dataType,
        shareLevel,
        allowPublic
      });

      if (result?.updatePrivacySetting) {
        setPrivacySettings(prev => 
          prev.map(setting => 
            setting.dataType === dataType 
              ? { ...setting, shareLevel: shareLevel as any, allowPublicGraph: allowPublic, updatedAt: Date.now() }
              : setting
          )
        );
      }
      
      return result?.updatePrivacySetting;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update privacy setting');
      throw err;
    }
  };

  useEffect(() => {
    fetchPrivacySettings();
  }, [client]);

  return {
    privacySettings,
    loading,
    error,
    fetchPrivacySettings,
    updatePrivacySetting,
  };
}

// Custom hook for managing health goals
export function useHealthGoals() {
  const { client } = useHypergraph();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch health goals
  const fetchGoals = async () => {
    if (!client) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.query(`
        query GetHealthGoals {
          HealthGoal {
            id
            title
            description
            targetValue
            currentValue
            reward
            deadline
            sponsor
            status
            healthDataType
            conditions
            completedAt
            createdAt
            updatedAt
          }
        }
      `);

      if (result?.HealthGoal) {
        setGoals(result.HealthGoal);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health goals');
    } finally {
      setLoading(false);
    }
  };

  // Add new health goal
  const addGoal = async (goalData: Omit<HealthGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!client) return;
    
    try {
      const result = await client.mutate(`
        mutation AddHealthGoal($data: HealthGoalInput!) {
          createHealthGoal(data: $data) {
            id
            title
            description
            targetValue
            currentValue
            reward
            deadline
            sponsor
            status
            healthDataType
            conditions
            completedAt
            createdAt
            updatedAt
          }
        }
      `, {
        data: {
          ...goalData,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      });

      if (result?.createHealthGoal) {
        setGoals(prev => [...prev, result.createHealthGoal]);
      }
      
      return result?.createHealthGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add health goal');
      throw err;
    }
  };

  // Update goal progress
  const updateGoalProgress = async (id: string, currentValue: number) => {
    if (!client) return;
    
    try {
      const result = await client.mutate(`
        mutation UpdateGoalProgress($id: ID!, $currentValue: Number!) {
          updateHealthGoal(id: $id, updates: { currentValue: $currentValue, updatedAt: $updatedAt }) {
            id
            currentValue
            updatedAt
          }
        }
      `, {
        id,
        currentValue,
        updatedAt: Date.now()
      });

      if (result?.updateHealthGoal) {
        setGoals(prev => 
          prev.map(goal => 
            goal.id === id 
              ? { ...goal, currentValue, updatedAt: Date.now() }
              : goal
          )
        );
      }
      
      return result?.updateHealthGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal progress');
      throw err;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [client]);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    addGoal,
    updateGoalProgress,
  };
}
