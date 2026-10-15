import React, { useState } from 'react';
import { Menu, X, MessageSquare } from 'lucide-react';

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
    { id: 'juegos', label: 'JUEGOS' },
    { id: 'participantes', label: 'PARTICIPANTES' },
    { id: 'brackets', label: 'BRACKETS' },
    { id: 'cronograma', label: 'CRONOGRAMA' },
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
    <header className="h-16 border-b-4 border-[#334a73] bg-[#1a2742]/95 backdrop-blur-md sticky top-0 z-50 text-slate-100 font-['Press_Start_2P',monospace] select-none shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo as Primary Home Link (Merged with Inicio) */}
        <div 
          onClick={() => handleNavClick('inicio')}
          title="Ir al Inicio (Compu League 2026)"
          className="flex items-center gap-3 cursor-pointer group shrink-0 select-none py-1 transition-all"
        >
          <img 
            src="/assets/buho_pixel_start.png" 
            alt="Compu League 2026" 
            className="w-10 h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform"
            style={{ imageRendering: 'pixelated' }}
          />

          <div className="flex flex-col">
            <span className={`text-base sm:text-lg font-bold tracking-wider transition-colors font-['Silkscreen',monospace] leading-tight ${
              activeSection === 'inicio' ? 'text-yellow-300' : 'text-white group-hover:text-yellow-300'
            }`}>
              COMPU LEAGUE
            </span>
            <span className="text-[9px] tracking-widest text-yellow-300/90 uppercase leading-tight font-mono">
              E-SPORTS 2026
            </span>
          </div>
        </div>

        {/* Center: Clean Retro Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative px-2.5 xl:px-3 py-2 text-[10px] transition-colors flex items-center cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive || isHovered ? 'text-yellow-300' : 'text-[#94a9c9]'
                }`}
              >
                <span className="whitespace-nowrap tracking-wide">[ {item.label} ]</span>
              </button>
            );
          })}
        </nav>

        {/* Right Corner: Botón INSCRIBIRSE */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Primary CTA: INSCRIBIRSE */}
          <button
            onClick={onOpenRegister}
            onMouseEnter={() => setHoveredItem('cta')}
            onMouseLeave={() => setHoveredItem(null)}
            className="group relative inline-flex items-center px-3.5 sm:px-4 py-2 border-2 border-[#476799] hover:border-yellow-300 bg-[#233559] hover:bg-[#2b426f] text-slate-100 hover:text-yellow-300 text-[10px] sm:text-xs uppercase transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">[ INSCRIBIRSE ]</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 border-2 border-[#3b5482] bg-[#1d2b47] text-slate-100 hover:text-yellow-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b-4 border-[#334a73] bg-[#1a2742] p-4 space-y-3 animate-fadeIn">
          <div className="text-[9px] text-yellow-300 font-['Silkscreen',monospace] pb-2 border-b border-[#2d4268] text-center">
            ★ COMPU LEAGUE E-SPORTS 2026 ★
          </div>

          <button
            onClick={() => handleNavClick('inicio')}
            className={`w-full text-left p-2.5 border-2 ${
              activeSection === 'inicio' ? 'border-yellow-300 text-yellow-300' : 'border-[#2d4268] text-slate-100'
            } hover:border-[#60a5fa] hover:text-yellow-300 bg-[#213254] text-xs flex items-center justify-between`}
          >
            <div className="flex items-center gap-2">
              <span>INICIO</span>
            </div>
          </button>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left p-2.5 border-2 border-[#2d4268] hover:border-[#60a5fa] hover:text-yellow-300 bg-[#213254] text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[8px] px-1.5 py-0.5 bg-red-600 text-white font-bold">
                  LIVE
                </span>
              )}
            </button>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRegister();
            }}
            className="w-full py-3 border-2 border-yellow-300 bg-yellow-300 text-black font-bold text-xs uppercase"
          >
            [ INSCRIBIRSE AHORA ]
          </button>
        </div>
      )}
    </header>
  );
}
