import React, { useState, useEffect } from 'react';
import {
  Agent,
  PipelineNode,
} from '../types';
import { AgentBadge } from './AgentBadge';
import {
  Play,
  Square,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { formatTelemetryLatency, formatTokenRate, calculateComputeCost } from '../utils/orchestratorLogic';

interface WorkbenchViewProps {
  agents: Agent[];
  selectedAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
  pipelineNodes: PipelineNode[];
  onUpdatePipelineNode: (nodes: PipelineNode[]) => void;
  isExecuting: boolean;
  onExecuteToggle: () => void;
}

export const WorkbenchView: React.FC<WorkbenchViewProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
  pipelineNodes,
  onUpdatePipelineNode,
  isExecuting,
  onExecuteToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(pipelineNodes[2]?.id || 'node-3');
  const [temperature, setTemperature] = useState(selectedAgent.temperature || 0.2);
  const [routingThreshold, setRoutingThreshold] = useState(selectedAgent.routingThreshold || 0.88);
  const [topP, setTopP] = useState(selectedAgent.topP || 0.9);
  const [systemPrompt, setSystemPrompt] = useState(selectedAgent.systemPrompt);

  // Live execution simulation states
  const [streamedTokens, setStreamedTokens] = useState<number>(3420);
  const [executionTimerMs, setExecutionTimerMs] = useState<number>(12.4);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(2);
  const [executionLogs, setExecutionLogs] = useState<string[]>([
    '[INIT] Consensus validator handshake established via BLS-12-381.',
    '[INGEST] 4,200 tick packets decoded from decentralized liquidity feeds.',
    '[ROUTING] MoE gating network activated 2 of 8 experts with 98.4% confidence.',
    '[REASONING] Evaluating Monte Carlo trajectory tree depth=6 with zero-loss boundary.',
  ]);

  // Keep system prompt updated if selected agent changes
  useEffect(() => {
    setSystemPrompt(selectedAgent.systemPrompt);
    setTemperature(selectedAgent.temperature);
    setRoutingThreshold(selectedAgent.routingThreshold);
    setTopP(selectedAgent.topP);
  }, [selectedAgent]);

  // Simulation timer when execution is running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExecuting) {
      interval = setInterval(() => {
        setExecutionTimerMs((prev) => Number((prev + 0.3).toFixed(1)));
        setStreamedTokens((prev) => prev + Math.floor(Math.random() * 85 + 20));

        // Advance steps in pipeline
        setActiveStepIndex((prev) => {
          const next = (prev + 1) % pipelineNodes.length;
          onUpdatePipelineNode(
            pipelineNodes.map((node, idx) => ({
              ...node,
              status: idx === next ? 'executing' : idx < next ? 'completed' : 'idle',
            }))
          );
          return next;
        });

        // Add log entry
        const sampleLogs = [
          `[FLOW] Yield dispersion calculated: delta=${(Math.random() * 0.05).toFixed(4)}`,
          `[KV-CACHE] Memory retention optimal, hit rate: ${(94 + Math.random() * 5).toFixed(1)}%`,
          `[INSPECT] Liquidity route verified against slippage tolerance threshold.`,
          `[SETTLE] Submitting ZK cryptographic state proof to cluster consensus.`,
        ];
        const newLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        setExecutionLogs((logs) => [...logs.slice(-6), newLog]);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isExecuting, pipelineNodes, onUpdatePipelineNode]);

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.architecture.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNode = pipelineNodes.find((n) => n.id === selectedNodeId) || pipelineNodes[0];

  const handleResetPipeline = () => {
    onUpdatePipelineNode(
      pipelineNodes.map((n, idx) => ({
        ...n,
        status: idx === 0 ? 'completed' : 'idle',
      }))
    );
    setExecutionTimerMs(0);
    setStreamedTokens(0);
    setExecutionLogs(['[SYSTEM] Pipeline reset to baseline state.']);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Agent Directory (3 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-4 flex flex-col h-[780px]">
            {/* Header & Search */}
            <div className="pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#849495] font-semibold">
                  AGENT DIRECTORY
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#161D2E] text-[#00F0FF] border border-[rgba(0,240,255,0.2)]">
                  {agents.length} NODES
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#849495] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter agents, architecture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded input-obsidian font-mono"
                />
              </div>
            </div>

            {/* Agent List */}
            <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
              {filteredAgents.map((agent) => {
                const isSelected = agent.id === selectedAgent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => onSelectAgent(agent)}
                    className={`w-full text-left p-3 rounded transition-all duration-150 border ${
                      isSelected
                        ? 'bg-[#161D2E] border-[#00F0FF] shadow-[0_0_14px_rgba(0,240,255,0.25)]'
                        : 'bg-[#101522] border-[rgba(255,255,255,0.04)] hover:bg-[#161D2E]/80 hover:border-[rgba(255,255,255,0.1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-white truncate">
                        {agent.name}
                      </span>
                      <AgentBadge status={agent.status} showText={false} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#849495] mb-2">
                      <span className="text-[#00F0FF]">{agent.architecture}</span>
                      <span className="text-white tabular-nums">{formatTelemetryLatency(agent.latencyMs)}</span>
                    </div>

                    <p className="text-[11px] text-[#b9cacb] line-clamp-1 mb-2">
                      {agent.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-[rgba(255,255,255,0.04)] text-[#849495]">
                      <span>TPS: <strong className="text-white">{formatTokenRate(agent.tps)}</strong></span>
                      <span className="text-[#10E896]">${agent.costPer1kTokens}/1k</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Summary Footnote */}
            <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] text-[11px] font-mono text-[#849495] flex items-center justify-between">
              <span>ACTIVE CLUSTER:</span>
              <span className="text-[#10E896]">ASHBURN-VA-01</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: Canvas & Execution Playground (6 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Agent Banner */}
          <div className="bg-[#161D2E] rounded-lg border border-[rgba(255,255,255,0.08)] p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                  {selectedAgent.name}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#101522] text-[#00F0FF] border border-[rgba(0,240,255,0.2)]">
                  {selectedAgent.codeName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(123,97,255,0.15)] text-[#baaeff] border border-[rgba(123,97,255,0.3)]">
                  {selectedAgent.tier}
                </span>
              </div>
              <p className="text-xs text-[#b9cacb] mt-1">
                {selectedAgent.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <AgentBadge status={selectedAgent.status} />
            </div>
          </div>

          {/* Pipeline Node Graph */}
          <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#849495] font-semibold">
                  AUTONOMOUS EXECUTION PIPELINE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
              </div>
              <div className="text-[11px] font-mono text-[#849495]">
                {pipelineNodes.filter((n) => n.status === 'completed').length}/{pipelineNodes.length} STAGES CONVERGED
              </div>
            </div>

            {/* Visual Node Graph Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
              {pipelineNodes.map((node, index) => {
                const isSelected = node.id === selectedNodeId;
                const isExecutingNode = node.status === 'executing';
                const isCompleted = node.status === 'completed';

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`relative p-2.5 rounded text-left transition-all duration-150 border flex flex-col justify-between h-28 ${
                      isSelected
                        ? 'bg-[#161D2E] border-[#00F0FF] shadow-[0_0_16px_rgba(0,240,255,0.25)]'
                        : isExecutingNode
                        ? 'bg-[#161D2E] border-[#00F0FF]/60 animate-pulse'
                        : isCompleted
                        ? 'bg-[#101522] border-[rgba(16,232,150,0.3)]'
                        : 'bg-[#0A0D14] border-[rgba(255,255,255,0.06)] opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-[#849495]">STAGE 0{index + 1}</span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10E896]" />
                        ) : isExecutingNode ? (
                          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-[#849495]" />
                        )}
                      </div>
                      <div className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-white line-clamp-1">
                        {node.name}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[rgba(255,255,255,0.04)] text-[10px] font-mono flex items-center justify-between text-[#849495]">
                      <span>{node.type.toUpperCase()}</span>
                      <span className="text-white tabular-nums">{node.latencyMs > 0 ? `${node.latencyMs}ms` : '0ms'}</span>
                    </div>

                    {/* Arrow indicator between nodes on desktop */}
                    {index < pipelineNodes.length - 1 && (
                      <ArrowRight className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(255,255,255,0.2)] z-10" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Node Details Box */}
            <div className="mt-3 p-3 rounded bg-[#161D2E] border border-[rgba(255,255,255,0.06)] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-[#00F0FF] font-semibold">{selectedNode.name}: </span>
                <span className="text-[#b9cacb]">{selectedNode.details}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-[#849495] whitespace-nowrap">
                <span>TOKENS: <strong className="text-white">{selectedNode.tokensProcessed}</strong></span>
                <span>LATENCY: <strong className="text-[#10E896]">{selectedNode.latencyMs}ms</strong></span>
              </div>
            </div>
          </div>

          {/* Interactive Prompt & Parameter Configuration */}
          <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#849495] font-semibold flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#00F0FF]" />
                AUTONOMOUS PARAMETER & PROMPT ORCHESTRATION
              </span>
              <span className="text-[11px] font-mono text-[#849495]">
                WEIGHTS: <strong className="text-white">{selectedAgent.parameters}</strong>
              </span>
            </div>

            {/* System Prompt TextArea */}
            <div>
              <label className="block text-[11px] font-mono text-[#b9cacb] mb-1.5">
                EXECUTION DIRECTIVE / SYSTEM PROMPT:
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded input-obsidian text-xs font-mono leading-relaxed"
                placeholder="Enter system prompt for agent consensus..."
              />
            </div>

            {/* Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[rgba(255,255,255,0.04)] text-xs font-mono">
              {/* Temperature */}
              <div>
                <div className="flex justify-between mb-1 text-[11px]">
                  <span className="text-[#b9cacb]">TEMPERATURE</span>
                  <span className="text-[#00F0FF] font-bold">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[#00F0FF] cursor-pointer"
                />
              </div>

              {/* MoE Routing Threshold */}
              <div>
                <div className="flex justify-between mb-1 text-[11px]">
                  <span className="text-[#b9cacb]">ROUTING THRESHOLD</span>
                  <span className="text-[#7B61FF] font-bold">{routingThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.01"
                  value={routingThreshold}
                  onChange={(e) => setRoutingThreshold(parseFloat(e.target.value))}
                  className="w-full accent-[#7B61FF] cursor-pointer"
                />
              </div>

              {/* Top-P Nucleus */}
              <div>
                <div className="flex justify-between mb-1 text-[11px]">
                  <span className="text-[#b9cacb]">TOP-P NUCLEUS</span>
                  <span className="text-[#10E896] font-bold">{topP.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-[#10E896] cursor-pointer"
                />
              </div>
            </div>

            {/* Execution Buttons: Primary, Halt, Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <button
                  onClick={onExecuteToggle}
                  className="btn-primary-exec px-5 py-2 rounded text-xs flex items-center gap-2 cursor-pointer"
                >
                  {isExecuting ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#0A0D14] animate-ping" />
                      <span>STREAMING CONSENSUS...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>EXECUTE PIPELINE</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onExecuteToggle}
                  disabled={!isExecuting}
                  className="btn-destructive-halt px-4 py-2 rounded text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>HALT EXECUTION</span>
                </button>
              </div>

              <button
                onClick={handleResetPipeline}
                className="btn-secondary-glass px-3 py-2 rounded text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#b9cacb]" />
                <span>Reset Pipeline</span>
              </button>
            </div>
          </div>

          {/* Real-time Streaming Output / Telemetry Console */}
          <div className="bg-[#0A0D14] rounded-lg border border-[rgba(255,255,255,0.08)] p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2 text-[#849495]">
                <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="text-[11px] font-semibold text-white">LIVE REASONING TRACE & TELEMETRY STREAM</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-[#849495]">
                  TOKENS: <strong className="text-[#00F0FF] tabular-nums">{streamedTokens.toLocaleString()}</strong>
                </span>
                <span className="text-[#849495]">
                  WALL TIME: <strong className="text-[#10E896] tabular-nums">{executionTimerMs}ms</strong>
                </span>
              </div>
            </div>

            {/* Log Stream Output */}
            <div className="space-y-1 py-1 max-h-36 overflow-y-auto">
              {executionLogs.map((log, idx) => (
                <div key={idx} className="text-[#b9cacb] flex items-start gap-2">
                  <span className="text-[#7B61FF] select-none">&gt;</span>
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
              {isExecuting && (
                <div className="flex items-center gap-2 text-[#00F0FF] animate-pulse">
                  <span>&gt;</span>
                  <span>Generating token sequence at {formatTokenRate(selectedAgent.tps)}...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Telemetry Inspector (3 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-4 space-y-4 h-[780px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.06)]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#849495] font-semibold">
                  TELEMETRY INSPECTOR
                </span>
                <span className="w-2 h-2 rounded-full bg-[#10E896] animate-pulse-led" />
              </div>

              {/* Real-time Metric Cards */}
              <div className="space-y-3 pt-3">
                {/* Latency Metric */}
                <div className="p-3 rounded bg-[#161D2E] border border-[rgba(255,255,255,0.06)] font-mono">
                  <div className="flex justify-between items-center text-xs text-[#849495] mb-1">
                    <span>INFERENCE LATENCY</span>
                    <span className="text-[10px] text-[#10E896]">P99 TARGET: &lt;15ms</span>
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums font-['JetBrains_Mono']">
                    {formatTelemetryLatency(isExecuting ? executionTimerMs : selectedAgent.latencyMs)}
                  </div>
                  {/* Visual mini bar */}
                  <div className="w-full bg-[#0A0D14] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#10E896] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (selectedAgent.latencyMs / 50) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* KV Cache Utilization */}
                <div className="p-3 rounded bg-[#161D2E] border border-[rgba(255,255,255,0.06)] font-mono">
                  <div className="flex justify-between items-center text-xs text-[#849495] mb-1">
                    <span>KV-CACHE UTILIZATION</span>
                    <span className="text-[10px] text-[#00F0FF]">{selectedAgent.kvCachePct}%</span>
                  </div>
                  <div className="text-xl font-bold text-white tabular-nums">
                    {(selectedAgent.memoryUsageMb / 1024).toFixed(1)} GB
                    <span className="text-xs text-[#849495] font-normal ml-1">/ 80 GB SXM5</span>
                  </div>
                  <div className="w-full bg-[#0A0D14] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#00F0FF] h-full rounded-full transition-all duration-300"
                      style={{ width: `${selectedAgent.kvCachePct}%` }}
                    />
                  </div>
                </div>

                {/* Consensus Score */}
                <div className="p-3 rounded bg-[#161D2E] border border-[rgba(255,255,255,0.06)] font-mono">
                  <div className="flex justify-between items-center text-xs text-[#849495] mb-1">
                    <span>CONSENSUS AGREEMENT</span>
                    <span className="text-[10px] text-[#7B61FF]">4 VALIDATORS</span>
                  </div>
                  <div className="text-xl font-bold text-[#10E896] tabular-nums">
                    99.85%
                  </div>
                  <p className="text-[10px] text-[#849495] mt-1">
                    Aggregated cryptographic signature confirmed across cluster nodes.
                  </p>
                </div>

                {/* Compute Cost Estimator */}
                <div className="p-3 rounded bg-[#161D2E] border border-[rgba(255,255,255,0.06)] font-mono">
                  <div className="flex justify-between items-center text-xs text-[#849495] mb-1">
                    <span>RUN COMPUTE COST</span>
                    <span className="text-[10px] text-[#849495]">RATE: ${selectedAgent.costPer1kTokens}/1k</span>
                  </div>
                  <div className="text-lg font-bold text-white tabular-nums">
                    ${calculateComputeCost(streamedTokens, selectedAgent.costPer1kTokens).toFixed(4)}
                    <span className="text-xs text-[#849495] font-normal ml-1">USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Hardware & Security Verification */}
            <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between text-[#849495]">
                <span>HARDWARE:</span>
                <span className="text-white">NVIDIA H100 80GB</span>
              </div>
              <div className="flex items-center justify-between text-[#849495]">
                <span>ZK-PROOF MERKLE:</span>
                <span className="text-[#00F0FF]">0x8e1a...4bc2</span>
              </div>
              <div className="flex items-center justify-between text-[#849495]">
                <span>THERMAL MARGIN:</span>
                <span className="text-[#10E896]">+42°C HEADROOM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
