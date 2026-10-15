import React, { useState, useEffect } from 'react';
import { 
  Trophy, ArrowRight, Clock, Calendar, Sparkles, Shield, Flame, 
  Crosshair, Crown, Zap, ChevronDown, Award, Gift, Swords
} from 'lucide-react';
import { CONTACT_INFO, GAMES } from '../data/tournamentData';

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

  const featuredGames = [
    { id: 'valorant', name: 'VALORANT', mode: '5v5 Táctico', image: '/assets/valorant.jpg', color: '#ff4655' },
    { id: 'free_fire', name: 'FREE FIRE', mode: 'Escuadras + Solo', image: '/assets/free_fire.jpg', color: '#f59e0b' },
    { id: 'fortnite', name: 'FORTNITE', mode: 'Dúos Crossplay', image: '/assets/fortnite.jpg', color: '#0ea5e9' },
    { id: 'clash_royale', name: 'CLASH ROYALE', mode: '1v1 Duelos', image: '/assets/clash_royale.jpg', color: '#8b5cf6' },
  ];

  return (
    <section className="relative overflow-hidden esports-dark-bg text-slate-100 font-sans select-none border-b border-white/10 flex flex-col items-center pt-0 pb-12 sm:pb-20">
      
      {/* Dynamic Background Glow & Ambient Flares */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-amber-500/10 via-sky-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. TOURNAMENT NEWS TICKER (MODERN HIGH-TECH MARQUEE)     */}
      {/* ========================================================= */}
      <div className="w-full bg-[#0E1420] text-slate-300 font-display font-bold py-2 text-xs sm:text-sm overflow-hidden select-none border-b border-white/10 shadow-inner relative z-20">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10">
          <span className="text-amber-400 font-black tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 fill-amber-400" /> COMPU LEAGUE E-SPORTS 2026
          </span>
          <span className="text-slate-300">4, 5 Y 6 DE NOVIEMBRE</span>
          <span className="text-rose-400">VALORANT 5v5</span>
          <span className="text-amber-400">FREE FIRE ESCUADRAS</span>
          <span className="text-sky-400">FORTNITE DÚOS</span>
          <span className="text-purple-400">CLASH ROYALE 1v1</span>
          <span className="text-emerald-400 font-bold">PREMIOS EN EFECTIVO + TROFEO OFICIAL</span>
          <span className="text-amber-300 font-extrabold uppercase">INSCRIPCIONES ABIERTAS</span>
          
          <span className="text-amber-400 font-black tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 fill-amber-400" /> COMPU LEAGUE E-SPORTS 2026
          </span>
          <span className="text-slate-300">4, 5 Y 6 DE NOVIEMBRE</span>
          <span className="text-rose-400">VALORANT 5v5</span>
          <span className="text-amber-400">FREE FIRE ESCUADRAS</span>
          <span className="text-sky-400">FORTNITE DÚOS</span>
          <span className="text-purple-400">CLASH ROYALE 1v1</span>
          <span className="text-emerald-400 font-bold">PREMIOS EN EFECTIVO + TROFEO OFICIAL</span>
          <span className="text-amber-300 font-extrabold uppercase">INSCRIPCIONES ABIERTAS</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN BREATHING HERO CONTENT (FULL WIDTH & IMPACTFUL)  */}
      {/* ========================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-8 sm:pt-14 text-center">
        
        {/* Live Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs sm:text-sm font-display font-bold uppercase tracking-wider mb-5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>Torneo Oficial Multiplataforma • Inscripciones Abiertas</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-2 mb-4">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight text-white uppercase leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            COMPU LEAGUE
          </h1>
          <div className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-wider bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent uppercase">
            E-SPORTS 2026
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed mb-8">
          El torneo oficial de deportes electrónicos de la UPEC. Compite en 4 títulos legendarios por la gloria universitaria, trofeos oficiales y premios en efectivo.
        </p>

        {/* ======================================================= */}
        {/* 3. PROTAGONISMO DE PREMIOS (EL GANCHO PRINCIPAL)        */}
        {/* ======================================================= */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="relative rounded-xl p-0.5 bg-gradient-to-r from-amber-500/60 via-yellow-400/80 to-amber-500/60 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
            <div className="rounded-[10px] bg-gradient-to-br from-[#181F2F] via-[#121824] to-[#0E131E] p-4 sm:p-6 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] shrink-0">
                    <Trophy className="w-8 h-8 fill-slate-950" />
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>POZO DE PREMIOS OFICIAL</span>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black font-display text-white tracking-wide uppercase leading-tight">
                      PREMIOS EN EFECTIVO + TROFEO OFICIAL
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
                      Medallas de honor para los campeones y acreditación oficial institucional.
                    </p>
                  </div>
                </div>

                {/* Quick Benefit Tags */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                  <div className="px-3 py-1.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 font-display font-bold text-xs uppercase">
                    Efectivo
                  </div>
                  <div className="px-3 py-1.5 rounded bg-sky-400/10 border border-sky-400/30 text-sky-300 font-display font-bold text-xs uppercase">
                    Trofeos
                  </div>
                  <div className="px-3 py-1.5 rounded bg-purple-400/10 border border-purple-400/30 text-purple-300 font-display font-display font-bold text-xs uppercase">
                    Medallas
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* 4. VISUAL GAME SHOWCASE CARDS (KEY ARTWORK)             */}
        {/* ======================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 max-w-5xl mx-auto">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-amber-400/60 bg-slate-900/60 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            >
              {/* Game Background Image */}
              <div className="h-28 sm:h-36 w-full relative overflow-hidden">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 filter brightness-90 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent" />
              </div>

              {/* Game Label */}
              <div className="p-3 text-left relative -mt-6 z-10">
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors tracking-wide">
                    {game.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 font-sans block mt-0.5">
                  {game.mode}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ======================================================= */}
        {/* 5. COUNTDOWN TIMER (ESPORTS EDITION)                    */}
        {/* ======================================================= */}
        <div className="max-w-2xl mx-auto mb-10 p-5 rounded-xl border border-white/10 bg-[#101622]/80 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs sm:text-sm font-display uppercase tracking-wider">
            <span className="text-amber-400 font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 animate-pulse" />
              Cierre de Inscripciones
            </span>
            <span className="text-slate-400 font-mono text-[11px] sm:text-xs">
              Límite: {CONTACT_INFO.deadlineLabel} (23:59:59)
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center font-display">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
              <span className="text-3xl sm:text-5xl font-black text-amber-400 tracking-tight block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                Días
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
              <span className="text-3xl sm:text-5xl font-black text-white tracking-tight block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                Horas
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
              <span className="text-3xl sm:text-5xl font-black text-white tracking-tight block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                Minutos
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-amber-400/30">
              <span className="text-3xl sm:text-5xl font-black text-amber-400 tracking-tight block animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest mt-1 block">
                Segundos
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* 6. HERO ACTION BUTTONS (CTAs)                           */}
        {/* ======================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onOpenRegister('valorant')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-base sm:text-lg uppercase tracking-wider rounded-md shadow-[0_0_30px_rgba(245,158,11,0.45)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5"
          >
            <Trophy className="w-5 h-5 fill-slate-950" />
            <span>INSCRIBIR A MI EQUIPO</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onScrollToGames}
            className="w-full sm:w-auto px-7 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-display font-bold text-base uppercase tracking-wider rounded-md border border-white/15 hover:border-amber-400/50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4 text-amber-400" />
            <span>VER REGLAS Y FORMATOS</span>
          </button>
        </div>

      </div>

    </section>
  );
}
