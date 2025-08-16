# HealthChain 🏥⚡

A comprehensive, production-ready Web3 health tracking application that incentivizes healthy behavior through blockchain rewards, powered by Flow blockchain, The Graph Protocol, Coinbase Developer Platform, and x402 automated payments.

## 🌟 Features

### Core Health Tracking
- **Smart Goal Setting**: Create personalized health goals with reward incentives
- **Multi-metric Support**: Track sleep, steps, heart rate, blood pressure, weight, and custom metrics
- **Wearable Integration**: Sync data from fitness trackers and health apps
- **Real-time Analytics**: Visualize health trends and progress

### Blockchain-Powered Rewards
- **Flow Smart Contracts**: Decentralized goal management and reward distribution
- **Automated Payments**: x402 protocol integration for automatic reward payouts
- **Multi-sponsor Support**: Family, employers, and community funding
- **Transparent Verification**: On-chain proof of health achievements

### Privacy & Data Control
- **Granular Privacy Controls**: Choose who can access your health data
- **Hypergraph Storage**: Private and public health data graphs via The Graph Protocol
- **Family Sharing**: Securely share progress with loved ones
- **Medical Provider Access**: Controlled sharing with healthcare professionals

### Web3 Integration
- **Coinbase SDK**: Seamless cryptocurrency payments and wallet management
- **Flow Blockchain**: Fast, low-cost health data transactions
- **The Graph Protocol**: Decentralized health data indexing and querying
- **x402 Protocol**: Automated micro-payments for health achievements

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Flow CLI
- Git
- A Coinbase Developer account
- The Graph Protocol account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthchain-app.git
   cd healthchain-app
   ```

2. **Run the setup script**
   ```bash
   ./scripts/setup-dev.sh
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start the development environment**
   ```bash
   # Terminal 1: Start Flow emulator
   flow emulator start

   # Terminal 2: Deploy contracts
   ./scripts/deploy-contracts.sh

   # Terminal 3: Deploy subgraph
   ./scripts/deploy-subgraph.sh

   # Terminal 4: Start the app
   npm run dev
   ```

5. **Visit the application**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
healthchain-app/
├── contracts/                 # Flow smart contracts
│   ├── HealthRewards.cdc      # Main rewards contract
│   └── PrivacyController.cdc  # Privacy management
├── src/
│   ├── app/                   # Next.js 13+ app directory
│   ├── components/            # React components
│   ├── contexts/              # React contexts for state management
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions
├── subgraph/                  # The Graph Protocol subgraph
│   ├── schema.graphql         # GraphQL schema
│   ├── subgraph.yaml         # Subgraph configuration
│   └── src/                   # Subgraph mappings
├── scripts/                   # Deployment and setup scripts
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Flow Blockchain
FLOW_NETWORK=testnet
FLOW_ADDRESS=your_flow_address
FLOW_PRIVATE_KEY=your_flow_private_key

# Coinbase
NEXT_PUBLIC_COINBASE_API_KEY=your_coinbase_api_key
COINBASE_PRIVATE_KEY=your_coinbase_private_key

# The Graph Protocol
GRAPH_API_KEY=your_graph_api_key
SUBGRAPH_NAME=your_username/healthchain-subgraph

# x402 Protocol
X402_ENDPOINT=https://api.x402.org
X402_API_KEY=your_x402_api_key
```

## 💡 Usage Examples

### Creating a Health Goal

```typescript
import { useHealthData } from '@/contexts/HealthDataContext'

const { createGoal } = useHealthData()

const goal = await createGoal({
  title: "Better Sleep",
  description: "Sleep by 10 PM and achieve 80+ sleep score",
  targetValue: 80,
  reward: 1.0,
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  sponsor: "parents",
  healthDataType: "sleep",
  conditions: ["bedtime_before_22:00", "sleep_score >= 80"]
})
```

### Setting Up Automated Payments

```typescript
import { useWeb3 } from '@/contexts/Web3Context'

const { setupX402Payment } = useWeb3()

