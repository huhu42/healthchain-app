# 🌙 30-Day Sleep Goal Workflow: Complete System Walkthrough

## 🎯 **Overview**
This document explains the complete automated workflow for a 30-day sleep improvement goal that:
- **Creates** a smart contract goal on Flow blockchain
- **Automatically** collects WHOOP sleep data daily
- **Writes** sleep data to blockchain at designated times
- **Verifies** goals using Flow Agent
- **Pays out** rewards automatically when criteria are met

---

## 🚀 **Complete Workflow: Step by Step**

### **Step 1: Create the 30-Day Sleep Goal**
```
🎯 User creates goal → System generates 30 daily check slots
```

**What happens:**
1. User clicks "Create Sleep Goal" button
2. System creates a `SleepGoal` object with:
   - **Target**: Sleep score >80
   - **Duration**: 30 consecutive days
   - **Reward**: $1 per successful day ($30 total)
   - **Daily Checks**: 30 slots for tracking progress
3. Goal is stored locally and ready for blockchain deployment

**Code**: `sleepGoalWorkflow.createSleepGoal()`

---

### **Step 2: Deploy Smart Contract to Flow Blockchain**
```
📦 Goal data → Flow testnet → Smart contract deployed → Contract address returned
```

**What happens:**
1. System calls Flow CLI to deploy `HealthRewards.cdc` contract
2. Contract is deployed to Flow testnet
3. Goal parameters are written to blockchain:
   - Goal ID, target score, duration, reward amount
   - Verification conditions and payout logic
4. Contract address and blockchain goal ID are returned
5. Goal is now "live" on blockchain

**Code**: `sleepGoalWorkflow.deploySmartContract(goal)`

**Flow Contract Functions Used:**
- `createGoal()` - Creates the goal on blockchain
- `verifyGoalWithWhoopData()` - Handles verification logic
- `distributeReward()` - Executes payouts

---

### **Step 3: Start Daily Automation**
```
🤖 Daily scheduler → WHOOP data collection → Blockchain writing → Flow Agent verification → Automatic payout
```

**What happens:**
1. **Daily Scheduler** starts running at 9:00 AM daily
2. **WHOOP Data Collection** fetches latest sleep data
3. **Blockchain Writing** stores sleep data on Flow
4. **Flow Agent Verification** checks if daily goal met
5. **Progress Tracking** updates consecutive success days
6. **Automatic Payout** when 30 days completed

---

## 🔄 **Daily Automation Cycle (9:00 AM Daily)**

### **3a. Get Sleep Data from WHOOP**
```
📊 WHOOP API → Sleep score extraction → Data validation
```

**Process:**
1. Flow Agent calls WHOOP API
2. Fetches sleep data for the specific date
3. Extracts sleep score (0-100 scale)
4. Validates data quality and completeness
5. Logs sleep score and timestamp

**Code**: `getWhoopSleepData(date)`

### **3b. Write Sleep Data to Blockchain**
```
⛓️ Sleep data → Flow smart contract → Transaction hash → Blockchain storage
```

**Process:**
1. Flow Agent calls smart contract function
2. Writes to blockchain:
   - Date and timestamp
   - Sleep score value
   - Goal ID reference
   - Verification status
3. Returns transaction hash for tracking
4. Data is now immutable on blockchain

**Code**: `writeSleepDataToBlockchain(goal, dailyCheck)`

**Blockchain Data Structure:**
```json
{
  "goalId": "goal_1234567890",
  "date": "2025-08-17",
  "sleepScore": 85,
  "passed": true,
  "timestamp": "2025-08-17T09:00:00Z",
  "transactionHash": "0xabc123..."
}
```

### **3c. Flow Agent Queries Blockchain & Verifies**
```
🤖 Blockchain query → Goal verification → Success/failure determination
```

**Process:**
1. Flow Agent queries blockchain for today's data
2. Compares sleep score against goal target (>80)
3. Updates consecutive success days counter
4. Marks daily check as verified
5. Logs verification result

**Code**: `verifyDailyCheck(goal, dailyCheck)`

**Verification Logic:**
```typescript
if (sleepScore >= goal.targetScore) {
  dailyCheck.passed = true
  dailyCheck.verified = true
  // Update consecutive days counter
} else {
  dailyCheck.passed = false
  dailyCheck.verified = true
  // Reset consecutive days counter
}
```

### **3d. Check Goal Completion & Execute Payout**
```
🎯 Progress check → Completion criteria → Automatic payout → Goal status update
```

**Process:**
1. System checks if 30 consecutive successful days achieved
2. If criteria met:
   - Calculates total payout (successful days × $1)
   - Calls smart contract payout function
   - Executes FLOW token transfer
   - Updates goal status to "completed"
