import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

const app = express();
app.use(cors());
app.use(express.json());

// --- Mock In-Memory State for AFK Improved & Rocket League RL Bot ---

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
  lastStartedUtc: string | null;
  logs: { id: string; timestamp: string; level: 'info' | 'warn' | 'success'; text: string }[];
}

const trainingState: TrainingState = {
  status: 'idle',
  currentCycle: 9,
  totalSteps: 73728, // 9 * 8192
  stepsPerCycle: 8192,
  elapsedSeconds: 5240,
  targetHours: 2,
  device: 'cpu',
  evalGames: 40,
  policyLoss: -0.0421,
  entropy: 0.0294,
  learningRate: 0.0001,
  winRateVsNexto: 58.75,
  baselineName: 'Cycle 9 Checkpoint (Candidate)',
  baselineSha: '50f34d4a3723bc2849c97200e8e42969e0cc1d82328473b017505994be1966d2',
  championSha: 'c9596e2945ca6997f9ed496d90e89a772e519e4377db9989ef0645f827f6501a',
  lastStartedUtc: '2026-10-10T04:10:59.288Z',
  logs: [
    { id: '1', timestamp: '04:10:59', level: 'info', text: 'AFK Improved core initialized. Protected Cycle 9 SHA verified: 50f34d4a...' },
    { id: '2', timestamp: '04:11:02', level: 'info', text: 'AutoLeague champion hash locked: c9596e29... [Read-Only Guard active]' },
    { id: '3', timestamp: '04:11:05', level: 'success', text: 'RocketSim environment ready. Physics tick rate 120Hz locked.' },
    { id: '4', timestamp: '04:11:15', level: 'info', text: 'Baseline benchmark: Cycle 9 vs Nexto (160 episodes) -> Win Rate 58.75%' },
    { id: '5', timestamp: '04:12:00', level: 'warn', text: 'Device notice: Bundled Nexto JIT operations executed on CPU runner.' },
  ],
};

const modelsList = [
  {
    id: 'cycle9_baseline',
    name: 'Cycle 0009 Candidate (Baseline)',
    path: 'data/autoleague/backups/20261008T224518_cycle0009_steps000008192.pt',
    sha256: '50f34d4a3723bc2849c97200e8e42969e0cc1d82328473b017505994be1966d2',
    sizeMb: 8.24,
    status: 'Verified Baseline',
    winRateVsNexto: '58.75%',
    modified: '2026-10-08 22:45 UTC',
    isProtected: true,
  },
  {
    id: 'original_champion',
    name: 'AutoLeague Original Champion',
    path: 'data/autoleague/champion.pt',
    sha256: 'c9596e2945ca6997f9ed496d90e89a772e519e4377db9989ef0645f827f6501a',
    sizeMb: 8.24,
    status: 'Protected Original',
    winRateVsNexto: '47.19%',
    modified: '2026-10-08 19:12 UTC',
    isProtected: true,
  },
  {
    id: 'nexto_upstream',
    name: 'Upstream Nexto Teacher (v1.0)',
    path: 'vendor/nexto/nexto-model.pt',
    sha256: '8e4f3a71b290cb942045ea7728f2038162810395728a395029384729104859a1',
    sizeMb: 13.82,
    status: 'External Benchmark',
    winRateVsNexto: '50.00%',
    modified: '2026-10-01 10:00 UTC',
    isProtected: true,
  },
  {
    id: 'tri_teacher_challenger',
    name: 'Tri-Teacher Challenger (Rotation 01)',
    path: 'GigaLearn_Project/Research_Hub/experiments/tri_teacher_challenger_01/checkpoints/best.pt',
    sha256: 'b91f04a749320ae89104fa2849e77102948201a049102948502918402948019a',
    sizeMb: 8.24,
    status: 'Experimental',
    winRateVsNexto: '55.30%',
    modified: '2026-10-10 03:20 UTC',
    isProtected: false,
  },
  {
    id: 'defense_1v1',
    name: 'Defense Fundamentals 1v1 Seed',
    path: 'GigaLearn_Project/Research_Hub/experiments/defense1v1/POLICY.lt',
    sha256: '11a1e08f61a75c7eb036acdfb0e59b884be752eae67f6d9c110dbf1da40aebda',
    sizeMb: 7.91,
    status: 'Specialist Model',
    winRateVsNexto: '52.10%',
    modified: '2026-10-10 04:10 UTC',
    isProtected: false,
  },
  {
    id: 'wavedash_specialist',
    name: 'SkillForge Wavedash Recovery (Cycle 9 Fork)',
    path: 'data/mechanics/wavedash_specialist_c9.pt',
    sha256: '42c98d7210928a01f729bca02948201a049102948502918402948019a938201b',
    sizeMb: 8.24,
    status: 'Mechanic Branch',
    winRateVsNexto: '56.80%',
    modified: '2026-10-09 18:45 UTC',
    isProtected: false,
  },
];

