import React, { useState, useEffect } from 'react';
import { 
  X, Lock, CheckCircle, XCircle, Eye, Phone, Copy, Check, 
  Users, DollarSign, Database, Trophy, AlertCircle, Search 
} from 'lucide-react';
import { 
  getRegistrations, 
  updateRegistrationStatus, 
  getValorantMatches, 
  updateValorantMatch,
  getClashMatches,
  updateClashMatch,
  getBattleRoyaleStandings,
  saveBattleRoyaleStandings,
  getSchedule,
  getSupabaseCredentials,
  saveSupabaseCredentials
} from '../lib/storage';
import { GAMES } from '../data/tournamentData';

export default function AdminPanel({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Sub-tab
  const [activeAdminTab, setActiveAdminTab] = useState('registrations'); // 'registrations', 'free_agents', 'brackets', 'schedule', 'supabase'

  // Data states
  const [registrations, setRegistrations] = useState([]);
  const [filterGame, setFilterGame] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [copiedPhones, setCopiedPhones] = useState(false);

  // Brackets states
  const [valorantMatches, setValorantMatches] = useState([]);
  const [clashMatches, setClashMatches] = useState([]);
  const [brStandings, setBrStandings] = useState({ free_fire_escuadras: [], free_fire_solitario: [], fortnite_duos: [] });

  // Supabase Config state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseSaved, setSupabaseSaved] = useState(false);

  const loadAllData = async () => {
    const regs = await getRegistrations();
    setRegistrations(regs);
    setValorantMatches(getValorantMatches());
    setClashMatches(getClashMatches());
    setBrStandings(getBattleRoyaleStandings());

    const creds = getSupabaseCredentials();
    setSupabaseUrl(creds.url);
    setSupabaseAnonKey(creds.anonKey);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Default master password for Compu League Staff
    if (passwordInput === 'compu2026' || passwordInput === 'admin2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta. (Clave por defecto: compu2026)');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    let notes = '';
    if (newStatus === 'rejected') {
      notes = prompt('Ingresa el motivo del rechazo (ej. Comprobante ilegible, valor no coincide):') || 'Comprobante no válido';
    } else if (newStatus === 'approved') {
      notes = 'Comprobante de Banco Pichincha validado por el staff.';
    }

    const updated = await updateRegistrationStatus(id, newStatus, notes);
    setRegistrations(updated);
  };

  // Copy all approved WhatsApp numbers to clipboard for creating WhatsApp Groups
  const handleCopyAllPhones = () => {
    const phones = registrations
      .filter(r => r.status === 'approved')
      .map(r => r.captain_whatsapp)
      .filter(Boolean);

    // Also include member phones
    registrations.filter(r => r.status === 'approved').forEach(r => {
      if (Array.isArray(r.members)) {
        r.members.forEach(m => {
          if (m.whatsapp) phones.push(m.whatsapp);
        });
      }
    });

    const unique = [...new Set(phones)].join(', ');
    navigator.clipboard.writeText(unique);
    setCopiedPhones(true);
    setTimeout(() => setCopiedPhones(false), 2500);
  };

  // Score match handler for Valorant
  const handleScoreUpdateValorant = (matchId, scoreA, scoreB) => {
    const numA = parseInt(scoreA, 10) || 0;
    const numB = parseInt(scoreB, 10) || 0;
    const match = valorantMatches.find(m => m.id === matchId);
    let winner = null;
    let status = 'completed';

    if (numA > numB) winner = match.teamA;
    else if (numB > numA) winner = match.teamB;
    else status = 'scheduled';

    const updated = updateValorantMatch(matchId, {
      scoreA: numA,
      scoreB: numB,
      winner,
      status,
    });
    setValorantMatches(updated);
  };

  // Score match handler for Clash Royale
  const handleScoreUpdateClash = (matchId, scoreA, scoreB) => {
    const numA = parseInt(scoreA, 10) || 0;
    const numB = parseInt(scoreB, 10) || 0;
    const match = clashMatches.find(m => m.id === matchId);
    let winner = null;
    let status = 'completed';

    if (numA >= 2) winner = match.playerA;
    else if (numB >= 2) winner = match.playerB;
    else status = 'scheduled';

    const updated = updateClashMatch(matchId, {
      scoreA: numA,
      scoreB: numB,
      winner,
      status,
    });
    setClashMatches(updated);
  };

  // Update BR row
  const handleUpdateBRKills = (gameKey, index, newKills, newRank) => {
    const currentList = [...brStandings[gameKey]];
    if (currentList[index]) {
      currentList[index].kills = parseInt(newKills, 10) || 0;
      if (newRank) {
        currentList[index].rank = parseInt(newRank, 10) || 1;
        if (currentList[index].rank === 1) {
          currentList[index].status = '¡Sobreviviente Ganador!';
          currentList[index].isWinner = true;
        } else {
          currentList[index].status = `Eliminado (Top ${currentList[index].rank})`;
          currentList[index].isWinner = false;
        }
      }
    }
    const updated = saveBattleRoyaleStandings(gameKey, currentList);
    setBrStandings(updated);
  };

  // Save Supabase Keys
  const handleSaveSupabase = (e) => {
    e.preventDefault();
    saveSupabaseCredentials(supabaseUrl.trim(), supabaseAnonKey.trim());
    setSupabaseSaved(true);
    setTimeout(() => setSupabaseSaved(false), 3000);
    loadAllData();
  };

  // Calculations
  const totalApproved = registrations.filter(r => r.status === 'approved').length;
  const totalPending = registrations.filter(r => r.status === 'pending').length;
  const totalRevenue = registrations
    .filter(r => r.status === 'approved')
    .reduce((acc, r) => acc + (parseFloat(r.amount_due) || 0), 0);
  const freeAgentsList = registrations.filter(r => r.is_free_agent);

  // Filtered registrations
  const filteredRegs = registrations.filter(r => {
    if (filterGame !== 'all' && r.game !== filterGame) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = r.captain_name?.toLowerCase().includes(q);
      const matchTeam = r.team_name?.toLowerCase().includes(q);
      const matchId = r.captain_game_id?.toLowerCase().includes(q);
      const matchPhone = r.captain_whatsapp?.includes(q);
      return matchName || matchTeam || matchId || matchPhone;
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#1a2742] border-4 border-[#364e78] shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col font-['Press_Start_2P',monospace] select-none text-slate-100">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#151f33] border-b-2 border-[#2f4469] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#253961] border-2 border-yellow-400/50 flex items-center justify-center text-yellow-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 font-['Silkscreen',monospace]">
                Panel de Administración Staff
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#253961] border border-[#476799] text-yellow-300">
                  Compu League 2026
                </span>
              </h3>
              <p className="text-[10px] text-[#a5badb] font-mono">
                Gestión de inscripciones, comprobantes Banco Pichincha, brackets y salas en vivo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-none bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto text-cyan-300">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white uppercase">Acceso Autorizado</h4>
              <p className="text-xs text-slate-400 mt-1">
                Ingresa la clave de administrador del torneo para gestionar inscripciones y resultados.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="p-3 rounded-none bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                  {authError}
                </div>
              )}
              <input
                type="password"
                required
                placeholder="Contraseña del staff (ej: compu2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-none bg-slate-900 border border-slate-700 text-white text-center tracking-widest text-base focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-none font-bold text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-yellow-300 hover:to-amber-300 transition shadow-lg shadow-amber-500/20"
              >
                Ingresar al Panel
              </button>
              <p className="text-[11px] text-slate-500">
                Clave por defecto: <code className="text-cyan-400">compu2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-none bg-slate-900/80 border border-slate-800 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-none bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Inscritos Totales</span>
                  <strong className="text-xl font-mono text-white">{registrations.length}</strong>
                </div>
              </div>

              <div className="p-4 rounded-none bg-slate-900/80 border border-slate-800 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-none bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Por Validar</span>
                  <strong className="text-xl font-mono text-amber-400">{totalPending}</strong>
                </div>
              </div>

              <div className="p-4 rounded-none bg-slate-900/80 border border-slate-800 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-none bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Validados / Pagados</span>
                  <strong className="text-xl font-mono text-emerald-400">{totalApproved}</strong>
                </div>
              </div>

              <div className="p-4 rounded-none bg-slate-900/80 border border-slate-800 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-none bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Recaudación Validada</span>
                  <strong className="text-xl font-mono text-yellow-400">${totalRevenue.toFixed(2)} USD</strong>
                </div>
              </div>
            </div>

            {/* Navigation Tabs within Admin */}
            <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-800">
              {[
                { id: 'registrations', label: `Inscripciones (${registrations.length})`, icon: Users },
                { id: 'free_agents', label: `Inscripciones Individuales (${freeAgentsList.length})`, icon: Users },
                { id: 'brackets', label: 'Gestor de Brackets & Marcadores', icon: Trophy },
                { id: 'supabase', label: 'Conexión Supabase (Nube)', icon: Database },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeAdminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAdminTab(tab.id)}
                    className={`px-4 py-2.5 rounded-none font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ----------------------------------------------------------- */}
            {/* TAB 1: REGISTRATIONS & RECEIPT VALIDATOR */}
            {/* ----------------------------------------------------------- */}
            {activeAdminTab === 'registrations' && (
              <div className="space-y-4">
                
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-none border border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre, nick, equipo o cel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-1.5 rounded-none bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-56 sm:w-64"
                      />
                    </div>

                    {/* Filter Game */}
                    <select
                      value={filterGame}
                      onChange={(e) => setFilterGame(e.target.value)}
                      className="px-3 py-1.5 rounded-none bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="all">Todos los Juegos</option>
                      {GAMES.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>

                    {/* Filter Status */}
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-1.5 rounded-none bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="all">Todos los Estados</option>
                      <option value="pending">Pendientes de Pago</option>
                      <option value="approved">Aprobados / Validados</option>
                      <option value="rejected">Rechazados</option>
                    </select>
                  </div>

                  {/* Super Button: Copy WhatsApp Numbers */}
                  <button
                    onClick={handleCopyAllPhones}
                    className="px-4 py-2 rounded-none bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    {copiedPhones ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPhones ? '¡Números Copiados!' : 'Copiar WhatsApps para Grupos'}</span>
                  </button>
                </div>

                {/* Table of Registrations */}
                <div className="rounded-none bg-slate-900/60 border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Juego & Modalidad</th>
                          <th className="py-3 px-4">Equipo / Participante</th>
                          <th className="py-3 px-4">Capitán / Contacto</th>
                          <th className="py-3 px-4">Integrantes</th>
                          <th className="py-3 px-4 text-center">Monto</th>
                          <th className="py-3 px-4 text-center">Comprobante</th>
                          <th className="py-3 px-4 text-center">Estado</th>
                          <th className="py-3 px-4 text-right">Acciones Staff</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredRegs.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="py-8 text-center text-slate-500">
                              No hay inscripciones registradas que coincidan con los filtros.
                            </td>
                          </tr>
                        ) : (
                          filteredRegs.map((reg) => (
                            <tr key={reg.id} className="hover:bg-slate-800/30 transition">
                              <td className="py-3 px-4">
                                <span className="font-bold text-white block uppercase">
                                  {reg.game.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] text-cyan-400 font-mono">
                                  {reg.modality}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-bold text-white block">
                                  {reg.team_name || 'Individual'}
                                </span>
                                {reg.is_free_agent && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-none bg-amber-400/20 text-amber-300 font-bold">
                                    Individual
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="space-y-0.5">
                                  <span className="font-semibold text-slate-200 block">
                                    {reg.captain_name} ({reg.captain_game_id})
                                  </span>
                                  <a
                                    href={`https://wa.me/${reg.captain_whatsapp.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                                  >
                                    <Phone className="w-3 h-3" />
                                    {reg.captain_whatsapp}
                                  </a>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {Array.isArray(reg.members) && reg.members.length > 0 ? (
                                  <div className="space-y-0.5 max-w-[200px]">
                                    <span className="text-slate-400 text-[10px] block font-mono">
                                      {reg.members.length} miembros:
                                    </span>
                                    {reg.members.map((m, idx) => (
                                      <span key={idx} className="block text-[11px] text-slate-300 truncate">
                                        • {m.name} ({m.game_id}) {m.isSubstitute && <em className="text-amber-400">(Suplente)</em>}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-500 italic text-[11px]">Sin miembros extra</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">
                                ${(parseFloat(reg.amount_due) || 1).toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {reg.receipt_url ? (
                                  <button
                                    onClick={() => setSelectedReceipt(reg.receipt_url)}
                                    className="px-2.5 py-1 rounded-none bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-semibold text-[11px] flex items-center gap-1 mx-auto transition"
                                  >
                                    <Eye className="w-3 h-3" />
                                    Ver Captura
                                  </button>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">Sin foto</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-2.5 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider ${
                                  reg.status === 'approved'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : reg.status === 'rejected'
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                }`}>
                                  {reg.status === 'approved' ? 'Validado' : reg.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {reg.status !== 'approved' && (
                                    <button
                                      onClick={() => handleStatusChange(reg.id, 'approved')}
                                      title="Validar y Aprobar Pago"
                                      className="p-1.5 rounded-none bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                  {reg.status !== 'rejected' && (
                                    <button
                                      onClick={() => handleStatusChange(reg.id, 'rejected')}
                                      title="Rechazar Comprobante"
                                      className="p-1.5 rounded-none bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* TAB 2: INDIVIDUALES */}
            {/* ----------------------------------------------------------- */}
            {activeAdminTab === 'free_agents' && (
              <div className="space-y-4">
                <div className="p-4 rounded-none bg-[#091129] border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Lista de Jugadores Individuales para Asignar
                    </h4>
                    <p className="text-xs text-slate-400">
                      Jugadores inscritos individualmente sin equipo. Reúnelos por Discord o WhatsApp para conformar escuadras de Valorant o Free Fire.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-none bg-amber-400 text-slate-950 font-bold text-xs font-mono">
                    {freeAgentsList.length} Jugadores
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {freeAgentsList.map((agent) => (
                    <div key={agent.id} className="p-4 rounded-none bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                          {agent.game.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-none bg-slate-800 text-slate-300 font-bold">
                          ${(parseFloat(agent.amount_due) || 1).toFixed(2)}
                        </span>
                      </div>
                      <h5 className="font-bold text-white text-sm">{agent.captain_name}</h5>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>ID: <strong className="text-slate-200">{agent.captain_game_id}</strong></div>
                        <div>WhatsApp: <strong className="text-emerald-400">{agent.captain_whatsapp}</strong></div>
                      </div>
                      <a
                        href={`https://wa.me/${agent.captain_whatsapp.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(agent.captain_name)},%20te%20escribimos%20de%20Compu%20League%20para%20asignarte%20equipo%20en%20${agent.game}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 rounded-none bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition mt-2"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Contactar para Equipo
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* TAB 3: GESTOR DE BRACKETS Y MARCADORES EN VIVO */}
            {/* ----------------------------------------------------------- */}
            {activeAdminTab === 'brackets' && (
              <div className="space-y-8">
                
                {/* Valorant Match Editor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm uppercase text-white flex items-center gap-2">
                      <span className="w-3 h-3 rounded-none bg-rose-500"></span>
                      Actualizar Marcadores de Valorant (Upper & Lower)
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">Modificación en Vivo</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {valorantMatches.map((m) => (
                      <div key={m.id} className="p-3.5 rounded-none bg-slate-900 border border-slate-800 space-y-2">
                        <div className="text-[10px] font-mono text-cyan-400 flex items-center justify-between">
                          <span>{m.round}</span>
                          <span className="text-slate-400">ID: {m.id}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="truncate flex-1 font-bold text-white">{m.teamA}</span>
                          <input
                            type="number"
                            min="0"
                            max="30"
                            defaultValue={m.scoreA}
                            id={`scoreA-${m.id}`}
                            className="w-12 text-center py-1 rounded-none bg-slate-950 border border-slate-700 text-cyan-300 font-mono font-bold"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="truncate flex-1 font-bold text-white">{m.teamB}</span>
                          <input
                            type="number"
                            min="0"
                            max="30"
                            defaultValue={m.scoreB}
                            id={`scoreB-${m.id}`}
                            className="w-12 text-center py-1 rounded-none bg-slate-950 border border-slate-700 text-cyan-300 font-mono font-bold"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const valA = document.getElementById(`scoreA-${m.id}`).value;
                            const valB = document.getElementById(`scoreB-${m.id}`).value;
                            handleScoreUpdateValorant(m.id, valA, valB);
                          }}
                          className="w-full py-1.5 rounded-none bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition"
                        >
                          Guardar Resultado
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clash Royale Editor */}
                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <h4 className="font-black text-sm uppercase text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-none bg-cyan-400"></span>
                    Actualizar Marcadores Clash Royale (Bo3)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {clashMatches.map((m) => (
                      <div key={m.id} className="p-3.5 rounded-none bg-slate-900 border border-slate-800 space-y-2">
                        <div className="text-[10px] font-mono text-cyan-400 flex items-center justify-between">
                          <span>{m.round}</span>
                          <span className="text-slate-400">Partida #{m.matchIndex}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="truncate flex-1 font-bold text-white">{m.playerA}</span>
                          <input
                            type="number"
                            min="0"
                            max="3"
                            defaultValue={m.scoreA}
                            id={`crA-${m.id}`}
                            className="w-12 text-center py-1 rounded-none bg-slate-950 border border-slate-700 text-cyan-300 font-mono font-bold"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="truncate flex-1 font-bold text-white">{m.playerB}</span>
                          <input
                            type="number"
                            min="0"
                            max="3"
                            defaultValue={m.scoreB}
                            id={`crB-${m.id}`}
                            className="w-12 text-center py-1 rounded-none bg-slate-950 border border-slate-700 text-cyan-300 font-mono font-bold"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const valA = document.getElementById(`crA-${m.id}`).value;
                            const valB = document.getElementById(`crB-${m.id}`).value;
                            handleScoreUpdateClash(m.id, valA, valB);
                          }}
                          className="w-full py-1.5 rounded-none bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition"
                        >
                          Guardar Bo3
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Free Fire & Fortnite BR Kills / Placement Editor */}
                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <h4 className="font-black text-sm uppercase text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-none bg-amber-400"></span>
                    Actualizar Puesto & Kills en Battle Royale (Free Fire / Fortnite)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ingresa el puesto (#1 para el último sobreviviente) y la cantidad de bajas para que se actualice la tabla en vivo.
                  </p>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-amber-300 block">Free Fire Escuadras:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                      {brStandings.free_fire_escuadras.map((row, idx) => (
                        <div key={idx} className="p-2.5 rounded-none bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                          <span className="font-bold text-white truncate block">{row.team}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">Puesto:</span>
                            <input
                              type="number"
                              defaultValue={row.rank}
                              id={`ff-rank-${idx}`}
                              className="w-12 text-center py-0.5 rounded-none bg-slate-950 border border-slate-700 text-white font-mono"
                            />
                            <span className="text-[10px] text-slate-400">Kills:</span>
                            <input
                              type="number"
                              defaultValue={row.kills}
                              id={`ff-kills-${idx}`}
                              className="w-12 text-center py-0.5 rounded-none bg-slate-950 border border-slate-700 text-white font-mono"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const r = document.getElementById(`ff-rank-${idx}`).value;
                              const k = document.getElementById(`ff-kills-${idx}`).value;
                              handleUpdateBRKills('free_fire_escuadras', idx, k, r);
                            }}
                            className="w-full py-1 rounded-none bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-cyan-300"
                          >
                            Actualizar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* TAB 4: CONEXIÓN SUPABASE */}
            {/* ----------------------------------------------------------- */}
            {activeAdminTab === 'supabase' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="p-5 rounded-none bg-slate-900/90 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black uppercase text-white">
                        Conectar con tu Base de Datos en Supabase
                      </h4>
                      <p className="text-xs text-slate-400">
                        Sincronización en la nube gratuita para brackets y registros en tiempo real.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. Crea tu proyecto gratuito en <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-bold">supabase.com</a>.<br/>
                    2. En el <strong>SQL Editor</strong> de Supabase, copia y pega el archivo <code className="text-amber-300 font-mono">src/supabase_schema.sql</code> para crear las tablas con 1 clic.<br/>
                    3. Ve a <strong>Project Settings &gt; API</strong> y copia tu <strong>Project URL</strong> y <strong>anon public key</strong> aquí abajo:
                  </p>
                </div>

                <form onSubmit={handleSaveSupabase} className="p-5 rounded-none bg-slate-900 border border-slate-800 space-y-4">
                  {supabaseSaved && (
                    <div className="p-3 rounded-none bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>¡Credenciales de Supabase guardadas y sincronizadas con éxito!</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-300 uppercase">
                      Project URL de Supabase:
                    </label>
                    <input
                      type="url"
                      placeholder="https://xyzcompany.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-none bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-300 uppercase">
                      Anon Public Key:
                    </label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-none bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-none font-bold text-xs uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition"
                  >
                    Guardar y Conectar Supabase
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </div>

      {/* FULL RECEIPT ZOOM MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-slate-900 border border-cyan-500/40 rounded-none p-4 shadow-2xl">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 rounded-none bg-slate-800 text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-white mb-3">
              Comprobante de Transferencia Bancaria:
            </h4>
            <div className="max-h-[75vh] overflow-auto rounded-none border border-slate-800 flex items-center justify-center bg-black/50 p-2">
              <img
                src={selectedReceipt}
                alt="Comprobante en detalle"
                className="max-w-full h-auto object-contain rounded-none"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-none bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


