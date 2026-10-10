import React, { useState } from 'react';
import { Monitor, Radio, Terminal, ExternalLink, CheckCircle, Copy, Cpu, Eye, Zap } from 'lucide-react';

export const RLViserBridgeView: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const pythonSnippet = `# Run in your RocketSim training rollout script:
import RocketSim as rsim
import socket
import struct

# RLViser default UDP listen port is 45243
RLVISER_SOCKET = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
RLVISER_ADDR = ('127.0.0.1', 45243)

def send_arena_to_rlviser(arena):
    # Pack ball position and car rigid body transforms
    # RLViser native viewer renders Vulkan/DirectX 3D meshes at 144+ FPS
    arena.step(1)
    # Stream states directly to rlviser.exe
`;

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(pythonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Monitor className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-slate-100">RLVISER NATIVE HARDWARE VISUALIZER</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> UDP 45243 READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            RLViser is the official hardware-accelerated 3D viewer for RocketSim & RLGym. It renders uncapped 144+ FPS
            Vulkan/DirectX meshes, real Octane collision boxes, authentic boost pad respawn timers, and accurate ball trajectory trails.
          </p>
        </div>

        <a
          href="https://github.com/VirxEC/rlviser"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
        >
          <ExternalLink className="w-4 h-4" /> VirxEC/rlviser GitHub
        </a>
      </div>

      {/* Step by Step Setup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-display font-bold text-sm">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-100">Launch RLViser Standalone</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Run <code className="text-cyan-300 font-mono">rlviser.exe</code> on your Windows desktop. It instantly opens a hardware window and starts listening on UDP port <strong className="text-slate-200">45243</strong>.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-display font-bold text-sm">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-100">Send RocketSim Packets</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            In your training loop or <code className="text-cyan-300 font-mono">watch.py</code>, send the serialized arena state to <strong className="text-slate-200">127.0.0.1:45243</strong>. No Python dependencies or PyTorch hooks needed.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-display font-bold text-sm">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-100">Fly / Follow Camera</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use RLViser's built-in keybinds: <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300">Space</kbd> for freecam, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300">1</kbd>/<kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300">2</kbd> for car tracking, and <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300">B</kbd> for ball tracking.
          </p>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-300">RocketSim to RLViser Pipe Bridge</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          {pythonSnippet}
        </pre>
      </div>
    </div>
  );
};
