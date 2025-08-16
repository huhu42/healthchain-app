import { createWalletClient } from '@graphprotocol/hypergraph-react';

// Hypergraph client configuration
export const hypergraphClient = createWalletClient({
  // Your Hypergraph endpoint (you'll get this from Hypergraph)
  endpoint: process.env.NEXT_PUBLIC_HYPERGRAPH_ENDPOINT || 'https://hypergraph.graphprotocol.com',
  
  // Optional: API key if required
  apiKey: process.env.HYPERGRAPH_API_KEY,
  
  // Configuration options
  options: {
    // Enable real-time subscriptions
    enableSubscriptions: true,
    
    // Connection timeout
    timeout: 30000,
    
    // Retry configuration
    retry: {
      attempts: 3,
      delay: 1000,
    },
    
    // Cache configuration
    cache: {
      enabled: true,
      ttl: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Export the client for use in components
export default hypergraphClient;