const mechanicDrills = [
  {
    id: 'recovery',
    title: 'Recovery & Wall Landing Smoke',
    description: 'Evaluates rapid orientation recovery, wheel alignment on landing, and boost conservation after heavy impacts.',
    successRate: 92.4,
    meanRecoveryTimeMs: 420,
    score: 'A+',
    lastTested: '12m ago',
    details: 'Cycle 9 maintains 4-wheel contact within 0.42s; boosts immediately without skidding.',
  },
  {
    id: 'wavedash',
    title: 'Wavedash Speed & Timing',
    description: 'Measures low-boost forward acceleration dashes from wall descent and ground recoveries.',
    successRate: 88.1,
    meanRecoveryTimeMs: 310,
    score: 'A',
    lastTested: '25m ago',
    details: 'Average velocity increase +465 uu/s per dash; conservative jump duration avoids bounce.',
  },
  {
    id: 'kickoff',
    title: 'Kickoff Quality & Center Contest',
    description: 'First touch speed benchmark across diagonal, straight, and off-center kickoff spawns against Nexto.',
    successRate: 81.5,
    meanRecoveryTimeMs: 1820,
    score: 'B+',
    lastTested: '1h ago',
    details: 'Diagonal speed-flip touch at 1.82s. Center pinch 50/50 favors blue side 58% of trials.',
  },
  {
    id: 'defense1v1',
    title: '1v1 Shadow Defense & Backboard Saves',
    description: 'Challenges bot against 110 kph flicks, power shots, and awkward backboard bounces.',
    successRate: 84.6,
    meanRecoveryTimeMs: 640,
    score: 'A-',
    lastTested: '3h ago',
    details: 'Clean clearances to corner pads 74% of successful saves; prevents immediate rebound taps.',
  },
  {
    id: 'shooting',
    title: 'Finishing Lab & Shot Placement Drill',
    description: 'High-speed striking into upper 90 corners from midfield and wall setups.',
    successRate: 61.2,
    meanRecoveryTimeMs: 890,
    score: 'B',
    lastTested: '5h ago',
    details: 'Cycle 9 is aggressive but still misses backboard setups (needs further PPO refinement).',
  },
];

// RLViser Integration State
const rlviserConfig = {
  connected: true,
  port: 45243,
  host: '127.0.0.1',
  activeView: 'chase_cam',
  carId: 'blue_car_0',
  drawHud: true,
  status: 'Ready (Listening on UDP 45243 for RocketSim/RLViser pipe)',
  instructions: [
    '1. Download rlviser.exe from github.com/ZealanL/RLViser/releases',
    '2. Run `rlviser` in your terminal or double-click rlviser.exe (defaults to port 45243)',
    '3. In RocketSim Python/C++, enable `arena.set_goal_callback()` and call `arena.step()` with rlviser packet socket enabled',
    '4. RLViser renders native hardware Vulkan/DirectX graphics at uncapped framerate with authentic ball trajectory lines and boost gauges',
  ],
};

// Replay Scenario Cloning Engine State (User's 10-15s Goal & Defense Loop idea)
const scenarioCloningState = {
  totalReplays: 248,
  tier: 'GC3 / SSL Ranked 1v1',
  extractedClips: 812,
  averageClipDurationSec: 12.4,
  currentMode: 'shooter_imitation', // 'shooter_imitation' | 'defender_counterplay'
  activeClip: {
    id: 'clip_ssl_042',
    player: 'Mawkzy (SSL 1v1)',
    replayName: 'Ranked_1v1_ChampionsField_202610.replay',
    shotType: '118 kph Air Dribble Flip Reset',
    goalTimeRemaining: 3.2,
    shooterDistanceErrorUu: 42.1,
    defenderSaveRate: 27.5,
    status: 'Iterating Phase 1 (Shooter Kinematics)',
  },
  cloningQueue: [
    { id: 'clip_01', type: 'Speedflip Kickoff Goal', duration: '9.4s', diff: 'SSL', shooterTrained: 96, defenderTrained: 82 },
    { id: 'clip_02', type: 'Backboard Double Tap', duration: '13.1s', diff: 'SSL', shooterTrained: 88, defenderTrained: 45 },
    { id: 'clip_03', type: 'Ceiling Pinch Fake', duration: '11.8s', diff: 'GC3', shooterTrained: 91, defenderTrained: 74 },
    { id: 'clip_04', type: 'Flip Reset Dribble Scoop', duration: '14.2s', diff: 'SSL', shooterTrained: 79, defenderTrained: 38 },
    { id: 'clip_05', type: 'Shadow Defense 50/50 Counter', duration: '12.0s', diff: 'GC3', shooterTrained: 94, defenderTrained: 89 },
  ],
};

