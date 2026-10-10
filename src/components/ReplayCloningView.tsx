import React, { useState } from 'react';
import { Film, Play, RotateCcw, ShieldCheck, Target, Zap, Award, CheckCircle, Flame, Layers } from 'lucide-react';

export const ReplayCloningView: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'shooter' | 'defender'>('shooter');
  const [selectedClip, setSelectedClip] = useState<number>(0);
  const [isIterating, setIsIterating] = useState<boolean>(false);
  const [timelineSec, setTimelineSec] = useState<number>(12);

  const clips = [
    {
      id: 'clip_01',
      title: '118 kph Air Dribble Flip Reset',
      player: 'Mawkzy (SSL 1v1)',
      duration: '14.2s',
      leadup: '12.0s',
      mechanics: ['Flip Reset', 'Boost Feathering', 'Under-Ball Scoop'],
      shooterAccuracy: 88.4,
      saveRate: 34.2,
      difficulty: 'SSL',
    },
    {
      id: 'clip_02',
      title: 'Speedflip Kickoff Pinch & Goal',
      player: 'ApparentlyJack (SSL 1v1)',
      duration: '9.4s',
      leadup: '8.5s',
      mechanics: ['Diagonal Speedflip', 'Low Altitude', 'Center 50/50'],
      shooterAccuracy: 94.1,
      saveRate: 78.5,
      difficulty: 'SSL',
    },
    {
      id: 'clip_03',
      title: 'Backboard Double Tap Follow-up',
      player: 'Vatira (SSL 1v1)',
      duration: '13.1s',
      leadup: '11.5s',
      mechanics: ['High Wall Read', 'Air Roll Left', 'Corner Strike'],
      shooterAccuracy: 82.7,
      saveRate: 46.8,
      difficulty: 'SSL',
    },
    {
      id: 'clip_04',
      title: 'Shadow Defense Counter Flick',
      player: 'Daniel (SSL 1v1)',
      duration: '11.8s',
      leadup: '10.2s',
      mechanics: ['45° Delayed Flick', 'Fake Challenge Read', 'Demo Dodge'],
      shooterAccuracy: 91.0,
      saveRate: 86.4,
      difficulty: 'GC3',
    },
  ];

  const current = clips[selectedClip];

  const handleSimulateCycle = () => {
    setIsIterating(true);
    setTimeout(() => {
      setIsIterating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-slate-100">
              REPLAY SCENARIO CLONING ENGINE (10–15s GOAL & DEFENSE PIPELINE)
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              200+ GC3/SSL REPLAY DATASET
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
            Replays the critical 10–15 seconds before every goal: the bot first learns by <strong>imitating the shooter</strong> (trajectory matching + teacher-forcing), then reverses role to <strong>play as the defender</strong> to drill clutch saves, backboard reads, and flip-reset denials!
          </p>
        </div>

        <button
          onClick={handleSimulateCycle}
          disabled={isIterating}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-600/20"
        >
          {isIterating ? <Zap className="w-4 h-4 animate-spin text-amber-300" /> : <Play className="w-4 h-4" />}
          {isIterating ? 'Executing Scenario Rollouts…' : 'Iterate Current Clip'}
        </button>
      </div>

      {/* Two-Phase Loop Mode Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => setActiveMode('shooter')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            activeMode === 'shooter'
              ? 'bg-cyan-500/10 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Phase 1: Shooter Kinematic Imitation
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              Offense Mastery
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Other cars move as deterministic kinematic ghosts. Bot is rewarded by minimizing trajectory distance (L2 error) to the SSL scoring player's car and reproducing identical air touches and flip cancels.
          </p>
        </div>

        <div
          onClick={() => setActiveMode('defender')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            activeMode === 'defender'
              ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Phase 2: Defender Counter-Play
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              Defense & Anti-Reset
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Role is flipped: Bot replaces the player who got scored on. Faces the exact 115+ kph shot, backboard double tap, or delayed flip reset. Rewarded for intercepting the ball trajectory before goal crossing!
          </p>
        </div>
      </div>

      {/* Clip Scrubber & Detail */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{current.title}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
                {current.difficulty} Tier
              </span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Original player: {current.player} · Duration: {current.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            {current.mechanics.map((m) => (
              <span key={m} className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 text-slate-300 rounded-lg">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* 10-15s Timeline Scrubber */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Lead-up Start: -14.0s</span>
            <span className="text-cyan-400 font-bold">Timeline Cursor: -{timelineSec}s</span>
            <span className="text-emerald-400">0.0s (Goal Touch)</span>
          </div>
          <input
            type="range"
            min="0"
            max="14"
            step="0.5"
            value={timelineSec}
            onChange={(e) => setTimelineSec(Number(e.target.value))}
            className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Current Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Shooter Kinematic Match</span>
            <span className="text-xl font-display font-bold text-cyan-400">{current.shooterAccuracy}%</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Defender Save Success</span>
            <span className="text-xl font-display font-bold text-amber-400">{current.saveRate}%</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Training State</span>
            <span className="text-sm font-semibold text-emerald-400">High-Reward Convergence</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Nexto Comparison</span>
            <span className="text-sm font-semibold text-purple-400">+3.8x Aerial Speed</span>
          </div>
        </div>
      </div>

      {/* Replay Queue Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {clips.map((clip, idx) => (
          <div
            key={clip.id}
            onClick={() => setSelectedClip(idx)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              selectedClip === idx
                ? 'bg-cyan-500/10 border-cyan-500 text-white shadow'
                : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold truncate">{clip.title}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">{clip.player}</div>
            <div className="mt-2 text-[10px] flex justify-between text-slate-500">
              <span>Shooter: {clip.shooterAccuracy}%</span>
              <span>Save: {clip.saveRate}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
