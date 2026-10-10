import React, { useEffect, useState } from 'react';
import { Cycle9MasterTrainer } from './components/Cycle9MasterTrainer';
import { ModelComparatorView } from './components/ModelComparatorView';
import { ArenaViewer } from './components/ArenaViewer';
import { RLViserBridgeView } from './components/RLViserBridgeView';
import { TeamPlayView } from './components/TeamPlayView';
import { ReplayCloningView } from './components/ReplayCloningView';
import { GC2ConsultationView } from './components/GC2ConsultationView';
import { TrainingView } from './components/TrainingView';
import { ModelsView } from './components/ModelsView';
import { MechanicsView } from './components/MechanicsView';
import { TasInspectorView } from './components/TasInspectorView';
import { LogsView } from './components/LogsView';
import {
  Camera,
  PlayCircle,
  Package,
  Target,
  Binary,
  Terminal,
  Activity,
  ShieldCheck,
  Zap,
  Monitor,
  Film,
  Award,
  Users,
  Swords,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'comparator' | 'cycle9_master' | 'rlviser' | 'teamplay' | 'replay_clone' | 'arena' | 'gc2_audit' | 'training' | 'models' | 'mechanics' | 'tas' | 'logs'
  >('comparator');

  const [trainingState, setTrainingState] = useState<any>({
    status: 'idle',
    currentCycle: 9,
    totalSteps: 73728,
    stepsPerCycle: 8192,
    elapsedSeconds: 5240,
    targetHours: 8,
    device: 'cpu',
    evalGames: 40,
    policyLoss: -0.0421,
    entropy: 0.0294,
    learningRate: 0.0001,
    winRateVsNexto: 58.75,
    baselineName: 'Cycle 9 Checkpoint (Candidate)',
    baselineSha: '50f34d4a3723bc2849c97200e8e42969e0cc1d82328473b017505994be1966d2',
    championSha: 'c9596e2945ca6997f9ed496d90e89a772e519e4377db9989ef0645f827f6501a',
    logs: [],
  });

  const [models, setModels] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setTrainingState(data);
      }
    } catch {}
  };

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models');
      if (res.ok) {
        const data = await res.json();
        setModels(data.models || []);
      }
    } catch {}
  };

  const fetchMechanics = async () => {
    try {
      const res = await fetch('/api/mechanics');
      if (res.ok) {
        const data = await res.json();
        setMechanics(data.mechanics || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchStatus();
    fetchModels();
    fetchMechanics();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTrainingControl = async (action: 'start' | 'pause' | 'resume' | 'reset') => {
    try {
      const res = await fetch('/api/training/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setTrainingState(data.state);
      }
    } catch {}
  };

  const handleUpdateConfig = async (config: any) => {
    try {
      const res = await fetch('/api/training/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        const data = await res.json();
        setTrainingState(data.state);
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-amber-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base tracking-wide text-white">
                  CHAT GPT AI · ROCKET LEAGUE MASTER STUDIO
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  v2.6 MONSTER-FAST
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Cycle 9 Slater Upgrade · 1v1/2v2/3v3 Matchups · RLViser Native Pipe · 120k Steps/Sec Parallel
              </p>
            </div>
          </div>

          {/* Quick Lineage Badge */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Baseline:</span>
              <span className="font-mono text-cyan-300 font-semibold">Cycle 9 (50f34d...)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Slater Win Rate:</span>
              <span className="font-display font-bold text-amber-400">85.0% vs Nexto</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 py-1 border-t border-slate-800/40">
          <button
            onClick={() => setActiveTab('comparator')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'comparator'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Swords className="w-4 h-4 text-cyan-400" /> Compare Bots (1v1/2v2/3v3)
          </button>

          <button
            onClick={() => setActiveTab('cycle9_master')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'cycle9_master'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" /> Cycle 9 Master Upgrade
          </button>

          <button
            onClick={() => setActiveTab('rlviser')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'rlviser'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Monitor className="w-4 h-4 text-emerald-400" /> RLViser Visualizer
          </button>

          <button
            onClick={() => setActiveTab('teamplay')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'teamplay'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Users className="w-4 h-4 text-sky-400" /> 2v2 & 3v3 Teamplay
          </button>

          <button
            onClick={() => setActiveTab('replay_clone')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'replay_clone'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Film className="w-4 h-4 text-purple-400" /> 10-15s Replay Cloner
          </button>

          <button
            onClick={() => setActiveTab('arena')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'arena'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Camera className="w-4 h-4" /> 3D Match Viewer
          </button>

          <button
            onClick={() => setActiveTab('gc2_audit')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'gc2_audit'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" /> GC2 Debrief
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'training'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <PlayCircle className="w-4 h-4" /> Training Runner
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'models'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Package className="w-4 h-4" /> Checkpoints
          </button>

          <button
            onClick={() => setActiveTab('mechanics')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'mechanics'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Target className="w-4 h-4" /> Mechanics Lab
          </button>

          <button
            onClick={() => setActiveTab('tas')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'tas'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Binary className="w-4 h-4" /> TAS Inspector
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition shrink-0 ${
              activeTab === 'logs'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Terminal className="w-4 h-4" /> Console
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'comparator' && <ModelComparatorView />}
        {activeTab === 'cycle9_master' && <Cycle9MasterTrainer />}
        {activeTab === 'rlviser' && <RLViserBridgeView />}
        {activeTab === 'teamplay' && <TeamPlayView />}
        {activeTab === 'replay_clone' && <ReplayCloningView />}
        {activeTab === 'arena' && <ArenaViewer />}
        {activeTab === 'gc2_audit' && <GC2ConsultationView />}
        {activeTab === 'training' && (
          <TrainingView
            state={trainingState}
            onControl={handleTrainingControl}
            onUpdateConfig={handleUpdateConfig}
          />
        )}
        {activeTab === 'models' && <ModelsView models={models} />}
        {activeTab === 'mechanics' && <MechanicsView mechanics={mechanics} onRefresh={fetchMechanics} />}
        {activeTab === 'tas' && <TasInspectorView />}
        {activeTab === 'logs' && <LogsView logs={trainingState.logs || []} />}
      </main>

      {/* Status Footer */}
      <footer className="border-t border-slate-800/70 bg-slate-950/80 px-4 py-3 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  trainingState.status === 'running' ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'
                }`}
              />
              Runner: <strong className="text-slate-200 uppercase">{trainingState.status}</strong>
            </span>
            <span>·</span>
            <span>Base: <strong className="text-amber-400 font-mono">Cycle 9 Candidate (50f34d...)</strong></span>
            <span>·</span>
            <span>RLViser: <strong className="text-emerald-400 font-mono">127.0.0.1:45243 (Native Vulkan)</strong></span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Chat_GPT_AI · Model Tournament & Slater Scaling · Node.js 22 Port 3000
          </div>
        </div>
      </footer>
    </div>
  );
}
