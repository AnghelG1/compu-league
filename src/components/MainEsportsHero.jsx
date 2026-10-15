import React, { useState, useEffect } from 'react';
import { Coins, ArrowRight, Clock, Swords, Zap, Terminal, ShieldAlert } from 'lucide-react';
import { CONTACT_INFO } from '../data/tournamentData';

// ─── Countdown calculation ───────────────────────────────────────────────────
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

export default function MainEsportsHero({ playerName = '', onOpenRegister, onScrollToGames }) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  const challengerName = (playerName && playerName.trim())
    || (typeof window !== 'undefined' ? localStorage.getItem('compu_league_gamertag') : '')
    || 'MECHA-BUHO';

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const arcadeSlots = [
    { id: 'valorant',     name: 'VALORANT',     color: '#FF4655', border: 'border-[#FF4655]', shadow: 'shadow-[3px_3px_0px_#FF4655]' },
    { id: 'free_fire',   name: 'FREE FIRE',    color: '#FFE600', border: 'border-[#FFE600]', shadow: 'shadow-[3px_3px_0px_#FFE600]' },
    { id: 'fortnite',    name: 'FORTNITE',     color: '#00F0FF', border: 'border-[#00F0FF]', shadow: 'shadow-[3px_3px_0px_#00F0FF]' },
    { id: 'clash_royale',name: 'CLASH ROYALE', color: '#C084FC', border: 'border-[#C084FC]', shadow: 'shadow-[3px_3px_0px_#C084FC]' },
  ];

  return (
    <section className="relative bg-[#07090E] text-slate-100 font-sans select-none border-b-4 border-black overflow-hidden">
      
      {/* ── Retro CRT Scanlines Texture for entire hero atmosphere ──────── */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 3px)',
          }}
        />
      </div>

      {/* ── Neo-Brutalist Grid Background ───────────────────────────────── */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ========================================================= */}
      {/* 1. TOP ARCADE MARQUEE TICKER (80s CONSOLE STYLE)          */}
      {/* ========================================================= */}
      <div className="w-full bg-[#FFE600] text-black font-pixel py-2.5 text-[10px] sm:text-xs overflow-hidden select-none border-b-2 border-black relative z-20">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6 font-black">
          <span className="bg-black text-[#FFE600] px-2.5 py-0.5">VALORANT 5v5</span>
          <span className="tracking-wider">★ INSCRIPCIONES ABIERTAS ★</span>
          
          <span className="bg-black text-[#FFE600] px-2.5 py-0.5">FREE FIRE ESCUADRAS</span>
          <span className="tracking-wider">★ 4, 5 Y 6 DE NOVIEMBRE ★</span>
          
          <span className="bg-black text-[#FFE600] px-2.5 py-0.5">FORTNITE DUOS</span>
          <span className="bg-[#FF0055] text-white px-2 py-0.5 animate-arcade-blink">PREMIOS EN EFECTIVO</span>
          
          <span className="bg-black text-[#FFE600] px-2.5 py-0.5">CLASH ROYALE 1v1</span>
          <span className="tracking-wider">★ INSCRIPCION: $1 POR JUGADOR ★</span>

          <span className="bg-black text-[#00F0FF] px-2.5 py-0.5">CARRERA DE COMPUTACION</span>
          <span className="tracking-wider">★ TORNEO ONLINE ★</span>

          {/* Duplicated for smooth infinite loop */}
          <span className="bg-black text-[#FFE600] px-2.5 py-0.5">VALORANT 5v5</span>
          <span className="tracking-wider">★ INSCRIPCIONES ABIERTAS ★</span>
          
          <span className="bg-black text-[#FFE600] px-2.5 py-0.5">FREE FIRE ESCUADRAS</span>
          <span className="tracking-wider">★ 4, 5 Y 6 DE NOVIEMBRE ★</span>
          
          <span className="bg-black text-[#FFE600] px-2.5 py-0.5">FORTNITE DUOS</span>
          <span className="bg-[#FF0055] text-white px-2 py-0.5 animate-arcade-blink">PREMIOS EN EFECTIVO</span>
          
          <span className="bg-black text-[#FFE600] px-2.5 py-0.5">CLASH ROYALE 1v1</span>
          <span className="tracking-wider">★ INSCRIPCION: $1 POR JUGADOR ★</span>

          <span className="bg-black text-[#00F0FF] px-2.5 py-0.5">CARRERA DE COMPUTACION</span>
          <span className="tracking-wider">★ TORNEO ONLINE ★</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN 2-COLUMN ASYMMETRIC CYBER-ARCADE HERO             */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-10 sm:pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-center">

          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN (COL 1-7): ARCADE INTEL, TITLES & BUTTONS
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col items-start gap-3.5 sm:gap-4">

            {/* Title Block: Neo-Brutalist Cyber-Arcade Style */}
            <div className="relative w-full">
              <div className="relative z-10 space-y-0.5">
                <div className="font-pixel text-[11px] sm:text-xs text-[#FFE600] tracking-widest uppercase flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#FFE600]" />
                  <span>// ESTADO: INSCRIPCIONES ABIERTAS</span>
                </div>
                
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display uppercase tracking-tight text-white leading-[0.9] drop-shadow-[4px_4px_0px_#000]">
                  COMPU
                </h1>
                
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display uppercase tracking-tight text-[#FFE600] leading-[0.9] drop-shadow-[5px_5px_0px_#FF0055]">
                  LEAGUE
                </h1>

                <div className="flex items-center gap-3 flex-wrap pt-0.5">
                  <span className="text-4xl sm:text-6xl lg:text-7xl font-black font-display uppercase tracking-tight text-[#00F0FF] leading-[0.9] drop-shadow-[4px_4px_0px_#000]">
                    E-SPORTS
                  </span>
                  <span className="bg-[#FFE600] text-black font-pixel text-xs sm:text-base px-2.5 py-1.5 border-2 border-black font-black shadow-brutal-black">
                    2026
                  </span>
                </div>
              </div>
            </div>

            {/* Clean readable description in Chakra Petch (Floats cleanly over grid, no blockquote border) */}
            <p className="text-slate-300 font-cyber text-sm sm:text-base leading-relaxed max-w-xl">
              El torneo oficial de videojuegos de la Carrera de Computación. Compite con tu equipo en tu juego favorito y participa por los premios en efectivo.
            </p>

            {/* Neo-Brutalist Prize Box (Aprovecha todo el ancho horizontal sin redundancia) */}
            <div className="w-full bg-[#0D121D] border-2 border-[#FFE600] p-4 sm:p-5 shadow-brutal-yellow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Columna Izquierda: Título y descripción */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-pixel text-[10px] text-[#FFE600] tracking-wider uppercase">
                    <Coins className="w-4 h-4 text-[#FFE600] shrink-0" />
                    <span>POZO DEL TORNEO</span>
                    <span className="bg-[#FF0055] text-white font-pixel text-[8px] px-2 py-0.5 border border-black animate-arcade-blink ml-1">
                      ★ 100% EFECTIVO
                    </span>
                  </div>

                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-white tracking-wide uppercase leading-none drop-shadow-[2px_2px_0px_#000]">
                    PREMIOS EN EFECTIVO
                  </div>

                  <p className="text-sm text-slate-200 font-cyber leading-relaxed max-w-md pt-1">
                    Pozo acumulado por inscripciones repartido entre los ganadores de cada videojuego.
                  </p>
                </div>

                {/* Columna Derecha: Los 4 videojuegos premiados */}
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="bg-black border border-[#FFE600] px-3 py-1.5 font-pixel text-[8px] sm:text-[9px] text-[#FFE600] shadow-brutal-black flex items-center gap-2">
                    <span className="text-[#00F0FF]">▸</span>
                    <span>4 VIDEOJUEGOS PREMIADOS</span>
                  </div>
                  <div className="bg-black border border-[#00F0FF] px-3 py-1.5 font-pixel text-[8px] sm:text-[9px] text-[#00F0FF] shadow-brutal-black flex items-center gap-2">
                    <span className="text-[#FFE600]">▸</span>
                    <span className="tracking-tight">VALORANT • FREE FIRE • FORTNITE • CR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mechanical Arcade Physical Buttons (Cero esquinas redondeadas + botón que se hunde) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full pt-0.5">
              {/* Primary: INSCRIBIRSE */}
              <button
                type="button"
                onClick={() => onOpenRegister('valorant')}
                className="btn-arcade-press shadow-brutal-pink bg-[#FFE600] hover:bg-[#FFF04D] text-black border-2 border-black font-pixel text-xs sm:text-sm px-6 py-3.5 flex items-center justify-center gap-3 cursor-pointer uppercase font-black"
              >
                <span className="w-2.5 h-2.5 bg-[#FF0055] inline-block animate-arcade-blink" />
                <span>INSCRIBIRSE</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              {/* Secondary: HOW TO PLAY */}
              <button
                type="button"
                onClick={onScrollToGames}
                className="btn-arcade-press shadow-brutal-cyan bg-[#09101C] hover:bg-[#121D30] text-[#00F0FF] border-2 border-[#00F0FF] font-pixel text-xs sm:text-sm px-5 py-3.5 flex items-center justify-center gap-2.5 cursor-pointer uppercase"
              >
                <Swords className="w-4 h-4 text-[#00F0FF]" />
                <span>[ REGLAS Y FORMATOS ]</span>
              </button>
            </div>

            {/* Arcade Countdown Screen (CIERRE DE INSCRIPCIONES EN ESPAÑOL, DIAS SIN TILDE) */}
            <div className="w-full bg-[#05070B] border-2 border-black p-3.5 sm:p-4 shadow-brutal-black">
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-white/10 font-pixel text-[9px] sm:text-[10px]">
                <span className="text-[#FFE600] flex items-center gap-1.5 uppercase">
                  <Clock className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>CIERRE DE INSCRIPCIONES</span>
                </span>
                <span className="text-slate-400">
                  {CONTACT_INFO.deadlineLabel}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-[#0F1726] border-2 border-white/10 p-2 shadow-brutal-black">
                  <span className="font-pixel text-xl sm:text-3xl text-white block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="font-pixel text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-widest mt-1 block">
                    DIAS
                  </span>
                </div>

                <div className="bg-[#0F1726] border-2 border-white/10 p-2 shadow-brutal-black">
                  <span className="font-pixel text-xl sm:text-3xl text-white block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="font-pixel text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-widest mt-1 block">
                    HORAS
                  </span>
                </div>

                <div className="bg-[#0F1726] border-2 border-white/10 p-2 shadow-brutal-black">
                  <span className="font-pixel text-xl sm:text-3xl text-white block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="font-pixel text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-widest mt-1 block">
                    MIN
                  </span>
                </div>

                <div className="bg-[#0F1726] border-2 border-[#FF0055] p-2 shadow-brutal-pink">
                  <span className="font-pixel text-xl sm:text-3xl text-[#FFE600] block animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="font-pixel text-[8px] sm:text-[9px] text-[#FF0055] uppercase tracking-widest mt-1 block">
                    SEG
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN (COL 8-12): BÚHO MECHA PIXEL-ART TERMINAL
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            
            {/* Arcade Cabinet Frame */}
            <div className="w-full bg-[#0C111A] border-4 border-black shadow-brutal-yellow p-3 sm:p-4 relative">
              
              {/* Cabinet Header Bar */}
              <div className="bg-black text-[#FFE600] px-3 py-2 border-2 border-[#FFE600] mb-3 flex items-center justify-between font-pixel text-[9px] sm:text-[10px]">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2 h-2 bg-[#00F0FF] inline-block animate-arcade-blink shrink-0" />
                  <span className="truncate">RETADOR: {challengerName.toUpperCase()}</span>
                </div>
                <span className="text-[#FF0055] font-bold shrink-0">NIVEL 99</span>
              </div>

              {/* CRT Monitor Screen with scanlines */}
              <div className="crt-monitor-screen bg-[#04060A] border-2 border-black p-4 flex flex-col items-center justify-center relative min-h-[280px] sm:min-h-[340px]">
                
                {/* HUD Overlay inside CRT (Insignias de alto contraste legibles) */}
                <div className="absolute top-2.5 left-3 right-3 flex justify-between font-pixel text-[8px] sm:text-[9px] z-20 pointer-events-none">
                  <span className="bg-black/90 border border-[#00F0FF] text-[#00F0FF] px-2 py-0.5 shadow-brutal-black">
                    ESCUDO: 100%
                  </span>
                  <span className="bg-black/90 border border-[#FFE600] text-[#FFE600] px-2 py-0.5 shadow-brutal-black">
                    MODO: COMPETITIVO
                  </span>
                </div>

                {/* Pixel Art Mecha Owl Emblem with Neon Visor & Cyan Glow */}
                <div className="relative z-10 flex items-center justify-center my-3">
                  <img
                    src="/assets/buho_pixel_start.png"
                    alt="Búho Mecha Pixel Art - Compu League"
                    className="w-48 sm:w-64 h-auto object-contain shape-crisp drop-shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:scale-105 transition-transform duration-200"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  
                  {/* Subtle neon pulse behind visor */}
                  <div className="absolute top-[42%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-[#00F0FF]/40 blur-md pointer-events-none animate-pulse" />
                </div>

                {/* Boss Health Bar */}
                <div className="w-full max-w-xs mt-2 relative z-20">
                  <div className="flex justify-between font-pixel text-[8px] text-slate-300 mb-1">
                    <span className="text-[#FFE600]">VIDA DEL BOSS</span>
                    <span>9999 / 9999</span>
                  </div>
                  <div className="w-full h-3 bg-black border border-white/20 p-0.5">
                    <div className="h-full bg-gradient-to-r from-[#FF0055] via-[#FFE600] to-[#00F0FF] w-full" />
                  </div>
                </div>

                {/* CRT Bottom Status */}
                <div className="w-full text-center mt-3 font-pixel text-[8px] text-slate-300 z-20">
                  <span className="text-[#00F0FF]">[ SISTEMA LISTO ]</span> SELECCIONA TU JUEGO ABAJO
                </div>
              </div>

              {/* 4 Arcade Slots Summary (Character Select Cartridges - High contrast white text + vibrant arrows) */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {arcadeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      if (onScrollToGames) {
                        onScrollToGames();
                      } else {
                        const el = document.getElementById('juegos');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`btn-arcade-press bg-[#0A0E17] hover:bg-[#141C2E] ${slot.border} border-2 px-3 py-2.5 ${slot.shadow} flex items-center justify-between font-pixel text-[9px] sm:text-[10px] cursor-pointer hover:border-white active:translate-x-1 active:translate-y-1 transition-all group`}
                    title={`Ver reglas y formato de ${slot.name}`}
                  >
                    <span className="text-white font-bold tracking-wider uppercase truncate group-hover:text-[#FFE600] transition-colors">
                      {slot.name}
                    </span>
                    <span style={{ color: slot.color }} className="font-pixel text-[11px] shrink-0 ml-1.5 group-hover:translate-x-0.5 transition-transform">
                      ▸
                    </span>
                  </button>
                ))}
              </div>

              {/* Cabinet Coin Slot Foot (Pixel font without broken tildes) */}
              <div className="mt-3 pt-2 border-t-2 border-white/10 flex items-center justify-between font-pixel text-[8px] sm:text-[9px] text-slate-300">
                <span className="text-white font-bold">INSCRIPCION: $1 POR JUGADOR</span>
                <span className="text-[#FFE600] animate-arcade-blink">★ CREDITOS: 00</span>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