const paymentId = await setupX402Payment(goalId, rewardAmount)
```

### Managing Privacy Settings

```typescript
import { useHealthData } from '@/contexts/HealthDataContext'

const { updatePrivacySetting } = useHealthData()

updatePrivacySetting('sleep', {
  shareLevel: 'family',
  allowPublicGraph: true
})
```

## 🏗️ Architecture

### Flow Smart Contracts

- **HealthRewards.cdc**: Manages goals, rewards, and automated payouts
- **PrivacyController.cdc**: Handles data sharing permissions and access control

### Frontend Architecture

- **Next.js 13+**: React framework with app directory
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions

### Data Layer

- **The Graph Protocol**: Decentralized data indexing
- **Flow Blockchain**: Health data and reward transactions
- **Local State**: React Context and Zustand for UI state

### Integration Layer

- **Coinbase SDK**: Cryptocurrency payments
- **x402 Protocol**: Automated micro-payments
- **Health APIs**: Wearable device integrations

## 🔐 Security & Privacy

### Privacy Features

- **Granular Controls**: Choose exactly who can access each type of health data
- **On-chain Permissions**: Blockchain-enforced access controls
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Audit Logs**: Complete history of data access and sharing

### Security Measures

- **Smart Contract Audits**: Thoroughly tested and audited contracts
- **Private Key Management**: Secure key storage and rotation
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive data validation and sanitization

## 📊 Analytics & Monitoring

### User Analytics

- **Health Trends**: Track progress over time
- **Goal Achievement**: Success rates and patterns
- **Reward Earnings**: Financial incentive tracking
- **Community Insights**: Compare with anonymized community data

### Platform Analytics

- **Usage Metrics**: User engagement and retention
- **Reward Distribution**: Total rewards paid and earned
- **Goal Success Rates**: Platform-wide achievement statistics
- **Privacy Preferences**: Anonymized sharing patterns

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- **TypeScript**: All code must be properly typed
- **ESLint**: Follow the configured linting rules
- **Prettier**: Use consistent code formatting
- **Testing**: Write tests for new features

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run Flow contract tests
flow test

# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### Production Deployment

1. **Prepare environment**
   ```bash
   cp .env.example .env.production
   # Update with production values
   ```

2. **Deploy contracts to mainnet**
   ```bash
   FLOW_NETWORK=mainnet ./scripts/deploy-contracts.sh
   ```

3. **Deploy subgraph**
   ```bash
   ./scripts/deploy-subgraph.sh
   ```

4. **Deploy frontend**
   ```bash
   npm run build
   npm run start
   ```

### Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fhealthchain-app)

## 📖 Documentation

- [API Documentation](docs/api.md)
- [Smart Contract Documentation](docs/contracts.md)
- [Privacy Guide](docs/privacy.md)
- [Integration Guide](docs/integrations.md)
- [Deployment Guide](docs/deployment.md)

## 🔗 Links

- **Flow Blockchain**: [https://developers.flow.com/](https://developers.flow.com/)
- **The Graph Protocol**: [https://thegraph.com/](https://thegraph.com/)
- **Coinbase Developer Platform**: [https://developers.coinbase.com/](https://developers.coinbase.com/)
- **x402 Protocol**: [https://www.x402.org/](https://www.x402.org/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

- **Discord**: [Join our community](https://discord.gg/healthchain)
- **Documentation**: [docs.healthchain.app](https://docs.healthchain.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/healthchain-app/issues)
- **Email**: support@healthchain.app

## 🎯 Roadmap

### Q1 2024
- [ ] Mobile app (React Native)
- [ ] Advanced health analytics
- [ ] AI-powered goal recommendations
- [ ] Social challenges and leaderboards

### Q2 2024
- [ ] Healthcare provider integrations
- [ ] Insurance company partnerships
- [ ] Advanced privacy features
- [ ] Multi-chain support

### Q3 2024
- [ ] Machine learning insights
- [ ] Predictive health modeling
- [ ] Telemedicine integration
- [ ] Global expansion

---

**Built with ❤️ for a healthier world** 🌍