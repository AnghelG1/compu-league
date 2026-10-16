import React from 'react';
import { MessageSquare, Phone, ArrowUp, Shield, Flame, Crosshair, Crown } from 'lucide-react';
import { CONTACT_INFO } from '../data/tournamentData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t-4 border-black pt-12 pb-10 sm:pt-16 sm:pb-12 relative overflow-hidden text-slate-100 font-sans select-none">
      
      {/* Background Cyber Grid */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#FFE600 1px, transparent 1px), linear-gradient(90deg, #FFE600 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b-2 border-white/10">
          
          {/* Col 1: Brand & Tournament Crest */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/buho_pixel_start.png" 
                alt="Logo Compu League 2026" 
                className="w-12 h-12 object-contain shape-crisp drop-shadow-[0_0_10px_rgba(255,230,0,0.5)]"
                style={{ imageRendering: 'pixelated' }}
              />
              <div>
                <span className="font-pixel text-[8px] text-[#FFE600] uppercase block">
                  TORNEO OFICIAL
                </span>
                <span className="text-xl font-black text-white tracking-wider font-display uppercase leading-tight block">
                  COMPU LEAGUE
                </span>
                <span className="font-pixel text-[9px] text-[#FFE600] uppercase">
                  E-SPORTS 2026
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              El torneo oficial de videojuegos de la Carrera de Computación. Compite con tu equipo y participa por premios.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981] text-black border-2 border-black font-pixel text-[8px] font-black uppercase">
              <span className="w-2 h-2 bg-black animate-arcade-blink" />
              <span>INSCRIPCIONES ABIERTAS</span>
            </div>
          </div>

          {/* Col 2: Videojuegos Oficiales */}
          <div className="space-y-3">
            <h4 className="font-pixel text-[10px] uppercase text-[#FFE600] tracking-wider">
              [ 4 SLOTS OFICIALES ]
            </h4>
            <ul className="space-y-2 text-sm font-sans text-slate-300">
              <li className="flex items-center gap-2 hover:text-[#FF0055] transition">
                <Shield className="w-3.5 h-3.5 text-[#FF0055] shrink-0" />
                <span>Valorant (5v5 • Doble Eliminación)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-[#FFE600] transition">
                <Flame className="w-3.5 h-3.5 text-[#FFE600] shrink-0" />
                <span>Free Fire (Escuadras 4v4 + Solo)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-[#00F0FF] transition">
                <Crosshair className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                <span>Fortnite (Dúos Battle Royale)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-[#A855F7] transition">
                <Crown className="w-3.5 h-3.5 text-[#A855F7] shrink-0" />
                <span>Clash Royale (1v1 Duelos Bo3)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Torneo Info & Premios */}
          <div className="space-y-3">
            <h4 className="font-pixel text-[10px] uppercase text-[#FFE600] tracking-wider">
              [ INTEL DEL TORNEO ]
            </h4>
            <div className="text-sm text-slate-300 space-y-2 font-sans">
              <p className="flex items-center justify-between border-b border-white/5 pb-1">
                <span className="text-slate-300">Estado:</span>
                <strong className="text-[#10B981] font-pixel text-[9px]">FASE DE REGISTRO</strong>
              </p>
              <p className="flex items-center justify-between border-b border-white/5 pb-1">
                <span className="text-slate-300">Fechas:</span>
                <strong className="text-white font-bold">4, 5 y 6 Noviembre</strong>
              </p>
              <p className="flex items-center justify-between border-b border-white/5 pb-1">
                <span className="text-slate-300">Modalidad:</span>
                <strong className="text-[#00F0FF] font-bold">Online / Multiplataforma</strong>
              </p>
            </div>
          </div>

          {/* Col 4: Soporte y Staff WhatsApp + Discord Oficial */}
          <div className="space-y-3">
            <h4 className="font-pixel text-[10px] uppercase text-[#FFE600] tracking-wider">
              [ CANALES DE SOPORTE ]
            </h4>
            
            <p className="text-sm text-slate-300 font-sans">
              ¿Dudas sobre inscripciones o transferencias bancarias? Escríbenos directamente:
            </p>

            <div className="space-y-2 pt-1">
              <a
                href={CONTACT_INFO.whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arcade-press shadow-brutal-black flex items-center justify-center gap-2 px-4 py-3 bg-[#10B981] hover:bg-[#15D494] text-black border-2 border-black font-sans font-bold text-sm"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>WhatsApp: {CONTACT_INFO.whatsappStaff}</span>
              </a>

              {/* Discord Oficial en morado */}
              <a
                href={CONTACT_INFO.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-arcade-press shadow-brutal-black w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#5865F2] hover:bg-[#6975F7] text-white border-2 border-black font-sans font-bold text-sm"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>DISCORD OFICIAL</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-pixel text-[8px] sm:text-[9px] text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© 2026 COMPU LEAGUE E-SPORTS</span>
            <span>•</span>
            <span className="text-[#FFE600]">CARRERA DE COMPUTACIÓN</span>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-arcade-press shadow-brutal-black px-3.5 py-2 border-2 border-black bg-[#0B101A] hover:bg-black text-[#FFE600] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <span>SUBIR</span>
            <ArrowUp className="w-3 h-3 stroke-[3]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
