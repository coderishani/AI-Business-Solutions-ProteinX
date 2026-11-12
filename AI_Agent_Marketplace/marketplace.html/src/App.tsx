/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Agent, PipelineNode } from './types';
import { INITIAL_AGENTS, INITIAL_PIPELINE } from './data/mockData';
import { Header, ActiveTab } from './components/Header';
import { WorkbenchView } from './components/WorkbenchView';
import { TradingView } from './components/TradingView';
import { MarketplaceView } from './components/MarketplaceView';
import { AuditLogsView } from './components/AuditLogsView';
import { ClusterTopologyView } from './components/ClusterTopologyView';
import { DeployModal } from './components/DeployModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workbench');
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(INITIAL_AGENTS[0]);
  const [pipelineNodes, setPipelineNodes] = useState<PipelineNode[]>(INITIAL_PIPELINE);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleDeployAgent = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
    setSelectedAgent(newAgent);
    showNotification(`Agent "${newAgent.name}" deployed to cluster successfully.`);
  };

  const handleDeployToWorkbench = (agent: Agent) => {
    setSelectedAgent(agent);
    setActiveTab('workbench');
    showNotification(`Agent "${agent.name}" loaded into Orchestration Workbench.`);
  };

  const handleExecuteToggle = () => {
    setIsExecuting((prev) => !prev);
    if (!isExecuting) {
      showNotification('Pipeline execution cycle initiated across cluster nodes.');
    } else {
      showNotification('Pipeline execution halted by operator.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#e1e2ec] flex flex-col font-['Inter'] selection:bg-[#00F0FF]/30 selection:text-white">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        isExecuting={isExecuting}
        onExecuteToggle={handleExecuteToggle}
      />

      {/* Global Alert Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#161D2E] border border-[#00F0FF]/40 text-xs font-mono text-white shadow-[0_0_24px_rgba(0,240,255,0.25)] animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#10E896]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto">
        {activeTab === 'workbench' && (
          <WorkbenchView
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
            pipelineNodes={pipelineNodes}
            onUpdatePipelineNode={setPipelineNodes}
            isExecuting={isExecuting}
            onExecuteToggle={handleExecuteToggle}
          />
        )}

        {activeTab === 'trading' && <TradingView />}

        {activeTab === 'marketplace' && (
          <MarketplaceView
            agents={agents}
            onSelectAgent={setSelectedAgent}
            onDeployToWorkbench={handleDeployToWorkbench}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
          />
        )}

        {activeTab === 'logs' && <AuditLogsView />}

        {activeTab === 'topology' && <ClusterTopologyView />}
      </main>

      {/* Deploy Agent Modal */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onDeploy={handleDeployAgent}
      />
    </div>
  );
}
