import React from 'react';
import {
  Cpu,
  Activity,
  Layers,
  TrendingUp,
  Store,
  TerminalSquare,
  Globe2,
  Plus,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export type ActiveTab = 'workbench' | 'trading' | 'marketplace' | 'logs' | 'topology';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenDeployModal: () => void;
  isExecuting: boolean;
  onExecuteToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenDeployModal,
  isExecuting,
  onExecuteToggle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#101522]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)]">
      {/* Top Telemetry & Status Ribbon */}
      <div className="px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono border-b border-[rgba(255,255,255,0.04)] bg-[#0A0D14]/70">
        <div className="flex items-center gap-4 text-[#849495]">
          <div className="flex items-center gap-1.5 text-[#10E896]">
            <span className="w-2 h-2 rounded-full bg-[#10E896] animate-pulse-led" />
            <span className="font-semibold tracking-wider">CONSENSUS LIVE: 99.98%</span>
          </div>
          <span className="text-[rgba(255,255,255,0.15)]">|</span>
          <div className="flex items-center gap-1.5 text-[#e1e2ec]">
            <Globe2 className="w-3 h-3 text-[#00F0FF]" />
            <span>CLUSTER: <strong className="text-[#00F0FF]">US-East Ashburn 01</strong> (11.2ms)</span>
          </div>
          <span className="hidden md:inline text-[rgba(255,255,255,0.15)]">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-[#b9cacb]">
            <Zap className="w-3 h-3 text-[#7B61FF]" />
            <span>TOTAL THROUGHPUT: <strong className="text-white tabular-nums">48,240 TPS</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="hidden sm:flex items-center gap-1 text-[#b9cacb]">
            <ShieldCheck className="w-3 h-3 text-[#10E896]" />
            <span>ZK-PROOFS VERIFIED</span>
          </div>
          <span className="hidden sm:inline text-[rgba(255,255,255,0.15)]">|</span>
          <span className="text-[#00F0FF] bg-[rgba(0,240,255,0.08)] px-2 py-0.5 rounded border border-[rgba(0,240,255,0.25)]">
            MAINNET KINETIC v3.8.4
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded bg-[#161D2E] border border-[rgba(0,240,255,0.4)] shadow-[0_0_16px_rgba(0,240,255,0.2)]">
            <Cpu className="w-5 h-5 text-[#00F0FF]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#10E896]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                OBSIDIAN <span className="text-[#00F0FF]">KINETIC</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 bg-[#1E2638] text-[#7B61FF] border border-[rgba(123,97,255,0.3)] rounded">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] text-[#849495] tracking-wide">
              AUTONOMOUS AI ORCHESTRATION & ALGORITHMIC ASSET TRADING
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0A0D14] p-1 rounded-md border border-[rgba(255,255,255,0.08)]">
          <button
            onClick={() => onTabChange('workbench')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'workbench'
                ? 'bg-[#161D2E] text-[#00F0FF] border border-[rgba(0,240,255,0.4)] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'text-[#b9cacb] hover:text-white hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Orchestration Workbench</span>
          </button>

          <button
            onClick={() => onTabChange('trading')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'trading'
                ? 'bg-[#161D2E] text-[#00F0FF] border border-[rgba(0,240,255,0.4)] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'text-[#b9cacb] hover:text-white hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Algorithmic Trading</span>
          </button>

          <button
            onClick={() => onTabChange('marketplace')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'marketplace'
                ? 'bg-[#161D2E] text-[#00F0FF] border border-[rgba(0,240,255,0.4)] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'text-[#b9cacb] hover:text-white hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Agent Marketplace</span>
          </button>

          <button
            onClick={() => onTabChange('logs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'logs'
                ? 'bg-[#161D2E] text-[#00F0FF] border border-[rgba(0,240,255,0.4)] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'text-[#b9cacb] hover:text-white hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
            }`}
          >
            <TerminalSquare className="w-3.5 h-3.5" />
            <span>Telemetry & Audit Logs</span>
          </button>

          <button
            onClick={() => onTabChange('topology')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === 'topology'
                ? 'bg-[#161D2E] text-[#00F0FF] border border-[rgba(0,240,255,0.4)] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'text-[#b9cacb] hover:text-white hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Compute Clusters</span>
          </button>
        </nav>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-2">
          {/* Quick Execution Trigger */}
          <button
            onClick={onExecuteToggle}
            className={`px-3 py-1.5 rounded text-xs font-bold tracking-wider font-mono flex items-center gap-1.5 transition-all ${
              isExecuting
                ? 'bg-[rgba(255,69,58,0.15)] text-[#FF453A] border border-[rgba(255,69,58,0.4)] hover:bg-[rgba(255,69,58,0.25)]'
                : 'bg-[#00F0FF] text-[#0A0D14] hover:bg-[#33f4ff] shadow-[0_0_14px_rgba(0,240,255,0.4)]'
            }`}
          >
            {isExecuting ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#FF453A] animate-ping" />
                <span>HALT PIPELINE</span>
              </>
            ) : (
              <>
                <Activity className="w-3.5 h-3.5" />
                <span>EXECUTE PIPELINE</span>
              </>
            )}
          </button>

          {/* Deploy New Agent Button */}
          <button
            onClick={onOpenDeployModal}
            className="btn-secondary-glass px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="hidden sm:inline">Deploy Agent</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-1.5 gap-2 border-t border-[rgba(255,255,255,0.04)] bg-[#0A0D14]/90 no-scrollbar">
        <button
          onClick={() => onTabChange('workbench')}
          className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-medium ${
            activeTab === 'workbench' ? 'bg-[#161D2E] text-[#00F0FF]' : 'text-[#b9cacb]'
          }`}
        >
          Workbench
        </button>
        <button
          onClick={() => onTabChange('trading')}
          className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-medium ${
            activeTab === 'trading' ? 'bg-[#161D2E] text-[#00F0FF]' : 'text-[#b9cacb]'
          }`}
        >
          Algo Trading
        </button>
        <button
          onClick={() => onTabChange('marketplace')}
          className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-medium ${
            activeTab === 'marketplace' ? 'bg-[#161D2E] text-[#00F0FF]' : 'text-[#b9cacb]'
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => onTabChange('logs')}
          className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-medium ${
            activeTab === 'logs' ? 'bg-[#161D2E] text-[#00F0FF]' : 'text-[#b9cacb]'
          }`}
        >
          Audit Logs
        </button>
        <button
          onClick={() => onTabChange('topology')}
          className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-medium ${
            activeTab === 'topology' ? 'bg-[#161D2E] text-[#00F0FF]' : 'text-[#b9cacb]'
          }`}
        >
          Clusters
        </button>
      </div>
    </header>
  );
};
