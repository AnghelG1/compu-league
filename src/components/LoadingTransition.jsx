import React, { useEffect, useState } from 'react';

export default function LoadingTransition({ targetPage, onComplete, duration = 480 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed >= duration) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  const getPageInfo = () => {
    switch (targetPage) {
      case 'brackets':
        return {
          title: 'BRACKETS Y CRUCES',
          subtitle: '* Cargando llaves y emparejamientos...'
        };
      case 'cronograma':
        return {
          title: 'CRONOGRAMA OFICIAL',
          subtitle: '* Cargando horarios y fechas de batalla...'
        };
      case 'participantes':
        return {
          title: 'LISTA DE PARTICIPANTES',
          subtitle: '* Cargando escuadras y jugadores inscritos...'
        };
      case 'inicio':
        return {
          title: 'PÁGINA PRINCIPAL',
          subtitle: '* Conectando al lobby principal...'
        };
      case 'juegos':
        return {
          title: 'VIDEOJUEGOS Y REGLAS',
          subtitle: '* Cargando modalidades de juego...'
        };
      default:
        return {
          title: 'COMPU LEAGUE E-SPORTS',
          subtitle: '* Procesando solicitud...'
        };
    }
  };

  const info = getPageInfo();

  return (
    <div className="fixed inset-0 z-[100] bg-[#151f33]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 font-['Press_Start_2P',monospace] select-none text-slate-100 animate-fadeIn">
      {/* Background Pixel Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#2d4573_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      {/* Retro Loading Card */}
      <div className="max-w-md w-full border-4 border-[#364e78] bg-[#1d2d4c] p-6 sm:p-8 text-center space-y-5 shadow-[0_0_35px_rgba(0,0,0,0.6)] relative z-10">
        
        {/* Animated Retro Star */}
        <div className="flex justify-center items-center">
          <span className="text-yellow-300 text-3xl animate-pulse">★</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 bg-yellow-300 text-black text-[10px] font-bold uppercase tracking-widest">
            CARGANDO...
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white font-['Silkscreen',monospace] tracking-wider pt-1">
            {info.title}
          </h3>
        </div>

        {/* Retro Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-4 bg-[#16233b] border-2 border-[#2f4469] p-0.5 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-300 via-sky-400 to-yellow-300 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-[#a5badb] font-mono">
            <span>PROCESANDO</span>
            <span className="text-yellow-300 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Undertale dialogue caption */}
        <p className="text-[9px] text-[#a5badb] font-mono pt-2 border-t border-[#2f4469] leading-relaxed">
          {info.subtitle}
        </p>

      </div>
    </div>
  );
}
