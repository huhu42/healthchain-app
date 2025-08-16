# Environment Variables Setup Guide

## Values Used for Local Development

### Flow Blockchain Configuration

**Source**: `flow.json` file in the project root

- **FLOW_NETWORK**: `emulator` - Using local Flow emulator for development
- **FLOW_ADDRESS**: `0x0000000000000001` - Default service account address in Flow emulator
- **FLOW_PRIVATE_KEY**: `5112883de06b9576af62b9aafa7ead685fb7fb46c495039b1a83649d61bff97c`
  - This is the default private key for the emulator service account
  - Found in `flow.json` under `accounts.emulator-account.key`
- **FLOW_ACCESS_NODE**: `http://localhost:8888` - Local emulator REST API endpoint

### Running Services

When you start the development environment:

1. **Flow Emulator** (started with `flow emulator --simple-addresses`):
   - gRPC: port 3569
   - REST API: port 8888
   - Admin: port 8080
   - Debugger: port 2345

2. **Next.js App** (started with `npm run dev`):
   - Running on: http://localhost:3002
   - Note: Ports 3000 and 3001 were already in use, so it used 3002

### Deployed Contracts

Both contracts are deployed to address `0x0000000000000001`:
- **PrivacyController**: Managing health data privacy settings
- **HealthRewards**: Managing health goals and rewards

### External Services (Need to be configured for production)

#### Coinbase Developer Platform
- Sign up at: https://developers.coinbase.com/
- Create an API key to get:
  - `NEXT_PUBLIC_COINBASE_API_KEY`
  - `COINBASE_PRIVATE_KEY`
  - `COINBASE_WEBHOOK_SECRET`

#### The Graph Protocol
- Sign up at: https://thegraph.com/
- Required for decentralized data indexing:
  - `GRAPH_API_KEY` - For querying subgraphs
  - `GRAPH_DEPLOY_KEY` - For deploying subgraphs
  - `SUBGRAPH_NAME` - Format: username/subgraph-name

#### x402 Protocol
- Get access at: https://www.x402.org/
- For automated payment functionality:
  - `X402_API_KEY`

#### Health Data Integrations
These would need to be obtained from respective platforms:
- **Fitbit**: https://dev.fitbit.com/
- **Apple Health**: Apple Developer account required
- **Google Fit**: Google Cloud Console

#### IPFS/Pinata (for decentralized storage)
- Sign up at: https://pinata.cloud/
- Get `PINATA_API_KEY` and `PINATA_SECRET_KEY`

### Notes

- The current setup uses all local/emulator values for Flow blockchain
- External service API keys are placeholders and need to be obtained for full functionality
- The subgraph deployment was skipped during setup as it requires Graph Protocol credentials
- For production deployment, you'll need to:
  1. Get a Flow testnet/mainnet account
  2. Obtain all external service API keys
  3. Update the contract import addresses for the target network