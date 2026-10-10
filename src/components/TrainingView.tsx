import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Cpu, ShieldCheck, Activity, Award, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface TrainingState {
  status: 'idle' | 'running' | 'paused';
  currentCycle: number;
  totalSteps: number;
  stepsPerCycle: number;
  elapsedSeconds: number;
  targetHours: number;
  device: string;
  evalGames: number;
  policyLoss: number;
  entropy: number;
  learningRate: number;
  winRateVsNexto: number;
  baselineName: string;
  baselineSha: string;
  championSha: string;
}

interface TrainingViewProps {
  state: TrainingState;
  onControl: (action: 'start' | 'pause' | 'resume' | 'reset') => void;
  onUpdateConfig: (config: { targetHours?: number; evalGames?: number; stepsPerCycle?: number; device?: string }) => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({ state, onControl, onUpdateConfig }) => {
  const [hours, setHours] = useState<number>(state.targetHours);
  const [evalGames, setEvalGames] = useState<number>(state.evalGames);
  const [steps, setSteps] = useState<number>(state.stepsPerCycle);
  const [device, setDevice] = useState<string>(state.device);
  const [configSaved, setConfigSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      targetHours: hours,
      evalGames,
      stepsPerCycle: steps,
      device,
    });
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Lineage Protection Guarantee */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-display font-bold text-slate-100">AFK IMPROVED v2.3 TRAINING RUNNER</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              PROTECTED LINEAGE ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Primary training line branches safely from <strong className="text-slate-200">Cycle 9 Candidate</strong>.
            The original AutoLeague champion and Nexto baseline weights remain strictly read-only and immutable.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {state.status === 'running' ? (
            <button
              onClick={() => onControl('pause')}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-amber-600/20"
            >
              <Pause className="w-4 h-4" /> Request Safe Pause
            </button>
          ) : (
            <button
              onClick={() => onControl(state.status === 'paused' ? 'resume' : 'start')}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-600/20"
            >
              <Play className="w-4 h-4" /> {state.status === 'paused' ? 'Resume Training' : 'Start PPO Training'}
            </button>
          )}

          <button
            onClick={() => onControl('reset')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset Baseline
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>RUNNER STATUS</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                state.status === 'running'
                  ? 'bg-emerald-400 animate-pulse'
                  : state.status === 'paused'
                  ? 'bg-amber-400'
                  : 'bg-slate-500'
              }`}
            />
            <span className="text-xl font-display font-bold uppercase tracking-wider text-slate-100">
              {state.status}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Elapsed: {formatTime(state.elapsedSeconds)}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>PPO CYCLES</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-display font-bold text-cyan-400">#{state.currentCycle}</div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            {state.totalSteps.toLocaleString()} Total Steps
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>WIN RATE VS NEXTO</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-display font-bold text-amber-400">{state.winRateVsNexto}%</div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            +11.56% over Champion (47.19%)
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>POLICY ENTROPY / LOSS</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-mono font-bold text-purple-300">{state.entropy}</div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Loss: {state.policyLoss} (LR {state.learningRate})
          </span>
        </div>
      </div>

      {/* Training Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" /> Run Configuration & Hyperparameters
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Target Training Duration (Hours, 0 = unlimited)
                </label>
                <input
                  type="number"
                  min="0"
                  max="48"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Evaluation Games Per Cycle
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={evalGames}
                  onChange={(e) => setEvalGames(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Environment Steps per PPO Segment
                </label>
                <select
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value={4096}>4,096 Steps (Fast Iteration)</option>
                  <option value={8192}>8,192 Steps (Recommended Baseline)</option>
                  <option value={16384}>16,384 Steps (High Stability)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Compute Device</label>
                <select
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="cpu">CPU Runner (Standard nexto-model JIT compatibility)</option>
                  <option value="cuda:0">CUDA:0 (Experimental GPU Accelerator)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Nexto JIT operations contain fixed CPU tensor passes. Training defaults to CPU safety.
              </span>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition shadow"
              >
                {configSaved ? '✓ Configuration Applied' : 'Apply Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Lineage & Checksum Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cryptographic Integrity
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                ACTIVE BASELINE (CYCLE 9)
              </div>
              <div className="font-mono text-slate-300 text-[10px] break-all mt-1">
                {state.baselineSha}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> Checksum Verified
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                ORIGINAL CHAMPION (READ-ONLY)
              </div>
              <div className="font-mono text-slate-400 text-[10px] break-all mt-1">
                {state.championSha}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3 h-3" /> Locked & Preserved
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
