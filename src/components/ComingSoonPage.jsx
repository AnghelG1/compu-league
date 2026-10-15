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
    ? 'Los cruces y llaves eliminatorias oficiales se sortearán y publicarán una vez finalizadas las inscripciones de equipos y jugadores.'
    : 'Los horarios exactos y orden de partidas por noche se definirán y publicarán una vez confirmados todos los participantes.';

  return (
    <div className="min-h-screen bg-[#07090F] text-slate-100 flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* Retro Cyber Grid & Scanlines Background */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 crt-scanlines opacity-25 pointer-events-none" />

      {/* Top Bar */}
      {!hideHeader && (
        <header className="h-16 sm:h-20 border-b-4 border-black bg-black sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between">
          <div 
            onClick={onGoHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="/assets/buho_pixel_start.png" 
              alt="Logo" 
              className="w-10 h-10 object-contain shape-crisp drop-shadow-[0_0_10px_rgba(255,230,0,0.5)]"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-wider text-white group-hover:text-[#FFE600] transition-colors font-display leading-tight">
                COMPU LEAGUE
              </span>
              <span className="text-[9px] tracking-widest text-[#FFE600] uppercase leading-tight font-pixel">
                E-SPORTS 2026
              </span>
            </div>
          </div>

          <button
            onClick={onGoHome}
            className="btn-arcade-press shadow-brutal-yellow px-4 py-2 border-2 border-black bg-[#FFE600] text-black font-pixel text-[10px] uppercase flex items-center gap-2 cursor-pointer font-black"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">[ INICIO ]</span>
          </button>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 min-h-[calc(100vh-5rem)]">

        <div className="max-w-3xl w-full border-4 border-black bg-[#0B101A] p-5 sm:p-8 text-center relative z-10 shadow-brutal-yellow space-y-5 animate-fadeIn">
          
          {/* Badge */}
          <div className="inline-block px-3.5 py-1.5 border-2 border-black bg-[#FFE600] text-black font-pixel font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-brutal-black">
            ★ PRÓXIMAMENTE ★
          </div>

          {/* Icon Animation */}
          <div className="flex justify-center my-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-black bg-black flex items-center justify-center shadow-brutal-black">
              {isBrackets ? (
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFE600] animate-bounce" />
              ) : (
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-[#00F0FF] animate-pulse" />
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white font-display tracking-wide drop-shadow-[2px_2px_0px_#000]">
              {title}
            </h1>
            <p className="font-pixel text-[10px] text-[#FFE600] tracking-wide">
              [ FASE ACTUAL: INSCRIPCIONES ABIERTAS ]
            </p>
          </div>

          {/* Official Announcement Dialogue Block */}
          <div className="border-4 border-black bg-black text-left shadow-brutal-black overflow-hidden">
            {/* Header tab */}
            <div className="px-3.5 py-2 bg-[#121A2A] border-b-2 border-black flex items-center justify-between font-pixel text-[8px] sm:text-[9px] text-[#FFE600] uppercase font-bold">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFE600] shrink-0" />
                <span>COMUNICADO OFICIAL DEL TORNEO</span>
              </div>
              <span className="text-[#00F0FF]">
                [ SYS.ONLINE ]
              </span>
            </div>

            {/* Bullet points */}
            <div className="p-4 sm:p-5 space-y-3 font-cyber text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2.5 text-white">
                <span className="text-[#FFE600] font-pixel text-[10px] shrink-0">►</span>
                <p className="leading-relaxed">{subtitle}</p>
              </div>

              <div className="flex items-start gap-2.5 text-slate-300">
                <span className="text-[#FFE600] font-pixel text-[10px] shrink-0">►</span>
                <p className="leading-relaxed">
                  Esto nos asegura un emparejamiento parejo, sorteo transparente en vivo y fixture balanceado para todas las escuadras.
                </p>
              </div>

              <div className="flex items-start gap-2.5 text-[#00F0FF] pt-2 border-t border-white/10 font-bold">
                <span className="text-[#00F0FF] font-pixel text-[10px] shrink-0">★</span>
                <p className="leading-relaxed">
                  Fechas oficiales de competencia: 4, 5 y 6 de Noviembre de 2026 (Noches).
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="btn-arcade-press shadow-brutal-pink w-full sm:w-auto px-7 py-4 border-2 border-black bg-[#FFE600] text-black font-pixel font-black text-xs uppercase cursor-pointer"
            >
              <span>[ INSCRIBIR A MI EQUIPO ]</span>
            </button>

            <button
              onClick={onGoHome}
              className="btn-arcade-press shadow-brutal-black w-full sm:w-auto px-6 py-4 border-2 border-black bg-black text-slate-300 hover:text-white font-pixel text-xs uppercase cursor-pointer"
            >
              <span>[ VOLVER AL INICIO ]</span>
            </button>
          </div>

        </div>

      </main>

      {/* Footer */}
      {!hideFooter && (
        <footer className="py-4 border-t-4 border-black bg-black text-center font-pixel text-[9px] text-slate-400">
          ★ COMPU LEAGUE E-SPORTS 2026 • UPEC MULTIPLATAFORMA
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