// GC2 Playtester Feedback & Improvement Diagnostic Framework
const gc2DiagnosticFramework = {
  strengths: [
    'Cycle 9 & Wavedash models have the most lethal aggression in 1v1 neutral.',
    'Deadly ground flicks and accurate midfield shooting when given room.',
    'Outstanding 50/50 air challenges—almost never loses equal aerial pinches.',
    'Solid baseline recovery speed on ground slides.',
  ],
  weaknessesIdentified: [
    {
      area: 'Kickoff (Speedflips & Height)',
      severity: 'CRITICAL',
      observation: 'Lacks diagonal speedflip. Boosts while airborne and flies too high over the ball. GC2 reaches center first every time.',
      solution: 'Inject hardcoded speedflip macro warmup OR speedflip reward curriculum (pitch-cancel timing <75ms, roll hold, stay under 140uu height).',
    },
    {
      area: 'Demo Awareness & Hunting',
      severity: 'HIGH',
      observation: 'Zero intentional bumps or demo plays. Never dodges incoming demos; very easily eliminated off the ball.',
      solution: 'Add Raycast proximity demo avoidance penalty + opportunistic demo reward when opponent is in blind spot with 0 boost.',
    },
    {
      area: 'Flip Resets & Aerial Reads',
      severity: 'HIGH',
      observation: 'Fails to read flip reset setups; gets confused when opponent delays dodge in the air. Does not attempt flip resets.',
      solution: 'Scenario cloning loop on 50+ SSL flip reset clips + reward for under-ball tire contact suspension impulse.',
    },
    {
      area: 'Possession & Booming',
      severity: 'HIGH',
      observation: 'Booms the ball away into open space instead of taking possession, bounce-dribbling, or baiting 50s.',
      solution: 'Possession retention reward (ball distance < 180uu, ball touch velocity vector toward opponent back wall, not cleared away).',
    },
    {
      area: 'Backboard Offense & Defense',
      severity: 'HIGH',
      observation: 'Ignores backboard for setups. Leaves net open assuming human cannot recover or challenge as fast as Nexto.',
      solution: 'Shadow positioning reward based on human threat cone rather than Nexto velocity; backboard bounce trajectory predictor.',
    },
    {
      area: 'Boost Lane Pathing',
      severity: 'MEDIUM',
      observation: 'Leaves defensive rotation to grab 100 big pads, exposing goal.',
      solution: 'Small pad routing reward (+12 pad chain bonus) over wide-circle 100 pad detours.',
    },
  ],
  questionsForFriend: [
    '1. When you beat the bot on kickoff, what exact spawn (diagonal, cheat, straight) gives you the easiest free goal?',
    '2. When the bot attacks you, at what exact distance or car angle does an early fake challenge make it panic and surrender the ball?',
    '3. What backboard bounce height makes it commit into an impossible whiff vs staying grounded in net?',
    '4. When you go for demos, does it drive in straight lines or does it make bad jumps that make demoing it even easier?',
    '5. What specific flicks (45-degree, 90-degree, delayed Breezi) consistently beat its goal line shadow defense?',
    '6. Does the bot pick up small pads while shadow defending, or does it idle on 0-15 boost?',
  ],
};

