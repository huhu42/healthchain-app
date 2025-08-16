'use client';

import React, { useState, useEffect } from 'react';

interface PublicHealthData {
  userId: string;
  username?: string;
  avatar?: string;
  healthGoals: string[];
  achievements: string[];
  metrics: {
    type: string;
    averageValue: number;
    totalCount: number;
  }[];
  challenges: {
    title: string;
    status: string;
    participants: number;
  }[];
}

// Schema Viewer Component
function SchemaViewer() {
  const schema = {
    entities: [
      {
        name: 'HealthDataPoint',
        description: 'Individual health measurements',
        properties: ['type', 'value', 'unit', 'timestamp', 'verified', 'source', 'goalId', 'metadata']
      },
      {
        name: 'UserProfile',
        description: 'Public user information',
        properties: ['address', 'username', 'bio', 'avatar', 'healthGoals', 'achievements', 'isVerified', 'createdAt']
      },
      {
        name: 'HealthGoal',
        description: 'Personal health objectives',
        properties: ['title', 'description', 'targetValue', 'currentValue', 'reward', 'deadline', 'sponsor', 'status', 'healthDataType', 'conditions', 'completedAt', 'createdAt', 'updatedAt']
      },
      {
        name: 'HealthReward',
        description: 'Earned rewards for achievements',
        properties: ['amount', 'transactionHash', 'timestamp', 'sponsor', 'claimed', 'claimedAt'],
        relations: ['goal']
      },
      {
        name: 'PrivacySetting',
        description: 'Data sharing preferences',
        properties: ['dataType', 'shareLevel', 'authorizedUsers', 'allowPublicGraph', 'updatedAt']
      },
      {
        name: 'AccessLog',
        description: 'Data access tracking',
        properties: ['requester', 'dataType', 'purpose', 'granted', 'timestamp']
      },
      {
        name: 'HealthMetrics',
        description: 'Aggregated health statistics',
        properties: ['userId', 'dataType', 'averageValue', 'totalCount', 'lastUpdated', 'isPublic']
      },
      {
        name: 'HealthChallenge',
        description: 'Community competitions',
        properties: ['title', 'description', 'startDate', 'endDate', 'targetMetric', 'targetValue', 'reward', 'participants', 'winner', 'status', 'createdAt']
      },
      {
        name: 'HealthInsight',
        description: 'AI-generated health insights',
        properties: ['userId', 'insightType', 'title', 'description', 'data', 'confidence', 'isPublic', 'createdAt']
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Public Knowledge Graph Schema</h2>
      <div className="space-y-4">
        {schema.entities.map((entity, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-600">{entity.name}</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {entity.properties.length} properties
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{entity.description}</p>
            <div className="flex flex-wrap gap-2">
              {entity.properties.map((prop, propIndex) => (
                <span key={propIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {prop}
                </span>
              ))}
              {entity.relations && entity.relations.map((rel, relIndex) => (
                <span key={relIndex} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  → {rel}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PublicSpacePage() {
  const [publicData, setPublicData] = useState<PublicHealthData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'community' | 'challenges' | 'schema'>('community');

  // Mock data for demonstration
  useEffect(() => {
    setPublicData([
      {
        userId: 'user123',
        username: 'HealthChampion',
        avatar: '/avatar1.jpg',
        healthGoals: ['10K steps daily', '8 hours sleep', 'Meditation'],
        achievements: ['30-day streak', 'First 5K run', 'Weight goal met'],
        metrics: [
          { type: 'STEPS', averageValue: 9500, totalCount: 30 },
          { type: 'SLEEP', averageValue: 7.8, totalCount: 30 }
        ],
        challenges: [
          { title: 'Step Challenge', status: 'ACTIVE', participants: 45 }
        ]
      },
      {
        userId: 'user456',
        username: 'WellnessGuru',
        avatar: '/avatar2.jpg',
        healthGoals: ['Yoga practice', 'Healthy eating', 'Stress management'],
        achievements: ['100 yoga sessions', 'Clean eating month', 'Mindfulness master'],
        metrics: [
          { type: 'YOGA_SESSIONS', averageValue: 5, totalCount: 20 },
          { type: 'STRESS_LEVEL', averageValue: 2, totalCount: 30 }
        ],
        challenges: [
          { title: 'Yoga Challenge', status: 'ACTIVE', participants: 23 }
        ]
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Public Health Space
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover health achievements, join challenges, and connect with the community
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'community', name: 'Community', icon: '👥' },
                { id: 'challenges', name: 'Challenges', icon: '🏆' },
                { id: 'schema', name: 'Knowledge Graph', icon: '🧠' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'community' && (
          <>
            {/* Community Challenges */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Active Challenges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicData.map((user, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {user.username?.[0] || user.userId[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.username || `User ${user.userId.slice(0, 8)}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {user.achievements.length} achievements
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Health Goals</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.healthGoals.slice(0, 3).map((goal, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Metrics</h4>
                        <div className="space-y-1">
                          {user.metrics.slice(0, 2).map((metric, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-600">{metric.type}</span>
                              <span className="font-medium">{metric.averageValue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Health Insights */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Community Insights
              </h2>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-600 text-center">
                  Health insights and trends will appear here as the community grows
                </p>
              </div>
            </section>

            {/* Join Community */}
            <section className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Join the Health Community
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Share your health journey, participate in challenges, and inspire others to achieve their wellness goals.
                </p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                  Start Sharing
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === 'challenges' && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Health Challenges</h2>
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg mb-4">No active challenges yet</p>
              <p>Be the first to create a community health challenge!</p>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="max-w-4xl mx-auto">
            <SchemaViewer />
          </div>
        )}
      </div>
    </div>
  );
}
