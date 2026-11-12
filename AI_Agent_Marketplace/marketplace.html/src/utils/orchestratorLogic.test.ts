import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateComputeCost,
  computeConsensusMetrics,
  formatTelemetryLatency,
  formatTokenRate,
  filterAgents,
  calculateOrderSlippage,
} from './orchestratorLogic';
import { Agent } from '../types';

test('calculateComputeCost computes accurate dollar cost', () => {
  assert.equal(calculateComputeCost(1000, 0.02), 0.02);
  assert.equal(calculateComputeCost(50000, 0.015), 0.75);
  assert.equal(calculateComputeCost(0, 0.05), 0);
  assert.equal(calculateComputeCost(-100, 0.05), 0);
});

test('computeConsensusMetrics handles weights and edge cases', () => {
  const nodes = [
    { latency: 10, accuracy: 99.5, weight: 2 },
    { latency: 20, accuracy: 98.0, weight: 1 },
  ];
  const metrics = computeConsensusMetrics(nodes);
  // (10*2 + 20*1) / 3 = 13.3ms
  assert.equal(metrics.weightedLatency, 13.3);
  // (99.5*2 + 98.0*1) / 3 = 99.0
  assert.equal(metrics.consensusScore, 99.0);

  const empty = computeConsensusMetrics([]);
  assert.equal(empty.weightedLatency, 0);
  assert.equal(empty.consensusScore, 0);
});

test('formatTelemetryLatency formats ms and sub-ms', () => {
  assert.equal(formatTelemetryLatency(12.4), '12.4ms');
  assert.equal(formatTelemetryLatency(0.45), '450µs');
});

test('formatTokenRate formats thousands and raw tps', () => {
  assert.equal(formatTokenRate(4820), '4.8k tps');
  assert.equal(formatTokenRate(750), '750 tps');
});

test('calculateOrderSlippage calculates expected execution price with depth ratio', () => {
  const buyResult = calculateOrderSlippage(100, 1000, 42.50, true);
  assert.ok(buyResult.slippagePct > 0);
  assert.ok(buyResult.estimatedPrice > 42.50);

  const sellResult = calculateOrderSlippage(100, 1000, 42.50, false);
  assert.ok(sellResult.estimatedPrice < 42.50);

  const zeroResult = calculateOrderSlippage(0, 1000, 42.50);
  assert.equal(zeroResult.slippagePct, 0);
  assert.equal(zeroResult.estimatedPrice, 42.50);
});

test('filterAgents correctly filters by query, architecture and verified status', () => {
  const sampleAgents: Agent[] = [
    {
      id: 'ag-1',
      name: 'Chronos Yield Arb',
      codeName: 'CYA-9',
      description: 'High-frequency statistical arb model',
      architecture: 'MoE / 32B',
      parameters: '32B Active',
      latencyMs: 12.4,
      tps: 4800,
      verified: true,
      tier: 'Ultraviolet Elite',
      status: 'active',
      creator: 'Aegis Systems',
      costPer1kTokens: 0.012,
      tags: ['Arb', 'MoE', 'HFT'],
      memoryUsageMb: 14200,
      kvCachePct: 42,
      systemPrompt: 'Execute arbitrage',
      routingThreshold: 0.85,
      temperature: 0.2,
      topP: 0.9,
    },
    {
      id: 'ag-2',
      name: 'Vortex Deep Reasoning',
      codeName: 'VDR-70',
      description: 'Multi-step causal inference pipeline',
      architecture: 'Dense / 70B',
      parameters: '70B Dense',
      latencyMs: 45.2,
      tps: 1850,
      verified: false,
      tier: 'Enterprise Consensus',
      status: 'active',
      creator: 'Neural Core',
      costPer1kTokens: 0.035,
      tags: ['Reasoning', 'Dense'],
      memoryUsageMb: 36000,
      kvCachePct: 78,
      systemPrompt: 'Perform causal inference',
      routingThreshold: 0.92,
      temperature: 0.4,
      topP: 0.95,
    },
  ];

  const searchResults = filterAgents(sampleAgents, 'chronos');
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, 'ag-1');

  const moeResults = filterAgents(sampleAgents, '', 'MoE / 32B');
  assert.equal(moeResults.length, 1);

  const verifiedOnly = filterAgents(sampleAgents, '', 'all', 'all', true);
  assert.equal(verifiedOnly.length, 1);
  assert.equal(verifiedOnly[0].verified, true);
});
