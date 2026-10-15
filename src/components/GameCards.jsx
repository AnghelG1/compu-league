import React, { useState } from 'react';
import { ArrowRight, Check, Monitor, Smartphone, Gamepad2, Coins } from 'lucide-react';

// ─── Real Game Logos in SVG ───────────────────────────────────────────────────
const GameLogo = ({ gameId, color }) => {
  if (gameId === 'valorant') return (
    <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
      <path d="M5 12 L30 48 L55 12" stroke={color} strokeWidth="6" strokeLinecap="square" fill="none"/>
      <path d="M5 12 L30 32 L55 12" stroke="white" strokeWidth="2.5" strokeLinecap="square" fill="none" opacity="0.6"/>
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
      <path d="M30 5 L37 19 L53 22 L41 34 L44 50 L30 43 L16 50 L19 34 L7 22 L23 19 Z" fill={color} stroke="white" strokeWidth="1.5"/>
      <circle cx="30" cy="30" r="7" fill="white" opacity="0.4"/>
    </svg>
  );
  return null;
};

const ARCADE_GAMES = [
  {
    id: 'valorant',
    slot: 'SLOT 01 // 5v5 TACTICO',
    name: 'VALORANT',
    badge: 'WINNERS & LOSERS',
    accentColor: '#FF0055',
    bgBorder: 'border-[#FF0055]',
    shadowClass: 'shadow-brutal-pink',
    image: '/assets/valorant_lobby.jpg',
    fallbackImage: '/assets/valorant.jpg',
    imagePosition: 'object-center',
    coinPrice: '$5.00',
    coinDetail: '$1.00 POR TITULAR • SUPLENTE GRATIS',
    difficulty: '[█████████░] COMPETITIVO',
    difficultyLevel: 'DIFICULTAD: ALTA',
    players: '5 TITULARES + 1 SUPLENTE',
    platform: 'PC EXCLUSIVO',
    platformIcon: Monitor,
    buttonText: '[ REGISTRAR 5V5 ]',
    rules: [
      'Doble eliminación oficial con Winners Bracket y Losers Bracket.',
      'Servidor Santiago. Mapas oficiales del circuito competitivo.',
      'Gran Final Bo3 al mejor de 3 mapas con casters y streaming.',
    ],
  },
  {
    id: 'free_fire',
    slot: 'SLOT 02 // ESCUADRAS',
    name: 'FREE FIRE',
    badge: 'PROMO 2X1 AUTO',
    accentColor: '#FFE600',
    bgBorder: 'border-[#FFE600]',
    shadowClass: 'shadow-brutal-yellow',
    image: '/assets/free_fire_lobby.jpg',
    fallbackImage: '/assets/free_fire.jpg',
    imagePosition: 'object-center',
    coinPrice: '$4.00',
    coinDetail: '¡INCLUYE TORNEO INDIVIDUAL GRATIS!',
    difficulty: '[███████░░░] SURVIVAL',
    difficultyLevel: 'DIFICULTAD: MEDIA',
    players: '4 JUGADORES (ESCUADRA)',
    platform: 'MOVIL / SALAS PRIVADAS',
    platformIcon: Smartphone,
    buttonText: '[ INSCRIBIR ESCUADRA ]',
    rules: [
      'Inscribir tu escuadra inscribe automáticamente a todos al torneo individual gratis.',
      'Salas privadas Battle Royale coordinadas con árbitros oficiales del torneo.',
      'Puntaje acumulativo oficial por posición final y bajas confirmadas.',
    ],
  },
  {
    id: 'fortnite',
    slot: 'SLOT 03 // DUOS CROSSPLAY',
    name: 'FORTNITE',
    badge: 'CROSSPLAY TOTAL',
    accentColor: '#00F0FF',
    bgBorder: 'border-[#00F0FF]',
    shadowClass: 'shadow-brutal-cyan',
    image: '/assets/fortnite_lobby.jpg',
    fallbackImage: '/assets/fortnite.jpg',
    imagePosition: 'object-center',
    coinPrice: '$2.00',
    coinDetail: '$1.00 POR INTEGRANTE DEL DUO',
    difficulty: '[████████░░] VELOCIDAD',
    difficultyLevel: 'DIFICULTAD: ALTA',
    players: '2 JUGADORES (DUO)',
    platform: 'PC / CONSOLA / MOVIL',
    platformIcon: Gamepad2,
    buttonText: '[ INSCRIBIR DUO ]',
    rules: [
      'Sala privada Battle Royale en parejas con código exclusivo de servidor.',
      'Crossplay 100% abierto: compite desde PC, PlayStation, Xbox o Móvil.',
      'Victoria Magistral: gana la última pareja en pie dentro de la tormenta final.',
    ],
  },
  {
    id: 'clash_royale',
    slot: 'SLOT 04 // ESTRATEGIA 1v1',
    name: 'CLASH ROYALE',
    badge: 'DUELOS BO3',
    accentColor: '#A855F7',
    bgBorder: 'border-[#A855F7]',
    shadowClass: 'shadow-brutal-purple',
    image: '/assets/clash_royale_lobby.jpg',
    fallbackImage: '/assets/clash_royale.jpg',
    imagePosition: 'object-top',
    coinPrice: '$1.00',
    coinDetail: 'INSCRIPCION INDIVIDUAL DIRECTA',
    difficulty: '[██████░░░░] ESTRATEGIA',
    difficultyLevel: 'DIFICULTAD: TACTICA',
    players: '1 JUGADOR (SOLITARIO)',
    platform: 'MOVIL (ANDROID / IOS)',
    platformIcon: Smartphone,
    buttonText: '[ INSCRIBIRSE 1V1 ]',
    rules: [
      'Llave eliminatoria directa en duelos al mejor de 3 partidas (Bo3).',
      'Nivel parejo oficial de torneo: cartas fijas en Nivel 11 estándar.',
      'Mazo libre sin restricciones de cartas evolucionadas o campeones.',
    ],
  },
];

