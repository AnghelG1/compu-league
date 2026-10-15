import React, { useState } from 'react';
import { 
  Shield, Flame, Crosshair, Crown, Users, Award, 
  ArrowRight, Sparkles, CheckCircle2, Monitor, Smartphone, Gamepad2
} from 'lucide-react';
import { GAMES } from '../data/tournamentData';

export default function GameCards({ onSelectGame }) {
  const [hoveredGame, setHoveredGame] = useState(null);

  const gamesConfig = [
    {
      id: 'valorant',
      name: 'VALORANT',
      badge: 'Doble Eliminación',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      accentColor: '#ff4655',
      accentGlow: 'hover:shadow-[0_0_30px_rgba(255,70,85,0.3)]',
      borderAccent: 'hover:border-rose-500/80',
      buttonBg: 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-[0_0_20px_rgba(255,70,85,0.4)]',
      image: '/assets/valorant.jpg',
      icon: Shield,
      mode: '5v5 Táctico',
      platform: 'PC Exclusivo',
      platformIcon: Monitor,
      price: '$5.00',
      priceNote: '$1 por titular • Suplente gratis',
      buttonText: 'INSCRIBIR EQUIPO (5v5)',
      rules: [
        'Doble eliminación oficial con Winners Bracket y Losers Bracket.',
        'Servidor Santiago. Mapas oficiales competitivos.',
        'Gran Final Bo3 al mejor de 3 mapas con casters en vivo.',
      ],
    },
    {
      id: 'free_fire',
      name: 'FREE FIRE',
      badge: 'Promo 2x1 Automática',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      accentColor: '#f59e0b',
      accentGlow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
      borderAccent: 'hover:border-amber-500/80',
      buttonBg: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
      image: '/assets/free_fire.jpg',
      icon: Flame,
      mode: 'Escuadras (4 Jugadores)',
      platform: 'Móvil (Salas)',
      platformIcon: Smartphone,
      price: '$4.00',
      priceNote: 'Incluye torneo Individual gratis',
      buttonText: 'INSCRIBIR ESCUADRA (4v4)',
      rules: [
        '¡La inscripción de escuadra inscribe a todos al torneo individual gratis!',
        'Salas privadas Battle Royale coordinadas con árbitros oficiales.',
        'Puntaje acumulativo por posición final y bajas confirmadas.',
      ],
    },
    {
      id: 'fortnite',
      name: 'FORTNITE',
      badge: 'Batalla en Dúos',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      accentColor: '#0ea5e9',
      accentGlow: 'hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]',
      borderAccent: 'hover:border-sky-500/80',
      buttonBg: 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.4)]',
      image: '/assets/fortnite.jpg',
      icon: Crosshair,
      mode: 'Dúos (2 Jugadores)',
      platform: 'Crossplay Total',
      platformIcon: Gamepad2,
      price: '$2.00',
      priceNote: '$1 por cada integrante del dúo',
      buttonText: 'INSCRIBIR DÚO (2v2)',
      rules: [
        'Sala privada Battle Royale en parejas con código exclusivo de partida.',
        'Crossplay abierto: juega desde PC, Consola (PlayStation/Xbox) o Móvil.',
        'Victoria Magistral: gana la última pareja en pie dentro del círculo final.',
      ],
    },
    {
      id: 'clash_royale',
      name: 'CLASH ROYALE',
      badge: 'Duelos 1v1 Directos',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      accentColor: '#8b5cf6',
      accentGlow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
      borderAccent: 'hover:border-purple-500/80',
      buttonBg: 'bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]',
      image: '/assets/clash_royale.jpg',
      icon: Crown,
      mode: '1v1 Individual',
      platform: 'Móvil (Android / iOS)',
      platformIcon: Smartphone,
      price: '$1.00',
      priceNote: 'Inscripción individual directa',
      buttonText: 'INSCRIBIRSE 1v1',
      rules: [
        'Llave eliminatoria directa en duelos al mejor de 3 partidas (Bo3).',
        'Nivel parejo estándar de torneo (Cartas fijas en Nivel 11).',
        'Mazo libre sin restricciones de cartas evolucionadas o campeones.',
      ],
    },
  ];

  return (
    <section id="juegos" className="py-14 sm:py-24 bg-[#0A0D14] text-slate-100 relative border-b border-white/10 font-sans select-none overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(30,58,102,0.3),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-display font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>4 Videojuegos Oficiales • Mismo Torneo</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black font-display uppercase text-white tracking-tight leading-tight">
              FORMATOS Y REGLAS DE BATALLA
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-sans">
              Elige tu disciplina favorita o inscribe a tu escuadra en múltiples títulos. Cada juego cuenta con llaves oficiales y premios independientes.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs font-display font-bold uppercase tracking-wider text-amber-400 self-start md:self-auto shrink-0">
            <span>Fechas: 4, 5 y 6 de Noviembre</span>
          </div>
        </div>

        {/* 4 Cards Grid - Perfectly Balanced 2x2 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {gamesConfig.map((game) => {
            const Icon = game.icon;
            const PlatformIcon = game.platformIcon;
            const isHovered = hoveredGame === game.id;

            return (
              <div 
                key={game.id}
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
                className={`rounded-2xl border border-white/10 bg-gradient-to-b from-[#131A29] to-[#0D121C] overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl ${game.borderAccent} ${game.accentGlow} group`}
              >
                <div>
                  {/* Game Header Banner with Authentic Artwork */}
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                    <img 
                      src={game.image} 
                      alt={game.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131A29] via-[#131A29]/50 to-transparent" />
                    
                    {/* Badge Pill Top Right */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className={`px-3 py-1 rounded-full text-xs font-display font-bold tracking-wider uppercase border backdrop-blur-md ${game.badgeColor}`}>
                        {game.badge}
                      </span>
                    </div>

                    {/* Game Title Over Image */}
                    <div className="absolute bottom-3 left-4 sm:left-6 right-4 flex items-end justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg"
                          style={{ backgroundColor: `${game.accentColor}33`, borderColor: game.accentColor, borderWidth: '1px' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: game.accentColor }} />
                        </div>
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-black font-display tracking-wider text-white uppercase leading-none drop-shadow-md">
                            {game.name}
                          </h3>
                          <span className="text-xs font-sans text-slate-300 font-medium">
                            {game.mode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-5">
                    
                    {/* Unified 3-Column Spec Grid for ALL 4 games */}
                    <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-[#0A0E17] border border-white/5 text-center font-sans">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-display font-bold">
                          Modalidad
                        </span>
                        <strong className="text-xs sm:text-sm text-slate-100 font-bold block truncate">
                          {game.mode}
                        </strong>
                      </div>

                      <div className="space-y-1 border-x border-white/10 px-1">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-display font-bold flex items-center justify-center gap-1">
                          <PlatformIcon className="w-3 h-3 text-slate-400" /> Plataforma
                        </span>
                        <strong className="text-xs sm:text-sm text-slate-100 font-bold block truncate">
                          {game.platform}
                        </strong>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-display font-bold">
                          Inscripción
                        </span>
                        <strong className="text-xs sm:text-sm text-amber-400 font-bold block font-display">
                          {game.price}
                        </strong>
                      </div>
                    </div>

                    {/* Uniform Rules List */}
                    <div className="space-y-2 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                      {game.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-slate-400 font-sans text-center sm:text-left">
                      {game.priceNote}
                    </span>

                    <button
                      onClick={() => onSelectGame(game.id)}
                      className={`w-full sm:w-auto px-6 py-3 rounded-lg font-display font-black text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] ${game.buttonBg}`}
                    >
                      <span>{game.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
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
