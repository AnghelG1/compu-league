import React from 'react';
import { ArrowRight, Coins } from 'lucide-react';

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
    logo: '/assets/game-logos/valorant.svg',
    coinPrice: '$5.00',
    coinDetail: '$1.00 POR TITULAR • SUPLENTE GRATIS',
    attributes: ['COMPETITIVO', 'TÁCTICO'],
    players: '5 TITULARES + 1 SUPLENTE',
    buttonText: 'REGISTRAR 5V5',
    rules: [
      'Doble eliminación oficial con Winners Bracket y Losers Bracket.',
      'Mapas oficiales del circuito competitivo.',
      'Gran Final Bo3 al mejor de 3 mapas con casters y streaming.',
    ],
  },
  {
    id: 'free_fire',
    slot: 'SLOT 02 // ESCUADRAS',
    name: 'FREE FIRE',
    badge: 'BATTLE ROYALE',
    accentColor: '#FFE600',
    bgBorder: 'border-[#FFE600]',
    shadowClass: 'shadow-brutal-yellow',
    image: '/assets/free_fire_lobby.jpg',
    fallbackImage: '/assets/free_fire.jpg',
    imagePosition: 'object-center',
    coinPrice: '$4.00',
    individualPrice: '$1.00',
    attributes: ['BATTLE ROYALE', 'SUPERVIVENCIA'],
    playerModes: ['4 JUGADORES (ESCUADRA)', '· SOLITARIO'],
    logo: '/assets/free_fire_lobby.jpg',
    logoDisplay: 'crop',
    buttonText: 'INSCRIBIR ESCUADRA',
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
    imagePosition: 'object-bottom',
    logo: '/assets/game-logos/fortnite.svg',
    coinPrice: '$2.00',
    coinDetail: '$1.00 POR INTEGRANTE DEL DUO',
    attributes: ['BATTLE ROYALE', 'CROSSPLAY'],
    players: '2 JUGADORES (DUO)',
    buttonText: 'INSCRIBIR DUO',
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
    accentColor: '#C084FC',
    bgBorder: 'border-[#C084FC]',
    shadowClass: 'shadow-brutal-purple',
    image: '/assets/clash_royale_lobby.jpg',
    fallbackImage: '/assets/clash_royale.jpg',
    imagePosition: 'object-top',
    logo: '/assets/clash_royale_lobby.jpg',
    logoDisplay: 'clash-crop',
    coinPrice: '$1.00',
    coinDetail: 'INSCRIPCION INDIVIDUAL DIRECTA',
    attributes: ['ESTRATEGIA', '1V1'],
    players: '1 JUGADOR (SOLITARIO)',
    buttonText: 'INSCRIBIRSE 1V1',
    rules: [
      'Llave eliminatoria directa en duelos al mejor de 3 partidas (Bo3).',
      'Nivel parejo oficial de torneo: cartas fijas en Nivel 11 estándar.',
      'Mazo libre sin restricciones de cartas evolucionadas o campeones.',
    ],
  },
];

