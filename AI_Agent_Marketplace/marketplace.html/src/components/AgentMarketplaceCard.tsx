import React from 'react';
import { Agent } from '../types';
import { AgentBadge } from './AgentBadge';
import { ShieldCheck, Cpu, Zap, ArrowUpRight, DollarSign } from 'lucide-react';
import { formatTelemetryLatency, formatTokenRate } from '../utils/orchestratorLogic';

interface AgentMarketplaceCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
  onDeployToWorkbench: (agent: Agent) => void;
  isSelected?: boolean;
}

export const AgentMarketplaceCard: React.FC<AgentMarketplaceCardProps> = ({
  agent,
  onSelect,
  onDeployToWorkbench,
  isSelected = false,
}) => {
  return (
    <div
      onClick={() => onSelect(agent)}
      className={`hairline-gradient-card rounded-xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-[#00F0FF] shadow-[0_0_24px_-4px_rgba(0,240,255,0.3)] bg-[#192135]'
          : 'hover:border-[rgba(0,240,255,0.4)]'
      }`}
    >
      <div>
        {/* Upper Telemetry Strip */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(255,255,255,0.06)] text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#101522] text-[#00F0FF] border border-[rgba(0,240,255,0.2)] font-semibold">
              {agent.architecture}
            </span>
            <span className="text-[#849495] flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#10E896]" />
              <strong className="text-white tabular-nums">{formatTelemetryLatency(agent.latencyMs)}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {agent.verified && (
              <span className="inline-flex items-center gap-1 text-[#10E896] text-[10px]" title="Cryptographically Verified Creator">
                <ShieldCheck className="w-3 h-3" />
                <span className="hidden sm:inline">VERIFIED</span>
              </span>
            )}
            <AgentBadge status={agent.status} showText={false} />
          </div>
        </div>

        {/* Agent Identity */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              {agent.name}
              <span className="text-xs font-mono font-normal text-[#849495]">{agent.codeName}</span>
            </h3>
            <p className="text-xs text-[#b9cacb] mt-1 line-clamp-2 leading-relaxed">
              {agent.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {agent.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101522] text-[#b9cacb] border border-[rgba(255,255,255,0.06)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="pt-3 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between text-xs mb-3 font-mono">
          <div className="text-[#849495]">
            THROUGHPUT: <span className="text-white font-semibold tabular-nums">{formatTokenRate(agent.tps)}</span>
          </div>
          <div className="text-[#849495] flex items-center gap-0.5">
            <DollarSign className="w-3 h-3 text-[#10E896]" />
            <span className="text-[#10E896] font-semibold tabular-nums">${agent.costPer1kTokens.toFixed(3)}</span>
            <span className="text-[10px] text-[#849495]">/1k tok</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeployToWorkbench(agent);
            }}
            className="flex-1 btn-primary-exec py-1.5 px-3 rounded text-xs flex items-center justify-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Load in Workbench</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(agent);
            }}
            className="btn-secondary-glass p-1.5 rounded hover:text-[#00F0FF]"
            title="View Architecture Specs"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
