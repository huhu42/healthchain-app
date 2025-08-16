#!/bin/bash

# Deploy Flow Contracts Script
# This script deploys all health chain contracts to Flow blockchain

set -e

echo "🚀 Deploying HealthChain contracts to Flow blockchain..."

# Check if Flow CLI is installed
if ! command -v flow &> /dev/null; then
    echo "❌ Flow CLI not found. Please install it first:"
    echo "   https://developers.flow.com/tools/flow-cli/install"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Set default network if not specified
NETWORK=${FLOW_NETWORK:-testnet}

echo "📡 Deploying to network: $NETWORK"

# Start Flow emulator if deploying locally
if [ "$NETWORK" = "emulator" ]; then
    echo "🔧 Starting Flow emulator..."
    flow emulator start --verbose &
    EMULATOR_PID=$!
    sleep 5
fi

# Deploy contracts in order (dependencies first)
echo "📝 Deploying PrivacyController contract..."
flow accounts add-contract contracts/PrivacyController.cdc --network $NETWORK --signer emulator-account

echo "📝 Deploying HealthRewards contract..."
flow accounts add-contract contracts/HealthRewards.cdc --network $NETWORK --signer emulator-account

# Initialize contracts
echo "🔧 Initializing contracts..."

# Create admin resources
flow transactions send transactions/setup-admin.cdc --network $NETWORK --signer emulator-account

# Create initial privacy settings
flow transactions send transactions/setup-privacy.cdc --network $NETWORK --signer emulator-account

echo "✅ Contracts deployed successfully!"

# Get deployed contract addresses
echo "📋 Contract Addresses:"
flow accounts get emulator-account --network $NETWORK | grep "Contracts Deployed"

# Stop emulator if we started it
if [ "$NETWORK" = "emulator" ] && [ ! -z "$EMULATOR_PID" ]; then
    echo "🛑 Stopping Flow emulator..."
    kill $EMULATOR_PID
fi

echo "🎉 Deployment complete!"