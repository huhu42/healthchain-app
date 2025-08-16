// ============================================================================
// HYPERGRAPH SCHEMA TYPES INDEX
// ============================================================================

// Export all schema types
export * from './schema'

// Export utility types
export type {
  EntityType,
  PrivateEntityType,
  PublicEntityType,
  HypergraphQueryOptions,
  HypergraphMutationResult,
} from './schema'

// Export utility functions
export { usePrivateHypergraph, PrivateHypergraphManager } from '../utils/privateHypergraph'

// Export example component
export { PrivateDataExample } from '../components/PrivateDataExample'
