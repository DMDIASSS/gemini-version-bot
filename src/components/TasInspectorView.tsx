import React, { useEffect, useState } from 'react';
import { Binary, FileCode, CheckCircle2, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface TasRecord {
  file: string;
  sha256: string;
  version: number;
  frames: number;
  estimated_seconds_at_120hz: number;
  flag_summary: { jump: number; boost: number; steerLeft: number; pitchUp: number };
  analog_float_ranges: { steer: [number, number]; throttle: [number, number]; pitch: [number, number] };
  status: string;
}

export const TasInspectorView: React.FC = () => {
  const [tasFiles, setTasFiles] = useState<TasRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<TasRecord | null>(null);

  useEffect(() => {
    fetch('/api/tas-data')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setTasFiles(data.files);
          setSelectedFile(data.files[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2">
            <Binary className="w-5 h-5 text-cyan-400" /> TAS DATA INSPECTOR & REPLAY PIPELINE
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Direct binary parser for Blaku TAS Plugin <code className="text-cyan-300">.data</code> recordings.
            Operates in safe read-only mode without executing or injecting native DLLs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold">
            DLL-Isolation Enforced
          </span>
        </div>
      </div>

      {/* Grid of Files */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasFiles.map((file) => {
          const isSelected = selectedFile?.file === file.file;
          return (
            <div
              key={file.file}
              onClick={() => setSelectedFile(file)}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {file.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">{file.file}</h3>
              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div>Frames: <span className="text-cyan-300">{file.frames}</span></div>
                <div>Duration @ 120Hz: <span className="text-slate-200">{file.estimated_seconds_at_120hz}s</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected File Deep Inspection */}
      {selectedFile && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{selectedFile.file}</span>
                <span className="text-xs font-mono font-normal text-slate-400">(Format Version {selectedFile.version})</span>
              </h3>
              <div className="text-[11px] font-mono text-slate-500 break-all mt-1">
                SHA-256: {selectedFile.sha256}
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-lg">
              32-byte Record Pitch
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Button Mask Frequencies */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Recorded Controller Input Flags
              </span>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Jump Button Frames:</span>
                  <span className="font-mono text-cyan-300 font-bold">{selectedFile.flag_summary.jump}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Boost Button Frames:</span>
                  <span className="font-mono text-amber-300 font-bold">{selectedFile.flag_summary.boost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Steer Inputs:</span>
                  <span className="font-mono text-slate-200">{selectedFile.flag_summary.steerLeft}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pitch Adjustments:</span>
                  <span className="font-mono text-slate-200">{selectedFile.flag_summary.pitchUp}</span>
                </div>
              </div>
            </div>

            {/* Float Ranges */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Analog Axis Range Bounds (IEEE-754)
              </span>
              <div className="space-y-2 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Steer Range:</span>
                  <span className="text-cyan-400">[{selectedFile.analog_float_ranges.steer.join(', ')}]</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Throttle Range:</span>
                  <span className="text-cyan-400">[{selectedFile.analog_float_ranges.throttle.join(', ')}]</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pitch Range:</span>
                  <span className="text-cyan-400">[{selectedFile.analog_float_ranges.pitch.join(', ')}]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
