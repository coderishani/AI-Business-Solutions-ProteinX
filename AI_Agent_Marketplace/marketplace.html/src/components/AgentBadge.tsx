import React from 'react';
import { AgentStatus } from '../types';
import { Loader2 } from 'lucide-react';

interface AgentBadgeProps {
  status: AgentStatus;
  showText?: boolean;
}

export const AgentBadge: React.FC<AgentBadgeProps> = ({ status, showText = true }) => {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider bg-[rgba(16,232,150,0.1)] text-[#10E896] border border-[rgba(16,232,150,0.25)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10E896] animate-pulse-led" />
        {showText && <span>ACTIVE / READY</span>}
      </span>
    );
  }

  if (status === 'deploying') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider bg-[rgba(0,240,255,0.1)] text-[#00F0FF] border border-[rgba(0,240,255,0.25)]">
        <Loader2 className="w-2.5 h-2.5 animate-spin" />
        {showText && <span>DEPLOYING / THINKING</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider bg-[rgba(255,255,255,0.06)] text-[#8A93A6] border border-[rgba(255,255,255,0.1)]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8A93A6]" />
      {showText && <span>SUSPENDED</span>}
    </span>
  );
};
