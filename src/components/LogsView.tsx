import React, { useState } from 'react';
import { Terminal, Filter, Trash2, CheckCircle2 } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'success';
  text: string;
}

interface LogsViewProps {
  logs: LogEntry[];
}

export const LogsView: React.FC<LogsViewProps> = ({ logs }) => {
  const [filter, setFilter] = useState<'all' | 'info' | 'warn' | 'success'>('all');

  const filteredLogs = logs.filter((l) => (filter === 'all' ? true : l.level === filter));

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
            RESEARCH ENGINE & TRAINING CONSOLE
          </h2>
          <span className="text-xs text-slate-500 font-mono">({filteredLogs.length} events)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'all' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('info')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'info' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Info
            </button>
            <button
              onClick={() => setFilter('warn')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'warn' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Warnings
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'success' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Checkpoints
            </button>
          </div>
        </div>
      </div>

      {/* Terminal View */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 font-mono text-xs shadow-2xl h-[560px] overflow-y-auto space-y-2">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 leading-relaxed hover:bg-slate-900/50 p-1.5 rounded transition">
            <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
            <span
              className={`px-1.5 py-0.2 shrink-0 rounded text-[10px] font-bold uppercase select-none ${
                log.level === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : log.level === 'warn'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-cyan-500/20 text-cyan-400'
              }`}
            >
              {log.level}
            </span>
            <span
              className={
                log.level === 'success'
                  ? 'text-emerald-300 font-semibold'
                  : log.level === 'warn'
                  ? 'text-amber-200'
                  : 'text-slate-300'
              }
            >
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
