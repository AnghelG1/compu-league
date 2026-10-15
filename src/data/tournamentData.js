// Configuración General del Torneo Compu League E-Sports 2026
// Torneo Oficial Multiplataforma

export const BANK_INFO = {
  bank: 'Banco Pichincha',
  accountType: 'Cuenta de Ahorros',
  accountNumber: '2206402368',
  holderName: 'Cristopher Lomas',
  email: 'crislomasfe@gmail.com',
  costPerPerson: 1.00,
  currency: 'USD',
  notes: 'Recuerda guardar la captura de tu comprobante de transferencia bancaria para adjuntarla en tu registro.',
};

export const CONTACT_INFO = {
  whatsappStaff: '0962074110',
  whatsappDirectUrl: 'https://wa.me/593962074110?text=Hola,%20tengo%20una%20consulta%20sobre%20el%20torneo%20Compu%20League%202026',
  discordUrl: 'https://discord.gg/ynfD8aHHmP',
  streamFacebook: 'https://facebook.com', // Enlace o transmisión de la carrera
  deadlineIso: '2026-11-01T23:59:59-05:00',
  deadlineLabel: '1 de Noviembre de 2026',
  tournamentDatesLabel: '4, 5 y 6 de Noviembre de 2026 (Noches)',
};

export const GAMES = [
  {
    id: 'valorant',
    name: 'VALORANT',
    badge: '5v5 Táctico',
    color: '#ff4655',
    accentColor: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-500/40',
    glowColor: 'shadow-rose-500/20',
    description: 'Enfrentamientos tácticos en primera persona con disparos precisos y habilidades únicas de personajes.',
    teamFormat: '5 Titulares + 1 Suplente Opcional',
    requiredPlayers: 5,
    maxPlayers: 6,
    substitutesAllowed: true,
    priceTotal: 5.00,
    priceNote: '$5 por equipo ($1 por persona, suplente gratis)',
    bracketType: 'double_elimination', // Loser bracket
    formatDetail: 'Doble Eliminación (Winners Bracket, Loser Bracket y Gran Final). Partidas al mejor de 1 (Bo1), Finales al mejor de 3 (Bo3).',
    platform: 'PC',
    icon: 'target',
  },
  {
    id: 'free_fire',
    name: 'FREE FIRE',
    badge: 'Escuadras (+ Individual)',
    color: '#f59e0b',
    accentColor: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-amber-500/20',
    description: 'Supervivencia al límite en móvil. ¡La inscripción por escuadra inscribe automáticamente a todos los integrantes en el torneo individual!',
    teamFormat: 'Escuadras (4 jugadores) o Individual (1 jugador)',
    requiredPlayers: 4,
    maxPlayers: 4,
    substitutesAllowed: false,
    priceTotal: 4.00,
    priceNote: '$4 por Escuadra, o $1 solo Individual.',
    bracketType: 'battle_royale',
    formatDetail: 'Partida Battle Royale por modalidad (1 sala Escuadras + 1 sala Individual). Inscribirte en escuadra te inscribe automáticamente en la individual. Gana el Último Sobreviviente (Top 1).',
    platform: 'Móvil / Emulador oficial',
    icon: 'flame',
  },
  {
    id: 'fortnite',
    name: 'FORTNITE',
    badge: 'Dúos',
    color: '#3b82f6',
    accentColor: 'from-blue-500 to-cyan-600',
    borderColor: 'border-blue-500/40',
    glowColor: 'shadow-blue-500/20',
    description: 'Batalla Campal de supervivencia y construcción/cero construcción en parejas.',
    teamFormat: 'Dúos',
    requiredPlayers: 2,
    maxPlayers: 2,
    substitutesAllowed: false,
    priceTotal: 2.00,
    priceNote: '$2 por Dúo ($1 por persona)',
    bracketType: 'battle_royale',
    formatDetail: 'Partida de Battle Royale. Gana el último dúo sobreviviente en pie (Top 1).',
    platform: ' ',
    icon: 'crosshair',
  },
  {
    id: 'clash_royale',
    name: 'CLASH ROYALE',
    badge: '1v1 Estrategia',
    color: '#06b6d4',
    accentColor: 'from-cyan-500 to-teal-600',
    borderColor: 'border-cyan-500/40',
    glowColor: 'shadow-cyan-500/20',
    description: 'Duelo de torres y cartas en tiempo real. Estrategia y reflejos rápidos.',
    teamFormat: 'Individual (1 jugador)',
    requiredPlayers: 1,
    maxPlayers: 1,
    substitutesAllowed: false,
    priceTotal: 1.00,
    priceNote: '$1 por jugador',
    bracketType: 'tournament_tree',
    formatDetail: 'Llave de Torneo eliminatoria directa. Duelos al mejor de 3 partidas (Bo3). Nivel de cartas estándar de torneo.',
    platform: 'Móvil (Android / iOS)',
    icon: 'crown',
  },
];