3. If not complete:
   - Continues daily monitoring
   - Tracks progress toward 30-day goal

**Code**: `checkGoalCompletion(goal)` and `executeFinalPayout(goal)`

---

## 🔗 **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WHOOP API     │    │  Flow Agent     │    │ Flow Blockchain │
│                 │    │                 │    │                 │
│ • Sleep Data    │───▶│ • Daily Checks  │───▶│ • Smart Contract│
│ • Real-time     │    │ • Verification  │    │ • Goal Storage  │
│ • OAuth 2.0     │    │ • Payout Logic  │    │ • Data Immutable│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Webhook System │    │  Goal Tracking  │    │  Reward Pool    │
│                 │    │                 │    │                 │
│ • Event-driven  │    │ • Progress      │    │ • FLOW Tokens   │
│ • Instant       │    │ • Consecutive   │    │ • Automatic     │
│ • Real-time     │    │ • Daily Status  │    │ • Payouts       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🧪 **Testing the Complete System**

### **1. Demo Page**
Visit: `http://localhost:3001/sleep-workflow-demo`

### **2. Step-by-Step Testing**
```
1. Create Sleep Goal → 2. Deploy Contract → 3. Start Automation
```

### **3. Manual Testing Commands**
```bash
# Test webhook system
curl -X POST http://localhost:3001/api/whoop/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"event_type": "sleep_completed"}'

# Check webhook status
curl http://localhost:3001/api/whoop/webhook

# View test events
curl http://localhost:3001/api/whoop/webhook/test
```

### **4. Console Monitoring**
Watch browser console for real-time workflow logs:
- Goal creation
- Contract deployment
- Daily automation
- Verification results
- Payout execution

---

## 🚀 **Production Deployment**

### **1. Flow Testnet Deployment**
```bash
# Set environment variables
export FLOW_ADDRESS=your_testnet_address
export FLOW_PRIVATE_KEY=your_testnet_private_key

# Deploy contract
./scripts/deploy-testnet.sh
```

### **2. WHOOP Webhook Configuration**
```
Webhook URL: https://yourdomain.com/api/whoop/webhook
Events: sleep_completed, workout_completed, recovery_updated
```

### **3. Environment Variables**
```bash
# .env file
FLOW_ADDRESS=0x1234567890abcdef
FLOW_PRIVATE_KEY=your_private_key
WHOOP_CLIENT_ID=your_whoop_client_id
WHOOP_CLIENT_SECRET=your_whoop_client_secret
WHOOP_REDIRECT_URI=https://yourdomain.com/callback
```

---

## 📊 **Data Flow Timeline**

```
Day 1: Goal Created → Contract Deployed → Automation Started
Day 2: 9:00 AM → WHOOP Data → Blockchain → Verification → Day 1 ✅
Day 3: 9:00 AM → WHOOP Data → Blockchain → Verification → Day 2 ✅
...
Day 30: 9:00 AM → WHOOP Data → Blockchain → Verification → Day 30 ✅
        → Goal Complete → Automatic Payout → $30 FLOW Tokens
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**
1. **WHOOP Authentication**: Check OAuth flow and token refresh
2. **Blockchain Connection**: Verify Flow network and contract deployment
3. **Webhook Delivery**: Check endpoint accessibility and signature verification
4. **Data Verification**: Monitor Flow Agent logs and blockchain transactions

### **Debug Commands:**
```bash
# Check Flow Agent status
curl http://localhost:3001/api/flow-agent/status

# Test blockchain connection
flow contracts get --network testnet HealthRewards

# Verify webhook endpoint
curl -X POST http://localhost:3001/api/whoop/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"event_type": "sleep_completed"}'
```

---

## 🎉 **Success Indicators**

### **Goal Completion:**
- ✅ 30 consecutive days with sleep score >80
- ✅ All daily checks verified on blockchain
- ✅ Automatic payout executed
- ✅ Goal status: "completed"

### **System Health:**
- 🔄 Daily automation running at 9:00 AM
- 📊 WHOOP data flowing consistently
- ⛓️ Blockchain transactions successful
- 🤖 Flow Agent verification active
- 💰 Reward pool properly funded

---

## 🚀 **Next Steps**

1. **Test the complete workflow** using the demo page
2. **Deploy to Flow testnet** using the deployment script
3. **Configure WHOOP webhooks** for production
4. **Monitor system performance** and adjust automation timing
5. **Scale to multiple goals** and users

---

**🎯 This system demonstrates a fully automated, blockchain-powered health goal verification system that eliminates manual intervention and provides instant, transparent rewards!**
