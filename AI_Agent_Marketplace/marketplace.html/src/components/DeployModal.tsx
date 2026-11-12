import React, { useState } from 'react';
import { Agent, AgentArchitecture, ConsensusTier } from '../types';
import { X, Cpu, Plus, Sparkles, Sliders } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (newAgent: Agent) => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  onDeploy,
}) => {
  const [name, setName] = useState('');
  const [codeName, setCodeName] = useState('');
  const [description, setDescription] = useState('');
  const [architecture, setArchitecture] = useState<AgentArchitecture>('MoE / 32B');
  const [tier, setTier] = useState<ConsensusTier>('Enterprise Consensus');
  const [temperature, setTemperature] = useState(0.2);
  const [routingThreshold, setRoutingThreshold] = useState(0.85);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please provide an agent node name.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide an operational description.');
      return;
    }

    const newAgent: Agent = {
      id: `ag-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      codeName: (codeName.trim() || name.toUpperCase().slice(0, 8)).replace(/\s+/g, '-'),
      description: description.trim(),
      architecture,
      parameters: architecture === 'MoE / 32B' ? '32B (8x4B)' : '70B Dense',
      latencyMs: architecture.includes('SSM') ? 7.8 : architecture.includes('MoE') ? 12.4 : 34.2,
      tps: architecture.includes('SSM') ? 7200 : architecture.includes('MoE') ? 4800 : 2200,
      verified: true,
      tier,
      status: 'active',
      creator: 'Local Cluster Admin',
      costPer1kTokens: 0.015,
      tags: ['Custom', architecture.split(' ')[0], 'Autonomous'],
      memoryUsageMb: 16000,
      kvCachePct: 35.0,
      systemPrompt: systemPrompt.trim() || 'Execute high-conviction mathematical and liquidity routines.',
      routingThreshold,
      temperature,
      topP: 0.9,
    };

    onDeploy(newAgent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D14]/80 backdrop-blur-md">
      <div className="glass-panel-elevated rounded-xl max-w-xl w-full p-6 space-y-5 border border-[rgba(0,240,255,0.3)] shadow-[0_0_32px_rgba(0,240,255,0.15)] animate-in fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#00F0FF]" />
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-white">
              Deploy Autonomous Agent Shard
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[rgba(255,255,255,0.1)] text-[#849495] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded bg-[#FF453A]/10 border border-[#FF453A]/30 text-[#FF453A] text-xs font-mono">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#b9cacb] mb-1">AGENT NAME:</label>
              <input
                type="text"
                required
                placeholder="e.g. Nexus Liquidity Bot"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded input-obsidian text-white"
              />
            </div>
            <div>
              <label className="block text-[#b9cacb] mb-1">CODENAME (IDENTIFIER):</label>
              <input
                type="text"
                placeholder="e.g. NEXUS-32B"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                className="w-full px-3 py-2 rounded input-obsidian text-white uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#b9cacb] mb-1">NEURAL ARCHITECTURE:</label>
              <select
                value={architecture}
                onChange={(e) => setArchitecture(e.target.value as AgentArchitecture)}
                className="w-full px-3 py-2 rounded input-obsidian text-white cursor-pointer"
              >
                <option value="MoE / 32B">MoE / 32B (Mixture of Experts)</option>
                <option value="Dense / 70B">Dense / 70B (Transformer)</option>
                <option value="SSM Mamba 14B">SSM Mamba 14B (State-Space)</option>
                <option value="Multimodal / 45B">Multimodal / 45B</option>
                <option value="Quantized / 8B">Quantized / 8B (Fast-Gate)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#b9cacb] mb-1">CONSENSUS TIER:</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as ConsensusTier)}
                className="w-full px-3 py-2 rounded input-obsidian text-white cursor-pointer"
              >
                <option value="Enterprise Consensus">Enterprise Consensus</option>
                <option value="Ultraviolet Elite">Ultraviolet Elite</option>
                <option value="Standard Tier">Standard Tier</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#b9cacb] mb-1">OPERATIONAL DESCRIPTION:</label>
            <input
              type="text"
              required
              placeholder="e.g. Statistical arbitrage engine optimizing high-frequency delta pools."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded input-obsidian text-white"
            />
          </div>

          <div>
            <label className="block text-[#b9cacb] mb-1">SYSTEM PROMPT & INVARIANTS:</label>
            <textarea
              rows={2}
              placeholder="Define rules, risk tolerances, and execution limits..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-3 py-2 rounded input-obsidian text-white leading-relaxed"
            />
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded bg-[#101522] border border-[rgba(255,255,255,0.04)]">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#849495]">TEMPERATURE:</span>
                <span className="text-[#00F0FF] font-bold">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#00F0FF]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#849495]">ROUTING THRESHOLD:</span>
                <span className="text-[#7B61FF] font-bold">{routingThreshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={routingThreshold}
                onChange={(e) => setRoutingThreshold(parseFloat(e.target.value))}
                className="w-full accent-[#7B61FF]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-glass px-4 py-2 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-exec px-5 py-2 rounded flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0A0D14]" />
              <span>Deploy to Cluster</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
