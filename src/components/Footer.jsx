import React from 'react';
import { MessageSquare, Phone, ArrowUp, Trophy, Sparkles, Shield, Flame, Crosshair, Crown } from 'lucide-react';
import { CONTACT_INFO } from '../data/tournamentData';

export default function Footer({ onOpenAdmin, onOpenRegister }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080B10] border-t border-white/10 pt-12 pb-10 sm:pt-16 sm:pb-12 relative overflow-hidden text-slate-100 font-sans select-none shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Tournament Crest */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/buho_hd.png" 
                alt="Logo Compu League 2026" 
                className="w-12 h-12 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 block font-display font-bold">
                  Torneo Oficial UPEC
                </span>
                <span className="text-xl font-black text-white tracking-wider font-display uppercase leading-tight block">
                  COMPU LEAGUE
                </span>
                <span className="text-xs text-amber-400 font-display font-bold tracking-widest uppercase">
                  E-SPORTS 2026
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              El campeonato oficial multiplataforma de deportes electrónicos universitario. Compite, representa a tu carrera y alcanza la gloria.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-display font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Inscripciones Abiertas</span>
            </div>
          </div>

          {/* Col 2: Videojuegos Oficiales */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-display">
              Disciplinas Oficiales
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li className="flex items-center gap-2 hover:text-white transition">
                <Shield className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Valorant (5v5 • Doble Eliminación)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition">
                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Free Fire (Escuadras 4v4 + Solo)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition">
                <Crosshair className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Fortnite (Dúos Battle Royale)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition">
                <Crown className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Clash Royale (1v1 Duelos Bo3)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Torneo Info & Premios */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-display">
              Información del Torneo
            </h4>
            <div className="text-xs text-slate-300 space-y-2 font-sans">
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Estado:</span>
                <strong className="text-emerald-400 font-display font-bold">Fase de Registro</strong>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Fechas:</span>
                <strong className="text-slate-100 font-display font-bold">4, 5 y 6 Noviembre</strong>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Modalidad:</span>
                <strong className="text-sky-300 font-display font-bold">Online / Multiplataforma</strong>
              </p>
              <div className="p-2.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-display text-xs">
                <div className="flex items-center gap-1.5 font-black uppercase">
                  <Trophy className="w-4 h-4 fill-amber-400 shrink-0" />
                  <span>Premios: Efectivo + Trofeo + Medallas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contacto Staff */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-display">
              Contacto y Soporte
            </h4>
            <div className="space-y-2.5">
              <a
                href={CONTACT_INFO.whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/10 hover:border-emerald-400/60 bg-slate-900/80 text-xs text-slate-300 hover:text-emerald-300 transition"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-sans font-medium">WhatsApp: 0962074110</span>
              </a>

              <a
                href={CONTACT_INFO.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/10 hover:border-indigo-400/60 bg-slate-900/80 text-xs text-slate-300 hover:text-indigo-300 transition"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-sans font-medium">Discord Oficial</span>
              </a>

              <button
                onClick={onOpenRegister}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-md transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <Trophy className="w-3.5 h-3.5 fill-slate-950" />
                <span>INSCRIBIRSE AHORA</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans">
          <div>
            © 2026 Compu League E-Sports • Universidad Politécnica Estatal del Carchi
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer uppercase font-display font-bold text-xs"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
