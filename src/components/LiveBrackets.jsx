import React, { useState, useEffect } from 'react';
import { 
  Trophy, Shield, Flame, Crosshair, 
  Crown, RefreshCw, CheckCircle2, Clock
} from 'lucide-react';
import { 
  DEFAULT_VALORANT_MATCHES, 
  DEFAULT_CLASH_MATCHES, 
  DEFAULT_BR_STANDINGS 
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

      setValorantMatches(savedVal ? JSON.parse(savedVal) : DEFAULT_VALORANT_MATCHES);
      setClashMatches(savedClash ? JSON.parse(savedClash) : DEFAULT_CLASH_MATCHES);
      setBrStandings(savedBr ? JSON.parse(savedBr) : DEFAULT_BR_STANDINGS);
    } catch {
      setValorantMatches(DEFAULT_VALORANT_MATCHES);
      setClashMatches(DEFAULT_CLASH_MATCHES);
      setBrStandings(DEFAULT_BR_STANDINGS);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const tabs = [
    { id: 'valorant', name: 'VALORANT (5v5)', icon: Shield },
    { id: 'free_fire', name: 'FREE FIRE (BR)', icon: Flame },
    { id: 'fortnite', name: 'FORTNITE (DÚOS)', icon: Crosshair },
    { id: 'clash_royale', name: 'CLASH ROYALE (1v1)', icon: Crown },
  ];

  return (
    <section id="brackets" className="py-20 bg-[#0B0E14] text-slate-100 relative border-b border-white/10 font-sans select-none">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(245,158,11,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3">
            <div className="inline-block px-3 py-1 rounded-full border border-sky-400/30 bg-sky-400/10 text-sky-400 text-xs font-display font-bold uppercase tracking-wider">
              MARCADORES OFICIALES EN VIVO
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-wide font-display">
              BRACKETS & RESULTADOS
            </h2>
            <p className="text-slate-400 text-sm max-w-xl font-sans leading-relaxed">
              Actualización directa por el staff oficial del torneo durante las 3 noches (4, 5 y 6 de Noviembre).
            </p>
          </div>

          <button
            onClick={loadData}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 hover:border-amber-400/40 text-slate-100 hover:text-amber-400 text-xs font-display font-bold transition-all cursor-pointer uppercase flex items-center gap-2 tracking-wider"
          >
            <RefreshCw className="w-4 h-4" />
            <span>SINCRONIZAR</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-10 pb-4 border-b border-white/10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm uppercase transition-all flex items-center gap-2 cursor-pointer font-display font-bold tracking-wider ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                    : 'border border-white/10 bg-slate-900/80 text-slate-400 hover:border-amber-400/40 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
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
            <div className="rounded-2xl border border-white/10 bg-[#121824] p-5 sm:p-7 shadow-xl">
              <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-amber-400 text-sm font-bold font-display tracking-wider block">
                    UPPER BRACKET (CUADRO PRINCIPAL)
                  </span>
                  <p className="text-xs text-slate-400 font-sans">
                    Partidas Bo1. El ganador avanza; el derrotado desciende a Loser Bracket.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md border border-white/10 bg-[#0B0E14] text-slate-300 font-mono font-bold">
                  BO1
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cuartos */}
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 pb-2 border-b border-white/10 font-display font-bold uppercase tracking-wider">
                    CUARTOS DE FINAL
                  </div>
                  {valorantMatches.filter(m => m.bracket === 'upper' && m.round === 'Cuartos de Final').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} />
                  ))}
                </div>

                {/* Semis */}
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 pb-2 border-b border-white/10 font-display font-bold uppercase tracking-wider">
                    SEMIFINALES UPPER
                  </div>
                  {valorantMatches.filter(m => m.bracket === 'upper' && m.round === 'Semifinal Upper').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} />
                  ))}
                </div>

                {/* Final Upper */}
                <div className="space-y-3">
                  <div className="text-xs text-amber-400 pb-2 border-b border-amber-400/30 font-display font-bold uppercase tracking-wider">
                    FINAL UPPER BRACKET
                  </div>
                  {valorantMatches.filter(m => m.bracket === 'upper' && m.round === 'Final Upper Bracket').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} highlight />
                  ))}
                </div>
              </div>
            </div>

            {/* Loser Bracket Section */}
            <div className="rounded-2xl border border-white/10 bg-[#121824] p-5 sm:p-7 shadow-xl">
              <div className="mb-6 pb-4 border-b border-white/10">
                <span className="text-rose-400 text-sm font-bold font-display tracking-wider block">
                  LOSER BRACKET (REPECHAJE OFICIAL)
                </span>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Segunda oportunidad. Una derrota más significa la eliminación definitiva.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 pb-1 border-b border-white/10 font-display font-bold">RONDA 1</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Ronda 1 Loser').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} compact />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 pb-1 border-b border-white/10 font-display font-bold">RONDA 2</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Ronda 2 Loser').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} compact />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 pb-1 border-b border-white/10 font-display font-bold">SEMIFINAL</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Semifinal Loser').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} compact />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-rose-400 pb-1 border-b border-rose-500/30 font-display font-bold">FINAL LOSER</div>
                  {valorantMatches.filter(m => m.bracket === 'lower' && m.round === 'Final Loser Bracket').map((m) => (
                    <EsportsMatchCard key={m.id} match={m} compact highlight />
                  ))}
                </div>
              </div>
            </div>

            {/* Grand Final Bo3 */}
            <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-[#161f30] to-[#121824] p-6 sm:p-8 text-center space-y-4 shadow-2xl">
              <div className="inline-block px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase font-display tracking-wider shadow-md shadow-amber-400/20">
                🏆 GRAN FINAL VALORANT (BO3)
              </div>
              
              {valorantMatches.filter(m => m.bracket === 'grand_final').map((m) => (
                <div key={m.id} className="p-5 sm:p-7 rounded-xl border border-white/10 bg-[#0B0E14] max-w-xl mx-auto shadow-xl">
                  <div className="flex items-center justify-between text-base sm:text-lg font-bold font-display">
                    <div className={`flex-1 text-right pr-4 uppercase ${m.winner === m.teamA ? 'text-amber-400 font-black' : 'text-slate-100'}`}>
                      {m.teamA}
                    </div>
                    <div className="px-4 py-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-400 font-black shrink-0 text-lg sm:text-xl font-mono">
                      {m.scoreA} : {m.scoreB}
                    </div>
                    <div className={`flex-1 text-left pl-4 uppercase ${m.winner === m.teamB ? 'text-amber-400 font-black' : 'text-slate-100'}`}>
                      {m.teamB}
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400 font-sans">
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
          <div className="rounded-2xl border border-white/10 bg-[#121824] p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-white text-sm font-bold font-display tracking-wider block">
                  CLASH ROYALE - TORNEO 1v1 BO3
                </span>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Duelos al mejor de 3 partidas con nivel de cartas estandarizado de torneo.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md border border-white/10 bg-[#0B0E14] text-slate-300 font-mono font-bold">
                16 JUGADORES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {clashMatches.map((m) => (
                <div key={m.id} className="rounded-xl border border-white/10 bg-[#0B0E14] p-3.5 space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-400 pb-1.5 border-b border-white/5 font-display font-bold">
                    <span>PARTIDA #{m.matchIndex}</span>
                    <span className={m.status === 'completed' ? 'text-emerald-400' : 'text-slate-500'}>
                      {m.status === 'completed' ? 'FINAL' : 'ESPERA'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-sans">
                    <div className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                      m.winner === m.playerA ? 'border-amber-400/40 text-amber-300 bg-amber-400/10 font-bold' : 'border-white/5 text-slate-300 bg-slate-900/50'
                    }`}>
                      <span className="truncate pr-2 uppercase">{m.playerA}</span>
                      <span className="font-mono font-bold">{m.scoreA}</span>
                    </div>

                    <div className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
                      m.winner === m.playerB ? 'border-amber-400/40 text-amber-300 bg-amber-400/10 font-bold' : 'border-white/5 text-slate-300 bg-slate-900/50'
                    }`}>
                      <span className="truncate pr-2 uppercase">{m.playerB}</span>
                      <span className="font-mono font-bold">{m.scoreB}</span>
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
          <div className="rounded-2xl border border-white/10 bg-[#121824] p-6 sm:p-8 space-y-6 shadow-xl">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <span className="text-amber-400 text-sm font-bold font-display tracking-wider">
                TABLA DE POSICIONES BATTLE ROYALE
              </span>

              {activeTab === 'free_fire' && (
                <div className="flex gap-2 text-xs font-display font-bold">
                  <button
                    onClick={() => setFfSubTab('escuadras')}
                    className={`px-3.5 py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
                      ffSubTab === 'escuadras' 
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                        : 'border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    ESCUADRAS
                  </button>
                  <button
                    onClick={() => setFfSubTab('solitario')}
                    className={`px-3.5 py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
                      ffSubTab === 'solitario' 
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' 
                        : 'border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    SOLITARIO
                  </button>
                </div>
              )}
            </div>

            {/* Standings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[11px] font-display uppercase tracking-wider">
                    <th className="py-3 px-3">POS</th>
                    <th className="py-3 px-3">EQUIPO / JUGADOR</th>
                    <th className="py-3 px-3 text-center">BAJAS</th>
                    <th className="py-3 px-3 text-center">PTS SUPERVIVENCIA</th>
                    <th className="py-3 px-3 text-right">TOTAL PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {((activeTab === 'free_fire' 
                      ? (ffSubTab === 'escuadras' ? brStandings.free_fire_escuadras : brStandings.free_fire_solitario)
                      : brStandings.fortnite_duos) || []).map((row, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-slate-900/60 transition-colors ${
                        idx === 0 ? 'text-amber-300 font-bold bg-amber-400/5' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1.5 font-display font-bold">
                          {idx === 0 && <span className="text-amber-400">👑</span>}
                          <span>#{row.position || idx + 1}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold uppercase">{row.teamName || row.name}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.kills || 0}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.placementPoints || 0}</td>
                      <td className="py-3 px-3 text-right font-bold text-amber-400 font-mono">{row.totalPoints || 0} PTS</td>
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
    <div className={`rounded-xl border p-3.5 bg-[#0B0E14] space-y-2 transition-all ${
      highlight ? 'border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-white/10 hover:border-white/20'
    }`}>
      <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 border-b border-white/5 font-display font-bold">
        <span>{match.round} #{match.matchIndex}</span>
        <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
          {isCompleted ? 'FINALIZADO' : 'PENDIENTE'}
        </span>
      </div>

      <div className="space-y-1.5 text-xs font-sans">
        <div className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
          winnerA ? 'border-amber-400/40 bg-amber-400/10 text-amber-300 font-bold' : 'border-white/5 text-slate-300 bg-slate-900/50'
        }`}>
          <span className="truncate pr-2 flex items-center gap-1.5 uppercase">
            {winnerA && <span className="text-amber-400">★</span>}
            <span>{match.teamA}</span>
          </span>
          <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-white shrink-0">
            {match.scoreA}
          </span>
        </div>

        <div className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${
          winnerB ? 'border-amber-400/40 bg-amber-400/10 text-amber-300 font-bold' : 'border-white/5 text-slate-300 bg-slate-900/50'
        }`}>
          <span className="truncate pr-2 flex items-center gap-1.5 uppercase">
            {winnerB && <span className="text-amber-400">★</span>}
            <span>{match.teamB}</span>
          </span>
          <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-white shrink-0">
            {match.scoreB}
          </span>
        </div>
      </div>
    </div>
  );
}
