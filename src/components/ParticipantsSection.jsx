import React, { useState, useEffect } from 'react';
import { 
  Users, User, Trophy, Shield, Flame, Crosshair, Crown, 
  Search, CheckCircle2, Clock, Sparkles 
} from 'lucide-react';
import { getRegistrations } from '../lib/storage';

export default function ParticipantsSection({ onOpenRegister }) {
  const [registrations, setRegistrations] = useState([]);
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'teams', 'individuals'
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  const loadData = async () => {
    try {
      const data = await getRegistrations();
      if (Array.isArray(data)) {
        setRegistrations(data);
      }
    } catch (err) {
      console.error('Error cargando participantes:', err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  // Filter registrations
  const filtered = registrations.filter((reg) => {
    // Game filter
    if (selectedGame !== 'all' && reg.game !== selectedGame) {
      return false;
    }

    // Type filter
    const isTeam = !reg.is_free_agent && reg.members && reg.members.length > 0;
    if (selectedType === 'teams' && !isTeam) return false;
    if (selectedType === 'individuals' && isTeam) return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTeam = reg.team_name?.toLowerCase().includes(q);
      const matchCapName = reg.captain_name?.toLowerCase().includes(q);
      const matchCapId = reg.captain_game_id?.toLowerCase().includes(q);
      const matchMembers = reg.members?.some(m => 
        m.name?.toLowerCase().includes(q) || m.game_id?.toLowerCase().includes(q)
      );
      return matchTeam || matchCapName || matchCapId || matchMembers;
    }

    return true;
  });

  // Separate into teams and individuals so there are zero height gaps between cards
  const teamsList = filtered.filter(item => !item.is_free_agent && item.members && item.members.length > 0);
  const individualsList = filtered.filter(item => item.is_free_agent || !item.members || item.members.length === 0);

  // Calculate stats
  const totalTeams = registrations.filter(r => !r.is_free_agent && r.members && r.members.length > 0).length;
  const totalPlayers = registrations.reduce((acc, r) => {
    // 1 captain + members count
    const memberCount = Array.isArray(r.members) ? r.members.length : 0;
    return acc + 1 + memberCount;
  }, 0);

  const valorantCount = registrations.filter(r => r.game === 'valorant').length;
  const freeFireCount = registrations.filter(r => r.game === 'free_fire').length;
  const fortniteCount = registrations.filter(r => r.game === 'fortnite').length;
  const clashCount = registrations.filter(r => r.game === 'clash_royale').length;

  const gameFilters = [
    { id: 'all', label: 'TODOS', icon: Trophy },
    { id: 'valorant', label: 'VALORANT (5v5)', icon: Shield },
    { id: 'free_fire', label: 'FREE FIRE', icon: Flame },
    { id: 'fortnite', label: 'FORTNITE (DÚOS)', icon: Crosshair },
    { id: 'clash_royale', label: 'CLASH ROYALE (1v1)', icon: Crown },
  ];

  const getGameBadge = (gameId, modality) => {
    switch (gameId) {
      case 'valorant':
        return { 
          label: modality === 'agente_libre' || modality === 'individual' ? 'VALORANT • INDIVIDUAL' : 'VALORANT • 5v5 PC', 
          color: '#ff4655',
          icon: Crosshair
        };
      case 'free_fire':
        return { 
          label: modality === 'solitario' || modality === 'individual' ? 'FREE FIRE • INDIVIDUAL' : 'FREE FIRE • ESCUADRAS', 
          color: '#f59e0b',
          icon: Flame
        };
      case 'fortnite':
        return { 
          label: 'FORTNITE • DÚOS', 
          color: '#38bdf8',
          icon: Shield
        };
      case 'clash_royale':
        return { 
          label: 'CLASH ROYALE • 1v1', 
          color: '#06b6d4',
          icon: Crown
        };
      default:
        return { 
          label: 'E-SPORTS', 
          color: '#94a3b8',
          icon: Trophy
        };
    }
  };

  return (
    <section id="participantes" className="py-20 bg-[#16233b] text-slate-100 relative border-b-4 border-[#334a73] font-['Press_Start_2P',monospace] select-none overflow-hidden">
      
      {/* Subtle Cyber Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(45,75,135,0.4),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(96,165,250,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(96,165,250,0.06)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* ======================================================= */}
        {/* 1. SECTION HEADER                                       */}
        {/* ======================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b-4 border-[#334a73]">
          <div className="space-y-2 sm:space-y-3">
            <div className="inline-block px-2.5 py-1 sm:px-3 sm:py-1.5 border-2 border-[#476799] bg-[#223559] text-yellow-300 text-[9px] sm:text-[10px] uppercase">
              ★ REGISTRO OFICIAL DE COMPETIDORES ★
            </div>
            <h2 className="text-2xl sm:text-5xl font-bold uppercase text-white tracking-wider font-['Silkscreen',monospace] drop-shadow-[0_3px_0_#070b14]">
              EQUIPOS Y JUGADORES
            </h2>
            <p className="text-[#a5badb] text-xs max-w-2xl font-mono leading-relaxed">
              * Lista oficial en tiempo real de escuadras y duelistas inscritos para Compu League 2026.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={onOpenRegister}
              className="px-4 py-2.5 sm:py-3 border-2 border-yellow-300 bg-yellow-300 text-black hover:bg-white text-xs font-bold transition-colors cursor-pointer uppercase flex items-center justify-center"
            >
              <span>[ INSCRIBIRSE ]</span>
            </button>
          </div>
        </div>

        {/* ======================================================= */}
        {/* 2. SUMMARY COUNTER HUD                                  */}
        {/* ======================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 border-2 border-[#364e78] bg-[#1d2d4c] text-center space-y-0.5 sm:space-y-1">
            <span className="text-[8px] sm:text-[9px] text-[#a5badb] block">JUGADORES</span>
            <span className="text-sm sm:text-base font-bold text-yellow-300 font-mono">{totalPlayers}</span>
          </div>

          <div className="p-2 sm:p-3 border-2 border-[#364e78] bg-[#1d2d4c] text-center space-y-0.5 sm:space-y-1">
            <span className="text-[8px] sm:text-[9px] text-[#a5badb] block">VALORANT</span>
            <span className="text-sm sm:text-base font-bold text-red-400 font-mono">{valorantCount}</span>
          </div>

          <div className="p-2 sm:p-3 border-2 border-[#364e78] bg-[#1d2d4c] text-center space-y-0.5 sm:space-y-1">
            <span className="text-[8px] sm:text-[9px] text-[#a5badb] block">FREE FIRE</span>
            <span className="text-sm sm:text-base font-bold text-amber-400 font-mono">{freeFireCount}</span>
          </div>

          <div className="p-2 sm:p-3 border-2 border-[#364e78] bg-[#1d2d4c] text-center space-y-0.5 sm:space-y-1">
            <span className="text-[8px] sm:text-[9px] text-[#a5badb] block">FORTNITE</span>
            <span className="text-sm sm:text-base font-bold text-sky-400 font-mono">{fortniteCount}</span>
          </div>

          <div className="p-2 sm:p-3 border-2 border-[#364e78] bg-[#1d2d4c] text-center space-y-0.5 sm:space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[8px] sm:text-[9px] text-[#a5badb] block">CLASH ROYALE</span>
            <span className="text-sm sm:text-base font-bold text-cyan-400 font-mono">{clashCount}</span>
          </div>
        </div>

        {/* ======================================================= */}
        {/* 3. FILTERS & SEARCH BAR                                 */}
        {/* ======================================================= */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 p-3 sm:p-4 border-3 sm:border-4 border-[#364e78] bg-[#1d2d4c] shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          
          {/* Game Selection Pills */}
          <div className="flex flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 pb-1">
            {gameFilters.map((tab) => {
              const isSelected = selectedGame === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGame(tab.id)}
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-2 border-2 text-[9px] sm:text-[10px] uppercase transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'border-yellow-300 bg-[#253961] text-yellow-300'
                      : 'border-[#364e78] bg-[#16233b] text-[#a5badb] hover:border-[#60a5fa] hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  <span>[ {tab.label} ]</span>
                </button>
              );
            })}
          </div>

          {/* Subfilter: Type & Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-3 border-t border-[#2f4469]">
            {/* Type selector */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[8.5px] sm:text-[9px]">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 border ${
                  selectedType === 'all'
                    ? 'border-yellow-300 bg-yellow-300 text-black font-bold'
                    : 'border-[#364e78] bg-[#16233b] text-[#a5badb] hover:text-white'
                }`}
              >
                TODOS ({registrations.length})
              </button>

              <button
                onClick={() => setSelectedType('teams')}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 border flex items-center gap-1 ${
                  selectedType === 'teams'
                    ? 'border-yellow-300 bg-yellow-300 text-black font-bold'
                    : 'border-[#364e78] bg-[#16233b] text-[#a5badb] hover:text-white'
                }`}
              >
                <Users className="w-2.5 h-2.5" />
                <span>EQUIPOS ({totalTeams})</span>
              </button>

              <button
                onClick={() => setSelectedType('individuals')}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 border flex items-center gap-1 ${
                  selectedType === 'individuals'
                    ? 'border-yellow-300 bg-yellow-300 text-black font-bold'
                    : 'border-[#364e78] bg-[#16233b] text-[#a5badb] hover:text-white'
                }`}
              >
                <User className="w-2.5 h-2.5" />
                <span>INDIVIDUALES ({registrations.length - totalTeams})</span>
              </button>
            </div>

            {/* Quick Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#a5badb] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="searchParticipantInput"
                name="searchParticipant"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="BUSCAR EQUIPO O JUGADOR..."
                aria-label="Buscar equipo o jugador"
                className="w-full pl-9 pr-3 py-1.5 bg-[#16233b] border-2 border-[#2f4469] text-[10px] text-slate-100 placeholder-[#7a93b8] focus:outline-none focus:border-yellow-300 font-mono uppercase"
              />
            </div>
          </div>

        </div>

        {/* ======================================================= */}
        {/* 4. PARTICIPANTS GRID                                    */}
        {/* ======================================================= */}
        {/* ======================================================= */}
        {/* 4. PARTICIPANTS GRID (EQUIPOS PRIMERO, LUEGO INDIVIDUALES) */}
        {/* ======================================================= */}
        {filtered.length === 0 ? (
          <div className="p-12 border-4 border-dashed border-[#364e78] bg-[#1d2d4c] text-center space-y-3">
            <span className="text-yellow-300 text-sm">* NO SE ENCONTRARON PARTICIPANTES CON ESE CRITERIO.</span>
            <p className="text-[10px] text-[#a5badb] font-mono">
              Prueba con otro término de búsqueda o videojuego.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* 1. SECCIÓN DE EQUIPOS */}
            {teamsList.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#364e78]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 border-2 border-yellow-300 bg-yellow-300 text-black flex items-center justify-center font-bold shadow-sm">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase font-['Silkscreen',monospace] tracking-wider">
                      EQUIPOS Y ESCUADRAS ({teamsList.length})
                    </h3>
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-[#8ea4c7] font-mono uppercase">
                    [ 5v5 / ESCUADRAS / DÚOS ]
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {teamsList.map((item) => {
                    const isHovered = hoveredCard === item.id;
                    const badgeInfo = getGameBadge(item.game, item.modality);
                    const GameIcon = badgeInfo.icon;
                    const isApproved = item.status === 'approved';

                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setHoveredCard(item.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`border-4 flex flex-col justify-between transition-all duration-200 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)] ${
                          isHovered 
                            ? 'border-yellow-300 bg-[#202f4d] -translate-y-1 shadow-[0_8px_24px_rgba(250,204,21,0.2)]' 
                            : 'border-[#364e78] bg-[#1a2742] hover:border-[#4d72a8]'
                        }`}
                      >
                        {/* Top game-themed accent stripe */}
                        <div 
                          className="h-1.5 w-full shrink-0"
                          style={{ backgroundColor: badgeInfo.color }}
                        />

                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-3.5">
                            {/* Top Row: Game Badge + Approval Status */}
                            <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-[#2b3f63]">
                              <div 
                                className="flex items-center gap-1.5 px-2 py-1 bg-[#121c2e] border text-[8px] sm:text-[9px] font-bold font-mono uppercase tracking-wider"
                                style={{ borderColor: `${badgeInfo.color}60`, color: badgeInfo.color }}
                              >
                                <GameIcon className="w-3 h-3 shrink-0" />
                                <span className="truncate">{badgeInfo.label}</span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {isApproved ? (
                                  <span className="text-[8px] font-mono px-2 py-0.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1 font-bold shadow-[0_0_8px_rgba(52,211,153,0.2)]">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>CONFIRMADO</span>
                                  </span>
                                ) : item.status === 'payment_pending' ? (
                                  <span className="text-[8px] font-mono px-2 py-0.5 bg-sky-950/90 text-sky-300 border border-sky-500/50 flex items-center gap-1 font-bold">
                                    <Clock className="w-2.5 h-2.5 text-sky-400" />
                                    <span>PRE-REGISTRO</span>
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-mono px-2 py-0.5 bg-amber-950/90 text-amber-300 border border-amber-500/50 flex items-center gap-1 font-bold">
                                    <Clock className="w-2.5 h-2.5 text-amber-400" />
                                    <span>VERIFICANDO</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Team Title */}
                            <div className="space-y-3">
                              <div>
                                <h3 className="text-base sm:text-lg font-bold text-white uppercase font-['Silkscreen',monospace] tracking-wider leading-tight drop-shadow-[0_2px_0_#070b14] truncate">
                                  {item.team_name}
                                </h3>
                              </div>

                              {/* Roster Terminal Box */}
                              <div className="border-2 border-[#3b5482] bg-[#121c2e] overflow-hidden shadow-inner">
                                <div className="px-2.5 py-1 bg-[#253961] border-b border-[#3b5482] flex items-center justify-between text-[8px] text-yellow-300 font-bold uppercase tracking-wider font-mono">
                                  <div className="flex items-center gap-1.5">
                                    <Users className="w-3 h-3 text-yellow-300 shrink-0" />
                                    <span>ROSTER OFICIAL ({item.members.length + 1})</span>
                                  </div>
                                  <span className="text-sky-300 text-[7px]">[ EQUIPO ]</span>
                                </div>

                                <div className="p-1.5 space-y-1 text-[8px] sm:text-[9px] font-mono max-h-48 overflow-y-auto">
                                  {/* Captain entry */}
                                  <div className="flex items-center justify-between py-1 px-2 bg-[#1b2b47] border border-[#2b4169] text-white">
                                    <div className="flex items-center gap-1.5 truncate pr-1">
                                      <span className="text-yellow-400 font-bold select-none">01.</span>
                                      <span className="truncate">{item.captain_name}</span>
                                      <span className="text-[7px] px-1 py-0.2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-bold">CAP</span>
                                    </div>
                                    <span className="text-yellow-300 font-bold shrink-0">
                                      {item.captain_game_id}
                                    </span>
                                  </div>

                                  {/* Members */}
                                  {item.members.map((member, idx) => (
                                    <div 
                                      key={idx} 
                                      className={`flex items-center justify-between py-1 px-2 border text-slate-300 ${
                                        member.is_substitute 
                                          ? 'bg-[#182338] border-[#253654] text-slate-400' 
                                          : 'bg-[#16233b] border-[#223554]'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 truncate pr-1">
                                        <span className="text-[#64748b] select-none font-mono">
                                          {String(idx + 2).padStart(2, '0')}.
                                        </span>
                                        <span className="truncate">
                                          {member.name || `Jugador #${idx + 2}`}
                                        </span>
                                        {member.is_substitute && (
                                          <span className="text-[7px] px-1 py-0.2 bg-purple-950/60 text-purple-300 border border-purple-500/40">SUPL</span>
                                        )}
                                      </div>
                                      <span className="text-[#a5badb] shrink-0 font-mono font-bold">
                                        {member.game_id || (member.is_substitute ? '(Suplente)' : '')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="pt-2.5 border-t-2 border-[#2b3f63] flex items-center justify-between text-[8px] font-mono text-[#a5badb]">
                            <span className="flex items-center gap-1">
                              <span>TICKET:</span>
                              <strong className="text-slate-300 font-mono font-bold">#{item.id.slice(0, 8).toUpperCase()}</strong>
                            </span>
                            <span className="px-2 py-0.5 bg-[#121c2e] border border-[#3b5482] text-yellow-300 font-bold tracking-wider">
                              [ {item.members.length + 1} CUPOS ]
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. SECCIÓN DE JUGADORES INDIVIDUALES */}
            {individualsList.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#364e78]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 border-2 border-sky-400 bg-sky-400 text-black flex items-center justify-center font-bold shadow-sm">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase font-['Silkscreen',monospace] tracking-wider">
                      JUGADORES INDIVIDUALES ({individualsList.length})
                    </h3>
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-[#8ea4c7] font-mono uppercase">
                    [ 1v1 / SOLITARIO / INDIVIDUAL ]
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {individualsList.map((item) => {
                    const isHovered = hoveredCard === item.id;
                    const badgeInfo = getGameBadge(item.game, item.modality);
                    const GameIcon = badgeInfo.icon;

                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setHoveredCard(item.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`border-4 flex flex-col justify-between transition-all duration-200 relative overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.35)] ${
                          isHovered 
                            ? 'border-yellow-300 bg-[#202f4d] -translate-y-1 shadow-[0_6px_20px_rgba(250,204,21,0.2)]' 
                            : 'border-[#364e78] bg-[#1a2742] hover:border-[#4d72a8]'
                        }`}
                      >
                        {/* Top game-themed accent stripe */}
                        <div 
                          className="h-1.5 w-full shrink-0"
                          style={{ backgroundColor: badgeInfo.color }}
                        />

                        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            {/* Top Row: Game Badge + Confirmation */}
                            <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-[#2b3f63]">
                              <div 
                                className="flex items-center gap-1.5 px-2 py-0.5 bg-[#121c2e] border text-[8px] sm:text-[9px] font-bold font-mono uppercase tracking-wider"
                                style={{ borderColor: `${badgeInfo.color}60`, color: badgeInfo.color }}
                              >
                                <GameIcon className="w-3 h-3 shrink-0" />
                                <span className="truncate">{badgeInfo.label}</span>
                              </div>

                              {item.status === 'approved' ? (
                                <span className="text-[8px] font-mono px-1.5 py-0.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1 font-bold">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>CONFIRMADO</span>
                                </span>
                              ) : item.status === 'payment_pending' ? (
                                <span className="text-[8px] font-mono px-1.5 py-0.5 bg-sky-950/90 text-sky-300 border border-sky-500/50 flex items-center gap-1 font-bold">
                                  <Clock className="w-2.5 h-2.5 text-sky-400" />
                                  <span>PRE-REGISTRO</span>
                                </span>
                              ) : (
                                <span className="text-[8px] font-mono px-1.5 py-0.5 bg-amber-950/90 text-amber-300 border border-amber-500/50 flex items-center gap-1 font-bold">
                                  <Clock className="w-2.5 h-2.5 text-amber-400" />
                                  <span>VERIFICANDO</span>
                                </span>
                              )}
                            </div>

                            {/* In-Game ID Box */}
                            <div className="mt-2.5 p-2.5 bg-[#121c2e] border-2 border-[#2f4469] flex items-center justify-between gap-2 shadow-inner">
                              <div className="truncate space-y-0.5">
                                <span className="text-[7px] text-[#8ea4c7] font-mono uppercase tracking-widest block font-bold">
                                  ID EN JUEGO:
                                </span>
                                <h3 className="text-sm font-bold text-yellow-300 uppercase font-['Silkscreen',monospace] tracking-wider truncate">
                                  {item.captain_game_id || item.team_name || 'JUGADOR'}
                                </h3>
                              </div>
                              <span className="px-1.5 py-0.5 bg-[#1d2d4c] border border-[#3b5482] text-sky-300 text-[8px] font-mono shrink-0 font-bold">
                                [ SOLO ]
                              </span>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="pt-2 border-t-2 border-[#2b3f63] flex items-center justify-between text-[8px] font-mono text-[#a5badb]">
                            <span className="truncate">#{item.id.slice(0, 8).toUpperCase()}</span>
                            <span className="text-emerald-400 font-bold shrink-0">LISTO</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================= */}
        {/* 5. BOTTOM CALL TO ACTION                                */}
        {/* ======================================================= */}
        <div className="mt-12 p-6 sm:p-8 border-4 border-[#364e78] bg-[#1d2d4c] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-bold text-white uppercase font-['Silkscreen',monospace]">
              * ¿QUIERES VER TU NOMBRE O ESCUADRA EN ESTA LISTA?
            </h3>
            <p className="text-[10px] text-[#a5badb] font-mono leading-relaxed">
              Inscribe a tu equipo o regístrate de forma individual antes del inicio del torneo.
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-6 py-4 border-2 border-yellow-300 bg-yellow-300 hover:bg-white text-black font-bold text-xs uppercase text-center transition-colors shrink-0 cursor-pointer shadow-md"
          >
            [ INSCRIBIR A MI EQUIPO ]
          </button>
        </div>

      </div>

    </section>
  );
}
