# GamifiedHealth 🏥⚡<img width="331" height="79" alt="Screenshot 2025-08-17 at 1 53 49 AM" src="https://github.com/user-attachments/assets/99ee8978-cae4-42af-9c7a-fd20ce5028b6" />


<img width="1267" height="737" alt="Screenshot 2025-08-17 at 1 54 56 AM" src="https://github.com/user-attachments/assets/83c77c8d-a376-4d56-94be-5fb07cb7e653" />
<img width="1233" height="762" alt="Screenshot 2025-08-17 at 1 54 42 AM" src="https://github.com/user-attachments/assets/12c86d8d-3843-437a-bf55-c6c52e339586" />
<img width="1225" height="708" alt="Screenshot 2025-08-17 at 1 54 26 AM" src="https://github.com/user-attachments/assets/d499cee8-6b72-4012-9326-505e90a9f379" />
<img width="1255" height="759" alt="Screenshot 2025-08-17 at 1 53 24 AM" src="https://github.com/user-attachments/assets/931f71eb-781a-40a6-b00a-172f22dd1e19" />


A comprehensive Web3 health tracking application that combines Flow blockchain rewards with Hypergraph data storage, creating a gamified health experience with real-time verification and instant payouts.

## 🎯 What is GamifiedHealth?

GamifiedHealth is a revolutionary platform that transforms health goals into engaging, reward-based challenges. Users can set health objectives (like improving sleep quality, increasing daily steps, or maintaining heart rate targets) and earn FLOW tokens automatically when they achieve their goals.

## 🚀 Key Features

- **🏆 Gamified Health Goals**: Set challenging health objectives with clear rewards
- **⛓️ Blockchain Verification**: All health data is verified and stored on Flow blockchain
- **💰 Instant Rewards**: Automatic FLOW token payouts when goals are achieved
- **🔒 Privacy-First**: Your health data stays private with Hypergraph encryption
- **📱 WHOOP Integration**: Seamlessly connect with WHOOP fitness tracker
- **🤖 Automated Verification**: No manual checking - the system verifies goals automatically
- **🎮 Real-Time Progress**: Track your health journey with live updates

## 🏗️ Architecture

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
│ • Event-driven  │    │ • Progress      │    │ • Consecutive   │
│ • Instant       │    │ • Daily Status  │    │ • FLOW Tokens   │
│ • Real-time     │    │ • Automatic     │    │ • Payouts       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Flow blockchain with Cadence smart contracts
- **Data Storage**: Hypergraph Protocol for encrypted, local-first data sync
- **Health Integration**: WHOOP API for real-time health data
- **Authentication**: Privy for Web3 login
- **Deployment**: Vercel-ready with environment configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Flow CLI installed
- WHOOP developer account
- Hypergraph CLI (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gamifiedhealth-app.git
cd gamifiedhealth-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following variables:

```bash
# WHOOP API Configuration
WHOOP_CLIENT_ID=your_whoop_client_id
WHOOP_CLIENT_SECRET=your_whoop_client_secret
WHOOP_REDIRECT_URI=http://localhost:3000/callback

# Flow Blockchain Configuration
FLOW_ADDRESS=your_flow_address
FLOW_PRIVATE_KEY=your_flow_private_key

# Hypergraph Configuration
HYPERGRAPH_APP_ID=your_hypergraph_app_id
HYPERGRAPH_APP_SECRET=your_hypergraph_app_secret

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

## 🎮 How It Works

### 1. **Set Health Goals**
Users create personalized health challenges with specific targets and rewards.

### 2. **Connect Health Devices**
Seamlessly integrate with WHOOP or other health tracking devices.

### 3. **Automated Verification**
The Flow Agent automatically verifies goals using real-time health data.

### 4. **Instant Rewards**
When goals are achieved, FLOW tokens are automatically distributed.

### 5. **Privacy Protection**
All health data is encrypted and stored locally using Hypergraph.

## 📊 Smart Contract Features

The `HealthRewards.cdc` smart contract on Flow provides:

- **Goal Creation**: Users can create custom health challenges
- **Automated Verification**: Smart contract logic for goal validation
- **Instant Payouts**: Automatic FLOW token distribution
- **Progress Tracking**: Immutable records of health achievements
- **Multi-Goal Support**: Handle multiple concurrent health objectives

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Flow Blockchain
npm run flow:deploy  # Deploy contracts to Flow
npm run flow:test    # Test smart contracts

# Hypergraph
npm run hg:dev       # Start Hypergraph development server
npm run hg:typesync  # Sync TypeScript types
```

### Project Structure

```
gamifiedhealth-app/
├── contracts/           # Flow smart contracts
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── lib/            # Utility libraries
│   └── types/          # TypeScript type definitions
├── subgraph/           # The Graph subgraph (legacy)
├── hypergraph/         # Hypergraph integration
└── scripts/            # Deployment and setup scripts
```

## 🚀 Deployment

### Flow Testnet Deployment

```bash
# Set environment variables
export FLOW_ADDRESS=your_testnet_address
export FLOW_PRIVATE_KEY=your_testnet_private_key

# Deploy contracts
./scripts/deploy-testnet.sh
```

### Production Deployment

```bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod

# Deploy contracts to Flow mainnet
./scripts/deploy-mainnet.sh
```

## 📈 Monitoring & Analytics

- **Flowscan**: Monitor blockchain transactions
- **Hypergraph Dashboard**: Track data sync status
- **Application Logs**: Real-time system monitoring
- **Health Metrics**: User engagement and goal completion rates

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Discord**: [Join our community](https://discord.gg/gamifiedhealth)
- **Documentation**: [docs.gamifiedhealth.app](https://docs.gamifiedhealth.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/gamifiedhealth-app/issues)
- **Email**: support@gamifiedhealth.app

## 🙏 Acknowledgments

- **Flow Blockchain** for scalable smart contracts
- **Hypergraph Protocol** for privacy-first data storage
- **WHOOP** for comprehensive health data
- **Next.js** for the amazing React framework
- **Community** for feedback and contributions

---

**🎯 GamifiedHealth: Where Health Meets Gaming, Rewards, and Blockchain Technology!**
