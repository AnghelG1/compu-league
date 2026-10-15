import React, { useState, useEffect } from 'react';
import { Trophy, ArrowRight, Clock, Swords, Zap } from 'lucide-react';
import { CONTACT_INFO } from '../data/tournamentData';

// ─── Countdown helpers ────────────────────────────────────────────────────────
function calcTimeLeft() {
  const deadline = new Date(CONTACT_INFO.deadlineIso).getTime();
  const diff = deadline - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
    isExpired: false,
  };
}

// ─── Tiny clock digit block ────────────────────────────────────────────────────
function ClockCell({ value, label, accent = false }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center"
        style={{
          background: accent ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${accent ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.08)'}`,
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        }}
      >
        <span
          className={`text-2xl sm:text-3xl font-black font-display tracking-tight tabular-nums ${accent ? 'text-amber-400' : 'text-white'}`}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-widest text-slate-500 mt-1">
        {label}
      </span>
    </div>
  );
}

// ─── Game logo SVGs inline ─────────────────────────────────────────────────────
const GAME_LOGOS = {
  valorant: (
    <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M4 10 L25 40 L46 10" stroke="#ff4655" strokeWidth="5" strokeLinecap="square" fill="none"/>
      <path d="M4 10 L25 26 L46 10" stroke="white" strokeWidth="2" strokeLinecap="square" fill="none" opacity="0.6"/>
    </svg>
  ),
  free_fire: (
    <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M25 5 C25 5 15 18 18 27 C14 24 14 24 13 20 C8 28 12 38 22 43 C19 40 19 36 21 33 C22 37 26 40 28 43 C34 38 38 30 35 22 C38 26 39 30 38 34 C44 25 40 12 25 5Z" fill="#f59e0b"/>
    </svg>
  ),
  fortnite: (
    <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M12 8 H38 V14 H28 V20 H36 V26 H28 V42 H20 V26 H12 V8Z" fill="white"/>
      <path d="M20 14 H28 V20 H20 Z" fill="#0ea5e9"/>
    </svg>
  ),
  clash_royale: (
    <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M25 6 L30 16 L42 18 L33 27 L35 39 L25 34 L15 39 L17 27 L8 18 L20 16 Z" fill="#8b5cf6" stroke="#c4b5fd" strokeWidth="1.5"/>
      <path d="M25 12 L28.5 19 L36.5 20.5 L30.5 26 L32 34 L25 30.5 L18 34 L19.5 26 L13.5 20.5 L21.5 19 Z" fill="#a78bfa"/>
    </svg>
  ),
};

