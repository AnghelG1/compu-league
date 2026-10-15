import React, { useState, useEffect } from 'react';
import { RefreshCw, Shield, Flame, Crosshair, Crown } from 'lucide-react';
import { 
  getValorantMatches, 
  getClashMatches, 
  getBattleRoyaleStandings 
} from '../lib/storage';

export default function LiveBrackets() {
  const [activeTab, setActiveTab] = useState('valorant');
  const [ffSubTab, setFfSubTab] = useState('escuadras');
  
  const [valorantMatches, setValorantMatches] = useState([]);
  const [clashMatches, setClashMatches] = useState([]);
  const [brStandings, setBrStandings] = useState({
    free_fire_escuadras: [],
    free_fire_solitario: [],
    fortnite_duos: []
  });

  const loadData = () => {
    setValorantMatches(getValorantMatches());
    setClashMatches(getClashMatches());
    setBrStandings(getBattleRoyaleStandings());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'valorant', name: 'VALORANT (5v5)', icon: Shield },
    { id: 'free_fire', name: 'FREE FIRE (BR)', icon: Flame },
    { id: 'fortnite', name: 'FORTNITE (DUOS)', icon: Crosshair },
    { id: 'clash_royale', name: 'CLASH ROYALE (1v1)', icon: Crown },
  ];

  return (
    <section id="brackets" className="py-20 bg-[#0a0f1d] text-slate-100 relative border-b-4 border-[#243556] font-['Press_Start_2P',monospace] select-none">
      
      {/* Background Pixel Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e2d4a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b-4 border-[#243556]">
          <div className="space-y-3">
            <div className="inline-block px-3 py-1.5 border-2 border-[#3b598b] bg-[#0f172a] text-sky-400 text-[10px] uppercase">
              ★ MARCADORES OFICIALES EN VIVO
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white tracking-wider font-['Silkscreen',monospace] drop-shadow-[0_4px_0_#070b14]">
              BRACKETS & RESULTADOS
            </h2>
            <p className="text-[#8ea4c7] text-xs max-w-xl font-mono leading-relaxed">
              * Actualizacion directa por el staff oficial del torneo durante las 3 noches (4, 5 y 6 de Noviembre).
            </p>
          </div>

          <button
            onClick={loadData}
            className="self-start md:self-auto px-4 py-3 border-2 border-[#3b598b] hover:border-yellow-300 bg-[#142340] hover:bg-[#1b2f56] hover:text-yellow-300 text-slate-100 text-xs font-bold transition-colors cursor-pointer uppercase flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>[ SINCRONIZAR ]</span>
          </button>
        </div>

        {/* Category Tabs (Undertale Battle Menu Style) */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b-2 border-[#1c2a47]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 border-2 text-[10px] sm:text-xs uppercase transition-colors flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'border-yellow-300 bg-[#142340] text-yellow-300'
                    : 'border-[#253759] bg-[#0d1629] text-[#8ea4c7] hover:border-[#60a5fa] hover:text-slate-100'
                }`}
              >
                <span>[ {tab.name} ]</span>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. VALORANT BRACKET                                           */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'valorant' && (
          <div className="space-y-10">
            
            {/* Upper Bracket Section */}
            <div className="border-4 border-[#2d4268] bg-[#0d1629] p-5 sm:p-7 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              <div className="mb-6 pb-3 border-b-2 border-[#1c2a47] flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-yellow-300 text-xs font-bold font-['Silkscreen',monospace] tracking-wider">
                    * UPPER BRACKET (CUADRO PRINCIPAL)
                  </span>
                  <p className="text-[10px] text-[#8ea4c7] font-mono">
                    Partidas Bo1. El ganador avanza; el derrotado desciende a Loser Bracket.
                  </p>
                </div>
                <span className="text-[10px] px-2 py-1 border border-[#2b3e62] bg-[#080d1a] text-[#8ea4c7]">
                  BO1
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cuartos */}
                <div className="space-y-3">
                  <div className="text-[10px] text-[#8ea4c7] pb-2 border-b border-[#1c2a47]">
                    CUARTOS DE FINAL
                  </div>
                  {valorantMatches.filter(m => m.bracket === 'upper' && m.round === 'Cuartos de Final').map((m) => (
                    <PixelMatchCard key={m.id} match={m} />
                  ))}
                </div>

                {/* Semis */}
                <div className="space-y-3">
                  <div className="text-[10px] text-[#8ea4c7] pb-2 border-b border-[#1c2a47]">
                    SEMIFINALES UPPER
                  </div>
                  {valorantMatches.filter(m => m.bracket === 'upper' && m.round === 'Semifinal Upper').map((m) => (
                    <PixelMatchCard key={m.id} match={m} />
                  ))}
                </div>

                {/* Final Upper */}
                <div className="space-y-3">
                  <div className="text-[10px] text-yellow-300 pb-2 border-b border-yellow-300/40">
                    FINAL UPPER BRACKET
                  </div>
                  {valorantMatches.filter(m => m.bracket === 'upper' && m.round === 'Final Upper Bracket').map((m) => (
                    <PixelMatchCard key={m.id} match={m} highlight />
                  ))}
                </div>
              </div>
            </div>

            {/* Loser Bracket Section */}
            <div className="border-4 border-[#253759] bg-[#0d1629] p-5 sm:p-7 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              <div className="mb-6 pb-3 border-b-2 border-[#1c2a47]">
                <span className="text-red-400 text-xs font-bold font-['Silkscreen',monospace] tracking-wider">
                  * LOSER BRACKET (REPECHAJE OFICIAL)
                </span>
                <p className="text-[10px] text-[#8ea4c7] font-mono mt-1">
                  Segunda oportunidad. Una derrota más significa la eliminación definitiva.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-3">
                  <div className="text-[9px] text-[#8ea4c7] pb-1 border-b border-[#1c2a47]">RONDA 1</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Ronda 1 Loser').map((m) => (
                    <PixelMatchCard key={m.id} match={m} compact />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-[9px] text-[#8ea4c7] pb-1 border-b border-[#1c2a47]">RONDA 2</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Ronda 2 Loser').map((m) => (
                    <PixelMatchCard key={m.id} match={m} compact />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-[9px] text-[#8ea4c7] pb-1 border-b border-[#1c2a47]">SEMIFINAL</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Semifinal Loser').map((m) => (
                    <PixelMatchCard key={m.id} match={m} compact />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-[9px] text-red-400 pb-1 border-b border-red-500/40">FINAL LOSER</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Final Loser Bracket').map((m) => (
                    <PixelMatchCard key={m.id} match={m} compact highlight />
                  ))}
                </div>
              </div>
            </div>

            {/* Grand Final Bo3 */}
            <div className="border-4 border-yellow-300/80 bg-[#0f172a] p-6 sm:p-8 text-center space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              <div className="inline-block px-3 py-1 bg-yellow-300 text-black text-xs font-bold uppercase">
                ★ GRAN FINAL VALORANT (BO3) ★
              </div>
              
              {valorantMatches.filter(m => m.bracket === 'grand_final').map((m) => (
                <div key={m.id} className="p-4 sm:p-6 border-2 border-[#3b598b] bg-[#080d1a] max-w-xl mx-auto shadow-md">
                  <div className="flex items-center justify-between text-sm sm:text-base font-bold">
                    <div className={`flex-1 text-right pr-4 ${m.winner === m.teamA ? 'text-yellow-300' : 'text-slate-100'}`}>
                      {m.teamA}
                    </div>
                    <div className="px-4 py-1.5 border-2 border-yellow-300 bg-[#0f172a] text-yellow-300 font-bold shrink-0 text-base sm:text-lg">
                      {m.scoreA} : {m.scoreB}
                    </div>
                    <div className={`flex-1 text-left pl-4 ${m.winner === m.teamB ? 'text-yellow-300' : 'text-slate-100'}`}>
                      {m.teamB}
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] text-[#8ea4c7] font-mono">
                    Ganador Upper vs. Ganador Loser • Noche del 6 de Noviembre
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 2. CLASH ROYALE (1v1)                                         */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'clash_royale' && (
          <div className="border-4 border-[#2d4268] bg-[#0d1629] p-6 sm:p-8 space-y-6 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <div className="pb-4 border-b-2 border-[#1c2a47] flex items-center justify-between">
              <div>
                <span className="text-slate-100 text-xs font-bold font-['Silkscreen',monospace] tracking-wider block">
                  * CLASH ROYALE - TORNEO 1v1 BO3
                </span>
                <p className="text-[10px] text-[#8ea4c7] font-mono mt-1">
                  Duelos al mejor de 3 partidas con nivel de cartas estandarizado de torneo.
                </p>
              </div>
              <span className="text-[10px] px-2 py-1 border border-[#2b3e62] bg-[#080d1a] text-[#8ea4c7]">
                16 JUGADORES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {clashMatches.map((m) => (
                <div key={m.id} className="border-2 border-[#1c2a47] bg-[#080d1a] p-3 space-y-2">
                  <div className="flex justify-between text-[9px] text-[#8ea4c7] pb-1 border-b border-[#141e33]">
                    <span>PARTIDA #{m.matchIndex}</span>
                    <span className={m.status === 'completed' ? 'text-emerald-400' : 'text-[#8ea4c7]'}>
                      {m.status === 'completed' ? 'FINAL' : 'ESPERA'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[10px]">
                    <div className={`flex items-center justify-between p-1.5 border ${
                      m.winner === m.playerA ? 'border-yellow-300 text-yellow-300 bg-[#142340]' : 'border-[#18233a] text-slate-300 bg-[#0c1424]'
                    }`}>
                      <span className="truncate pr-2 font-bold">{m.playerA}</span>
                      <span className="font-bold">{m.scoreA}</span>
                    </div>

                    <div className={`flex items-center justify-between p-1.5 border ${
                      m.winner === m.playerB ? 'border-yellow-300 text-yellow-300 bg-[#142340]' : 'border-[#18233a] text-slate-300 bg-[#0c1424]'
                    }`}>
                      <span className="truncate pr-2 font-bold">{m.playerB}</span>
                      <span className="font-bold">{m.scoreB}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. FREE FIRE & FORTNITE STANDINGS (BATTLE ROYALE)             */}
        {/* ------------------------------------------------------------- */}
        {(activeTab === 'free_fire' || activeTab === 'fortnite') && (
          <div className="border-4 border-[#2d4268] bg-[#0d1629] p-6 sm:p-8 space-y-6 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[#1c2a47]">
              <span className="text-yellow-300 text-xs font-bold font-['Silkscreen',monospace] tracking-wider">
                * TABLA DE POSICIONES BATTLE ROYALE
              </span>

              {activeTab === 'free_fire' && (
                <div className="flex gap-2 text-[10px]">
                  <button
                    onClick={() => setFfSubTab('escuadras')}
                    className={`px-3 py-1.5 border-2 ${
                      ffSubTab === 'escuadras' 
                        ? 'border-yellow-300 bg-yellow-300 text-black font-bold' 
                        : 'border-[#253759] bg-[#080d1a] text-[#8ea4c7]'
                    }`}
                  >
                    [ ESCUADRAS ]
                  </button>
                  <button
                    onClick={() => setFfSubTab('solitario')}
                    className={`px-3 py-1.5 border-2 ${
                      ffSubTab === 'solitario' 
                        ? 'border-yellow-300 bg-yellow-300 text-black font-bold' 
                        : 'border-[#253759] bg-[#080d1a] text-[#8ea4c7]'
                    }`}
                  >
                    [ SOLITARIO ]
                  </button>
                </div>
              )}
            </div>

            {/* Standings Table in Retro Pixel Undertale Style */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1c2a47] text-[#8ea4c7] text-[10px]">
                    <th className="py-2.5 px-3">POS</th>
                    <th className="py-2.5 px-3">EQUIPO / JUGADOR</th>
                    <th className="py-2.5 px-3 text-center">BAJAS</th>
                    <th className="py-2.5 px-3 text-center">PTS SUPERVIVENCIA</th>
                    <th className="py-2.5 px-3 text-right">TOTAL PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141e33] font-mono">
                  {((activeTab === 'free_fire' 
                      ? (ffSubTab === 'escuadras' ? brStandings.free_fire_escuadras : brStandings.free_fire_solitario)
                      : brStandings.fortnite_duos) || []).map((row, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-[#121c33] transition-colors ${
                        idx === 0 ? 'text-yellow-300 font-bold bg-yellow-950/20' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1.5">
                          {idx === 0 && <span className="text-yellow-300">★</span>}
                          <span>#{row.position || idx + 1}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold uppercase">{row.teamName || row.name}</td>
                      <td className="py-3 px-3 text-center">{row.kills || 0}</td>
                      <td className="py-3 px-3 text-center">{row.placementPoints || 0}</td>
                      <td className="py-3 px-3 text-right font-bold text-yellow-300">{row.totalPoints || 0} PTS</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}

function PixelMatchCard({ match, compact = false, highlight = false }) {
  const isCompleted = match.status === 'completed';
  const winnerA = match.winner && match.winner === match.teamA;
  const winnerB = match.winner && match.winner === match.teamB;

  return (
    <div className={`border-2 p-3 bg-[#080d1a] space-y-2 ${
      highlight ? 'border-yellow-300' : 'border-[#1c2a47] hover:border-[#2d4268]'
    }`}>
      <div className="flex items-center justify-between text-[9px] text-[#8ea4c7] pb-1 border-b border-[#141e33]">
        <span>{match.round} #{match.matchIndex}</span>
        <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-[#8ea4c7]'}>
          {isCompleted ? 'FINALIZADO' : 'PENDIENTE'}
        </span>
      </div>

      <div className="space-y-1.5 text-[10px]">
        <div className={`flex items-center justify-between p-1.5 border transition-colors ${
          winnerA ? 'border-yellow-300 bg-[#142340] text-yellow-300 font-bold' : 'border-[#18233a] text-slate-300 bg-[#0c1424]'
        }`}>
          <span className="truncate pr-2 flex items-center gap-1">
            {winnerA && <span className="text-yellow-300 text-[10px]">★</span>}
            <span className="uppercase">{match.teamA}</span>
          </span>
          <span className="font-bold px-1.5 py-0.5 bg-[#080d1a] border border-[#1c2a47] text-white shrink-0">
            {match.scoreA}
          </span>
        </div>

        <div className={`flex items-center justify-between p-1.5 border transition-colors ${
          winnerB ? 'border-yellow-300 bg-[#142340] text-yellow-300 font-bold' : 'border-[#18233a] text-slate-300 bg-[#0c1424]'
        }`}>
          <span className="truncate pr-2 flex items-center gap-1">
            {winnerB && <span className="text-yellow-300 text-[10px]">★</span>}
            <span className="uppercase">{match.teamB}</span>
          </span>
          <span className="font-bold px-1.5 py-0.5 bg-[#080d1a] border border-[#1c2a47] text-white shrink-0">
            {match.scoreB}
          </span>
        </div>
      </div>
    </div>
  );
}
