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
    <section id="participantes" className="py-14 sm:py-24 bg-[#0B0E14] text-slate-100 relative border-b border-white/10 font-sans select-none overflow-hidden">
      
      {/* Subtle Cyber Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(45,75,135,0.25),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ======================================================= */}
        {/* 1. SECTION HEADER                                       */}
        {/* ======================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-display font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Registro Oficial de Competidores</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display uppercase text-white tracking-tight leading-tight">
              EQUIPOS Y JUGADORES
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-sans">
              Lista oficial en tiempo real de escuadras y duelistas inscritos para Compu League 2026.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <button
              onClick={onOpenRegister}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-extrabold text-sm uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transform hover:scale-[1.02]"
            >
              <Trophy className="w-4 h-4 fill-slate-950" />
              <span>INSCRIBIRSE</span>
            </button>
          </div>
        </div>

        {/* ======================================================= */}
        {/* 2. SUMMARY COUNTER HUD                                  */}
        {/* ======================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <div className="p-3.5 rounded-xl border border-white/10 bg-[#121824] text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-display font-bold block">TOTAL JUGADORES</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display block">{totalPlayers}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-[#121824] text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-display font-bold block">VALORANT</span>
            <span className="text-2xl sm:text-3xl font-black text-rose-400 font-display block">{valorantCount}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-[#121824] text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-display font-bold block">FREE FIRE</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display block">{freeFireCount}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-[#121824] text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-display font-bold block">FORTNITE</span>
            <span className="text-2xl sm:text-3xl font-black text-sky-400 font-display block">{fortniteCount}</span>
          </div>

          <div className="p-3.5 rounded-xl border border-white/10 bg-[#121824] text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 uppercase font-display font-bold block">CLASH ROYALE</span>
            <span className="text-2xl sm:text-3xl font-black text-purple-400 font-display block">{clashCount}</span>
          </div>
        </div>

        {/* ======================================================= */}
        {/* 3. FILTERS & SEARCH BAR                                 */}
        {/* ======================================================= */}
        <div className="space-y-4 mb-8 p-4 rounded-xl border border-white/10 bg-[#121824]/90 shadow-xl">
          
          {/* Game Selection Pills */}
          <div className="flex flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar gap-2 pb-1">
            {gameFilters.map((tab) => {
              const isSelected = selectedGame === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGame(tab.id)}
                  className={`px-3.5 py-2 rounded-lg font-display text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'border border-white/10 bg-slate-900/80 text-slate-300 hover:border-amber-400/40 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subfilter: Type & Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
            {/* Type selector */}
            <div className="flex flex-wrap gap-2 text-xs font-display">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded font-bold uppercase tracking-wider transition-colors ${
                  selectedType === 'all'
                    ? 'bg-slate-200 text-slate-950 font-extrabold'
                    : 'border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                Todos ({registrations.length})
              </button>

              <button
                onClick={() => setSelectedType('teams')}
                className={`px-3 py-1.5 rounded font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                  selectedType === 'teams'
                    ? 'bg-slate-200 text-slate-950 font-extrabold'
                    : 'border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Equipos ({totalTeams})</span>
              </button>

              <button
                onClick={() => setSelectedType('individuals')}
                className={`px-3 py-1.5 rounded font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                  selectedType === 'individuals'
                    ? 'bg-slate-200 text-slate-950 font-extrabold'
                    : 'border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Individuales ({registrations.length - totalTeams})</span>
              </button>
            </div>

            {/* Quick Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="searchParticipantInput"
                name="searchParticipant"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar equipo o jugador..."
                aria-label="Buscar equipo o jugador"
                className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-white/10 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 font-sans transition-all"
              />
            </div>
          </div>

        </div>

        {/* ======================================================= */}
        {/* 4. PARTICIPANTS GRID (EQUIPOS PRIMERO, LUEGO INDIVIDUALES) */}
        {/* ======================================================= */}
        {filtered.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/10 bg-[#121824]/60 text-center space-y-3">
            <span className="text-amber-400 font-display font-bold text-base block">NO SE ENCONTRARON PARTICIPANTES</span>
            <p className="text-xs text-slate-400 font-sans">
              Prueba con otro término de búsqueda o videojuego.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* 1. SECCIÓN DE EQUIPOS */}
            {teamsList.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white uppercase font-display tracking-wider">
                      EQUIPOS Y ESCUADRAS ({teamsList.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-display uppercase tracking-wider">
                    5v5 / ESCUADRAS / DÚOS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                        className={`rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
                          isHovered 
                            ? 'border-amber-400/60 bg-[#161f30] -translate-y-1 shadow-[0_12px_30px_rgba(245,158,11,0.15)]' 
                            : 'border-white/10 bg-[#121824] hover:border-white/20'
                        }`}
                      >
                        {/* Top game-themed accent stripe */}
                        <div 
                          className="h-1 w-full shrink-0"
                          style={{ backgroundColor: badgeInfo.color }}
                        />

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-3.5">
                            {/* Top Row: Game Badge + Approval Status */}
                            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                              <div 
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border text-[10px] font-bold font-display uppercase tracking-wider"
                                style={{ borderColor: `${badgeInfo.color}50`, color: badgeInfo.color }}
                              >
                                <GameIcon className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{badgeInfo.label}</span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {isApproved ? (
                                  <span className="text-[10px] font-display uppercase px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>CONFIRMADO</span>
                                  </span>
                                ) : item.status === 'payment_pending' ? (
                                  <span className="text-[10px] font-display uppercase px-2.5 py-1 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1 font-bold">
                                    <Clock className="w-3 h-3 text-sky-400" />
                                    <span>PRE-REGISTRO</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-display uppercase px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-bold">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span>VERIFICANDO</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Team Title */}
                            <div className="space-y-3">
                              <div>
                                <h3 className="text-lg font-bold text-white uppercase font-display tracking-wide truncate">
                                  {item.team_name}
                                </h3>
                              </div>

                              {/* Roster Terminal Box */}
                              <div className="rounded-xl border border-white/10 bg-[#0B0E14] overflow-hidden">
                                <div className="px-3 py-1.5 bg-slate-900/80 border-b border-white/10 flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase tracking-wider font-display">
                                  <div className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                    <span>ROSTER OFICIAL ({item.members.length + 1})</span>
                                  </div>
                                  <span className="text-slate-400 text-[10px]">EQUIPO</span>
                                </div>

                                <div className="p-2 space-y-1 text-xs font-sans max-h-48 overflow-y-auto">
                                  {/* Captain entry */}
                                  <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-white">
                                    <div className="flex items-center gap-2 truncate pr-1">
                                      <span className="text-amber-400 font-bold text-[10px]">CAP</span>
                                      <span className="truncate font-semibold">{item.captain_name}</span>
                                    </div>
                                    <span className="text-amber-300 font-cyber font-bold text-[11px] shrink-0">
                                      {item.captain_game_id}
                                    </span>
                                  </div>

                                  {/* Members */}
                                  {item.members.map((member, idx) => (
                                    <div 
                                      key={idx} 
                                      className={`flex items-center justify-between py-1 px-2.5 rounded-lg text-slate-300 ${
                                        member.is_substitute 
                                          ? 'bg-purple-950/20 border border-purple-500/20 text-slate-400' 
                                          : 'bg-slate-900/50 hover:bg-slate-900'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate pr-1">
                                        <span className="text-slate-500 text-[10px] font-mono">
                                          {String(idx + 2).padStart(2, '0')}.
                                        </span>
                                        <span className="truncate text-[11px]">
                                          {member.name || `Jugador #${idx + 2}`}
                                        </span>
                                        {member.is_substitute && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold font-display">SUPL</span>
                                        )}
                                      </div>
                                      <span className="text-slate-400 shrink-0 font-cyber text-[11px]">
                                        {member.game_id || (member.is_substitute ? '(Suplente)' : '')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-display text-slate-400">
                            <span className="flex items-center gap-1">
                              <span>TICKET:</span>
                              <strong className="text-slate-200 font-mono font-bold">#{item.id.slice(0, 8).toUpperCase()}</strong>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-300 font-bold tracking-wider">
                              {item.members.length + 1} CUPOS
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
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-sky-400/20">
                      <User className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white uppercase font-display tracking-wider">
                      JUGADORES INDIVIDUALES ({individualsList.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-display uppercase tracking-wider">
                    1v1 / SOLITARIO / INDIVIDUAL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {individualsList.map((item) => {
                    const isHovered = hoveredCard === item.id;
                    const badgeInfo = getGameBadge(item.game, item.modality);
                    const GameIcon = badgeInfo.icon;

                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setHoveredCard(item.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
                          isHovered 
                            ? 'border-amber-400/60 bg-[#161f30] -translate-y-1 shadow-[0_12px_24px_rgba(245,158,11,0.15)]' 
                            : 'border-white/10 bg-[#121824] hover:border-white/20'
                        }`}
                      >
                        {/* Top game-themed accent stripe */}
                        <div 
                          className="h-1 w-full shrink-0"
                          style={{ backgroundColor: badgeInfo.color }}
                        />

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            {/* Top Row: Game Badge + Confirmation */}
                            <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                              <div 
                                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 border text-[10px] font-bold font-display uppercase tracking-wider"
                                style={{ borderColor: `${badgeInfo.color}50`, color: badgeInfo.color }}
                              >
                                <GameIcon className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{badgeInfo.label}</span>
                              </div>

                              {item.status === 'approved' ? (
                                <span className="text-[10px] font-display uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>CONFIRMADO</span>
                                </span>
                              ) : item.status === 'payment_pending' ? (
                                <span className="text-[10px] font-display uppercase px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1 font-bold">
                                  <Clock className="w-3 h-3 text-sky-400" />
                                  <span>PRE-REGISTRO</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-display uppercase px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-bold">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  <span>VERIFICANDO</span>
                                </span>
                              )}
                            </div>

                            {/* Player Name and In-Game ID Box */}
                            <div className="mt-3 p-3 rounded-xl bg-[#0B0E14] border border-white/10 space-y-2">
                              {/* Row 1: Nombre del Jugador */}
                              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/5">
                                <div className="truncate min-w-0">
                                  <span className="text-[9px] text-slate-400 font-display uppercase tracking-wider block font-bold">
                                    NOMBRE
                                  </span>
                                  <h3 className="text-sm font-bold text-white uppercase font-display tracking-wide truncate">
                                    {item.captain_name || 'JUGADOR'}
                                  </h3>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px] font-display uppercase shrink-0 font-bold">
                                  SOLO
                                </span>
                              </div>

                              {/* Row 2: ID en Juego */}
                              <div className="truncate min-w-0">
                                <span className="text-[9px] text-slate-400 font-display uppercase tracking-wider block font-bold">
                                  ID EN JUEGO
                                </span>
                                <span className="text-xs font-bold text-amber-400 uppercase font-cyber tracking-wider truncate block">
                                  {item.captain_game_id || item.team_name || '---'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="truncate">#{item.id.slice(0, 8).toUpperCase()}</span>
                            <span className="text-emerald-400 font-display font-bold shrink-0">LISTO</span>
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
        <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-[#121824] via-[#161f30] to-[#121824] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-white uppercase font-display tracking-wide">
              ¿QUIERES VER TU NOMBRE O ESCUADRA EN ESTA LISTA?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              Inscribe a tu equipo o regístrate de forma individual antes del inicio del torneo.
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-sm uppercase tracking-wider text-center transition-all shrink-0 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5"
          >
            INSCRIBIR A MI EQUIPO
          </button>
        </div>

      </div>

    </section>
  );
}
