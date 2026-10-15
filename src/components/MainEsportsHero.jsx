import React, { useState, useEffect } from 'react';
import { 
  Trophy, ArrowRight, Clock, Calendar, Sparkles
} from 'lucide-react';
import { CONTACT_INFO } from '../data/tournamentData';

export default function MainEsportsHero({ 
  playerName, 
  onOpenRegister, 
  onSelectGame,
  onScrollToBrackets, 
  onScrollToGames 
}) {
  // Countdown Timer hasta el cierre de inscripciones (deadlineIso)
  const [timeLeft, setTimeLeft] = useState(() => {
    const deadline = new Date(CONTACT_INFO.deadlineIso).getTime();
    const now = new Date().getTime();
    const diff = deadline - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false,
    };
  });

  useEffect(() => {
    const updateCountdown = () => {
      const deadline = new Date(CONTACT_INFO.deadlineIso).getTime();
      const now = new Date().getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden esports-arena-bg text-slate-100 font-['Press_Start_2P',monospace] py-2 sm:py-4 select-none border-b-4 border-[#334a73] min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
      
      {/* 1. Perspective 3D Arena Grid Floor */}
      <div className="arena-perspective-grid" />

      {/* 2. Soft CRT Arcade Scanline Overlay */}
      <div className="absolute inset-0 crt-scanlines opacity-30 pointer-events-none" />

      {/* 3. Deep Theatrical Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_20%,rgba(3,6,14,0.75)_100%)] pointer-events-none" />

      {/* 4. Decorative Cyber Tactical Crosses & Pixel Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <span className="absolute top-8 left-8 text-[9px] text-sky-500/20 font-mono animate-arena-star">
          + 01.SYS.ONLINE
        </span>
        <span className="absolute top-16 right-10 text-[9px] text-yellow-300/15 font-mono animate-arena-star" style={{ animationDelay: '1.2s' }}>
          ✦ ARENA_2026
        </span>
        <span className="absolute bottom-16 left-12 text-[9px] text-sky-400/15 font-mono animate-arena-star" style={{ animationDelay: '2s' }}>
          + LATAM_NORTH
        </span>
        <span className="absolute bottom-20 right-12 text-[9px] text-indigo-400/20 font-mono animate-arena-star" style={{ animationDelay: '0.8s' }}>
          ✦ TOURNAMENT_READY
        </span>
      </div>

      {/* ========================================================= */}
      {/* 1. INFINITE RETRO TICKER (COMPACT MARQUEE)                */}
      {/* ========================================================= */}
      <div className="w-full bg-[#16243e] text-slate-200 font-['Press_Start_2P',monospace] py-1.5 text-[8px] sm:text-[9px] overflow-hidden select-none border-y-2 border-[#334a73] mb-2 sm:mb-3 shadow-inner">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          <span className="text-yellow-300">★ COMPU LEAGUE E-SPORTS 2026 ★</span>
          <span className="text-slate-300">TORNEO OFICIAL E-SPORTS 2026 ★</span>
          <span className="text-sky-300">4, 5 Y 6 DE NOVIEMBRE ★</span>
          <span>VALORANT • FREE FIRE • FORTNITE • CLASH ROYALE ★</span>
          <span className="text-yellow-300">INSCRIPCIONES ABIERTAS ★</span>
          <span className="text-yellow-300">★ COMPU LEAGUE E-SPORTS 2026 ★</span>
          <span className="text-slate-300">TORNEO OFICIAL E-SPORTS 2026 ★</span>
          <span className="text-sky-300">4, 5 Y 6 DE NOVIEMBRE ★</span>
          <span>VALORANT • FREE FIRE • FORTNITE • CLASH ROYALE ★</span>
          <span className="text-yellow-300">INSCRIPCIONES ABIERTAS ★</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        
        {/* ======================================================= */}
        {/* 2. PLAYER STATS HUD (RETRO ARCADE PLAYER CARD)          */}
        {/* ======================================================= */}
        <div className="mb-2 sm:mb-3 px-3 py-2 sm:px-4 sm:py-2.5 border-2 border-[#476799] bg-[#121c2e] flex items-center justify-between gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.35)] relative overflow-hidden">
          
          {/* Ambient subtle cyber gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/[0.04] via-transparent to-sky-400/[0.04] pointer-events-none" />

          {/* Left: Player Avatar, Name & RPG Stats */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 relative z-10">
            {/* Pixel Avatar Badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-yellow-300 bg-[#253961] flex items-center justify-center shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
              <img 
                src="/assets/buho_pixel_start.png" 
                alt="Avatar" 
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Name, LV and HP Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3.5">
              <span className="text-white font-['Silkscreen',monospace] font-bold text-xs sm:text-sm tracking-wider drop-shadow-[0_2px_0_#070b14]">
                {playerName ? playerName.toUpperCase() : 'JUGADOR 1'}
              </span>

              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* LV Badge */}
                <span className="px-1.5 py-0.5 border border-yellow-300/80 bg-yellow-300/20 text-yellow-300 text-[8px] sm:text-[9px] font-bold tracking-widest font-['Press_Start_2P',monospace]">
                  LV 20
                </span>

                {/* Retro Undertale HP Health Bar */}
                <div className="flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px]">
                  <span className="text-red-400 font-bold tracking-wider">HP</span>
                  <div className="w-14 sm:w-20 h-2.5 bg-red-950 border border-red-500/60 p-[1px] shadow-inner">
                    <div className="w-full h-full bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.7)]" />
                  </div>
                  <span className="text-yellow-300 font-bold tabular-nums">99/99</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Online Battle Status Radar */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 border border-[#3b5585] bg-[#1a2742] text-[8px] sm:text-[9px] relative z-10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[#a5badb] font-mono">* ESTADO:</span>
            <span className="text-emerald-400 font-bold tracking-wider">LISTO PARA LA BATALLA</span>
          </div>

        </div>

        {/* ======================================================= */}
        {/* 3. UNIFIED HERO & COUNTDOWN ENCOUNTER BLOCK             */}
        {/* ======================================================= */}
        <div className="border-4 border-[#364e78] bg-[#1d2d4c] p-4 sm:p-5 lg:p-6 relative shadow-[0_4px_24px_rgba(0,0,0,0.35)] space-y-2.5 sm:space-y-3.5">
          

          {/* Main Title: COMPU LEAGUE (Silkscreen) */}
          <div className="space-y-1 sm:space-y-1.5 text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl text-white font-['Silkscreen',monospace] font-bold tracking-wider leading-none drop-shadow-[0_3px_0_#070b14]">
              COMPU LEAGUE
            </h1>
            
            <div className="text-xs sm:text-base lg:text-lg text-yellow-300 font-['Press_Start_2P',monospace] tracking-wider">
              E-SPORTS 2026
            </div>

            {/* Intel / Announcement Dialogue Block (Clear retro arcade window) */}
            <div className="border-2 sm:border-4 border-[#476799] bg-[#121c2e] text-left shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Header tab */}
              <div className="px-3 py-1.5 bg-[#253961] border-b-2 border-[#476799] flex items-center justify-between text-[8px] sm:text-[9px] text-yellow-300 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Sparkles className="w-3 h-3 text-yellow-300 shrink-0" />
                  <span>* INTEL OFICIAL DE LA ARENA</span>
                </div>
                <span className="text-sky-300 text-[8px] font-mono">
                  [ SYS.ONLINE ]
                </span>
              </div>

              {/* Bullet points */}
              <div className="p-2.5 sm:p-3 space-y-1.5 font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px] leading-relaxed">
                <div className="flex items-start gap-2 text-white">
                  <span className="text-yellow-300 shrink-0 select-none">►</span>
                  <p className="leading-relaxed">
                    El campeonato oficial de videojuegos de Compu League E-Sports 2026.
                  </p>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <span className="text-yellow-300 shrink-0 select-none">►</span>
                  <p className="leading-relaxed">
                    4 videojuegos legendarios en la arena: Valorant, Free Fire, Fortnite y Clash Royale.
                  </p>
                </div>
                <div className="flex items-start gap-2 text-sky-300 pt-1 border-t border-[#253961]">
                  <span className="text-sky-400 shrink-0 select-none">★</span>
                  <p className="leading-relaxed font-bold">
                    Inscribe a tu equipo y demuestra tu nivel en la arena de combate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN DE CUENTA REGRESIVA INTEGRADA */}
          <div className="pt-1">
            {/* Header del Contador */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-1.5 border-b-2 border-[#2f4469]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-yellow-300 bg-[#253961] flex items-center justify-center text-yellow-300 shrink-0">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div>
                  <div className="text-[8px] sm:text-[9px] text-yellow-300 uppercase tracking-widest font-['Press_Start_2P',monospace]">
                    * CUENTA REGRESIVA OFICIAL
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase text-white font-['Silkscreen',monospace] tracking-wider">
                    CIERRE DE INSCRIPCIONES
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 border border-[#384f79] bg-[#16233b] text-[8px] sm:text-[9px] text-[#a5badb] font-mono">
                <Calendar className="w-3 h-3 text-sky-400 shrink-0" />
                <span>LÍMITE: {CONTACT_INFO.deadlineLabel.toUpperCase()} (23:59:59)</span>
              </div>
            </div>

            {/* Grid del Contador Grande (DÍAS, HORAS, MINUTOS, SEGUNDOS) */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 my-2">
              
              {/* DÍAS */}
              <div className="p-2 sm:p-3 border-2 border-[#334a73] bg-[#16233b] hover:border-[#4f6f9f] transition-colors text-center flex flex-col justify-center items-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-300 font-['Silkscreen',monospace] tracking-wider drop-shadow-[0_2px_0_#000] tabular-nums">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[9px] text-[#a5badb] uppercase tracking-wider font-mono mt-0.5 font-bold">
                  DÍAS
                </span>
              </div>

              {/* HORAS */}
              <div className="p-2 sm:p-3 border-2 border-[#334a73] bg-[#16233b] hover:border-[#4f6f9f] transition-colors text-center flex flex-col justify-center items-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Silkscreen',monospace] tracking-wider drop-shadow-[0_2px_0_#000] tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[9px] text-[#a5badb] uppercase tracking-wider font-mono mt-0.5 font-bold">
                  HORAS
                </span>
              </div>

              {/* MINUTOS */}
              <div className="p-2 sm:p-3 border-2 border-[#334a73] bg-[#16233b] hover:border-[#4f6f9f] transition-colors text-center flex flex-col justify-center items-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Silkscreen',monospace] tracking-wider drop-shadow-[0_2px_0_#000] tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[9px] text-[#a5badb] uppercase tracking-wider font-mono mt-0.5 font-bold">
                  MINUTOS
                </span>
              </div>

              {/* SEGUNDOS */}
              <div className="p-2 sm:p-3 border-2 border-[#334a73] bg-[#16233b] hover:border-yellow-300 transition-colors text-center flex flex-col justify-center items-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-300 font-['Silkscreen',monospace] tracking-wider drop-shadow-[0_2px_0_#000] tabular-nums animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-[9px] text-yellow-400 uppercase tracking-wider font-mono mt-0.5 font-bold">
                  SEGUNDOS
                </span>
              </div>

            </div>
          </div>

          {/* BOTÓN CENTRADO: INSCRIBIR A MI EQUIPO */}
          <div className="pt-2.5 sm:pt-3.5 border-t-2 border-[#2f4469] flex items-center justify-center">
            <button
              type="button"
              onClick={() => onOpenRegister('valorant')}
              className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-3.5 border-2 border-yellow-300 bg-yellow-300 hover:bg-white text-black text-[10px] sm:text-xs font-['Press_Start_2P',monospace] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.3)] whitespace-nowrap text-center"
            >
              <span className="whitespace-nowrap">[ INSCRIBIR A MI EQUIPO ]</span>
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}