export const INITIAL_SCHEDULE = [
  {
    id: 'sch-1',
    dayLabel: 'Noche 1 - Miércoles 4 de Noviembre',
    date: '2026-11-04',
    time: '19:30 - 22:30',
    gameId: 'clash_royale',
    gameName: 'Clash Royale (1v1)',
    stageTitle: 'Fase Clasificatoria, Semifinales y Gran Final',
    status: 'Programado',
    streamLabel: 'En vivo por Facebook',
  },
  {
    id: 'sch-2',
    dayLabel: 'Noche 1 - Miércoles 4 de Noviembre',
    date: '2026-11-04',
    time: '21:00 - 23:00',
    gameId: 'free_fire',
    gameName: 'Free Fire (Solitario y Escuadras)',
    stageTitle: 'Sala 1: Solitario | Sala 2: Escuadras (Partida Única)',
    status: 'Programado',
    streamLabel: 'En vivo por Facebook',
  },
  {
    id: 'sch-3',
    dayLabel: 'Noche 2 - Jueves 5 de Noviembre',
    date: '2026-11-05',
    time: '19:30 - 21:30',
    gameId: 'fortnite',
    gameName: 'Fortnite (Dúos)',
    stageTitle: 'Sala Personalizada Battle Royale - Partida de Supervivencia',
    status: 'Programado',
    streamLabel: 'En vivo por Facebook',
  },
  {
    id: 'sch-4',
    dayLabel: 'Noche 2 - Jueves 5 de Noviembre',
    date: '2026-11-05',
    time: '21:00 - 23:30',
    gameId: 'valorant',
    gameName: 'Valorant (5v5)',
    stageTitle: 'Rondas 1 y 2 - Upper Bracket',
    status: 'Programado',
    streamLabel: 'En vivo por Facebook',
  },
  {
    id: 'sch-5',
    dayLabel: 'Noche 3 - Viernes 6 de Noviembre',
    date: '2026-11-06',
    time: '19:00 - 23:30',
    gameId: 'valorant',
    gameName: 'Valorant (5v5)',
    stageTitle: 'Loser Bracket, Final de Winners y Gran Final Bo3',
    status: 'Programado',
    streamLabel: 'En vivo por Facebook',
  },
];

