import React from 'react';
import { ComputeClusterNode } from '../types';
import { COMPUTE_CLUSTERS } from '../data/mockData';
import { Globe2, Server, Cpu, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { formatTelemetryLatency } from '../utils/orchestratorLogic';

export const ClusterTopologyView: React.FC = () => {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#10E896]">
              <span className="w-2 h-2 rounded-full bg-[#10E896] animate-pulse-led" />
              <span>GLOBAL DISTRIBUTED COMPUTE FABRIC</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Cluster Topology & GPU Shard Health
            </h1>
            <p className="text-xs text-[#b9cacb] mt-1 max-w-2xl font-mono leading-relaxed">
              Real-time monitoring of decentralized neural compute clusters, NVLink interconnects, and inter-node consensus latency.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-3 rounded bg-[#161D2E] border border-[rgba(255,255,255,0.06)] text-center">
              <span className="text-[#849495] block text-[10px]">TOTAL GPUS</span>
              <span className="text-white font-bold text-base">2,368 H100s</span>
            </div>
            <div className="p-3 rounded bg-[#161D2E] border border-[rgba(255,255,255,0.06)] text-center">
              <span className="text-[#849495] block text-[10px]">PEAK COMPUTE</span>
              <span className="text-[#00F0FF] font-bold text-base">9.4 ExaFLOPs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cluster Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMPUTE_CLUSTERS.map((cluster) => (
          <div
            key={cluster.id}
            className="hairline-gradient-card rounded-xl p-5 space-y-4 hover:border-[rgba(0,240,255,0.4)] transition-all"
          >
            {/* Upper Strip */}
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.06)] text-xs font-mono">
              <span className="text-[#00F0FF] font-semibold">{cluster.region.toUpperCase()}</span>
              <span className="flex items-center gap-1.5 text-[#10E896]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10E896]" />
                {cluster.consensusHealth}% CONSENSUS
              </span>
            </div>

            {/* Cluster Title */}
            <div>
              <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                {cluster.name}
              </h3>
              <p className="text-xs text-[#849495] font-mono mt-0.5">
                {cluster.location}
              </p>
            </div>

            {/* Hardware & Spec */}
            <div className="p-2.5 rounded bg-[#101522] border border-[rgba(255,255,255,0.04)] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#849495]">HARDWARE ACCELERATOR:</span>
                <span className="text-white font-semibold truncate ml-2">{cluster.gpuType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#849495]">PROVISIONED NODES:</span>
                <span className="text-[#00F0FF] font-bold">{cluster.totalNodes} SXM Shards</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#849495]">INTERCONNECT PING:</span>
                <span className="text-[#10E896] font-bold">{cluster.pingMs}ms</span>
              </div>
            </div>

            {/* Load Bar */}
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-[#849495] text-[11px]">
                <span>CLUSTER COMPUTE LOAD</span>
                <span className="text-white font-bold">{cluster.loadPct}%</span>
              </div>
              <div className="w-full bg-[#0A0D14] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    cluster.loadPct > 80 ? 'bg-[#FF453A]' : cluster.loadPct > 65 ? 'bg-[#7B61FF]' : 'bg-[#00F0FF]'
                  }`}
                  style={{ width: `${cluster.loadPct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inter-Node Latency Matrix Table */}
      <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-5 space-y-4 font-mono text-xs">
        <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-white">
          Inter-Cluster Fiber & Satellite Latency Matrix (ms)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)] text-[#6C7893] text-[11px]">
                <th className="text-left py-2 px-3">REGION</th>
                <th className="py-2 px-3">US-EAST</th>
                <th className="py-2 px-3">EU-ZURICH</th>
                <th className="py-2 px-3">AP-TOKYO</th>
                <th className="py-2 px-3">EU-ICELAND</th>
                <th className="py-2 px-3">AP-SINGAPORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[11px]">
              <tr>
                <td className="text-left py-2.5 px-3 font-semibold text-white">US-EAST</td>
                <td className="text-[#00F0FF] py-2.5 px-3 font-bold">0.8ms</td>
                <td className="text-[#b9cacb] py-2.5 px-3">74.2ms</td>
                <td className="text-[#b9cacb] py-2.5 px-3">132.5ms</td>
                <td className="text-[#b9cacb] py-2.5 px-3">56.1ms</td>
                <td className="text-[#b9cacb] py-2.5 px-3">188.0ms</td>
              </tr>
              <tr>
                <td className="text-left py-2.5 px-3 font-semibold text-white">EU-ZURICH</td>
                <td className="text-[#b9cacb] py-2.5 px-3">74.2ms</td>
                <td className="text-[#00F0FF] py-2.5 px-3 font-bold">0.6ms</td>
                <td className="text-[#b9cacb] py-2.5 px-3">148.0ms</td>
                <td className="text-[#b9cacb] py-2.5 px-3">42.4ms</td>
                <td className="text-[#b9cacb] py-2.5 px-3">162.8ms</td>
              </tr>
              <tr>
                <td className="text-left py-2.5 px-3 font-semibold text-white">AP-TOKYO</td>
                <td className="text-[#b9cacb] py-2.5 px-3">132.5ms</td>
                <td className="text-[#b9cacb] py-2.5 px-3">148.0ms</td>
                <td className="text-[#00F0FF] py-2.5 px-3 font-bold">0.7ms</td>
                <td className="text-[#b9cacb] py-2.5 px-3">184.2ms</td>
                <td className="text-[#10E896] py-2.5 px-3 font-bold">54.0ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
