import React, { useState } from 'react';
import { Agent, AgentArchitecture, ConsensusTier } from '../types';
import { AgentMarketplaceCard } from './AgentMarketplaceCard';
import { filterAgents } from '../utils/orchestratorLogic';
import { Search, Plus, Filter, ShieldCheck, Sparkles, Check } from 'lucide-react';

interface MarketplaceViewProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  onDeployToWorkbench: (agent: Agent) => void;
  onOpenDeployModal: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  agents,
  onSelectAgent,
  onDeployToWorkbench,
  onOpenDeployModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchitecture, setSelectedArchitecture] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [selectedAgentDetail, setSelectedAgentDetail] = useState<Agent | null>(agents[0] || null);

  const architectures: { label: string; value: string }[] = [
    { label: 'All Architectures', value: 'all' },
    { label: 'MoE / 32B', value: 'MoE / 32B' },
    { label: 'Dense / 70B', value: 'Dense / 70B' },
    { label: 'SSM Mamba 14B', value: 'SSM Mamba 14B' },
    { label: 'Multimodal / 45B', value: 'Multimodal / 45B' },
    { label: 'Quantized / 8B', value: 'Quantized / 8B' },
  ];

  const tiers: { label: string; value: string }[] = [
    { label: 'All Tiers', value: 'all' },
    { label: 'Ultraviolet Elite', value: 'Ultraviolet Elite' },
    { label: 'Enterprise Consensus', value: 'Enterprise Consensus' },
    { label: 'Standard Tier', value: 'Standard Tier' },
  ];

  const filtered = filterAgents(
    agents,
    searchQuery,
    selectedArchitecture,
    selectedTier,
    verifiedOnly
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Marketplace Banner & Actions */}
      <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-6 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00F0FF]/10 via-[#7B61FF]/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#00F0FF]">
              <Sparkles className="w-4 h-4" />
              <span>ENTERPRISE AGENT MODEL REGISTRY</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Autonomous Agent Marketplace
            </h1>
            <p className="text-xs text-[#b9cacb] mt-1 max-w-2xl leading-relaxed">
              Procure and deploy verified high-computational neural architectures, mixture-of-experts pipelines,
              and low-latency algorithmic execution agents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDeployModal}
              className="btn-primary-exec px-4 py-2 rounded text-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0A0D14]" />
              <span>Publish New Agent Node</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-[#849495] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by agent name, tags, creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded input-obsidian font-mono"
            />
          </div>

          {/* Architecture Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {architectures.map((arch) => (
              <button
                key={arch.value}
                onClick={() => setSelectedArchitecture(arch.value)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all border ${
                  selectedArchitecture === arch.value
                    ? 'bg-[#161D2E] text-[#00F0FF] border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'bg-[#101522] text-[#849495] border-[rgba(255,255,255,0.06)] hover:text-white'
                }`}
              >
                {arch.label}
              </button>
            ))}
          </div>

          {/* Verification Toggle */}
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono border transition-all cursor-pointer ${
              verifiedOnly
                ? 'bg-[#10E896]/15 text-[#10E896] border-[#10E896]/40 shadow-[0_0_12px_rgba(16,232,150,0.2)]'
                : 'bg-[#101522] text-[#849495] border-[rgba(255,255,255,0.06)] hover:text-white'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                verifiedOnly ? 'bg-[#10E896] border-[#10E896]' : 'border-[rgba(255,255,255,0.2)]'
              }`}
            >
              {verifiedOnly && <Check className="w-3 h-3 text-[#0A0D14] stroke-[3]" />}
            </div>
            <span>Verified Creators Only</span>
          </button>
        </div>
      </div>

      {/* Grid of Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((agent) => (
          <AgentMarketplaceCard
            key={agent.id}
            agent={agent}
            isSelected={selectedAgentDetail?.id === agent.id}
            onSelect={(ag) => setSelectedAgentDetail(ag)}
            onDeployToWorkbench={(ag) => onDeployToWorkbench(ag)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-12 text-center bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.06)] text-xs font-mono text-[#849495] space-y-2">
            <p>No autonomous agents match the selected filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedArchitecture('all');
                setSelectedTier('all');
                setVerifiedOnly(false);
              }}
              className="text-[#00F0FF] underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
