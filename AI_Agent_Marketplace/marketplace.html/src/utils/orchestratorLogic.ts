import { Agent } from '../types';

/**
 * Calculates estimated compute cost in USD for a given token volume
 */
export function calculateComputeCost(tokens: number, costPer1kTokens: number): number {
  if (tokens <= 0 || costPer1kTokens <= 0) return 0;
  return Number(((tokens / 1000) * costPer1kTokens).toFixed(4));
}

/**
 * Calculates consensus score (0-100) and weighted latency across participating cluster nodes
 */
export function computeConsensusMetrics(
  nodes: { latency: number; accuracy: number; weight: number }[]
): { weightedLatency: number; consensusScore: number } {
  if (!nodes || nodes.length === 0) {
    return { weightedLatency: 0, consensusScore: 0 };
  }

  const totalWeight = nodes.reduce((sum, n) => sum + (n.weight > 0 ? n.weight : 1), 0);
  const weightedLatency = nodes.reduce((sum, n) => sum + n.latency * (n.weight > 0 ? n.weight : 1), 0) / totalWeight;
  const weightedAccuracy = nodes.reduce((sum, n) => sum + n.accuracy * (n.weight > 0 ? n.weight : 1), 0) / totalWeight;

  return {
    weightedLatency: Number(weightedLatency.toFixed(1)),
    consensusScore: Number(Math.min(100, Math.max(0, weightedAccuracy)).toFixed(2)),
  };
}

/**
 * Formats latency display with precision unit
 */
export function formatTelemetryLatency(ms: number): string {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(0)}µs`;
  }
  return `${ms.toFixed(1)}ms`;
}

/**
 * Formats tokens-per-second metric
 */
export function formatTokenRate(tps: number): string {
  if (tps >= 1000) {
    return `${(tps / 1000).toFixed(1)}k tps`;
  }
  return `${tps.toFixed(0)} tps`;
}

/**
 * Filters agents according to query, architecture, tier and verification status
 */
export function filterAgents(
  agents: Agent[],
  query: string,
  architecture: string = 'all',
  tier: string = 'all',
  verifiedOnly: boolean = false
): Agent[] {
  const q = query.trim().toLowerCase();

  return agents.filter((agent) => {
    if (verifiedOnly && !agent.verified) return false;
    if (architecture !== 'all' && agent.architecture !== architecture) return false;
    if (tier !== 'all' && agent.tier !== tier) return false;

    if (!q) return true;
    return (
      agent.name.toLowerCase().includes(q) ||
      agent.codeName.toLowerCase().includes(q) ||
      agent.description.toLowerCase().includes(q) ||
      agent.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
}

/**
 * Estimates slippage and average execution price for order execution against available depth
 */
export function calculateOrderSlippage(
  orderAmount: number,
  availableDepth: number,
  currentPrice: number,
  isBuy: boolean = true
): { estimatedPrice: number; slippagePct: number } {
  if (orderAmount <= 0 || availableDepth <= 0 || currentPrice <= 0) {
    return { estimatedPrice: currentPrice, slippagePct: 0 };
  }

  // Linear impact model: slippage increases with ratio of order size to depth
  const ratio = Math.min(orderAmount / availableDepth, 0.5);
  const slippagePct = Number((ratio * 1.8).toFixed(3)); // up to ~0.9% for high impact
  const priceDelta = currentPrice * (slippagePct / 100);
  const estimatedPrice = Number((isBuy ? currentPrice + priceDelta : currentPrice - priceDelta).toFixed(4));

  return {
    estimatedPrice,
    slippagePct,
  };
}

/**
 * Generates an algorithmic transaction hash
 */
export function generateTxHash(): string {
  const hex = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 16; i++) {
    hash += hex[Math.floor(Math.random() * hex.length)];
  }
  return hash;
}
