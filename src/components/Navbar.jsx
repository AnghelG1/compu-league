import React, { useState } from 'react';
import { Menu, X, Trophy, Flame } from 'lucide-react';

export default function Navbar({ 
  onOpenRegister, 
  activeSection, 
  setActiveSection,
  playerName = '',
  onReturnToMenu = null,
  onNavigate = null
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { id: 'juegos', label: 'Juegos' },
    { id: 'participantes', label: 'Participantes' },
    { id: 'brackets', label: 'Brackets' },
    { id: 'cronograma', label: 'Cronograma' },
  ];

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      setActiveSection(id);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="h-16 sm:h-20 border-b border-white/10 bg-[#0B0E14]/95 backdrop-blur-md sticky top-0 z-50 text-slate-100 font-sans select-none shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo with large crisp shield */}
        <div 
          onClick={() => handleNavClick('inicio')}
          title="Ir al Inicio - Compu League 2026"
          className="flex items-center gap-3 sm:gap-3.5 cursor-pointer group shrink-0 select-none py-1 transition-all"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-sky-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <img 
              src="/assets/buho_hd.png" 
              alt="Escudo Oficial Compu League 2026" 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform relative z-10"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`text-lg sm:text-2xl font-black font-display tracking-wider transition-colors leading-none ${
                activeSection === 'inicio' ? 'text-amber-400' : 'text-white group-hover:text-amber-400'
              }`}>
                COMPU LEAGUE
              </span>
            </div>
            <span className="text-[10px] sm:text-xs tracking-[0.2em] text-amber-400/90 font-bold font-display uppercase leading-tight mt-0.5">
              E-SPORTS 2026
            </span>
          </div>
        </div>

        {/* Center: Modern Esports Navigation Links (No brackets) */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative px-3.5 xl:px-4 py-2 font-display text-sm tracking-wider uppercase font-bold transition-all flex flex-col items-center cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive ? 'text-amber-400 font-extrabold' : isHovered ? 'text-white' : 'text-slate-400'
                }`}
              >
                <span>{item.label}</span>
                {/* Active indicator bar */}
                <span className={`absolute bottom-0 inset-x-2 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-200 ${
                  isActive ? 'opacity-100 scale-x-100 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : isHovered ? 'opacity-50 scale-x-75' : 'opacity-0 scale-x-0'
                }`} />
              </button>
            );
          })}
        </nav>

        {/* Right: Modern High-Impact CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Primary CTA: INSCRIBIRSE (No brackets, glowing Esports button) */}
          <button
            onClick={onOpenRegister}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-extrabold text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transform hover:scale-[1.02] active:scale-[0.98] rounded-sm"
          >
            <Trophy className="w-4 h-4 fill-slate-950 shrink-0" />
            <span>INSCRIBIRSE</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú de navegación"
            className="lg:hidden p-2.5 rounded border border-white/10 bg-slate-900 text-slate-200 hover:text-amber-400 hover:border-amber-400/50 transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0E131D]/98 backdrop-blur-xl p-5 space-y-3 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          <div className="text-xs font-display tracking-widest text-amber-400 uppercase font-bold pb-2 border-b border-white/10 flex items-center justify-between">
            <span>COMPU LEAGUE 2026</span>
            <span className="text-[10px] text-emerald-400 font-mono">INSCRIPCIONES ABIERTAS</span>
          </div>

          <button
            onClick={() => handleNavClick('inicio')}
            className={`w-full text-left px-3.5 py-3 rounded border ${
              activeSection === 'inicio' ? 'border-amber-400/60 bg-amber-400/10 text-amber-400 font-bold' : 'border-white/5 text-slate-200'
            } hover:border-amber-400/40 hover:text-white bg-slate-900/60 text-sm font-display tracking-wider uppercase flex items-center justify-between`}
          >
            <span>Inicio</span>
          </button>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3.5 py-3 rounded border ${
                activeSection === item.id ? 'border-amber-400/60 bg-amber-400/10 text-amber-400 font-bold' : 'border-white/5 text-slate-200'
              } hover:border-amber-400/40 hover:text-white bg-slate-900/60 text-sm font-display tracking-wider uppercase flex items-center justify-between`}
            >
              <span>{item.label}</span>
            </button>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRegister();
            }}
            className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-extrabold text-sm uppercase tracking-wider rounded-sm shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4 fill-slate-950" />
            <span>INSCRIBIRSE AHORA</span>
          </button>
        </div>
      )}
    </header>
  );
}
