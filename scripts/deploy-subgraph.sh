#!/bin/bash

# Deploy Subgraph Script
# This script builds and deploys the subgraph to The Graph Protocol

set -e

echo "📊 Deploying GamifiedHealth subgraph to The Graph Protocol..."

# Check if Graph CLI is installed
if ! command -v graph &> /dev/null; then
    echo "❌ Graph CLI not found. Installing..."
    npm install -g @graphprotocol/graph-cli
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Check required environment variables
if [ -z "$GRAPH_DEPLOY_KEY" ]; then
    echo "❌ GRAPH_DEPLOY_KEY not set. Please add it to your .env file"
    exit 1
fi

if [ -z "$SUBGRAPH_NAME" ]; then
    echo "❌ SUBGRAPH_NAME not set. Please add it to your .env file"
    exit 1
fi

# Navigate to subgraph directory
cd subgraph

echo "🔧 Authenticating with The Graph..."
graph auth --product hosted-service $GRAPH_DEPLOY_KEY

echo "📝 Generating subgraph code..."
graph codegen

echo "🏗️  Building subgraph..."
graph build

echo "🚀 Deploying subgraph..."
graph deploy --product hosted-service $SUBGRAPH_NAME

echo "✅ Subgraph deployed successfully!"
echo "📋 Subgraph URL: https://thegraph.com/hosted-service/subgraph/$SUBGRAPH_NAME"

# Return to root directory
cd ..

echo "🎉 Subgraph deployment complete!"