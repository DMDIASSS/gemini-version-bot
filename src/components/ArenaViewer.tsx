import React, { useEffect, useRef, useState } from 'react';
import { Camera, Eye, RotateCcw, Sliders, Play, Zap, Trophy, ShieldAlert, Sparkles, Monitor, Users } from 'lucide-react';

interface CarData {
  id: string;
  team: 'blue' | 'orange';
  pos: [number, number, number];
  vel: [number, number, number];
  forward: [number, number, number];
  right: [number, number, number];
  up: [number, number, number];
  boost: number;
  ground: boolean;
}

interface CameraState {
  distance: number;
  height: number;
  angle: number;
  fov: number;
  stiffness: number;
}

export const ArenaViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ballCam, setBallCam] = useState<boolean>(true);
  const [focusCarIndex, setFocusCarIndex] = useState<number>(0);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const [matchMode, setMatchMode] = useState<'1v1' | '2v2' | '3v3'>('1v1');
  const [score, setScore] = useState<{ blue: number; orange: number }>({ blue: 2, orange: 1 });
  const [currentBoost, setCurrentBoost] = useState<number>(85);
  const [cameraSettings, setCameraSettings] = useState<CameraState>({
    distance: 280,
    height: 110,
    angle: -4,
    fov: 110,
    stiffness: 75,
  });

  // Authentic Rocket League Physics Simulation State
  // Gravity = -650 uu/s^2, Ball radius = 91.25 uu
  const GRAVITY = -650.0;
  const BALL_RADIUS = 91.25;

  const simBallRef = useRef<{ pos: [number, number, number]; vel: [number, number, number] }>({
    pos: [0, 0, BALL_RADIUS],
    vel: [150, 420, 280],
  });

  const simCarsRef = useRef<CarData[]>([
    {
      id: 'b1',
      team: 'blue',
      pos: [-256, -3840, 27],
      vel: [0, 950, 0],
      forward: [0, 1, 0],
      right: [-1, 0, 0],
      up: [0, 0, 1],
      boost: 100,
      ground: true,
    },
    {
      id: 'o1',
      team: 'orange',
      pos: [256, 3840, 27],
      vel: [0, -950, 0],
      forward: [0, -1, 0],
      right: [1, 0, 0],
      up: [0, 0, 1],
      boost: 100,
      ground: true,
    },
  ]);

  const camRef = useRef<{ eye: number[]; look: number[] } | null>(null);

  // Initialize cars when match mode changes
  useEffect(() => {
    if (matchMode === '1v1') {
      simCarsRef.current = [
        {
          id: 'b1',
          team: 'blue',
          pos: [-256, -3840, 27],
          vel: [0, 950, 0],
          forward: [0, 1, 0],
          right: [-1, 0, 0],
          up: [0, 0, 1],
          boost: 100,
          ground: true,
        },
        {
          id: 'o1',
          team: 'orange',
          pos: [256, 3840, 27],
          vel: [0, -950, 0],
          forward: [0, -1, 0],
          right: [1, 0, 0],
          up: [0, 0, 1],
          boost: 100,
          ground: true,
        },
      ];
    } else if (matchMode === '2v2') {
      simCarsRef.current = [
        {
          id: 'b1',
          team: 'blue',
          pos: [-1000, -3200, 27],
          vel: [100, 800, 0],
          forward: [0, 1, 0],
          right: [-1, 0, 0],
          up: [0, 0, 1],
          boost: 100,
          ground: true,
        },
        {
          id: 'b2',
          team: 'blue',
          pos: [1000, -4200, 27],
          vel: [0, 600, 0],
          forward: [0, 1, 0],
          right: [-1, 0, 0],
          up: [0, 0, 1],
          boost: 80,
          ground: true,
        },
        {
          id: 'o1',
          team: 'orange',
          pos: [1000, 3200, 27],
          vel: [-100, -800, 0],
          forward: [0, -1, 0],
          right: [1, 0, 0],
          up: [0, 0, 1],
          boost: 100,
          ground: true,
        },
        {
          id: 'o2',
          team: 'orange',
          pos: [-1000, 4200, 27],
          vel: [0, -600, 0],
          forward: [0, -1, 0],
          right: [1, 0, 0],
          up: [0, 0, 1],
          boost: 80,
          ground: true,
        },
      ];
    } else if (matchMode === '3v3') {
      simCarsRef.current = [
        {
          id: 'b1',
          team: 'blue',
          pos: [-1500, -3000, 27],
          vel: [150, 850, 0],
          forward: [0, 1, 0],
          right: [-1, 0, 0],
          up: [0, 0, 1],
          boost: 100,
          ground: true,
        },
        {
          id: 'b2',
          team: 'blue',
          pos: [1500, -3000, 27],
          vel: [-150, 850, 0],
          forward: [0, 1, 0],
          right: [-1, 0, 0],
          up: [0, 0, 1],
          boost: 100,
          ground: true,
        },
        {
          id: 'b3',
          team: 'blue',
          pos: [0, -4800, 27],
          vel: [0, 500, 0],
          forward: [0, 1, 0],
          right: [-1, 0, 0],
          up: [0, 0, 1],
          boost: 65,
          ground: true,
        },
        {
          id: 'o1',
          team: 'orange',
          pos: [1500, 3000, 27],
          vel: [-150, -850, 0],
          forward: [0, -1, 0],
          right: [1, 0, 0],
          up: [0, 0, 1],
          boost: 100,
          ground: true,
        },
        {
          id: 'o2',
          team: 'orange',
          pos: [-1500, 3000, 27],
          vel: [150, -850, 0],
          forward: [0, -1, 0],
          right: [1, 0, 0],
          up: [0, 0, 1],
          boost: 100,
          ground: true,
        },
        {
          id: 'o3',
          team: 'orange',
          pos: [0, 4800, 27],
          vel: [0, -500, 0],
          forward: [0, -1, 0],
          right: [1, 0, 0],
          up: [0, 0, 1],
          boost: 65,
          ground: true,
        },
      ];
    }
  }, [matchMode]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'c' || e.key === 'C') {
        setBallCam((prev) => !prev);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setFocusCarIndex((prev) => (prev + 1) % simCarsRef.current.length);
        camRef.current = null;
      } else if (e.key === '1') {
        setFocusCarIndex(0);
        camRef.current = null;
      } else if (e.key === '2') {
        setFocusCarIndex(1);
        camRef.current = null;
      } else if (e.key === 'h' || e.key === 'H') {
        setPanelOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 3D Rendering & Authentic Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    // Vector math helpers
    const add = (a: number[], b: number[]): number[] => a.map((n, i) => n + b[i]);
    const sub = (a: number[], b: number[]): number[] => a.map((n, i) => n - b[i]);
    const mul = (a: number[], s: number): number[] => a.map((n) => n * s);
    const dot = (a: number[], b: number[]): number => a.reduce((s, n, i) => s + n * b[i], 0);
    const cross = (a: number[], b: number[]): number[] => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
    const norm = (a: number[]): number[] => {
      const d = Math.hypot(...a) || 1;
      return mul(a, 1 / d);
    };
    const lerp = (a: number[], b: number[], k: number): number[] =>
      add(mul(a, 1 - k), mul(b, k));

    const render = (now: number) => {
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      // --- Authentic Rocket League Ball Physics Step ---
      const ball = simBallRef.current;
      ball.vel[2] += GRAVITY * dt;
      ball.pos[0] += ball.vel[0] * dt;
      ball.pos[1] += ball.vel[1] * dt;
      ball.pos[2] += ball.vel[2] * dt;

      // Realistic Pitch floor collision
      if (ball.pos[2] <= BALL_RADIUS) {
        ball.pos[2] = BALL_RADIUS;
        ball.vel[2] = Math.abs(ball.vel[2]) * 0.6; // Coefficient of restitution ~0.6
        ball.vel[0] *= 0.985; // Ground rolling drag
        ball.vel[1] *= 0.985;
      }

      // Side wall bounces (Unreal units: X = +/- 4096)
      if (ball.pos[0] < -4096 + BALL_RADIUS) {
        ball.pos[0] = -4096 + BALL_RADIUS;
        ball.vel[0] = Math.abs(ball.vel[0]) * 0.72;
      } else if (ball.pos[0] > 4096 - BALL_RADIUS) {
        ball.pos[0] = 4096 - BALL_RADIUS;
        ball.vel[0] = -Math.abs(ball.vel[0]) * 0.72;
      }

      // Backboard & Goal check (Unreal units: Y = +/- 5120, Goal width = 892, height = 642)
      if (ball.pos[1] > 5120 - BALL_RADIUS) {
        if (Math.abs(ball.pos[0]) < 890 && ball.pos[2] < 640) {
          // Blue scores!
          setScore((s) => ({ ...s, blue: s.blue + 1 }));
          triggerResetKickoff();
        } else {
          // Backboard bounce
          ball.pos[1] = 5120 - BALL_RADIUS;
          ball.vel[1] = -Math.abs(ball.vel[1]) * 0.72;
        }
      } else if (ball.pos[1] < -5120 + BALL_RADIUS) {
        if (Math.abs(ball.pos[0]) < 890 && ball.pos[2] < 640) {
          // Orange scores!
          setScore((s) => ({ ...s, orange: s.orange + 1 }));
          triggerResetKickoff();
        } else {
          // Backboard bounce
          ball.pos[1] = -5120 + BALL_RADIUS;
          ball.vel[1] = Math.abs(ball.vel[1]) * 0.72;
        }
      }

      // Update Cars with Realistic Pursuit & Collision
      const cars = simCarsRef.current;
      for (const car of cars) {
        const dx = ball.pos[0] - car.pos[0];
        const dy = ball.pos[1] - car.pos[1];
        const dist = Math.hypot(dx, dy) || 1;

        // Realistic turning rate
        const targetDir = [dx / dist, dy / dist, 0];
        car.forward[0] += (targetDir[0] - car.forward[0]) * 5.0 * dt;
        car.forward[1] += (targetDir[1] - car.forward[1]) * 5.0 * dt;
        const mag = Math.hypot(car.forward[0], car.forward[1]) || 1;
        car.forward[0] /= mag;
        car.forward[1] /= mag;
        car.right = [-car.forward[1], car.forward[0], 0];

        const speed = car.boost > 10 ? 1400 : 900;
        car.pos[0] += car.forward[0] * speed * dt;
        car.pos[1] += car.forward[1] * speed * dt;
        car.vel = [car.forward[0] * speed, car.forward[1] * speed, 0];

        // Ball touch check
        const distToBall = Math.hypot(car.pos[0] - ball.pos[0], car.pos[1] - ball.pos[1], car.pos[2] - ball.pos[2]);
        if (distToBall < BALL_RADIUS + 80) {
          // Powerful car impulse on ball
          ball.vel[0] = car.forward[0] * 1800 + (Math.random() - 0.5) * 200;
          ball.vel[1] = car.forward[1] * 1800 + (Math.random() - 0.5) * 200;
          ball.vel[2] = 450 + Math.random() * 250;
        }

        // Boost usage
        if (car.boost > 5) car.boost = Math.max(0, car.boost - 12 * dt);
        else car.boost = Math.min(100, car.boost + 25 * dt);
      }

      const player = cars[focusCarIndex % cars.length] || cars[0];
      setCurrentBoost(Math.round(player.boost));

      // --- Canvas 3D Perspective Rendering ---
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = (canvas.width = rect.width * dpr);
      const h = (canvas.height = rect.height * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // Gradient background sky
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, '#0f172a');
      grd.addColorStop(0.5, '#0b1329');
      grd.addColorStop(1, '#051b24');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      const forward = norm([player.forward[0], player.forward[1], 0]);
      const dist = cameraSettings.distance;
      const ang = (cameraSettings.angle * Math.PI) / 180;

      const wantedEye = add(add(player.pos, mul(forward, -dist)), [0, 0, cameraSettings.height + 30]);
      let wantedLook = ballCam
        ? ball.pos
        : add(player.pos, mul(forward, 1700));
      wantedLook = add(wantedLook, [0, 0, ballCam ? 0 : 120 + Math.tan(ang) * 1200]);

      if (!camRef.current) {
        camRef.current = { eye: wantedEye, look: wantedLook };
      }
      const stiffness = Math.max(0.02, Math.min(1, 0.035 + (cameraSettings.stiffness / 100) * 0.23));
      camRef.current.eye = lerp(camRef.current.eye, wantedEye, stiffness);
      camRef.current.look = lerp(camRef.current.look, wantedLook, stiffness);

      const eye = camRef.current.eye;
      const look = camRef.current.look;

      let viewFwd = norm(sub(look, eye));
      if (Math.abs(dot(viewFwd, [0, 0, 1])) > 0.995) {
        viewFwd = norm(add(viewFwd, [0.02, 0, 0]));
      }
      const viewRight = norm(cross(viewFwd, [0, 0, 1]));
      const viewUp = norm(cross(viewRight, viewFwd));
      const lens = (0.5 * w) / Math.tan((cameraSettings.fov * Math.PI) / 360);

      const projected = (p: number[]): [number, number, number] | null => {
        const rel = sub(p, eye);
        const depth = dot(rel, viewFwd);
        if (depth < 15) return null;
        return [
          w / 2 + (dot(rel, viewRight) * lens) / depth,
          h * 0.55 - (dot(rel, viewUp) * lens) / depth,
          depth,
        ];
      };

      const line3 = (a: number[], b: number[], color = '#38bdf8', width = 1) => {
        const x = projected(a);
        const y = projected(b);
        if (!x || !y) return;
        ctx.beginPath();
        ctx.moveTo(x[0], x[1]);
        ctx.lineTo(y[0], y[1]);
        ctx.strokeStyle = color;
        ctx.lineWidth = width * dpr;
        ctx.stroke();
      };

      const poly = (points: number[][], fillClr: string, strokeClr?: string) => {
        const depth = (p: number[]) => dot(sub(p, eye), viewFwd);
        const clipped: number[][] = [];
        for (let i = 0; i < points.length; i++) {
          const a = points[i];
          const b = points[(i + 1) % points.length];
          const da = depth(a);
          const db = depth(b);
          const aa = da >= 15;
          const bb = db >= 15;
          if (aa) clipped.push(a);
          if (aa !== bb) {
            const t = (15 - da) / (db - da);
            clipped.push(lerp(a, b, t));
          }
        }
        if (clipped.length < 3) return;
        const x = clipped.map(projected);
        if (x.some((p) => !p)) return;

        ctx.beginPath();
        x.forEach((p, i) => (i ? ctx.lineTo(p![0], p![1]) : ctx.moveTo(p![0], p![1])));
        ctx.closePath();
        ctx.fillStyle = fillClr;
        ctx.fill();
        if (strokeClr) {
          ctx.strokeStyle = strokeClr;
          ctx.lineWidth = 1.2 * dpr;
          ctx.stroke();
        }
      };

      const goal = (y: number, color: string) => {
        const near = y > 0 ? 5120 : -5120;
        const gw = 890;
        const gh = 640;
        for (const dx of [-1, 1]) line3([dx * gw, near, 0], [dx * gw, near, gh], color, 3);
        line3([-gw, near, gh], [gw, near, gh], color, 3);
        for (const dx of [-1, 1]) {
          line3([dx * gw, near, gh], [dx * gw, near + (y > 0 ? 420 : -420), gh], color, 1.5);
        }
      };

      // Draw Pitch Turf
      poly(
        [
          [-4096, -5120, 0],
          [4096, -5120, 0],
          [4096, 5120, 0],
          [-4096, 5120, 0],
        ],
        '#062326'
      );

      // Pitch lines
      for (let px = -4000; px <= 4000; px += 1000) line3([px, -5120, 5], [px, 5120, 5], '#0e4147', 1);
      for (let py = -5000; py <= 5000; py += 1000) line3([-4096, py, 5], [4096, py, 5], '#0e4147', 1);
      for (const px of [-4096, 4096]) line3([px, -5120, 12], [px, 5120, 12], '#38bdf8', 2);
      for (const py of [-5120, 5120]) line3([-4096, py, 12], [4096, py, 12], '#38bdf8', 2);

      // Midfield line and center circle
      line3([-4096, 0, 8], [4096, 0, 8], '#00e5ff', 2);
      let last = [1000, 0, 8];
      for (let a = 0.15; a <= Math.PI * 2 + 0.15; a += 0.15) {
        const cur = [1000 * Math.cos(a), 1000 * Math.sin(a), 8];
        line3(last, cur, '#00e5ff', 1.5);
        last = cur;
      }

      // Boost Pads
      const padLocations = [
        [-3072, -4096],
        [3072, -4096],
        [-3584, 0],
        [3584, 0],
        [-3072, 4096],
        [3072, 4096],
      ];
      padLocations.forEach(([px, py]) => {
        const pr = projected([px, py, 4]);
        if (pr) {
          ctx.beginPath();
          ctx.arc(pr[0], pr[1], 8 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2 * dpr;
          ctx.stroke();
        }
      });

      // Goals
      goal(-1, '#38bdf8');
      goal(1, '#f97316');

      // Draw Cars
      const drawCar = (car: CarData, clr: string) => {
        const cp = car.pos;
        const carFwd = norm(car.forward);
        const carRight = norm(car.right || [-carFwd[1], carFwd[0], 0]);
        const carUp = norm(car.up || [0, 0, 1]);
        const v = (x: number, y: number, z: number) =>
          add(add(add(cp, mul(carFwd, x)), mul(carRight, y)), mul(carUp, z));

        const dark = '#111827';
        const trim = '#475569';
        const glass = '#1e293b';

        // Wheels
        for (const x of [-78, 72]) {
          for (const side of [-1, 1]) {
            const wy = side * 63;
            poly(
              [v(x - 28, wy, 4), v(x + 28, wy, 4), v(x + 30, wy, 46), v(x - 30, wy, 46)],
              '#090d16',
              '#1e293b'
            );
            poly(
              [
                v(x - 15, wy + side * 3, 13),
                v(x + 15, wy + side * 3, 13),
                v(x + 16, wy + side * 3, 37),
                v(x - 16, wy + side * 3, 37),
              ],
              '#94a3b8',
              '#334155'
            );
          }
        }

        // Body chassis
        const A = v(-112, -54, 18);
        const B = v(111, -54, 18);
        const C = v(111, 54, 18);
        const D = v(-112, 54, 18);
        const E = v(-96, -54, 60);
        const F = v(91, -54, 60);
        const G = v(91, 54, 60);
        const H = v(-96, 54, 60);

        poly([A, B, F, E], clr, '#0f172a');
        poly([D, C, G, H], clr, '#0f172a');
        poly([A, B, C, D], dark);
        poly([E, F, G, H], clr, '#334155');
        poly([B, C, G, F], clr, '#1e293b');

        // Cabin
        const c1 = v(-56, -43, 66);
        const c2 = v(39, -43, 66);
        const c3 = v(39, 43, 66);
        const c4 = v(-56, 43, 66);
        const r1 = v(-38, -37, 112);
        const r2 = v(10, -37, 112);
        const r3 = v(10, 37, 112);
        const r4 = v(-38, 37, 112);

        poly([c1, c2, r2, r1], glass, trim);
        poly([c4, c3, r3, r4], glass);
        poly([r1, r2, r3, r4], clr, '#64748b');
        poly([c2, c3, r3, r2], glass, '#334155');
        poly([c1, c4, r4, r1], glass, '#334155');

        // Spoiler
        line3(v(-119, -52, 85), v(-119, 52, 85), trim, 3);
      };

      // Draw Ball with Authentic Shadow & Shading
      const drawBall = (bp: [number, number, number]) => {
        const bpProjected = projected(bp);
        if (!bpProjected) return;
        const rad = Math.max(
          4,
          Math.min(110, ((cameraSettings.fov < 80 ? 60000 : 48000) / (bpProjected[2] + 200)) * dpr)
        );

        // Ground shadow based on Z height
        const shadowP = projected([bp[0], bp[1], 2]);
        if (shadowP) {
          const shadowAlpha = Math.max(0.1, 0.5 - bp[2] / 2000);
          ctx.beginPath();
          ctx.ellipse(shadowP[0], shadowP[1], rad * 1.3, rad * 0.7, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
          ctx.fill();
        }

        // Ball sphere
        ctx.beginPath();
        ctx.arc(bpProjected[0], bpProjected[1], rad, 0, Math.PI * 2);
        const ballGrad = ctx.createRadialGradient(
          bpProjected[0] - rad * 0.3,
          bpProjected[1] - rad * 0.3,
          rad * 0.1,
          bpProjected[0],
          bpProjected[1],
          rad
        );
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.4, '#e2e8f0');
        ballGrad.addColorStop(0.8, '#94a3b8');
        ballGrad.addColorStop(1, '#475569');
        ctx.fillStyle = ballGrad;
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5 * dpr;
        ctx.stroke();
      };

      // Sort cars by depth
      const sortedCars = [...cars].sort((a, b) => {
        const ap = projected(a.pos);
        const bp = projected(b.pos);
        return (bp?.[2] || 0) - (ap?.[2] || 0);
      });

      for (const car of sortedCars) {
        drawCar(car, car.team === 'blue' ? '#0284c7' : '#ea580c');
      }

      drawBall(ball.pos);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [ballCam, focusCarIndex, cameraSettings]);

  const triggerResetKickoff = () => {
    simBallRef.current = {
      pos: [0, 0, BALL_RADIUS],
      vel: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 80, 0],
    };
    if (matchMode === '1v1') {
      simCarsRef.current[0].pos = [-256, -3840, 27];
      simCarsRef.current[0].boost = 100;
      simCarsRef.current[1].pos = [256, 3840, 27];
      simCarsRef.current[1].boost = 100;
    }
  };

  const triggerSpeedflipKickoff = () => {
    simBallRef.current = { pos: [0, 0, BALL_RADIUS], vel: [0, 0, 0] };
    // Spawn blue car at diagonal kickoff
    simCarsRef.current[0].pos = [-2048, -2560, 27];
    simCarsRef.current[0].vel = [800, 1950, 40];
    simCarsRef.current[0].forward = [0.38, 0.92, 0];
    simCarsRef.current[0].boost = 90;

    // Spawn orange car at opponent diagonal
    simCarsRef.current[1].pos = [2048, 2560, 27];
    simCarsRef.current[1].vel = [-700, -1700, 100]; // Orange flies too high (the flaw your friend noticed!)
    simCarsRef.current[1].forward = [-0.38, -0.92, 0];
    simCarsRef.current[1].boost = 80;
  };

  return (
    <div className="relative w-full h-[720px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none">
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Top Banner: RLViser Direct Recommendation */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-500/30 text-xs shadow-lg">
        <Monitor className="w-4 h-4 text-emerald-400" />
        <span className="text-slate-300 font-medium">For 144+ FPS C++ Bullet Physics:</span>
        <span className="text-emerald-400 font-bold font-mono">Use RLViser tab (UDP 45243)</span>
      </div>

      {/* Match Mode Switcher (1v1, 2v2, 3v3) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-5 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-sky-400 font-display">BLUE {score.blue}</span>
          <span className="text-slate-500 font-bold">:</span>
          <span className="text-xs font-bold text-orange-400 font-display">{score.orange} ORANGE</span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-1 text-xs">
          {(['1v1', '2v2', '3v3'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMatchMode(m);
                setFocusCarIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                matchMode === m ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Boost Gauge HUD */}
      <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/70 shadow-2xl">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-950 border border-slate-800">
          <svg className="w-16 h-16 -rotate-90">
            <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="5" fill="none" />
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="#f59e0b"
              strokeWidth="5"
              fill="none"
              strokeDasharray={163.3}
              strokeDashoffset={163.3 - (163.3 * currentBoost) / 100}
              className="transition-all duration-150"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-lg font-display font-bold text-amber-400 leading-none">{currentBoost}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded tracking-wide ${
                ballCam ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {ballCam ? 'BALL CAM ON' : 'CAR CAM'}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded tracking-wide bg-cyan-500/20 text-cyan-300">
              {matchMode} ARENA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Car #{focusCarIndex + 1} ({simCarsRef.current[focusCarIndex]?.team.toUpperCase()}) · G = -650 uu/s²
          </p>
        </div>
      </div>

      {/* Interactive Action Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-xl">
        <button
          onClick={triggerSpeedflipKickoff}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" /> Speedflip Drill
        </button>
        <button
          onClick={triggerResetKickoff}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Center Kickoff
        </button>
        <button
          onClick={() => {
            setScore({ blue: 0, orange: 0 });
            triggerResetKickoff();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition"
        >
          Reset Score
        </button>
      </div>

      {/* Camera Toggle Button */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="absolute top-4 right-5 flex items-center gap-2 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold shadow-lg transition"
      >
        <Camera className="w-4 h-4 text-cyan-400" />
        {panelOpen ? 'Hide Camera ⚙' : 'Camera ⚙'}
      </button>

      {/* Camera Controls Drawer */}
      {panelOpen && (
        <div className="absolute top-16 right-5 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-5 shadow-2xl z-20 text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Camera Controls</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">RocketSim</span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            <button
              onClick={() => setBallCam(!ballCam)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                ballCam
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Ball Cam (C)
            </button>
            <button
              onClick={() => {
                setFocusCarIndex((prev) => (prev + 1) % simCarsRef.current.length);
                camRef.current = null;
              }}
              className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition"
            >
              Next Car (Tab)
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Distance</span>
                <span className="font-mono text-cyan-400">{cameraSettings.distance} uu</span>
              </div>
              <input
                type="range"
                min="180"
                max="600"
                step="5"
                value={cameraSettings.distance}
                onChange={(e) =>
                  setCameraSettings({ ...cameraSettings, distance: Number(e.target.value) })
                }
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Height</span>
                <span className="font-mono text-cyan-400">{cameraSettings.height} uu</span>
              </div>
              <input
                type="range"
                min="40"
                max="250"
                step="5"
                value={cameraSettings.height}
                onChange={(e) =>
                  setCameraSettings({ ...cameraSettings, height: Number(e.target.value) })
                }
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Pitch Angle</span>
                <span className="font-mono text-cyan-400">{cameraSettings.angle}°</span>
              </div>
              <input
                type="range"
                min="-15"
                max="5"
                step="1"
                value={cameraSettings.angle}
                onChange={(e) =>
                  setCameraSettings({ ...cameraSettings, angle: Number(e.target.value) })
                }
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>FOV</span>
                <span className="font-mono text-cyan-400">{cameraSettings.fov}°</span>
              </div>
              <input
                type="range"
                min="60"
                max="115"
                step="1"
                value={cameraSettings.fov}
                onChange={(e) =>
                  setCameraSettings({ ...cameraSettings, fov: Number(e.target.value) })
                }
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Stiffness</span>
                <span className="font-mono text-cyan-400">{cameraSettings.stiffness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={cameraSettings.stiffness}
                onChange={(e) =>
                  setCameraSettings({ ...cameraSettings, stiffness: Number(e.target.value) })
                }
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
