#!/bin/bash

# Development Setup Script
# This script sets up the complete development environment

set -e

echo "🛠️  Setting up GamifiedHealth development environment..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "❌ Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    echo "📋 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your API keys and configuration"
fi

# Install Flow CLI if not present
if ! command -v flow &> /dev/null; then
    echo "🔧 Installing Flow CLI..."
    sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"
fi

# Install Graph CLI if not present
if ! command -v graph &> /dev/null; then
    echo "📊 Installing Graph CLI..."
    npm install -g @graphprotocol/graph-cli
fi

# Make scripts executable
chmod +x scripts/*.sh

# Initialize git hooks (if using git)
if [ -d .git ]; then
    echo "🪝 Setting up git hooks..."
    echo "#!/bin/bash\nnpm run lint && npm run typecheck" > .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
fi

# Generate types for subgraph
echo "🔧 Generating subgraph types..."
cd subgraph && npm install && graph codegen && cd ..

echo "✅ Development environment setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Update .env file with your API keys"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Run 'flow emulator start' to start the Flow emulator"
echo "   4. Run './scripts/deploy-contracts.sh' to deploy contracts"
echo "   5. Visit http://localhost:3000 to see your app"
echo ""
echo "📖 For more information, see README.md"