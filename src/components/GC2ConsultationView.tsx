import React, { useState } from 'react';
import { MessageSquare, Award, AlertTriangle, CheckCircle, Zap, ShieldAlert, Sparkles, Copy } from 'lucide-react';

export const GC2ConsultationView: React.FC = () => {
  const [copiedQ, setCopiedQ] = useState<boolean>(false);

  const questionsList = [
    '1. Kickoff: On which spawn (diagonal, straight, or off-center cheat) is the bot easiest to beat, and how much higher is its car landing compared to yours?',
    '2. Demos & Bumps: When you drive at it supersonic to demo, does it jump in place or stay glued to the floor? Does it ever turn into you for a counter-bump?',
    '3. Flip Resets: When you get a reset off the ball, does the bot commit immediately to where the ball is, or does it wait on the goal line for your delayed flick?',
    '4. Possession: In 1v1 neutral, does the bot give you the ball back by booming it into your half, or does it try bounce-dribbles/catches?',
    '5. Backboards: If you bounce the ball high off its backboard, does it panic aerial or rotate to back post?',
    '6. Boost Pathing: Does it abandon net to steal your corner 100 boost, leaving an open net for you to score?',
  ];

  const copyQuestions = () => {
    navigator.clipboard?.writeText(questionsList.join('\n\n'));
    setCopiedQ(true);
    setTimeout(() => setCopiedQ(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-display font-bold text-slate-100">
              GC2 PLAYTEST DEBRIEF & SLATER-BOT SCALING ARCHITECTURE
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              GRAND CHAMPION 2 AUDIT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
            Your GC2 friend confirmed: <strong className="text-slate-200">Cycle 9 and Wavedash</strong> are your strongest bots, but have critical weaknesses (kickoff speedflips, demo evasion/hunting, flip resets, backboard defense). Here is the master fix plan!
          </p>
        </div>

        <button
          onClick={copyQuestions}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
        >
          {copiedQ ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copiedQ ? 'Questions Copied!' : 'Copy Questions for Friend'}
        </button>
      </div>

      {/* The 5 Key Flaws & Direct Technical Fixes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> 1. Kickoff Speedflips & Height Control
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400">CRITICAL</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Problem:</strong> Bot boosts while airborne and flies too high over the ball. Your friend reaches first because he speedflips cleanly on the ground.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 space-y-1">
            <div>// Speedflip Reward Formula:</div>
            <div>reward += (car.vel.length() / 2300) * is_on_ground_or_low_altitude</div>
            <div>penalty -= max(0, car.pos.z - 130) * 0.05  // Keep car &lt;130uu height!</div>
            <div>pitch_cancel_bonus = (flip_pitch &lt; -0.85 && timer &lt; 0.070)</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" /> 2. Demo Hunting & Evasion Awareness
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">HIGH</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Problem:</strong> Bot never intentionally demos or dodges bumps; easy prey for a human who drives at it supersonic.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 space-y-1">
            <div>// Raycast Threat Avoidance:</div>
            <div>if opponent.is_supersonic && distance &lt; 650 && opponent_heading_to_us:</div>
            <div>&nbsp;&nbsp;reward += dodge_perpendicular_to_incoming_vector</div>
            <div>// Strategic Demo Bounty:</div>
            <div>if opponent_is_low_boost && in_front_of_ball: reward += demo_contact * 2.5</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> 3. Flip Resets & Aerial Reads
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">NEXT GEN</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Problem:</strong> Gets confused when human fast-aerials and delays a flip reset scoop. Bot has no concept of double jumps being held in reserve.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 space-y-1">
            <div>// Observation Feature Vector Additions:</div>
            <div>obs.opponent_has_flip = bool(opponent.has_flip)</div>
            <div>obs.opponent_suspension_compressed = bool(car.suspension_travel &gt; 0.9)</div>
            <div>// Prevents committing early to ball when reset is primed!</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> 4. Beating 3–5 Nextos (Slater-Bot Blueprint)
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">SLATER TIER</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Why Slater Bot crushes Nextos:</strong> Slater uses <em>asymmetric boost starvation</em>, <em>immediate 1v1 isolations</em>, and <em>continuous supersonic recovery</em> so 3 Nextos can never converge at once.
          </p>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            <li>Never leaves supersonic speed on recovery</li>
            <li>Steals small pads sequentially along retreat lines</li>
            <li>Baits first Nexto with fake challenge, clears behind backboard</li>
          </ul>
        </div>
      </div>

      {/* Actionable Questionnaire */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" /> Diagnostic Questionnaire for Your GC2 Friend
        </h3>
        <p className="text-xs text-slate-400">
          Send him these 6 questions during his next playtest session to isolate exact hyperparameter adjustments:
        </p>
        <div className="space-y-2.5">
          {questionsList.map((q, idx) => (
            <div key={idx} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{q.slice(3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