let simScore = { blue: 2, orange: 1 };
let ballPos = [0, 0, 180];
let ballVel = [240, 480, 60];
let blueCar = {
  team: 'blue',
  pos: [-600, -1800, 28],
  vel: [350, 800, 0],
  forward: [0.38, 0.92, 0.0],
  right: [0.92, -0.38, 0.0],
  up: [0.0, 0.0, 1.0],
  boost: 78.5,
  ground: true,
};
let orangeCar = {
  team: 'orange',
  pos: [500, 1400, 28],
  vel: [-200, -650, 0],
  forward: [-0.29, -0.95, 0.0],
  right: [-0.95, 0.29, 0.0],
  up: [0.0, 0.0, 1.0],
  boost: 54.0,
  ground: true,
};

// Simulation tick loop
setInterval(() => {
  // Update ball position
  ballPos[0] += ballVel[0] * 0.05;
  ballPos[1] += ballVel[1] * 0.05;
  ballPos[2] += ballVel[2] * 0.05;

  // Ball gravity
  ballVel[2] -= 32.5 * 0.05;

  // Ball bounce bounds (Unreal units: pitch is ~ -4096 to 4096 in X, -5120 to 5120 in Y, ceiling ~ 2048)
  if (ballPos[2] <= 93) {
    ballPos[2] = 93;
    ballVel[2] = Math.abs(ballVel[2]) * 0.72;
    ballVel[0] *= 0.98;
    ballVel[1] *= 0.98;
  }
  if (ballPos[0] < -3900) {
    ballPos[0] = -3900;
    ballVel[0] = Math.abs(ballVel[0]) * 0.8;
  } else if (ballPos[0] > 3900) {
    ballPos[0] = 3900;
    ballVel[0] = -Math.abs(ballVel[0]) * 0.8;
  }

  // Goal check
  if (ballPos[1] > 5120 && Math.abs(ballPos[0]) < 890 && ballPos[2] < 640) {
    // Blue goal!
    simScore.blue += 1;
    resetSimKickoff();
    return;
  } else if (ballPos[1] < -5120 && Math.abs(ballPos[0]) < 890 && ballPos[2] < 640) {
    // Orange goal!
    simScore.orange += 1;
    resetSimKickoff();
    return;
  }

  if (ballPos[1] < -5000) {
    ballPos[1] = -5000;
    ballVel[1] = Math.abs(ballVel[1]) * 0.8;
  } else if (ballPos[1] > 5000) {
    ballPos[1] = 5000;
    ballVel[1] = -Math.abs(ballVel[1]) * 0.8;
  }

  // Dynamic pursuit by cars towards ball
  updateCarPursuit(blueCar, ballPos, 900);
  updateCarPursuit(orangeCar, ballPos, 850);

  // If training is running, simulate background step increments
  if (trainingState.status === 'running') {
    trainingState.totalSteps += 64;
    trainingState.elapsedSeconds += 1;
    if (trainingState.totalSteps % trainingState.stepsPerCycle < 64) {
      trainingState.currentCycle += 1;
      const timeStr = new Date().toTimeString().split(' ')[0];
      const winRateDelta = (Math.random() * 0.6 - 0.2).toFixed(2);
      trainingState.winRateVsNexto = parseFloat(
        (trainingState.winRateVsNexto + parseFloat(winRateDelta)).toFixed(2)
      );
      trainingState.logs.unshift({
        id: String(Date.now()),
        timestamp: timeStr,
        level: parseFloat(winRateDelta) >= 0 ? 'success' : 'info',
        text: `Completed PPO Cycle #${trainingState.currentCycle} (${trainingState.stepsPerCycle} steps). Eval win rate vs Nexto: ${trainingState.winRateVsNexto}%. Checkpoint saved.`,
      });
      if (trainingState.logs.length > 50) trainingState.logs.pop();
    }
  }
}, 50);

function resetSimKickoff() {
  ballPos = [0, 0, 93];
  ballVel = [(Math.random() - 0.5) * 400, (Math.random() - 0.5) * 600, 300];
  blueCar.pos = [-256, -3840, 28];
  blueCar.vel = [0, 800, 0];
  blueCar.forward = [0, 1, 0];
  blueCar.boost = 33.3;

  orangeCar.pos = [256, 3840, 28];
  orangeCar.vel = [0, -800, 0];
  orangeCar.forward = [0, -1, 0];
  orangeCar.boost = 33.3;
}