export default function GameCards({ onSelectGame }) {
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
                SELECCION DE JUEGOS
              </h2>

              <p className="text-slate-300 font-cyber text-xs sm:text-sm max-w-2xl">
                Compite en tu juego favorito, supera a tus rivales y lucha por el primer lugar. ¡La victoria te espera!
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
            return (
              <div
                key={game.id}
                id={`game-card-${game.id}`}
                className={`h-full bg-[#0B101A] border-4 ${game.bgBorder} ${game.shadowClass} flex flex-col transition-all duration-150`}
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
                <div className="crt-monitor-screen relative h-48 sm:h-56 w-full shrink-0 bg-black border-b-2 border-black overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    onError={(e) => { e.target.src = game.fallbackImage; }}
                    className={`w-full h-full object-cover ${game.imagePosition || 'object-center'} filter brightness-90 group-hover:scale-105 transition-transform duration-300`}
                  />

                  {/* In-Game HUD overlay at bottom of screen */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 z-20 flex items-end">
                    <div className="flex items-center gap-3">
                      {/* Real Game Logo */}
                      <div 
                        className={`relative ${game.logoDisplay === 'clash-crop' ? 'w-24' : 'w-16 sm:w-20'} h-12 bg-black border-2 p-1.5 shrink-0 flex items-center justify-center overflow-hidden shadow-brutal-black`}
                        style={{ borderColor: game.accentColor }}
                      >
                        <img
                          src={game.logo}
                          alt=""
                          aria-hidden="true"
                          className={
                            game.logoDisplay === 'crop'
                              ? 'absolute left-0 top-0 w-[320px] max-w-none h-auto'
                              : game.logoDisplay === 'clash-crop'
                                ? 'absolute left-[-52px] top-[-18px] w-[180px] max-w-none h-auto'
                                : 'w-full h-full object-contain'
                          }
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-none drop-shadow-[2px_2px_0px_#000]">
                          {game.name}
                        </h3>
                        <span className="font-pixel text-[9px] text-[#FFE600] flex flex-wrap gap-x-2 gap-y-0.5 mt-1 min-h-[1.5em]">
                          {game.playerModes
                            ? game.playerModes.map((mode) => <span key={mode}>{mode}</span>)
                            : game.players}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. Cartridge Specs & Game Attributes */}
                <div className="p-4 sm:p-5 space-y-4 bg-[#090D15]">
                  
                  {/* Arcade Meter Row: Price & Game Attributes */}
                  <div className="grid grid-cols-[1fr_auto] items-center gap-3 bg-black border-2 border-white/10 p-3">
                    
                    {/* Coin Price */}
                    <div>
                      <div className="font-pixel text-[8px] text-slate-300 uppercase flex items-center gap-1">
                        <Coins className="w-3 h-3 text-[#FFE600]" />
                        <span>VALOR DE FICHA:</span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-pixel text-lg sm:text-xl text-[#FFE600] font-black">
                        <span className="inline-flex items-baseline gap-1">
                          <span>{game.coinPrice}</span>
                          <span className="text-[9px] text-slate-300">USD</span>
                          {game.individualPrice && <span className="text-[9px] text-slate-300">ESCUADRA</span>}
                        </span>
                        {game.individualPrice && (
                          <span className="inline-flex items-baseline gap-1">
                            <span>{game.individualPrice}</span>
                            <span className="text-[9px] text-slate-300">USD</span>
                            <span className="text-[9px] text-slate-300">INDIVIDUAL</span>
                          </span>
                        )}
                      </div>
                      {game.coinDetail && (
                        <div className="font-cyber text-xs text-slate-300 leading-snug mt-1">
                          {game.coinDetail}
                        </div>
                      )}
                    </div>

                    <div className="border-l border-white/10 pl-3 flex max-w-44 flex-wrap justify-end gap-1.5">
                      {game.attributes.map((attribute) => (
                        <span
                          key={attribute}
                          className="border px-1.5 py-1 text-center font-pixel text-[8px] leading-tight"
                          style={{ borderColor: `${game.accentColor}80`, color: game.accentColor }}
                        >
                          {attribute}
                        </span>
                      ))}
                    </div>

                  </div>

                  <details className="group border-t border-white/10 pt-4">
                    <summary
                      className="mx-auto flex w-fit cursor-pointer list-none items-center justify-center gap-2 border-2 px-4 py-2 font-pixel text-[9px] sm:text-[10px] uppercase tracking-wide transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4"
                      style={{
                        borderColor: `${game.accentColor}80`,
                        color: game.accentColor,
                        '--tw-outline-color': game.accentColor,
                      }}
                    >
                      <span className="transition-transform group-open:rotate-90">▶</span>
                      <span>Ver reglas y formato</span>
                    </summary>
                    <div className="mt-4 border border-white/10 bg-black/60 p-3 sm:p-4 shadow-brutal-black">
                      <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                        <span className="font-pixel text-[9px] uppercase tracking-wider text-white">
                          FORMATO DEL TORNEO
                        </span>
                        <span
                          className="font-mono text-[10px] font-bold"
                          style={{ color: game.accentColor }}
                        >
                          {game.rules.length} REGLAS
                        </span>
                      </div>
                      <div className="space-y-2">
                        {game.rules.map((rule, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 border-l-2 bg-white/[0.03] px-3 py-2.5 text-sm leading-relaxed text-slate-200"
                            style={{ borderLeftColor: game.accentColor }}
                          >
                            <span
                              className="mt-0.5 shrink-0 font-pixel text-[9px]"
                              style={{ color: game.accentColor }}
                            >
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span>{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>

                </div>

                {/* 4. Physical Arcade Button (Sinks on click) */}
                <div className="mt-auto p-4 sm:p-5 pt-0 bg-[#090D15]">
                  <button
                    type="button"
                    onClick={() => onSelectGame(game.id)}
                    className={`btn-arcade-press w-full py-3.5 px-4 font-pixel text-xs sm:text-sm uppercase font-black border-2 border-black cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${game.shadowClass}`}
                    aria-label={`Inscribirse en ${game.name}`}
                    style={{
                      backgroundColor: game.accentColor,
                      color: ['free_fire', 'fortnite', 'clash_royale'].includes(game.id) ? '#000' : '#FFF',
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
