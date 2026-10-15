import React, { useState, useEffect } from 'react';
import { 
  Trophy, Shield, Flame, Crosshair, 
  Crown, RefreshCw, CheckCircle2, Clock
} from 'lucide-react';
import { 
  DEMO_VALORANT_MATCHES, 
  DEMO_CLASH_MATCHES, 
  DEMO_BATTLE_ROYALE_STANDINGS 
} from '../data/tournamentData';

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
    try {
      const savedVal = localStorage.getItem('compu_league_valorant_matches');
      const savedClash = localStorage.getItem('compu_league_clash_matches');
      const savedBr = localStorage.getItem('compu_league_br_standings');

      setValorantMatches(savedVal ? JSON.parse(savedVal) : DEMO_VALORANT_MATCHES);
      setClashMatches(savedClash ? JSON.parse(savedClash) : DEMO_CLASH_MATCHES);
      setBrStandings(savedBr ? JSON.parse(savedBr) : DEMO_BATTLE_ROYALE_STANDINGS);
    } catch {
      setValorantMatches(DEMO_VALORANT_MATCHES);
      setClashMatches(DEMO_CLASH_MATCHES);
      setBrStandings(DEMO_BATTLE_ROYALE_STANDINGS);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const tabs = [
    { id: 'valorant', name: 'VALORANT (5v5)', icon: Shield, color: '#FF0055' },
    { id: 'free_fire', name: 'FREE FIRE (BR)', icon: Flame, color: '#FFE600' },
    { id: 'fortnite', name: 'FORTNITE (DÚOS)', icon: Crosshair, color: '#00F0FF' },
    { id: 'clash_royale', name: 'CLASH ROYALE (1v1)', icon: Crown, color: '#A855F7' },
  ];

  return (
    <section id="brackets" className="py-14 sm:py-20 bg-[#07090F] text-slate-100 font-sans select-none border-b-4 border-black relative overflow-hidden">
      
      {/* Background Cyber Grid */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="bg-[#0B101A] border-4 border-black p-5 sm:p-6 mb-8 shadow-brutal-black">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 bg-black text-[#00F0FF] border-2 border-[#00F0FF] font-pixel text-[9px] uppercase shadow-brutal-black">
                ★ MARCADORES OFICIALES EN VIVO ★
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-wide font-display drop-shadow-[2px_2px_0px_#000]">
                BRACKETS &amp; <span className="text-[#FFE600]">RESULTADOS</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-cyber leading-relaxed">
                Actualización oficial durante las 3 noches (4, 5 y 6 de Noviembre de 2026).
              </p>
            </div>

            <button
              onClick={loadData}
              className="btn-arcade-press shadow-brutal-yellow self-start md:self-auto px-5 py-3 border-2 border-black bg-[#FFE600] text-black font-pixel text-[10px] font-black uppercase flex items-center gap-2 tracking-wider cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 stroke-[3]" />
              <span>[ SINCRONIZAR ]</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn-arcade-press font-pixel text-[9px] sm:text-[10px] px-4 py-3 border-2 border-black uppercase font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#FFE600] text-black shadow-brutal-yellow font-black'
                    : 'bg-black text-slate-300 hover:text-white shadow-brutal-black'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: isActive ? '#000' : tab.color }} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. VALORANT BRACKET                                           */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'valorant' && (
          <div className="space-y-8">
            
            {/* Upper Bracket Section */}
            <div className="border-4 border-black bg-[#0B101A] p-5 sm:p-7 shadow-brutal-black">
              <div className="mb-6 pb-4 border-b-2 border-black flex items-center justify-between font-pixel">
                <div className="space-y-1">
                  <span className="text-[#FFE600] text-xs font-bold tracking-wider block">
                    UPPER BRACKET // CUADRO PRINCIPAL
                  </span>
                  <p className="text-[10px] text-slate-400 font-cyber">
                    Partidas Bo1. El ganador avanza; el derrotado desciende a Loser Bracket.
                  </p>
                </div>
                <span className="text-[9px] px-2 py-0.5 border border-white/20 bg-black text-white font-bold">
                  BO1
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cuartos */}
                <div className="space-y-3">
                  <div className="text-[9px] text-[#00F0FF] pb-2 border-b-2 border-black font-pixel font-bold uppercase">
                    CUARTOS DE FINAL
                  </div>
                  {valorantMatches.filter(m => m.bracket === 'upper' && m.round === 'Cuartos de Final').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} />
                  ))}
                </div>

                {/* Semis */}
                <div className="space-y-3">
                  <div className="text-[9px] text-[#00F0FF] pb-2 border-b-2 border-black font-pixel font-bold uppercase">
                    SEMIFINALES UPPER
                  </div>
                  {valorantMatches.filter(m => m.bracket === 'upper' && m.round === 'Semifinal Upper').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} />
                  ))}
                </div>

                {/* Final Upper */}
                <div className="space-y-3">
                  <div className="text-[9px] text-[#FFE600] pb-2 border-b-2 border-black font-pixel font-bold uppercase">
                    FINAL UPPER BRACKET
                  </div>
                  {valorantMatches.filter(m => m.bracket === 'upper' && m.round === 'Final Upper Bracket').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} highlight />
                  ))}
                </div>
              </div>
            </div>

            {/* Loser Bracket Section */}
            <div className="border-4 border-black bg-[#0B101A] p-5 sm:p-7 shadow-brutal-pink">
              <div className="mb-6 pb-4 border-b-2 border-black font-pixel">
                <span className="text-[#FF0055] text-xs font-bold tracking-wider block">
                  LOSER BRACKET // REPECHAJE OFICIAL
                </span>
                <p className="text-[10px] text-slate-400 font-cyber mt-1">
                  Segunda oportunidad. Una derrota más significa la eliminación definitiva.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-3">
                  <div className="text-[8px] text-slate-400 pb-1 border-b border-white/10 font-pixel">RONDA 1</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Ronda 1 Loser').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} compact />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-[8px] text-slate-400 pb-1 border-b border-white/10 font-pixel">RONDA 2</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Ronda 2 Loser').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} compact />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-[8px] text-slate-400 pb-1 border-b border-white/10 font-pixel">SEMIFINAL</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Semifinal Loser').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} compact />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-[8px] text-[#FF0055] pb-1 border-b border-white/10 font-pixel">FINAL LOSER</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Final Loser Bracket').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} compact highlight />
                  ))}
                </div>
              </div>
            </div>

            {/* Grand Final Bo3 */}
            <div className="border-4 border-black bg-black p-6 sm:p-8 text-center space-y-4 shadow-brutal-yellow">
              <div className="inline-block px-4 py-1.5 bg-[#FFE600] text-black font-pixel text-xs font-black uppercase tracking-wider border-2 border-black">
                🏆 GRAN FINAL VALORANT (BO3)
              </div>
              
              {valorantMatches.filter(m => m.bracket === 'grand_final').map((m) => (
                <div key={m.id} className="p-5 sm:p-7 border-2 border-black bg-[#0C121D] max-w-xl mx-auto shadow-brutal-black">
                  <div className="flex items-center justify-between text-base sm:text-xl font-black font-display">
                    <div className={`flex-1 text-right pr-4 uppercase ${m.winner === m.teamA ? 'text-[#FFE600] font-black' : 'text-slate-100'}`}>
                      {m.teamA}
                    </div>
                    <div className="px-4 py-1.5 border-2 border-black bg-[#FFE600] text-black font-black shrink-0 text-lg sm:text-2xl font-pixel shadow-brutal-black">
                      {m.scoreA} : {m.scoreB}
                    </div>
                    <div className={`flex-1 text-left pl-4 uppercase ${m.winner === m.teamB ? 'text-[#FFE600] font-black' : 'text-slate-100'}`}>
                      {m.teamB}
                    </div>
                  </div>
                  <p className="mt-3 font-pixel text-[9px] text-[#00F0FF]">
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
          <div className="border-4 border-black bg-[#0B101A] p-6 sm:p-8 space-y-6 shadow-brutal-purple">
            <div className="pb-4 border-b-2 border-black flex items-center justify-between font-pixel">
              <div>
                <span className="text-white text-xs font-bold tracking-wider block">
                  CLASH ROYALE // TORNEO 1v1 BO3
                </span>
                <p className="text-[10px] text-slate-400 font-cyber mt-1">
                  Duelos al mejor de 3 partidas con nivel de cartas estandarizado de torneo.
                </p>
              </div>
              <span className="text-[9px] px-2.5 py-1 border border-white/20 bg-black text-[#A855F7] font-bold">
                16 JUGADORES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {clashMatches.map((m) => (
                <div key={m.id} className="border-2 border-black bg-black p-3.5 space-y-2 shadow-brutal-black">
                  <div className="flex justify-between font-pixel text-[8px] text-slate-400 pb-1.5 border-b border-white/10">
                    <span>{m.round}</span>
                    <span className="text-[#10B981]">{m.status.toUpperCase()}</span>
                  </div>
                  <div className="space-y-1 font-cyber text-xs">
                    <div className={`flex justify-between p-1.5 border border-white/5 ${m.winner === m.playerA ? 'bg-[#FFE600]/15 text-[#FFE600] font-bold' : 'text-slate-300'}`}>
                      <span>{m.playerA}</span>
                      <strong className="font-pixel text-[10px]">{m.scoreA}</strong>
                    </div>
                    <div className={`flex justify-between p-1.5 border border-white/5 ${m.winner === m.playerB ? 'bg-[#FFE600]/15 text-[#FFE600] font-bold' : 'text-slate-300'}`}>
                      <span>{m.playerB}</span>
                      <strong className="font-pixel text-[10px]">{m.scoreB}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. BATTLE ROYALE STANDINGS                                    */}
        {/* ------------------------------------------------------------- */}
        {(activeTab === 'free_fire' || activeTab === 'fortnite') && (
          <div className="border-4 border-black bg-[#0B101A] p-5 sm:p-7 shadow-brutal-black space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black font-pixel">
              <span className="text-[#FFE600] text-xs font-bold uppercase">
                TABLA DE POSICIONES // BATTLE ROYALE
              </span>
              <span className="text-[#00F0FF] text-[9px]">
                OFFICIAL SCORES
              </span>
            </div>

            {/* Sub-selector for Free Fire */}
            {activeTab === 'free_fire' && (
              <div className="flex gap-2 font-pixel text-[9px]">
                <button
                  onClick={() => setFfSubTab('escuadras')}
                  className={`btn-arcade-press px-3 py-1.5 border-2 border-black cursor-pointer ${ffSubTab === 'escuadras' ? 'bg-[#FFE600] text-black font-black' : 'bg-black text-slate-400'}`}
                >
                  ESCUADRAS (4P)
                </button>
                <button
                  onClick={() => setFfSubTab('solitario')}
                  className={`btn-arcade-press px-3 py-1.5 border-2 border-black cursor-pointer ${ffSubTab === 'solitario' ? 'bg-[#00F0FF] text-black font-black' : 'bg-black text-slate-400'}`}
                >
                  INDIVIDUAL (SOLO)
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left font-cyber text-xs">
                <thead>
                  <tr className="border-b-2 border-black bg-black font-pixel text-[8px] text-slate-400 uppercase">
                    <th className="p-2.5">RANK</th>
                    <th className="p-2.5">EQUIPO / JUGADOR</th>
                    <th className="p-2.5">CAPITÁN</th>
                    <th className="p-2.5 text-center">KILLS</th>
                    <th className="p-2.5 text-right">ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    activeTab === 'fortnite' 
                      ? brStandings.fortnite_duos 
                      : (ffSubTab === 'escuadras' ? brStandings.free_fire_escuadras : brStandings.free_fire_solitario)
                  )?.map((row) => (
                    <tr key={row.rank} className="border-b border-white/5 hover:bg-black/60">
                      <td className="p-2.5 font-pixel text-[9px] text-[#FFE600]">#{row.rank}</td>
                      <td className="p-2.5 font-bold text-white uppercase">{row.team}</td>
                      <td className="p-2.5 text-slate-400">{row.captain}</td>
                      <td className="p-2.5 text-center font-pixel text-[10px] text-[#00F0FF]">{row.kills}</td>
                      <td className="p-2.5 text-right font-pixel text-[8px]">
                        <span className={row.isWinner ? 'bg-[#10B981] text-black px-1.5 py-0.5 font-black' : 'text-slate-500'}>
                          {row.status}
                        </span>
                      </td>
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

function EsportsMatchCard({ match, compact = false, highlight = false }) {
  const isCompleted = match.status === 'completed';
  const winnerA = match.winner && match.winner === match.teamA;
  const winnerB = match.winner && match.winner === match.teamB;

  return (
    <div className={`border-2 border-black p-3 bg-black space-y-2 ${
      highlight ? 'shadow-brutal-yellow' : 'shadow-brutal-black'
    }`}>
      <div className="flex items-center justify-between font-pixel text-[8px] text-slate-400 pb-1 border-b border-white/10">
        <span>{match.round} #{match.matchIndex}</span>
        <span className={isCompleted ? 'text-[#10B981]' : 'text-slate-500'}>
          {isCompleted ? 'FINALIZADO' : 'PENDIENTE'}
        </span>
      </div>

      <div className="space-y-1 font-cyber text-xs">
        <div className={`flex items-center justify-between p-1.5 border border-white/5 ${
          winnerA ? 'bg-[#FFE600]/15 text-[#FFE600] font-bold' : 'text-slate-300'
        }`}>
          <span className="truncate pr-2 uppercase">
            {winnerA && <span className="text-[#FFE600] mr-1">★</span>}
            <span>{match.teamA}</span>
          </span>
          <span className="font-pixel font-bold px-1.5 py-0.5 bg-[#0C121D] text-white shrink-0 text-[10px]">
            {match.scoreA}
          </span>
        </div>

        <div className={`flex items-center justify-between p-1.5 border border-white/5 ${
          winnerB ? 'bg-[#FFE600]/15 text-[#FFE600] font-bold' : 'text-slate-300'
        }`}>
          <span className="truncate pr-2 uppercase">
            {winnerB && <span className="text-[#FFE600] mr-1">★</span>}
            <span>{match.teamB}</span>
          </span>
          <span className="font-pixel font-bold px-1.5 py-0.5 bg-[#0C121D] text-white shrink-0 text-[10px]">
            {match.scoreB}
          </span>
        </div>
      </div>
    </div>
  );
}
