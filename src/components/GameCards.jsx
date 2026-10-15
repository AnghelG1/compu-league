import React, { useState } from 'react';
import { Users, ArrowRight, CheckCircle2, Monitor, Smartphone, Gamepad2 } from 'lucide-react';

// ─── Inline game logo SVGs ─────────────────────────────────────────────────────
const GameLogo = ({ gameId, color }) => {
  if (gameId === 'valorant') return (
    <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
      <path d="M5 12 L30 48 L55 12" stroke={color} strokeWidth="6" strokeLinecap="square" fill="none"/>
      <path d="M5 12 L30 32 L55 12" stroke="white" strokeWidth="2.5" strokeLinecap="square" fill="none" opacity="0.5"/>
    </svg>
  );
  if (gameId === 'free_fire') return (
    <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
      <path d="M30 4 C30 4 17 20 21 32 C16 28 16 28 14 22 C8 33 13 46 26 52 C22 48 22 43 25 39 C26 44 32 48 34 52 C42 45 47 35 43 25 C47 30 48 36 47 41 C55 29 50 13 30 4Z" fill={color}/>
    </svg>
  );
  if (gameId === 'fortnite') return (
    <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
      <path d="M14 8 H46 V17 H34 V24 H44 V33 H34 V52 H24 V33 H14 V8Z" fill="white"/>
      <path d="M24 17 H34 V24 H24 Z" fill={color}/>
    </svg>
  );
  if (gameId === 'clash_royale') return (
    <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
      <path d="M30 5 L37 19 L53 22 L41 34 L44 50 L30 43 L16 50 L19 34 L7 22 L23 19 Z"
        fill={color} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      <circle cx="30" cy="30" r="7" fill="rgba(255,255,255,0.25)"/>
    </svg>
  );
  return null;
};

// ─── Diagonal clip-path helper ─────────────────────────────────────────────────
const CLIP = (size = 16) =>
  `polygon(0 0, calc(100% - ${size}px) 0, 100% ${size}px, 100% 100%, ${size}px 100%, 0 calc(100% - ${size}px))`;

// ─── Games configuration ───────────────────────────────────────────────────────
const GAMES_CONFIG = [
  {
    id: 'valorant',
    name: 'VALORANT',
    badge: 'Doble Eliminación',
    accentColor: '#ff4655',
    accentRgb: '255,70,85',
    image: '/assets/valorant_lobby.jpg',
    fallbackImage: '/assets/valorant.jpg',
    mode: '5v5 Táctico',
    platform: 'PC Exclusivo',
    platformIcon: Monitor,
    price: '$5.00',
    priceNote: '$1 por titular · Suplente gratis',
    buttonText: 'INSCRIBIR EQUIPO (5v5)',
    rules: [
      'Doble eliminación: Winners Bracket, Losers Bracket y Gran Final.',
      'Servidor Santiago, mapas oficiales del circuito competitivo.',
      'Gran Final Bo3 al mejor de 3 mapas con casters en vivo.',
    ],
  },
  {
    id: 'free_fire',
    name: 'FREE FIRE',
    badge: 'Promo 2×1 Automática',
    accentColor: '#f59e0b',
    accentRgb: '245,158,11',
    image: '/assets/free_fire_lobby.jpg',
    fallbackImage: '/assets/free_fire.jpg',
    mode: 'Escuadras (4 jugadores)',
    platform: 'Móvil / Salas privadas',
    platformIcon: Smartphone,
    price: '$4.00',
    priceNote: 'Incluye torneo Individual gratis',
    buttonText: 'INSCRIBIR ESCUADRA',
    rules: [
      '¡Inscripción de escuadra inscribe a todos en el torneo individual gratis!',
      'Salas privadas Battle Royale coordinadas con árbitros oficiales.',
      'Puntaje por posición final + bajas confirmadas acumuladas.',
    ],
  },
  {
    id: 'fortnite',
    name: 'FORTNITE',
    badge: 'Batalla en Dúos',
    accentColor: '#0ea5e9',
    accentRgb: '14,165,233',
    image: '/assets/fortnite_lobby.jpg',
    fallbackImage: '/assets/fortnite.jpg',
    mode: 'Dúos (2 jugadores)',
    platform: 'Crossplay Total',
    platformIcon: Gamepad2,
    price: '$2.00',
    priceNote: '$1 por persona del dúo',
    buttonText: 'INSCRIBIR DÚO',
    rules: [
      'Sala privada Battle Royale en parejas con código exclusivo.',
      'Crossplay abierto: PC, PlayStation, Xbox o Móvil.',
      'Victoria Magistral: último dúo sobreviviente en el círculo final.',
    ],
  },
  {
    id: 'clash_royale',
    name: 'CLASH ROYALE',
    badge: 'Duelos 1v1 Directos',
    accentColor: '#8b5cf6',
    accentRgb: '139,92,246',
    image: '/assets/clash_royale_lobby.jpg',
    fallbackImage: '/assets/clash_royale.jpg',
    mode: '1v1 Individual',
    platform: 'Móvil (Android / iOS)',
    platformIcon: Smartphone,
    price: '$1.00',
    priceNote: 'Inscripción individual directa',
    buttonText: 'INSCRIBIRSE 1v1',
    rules: [
      'Llave eliminatoria directa, duelos al mejor de 3 partidas (Bo3).',
      'Nivel de cartas estándar de torneo (Nivel 11 parejo).',
      'Mazo libre — sin restricciones de cartas evolucionadas.',
    ],
  },
];

