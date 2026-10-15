import React, { useState } from 'react';
import { MessageSquare, Phone, ArrowUp } from 'lucide-react';
import { CONTACT_INFO } from '../data/tournamentData';

export default function Footer({ onOpenAdmin, onOpenRegister }) {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#16223a] border-t-4 border-[#334a73] pt-16 pb-12 relative overflow-hidden text-slate-100 font-['Press_Start_2P',monospace] select-none shadow-[0_-4px_12px_rgba(0,0,0,0.4)]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b-4 border-[#2f4469]">
          
          {/* Col 1: Brand & Logos */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/buho_pixel_start.png" 
                alt="Logo Compu League" 
                className="w-10 h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                style={{ imageRendering: 'pixelated' }}
              />
              <div>
                <span className="text-[8px] uppercase tracking-wider text-yellow-300 block font-mono">
                  TORNEO OFICIAL
                </span>
                <span className="text-sm font-bold text-white tracking-wider font-['Silkscreen',monospace]">
                  COMPU LEAGUE E-SPORTS
                </span>
              </div>
            </div>

            <p className="text-[10px] text-[#a5badb] font-mono leading-relaxed">
              * Torneo Multiplataforma de Deportes Electronicos 2026.
            </p>

            <div className="text-[10px] text-yellow-300">
              <span>* FASE DE INSCRIPCIONES ABIERTAS</span>
            </div>
          </div>

          {/* Col 2: Videojuegos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-300 font-['Silkscreen',monospace]">
              * VIDEOJUEGOS
            </h4>
            <ul className="space-y-2 text-[10px] text-[#a5badb] font-mono">
              <li className="flex items-center gap-2 hover:text-white transition">
                <span className="text-red-400">*</span>
                <span>Valorant (5v5 Bo3)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition">
                <span className="text-amber-400">*</span>
                <span>Free Fire (2x1 Salas)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition">
                <span className="text-sky-400">*</span>
                <span>Fortnite (Duos Crossplay)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition">
                <span className="text-cyan-400">*</span>
                <span>Clash Royale (1v1 Bo3)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Torneo Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-300 font-['Silkscreen',monospace]">
              * TORNEO
            </h4>
            <div className="text-[10px] text-[#a5badb] space-y-2 font-mono">
              <p>ESTADO: <strong className="text-emerald-400">INSCRIPCIONES ACTIVAS</strong></p>
              <p>FECHAS: <strong className="text-slate-100">4, 5 Y 6 NOVIEMBRE</strong></p>
              <p>MODO: <strong className="text-sky-300">ONLINE / MULTIPLATAFORMA</strong></p>
              <p>PREMIOS: <strong className="text-yellow-300">EFECTIVO + TROFEO</strong></p>
            </div>
          </div>

          {/* Col 4: Contacto */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-300 font-['Silkscreen',monospace]">
              * CONTACTO
            </h4>
            <div className="space-y-2.5">
              <a
                href={CONTACT_INFO.whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 border-2 border-[#2f4469] hover:border-emerald-400 bg-[#1d2d4c] text-[10px] text-[#a5badb] hover:text-emerald-300 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WHATSAPP: 0962074110</span>
              </a>

              <a
                href={CONTACT_INFO.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 border-2 border-[#2f4469] hover:border-indigo-400 bg-[#1d2d4c] text-[10px] text-[#a5badb] hover:text-indigo-200 transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>DISCORD OFICIAL</span>
              </a>

              <button
                onClick={onOpenRegister}
                className="w-full py-2.5 px-3 border-2 border-[#476799] hover:border-yellow-300 bg-[#253961] hover:bg-[#304878] text-slate-100 hover:text-yellow-300 text-[10px] uppercase transition-colors flex items-center justify-center cursor-pointer"
              >
                <span>[ INSCRIBIRSE AHORA ]</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar with Undertale quote */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-[#8ea4c7]">
          <div>
            * COMPU LEAGUE E-SPORTS 2026.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer uppercase"
            >
              <span>[ ARRIBA ]</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