const MINI_GAMES = [
  { id: 'valorant',     label: 'VALORANT',     color: '#ff4655', colorMuted: 'rgba(255,70,85,0.15)',  border: 'rgba(255,70,85,0.4)'  },
  { id: 'free_fire',   label: 'FREE FIRE',    color: '#f59e0b', colorMuted: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' },
  { id: 'fortnite',    label: 'FORTNITE',     color: '#0ea5e9', colorMuted: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.4)' },
  { id: 'clash_royale',label: 'CLASH ROYALE', color: '#8b5cf6', colorMuted: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)' },
];

// ─── Main component ────────────────────────────────────────────────────────────
export default function MainEsportsHero({ onOpenRegister, onScrollToGames }) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative overflow-hidden text-slate-100 font-sans select-none"
      style={{ background: '#0B0E14' }}
    >
      {/* ── Ambient glow blobs ──────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left amber glow */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }}
        />
        {/* Bottom-right cool glow */}
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent 70%)' }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── News Ticker ─────────────────────────────────────────────── */}
      <div
        className="relative z-20 w-full overflow-hidden border-b border-white/10"
        style={{ background: '#080B10' }}
      >
        <div className="flex items-center">
          {/* Static label */}
          <div
            className="shrink-0 px-4 py-2 font-display font-black text-xs uppercase tracking-widest text-slate-950 z-10"
            style={{
              background: '#f59e0b',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',
              paddingRight: '24px',
            }}
          >
            LIVE
          </div>
          {/* Scrolling text */}
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-12 py-2 pl-6 font-display font-bold text-xs sm:text-sm">
              <span className="text-amber-400 flex items-center gap-2"><Trophy className="w-3.5 h-3.5 fill-amber-400 inline" /> COMPU LEAGUE E-SPORTS 2026</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">4, 5 Y 6 DE NOVIEMBRE</span>
              <span className="text-slate-400">•</span>
              <span className="text-rose-400">VALORANT 5v5</span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-400">FREE FIRE ESCUADRAS</span>
              <span className="text-slate-400">•</span>
              <span className="text-sky-400">FORTNITE DÚOS</span>
              <span className="text-slate-400">•</span>
              <span className="text-purple-400">CLASH ROYALE 1v1</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-400 font-black">PREMIOS EN EFECTIVO + TROFEO OFICIAL</span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-300 font-black">INSCRIPCIONES ABIERTAS</span>
              <span className="text-slate-400">•</span>
              {/* second copy for seamless loop */}
              <span className="text-amber-400 flex items-center gap-2"><Trophy className="w-3.5 h-3.5 fill-amber-400 inline" /> COMPU LEAGUE E-SPORTS 2026</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">4, 5 Y 6 DE NOVIEMBRE</span>
              <span className="text-slate-400">•</span>
              <span className="text-rose-400">VALORANT 5v5</span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-400">FREE FIRE ESCUADRAS</span>
              <span className="text-slate-400">•</span>
              <span className="text-sky-400">FORTNITE DÚOS</span>
              <span className="text-slate-400">•</span>
              <span className="text-purple-400">CLASH ROYALE 1v1</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-400 font-black">PREMIOS EN EFECTIVO + TROFEO OFICIAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Hero ───────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-center">

          {/* ══════════════════════════════════════
              LEFT COLUMN — TITLE, PRIZES, CTA, CLOCK
              ══════════════════════════════════════ */}
          <div className="flex flex-col items-start gap-6">

            {/* Skewed asymmetric badge */}
            <div className="flex items-center gap-0 overflow-hidden">
              <div
                className="flex items-center gap-2 px-4 py-1.5 font-display font-black text-xs uppercase tracking-widest text-slate-950"
                style={{
                  background: '#f59e0b',
                  transform: 'skewX(-12deg)',
                  transformOrigin: 'left center',
                }}
              >
                <span className="block" style={{ transform: 'skewX(12deg)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 inline-block animate-ping mr-1" />
                  Torneo Oficial UPEC
                </span>
              </div>
              <div
                className="px-3 py-1.5 font-display font-bold text-xs uppercase tracking-widest text-amber-300"
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  transform: 'skewX(-12deg)',
                  transformOrigin: 'left center',
                  marginLeft: '2px',
                }}
              >
                <span className="block" style={{ transform: 'skewX(12deg)' }}>Inscripciones Abiertas</span>
              </div>
            </div>

            {/* Giant italic title + watermark */}
            <div className="relative">
              {/* "2026" watermark behind */}
              <span
                className="absolute -top-4 -left-2 font-black font-display select-none pointer-events-none leading-none"
                style={{
                  fontSize: 'clamp(80px, 18vw, 180px)',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(245,158,11,0.08)',
                  zIndex: 0,
                  letterSpacing: '-0.02em',
                }}
                aria-hidden="true"
              >
                2026
              </span>

              {/* Main heading */}
              <div className="relative z-10">
                <h1
                  className="font-black font-display uppercase leading-none tracking-tight text-white"
                  style={{
                    fontSize: 'clamp(52px, 9vw, 110px)',
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em',
                    textShadow: '0 4px 40px rgba(0,0,0,0.8)',
                  }}
                >
                  COMPU
                </h1>
                <h1
                  className="font-black font-display uppercase leading-none tracking-tight"
                  style={{
                    fontSize: 'clamp(52px, 9vw, 110px)',
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(90deg, #f59e0b, #fcd34d, #f59e0b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: 'none',
                  }}
                >
                  LEAGUE
                </h1>
                <div
                  className="font-black font-display uppercase leading-none tracking-widest text-slate-300"
                  style={{ fontSize: 'clamp(18px, 3vw, 38px)', fontStyle: 'italic', letterSpacing: '0.2em' }}
                >
                  E-SPORTS 2026
                </div>
              </div>
            </div>

            {/* Prize pool — the hook */}
            <div
              className="flex items-center gap-4 px-5 py-3 w-full sm:w-auto"
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              }}
            >
              <Trophy className="w-8 h-8 text-amber-400 fill-amber-400/20 shrink-0" />
              <div>
                <div className="text-[10px] font-display font-black uppercase tracking-widest text-amber-500">
                  Pozo de Premios
                </div>
                <div
                  className="font-black font-display text-white leading-tight"
                  style={{ fontSize: 'clamp(22px, 4vw, 42px)' }}
                >
                  EFECTIVO <span className="text-amber-400">+</span> TROFEO
                </div>
                <div className="text-xs text-slate-400 font-sans">Premios independientes por juego · Medallas de honor</div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onOpenRegister('valorant')}
                className="group flex items-center justify-center gap-2.5 px-7 py-4 font-display font-black text-base uppercase tracking-wider text-slate-950 transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-95"
                style={{
                  background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  boxShadow: '0 0 30px rgba(245,158,11,0.4)',
                }}
              >
                <Trophy className="w-5 h-5 fill-slate-950 shrink-0" />
                <span>INSCRIBIRME AHORA</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onScrollToGames}
                className="flex items-center justify-center gap-2 px-6 py-4 font-display font-bold text-sm uppercase tracking-wider text-slate-300 hover:text-white transition-all duration-200 cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                }}
              >
                <Swords className="w-4 h-4 text-amber-400" />
                <span>VER REGLAS Y FORMATOS</span>
              </button>
            </div>

            {/* Countdown */}
            <div className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-500">
                  Cierre de Inscripciones — {CONTACT_INFO.deadlineLabel}
                </span>
              </div>
              <div className="flex items-end gap-3">
                <ClockCell value={timeLeft.days}    label="Días"    />
                <span className="text-2xl font-black text-slate-600 mb-4 leading-none">:</span>
                <ClockCell value={timeLeft.hours}   label="Horas"   />
                <span className="text-2xl font-black text-slate-600 mb-4 leading-none">:</span>
                <ClockCell value={timeLeft.minutes} label="Min"     />
                <span className="text-2xl font-black text-slate-600 mb-4 leading-none">:</span>
                <ClockCell value={timeLeft.seconds} label="Seg"     accent />
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════
              RIGHT COLUMN — MASCOT + GAME BADGES
              ══════════════════════════════════════ */}
          <div className="relative flex flex-col items-center lg:items-end gap-6">

            {/* Mascot */}
            <div className="relative w-full max-w-xs lg:max-w-none">
              {/* Glow behind mascot */}
              <div
                className="absolute inset-0 rounded-full blur-[60px] opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
              />
              <img
                src="/assets/buho_hd.png"
                alt="Compu League Mascot"
                className="relative z-10 w-full max-w-[260px] sm:max-w-[300px] lg:max-w-full mx-auto lg:mx-0 drop-shadow-[0_20px_60px_rgba(245,158,11,0.25)]"
                style={{ filter: 'drop-shadow(0 0 40px rgba(245,158,11,0.3))' }}
              />
            </div>

            {/* Game badges (2×2 grid) */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs lg:max-w-[280px]">
              {MINI_GAMES.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-2 px-3 py-2"
                  style={{
                    background: g.colorMuted,
                    border: `1px solid ${g.border}`,
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  }}
                >
                  <div className="w-6 h-6 shrink-0">
                    {GAME_LOGOS[g.id]}
                  </div>
                  <span
                    className="font-display font-black text-[10px] uppercase tracking-wider leading-tight"
                    style={{ color: g.color }}
                  >
                    {g.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tournament dates badge */}
            <div
              className="flex items-center gap-2 px-4 py-2 self-start lg:self-auto"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
              }}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-300">
                4, 5 y 6 de Noviembre 2026
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom separator line */}
      <div className="relative h-px w-full">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }} />
      </div>
    </section>
  );
}
