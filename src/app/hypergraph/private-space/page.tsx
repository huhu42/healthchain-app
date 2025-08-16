'use client';

import React, { useState, useEffect } from 'react';

interface PrivateHealthData {
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

interface PrivacySetting {
  dataType: string;
  shareLevel: 'PRIVATE' | 'FAMILY' | 'MEDICAL' | 'PUBLIC';
  authorizedUsers: string[];
  allowPublicGraph: boolean;
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
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Knowledge Graph Schema</h2>
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

export default function PrivateSpacePage() {
  const [healthData, setHealthData] = useState<PrivateHealthData[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'data' | 'privacy' | 'schema'>('data');

  // Mock data for demonstration
  useEffect(() => {
    setHealthData([
      {
        id: '1',
        type: 'STEPS',
        value: 8500,
        unit: 'steps',
        timestamp: Date.now() - 86400000,
        verified: true,
        source: 'Fitbit'
      },
      {
        id: '2',
        type: 'HEART_RATE',
        value: 72,
        unit: 'bpm',
        timestamp: Date.now() - 3600000,
        verified: true,
        source: 'Apple Watch'
      },
      {
        id: '3',
        type: 'SLEEP',
        value: 7.5,
        unit: 'hours',
        timestamp: Date.now() - 86400000,
        verified: false,
        source: 'Manual Entry'
      }
    ]);

    setPrivacySettings([
      {
        dataType: 'STEPS',
        shareLevel: 'PUBLIC',
        authorizedUsers: [],
        allowPublicGraph: true
      },
      {
        dataType: 'HEART_RATE',
        shareLevel: 'MEDICAL',
        authorizedUsers: ['doctor123'],
        allowPublicGraph: false
      },
      {
        dataType: 'SLEEP',
        shareLevel: 'PRIVATE',
        authorizedUsers: [],
        allowPublicGraph: false
      }
    ]);
  }, []);

  const updatePrivacySetting = async (dataType: string, shareLevel: string, allowPublic: boolean) => {
    // Update privacy setting logic would go here
    setPrivacySettings(prev => 
      prev.map(setting => 
        setting.dataType === dataType 
          ? { ...setting, shareLevel: shareLevel as any, allowPublicGraph: allowPublic }
          : setting
      )
    );
  };

  const filteredHealthData = selectedDataType === 'all' 
    ? healthData 
    : healthData.filter(data => data.type === selectedDataType);

  const getShareLevelColor = (level: string) => {
    switch (level) {
      case 'PRIVATE': return 'bg-red-100 text-red-800';
      case 'FAMILY': return 'bg-yellow-100 text-yellow-800';
      case 'MEDICAL': return 'bg-blue-100 text-blue-800';
      case 'PUBLIC': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Private Health Space
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your personal health data and control who can access it
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'data', name: 'Health Data', icon: '📊' },
                { id: 'privacy', name: 'Privacy Controls', icon: '🛡️' },
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
        {activeTab === 'data' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Health Data Section */}
            <div className="lg:col-span-2">
              {/* Data Type Filter */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Data</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setSelectedDataType('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDataType === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Data
                  </button>
                  {Array.from(new Set(healthData.map(d => d.type))).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedDataType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDataType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Source</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Verified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHealthData.map((data) => (
                        <tr key={data.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {data.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {data.value} {data.unit}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(data.timestamp).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{data.source}</td>
                          <td className="py-3 px-4">
                            {data.verified ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-gray-400">○</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Insights */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {healthData.length}
                    </div>
                    <div className="text-sm text-blue-600">Total Records</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {healthData.filter(d => d.verified).length}
                    </div>
                    <div className="text-sm text-green-600">Verified Records</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Array.from(new Set(healthData.map(d => d.type))).length}
                    </div>
                    <div className="text-sm text-purple-600">Data Types</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Controls Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Controls</h2>
                
                <div className="space-y-4">
                  {privacySettings.map((setting, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{setting.dataType}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getShareLevelColor(setting.shareLevel)}`}>
                          {setting.shareLevel}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-600">Share Level</label>
                          <select
                            value={setting.shareLevel}
                            onChange={(e) => updatePrivacySetting(setting.dataType, e.target.value, setting.allowPublicGraph)}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="PRIVATE">Private</option>
                            <option value="FAMILY">Family</option>
                            <option value="MEDICAL">Medical</option>
                            <option value="PUBLIC">Public</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`public-${index}`}
                            checked={setting.allowPublicGraph}
                            onChange={(e) => updatePrivacySetting(setting.dataType, setting.shareLevel, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`public-${index}`} className="ml-2 text-sm text-gray-600">
                            Allow in public graph
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Privacy Tips</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Private: Only you can see this data</li>
                    <li>• Family: Share with family members</li>
                    <li>• Medical: Share with healthcare providers</li>
                    <li>• Public: Visible to everyone</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Privacy Controls */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Controls</h2>
              
              <div className="space-y-4">
                {privacySettings.map((setting, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{setting.dataType}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getShareLevelColor(setting.shareLevel)}`}>
                        {setting.shareLevel}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Share Level</label>
                        <select
                          value={setting.shareLevel}
                          onChange={(e) => updatePrivacySetting(setting.dataType, e.target.value, setting.allowPublicGraph)}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="PRIVATE">Private</option>
                          <option value="FAMILY">Family</option>
                          <option value="MEDICAL">Medical</option>
                          <option value="PUBLIC">Public</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`public-${index}`}
                          checked={setting.allowPublicGraph}
                          onChange={(e) => updatePrivacySetting(setting.dataType, setting.shareLevel, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`public-${index}`} className="ml-2 text-sm text-gray-600">
                          Allow in public graph
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Logs */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Access Logs</h2>
              <div className="text-center text-gray-500 py-8">
                <p>Access logs will appear here as data is requested</p>
              </div>
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