export default function GameCards({ onSelectGame }) {
  const [activeSlot, setActiveSlot] = useState(null);

  return (
    <section 
      id="juegos" 
      className="py-14 sm:py-24 bg-[#05070C] text-slate-100 font-sans select-none border-b-4 border-black relative overflow-hidden"
    >
      {/* Background Subtle Cyber Lines */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#FFE600 1px, transparent 1px), linear-gradient(90deg, #FFE600 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header (Arcade Slot Selection Machine) ─────────────── */}
        <div className="bg-[#0B101A] border-2 border-black p-5 sm:p-6 mb-10 shadow-brutal-black">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#FFE600] text-black font-pixel text-[9px] sm:text-[10px] px-2.5 py-1 border border-black font-black uppercase">
                  [ 4 JUEGOS OFICIALES ]
                </span>
                <span className="bg-black text-[#00F0FF] font-pixel text-[9px] sm:text-[10px] px-2.5 py-1 border border-[#00F0FF]">
                  ELIGE TU JUEGO
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white leading-none">
                SELECCION DE JUEGOS <span className="text-[#FFE600]">// CARTUCHOS ARCADE</span>
              </h2>

              <p className="text-slate-300 font-cyber text-xs sm:text-sm max-w-2xl">
                Cada videojuego cuenta con su propio fixture, árbitros y premios en efectivo. Inscribe a tu equipo en el juego correspondiente.
              </p>
            </div>

            <div className="bg-black border-2 border-[#FFE600] p-3 font-pixel text-[9px] sm:text-[10px] text-[#FFE600] self-start md:self-auto shrink-0 shadow-brutal-yellow">
              <div className="animate-arcade-blink">★ TORNEO MULTIPLATAFORMA</div>
              <div className="text-slate-400 mt-1">4, 5 Y 6 NOVIEMBRE 2026</div>
            </div>

          </div>
        </div>

        {/* ── 4 Arcade Slots Grid (Cartuchos de Arcade) ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {ARCADE_GAMES.map((game) => {
            const PlatformIcon = game.platformIcon;
            const isHovered = activeSlot === game.id;

            return (
              <div
                key={game.id}
                onMouseEnter={() => setActiveSlot(game.id)}
                onMouseLeave={() => setActiveSlot(null)}
                className={`bg-[#0B101A] border-4 ${game.bgBorder} ${game.shadowClass} flex flex-col justify-between transition-all duration-150`}
              >
                {/* 1. Cartridge Header Bar */}
                <div className="bg-black border-b-2 border-black p-2.5 px-4 flex items-center justify-between font-pixel text-[9px] sm:text-[10px]">
                  <span className="text-white font-bold tracking-wider">
                    {game.slot}
                  </span>
                  <span 
                    className="px-2 py-0.5 border text-black font-black"
                    style={{ backgroundColor: game.accentColor, borderColor: '#000' }}
                  >
                    {game.badge}
                  </span>
                </div>

                {/* 2. CRT Screen Display with 80s Scanlines */}
                <div className="crt-monitor-screen relative h-48 sm:h-56 w-full bg-black border-b-2 border-black overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    onError={(e) => { e.target.src = game.fallbackImage; }}
                    className={`w-full h-full object-cover ${game.imagePosition || 'object-center'} filter brightness-90 group-hover:scale-105 transition-transform duration-300`}
                  />

                  {/* Top-Right HUD Badge */}
                  <div className="absolute top-3 right-3 z-20 font-pixel text-[9px] bg-black/90 text-white px-2 py-1 border border-white/30">
                    <span className="text-[#FFE600]">ESTADO:</span> ACTIVO
                  </div>

                  {/* In-Game HUD overlay at bottom of screen */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 z-20 flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      {/* Real Game Logo */}
                      <div 
                        className="w-12 h-12 bg-black border-2 p-1.5 shrink-0 flex items-center justify-center shadow-brutal-black"
                        style={{ borderColor: game.accentColor }}
                      >
                        <GameLogo gameId={game.id} color={game.accentColor} />
                      </div>

                      <div>
                        <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none drop-shadow-[2px_2px_0px_#000]">
                          {game.name}
                        </h3>
                        <span className="font-pixel text-[9px] text-[#FFE600] block mt-0.5">
                          {game.players}
                        </span>
                      </div>
                    </div>

                    <div className="bg-black/90 border border-white/20 px-2 py-1 font-pixel text-[9px] text-right">
                      <div className="text-slate-400 text-[8px]">PLATAFORMA</div>
                      <div className="text-white flex items-center gap-1 justify-end">
                        <PlatformIcon className="w-3 h-3 text-[#00F0FF]" />
                        <span className="text-[8px]">{game.platform}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Cartridge Specs & Difficulty Panel */}
                <div className="p-4 sm:p-5 space-y-4 bg-[#090D15]">
                  
                  {/* Arcade Meter Row: Price & Difficulty */}
                  <div className="grid grid-cols-2 gap-2 bg-black border-2 border-white/10 p-3">
                    
                    {/* Coin Price */}
                    <div>
                      <div className="font-pixel text-[8px] text-slate-400 uppercase flex items-center gap-1">
                        <Coins className="w-3 h-3 text-[#FFE600]" />
                        <span>VALOR DE FICHA:</span>
                      </div>
                      <div className="font-pixel text-lg sm:text-xl text-[#FFE600] mt-1 font-black">
                        {game.coinPrice} <span className="text-[9px] text-slate-300">USD</span>
                      </div>
                      <div className="font-cyber text-[10px] text-slate-400 truncate mt-0.5">
                        {game.coinDetail}
                      </div>
                    </div>

                    {/* Difficulty Meter */}
                    <div className="border-l border-white/10 pl-3">
                      <div className="font-pixel text-[8px] text-slate-400 uppercase">
                        NIVEL DE RETO:
                      </div>
                      <div 
                        className="font-pixel text-xs sm:text-sm mt-1 font-black truncate"
                        style={{ color: game.accentColor }}
                      >
                        {game.difficulty}
                      </div>
                      <div className="font-cyber text-[10px] text-slate-400 mt-0.5">
                        {game.difficultyLevel}
                      </div>
                    </div>

                  </div>

                  {/* Clean Modern Rules in Chakra Petch (High legibility) */}
                  <div className="space-y-2 border-l-2 border-white/20 pl-3 py-1">
                    <div className="font-pixel text-[8px] text-[#FFE600] uppercase tracking-wider mb-1">
                      // FORMATO OFICIAL DEL TORNEO:
                    </div>
                    {game.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 font-cyber leading-tight">
                        <span 
                          className="font-pixel text-[9px] shrink-0 mt-0.5 font-black"
                          style={{ color: game.accentColor }}
                        >
                          ▶
                        </span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* 4. Physical Arcade Button (Sinks on click) */}
                <div className="p-4 sm:p-5 pt-0 bg-[#090D15]">
                  <button
                    type="button"
                    onClick={() => onSelectGame(game.id)}
                    className={`btn-arcade-press w-full py-3.5 px-4 font-pixel text-xs sm:text-sm uppercase font-black border-2 border-black cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${game.shadowClass}`}
                    style={{
                      backgroundColor: game.accentColor,
                      color: game.id === 'free_fire' ? '#000' : (game.id === 'fortnite' ? '#000' : '#FFF'),
                    }}
                  >
                    <span>{game.buttonText}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3] shrink-0" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