function updateCarPursuit(
  car: { pos: number[]; vel: number[]; forward: number[]; right: number[]; up: number[]; boost: number },
  target: number[],
  speed: number
) {
  const dx = target[0] - car.pos[0];
  const dy = target[1] - car.pos[1];
  const dist = Math.hypot(dx, dy) || 1;
  const targetDirX = dx / dist;
  const targetDirY = dy / dist;

  // Turn towards target
  car.forward[0] += (targetDirX - car.forward[0]) * 0.15;
  car.forward[1] += (targetDirY - car.forward[1]) * 0.15;
  const mag = Math.hypot(car.forward[0], car.forward[1]) || 1;
  car.forward[0] /= mag;
  car.forward[1] /= mag;
  car.right = [-car.forward[1], car.forward[0], 0];

  // Move
  car.pos[0] += car.forward[0] * speed * 0.05;
  car.pos[1] += car.forward[1] * speed * 0.05;
  car.vel = [car.forward[0] * speed, car.forward[1] * speed, 0];

  // Random boost regeneration / consumption
  if (car.boost > 5) car.boost = Math.max(0, car.boost - 0.3);
  else car.boost = Math.min(100, car.boost + 2.5);
}

// --- API Endpoints ---

// 1. Current Status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    ...trainingState,
    timestamp: new Date().toISOString(),
  });
});

// 2. Training Controls (Start / Pause / Resume / Reset)
app.post('/api/training/control', (req: Request, res: Response) => {
  const { action } = req.body;
  const timeStr = new Date().toTimeString().split(' ')[0];

  if (action === 'start') {
    trainingState.status = 'running';
    trainingState.logs.unshift({
      id: String(Date.now()),
      timestamp: timeStr,
      level: 'info',
      text: `Training runner STARTED on device: ${trainingState.device}. Evaluating ${trainingState.evalGames} games/cycle.`,
    });
  } else if (action === 'pause') {
    trainingState.status = 'paused';
    trainingState.logs.unshift({
      id: String(Date.now()),
      timestamp: timeStr,
      level: 'warn',
      text: `Safe pause requested at cycle boundary. Checkpoint saved safely to data/afk_improved.`,
    });
  } else if (action === 'resume') {
    trainingState.status = 'running';
    trainingState.logs.unshift({
      id: String(Date.now()),
      timestamp: timeStr,
      level: 'info',
      text: `Training RESUMED from Cycle #${trainingState.currentCycle}. No checkpoints damaged.`,
    });
  } else if (action === 'reset') {
    trainingState.status = 'idle';
    trainingState.currentCycle = 9;
    trainingState.totalSteps = 73728;
    trainingState.winRateVsNexto = 58.75;
    trainingState.logs.unshift({
      id: String(Date.now()),
      timestamp: timeStr,
      level: 'info',
      text: `Reset training session to protected Cycle 9 baseline.`,
    });
  }

  res.json({ success: true, status: trainingState.status, state: trainingState });
});

// 3. Training Config
app.post('/api/training/config', (req: Request, res: Response) => {
  const { targetHours, cycles, evalGames, stepsPerCycle, device } = req.body;
  if (targetHours !== undefined) trainingState.targetHours = Number(targetHours);
  if (evalGames !== undefined) trainingState.evalGames = Number(evalGames);
  if (stepsPerCycle !== undefined) trainingState.stepsPerCycle = Number(stepsPerCycle);
  if (device !== undefined) trainingState.device = String(device);

  trainingState.logs.unshift({
    id: String(Date.now()),
    timestamp: new Date().toTimeString().split(' ')[0],
    level: 'info',
    text: `Configuration updated: ${trainingState.stepsPerCycle} steps/cycle, ${trainingState.evalGames} eval games, device=${trainingState.device}.`,
  });

  res.json({ success: true, state: trainingState });
});

// 4. Models List
app.get('/api/models', (req: Request, res: Response) => {
  res.json({ models: modelsList });
});

// 5. Verify Checkpoint
app.post('/api/models/verify', (req: Request, res: Response) => {
  const { id } = req.body;
  const model = modelsList.find((m) => m.id === id);
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }

  res.json({
    success: true,
    modelId: model.id,
    sha256: model.sha256,
    verified: true,
    message: `Integrity check PASSED for ${model.name}. Hash matches locked record.`,
  });
});

// 6. RLBot v4 Export
app.post('/api/models/export-rlbot', (req: Request, res: Response) => {
  const { modelId } = req.body;
  const model = modelsList.find((m) => m.id === modelId) || modelsList[0];

  res.json({
    success: true,
    bundleName: `rlbot4_${model.id}_package.zip`,
    files: [
      'bot.toml',
      'appearance.cfg',
      'agent.py',
      'nexto_obs.py',
      'model.pt',
      'NEXTO_UPSTREAM_LICENSE.txt',
    ],
    targetFramework: 'RLBot v4 Compatible Standalone',
    message: `RLBot v4 bundle successfully packaged from ${model.name}. Ready for deployment.`,
  });
});

