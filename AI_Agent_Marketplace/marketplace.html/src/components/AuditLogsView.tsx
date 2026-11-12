import React, { useState } from 'react';
import { AuditLogRow } from '../types';
import { INITIAL_AUDIT_LOGS } from '../data/mockData';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  X,
  FileCode,
  Download,
} from 'lucide-react';
import { formatTelemetryLatency } from '../utils/orchestratorLogic';

export const AuditLogsView: React.FC = () => {
  const [logs] = useState<AuditLogRow[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'optimal' | 'computing' | 'rejected'>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLogRow | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredLogs = logs.filter((log) => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.agentHash.toLowerCase().includes(q) ||
      log.agentName.toLowerCase().includes(q) ||
      log.operation.toLowerCase().includes(q) ||
      log.payloadSnippet.toLowerCase().includes(q)
    );
  });

  const handleCopyPayload = () => {
    if (!selectedLog) return;
    navigator.clipboard?.writeText(JSON.stringify(selectedLog.fullPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            Continuous Telemetry & Cryptographic Audit Matrix
            <span className="text-xs font-mono font-normal text-[#10E896] bg-[rgba(16,232,150,0.1)] px-2 py-0.5 rounded border border-[rgba(16,232,150,0.2)]">
              IMMUTABLE LOGS
            </span>
          </h2>
          <p className="text-xs text-[#849495] mt-1 font-mono">
            High-density ledger tracking real-time consensus cycles, inference latency, token counts, and zero-knowledge commitments.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[#849495] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search hash, op, agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded input-obsidian font-mono"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#0A0D14] p-1 rounded border border-[rgba(255,255,255,0.06)] text-xs font-mono">
            {(['all', 'optimal', 'computing'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-[#161D2E] text-[#00F0FF] font-semibold'
                    : 'text-[#849495] hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dense Data Table conforming to 36px row height spec */}
      <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Sticky Table Header in JetBrains Mono muted */}
            <thead className="sticky top-0 bg-[#0A0D14] border-b border-[rgba(255,255,255,0.08)] z-10">
              <tr className="h-9 text-[11px] font-mono uppercase tracking-wider text-[#6C7893]">
                <th className="px-4 font-medium">TIMESTAMP</th>
                <th className="px-3 font-medium">AGENT HASH</th>
                <th className="px-3 font-medium">AGENT NAME</th>
                <th className="px-3 font-medium">OPERATION</th>
                <th className="px-3 font-medium">STATUS</th>
                <th className="px-3 font-medium text-right">LATENCY</th>
                <th className="px-3 font-medium text-right">TOKENS</th>
                <th className="px-3 font-medium text-right">CONSENSUS</th>
                <th className="px-4 font-medium">PAYLOAD SNIPPET</th>
              </tr>
            </thead>

            {/* Table Body with 36px rows, subtle striping, hover highlight */}
            <tbody className="divide-y divide-[rgba(255,255,255,0.02)] text-xs font-mono">
              {filteredLogs.map((log, index) => {
                const isEven = index % 2 === 0;
                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`h-[36px] max-h-[36px] cursor-pointer table-row-hover ${
                      isEven ? 'bg-[#101522]' : 'bg-[#101522]/60'
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="px-4 py-1 text-[#849495] whitespace-nowrap tabular-nums text-[11px]">
                      {log.timestamp}
                    </td>

                    {/* Agent Hash */}
                    <td className="px-3 py-1 text-[#00F0FF] whitespace-nowrap font-semibold">
                      {log.agentHash}
                    </td>

                    {/* Agent Name */}
                    <td className="px-3 py-1 text-white font-['Plus_Jakarta_Sans'] font-medium whitespace-nowrap truncate max-w-[150px]">
                      {log.agentName}
                    </td>

                    {/* Operation */}
                    <td className="px-3 py-1 text-[#b9cacb] whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-[#161D2E] border border-[rgba(255,255,255,0.06)] text-[10px]">
                        {log.operation}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-1 whitespace-nowrap">
                      {log.status === 'optimal' ? (
                        <span className="inline-flex items-center gap-1 text-[#10E896] text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10E896]" />
                          OPTIMAL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#00F0FF] text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-spin" />
                          COMPUTING
                        </span>
                      )}
                    </td>

                    {/* Latency */}
                    <td className="px-3 py-1 text-right text-white tabular-nums">
                      {formatTelemetryLatency(log.latencyMs)}
                    </td>

                    {/* Tokens */}
                    <td className="px-3 py-1 text-right text-[#b9cacb] tabular-nums">
                      {log.tokenCount.toLocaleString()}
                    </td>

                    {/* Consensus Score */}
                    <td className="px-3 py-1 text-right text-[#10E896] font-semibold tabular-nums">
                      {log.consensusScore}%
                    </td>

                    {/* Payload Snippet */}
                    <td className="px-4 py-1 text-[#849495] truncate max-w-[220px] font-mono text-[10px]">
                      {log.payloadSnippet}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Bar */}
        <div className="px-4 py-2 bg-[#0A0D14] border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] font-mono text-[#849495]">
          <div>DISPLAYING {filteredLogs.length} OF {logs.length} AUDIT RECORDS</div>
          <div className="flex items-center gap-4">
            <span>HASH PROOF: SHA256-ED25519</span>
            <span className="text-[#10E896]">ALL INVARIANTS SATISFIED</span>
          </div>
        </div>
      </div>

      {/* JSON Payload Inspector Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0D14]/80 backdrop-blur-md">
          <div className="glass-panel-elevated rounded-xl max-w-2xl w-full p-5 space-y-4 font-mono text-xs border border-[rgba(0,240,255,0.3)] shadow-[0_0_32px_rgba(0,240,255,0.15)] animate-in fade-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-white">
                  Telemetry Payload: {selectedLog.operation}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded hover:bg-[rgba(255,255,255,0.1)] text-[#849495] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded bg-[#101522] border border-[rgba(255,255,255,0.04)] text-[11px]">
              <div>
                <span className="text-[#849495]">AGENT:</span>
                <div className="text-white font-semibold">{selectedLog.agentName}</div>
              </div>
              <div>
                <span className="text-[#849495]">LATENCY:</span>
                <div className="text-[#10E896] font-semibold">{selectedLog.latencyMs}ms</div>
              </div>
              <div>
                <span className="text-[#849495]">TOKEN COUNT:</span>
                <div className="text-white font-semibold">{selectedLog.tokenCount}</div>
              </div>
              <div>
                <span className="text-[#849495]">CONSENSUS:</span>
                <div className="text-[#00F0FF] font-semibold">{selectedLog.consensusScore}%</div>
              </div>
            </div>

            {/* Code Block */}
            <div className="relative bg-[#0A0D14] rounded p-3 border border-[rgba(255,255,255,0.06)] max-h-72 overflow-y-auto">
              <pre className="text-[#b9cacb] font-mono text-[11px] leading-relaxed">
                {JSON.stringify(selectedLog.fullPayload, null, 2)}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]">
              <button
                onClick={handleCopyPayload}
                className="btn-secondary-glass px-3 py-1.5 rounded text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10E896]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy JSON Payload'}</span>
              </button>

              <button
                onClick={() => setSelectedLog(null)}
                className="btn-primary-exec px-4 py-1.5 rounded text-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