// Equipos demo para que los brackets se vean vivos y completos desde el primer momento
export const DEMO_VALORANT_MATCHES = [
  // Upper Bracket R1
  { id: 'v-u1', bracket: 'upper', round: 'Cuartos de Final', matchIndex: 1, teamA: 'CyberKnights', teamB: 'Kernel Panic', scoreA: 13, scoreB: 9, winner: 'CyberKnights', status: 'completed' },
  { id: 'v-u2', bracket: 'upper', round: 'Cuartos de Final', matchIndex: 2, teamA: 'BitBusters', teamB: 'NullPointer', scoreA: 13, scoreB: 11, winner: 'BitBusters', status: 'completed' },
  { id: 'v-u3', bracket: 'upper', round: 'Cuartos de Final', matchIndex: 3, teamA: 'Overclockers', teamB: 'Root Access', scoreA: 10, scoreB: 13, winner: 'Root Access', status: 'completed' },
  { id: 'v-u4', bracket: 'upper', round: 'Cuartos de Final', matchIndex: 4, teamA: 'StackOverflow', teamB: 'Glitch Mob', scoreA: 13, scoreB: 7, winner: 'StackOverflow', status: 'completed' },
  // Upper Bracket Semifinals
  { id: 'v-u5', bracket: 'upper', round: 'Semifinal Upper', matchIndex: 5, teamA: 'CyberKnights', teamB: 'BitBusters', scoreA: 13, scoreB: 8, winner: 'CyberKnights', status: 'completed' },
  { id: 'v-u6', bracket: 'upper', round: 'Semifinal Upper', matchIndex: 6, teamA: 'Root Access', teamB: 'StackOverflow', scoreA: 11, scoreB: 13, winner: 'StackOverflow', status: 'completed' },
  // Upper Bracket Final
  { id: 'v-u7', bracket: 'upper', round: 'Final Upper Bracket', matchIndex: 7, teamA: 'CyberKnights', teamB: 'StackOverflow', scoreA: 0, scoreB: 0, winner: null, status: 'scheduled' },

  // Lower Bracket R1
  { id: 'v-l1', bracket: 'lower', round: 'Ronda 1 Loser', matchIndex: 8, teamA: 'Kernel Panic', teamB: 'NullPointer', scoreA: 13, scoreB: 6, winner: 'Kernel Panic', status: 'completed' },
  { id: 'v-l2', bracket: 'lower', round: 'Ronda 1 Loser', matchIndex: 9, teamA: 'Overclockers', teamB: 'Glitch Mob', scoreA: 13, scoreB: 10, winner: 'Overclockers', status: 'completed' },
  // Lower Bracket R2
  { id: 'v-l3', bracket: 'lower', round: 'Ronda 2 Loser', matchIndex: 10, teamA: 'Root Access', teamB: 'Kernel Panic', scoreA: 13, scoreB: 9, winner: 'Root Access', status: 'completed' },
  { id: 'v-l4', bracket: 'lower', round: 'Ronda 2 Loser', matchIndex: 11, teamA: 'BitBusters', teamB: 'Overclockers', scoreA: 13, scoreB: 7, winner: 'BitBusters', status: 'completed' },
  // Lower Bracket Semifinal
  { id: 'v-l5', bracket: 'lower', round: 'Semifinal Loser', matchIndex: 12, teamA: 'Root Access', teamB: 'BitBusters', scoreA: 0, scoreB: 0, winner: null, status: 'scheduled' },
  // Lower Final
  { id: 'v-l6', bracket: 'lower', round: 'Final Loser Bracket', matchIndex: 13, teamA: 'Por definir', teamB: 'Por definir', scoreA: 0, scoreB: 0, winner: null, status: 'scheduled' },

  // Grand Final Bo3
  { id: 'v-gf', bracket: 'grand_final', round: 'GRAN FINAL (Bo3)', matchIndex: 14, teamA: 'Ganador Upper', teamB: 'Ganador Loser', scoreA: 0, scoreB: 0, winner: null, status: 'scheduled' }
];

