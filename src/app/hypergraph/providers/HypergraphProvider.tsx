'use client';

import React, { ReactNode } from 'react';
import { HypergraphProvider as BaseHypergraphProvider } from '@graphprotocol/hypergraph-react';
import hypergraphClient from '../config/client';

interface HypergraphProviderProps {
  children: ReactNode;
}

export function HypergraphProvider({ children }: HypergraphProviderProps) {
  return (
    <BaseHypergraphProvider client={hypergraphClient}>
      {children}
    </BaseHypergraphProvider>
  );
}

export default HypergraphProvider;
