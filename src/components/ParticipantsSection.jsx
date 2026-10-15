import React, { useState, useEffect } from 'react';
import { 
  Users, User, Shield, Flame, Crosshair, Crown, 
  Search, Check, Clock, Sparkles, Terminal, ArrowRight, Zap
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

  const teamsList = filtered.filter(item => !item.is_free_agent && item.members && item.members.length > 0);
  const individualsList = filtered.filter(item => item.is_free_agent || !item.members || item.members.length === 0);

  const totalTeams = registrations.filter(r => !r.is_free_agent && r.members && r.members.length > 0).length;
  const totalPlayers = registrations.reduce((acc, r) => {
    const memberCount = Array.isArray(r.members) ? r.members.length : 0;
    return acc + 1 + memberCount;
  }, 0);

  const valorantCount = registrations.filter(r => r.game === 'valorant').length;
  const freeFireCount = registrations.filter(r => r.game === 'free_fire').length;
  const fortniteCount = registrations.filter(r => r.game === 'fortnite').length;
  const clashCount = registrations.filter(r => r.game === 'clash_royale').length;

  const gameFilters = [
    { id: 'all', label: 'TODOS', icon: Zap, color: '#FFE600' },
    { id: 'valorant', label: 'VALORANT (5v5)', icon: Shield, color: '#FF0055' },
    { id: 'free_fire', label: 'FREE FIRE', icon: Flame, color: '#FFE600' },
    { id: 'fortnite', label: 'FORTNITE (DUOS)', icon: Crosshair, color: '#00F0FF' },
    { id: 'clash_royale', label: 'CLASH ROYALE (1v1)', icon: Crown, color: '#A855F7' },
  ];

  const getGameBadge = (gameId, modality) => {
    switch (gameId) {
      case 'valorant':
        return { 
          label: modality === 'agente_libre' || modality === 'individual' ? 'VALORANT • INDIVIDUAL' : 'VALORANT • 5v5', 
          color: '#FF0055',
          shadowClass: 'shadow-brutal-pink',
          borderClass: 'border-[#FF0055]',
          icon: Crosshair
        };
      case 'free_fire':
        return { 
          label: modality === 'solitario' || modality === 'individual' ? 'FREE FIRE • INDIVIDUAL' : 'FREE FIRE • ESCUADRAS', 
          color: '#FFE600',
          shadowClass: 'shadow-brutal-yellow',
          borderClass: 'border-[#FFE600]',
          icon: Flame
        };
      case 'fortnite':
        return { 
          label: 'FORTNITE • DUOS', 
          color: '#00F0FF',
          shadowClass: 'shadow-brutal-cyan',
          borderClass: 'border-[#00F0FF]',
          icon: Shield
        };
      case 'clash_royale':
        return { 
          label: 'CLASH ROYALE • 1v1', 
          color: '#A855F7',
          shadowClass: 'shadow-brutal-purple',
          borderClass: 'border-[#A855F7]',
          icon: Crown
        };
      default:
        return { 
          label: 'E-SPORTS', 
          color: '#FFE600',
          shadowClass: 'shadow-brutal-yellow',
          borderClass: 'border-[#FFE600]',
          icon: Zap
        };
    }
  };

  return (
    <section id="participantes" className="py-12 sm:py-20 bg-[#06080E] text-slate-100 font-sans select-none border-b-4 border-black relative overflow-hidden">
      
      {/* Background Subtle Cyber Lines */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ======================================================= */}
        {/* 1. SECTION HEADER (NEO-BRUTALIST TERMINAL STYLE)         */}
        {/* ======================================================= */}
        <div className="bg-[#0B101A] border-4 border-black p-5 sm:p-6 mb-8 shadow-brutal-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#FFE600] text-black font-pixel text-[9px] sm:text-[10px] px-2.5 py-1 border border-black font-black uppercase">
                  [ ROSTER TERMINAL ]
                </span>
                <span className="bg-black text-[#00F0FF] font-pixel text-[9px] sm:text-[10px] px-2.5 py-1 border border-[#00F0FF]">
                  LIVE DATABASE // REAL-TIME
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white leading-none drop-shadow-[2px_2px_0px_#000]">
                ROSTER OFICIAL <span className="text-[#FFE600]">// JUGADORES Y EQUIPOS</span>
              </h2>

              <p className="text-slate-300 font-cyber text-xs sm:text-sm max-w-2xl">
                Registro oficial en vivo de escuadras y duelistas inscritos para Compu League 2026.
              </p>
            </div>

            <div className="shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={onOpenRegister}
                className="btn-arcade-press shadow-brutal-yellow bg-[#FFE600] hover:bg-[#FFF04D] text-black border-2 border-black font-pixel text-xs px-5 py-3 font-black uppercase flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>INSCRIBIRSE</span>
              </button>
            </div>

          </div>
        </div>

        {/* ======================================================= */}
        {/* 2. SUMMARY COUNTER HUD (SOLID 3D SHADOW CARDS)          */}
        {/* ======================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <div className="bg-[#0D131F] border-2 border-black p-3.5 shadow-brutal-black text-center space-y-1">
            <span className="font-pixel text-[8px] sm:text-[9px] text-[#FFE600] uppercase block">TOTAL PLAYERS</span>
            <span className="font-pixel text-xl sm:text-3xl font-black text-white block">{totalPlayers}</span>
          </div>

          <div className="bg-[#0D131F] border-2 border-black p-3.5 shadow-brutal-black text-center space-y-1">
            <span className="font-pixel text-[8px] sm:text-[9px] text-[#FF0055] uppercase block">VALORANT</span>
            <span className="font-pixel text-xl sm:text-3xl font-black text-white block">{valorantCount}</span>
          </div>

          <div className="bg-[#0D131F] border-2 border-black p-3.5 shadow-brutal-black text-center space-y-1">
            <span className="font-pixel text-[8px] sm:text-[9px] text-[#FFE600] uppercase block">FREE FIRE</span>
            <span className="font-pixel text-xl sm:text-3xl font-black text-white block">{freeFireCount}</span>
          </div>

          <div className="bg-[#0D131F] border-2 border-black p-3.5 shadow-brutal-black text-center space-y-1">
            <span className="font-pixel text-[8px] sm:text-[9px] text-[#00F0FF] uppercase block">FORTNITE</span>
            <span className="font-pixel text-xl sm:text-3xl font-black text-white block">{fortniteCount}</span>
          </div>

          <div className="bg-[#0D131F] border-2 border-black p-3.5 shadow-brutal-black text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="font-pixel text-[8px] sm:text-[9px] text-[#A855F7] uppercase block">CLASH ROYALE</span>
            <span className="font-pixel text-xl sm:text-3xl font-black text-white block">{clashCount}</span>
          </div>
        </div>

        {/* ======================================================= */}
        {/* 3. FILTERS & TERMINAL SEARCH BAR                        */}
        {/* ======================================================= */}
        <div className="bg-[#0B101A] border-4 border-black p-4 mb-8 shadow-brutal-black space-y-4">
          
          {/* Game Selection Cartridge Tabs */}
          <div className="flex flex-wrap gap-2 pb-1">
            {gameFilters.map((tab) => {
              const isSelected = selectedGame === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGame(tab.id)}
                  className={`btn-arcade-press font-pixel text-[9px] sm:text-[10px] px-3.5 py-2.5 border-2 border-black uppercase font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFE600] text-black shadow-brutal-yellow font-black'
                      : 'bg-black text-slate-300 hover:text-white shadow-brutal-black'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: isSelected ? '#000' : tab.color }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subfilter: Type & Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t-2 border-black">
            {/* Type selector */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`btn-arcade-press font-pixel text-[8px] sm:text-[9px] px-3 py-2 border-2 border-black uppercase cursor-pointer ${
                  selectedType === 'all'
                    ? 'bg-white text-black font-black shadow-brutal-white'
                    : 'bg-black text-slate-400 hover:text-white shadow-brutal-black'
                }`}
              >
                ALL ({registrations.length})
              </button>

              <button
                onClick={() => setSelectedType('teams')}
                className={`btn-arcade-press font-pixel text-[8px] sm:text-[9px] px-3 py-2 border-2 border-black uppercase flex items-center gap-1.5 cursor-pointer ${
                  selectedType === 'teams'
                    ? 'bg-[#FFE600] text-black font-black shadow-brutal-yellow'
                    : 'bg-black text-slate-400 hover:text-white shadow-brutal-black'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>TEAMS ({totalTeams})</span>
              </button>

              <button
                onClick={() => setSelectedType('individuals')}
                className={`btn-arcade-press font-pixel text-[8px] sm:text-[9px] px-3 py-2 border-2 border-black uppercase flex items-center gap-1.5 cursor-pointer ${
                  selectedType === 'individuals'
                    ? 'bg-[#00F0FF] text-black font-black shadow-brutal-cyan'
                    : 'bg-black text-slate-400 hover:text-white shadow-brutal-black'
                }`}
              >
                <User className="w-3 h-3" />
                <span>SOLO ({registrations.length - totalTeams})</span>
              </button>
            </div>

            {/* Retro Command Line Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Terminal className="w-3.5 h-3.5 text-[#FFE600] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="searchParticipantInput"
                name="searchParticipant"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="BUSCAR EQUIPO O JUGADOR..."
                aria-label="Buscar equipo o jugador"
                className="w-full pl-9 pr-3 py-2 bg-black border-2 border-black text-xs font-pixel text-[#00F0FF] placeholder:text-slate-600 focus:outline-none focus:border-[#FFE600] shadow-brutal-black"
              />
            </div>
          </div>

        </div>

        {/* ======================================================= */}
        {/* 4. PARTICIPANTS GRID (ARCADE ROSTER CARDS)              */}
        {/* ======================================================= */}
        {filtered.length === 0 ? (
          <div className="p-12 border-4 border-black bg-[#0B101A] text-center space-y-3 shadow-brutal-black">
            <span className="text-[#FFE600] font-pixel text-xs sm:text-sm block">
              [ NO PLAYERS FOUND IN THIS SLOT ]
            </span>
            <p className="text-xs text-slate-400 font-cyber">
              Prueba con otro término de búsqueda o selecciona otro videojuego.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* 1. SECCIÓN DE EQUIPOS (SLOTS 5v5 / ESCUADRAS / DÚOS) */}
            {teamsList.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b-2 border-black font-pixel text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFE600] text-black px-2 py-0.5 border border-black font-black">
                      TEAMS
                    </span>
                    <span className="text-white">EQUIPOS Y ESCUADRAS ({teamsList.length})</span>
                  </div>
                  <span className="text-slate-400">5v5 / ESCUADRAS / DUOS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamsList.map((item) => {
                    const badgeInfo = getGameBadge(item.game, item.modality);
                    const GameIcon = badgeInfo.icon;
                    const isApproved = item.status === 'approved';

                    return (
                      <div
                        key={item.id}
                        className={`bg-[#0A0E17] border-4 border-black ${badgeInfo.shadowClass} flex flex-col justify-between transition-all duration-150`}
                      >
                        {/* Top Cartridge Header */}
                        <div 
                          className="p-2.5 px-3 border-b-2 border-black flex items-center justify-between font-pixel text-[8px] sm:text-[9px]"
                          style={{ backgroundColor: '#000' }}
                        >
                          <div className="flex items-center gap-1.5" style={{ color: badgeInfo.color }}>
                            <GameIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{badgeInfo.label}</span>
                          </div>

                          <div>
                            {isApproved ? (
                              <span className="bg-[#10B981] text-black px-2 py-0.5 border border-black font-black">
                                CONFIRMADO
                              </span>
                            ) : item.status === 'payment_pending' ? (
                              <span className="bg-[#00F0FF] text-black px-2 py-0.5 border border-black font-black">
                                PRE-REGISTRO
                              </span>
                            ) : (
                              <span className="bg-[#FFE600] text-black px-2 py-0.5 border border-black font-black">
                                VERIFICANDO
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <h3 className="text-xl font-black text-white uppercase font-display tracking-wide truncate drop-shadow-[1px_1px_0px_#000]">
                              {item.team_name}
                            </h3>

                            {/* Official Roster Box */}
                            <div className="bg-black border-2 border-black">
                              <div className="px-3 py-1 bg-[#121A2A] border-b border-black flex items-center justify-between font-pixel text-[8px] text-[#FFE600]">
                                <span>ROSTER ({item.members.length + 1})</span>
                                <span className="text-slate-400">STATUS: ACTIVE</span>
                              </div>

                              <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                                {/* Captain entry */}
                                <div className="flex items-center justify-between py-1 px-2 bg-[#FFE600]/15 border border-[#FFE600]/40 text-white font-cyber text-xs">
                                  <div className="flex items-center gap-2 truncate pr-1">
                                    <span className="font-pixel text-[8px] bg-[#FFE600] text-black px-1 font-black">1P</span>
                                    <span className="truncate font-bold">{item.captain_name}</span>
                                  </div>
                                  <span className="text-[#FFE600] font-pixel text-[9px] shrink-0">
                                    {item.captain_game_id}
                                  </span>
                                </div>

                                {/* Members */}
                                {item.members.map((member, idx) => (
                                  <div 
                                    key={idx} 
                                    className={`flex items-center justify-between py-1 px-2 font-cyber text-xs border border-white/5 ${
                                      member.is_substitute 
                                        ? 'bg-[#A855F7]/15 text-slate-300' 
                                        : 'bg-[#0E1524] text-slate-200'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate pr-1">
                                      <span className="font-pixel text-[8px] text-slate-500">
                                        {String(idx + 2)}P
                                      </span>
                                      <span className="truncate">
                                        {member.name || `Jugador #${idx + 2}`}
                                      </span>
                                      {member.is_substitute && (
                                        <span className="font-pixel text-[7px] bg-[#A855F7] text-black px-1 font-bold">SUB</span>
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

                          {/* Card Footer Bar */}
                          <div className="pt-3 border-t-2 border-black flex items-center justify-between font-pixel text-[8px] text-slate-400">
                            <span>ID: #{item.id.slice(0, 8).toUpperCase()}</span>
                            <span className="bg-black text-[#FFE600] border border-white/20 px-2 py-0.5">
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

            {/* 2. SECCIÓN DE JUGADORES INDIVIDUALES (SOLO) */}
            {individualsList.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b-2 border-black font-pixel text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#00F0FF] text-black px-2 py-0.5 border border-black font-black">
                      SOLO
                    </span>
                    <span className="text-white">JUGADORES INDIVIDUALES ({individualsList.length})</span>
                  </div>
                  <span className="text-slate-400">1v1 / SOLITARIO / INDIVIDUAL</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {individualsList.map((item) => {
                    const badgeInfo = getGameBadge(item.game, item.modality);
                    const GameIcon = badgeInfo.icon;
                    const isApproved = item.status === 'approved';

                    return (
                      <div
                        key={item.id}
                        className={`bg-[#0A0E17] border-4 border-black ${badgeInfo.shadowClass} flex flex-col justify-between`}
                      >
                        {/* Header Bar */}
                        <div className="p-2 px-3 bg-black border-b-2 border-black flex items-center justify-between font-pixel text-[8px]">
                          <div className="flex items-center gap-1.5" style={{ color: badgeInfo.color }}>
                            <GameIcon className="w-3 h-3 shrink-0" />
                            <span className="truncate">{badgeInfo.label}</span>
                          </div>

                          <div>
                            {isApproved ? (
                              <span className="bg-[#10B981] text-black px-1.5 py-0.5 font-bold">OK</span>
                            ) : (
                              <span className="bg-[#FFE600] text-black px-1.5 py-0.5 font-bold">WAIT</span>
                            )}
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-3">
                          <div className="bg-black border-2 border-black p-3 space-y-2">
                            <div>
                              <span className="font-pixel text-[7px] text-slate-500 uppercase block">
                                PLAYER NAME
                              </span>
                              <h3 className="font-display font-black text-lg text-white uppercase truncate">
                                {item.captain_name || 'JUGADOR'}
                              </h3>
                            </div>

                            <div className="pt-2 border-t border-white/10">
                              <span className="font-pixel text-[7px] text-[#FFE600] uppercase block">
                                IN-GAME ID
                              </span>
                              <span className="font-cyber font-bold text-sm text-[#00F0FF] uppercase truncate block">
                                {item.captain_game_id || item.team_name || '---'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between font-pixel text-[8px] text-slate-400 pt-1">
                            <span>#{item.id.slice(0, 8).toUpperCase()}</span>
                            <span className="text-[#10B981]">[ READY ]</span>
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
        {/* 5. BOTTOM CALL TO ACTION (NEO-BRUTALIST BANNER)         */}
        {/* ======================================================= */}
        <div className="mt-12 p-6 sm:p-8 border-4 border-black bg-[#0C121D] shadow-brutal-yellow flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="font-pixel text-[9px] text-[#FFE600] uppercase tracking-wider">
              ★ REGISTRATION IS LIVE ★
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-display tracking-wide drop-shadow-[2px_2px_0px_#000]">
              ¿QUIERES VER TU NOMBRE O ESCUADRA EN ESTA LISTA?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-cyber leading-relaxed">
              Inscribe a tu equipo o regístrate en solitario antes del cierre de inscripciones.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenRegister}
            className="btn-arcade-press shadow-brutal-pink w-full sm:w-auto px-8 py-4 bg-[#FFE600] text-black border-2 border-black font-pixel font-black text-xs uppercase tracking-wider text-center transition-all shrink-0 cursor-pointer"
          >
            [ INSERT COIN // INSCRIBIR A MI EQUIPO ]
          </button>
        </div>

      </div>

    </section>
  );
}