export default function GameCards({ onSelectGame }) {
  const [hoveredGame, setHoveredGame] = useState(null);

  return (
    <section
      id="juegos"
      className="relative py-14 sm:py-24 text-slate-100 font-sans select-none overflow-hidden border-b border-white/10"
      style={{ background: '#0A0D14' }}
    >
      {/* Background textures */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div
          className="absolute top-0 inset-x-0 h-64 opacity-20"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(30,58,102,0.8), transparent)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3">
            {/* Skewed label */}
            <div className="flex items-center gap-1">
              <div
                className="px-3 py-1 font-display font-black text-xs uppercase tracking-widest text-slate-950"
                style={{ background: '#f59e0b', transform: 'skewX(-10deg)' }}
              >
                <span className="block" style={{ transform: 'skewX(10deg)' }}>4 Juegos Oficiales</span>
              </div>
              <div
                className="px-3 py-1 font-display font-bold text-xs uppercase tracking-widest text-amber-300"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  transform: 'skewX(-10deg)',
                  marginLeft: '3px',
                }}
              >
                <span className="block" style={{ transform: 'skewX(10deg)' }}>Mismo Torneo</span>
              </div>
            </div>

            <h2
              className="font-black font-display uppercase text-white leading-tight"
              style={{
                fontSize: 'clamp(28px, 5vw, 52px)',
                fontStyle: 'italic',
                letterSpacing: '-0.01em',
              }}
            >
              FORMATOS Y REGLAS DE BATALLA
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl font-sans">
              Inscribe tu escuadra en uno o varios títulos. Premios independientes por disciplina — compite en lo que dominas.
            </p>
          </div>

          <div
            className="shrink-0 flex items-center gap-2 px-4 py-2 font-display font-bold text-xs uppercase tracking-wider text-amber-400 self-start md:self-auto"
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              clipPath: CLIP(8),
            }}
          >
            <span>4, 5 y 6 de Noviembre 2026</span>
          </div>
        </div>

        {/* 2×2 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {GAMES_CONFIG.map((game) => {
            const PlatformIcon = game.platformIcon;
            const isHovered = hoveredGame === game.id;

            return (
              <div
                key={game.id}
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
                className="flex flex-col justify-between transition-all duration-300 overflow-hidden group"
                style={{
                  background: 'linear-gradient(160deg, #131A29 0%, #0D121C 100%)',
                  border: `1px solid ${isHovered ? game.accentColor + '80' : 'rgba(255,255,255,0.08)'}`,
                  clipPath: CLIP(20),
                  boxShadow: isHovered
                    ? `0 0 40px rgba(${game.accentRgb},0.2), 0 8px 32px rgba(0,0,0,0.5)`
                    : '0 4px 24px rgba(0,0,0,0.4)',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
              >
                {/* ── Card Image Banner ─────────────────────────────── */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    onError={(e) => { e.target.src = game.fallbackImage; }}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(0.85) contrast(1.05)' }}
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, #131A29 0%, rgba(19,26,41,0.5) 50%, transparent 100%)`,
                    }}
                  />
                  {/* Accent color tint overlay on hover */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(ellipse at 50% 100%, rgba(${game.accentRgb},0.15), transparent 70%)`,
                      opacity: isHovered ? 1 : 0,
                    }}
                  />

                  {/* Badge top-right */}
                  <div className="absolute top-3 right-3">
                    <span
                      className="px-2.5 py-1 font-display font-bold text-[10px] uppercase tracking-widest backdrop-blur-sm"
                      style={{
                        background: `rgba(${game.accentRgb},0.2)`,
                        border: `1px solid rgba(${game.accentRgb},0.5)`,
                        color: game.accentColor,
                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                      }}
                    >
                      {game.badge}
                    </span>
                  </div>

                  {/* Game title over image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3 z-10">
                    {/* Real game logo SVG */}
                    <div
                      className="w-11 h-11 shrink-0 flex items-center justify-center p-1.5"
                      style={{
                        background: `rgba(${game.accentRgb},0.15)`,
                        border: `1px solid rgba(${game.accentRgb},0.4)`,
                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                      }}
                    >
                      <GameLogo gameId={game.id} color={game.accentColor} />
                    </div>
                    <div>
                      <h3
                        className="font-black font-display uppercase leading-none text-white drop-shadow-md"
                        style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontStyle: 'italic', letterSpacing: '-0.01em' }}
                      >
                        {game.name}
                      </h3>
                      <span className="text-xs font-sans font-medium" style={{ color: `rgba(${game.accentRgb},0.9)` }}>
                        {game.mode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Card Body ─────────────────────────────────────── */}
                <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col">

                  {/* Spec grid — uniform 3 columns for all 4 games */}
                  <div
                    className="grid grid-cols-3 gap-0 text-center"
                    style={{
                      background: 'rgba(10,14,23,0.8)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      clipPath: CLIP(8),
                    }}
                  >
                    {[
                      { label: 'Modalidad', value: game.mode },
                      { label: 'Plataforma', value: game.platform },
                      { label: 'Inscripción', value: game.price, accent: true },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className="py-2.5 px-2 space-y-0.5"
                        style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                      >
                        <div className="text-[9px] font-display font-bold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-1">
                          {i === 1 && <PlatformIcon className="w-2.5 h-2.5" />}
                          {spec.label}
                        </div>
                        <div
                          className={`text-xs sm:text-sm font-bold font-display leading-tight truncate px-1 ${
                            spec.accent ? '' : 'text-slate-100'
                          }`}
                          style={spec.accent ? { color: game.accentColor } : {}}
                        >
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rules list */}
                  <div className="space-y-2 flex-1">
                    {game.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        <span
                          className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center font-black font-display text-[9px]"
                          style={{
                            background: `rgba(${game.accentRgb},0.15)`,
                            color: game.accentColor,
                            border: `1px solid rgba(${game.accentRgb},0.3)`,
                            clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))',
                          }}
                        >
                          ✓
                        </span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer: price note + CTA */}
                  <div
                    className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <span className="text-xs text-slate-500 font-sans text-center sm:text-left">{game.priceNote}</span>

                    <button
                      onClick={() => onSelectGame(game.id)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 font-display font-black text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-95"
                      style={{
                        background: game.id === 'free_fire'
                          ? `linear-gradient(90deg, ${game.accentColor}, #fbbf24)`
                          : `linear-gradient(90deg, ${game.accentColor}cc, ${game.accentColor})`,
                        color: game.id === 'free_fire' ? '#0a0d14' : 'white',
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                        boxShadow: `0 0 20px rgba(${game.accentRgb},0.3)`,
                      }}
                    >
                      <span>{game.buttonText}</span>
                      <ArrowRight className="w-4 h-4 flex-shrink-0" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
