#!/bin/bash

echo "🚀 Deploying HealthRewards contract to Flow Testnet..."

# Check if Flow CLI is installed
if ! command -v flow &> /dev/null; then
    echo "❌ Flow CLI not found. Please install it first:"
    echo "   https://docs.onflow.org/flow-cli/install/"
    exit 1
fi

# Check if environment variables are set
if [ -z "$FLOW_ADDRESS" ] || [ -z "$FLOW_PRIVATE_KEY" ]; then
    echo "❌ Environment variables not set. Please set:"
    echo "   export FLOW_ADDRESS=your_testnet_address"
    echo "   export FLOW_PRIVATE_KEY=your_testnet_private_key"
    echo ""
    echo "💡 To get testnet FLOW tokens:"
    echo "   https://docs.onflow.org/flow-cli/flow-cli-accounts/#create-account"
    exit 1
fi

echo "✅ Environment variables found"
echo "📍 Testnet Address: $FLOW_ADDRESS"
echo "🔑 Private Key: ${FLOW_PRIVATE_KEY:0:8}..."

# Create testnet account if it doesn't exist
echo "🔧 Setting up testnet account..."
flow accounts create --network testnet --key "$FLOW_PRIVATE_KEY" --signer "$FLOW_PRIVATE_KEY"

# Deploy contract to testnet
echo "📦 Deploying HealthRewards contract..."
flow deploy --network testnet --update

# Get contract address
echo "🔍 Getting contract address..."
CONTRACT_ADDRESS=$(flow contracts get --network testnet HealthRewards | grep "Address:" | awk '{print $2}')

if [ ! -z "$CONTRACT_ADDRESS" ]; then
    echo "✅ Contract deployed successfully!"
    echo "📋 Contract Address: $CONTRACT_ADDRESS"
    echo "🌐 View on Flowscan: https://testnet.flowscan.org/contract/$CONTRACT_ADDRESS"
    echo ""
    echo "💾 Save this address for your app configuration:"
    echo "   export HEALTH_REWARDS_CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
else
    echo "❌ Failed to get contract address"
    exit 1
fi

echo ""
echo "🎉 Deployment complete! Your contract is now live on Flow testnet."
echo "🔗 Next steps:"
echo "   1. Test the webhook system"
echo "   2. Create goals and verify them"
echo "   3. Check automatic payouts"
