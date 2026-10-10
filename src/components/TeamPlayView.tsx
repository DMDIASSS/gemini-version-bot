import React, { useState } from 'react';
import { Users, Shield, Zap, AlertTriangle, ArrowRight, CheckCircle, Sliders, Play, Copy } from 'lucide-react';

export const TeamPlayView: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'2v2' | '3v3'>('2v2');
  const [teamBumpPenalty, setTeamBumpPenalty] = useState<number>(3.5);
  const [doubleCommitPenalty, setDoubleCommitPenalty] = useState<number>(4.0);
  const [passingReward, setPassingReward] = useState<number>(2.5);
  const [spacingDistance, setSpacingDistance] = useState<number>(1100);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const teamRewardCode = `# 2v2 and 3v3 Multi-Car Teamplay Reward Function (RLGym / RocketSim)
class TeamplayV2Rewards:
    def __init__(self):
        self.team_bump_penalty = -${teamBumpPenalty.toFixed(1)}
        self.double_commit_penalty = -${doubleCommitPenalty.toFixed(1)}
        self.pass_reward_mult = ${passingReward.toFixed(1)}
        self.min_spacing_uu = ${spacingDistance}

    def get_reward(self, player, state):
        reward = 0.0
        teammates = [c for c in state.cars.values() if c.is_orange == player.is_orange and c.car_id != player.car_id]
        
        for mate in teammates:
            # 1. Anti-Teammate Bump Penalty
            if player.is_colliding_with(mate):
                reward += self.team_bump_penalty
            
            # 2. Anti-Double Commit Penalty (Both going for ball on defense)
            dist_self = (player.physics.position - state.ball.position).length()
            dist_mate = (mate.physics.position - state.ball.position).length()
            if dist_self < 650 and dist_mate < 650 and player.physics.position.y * (1 if player.is_orange else -1) < 0:
                reward += self.double_commit_penalty

            # 3. Positional Spacing (Keep triangular echelon formation)
            dist_between_mates = (player.physics.position - mate.physics.position).length()
            if dist_between_mates < self.min_spacing_uu:
                reward -= 0.15 * (1.0 - dist_between_mates / self.min_spacing_uu)

        # 4. Infield Passing Play Detection (Pass to open teammate)
        if player.ball_touched:
            for mate in teammates:
                to_mate = (mate.physics.position - player.physics.position).normalized()
                if state.ball.linear_velocity.dot(to_mate) > 1200:
                    reward += self.pass_reward_mult

        return reward
`;

  const copyCode = () => {
    navigator.clipboard?.writeText(teamRewardCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-display font-bold text-slate-100">
              2v2 & 3v3 TEAMPLAY ARCHITECTURE · MULTI-AGENT ROTATIONS
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              SOLVING 1v1 TUNNEL VISION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
            Why Cycle 9 bumps teammates: <strong>1v1 Nexto has a fixed 1-opponent observation tensor</strong>—it is literally blind to its teammate and assumes every car on the pitch is an enemy! Here is the architecture to adapt it to 2v2 and 3v3.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedMode('2v2')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedMode === '2v2' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2v2 Doubles Mode
          </button>
          <button
            onClick={() => setSelectedMode('3v3')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              selectedMode === '3v3' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3v3 Standard Mode
          </button>
        </div>
      </div>

      {/* The 4 Pillars of Teamplay Fixes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> 1. Observation Tensor: Self-Attention Car Tokens
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">INPUT SHAPE</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In 1v1, the bot only takes <code>[Self, Ball, Pads, Opponent]</code>. For {selectedMode}, we expand the policy with an attention pool of <strong>{selectedMode === '2v2' ? '4 cars' : '6 cars'}</strong>:
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 space-y-1">
            <div>// Per-Car Token Features:</div>
            <div>[pos(3), vel(3), forward(3), up(3), boost(1), is_teammate(1), has_flip(1)]</div>
            <div>MultiheadAttention(Q=Self, K=AllCars, V=AllCars)</div>
            <div>// Allows bot to see and track teammate's exact trajectory!</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> 2. 1st Man vs 2nd Man Rotation Roles
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">ROTATIONS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Prevent double-committing by assigning dynamic tactical roles:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-sky-400">1st Man (Challenger):</span>
              <span className="text-slate-400 font-mono">Closest to ball · Forces 50/50 · Rotates out</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-emerald-400">2nd Man (Shadow Support):</span>
              <span className="text-slate-400 font-mono">Guards back post · Catches rebound · Maintains spacing</span>
            </div>
            {selectedMode === '3v3' && (
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-amber-400">3rd Man (Last Line):</span>
                <span className="text-slate-400 font-mono">Midfield safety · Never dives as last defender</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hyperparameter Tuning Drawer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" /> Teamplay Reward Shaping Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Teammate Bump Penalty</span>
              <span className="font-mono text-red-400">-{teamBumpPenalty.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={teamBumpPenalty}
              onChange={(e) => setTeamBumpPenalty(Number(e.target.value))}
              className="w-full accent-red-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Double-Commit Penalty</span>
              <span className="font-mono text-amber-400">-{doubleCommitPenalty.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={doubleCommitPenalty}
              onChange={(e) => setDoubleCommitPenalty(Number(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Infield Passing Reward</span>
              <span className="font-mono text-emerald-400">+{passingReward.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={passingReward}
              onChange={(e) => setPassingReward(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Min Spacing Distance</span>
              <span className="font-mono text-cyan-400">{spacingDistance} uu</span>
            </div>
            <input
              type="range"
              min="600"
              max="2000"
              step="50"
              value={spacingDistance}
              onChange={(e) => setSpacingDistance(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Copyable Python Reward Function */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <span className="text-xs font-mono font-bold text-slate-300">
            Ready-to-Use {selectedMode} Teamplay Reward Class (Python / RLGym)
          </span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
          >
            {copiedCode ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCode ? 'Copied!' : 'Copy Reward Code'}
          </button>
        </div>
        <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          {teamRewardCode}
        </pre>
      </div>
    </div>
  );
};
