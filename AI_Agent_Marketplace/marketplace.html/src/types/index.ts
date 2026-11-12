export type AgentStatus = 'active' | 'deploying' | 'suspended';

export type AgentArchitecture =
  | 'MoE / 32B'
  | 'Dense / 70B'
  | 'SSM Mamba 14B'
  | 'Multimodal / 45B'
  | 'Quantized / 8B';

export type ConsensusTier = 'Ultraviolet Elite' | 'Enterprise Consensus' | 'Standard Tier';

export interface Agent {
  id: string;
  name: string;
  codeName: string;
  description: string;
  architecture: AgentArchitecture;
  parameters: string;
  latencyMs: number;
  tps: number;
  verified: boolean;
  tier: ConsensusTier;
  status: AgentStatus;
  creator: string;
  costPer1kTokens: number;
  tags: string[];
  memoryUsageMb: number;
  kvCachePct: number;
  systemPrompt: string;
  routingThreshold: number;
  temperature: number;
  topP: number;
}

export interface PipelineNode {
  id: string;
  name: string;
  role: string;
  type: 'ingestion' | 'routing' | 'reasoning' | 'guardrail' | 'settlement';
  status: 'idle' | 'executing' | 'completed' | 'failed';
  latencyMs: number;
  tokensProcessed: number;
  details: string;
}

export interface TradingPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  spread: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  depthPct: number;
  type: 'bid' | 'ask';
}

export interface TradeOrder {
  id: string;
  timestamp: string;
  pairSymbol: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  latencyMs: number;
  txHash: string;
  status: 'filled' | 'pending' | 'routed';
}

export interface StrategyBot {
  id: string;
  name: string;
  strategy: string;
  apy: number;
  trades24h: number;
  winRate: number;
  active: boolean;
  latencyMs: number;
  description: string;
  allocatedCapitalUsd: number;
}

export interface AuditLogRow {
  id: string;
  timestamp: string;
  agentHash: string;
  agentName: string;
  operation: string;
  status: 'optimal' | 'computing' | 'rejected';
  latencyMs: number;
  tokenCount: number;
  consensusScore: number;
  payloadSnippet: string;
  fullPayload: Record<string, unknown>;
}

export interface ComputeClusterNode {
  id: string;
  name: string;
  region: string;
  location: string;
  pingMs: number;
  loadPct: number;
  totalNodes: number;
  gpuType: string;
  status: 'optimal' | 'congested' | 'syncing';
  consensusHealth: number;
}
