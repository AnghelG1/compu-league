import React, { useState } from 'react';
import { Shield, Flame, Crosshair, Crown, Users, Award } from 'lucide-react';
import { GAMES } from '../data/tournamentData';

export default function GameCards({ onSelectGame }) {
  const [hoveredGame, setHoveredGame] = useState(null);

  const valorant = GAMES.find((g) => g.id === 'valorant') || GAMES[0];
  const freeFire = GAMES.find((g) => g.id === 'free_fire') || GAMES[1];
  const fortnite = GAMES.find((g) => g.id === 'fortnite') || GAMES[2];
  const clash = GAMES.find((g) => g.id === 'clash_royale') || GAMES[3];

  return (
    <section id="juegos" className="py-20 bg-[#16233b] text-slate-100 relative border-b-4 border-[#334a73] font-['Press_Start_2P',monospace] select-none overflow-hidden">
      
      {/* Subtle Cyber Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(45,75,135,0.4),transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(96,165,250,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(96,165,250,0.06)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b-4 border-[#334a73]">
          <div className="space-y-3">
            <div className="inline-block px-3 py-1.5 border-2 border-[#476799] bg-[#223559] text-yellow-300 text-[10px] uppercase">
              ★ 4 VIDEOJUEGOS OFICIALES ★
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white tracking-wider font-['Silkscreen',monospace] drop-shadow-[0_4px_0_#070b14]">
              REGLAS DE BATALLA
            </h2>
            <p className="text-[#a5badb] text-xs max-w-xl font-mono leading-relaxed">
              * Participa con tu escuadra completa o de forma individual en el servidor oficial de Compu League.
            </p>
          </div>

          <div className="text-xs font-mono text-yellow-300 self-start md:self-auto border-2 border-[#384f79] px-3 py-2 bg-[#223559]">
            [ FECHA: 4, 5 Y 6 NOV ]
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* 1. VALORANT (7 COLS) */}
          <div className="md:col-span-7">
            <div 
              onMouseEnter={() => setHoveredGame('valorant')}
              onMouseLeave={() => setHoveredGame(null)}
              className={`h-full border-4 p-6 sm:p-7 bg-[#1d2d4c] flex flex-col justify-between transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
                hoveredGame === 'valorant' ? 'border-red-400 bg-[#253556]' : 'border-[#364e78]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-[#2f4469]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-red-500 bg-red-950/40 flex items-center justify-center text-red-500">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-red-400 block font-mono">
                        PC • 5 TITULARES + 1 SUPLENTE
                      </span>
                      <h3 className="text-2xl font-bold uppercase tracking-wider text-white font-['Silkscreen',monospace]">
                        {valorant.name}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-1 border-2 border-red-500 text-red-400">
                    LOSER BRACKET
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 font-mono leading-relaxed mb-6">
                  <p>* Formato competitivo de Doble Eliminacion (Winners & Losers).</p>
                  <p>* Servidor Santiago. Mapas oficiales competitivos.</p>
                  <p>* Gran Final Bo3 al mejor de 3 mapas.</p>
                </div>

                {/* Specs Box */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 border-2 border-[#2f4469] bg-[#16233b] text-[10px] font-mono mb-6">
                  <div>
                    <span className="text-[#8ea4c7] block uppercase">MODALIDAD</span>
                    <strong className="text-slate-100">5v5 TACTICO</strong>
                  </div>
                  <div>
                    <span className="text-[#8ea4c7] block uppercase">SUPLENTE</span>
                    <strong className="text-emerald-400">1 OPCIONAL</strong>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[#8ea4c7] block uppercase">SERVIDOR</span>
                    <strong className="text-yellow-300">SANTIAGO</strong>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-[#2f4469]">
                <span className="text-[10px] text-[#8ea4c7]">
                  * ESCUADRA 5v5
                </span>

                <button
                  onClick={() => onSelectGame('valorant')}
                  className="group inline-flex items-center gap-2 px-5 py-3 border-2 border-[#476799] hover:border-yellow-300 bg-[#253961] hover:bg-[#304878] text-slate-100 hover:text-yellow-300 text-xs uppercase cursor-pointer transition-colors"
                >
                  <span>[ INSCRIBIR EQUIPO ]</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. FREE FIRE (5 COLS) */}
          <div className="md:col-span-5">
            <div 
              onMouseEnter={() => setHoveredGame('free_fire')}
              onMouseLeave={() => setHoveredGame(null)}
              className={`h-full border-4 p-6 sm:p-7 bg-[#1d2d4c] flex flex-col justify-between transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
                hoveredGame === 'free_fire' ? 'border-amber-400 bg-[#253556]' : 'border-[#364e78]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-[#2f4469]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-amber-400 bg-amber-950/40 flex items-center justify-center text-amber-400">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-mono">
                        MOVIL • SALAS PERSONALIZADAS
                      </span>
                      <h3 className="text-2xl font-bold uppercase tracking-wider text-white font-['Silkscreen',monospace]">
                        {freeFire.name}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-1 border-2 border-amber-400 text-amber-400">
                    2x1 PROMO
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 font-mono leading-relaxed mb-6">
                  <p className="text-yellow-300 font-bold">* ¡Inscripción en escuadra te inscribe automáticamente en la individual!</p>
                  <p>* Partidas en salas exclusivas Battle Royale con referee oficial.</p>
                  <p>* Tabla de bajas y puntos de supervivencia en vivo.</p>
                </div>

                <div className="p-3.5 border-2 border-[#2f4469] bg-[#16233b] text-[10px] font-mono space-y-1 mb-6">
                  <span className="text-yellow-300 font-bold block">* CONDICION DE VICTORIA:</span>
                  <p className="text-[#8ea4c7]">
                    Sobrevivir al cierre de zona y acumular el mayor puntaje por bajas confirmadas.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-[#2f4469]">
                <span className="text-[10px] text-[#8ea4c7]">
                  * 2 MODALIDADES
                </span>

                <button
                  onClick={() => onSelectGame('free_fire')}
                  className="group inline-flex items-center gap-2 px-5 py-3 border-2 border-[#476799] hover:border-yellow-300 bg-[#253961] hover:bg-[#304878] text-slate-100 hover:text-yellow-300 text-xs uppercase cursor-pointer transition-colors"
                >
                  <span>[ INSCRIBIR FREE FIRE ]</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. FORTNITE (6 COLS) */}
          <div className="md:col-span-6">
            <div 
              onMouseEnter={() => setHoveredGame('fortnite')}
              onMouseLeave={() => setHoveredGame(null)}
              className={`border-4 p-6 bg-[#1d2d4c] flex flex-col justify-between transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
                hoveredGame === 'fortnite' ? 'border-sky-400 bg-[#253556]' : 'border-[#364e78]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4 pb-3 border-b-2 border-[#2f4469]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-sky-400 bg-sky-950/40 flex items-center justify-center text-sky-400">
                      <Crosshair className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-sky-400 block font-mono">
                        CROSSPLAY (PC / CONSOLA / MOVIL)
                      </span>
                      <h3 className="text-xl font-bold uppercase tracking-wider text-white font-['Silkscreen',monospace]">
                        {fortnite.name}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[9px] px-2 py-1 border border-sky-400 text-sky-300">
                    DUOS
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono leading-relaxed mb-5">
                  * Sala privada de Battle Royale en parejas. Dúos exactos obligatorios. Gana la última pareja con vida (Victoria Magistral).
                </p>

                <div className="flex items-center gap-2 text-[10px] text-[#8ea4c7] font-mono mb-4">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>2 Jugadores obligatorios por equipo.</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t-2 border-[#2f4469]">
                <span className="text-[10px] text-[#8ea4c7]">
                  * CROSSPLAY
                </span>

                <button
                  onClick={() => onSelectGame('fortnite')}
                  className="group inline-flex items-center gap-2 px-4 py-2.5 border-2 border-[#476799] hover:border-yellow-300 bg-[#253961] hover:bg-[#304878] text-slate-100 hover:text-yellow-300 text-xs uppercase cursor-pointer transition-colors"
                >
                  <span>[ INSCRIBIR DUO ]</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. CLASH ROYALE (6 COLS) */}
          <div className="md:col-span-6">
            <div 
              onMouseEnter={() => setHoveredGame('clash_royale')}
              onMouseLeave={() => setHoveredGame(null)}
              className={`border-4 p-6 bg-[#1d2d4c] flex flex-col justify-between transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
                hoveredGame === 'clash_royale' ? 'border-cyan-400 bg-[#253556]' : 'border-[#364e78]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4 pb-3 border-b-2 border-[#2f4469]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-cyan-400 bg-cyan-950/40 flex items-center justify-center text-cyan-400">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-cyan-400 block font-mono">
                        MOVIL (ANDROID / IOS)
                      </span>
                      <h3 className="text-xl font-bold uppercase tracking-wider text-white font-['Silkscreen',monospace]">
                        {clash.name}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[9px] px-2 py-1 border border-cyan-400 text-cyan-300">
                    1v1 DUELOS
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono leading-relaxed mb-5">
                  * Llave eliminatoria directa 1v1. Duelos al mejor de 3 partidas (Bo3) con niveles de cartas estándar de torneo (Nivel 11).
                </p>

                <div className="flex items-center gap-2 text-[10px] text-[#8ea4c7] font-mono mb-4">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nivel parejo estándar de torneo.</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t-2 border-[#2f4469]">
                <span className="text-[10px] text-[#8ea4c7]">
                  * 1v1 INDIVIDUAL
                </span>

                <button
                  onClick={() => onSelectGame('clash_royale')}
                  className="group inline-flex items-center gap-2 px-4 py-2.5 border-2 border-[#476799] hover:border-yellow-300 bg-[#253961] hover:bg-[#304878] text-slate-100 hover:text-yellow-300 text-xs uppercase cursor-pointer transition-colors"
                >
                  <span>[ INSCRIBIRME 1v1 ]</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
