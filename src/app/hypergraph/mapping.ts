import type { Mapping } from '@graphprotocol/hypergraph';
import { Id } from '@graphprotocol/hypergraph';

export const mapping: Mapping.Mapping = {
  HealthDataPoint: {
    typeIds: [Id('health-data-point-0010-499d-a0a3-caaa7f579d0e')],
    properties: {
      type: Id('health-data-type-0c8e-48d5-b888-82c734c38935'),
      value: Id('health-data-value-9711-404c-861e-59dc3fa7d037'),
      unit: Id('health-data-unit-4b3c-4b57-a86f-de45c997c73c'),
      timestamp: Id('health-data-timestamp-fad5-49b7-a2e0-da4777b8792c'),
      verified: Id('health-data-verified-698a-4bbf-a76b-8e2741b2dc8c'),
      source: Id('health-data-source-973c-4adc-8f53-614f598d262d'),
      goalId: Id('health-data-goal-id-3fa1-4686-b74f-fcb3e9438067'),
      metadata: Id('health-data-metadata-59e4-44a8-a625-c0a40b1ff330'),
    },
  },
  UserProfile: {
    typeIds: [Id('user-profile-0020-499d-a0a3-caaa7f579d0e')],
    properties: {
      address: Id('user-address-0c8e-48d5-b888-82c734c38935'),
      username: Id('user-username-9711-404c-861e-59dc3fa7d037'),
      bio: Id('user-bio-4b3c-4b57-a86f-de45c997c73c'),
      avatar: Id('user-avatar-fad5-49b7-a2e0-da4777b8792c'),
      healthGoals: Id('user-health-goals-698a-4bbf-a76b-8e2741b2dc8c'),
      achievements: Id('user-achievements-973c-4adc-8f53-614f598d262d'),
      isVerified: Id('user-verified-3fa1-4686-b74f-fcb3e9438067'),
      createdAt: Id('user-created-at-59e4-44a8-a625-c0a40b1ff330'),
    },
  },
  HealthGoal: {
    typeIds: [Id('health-goal-0030-499d-a0a3-caaa7f579d0e')],
    properties: {
      title: Id('goal-title-0c8e-48d5-b888-82c734c38935'),
      description: Id('goal-description-9711-404c-861e-59dc3fa7d037'),
      targetValue: Id('goal-target-value-4b3c-4b57-a86f-de45c997c73c'),
      currentValue: Id('goal-current-value-fad5-49b7-a2e0-da4777b8792c'),
      reward: Id('goal-reward-698a-4bbf-a76b-8e2741b2dc8c'),
      deadline: Id('goal-deadline-973c-4adc-8f53-614f598d262d'),
      sponsor: Id('goal-sponsor-3fa1-4686-b74f-fcb3e9438067'),
      status: Id('goal-status-59e4-44a8-a625-c0a40b1ff330'),
      healthDataType: Id('goal-health-data-type-0c8e-48d5-b888-82c734c38935'),
      conditions: Id('goal-conditions-9711-404c-861e-59dc3fa7d037'),
      completedAt: Id('goal-completed-at-4b3c-4b57-a86f-de45c997c73c'),
      createdAt: Id('goal-created-at-fad5-49b7-a2e0-da4777b8792c'),
      updatedAt: Id('goal-updated-at-698a-4bbf-a76b-8e2741b2dc8c'),
    },
  },
  HealthReward: {
    typeIds: [Id('health-reward-0040-499d-a0a3-caaa7f579d0e')],
    properties: {
      amount: Id('reward-amount-0c8e-48d5-b888-82c734c38935'),
      transactionHash: Id('reward-tx-hash-9711-404c-861e-59dc3fa7d037'),
      timestamp: Id('reward-timestamp-4b3c-4b57-a86f-de45c997c73c'),
      sponsor: Id('reward-sponsor-fad5-49b7-a2e0-da4777b8792c'),
      claimed: Id('reward-claimed-698a-4bbf-a76b-8e2741b2dc8c'),
      claimedAt: Id('reward-claimed-at-973c-4adc-8f53-614f598d262d'),
    },
    relations: {
      goal: Id('reward-goal-relation-3fa1-4686-b74f-fcb3e9438067'),
    },
  },
  PrivacySetting: {
    typeIds: [Id('privacy-setting-0050-499d-a0a3-caaa7f579d0e')],
    properties: {
      dataType: Id('privacy-data-type-0c8e-48d5-b888-82c734c38935'),
      shareLevel: Id('privacy-share-level-9711-404c-861e-59dc3fa7d037'),
      authorizedUsers: Id('privacy-authorized-users-4b3c-4b57-a86f-de45c997c73c'),
      allowPublicGraph: Id('privacy-allow-public-fad5-49b7-a2e0-da4777b8792c'),
      updatedAt: Id('privacy-updated-at-698a-4bbf-a76b-8e2741b2dc8c'),
    },
  },
  AccessLog: {
    typeIds: [Id('access-log-0060-499d-a0a3-caaa7f579d0e')],
    properties: {
      requester: Id('access-requester-0c8e-48d5-b888-82c734c38935'),
      dataType: Id('access-data-type-9711-404c-861e-59dc3fa7d037'),
      purpose: Id('access-purpose-4b3c-4b57-a86f-de45c997c73c'),
      granted: Id('access-granted-fad5-49b7-a2e0-da4777b8792c'),
      timestamp: Id('access-timestamp-698a-4bbf-a76b-8e2741b2dc8c'),
    },
  },
  HealthMetrics: {
    typeIds: [Id('health-metrics-0070-499d-a0a3-caaa7f579d0e')],
    properties: {
      userId: Id('metrics-user-id-0c8e-48d5-b888-82c734c38935'),
      dataType: Id('metrics-data-type-9711-404c-861e-59dc3fa7d037'),
      averageValue: Id('metrics-average-value-4b3c-4b57-a86f-de45c997c73c'),
      totalCount: Id('metrics-total-count-fad5-49b7-a2e0-da4777b8792c'),
      lastUpdated: Id('metrics-last-updated-698a-4bbf-a76b-8e2741b2dc8c'),
      isPublic: Id('metrics-is-public-973c-4adc-8f53-614f598d262d'),
    },
  },
  HealthChallenge: {
    typeIds: [Id('health-challenge-0080-499d-a0a3-caaa7f579d0e')],
    properties: {
      title: Id('challenge-title-0c8e-48d5-b888-82c734c38935'),
      description: Id('challenge-description-9711-404c-861e-59dc3fa7d037'),
      startDate: Id('challenge-start-date-4b3c-4b57-a86f-de45c997c73c'),
      endDate: Id('challenge-end-date-fad5-49b7-a2e0-da4777b8792c'),
      targetMetric: Id('challenge-target-metric-698a-4bbf-a76b-8e2741b2dc8c'),
      targetValue: Id('challenge-target-value-973c-4adc-8f53-614f598d262d'),
      reward: Id('challenge-reward-3fa1-4686-b74f-fcb3e9438067'),
      participants: Id('challenge-participants-59e4-44a8-a625-c0a40b1ff330'),
      winner: Id('challenge-winner-0c8e-48d5-b888-82c734c38935'),
      status: Id('challenge-status-9711-404c-861e-59dc3fa7d037'),
      createdAt: Id('challenge-created-at-4b3c-4b57-a86f-de45c997c73c'),
    },
  },
  HealthInsight: {
    typeIds: [Id('health-insight-0090-499d-a0a3-caaa7f579d0e')],
    properties: {
      userId: Id('insight-user-id-0c8e-48d5-b888-82c734c38935'),
      insightType: Id('insight-type-9711-404c-861e-59dc3fa7d037'),
      title: Id('insight-title-4b3c-4b57-a86f-de45c997c73c'),
      description: Id('insight-description-fad5-49b7-a2e0-da4777b8792c'),
      data: Id('insight-data-698a-4bbf-a76b-8e2741b2dc8c'),
      confidence: Id('insight-confidence-973c-4adc-8f53-614f598d262d'),
      isPublic: Id('insight-is-public-3fa1-4686-b74f-fcb3e9438067'),
      createdAt: Id('insight-created-at-59e4-44a8-a625-c0a40b1ff330'),
    },
  },
};
