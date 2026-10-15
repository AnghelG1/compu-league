import React, { useState, useEffect } from 'react';
import { 
  Trophy, Clock, Phone, Crosshair, Flame, Crown, 
  Sparkles, User, Play, Gamepad2, Lock, MessageSquare, Zap
} from 'lucide-react';
import { CONTACT_INFO } from '../data/tournamentData';
import buhoImg from '../assets/buho.png';

export default function Hero({ 
  onStartGame, 
  onNavigate, 
  onOpenAdmin 
}) {
  const [gamerTag, setGamerTag] = useState('');
  const [selectedGame, setSelectedGame] = useState('valorant');
  const [isPressingPlay, setIsPressingPlay] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const deadline = new Date(CONTACT_INFO.deadlineIso).getTime();
      const now = new Date().getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio API Retro/Cyber Synth Chime for Arcade Start
  const playArcadeStartSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      // Cyber chord progression (A4 -> C#5 -> E5 -> A5)
      const frequencies = [440, 554.37, 659.25, 880];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.18, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.5);
      });
    } catch {
      // Audio playback blocked or unallowed
    }
  };

  const handleLaunch = () => {
    setIsPressingPlay(true);
    playArcadeStartSound();

    const finalTag = gamerTag.trim() || 'JUGADOR_1';
    setTimeout(() => {
      setIsPressingPlay(false);
      onStartGame(finalTag, selectedGame);
    }, 300);
  };

  const gamesList = [
    {
      id: 'valorant',
      name: 'VALORANT',
      badge: '5v5 PC',
      accentColor: '#FF4655',
      icon: Crosshair,
    },
    {
      id: 'free_fire',
      name: 'FREE FIRE',
      badge: '2x1 Salas',
      accentColor: '#F59E0B',
      icon: Flame,
    },
    {
      id: 'fortnite',
      name: 'FORTNITE',
      badge: 'Dúos Crossplay',
      accentColor: '#3B82F6',
      icon: Zap,
    },
    {
      id: 'clash_royale',
      name: 'CLASH ROYALE',
      badge: '1v1 Arena',
      accentColor: '#00F0FF',
      icon: Crown,
    },
  ];

  const currentGame = gamesList.find(g => g.id === selectedGame) || gamesList[0];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_#0b296b_0%,_#031438_45%,_#01091b_100%)] text-slate-100 flex flex-col justify-between select-none">
      
      {/* ========================================================= */}
      {/* 1. PCB CIRCUIT BOARD PATTERN (ESTILO FLYER OFICIAL)       */}
      {/* ========================================================= */}
      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pcb-start-pattern" width="140" height="140" patternUnits="userSpaceOnUse">
            <path 
              d="M10 20 H50 L75 45 H120 M75 45 V90 L95 110 H130 M20 70 H60 L75 85 M10 120 H40 L60 140" 
              fill="none" 
              stroke="#00F0FF" 
              strokeWidth="1.2" 
              strokeOpacity="0.45" 
            />
            <circle cx="10" cy="20" r="3" fill="#00F0FF" fillOpacity="0.8" />
            <circle cx="120" cy="45" r="3" fill="#00F0FF" fillOpacity="0.8" />
            <circle cx="95" cy="110" r="2.5" fill="#F59E0B" fillOpacity="0.8" />
            <circle cx="60" cy="70" r="2" fill="#00F0FF" fillOpacity="0.6" />
            <circle cx="75" cy="85" r="2.5" fill="#00F0FF" fillOpacity="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pcb-start-pattern)" />
      </svg>

      {/* Volumetric Arena Lighting */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[170px] pointer-events-none opacity-30 transition-colors duration-700" 
        style={{ backgroundColor: currentGame.accentColor }} 
      />
      <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] rounded-full bg-amber-500/15 blur-[140px] pointer-events-none" />

      {/* ========================================================= */}
      {/* 2. TOP GAMING HUD BAR (HEADER)                            */}
      {/* ========================================================= */}
      <header className="relative z-20 h-16 sm:h-20 px-4 sm:px-8 border-b border-cyan-500/25 bg-slate-950/60 backdrop-blur-md flex items-center justify-between shrink-0">
        
        {/* Left: University & Carrera Badge */}
        <div className="flex items-center gap-3">
          <img 
            src="/assets/logo_torneo.png" 
            alt="Logo Torneo" 
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]"
          />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-black tracking-tight text-white uppercase font-heading leading-tight">
              CARRERA DE COMPUTACIÓN
            </span>
            <span className="text-[10px] font-mono text-cyan-400 tracking-wider">
              SISTEMA DE TORNEO OFICIAL // 2026
            </span>
          </div>
        </div>

        {/* Right: Live Telemetry, Countdown & Staff Lock */}
        <div className="flex items-center gap-2.5 sm:gap-4 font-mono text-xs">
          
          {/* Server Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SERVIDOR: ONLINE</span>
          </div>

          {/* Countdown timer HUD */}
          <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
          </div>

          {/* Staff Lock Button */}
          <button
            onClick={onOpenAdmin}
            title="Panel de Administración"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* ========================================================= */}
      {/* 3. CENTER: VIDEO GAME TITLE SCREEN & START PROMPT         */}
      {/* ========================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2 text-center max-w-4xl mx-auto w-full my-auto">
        
        {/* Búho Mascot with Comic Speech Bubble */}
        <div className="relative mb-2 flex flex-col items-center">
          
          {/* Comic Tech Speech Bubble */}
          <div className="relative z-20 mb-1.5 bg-white text-slate-950 font-black text-xs sm:text-sm px-4 py-1.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.6)] border-2 border-cyan-400 max-w-xs text-center animate-bounce duration-1000">
            <span>¿Aceptas el reto?</span>
            <span className="block text-blue-700 text-[10px] font-bold uppercase">
              ¡Escribe tu GamerTag y presiona JUGAR!
            </span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
          </div>

          {/* Glowing Aura behind Mascot */}
          <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-400/30 to-amber-400/25 blur-2xl pointer-events-none" />

          {/* The Mascot */}
          <img 
            src={buhoImg} 
            alt="Búho Mascota Oficial" 
            className="relative z-10 w-36 sm:w-44 max-h-[160px] object-contain drop-shadow-[0_20px_35px_rgba(0,240,255,0.4)] animate-float select-none"
          />
        </div>

        {/* Monumental 3D Title */}
        <div className="space-y-0.5 mb-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight font-heading leading-none">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] filter">
              COMPU LEAGUE
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 drop-shadow-[0_0_35px_rgba(245,158,11,0.7)] filter">
              E-SPORTS 2026
            </span>
          </h1>
          <p className="text-cyan-300 font-mono text-[11px] sm:text-xs tracking-widest uppercase font-bold pt-1">
            • TORNEO UNIVERSITARIO MULTIPLATAFORMA • INSCRIPCIÓN $1 USD •
          </p>
        </div>

        {/* ======================================================= */}
        {/* THE ARCADE START TERMINAL ([ GAMERTAG ] + [ ▶ JUGAR ]) */}
        {/* ======================================================= */}
        <div className="w-full max-w-lg bg-blue-950/80 border-2 border-cyan-400/40 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(0,240,255,0.25)] space-y-3.5">
          
          {/* GamerTag Input */}
          <div className="text-left space-y-1">
            <label className="block text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Tu GamerTag / Nickname:</span>
              </span>
              <span className="text-[10px] text-amber-400 font-normal">Obligatorio</span>
            </label>

            <div className="relative">
              <input 
                type="text"
                value={gamerTag}
                onChange={(e) => setGamerTag(e.target.value.toUpperCase().slice(0, 16))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLaunch();
                }}
                placeholder="ESCRIBE TU NICKNAME (EJ: VIPER_COMPU)"
                className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/50 text-white font-mono font-black text-sm sm:text-base tracking-wider focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all placeholder:text-slate-600 text-center uppercase"
              />
            </div>
          </div>

          {/* Game Selector */}
          <div className="text-left space-y-1">
            <label className="block text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Selecciona tu Juego:</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {gamesList.map((g) => {
                const isSelected = selectedGame === g.id;
                const IconComponent = g.icon;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGame(g.id)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer ${
                      isSelected
                        ? 'border-white text-slate-950 shadow-lg scale-105'
                        : 'bg-slate-950/70 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: isSelected ? g.accentColor : undefined,
                    }}
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] leading-tight">{g.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* THE GIANT ARCADE START BUTTON: [ ▶ JUGAR ] */}
          <div className="pt-1">
            <button
              onClick={handleLaunch}
              disabled={isPressingPlay}
              className={`w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:shadow-[0_0_60px_rgba(245,158,11,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer font-heading flex items-center justify-center gap-2.5 ${
                isPressingPlay ? 'brightness-125 scale-95' : 'animate-pulse-subtle'
              }`}
            >
              <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>¡JUGAR / GENERAR MI TARJETA ($1 USD)!</span>
            </button>
          </div>

          {/* Subtitle Guarantee */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-cyan-300/80">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Genera tu Tarjeta de Jugador y completa tu registro con validación de $1</span>
          </div>

        </div>

        {/* ======================================================= */}
        {/* 4. ARCADE MENU OPTIONS (NAVIGATION LIKE A CONSOLE GAME) */}
        {/* ======================================================= */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-mono">
          
          <button
            onClick={() => onNavigate('brackets')}
            className="px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-blue-900/80 border border-cyan-500/30 text-white hover:text-cyan-300 transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
          >
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span>[ 🏆 VER BRACKETS ]</span>
          </button>

          <button
            onClick={() => onNavigate('games')}
            className="px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-blue-900/80 border border-cyan-500/30 text-white hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span>[ 🎮 REGLAS & PREMIOS ]</span>
          </button>

          <button
            onClick={() => onNavigate('schedule')}
            className="px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-blue-900/80 border border-cyan-500/30 text-white hover:text-cyan-300 transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>[ 📅 CRONOGRAMA 4, 5, 6 NOV ]</span>
          </button>

          <a
            href="https://wa.me/593962074110"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 transition flex items-center gap-1.5 hover:scale-105"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WHATSAPP STAFF: 0962074110</span>
          </a>

          <a
            href="https://discord.gg/ynfD8aHHmP"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 transition flex items-center gap-1.5 hover:scale-105"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>DISCORD OFICIAL</span>
          </a>

        </div>

      </main>

      {/* ========================================================= */}
      {/* 5. BOTTOM ARCADE FOOTER TELEMETRY STRIP                   */}
      {/* ========================================================= */}
      <footer className="relative z-20 h-10 px-4 sm:px-8 border-t border-cyan-500/20 bg-slate-950/70 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0">
        <div>
          <span>COMPU LEAGUE 2026 // CARRERA DE COMPUTACIÓN</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold">INSCRIPCIÓN: $1.00 USD</span>
          <span className="hidden sm:inline-block text-slate-600">•</span>
          <span className="hidden sm:inline-block">PARTIDAS EN NOCHES: 4, 5 Y 6 DE NOVIEMBRE</span>
        </div>
      </footer>

    </div>
  );
}
