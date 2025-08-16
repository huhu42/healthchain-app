# Hypergraph Backend & Data Management

This folder contains the complete Hypergraph backend for your healthchain-app, including data models, business logic, and data management hooks.

## 🏗️ **Architecture Overview**

```
src/app/hypergraph/
├── schema.ts                    # Data models and entities
├── mapping.ts                   # Hypergraph mapping configuration
├── config/
│   └── client.ts               # Hypergraph client setup
├── providers/
│   └── HypergraphProvider.tsx  # React context provider
├── hooks/
│   └── useHypergraphData.ts    # Custom hooks for data operations
├── private-space/               # Private health data management
├── public-space/                # Public community features
└── README.md                    # This file
```

## 🚀 **Getting Started**

### **1. Install Dependencies**

```bash
npm install @graphprotocol/hypergraph @graphprotocol/hypergraph-react
```

### **2. Set Environment Variables**

Create `.env.local` in your project root:

```bash
# Hypergraph Configuration
NEXT_PUBLIC_HYPERGRAPH_ENDPOINT=https://hypergraph.graphprotocol.com
HYPERGRAPH_API_KEY=your_api_key_here
```

### **3. Wrap Your App with HypergraphProvider**

In your main app layout or providers:

```tsx
import { HypergraphProvider } from './hypergraph/providers/HypergraphProvider';

export default function RootLayout({ children }) {
  return (
    <HypergraphProvider>
      {children}
    </HypergraphProvider>
  );
}
```

## 📊 **Data Models (Entities)**

### **HealthDataPoint**
- Individual health measurements (steps, heart rate, sleep, etc.)
- Includes verification status and source tracking
- Links to health goals

### **UserProfile**
- Public user information for community features
- Health goals and achievements
- Verification status

### **HealthGoal**
- Personal health objectives
- Progress tracking and rewards
- Deadline and sponsor information

### **HealthReward**
- Earned rewards for goal completion
- Links to goals and includes transaction details

### **PrivacySetting**
- Granular control over data sharing
- Four levels: PRIVATE, FAMILY, MEDICAL, PUBLIC
- Authorized user management

### **AccessLog**
- Complete audit trail of data access
- Tracks who requested data and why
- Compliance and security monitoring

### **HealthMetrics**
- Aggregated health statistics
- Public/private visibility control
- Performance tracking

### **HealthChallenge**
- Community health competitions
- Participant management
- Reward distribution

### **HealthInsight**
- AI-generated health insights
- Trend analysis and recommendations
- Confidence scoring

## 🪝 **Custom Hooks**

### **useHealthData()**
```tsx
const {
  healthData,
  loading,
  error,
  addHealthData,
  updateHealthData,
  deleteHealthData,
  getHealthDataByType,
  getVerifiedHealthData,
} = useHealthData();
```

**Operations:**
- `fetchHealthData()` - Get all health data
- `addHealthData(data)` - Add new health measurement
- `updateHealthData(id, updates)` - Update existing data
- `deleteHealthData(id)` - Remove health data
- `getHealthDataByType(type)` - Filter by data type
- `getVerifiedHealthData()` - Get only verified data

### **usePrivacySettings()**
```tsx
const {
  privacySettings,
  loading,
  error,
  updatePrivacySetting,
} = usePrivacySettings();
```

**Operations:**
- `fetchPrivacySettings()` - Get current privacy settings
- `updatePrivacySetting(dataType, shareLevel, allowPublic)` - Update sharing preferences

### **useHealthGoals()**
```tsx
const {
  goals,
  loading,
  error,
  addGoal,
  updateGoalProgress,
} = useHealthGoals();
```

**Operations:**
- `fetchGoals()` - Get all health goals
- `addGoal(goalData)` - Create new health goal
- `updateGoalProgress(id, currentValue)` - Update goal progress

## 🔐 **Privacy Controls**

### **Share Levels**
- **PRIVATE**: Only you can see this data
- **FAMILY**: Share with family members
- **MEDICAL**: Share with healthcare providers
- **PUBLIC**: Visible to everyone in the community

### **Usage Example**
```tsx
const { updatePrivacySetting } = usePrivacySettings();

// Make steps data public for community challenges
await updatePrivacySetting('STEPS', 'PUBLIC', true);

// Keep heart rate private
await updatePrivacySetting('HEART_RATE', 'PRIVATE', false);
```

## 📱 **Data Operations Examples**

### **Adding Health Data**
```tsx
const { addHealthData } = useHealthData();

const newData = {
  type: 'STEPS',
  value: 8500,
  unit: 'steps',
  verified: true,
  source: 'Fitbit',
  goalId: 'goal123',
  metadata: JSON.stringify({ location: 'outdoor', weather: 'sunny' })
};

await addHealthData(newData);
```

### **Creating Health Goals**
```tsx
const { addGoal } = useHealthGoals();

const newGoal = {
  title: '10K Steps Daily',
  description: 'Walk 10,000 steps every day for 30 days',
  targetValue: 10000,
  currentValue: 0,
  reward: 100,
  deadline: Date.now() + (30 * 24 * 60 * 60 * 1000),
  sponsor: 'HealthChain',
  status: 'ACTIVE',
  healthDataType: 'STEPS',
  conditions: ['daily', 'verified']
};

await addGoal(newGoal);
```

### **Updating Goal Progress**
```tsx
const { updateGoalProgress } = useHealthGoals();

// Update current progress
await updateGoalProgress('goal123', 7500);
```

## 🔄 **Real-time Features**

### **Automatic Sync**
- Data automatically syncs across devices
- Offline support with sync when online
- Real-time updates for collaborative features

### **Conflict Resolution**
- Automatic conflict detection and resolution
- Last-write-wins with timestamp tracking
- Merge strategies for complex data

## 🚨 **Error Handling**

All hooks include comprehensive error handling:

```tsx
const { healthData, loading, error } = useHealthData();

if (error) {
  console.error('Health data error:', error);
  // Show user-friendly error message
}

if (loading) {
  // Show loading spinner
}
```

## 🔧 **Configuration Options**

### **Client Options**
- **Timeout**: 30 seconds for operations
- **Retry**: 3 attempts with 1-second delays
- **Caching**: 5-minute TTL for performance
- **Subscriptions**: Real-time updates enabled

### **Environment Variables**
- `NEXT_PUBLIC_HYPERGRAPH_ENDPOINT`: Your Hypergraph node URL
- `HYPERGRAPH_API_KEY`: Authentication key (if required)

## 📚 **Next Steps**

1. **Deploy Schema**: Deploy your schema to Hypergraph network
2. **Test Operations**: Use the hooks to test CRUD operations
3. **Add Authentication**: Integrate with your existing auth system
4. **Real Data**: Replace mock data with real health device integration
5. **Community Features**: Enable public sharing and challenges

## 🆘 **Troubleshooting**

### **Common Issues**
- **Client not connected**: Check environment variables and network
- **Schema errors**: Verify entity definitions match Hypergraph requirements
- **Permission denied**: Check API keys and authentication
- **Sync issues**: Verify network connectivity and conflict resolution

### **Debug Mode**
Enable debug logging by setting:
```bash
NEXT_PUBLIC_DEBUG=true
```

Your Hypergraph backend is now fully set up with comprehensive data management, privacy controls, and real-time sync capabilities!
