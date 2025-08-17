'use client';

import React, { ReactNode } from 'react';
import { HypergraphAppProvider } from '@graphprotocol/hypergraph-react';

interface HypergraphProviderProps {
  children: ReactNode;
}

export function HypergraphProvider({ children }: HypergraphProviderProps) {
  // Provide an empty mapping for now to avoid ID validation errors
  const emptyMapping = {};
  
  return (
    <HypergraphAppProvider
      appId="gamifiedhealth-app"
      mapping={emptyMapping as any}
      chainId={1}
    >
      {children}
    </HypergraphAppProvider>
  );
}

export default HypergraphProvider;
