import type { Mapping } from '@graphprotocol/hypergraph';
import { Id } from '@graphprotocol/hypergraph';

export const mapping: Mapping.Mapping = {
  HealthDataPoint: {
    typeIds: [Id('00100000-499d-a0a3-caaa-7f579d0e0001')],
    properties: {
      type: Id('0c8e48d5-b888-82c7-34c3-893500000001'),
      value: Id('9711404c-861e-59dc-3fa7-d03700000001'),
      unit: Id('4b3c4b57-a86f-de45-c997-c73c00000001'),
      timestamp: Id('fad549b7-a2e0-da47-77b8-792c00000001'),
      verified: Id('698a4bbf-a76b-8e27-41b2-dc8c00000001'),
      source: Id('973c4adc-8f53-6145-98d2-62d000000001'),
      goalId: Id('3fa14686-b74f-fcb3-e943-806700000001'),
      metadata: Id('59e444a8-a625-c0a4-0b1f-f33000000001'),
    },
  },
  UserProfile: {
    typeIds: [Id('00200000-499d-a0a3-caaa-7f579d0e0002')],
    properties: {
      address: Id('0c8e48d5-b888-82c7-34c3-893500000002'),
      username: Id('9711404c-861e-59dc-3fa7-d03700000002'),
      bio: Id('4b3c4b57-a86f-de45-c997-c73c00000002'),
      avatar: Id('fad549b7-a2e0-da47-77b8-792c00000002'),
      healthGoals: Id('698a4bbf-a76b-8e27-41b2-dc8c00000002'),
      achievements: Id('973c4adc-8f53-6145-98d2-62d000000002'),
      isVerified: Id('3fa14686-b74f-fcb3-e943-806700000002'),
      createdAt: Id('59e444a8-a625-c0a4-0b1f-f33000000002'),
    },
  },
  HealthGoal: {
    typeIds: [Id('00300000-499d-a0a3-caaa-7f579d0e0003')],
    properties: {
      title: Id('0c8e48d5-b888-82c7-34c3-893500000003'),
      description: Id('9711404c-861e-59dc-3fa7-d03700000003'),
      targetValue: Id('4b3c4b57-a86f-de45-c997-c73c00000003'),
      currentValue: Id('fad549b7-a2e0-da47-77b8-792c00000003'),
      reward: Id('698a4bbf-a76b-8e27-41b2-dc8c00000003'),
      deadline: Id('973c4adc-8f53-6145-98d2-62d000000003'),
      sponsor: Id('3fa14686-b74f-fcb3-e943-806700000003'),
      status: Id('59e444a8-a625-c0a4-0b1f-f33000000003'),
      healthDataType: Id('0c8e48d5-b888-82c7-34c3-893500000013'),
      conditions: Id('9711404c-861e-59dc-3fa7-d03700000013'),
      completedAt: Id('4b3c4b57-a86f-de45-c997-c73c00000013'),
      createdAt: Id('fad549b7-a2e0-da47-77b8-792c00000013'),
      updatedAt: Id('698a4bbf-a76b-8e27-41b2-dc8c00000013'),
    },
  },
  HealthReward: {
    typeIds: [Id('00400000-499d-a0a3-caaa-7f579d0e0004')],
    properties: {
      amount: Id('0c8e48d5-b888-82c7-34c3-893500000004'),
      transactionHash: Id('9711404c-861e-59dc-3fa7-d03700000004'),
      timestamp: Id('4b3c4b57-a86f-de45-c997-c73c00000004'),
      sponsor: Id('fad549b7-a2e0-da47-77b8-792c00000004'),
      claimed: Id('698a4bbf-a76b-8e27-41b2-dc8c00000004'),
      claimedAt: Id('973c4adc-8f53-6145-98d2-62d000000004'),
    },
    relations: {
      goal: Id('3fa14686-b74f-fcb3-e943-806700000004'),
    },
  },
  PrivacySetting: {
    typeIds: [Id('00500000-499d-a0a3-caaa-7f579d0e0005')],
    properties: {
      dataType: Id('0c8e48d5-b888-82c7-34c3-893500000005'),
      shareLevel: Id('9711404c-861e-59dc-3fa7-d03700000005'),
      authorizedUsers: Id('4b3c4b57-a86f-de45-c997-c73c00000005'),
      allowPublicGraph: Id('fad549b7-a2e0-da47-77b8-792c00000005'),
      updatedAt: Id('698a4bbf-a76b-8e27-41b2-dc8c00000005'),
    },
  },
  AccessLog: {
    typeIds: [Id('00600000-499d-a0a3-caaa-7f579d0e0006')],
    properties: {
      requester: Id('0c8e48d5-b888-82c7-34c3-893500000006'),
      dataType: Id('9711404c-861e-59dc-3fa7-d03700000006'),
      purpose: Id('4b3c4b57-a86f-de45-c997-c73c00000006'),
      granted: Id('fad549b7-a2e0-da47-77b8-792c00000006'),
      timestamp: Id('698a4bbf-a76b-8e27-41b2-dc8c00000006'),
    },
  },
  HealthMetrics: {
    typeIds: [Id('00700000-499d-a0a3-caaa-7f579d0e0007')],
    properties: {
      userId: Id('0c8e48d5-b888-82c7-34c3-893500000007'),
      dataType: Id('9711404c-861e-59dc-3fa7-d03700000007'),
      averageValue: Id('4b3c4b57-a86f-de45-c997-c73c00000007'),
      totalCount: Id('fad549b7-a2e0-da47-77b8-792c00000007'),
      lastUpdated: Id('698a4bbf-a76b-8e27-41b2-dc8c00000007'),
      isPublic: Id('973c4adc-8f53-6145-98d2-62d000000007'),
    },
  },
  HealthChallenge: {
    typeIds: [Id('00800000-499d-a0a3-caaa-7f579d0e0008')],
    properties: {
      title: Id('0c8e48d5-b888-82c7-34c3-893500000008'),
      description: Id('9711404c-861e-59dc-3fa7-d03700000008'),
      startDate: Id('4b3c4b57-a86f-de45-c997-c73c00000008'),
      endDate: Id('fad549b7-a2e0-da47-77b8-792c00000008'),
      targetMetric: Id('698a4bbf-a76b-8e27-41b2-dc8c00000008'),
      targetValue: Id('973c4adc-8f53-6145-98d2-62d000000008'),
      reward: Id('3fa14686-b74f-fcb3-e943-806700000008'),
      participants: Id('59e444a8-a625-c0a4-0b1f-f33000000008'),
      winner: Id('0c8e48d5-b888-82c7-34c3-893500000018'),
      status: Id('9711404c-861e-59dc-3fa7-d03700000018'),
      createdAt: Id('4b3c4b57-a86f-de45-c997-c73c00000018'),
    },
  },
  HealthInsight: {
    typeIds: [Id('00900000-499d-a0a3-caaa-7f579d0e0009')],
    properties: {
      userId: Id('0c8e48d5-b888-82c7-34c3-893500000009'),
      insightType: Id('9711404c-861e-59dc-3fa7-d03700000009'),
      title: Id('4b3c4b57-a86f-de45-c997-c73c00000009'),
      description: Id('fad549b7-a2e0-da47-77b8-792c00000009'),
      data: Id('698a4bbf-a76b-8e27-41b2-dc8c00000009'),
      confidence: Id('973c4adc-8f53-6145-98d2-62d000000009'),
      isPublic: Id('3fa14686-b74f-fcb3-e943-806700000009'),
      createdAt: Id('59e444a8-a625-c0a4-0b1f-f33000000009'),
    },
  },
};