export const DEMO_CLASH_MATCHES = [
  // Cuartos
  { id: 'cr-1', round: 'Cuartos de Final', matchIndex: 1, playerA: 'Alex_Master', playerB: 'DarkKnight99', scoreA: 2, scoreB: 0, winner: 'Alex_Master', status: 'completed' },
  { id: 'cr-2', round: 'Cuartos de Final', matchIndex: 2, playerA: 'PekkaLover', playerB: 'ElixerKing', scoreA: 2, scoreB: 1, winner: 'PekkaLover', status: 'completed' },
  { id: 'cr-3', round: 'Cuartos de Final', matchIndex: 3, playerA: 'MinerGod', playerB: 'MegaKnight_X', scoreA: 1, scoreB: 2, winner: 'MegaKnight_X', status: 'completed' },
  { id: 'cr-4', round: 'Cuartos de Final', matchIndex: 4, playerA: 'SpellsPro', playerB: 'HogRider77', scoreA: 2, scoreB: 0, winner: 'SpellsPro', status: 'completed' },
  // Semis
  { id: 'cr-5', round: 'Semifinales', matchIndex: 5, playerA: 'Alex_Master', playerB: 'PekkaLover', scoreA: 2, scoreB: 1, winner: 'Alex_Master', status: 'completed' },
  { id: 'cr-6', round: 'Semifinales', matchIndex: 6, playerA: 'MegaKnight_X', playerB: 'SpellsPro', scoreA: 0, scoreB: 2, winner: 'SpellsPro', status: 'completed' },
  // Gran Final
  { id: 'cr-7', round: 'GRAN FINAL (Bo3)', matchIndex: 7, playerA: 'Alex_Master', playerB: 'SpellsPro', scoreA: 0, scoreB: 0, winner: null, status: 'scheduled' },
];

export const DEMO_BATTLE_ROYALE_STANDINGS = {
  free_fire_escuadras: [
    { rank: 1, team: 'Dragons E-Sports', captain: 'Mateo R.', kills: 14, status: '¡Sobreviviente Ganador!', isWinner: true },
    { rank: 2, team: 'BlackOut Squad', captain: 'Juan P.', kills: 9, status: 'Eliminado (Top 2)' },
    { rank: 3, team: 'Alpha Hunters', captain: 'Carlos M.', kills: 7, status: 'Eliminado (Top 3)' },
    { rank: 4, team: 'Ghost Gaming', captain: 'Brayan S.', kills: 5, status: 'Eliminado (Top 4)' },
    { rank: 5, team: 'Los Ingenieros FF', captain: 'Kevin B.', kills: 4, status: 'Eliminado (Top 5)' },
    { rank: 6, team: 'Nova Team', captain: 'Andrés V.', kills: 3, status: 'Eliminado (Top 6)' },
    { rank: 7, team: 'CyberShooters', captain: 'David L.', kills: 2, status: 'Eliminado (Top 7)' },
    { rank: 8, team: 'Pixel Warriors', captain: 'Sebastian F.', kills: 1, status: 'Eliminado (Top 8)' },
  ],
  free_fire_solitario: [
    { rank: 1, team: 'DarkShadow (Solitario)', captain: 'Joel T.', kills: 9, status: '¡Sobreviviente Ganador!', isWinner: true },
    { rank: 2, team: 'SniperWolf', captain: 'Esteban C.', kills: 6, status: 'Eliminado (Top 2)' },
    { rank: 3, team: 'ViperX', captain: 'Daniela G.', kills: 4, status: 'Eliminado (Top 3)' },
    { rank: 4, team: 'Phoenix99', captain: 'Ricardo O.', kills: 5, status: 'Eliminado (Top 4)' },
    { rank: 5, team: 'Kronos', captain: 'Martin B.', kills: 3, status: 'Eliminado (Top 5)' },
  ],
  fortnite_duos: [
    { rank: 1, team: 'ChugJug Boys (Dúo)', captain: 'Santiago & Leo', kills: 11, status: '¡Victoria Magistral!', isWinner: true },
    { rank: 2, team: 'Llama Looters', captain: 'Gabriel & Erick', kills: 8, status: 'Eliminado (Top 2)' },
    { rank: 3, team: 'Tilted Towers Club', captain: 'Jorge & Alan', kills: 6, status: 'Eliminado (Top 3)' },
    { rank: 4, team: 'Storm Chasers', captain: 'Marlon & Nico', kills: 4, status: 'Eliminado (Top 4)' },
    { rank: 5, team: 'BoxFight Masters', captain: 'Paul & Jhon', kills: 3, status: 'Eliminado (Top 5)' },
  ]
};
