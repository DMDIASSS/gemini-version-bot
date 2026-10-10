import React, { useState } from 'react';
import { Target, Zap, Play, Trophy, CheckCircle, Flame, ArrowUpRight, Award } from 'lucide-react';

interface MechanicDrill {
  id: string;
  title: string;
  description: string;
  successRate: number;
  meanRecoveryTimeMs: number;
  score: string;
  lastTested: string;
  details: string;
}

interface MechanicsViewProps {
  mechanics: MechanicDrill[];
  onRefresh: () => void;
}

export const MechanicsView: React.FC<MechanicsViewProps> = ({ mechanics, onRefresh }) => {
  const [runningDrill, setRunningDrill] = useState<string | null>(null);

  const runBenchmark = async (drillId: string) => {
    setRunningDrill(drillId);
    try {
      const res = await fetch('/api/mechanics/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drillId }),
      });
      if (res.ok) {
        onRefresh();
      }
    } finally {
      setTimeout(() => setRunningDrill(null), 600);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" /> MECHANICS LAB & SCENARIO DIAGNOSTICS
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Independent physics benchmarks evaluated in RocketSim: measures wavedash timing, wheel-landing recovery,
            kickoff speed-flips, 1v1 shadow defense reaction time, and high-speed striking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl text-xs font-semibold">
            120Hz Simulator Fixed-Step
          </span>
        </div>
      </div>

      {/* Mechanics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mechanics.map((drill) => (
          <div
            key={drill.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-display font-bold border ${
                    drill.score.startsWith('A')
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  GRADE {drill.score}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">{drill.lastTested}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 mb-1.5">{drill.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{drill.description}</p>

              {/* Success Rate Bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Success Rate:</span>
                  <span className="font-display font-bold text-cyan-400">{drill.successRate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${drill.successRate}%` }}
                  />
                </div>
              </div>

              {/* Metric stats */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Timing</span>
                  <span className="font-mono text-slate-200 font-semibold">{drill.meanRecoveryTimeMs} ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Status</span>
                  <span className="text-emerald-400 font-semibold">Active Drill</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400/90 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40 mb-4">
                {drill.details}
              </p>
            </div>

            <button
              onClick={() => runBenchmark(drill.id)}
              disabled={runningDrill === drill.id}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition"
            >
              {runningDrill === drill.id ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-bounce text-cyan-400" /> Running Drill in Sim…
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-cyan-400" /> Run Benchmark Drill
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