// 7. Mechanics Benchmarks
app.get('/api/mechanics', (req: Request, res: Response) => {
  res.json({ mechanics: mechanicDrills });
});

app.post('/api/mechanics/run', (req: Request, res: Response) => {
  const { drillId } = req.body;
  const drill = mechanicDrills.find((d) => d.id === drillId);
  if (!drill) {
    return res.status(404).json({ error: 'Mechanic drill not found' });
  }

  const delta = (Math.random() * 2 - 0.8).toFixed(1);
  drill.successRate = Math.min(99, Math.max(50, parseFloat((drill.successRate + parseFloat(delta)).toFixed(1))));
  drill.lastTested = 'Just now';

  trainingState.logs.unshift({
    id: String(Date.now()),
    timestamp: new Date().toTimeString().split(' ')[0],
    level: 'success',
    text: `Mechanics Lab test [${drill.title}] finished: Success rate ${drill.successRate}%, grade ${drill.score}.`,
  });

  res.json({ success: true, drill });
});

// 8. TAS Inspector Data
app.get('/api/tas-data', (req: Request, res: Response) => {
  const sampleData = {
    files: [
      {
        file: '360 m,akuf.data',
        sha256: 'cff800dcea8f63fa3b555704968c1e39ee450c39aa94b2fa5b19137e3d65a67c',
        version: 1,
        frames: 555,
        estimated_seconds_at_120hz: 4.625,
        flag_summary: { jump: 307, boost: 187, steerLeft: 15, pitchUp: 37 },
        analog_float_ranges: { steer: [-1.0, 1.0], throttle: [-1.0, 1.0], pitch: [-0.99, 0.99] },
        status: 'Audited (Read-Only)',
      },
      {
        file: '2 player tas.data',
        sha256: '541eae0055a0aa1e0f71eaceb098b82e41304724e31dd03ff2d8034e97981073',
        version: 1,
        frames: 1030,
        estimated_seconds_at_120hz: 8.583,
        flag_summary: { jump: 610, boost: 492, steerLeft: 84, pitchUp: 91 },
        analog_float_ranges: { steer: [-1.0, 1.0], throttle: [-1.0, 1.0], pitch: [-0.99, 0.99] },
        status: 'Audited (Read-Only)',
      },
      {
        file: 'wave dash 2.data',
        sha256: '92110ea3bc2948019a8201b502918402948019a938201bcff800dcea8f63fa3',
        version: 1,
        frames: 240,
        estimated_seconds_at_120hz: 2.0,
        flag_summary: { jump: 120, boost: 35, steerLeft: 12, pitchUp: 88 },
        analog_float_ranges: { steer: [-1.0, 1.0], throttle: [-1.0, 1.0], pitch: [-0.99, 0.99] },
        status: 'SkillForge Linked',
      },
    ],
  };
  res.json(sampleData);
});

// 9. Camera State (matching original /state endpoint format from rl_camera_server.py)
app.get(['/api/camera/state', '/state'], (req: Request, res: Response) => {
  const frame = {
    ball: { pos: ballPos, vel: ballVel },
    cars: [blueCar, orangeCar],
    pads: [true, true, true, false, true, true],
    score: simScore,
    timestamp: Date.now() / 1000,
  };
  res.json({ frame, error: null });
});

// 10. Manual Kickoff or Shot Trigger in Simulator
app.post('/api/camera/trigger', (req: Request, res: Response) => {
  const { action } = req.body;
  if (action === 'kickoff') {
    resetSimKickoff();
  } else if (action === 'powershot') {
    ballPos = [0, -1200, 150];
    ballVel = [(Math.random() - 0.5) * 300, 2400, 650];
  } else if (action === 'high_aerial') {
    ballPos = [0, 800, 1100];
    ballVel = [100, -200, 200];
  } else if (action === 'reset_score') {
    simScore = { blue: 0, orange: 0 };
    resetSimKickoff();
  }
  res.json({ success: true, score: simScore });
});

// --- Server Setup & Vite Middleware Integration ---

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Chat_GPT_AI] Rocket League Studio server running at http://${HOST}:${PORT}`);
  });
}

startServer();
