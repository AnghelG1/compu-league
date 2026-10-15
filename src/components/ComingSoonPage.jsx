import React, { useState } from 'react';
import { Trophy, Calendar, ArrowLeft, Clock, Shield, Sparkles, MessageSquare } from 'lucide-react';
import RegistrationModal from './RegistrationModal';

export default function ComingSoonPage({ type = 'brackets', onGoHome, hideHeader = false, hideFooter = false }) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const isBrackets = type === 'brackets';

  const title = isBrackets 
    ? 'BRACKETS Y CRUCES DE PARTIDAS' 
    : 'CRONOGRAMA OFICIAL DE BATALLAS';

  const subtitle = isBrackets
    ? '* Los cruces y llaves eliminatorias oficiales se sortearán y publicarán una vez finalizadas las inscripciones de equipos y jugadores.'
    : '* Los horarios exactos y orden de partidas por noche se definirán y publicarán una vez confirmados todos los participantes.';

  return (
    <div className="min-h-screen bg-[#151f33] text-slate-100 flex flex-col font-['Press_Start_2P',monospace] select-none selection:bg-[#253a69] selection:text-[#e0f2fe]">
      
      {/* Top Bar */}
      {!hideHeader && (
        <header className="h-20 border-b-4 border-[#334a73] bg-[#1a2742]/95 backdrop-blur-sm sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between">
          <div 
            onClick={onGoHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
          <img 
            src="/assets/buho_pixel_start.png" 
            alt="Logo" 
            className="w-10 h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-wider text-white group-hover:text-yellow-300 transition-colors font-['Silkscreen',monospace] leading-tight">
              COMPU LEAGUE
            </span>
            <span className="text-[9px] tracking-widest text-yellow-300/90 uppercase leading-tight font-mono">
              E-SPORTS 2026
            </span>
          </div>
        </div>

        <button
          onClick={onGoHome}
          className="px-3.5 py-2 border-2 border-[#364e78] hover:border-yellow-300 bg-[#1d2d4c] hover:bg-[#253961] text-[#a5badb] hover:text-yellow-300 text-[10px] transition-colors flex items-center gap-2 cursor-pointer uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">[ INICIO ]</span>
        </button>
      </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden min-h-[calc(100vh-4rem)]">
        
        {/* Retro Cyber Grid & Scanlines Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(45,75,135,0.4),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(96,165,250,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(96,165,250,0.06)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />

        <div className="max-w-4xl w-full border-4 border-[#364e78] bg-[#1d2d4c] p-4 sm:p-7 lg:p-8 text-center relative z-10 shadow-[0_4px_24px_rgba(0,0,0,0.4)] space-y-4 sm:space-y-5 animate-fadeIn">
          
          {/* Badge */}
          <div className="inline-block px-4 py-1.5 border-2 border-yellow-300 bg-yellow-300 text-black font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            ★ PRÓXIMAMENTE ★
          </div>

          {/* Icon Animation */}
          <div className="flex justify-center my-2 sm:my-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#476799] bg-[#16233b] flex items-center justify-center shadow-inner">
              {isBrackets ? (
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-bounce" />
              ) : (
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400 animate-pulse" />
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold uppercase text-white font-['Silkscreen',monospace] tracking-wider leading-relaxed">
              {title}
            </h1>
            <p className="text-[10px] sm:text-xs text-yellow-300 font-mono tracking-wide">
              [ FASE ACTUAL: INSCRIPCIONES ABIERTAS ]
            </p>
          </div>

          {/* Official Announcement Dialogue Block (Clear retro arcade window) */}
          <div className="border-4 border-[#476799] bg-[#121c2e] text-left shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Header tab */}
            <div className="px-3.5 py-2 bg-[#253961] border-b-2 border-[#476799] flex items-center justify-between text-[9px] sm:text-[10px] text-yellow-300 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                <span>* COMUNICADO OFICIAL DEL TORNEO</span>
              </div>
              <span className="text-sky-300 text-[8px] sm:text-[9px] font-mono">
                [ SYS.ONLINE ]
              </span>
            </div>

            {/* Bullet points */}
            <div className="p-4 sm:p-5 space-y-3 font-['Press_Start_2P',monospace] text-[9px] sm:text-[10px] leading-relaxed">
              <div className="flex items-start gap-2.5 sm:gap-3 text-white">
                <span className="text-yellow-300 shrink-0 select-none">►</span>
                <p className="leading-relaxed">{subtitle}</p>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 text-slate-300">
                <span className="text-yellow-300 shrink-0 select-none">►</span>
                <p className="leading-relaxed">
                  Esto nos asegura un emparejamiento parejo, sorteo transparente en vivo y fixture balanceado para todas las escuadras.
                </p>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 text-sky-300 pt-2 border-t border-[#253961]">
                <span className="text-sky-400 shrink-0 select-none">★</span>
                <p className="leading-relaxed font-bold">
                  Fechas oficiales de competencia: 4, 5 y 6 de Noviembre de 2026.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-yellow-300 bg-yellow-300 hover:bg-white text-black font-bold text-[10px] sm:text-xs uppercase transition-colors cursor-pointer shadow-md flex items-center justify-center text-center font-['Press_Start_2P',monospace]"
            >
              <span>[ INSCRIBIR A MI EQUIPO ]</span>
            </button>

            <button
              onClick={onGoHome}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-[#476799] bg-[#253961] hover:bg-[#304878] hover:border-[#60a5fa] text-slate-100 hover:text-white text-[10px] sm:text-xs uppercase transition-colors cursor-pointer text-center font-['Press_Start_2P',monospace]"
            >
              <span>[ VOLVER AL INICIO ]</span>
            </button>
          </div>

        </div>

      </main>

      {/* Footer */}
      {!hideFooter && (
        <footer className="py-6 border-t-4 border-[#334a73] bg-[#16223a] text-center text-[9px] text-[#8ea4c7] font-mono">
          * COMPU LEAGUE E-SPORTS 2026 • TODOS LOS DERECHOS RESERVADOS.
        </footer>
      )}

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

    </div>
  );
}
