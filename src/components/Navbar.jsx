import React, { useState } from 'react';
import { Menu, X, Zap, Flame } from 'lucide-react';

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
            <img 
              src="/assets/buho_pixel_start.png" 
              alt="Escudo Pixel Art Compu League 2026" 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain shape-crisp drop-shadow-[0_0_12px_rgba(255,230,0,0.5)] group-hover:scale-105 transition-transform relative z-10"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`text-lg sm:text-2xl font-black font-display tracking-wider transition-colors leading-none ${
                activeSection === 'inicio' ? 'text-[#FFE600]' : 'text-white group-hover:text-[#FFE600]'
              }`}>
                COMPU LEAGUE
              </span>
            </div>
            <span className="text-[10px] sm:text-xs tracking-[0.2em] text-[#FFE600] font-pixel uppercase leading-tight mt-0.5">
              E-SPORTS 2026
            </span>
          </div>
        </div>

        {/* Center: Modern Esports Navigation Links */}
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
                className={`relative px-3.5 xl:px-4 py-2 font-pixel text-[10px] sm:text-[11px] tracking-wider uppercase transition-all flex flex-col items-center cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive ? 'text-[#FFE600] font-black' : isHovered ? 'text-white' : 'text-slate-400'
                }`}
              >
                <span>{item.label}</span>
                {/* Active indicator bar */}
                <span className={`absolute bottom-0 inset-x-2 h-1 bg-[#FFE600] transition-all duration-150 ${
                  isActive ? 'opacity-100 scale-x-100' : isHovered ? 'opacity-50 scale-x-75' : 'opacity-0 scale-x-0'
                }`} />
              </button>
            );
          })}
        </nav>

        {/* Right: Neo-Brutalist Arcade CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Primary CTA: INSCRIBIRSE (Physical Arcade Sinking Button) */}
          <button
            onClick={onOpenRegister}
            className="btn-arcade-press shadow-brutal-yellow hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFE600] hover:bg-[#FFF04D] text-black border-2 border-black font-pixel font-black text-xs uppercase tracking-wider cursor-pointer whitespace-nowrap shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-black shrink-0" />
            <span>INSCRIBIRSE</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú de navegación"
            className="lg:hidden p-2.5 border-2 border-black bg-black text-[#FFE600] shadow-brutal-black transition-colors focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b-4 border-black bg-[#0A0E17] p-5 space-y-3 shadow-2xl">
          <div className="font-pixel text-[9px] text-[#FFE600] uppercase font-bold pb-2 border-b-2 border-white/10 flex items-center justify-between">
            <span>COMPU LEAGUE 2026</span>
            <span className="text-[#00F0FF]">CREDITS: 00</span>
          </div>

          <button
            onClick={() => handleNavClick('inicio')}
            className={`w-full text-left px-3.5 py-3 border-2 ${
              activeSection === 'inicio' ? 'border-[#FFE600] bg-[#FFE600] text-black font-black' : 'border-white/10 text-white bg-black'
            } font-pixel text-xs tracking-wider uppercase flex items-center justify-between cursor-pointer`}
          >
            <span>[ INICIO ]</span>
          </button>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3.5 py-3 border-2 ${
                activeSection === item.id ? 'border-[#FFE600] bg-[#FFE600] text-black font-black' : 'border-white/10 text-white bg-black'
              } font-pixel text-xs tracking-wider uppercase flex items-center justify-between cursor-pointer`}
            >
              <span>[ {item.label} ]</span>
            </button>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRegister();
            }}
            className="btn-arcade-press shadow-brutal-yellow w-full mt-3 py-3.5 bg-[#FFE600] text-black font-pixel font-black text-xs uppercase tracking-wider border-2 border-black flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>INSCRIBIRSE</span>
          </button>
        </div>
      )}
    </header>
  );
}
