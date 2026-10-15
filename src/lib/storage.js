// Sistema de Almacenamiento Unificado: Supabase + LocalStorage Fallback
import { createClient } from '@supabase/supabase-js';
import { 
  DEMO_VALORANT_MATCHES, 
  DEMO_CLASH_MATCHES, 
  DEMO_BATTLE_ROYALE_STANDINGS, 
  INITIAL_SCHEDULE 
} from '../data/tournamentData';

const STORAGE_KEYS = {
  REGISTRATIONS: 'compu_league_registrations',
  VALORANT_MATCHES: 'compu_league_valorant_matches',
  CLASH_MATCHES: 'compu_league_clash_matches',
  BR_STANDINGS: 'compu_league_br_standings',
  SCHEDULE: 'compu_league_schedule',
  SUPABASE_CONFIG: 'compu_league_supabase_config',
};

// Obtener credenciales desde localStorage o desde variables de entorno Vite
export const getSupabaseCredentials = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
  }
  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  };
};

export const saveSupabaseCredentials = (url, anonKey) => {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify({ url, anonKey }));
};

export const getSupabaseClient = () => {
  const creds = getSupabaseCredentials();
  if (creds.url && creds.anonKey) {
    try {
      return createClient(creds.url, creds.anonKey);
    } catch (err) {
      console.warn('Error inicializando cliente Supabase:', err);
    }
  }
  return null;
};

// -------------------------------------------------------------
// REGISTROS / INSCRIPCIONES
// -------------------------------------------------------------
export const getRegistrations = async () => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data;
  }

  // Fallback LocalStorage
  const savedLocal = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
  if (savedLocal) {
    try {
      const parsed = JSON.parse(savedLocal);
      if (Array.isArray(parsed) && parsed.length >= 8) {
        // Sanitize any legacy 'agente libre' text in cached localStorage
        const sanitized = parsed.map(r => ({
          ...r,
          admin_notes: r.admin_notes ? r.admin_notes.replace(/agente libre/gi, 'individual') : r.admin_notes
        }));
        return sanitized;
      }
    } catch (e) {}
  }

  // Registros demo iniciales para que el portal muestre equipos y jugadores de inmediato
  const defaultRegistrations = [
    // --- VALORANT (5v5) ---
    {
      id: 'reg-val-1',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      game: 'valorant',
      modality: '5v5',
      team_name: 'CyberKnights',
      is_free_agent: false,
      captain_name: 'Carlos Mendoza',
      captain_game_id: 'Shadow#LAN',
      captain_whatsapp: '+593987654321',
      captain_email: 'carlos.m@upec.edu.ec',
      amount_due: 5.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Transferencia validada en Banco Pichincha.',
      members: [
        { name: 'Mateo Ramos', game_id: 'MatR#LAN', whatsapp: '+593981111111' },
        { name: 'David Lomas', game_id: 'DaveL#LAN', whatsapp: '+593982222222' },
        { name: 'Kevin Benavides', game_id: 'KevB#LAN', whatsapp: '+593983333333' },
        { name: 'Andrés Villota', game_id: 'AndyV#LAN', whatsapp: '+593984444444' },
        { name: 'Paul Revelo (Suplente)', game_id: 'PauR#LAN', whatsapp: '+593985555555', is_substitute: true },
      ],
    },
    {
      id: 'reg-val-2',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      game: 'valorant',
      modality: '5v5',
      team_name: 'Vanguard Elite',
      is_free_agent: false,
      captain_name: 'Diego Morales',
      captain_game_id: 'Viper#LAN',
      captain_whatsapp: '+593982345678',
      captain_email: 'diego.m@gmail.com',
      amount_due: 5.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Inscripción confirmada.',
      members: [
        { name: 'Sebastián Guerra', game_id: 'ReynaGod#LAN', whatsapp: '+593981223344' },
        { name: 'Gabriel Paredes', game_id: 'OmenMain#LAN', whatsapp: '+593982334455' },
        { name: 'Christian Ruiz', game_id: 'SovaDarts#LAN', whatsapp: '+593983445566' },
        { name: 'Bryan Pozo', game_id: 'JettDiff#LAN', whatsapp: '+593984556677' },
        { name: 'Alex Meneses (Suplente)', game_id: 'CypherCam#LAN', whatsapp: '+593985667788', is_substitute: true },
      ],
    },
    {
      id: 'reg-val-3',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      game: 'valorant',
      modality: '5v5',
      team_name: 'Nexus Squad',
      is_free_agent: false,
      captain_name: 'Jhonatan Narváez',
      captain_game_id: 'Phoenix#LAN',
      captain_whatsapp: '+593991122334',
      captain_email: 'jhonatan.n@gmail.com',
      amount_due: 5.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Comprobante aprobado.',
      members: [
        { name: 'Kevin Rosero', game_id: 'SageHeal#LAN', whatsapp: '+593992233445' },
        { name: 'Daniel Enríquez', game_id: 'FadeHaunt#LAN', whatsapp: '+593993344556' },
        { name: 'Luis Ibarra', game_id: 'BrimStone#LAN', whatsapp: '+593994455667' },
        { name: 'Fernando Mora', game_id: 'BreachStun#LAN', whatsapp: '+593995566778' },
      ],
    },
    {
      id: 'reg-val-fa-1',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      game: 'valorant',
      modality: 'individual',
      team_name: 'Individual',
      is_free_agent: true,
      captain_name: 'Santiago Bolaños',
      captain_game_id: 'SantiB#LAN',
      captain_whatsapp: '+593974567890',
      captain_email: 'santi.b@gmail.com',
      amount_due: 1.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Inscripción individual lista para emparejar (Rol: Duelista / Iniciador).',
      members: [],
    },
    {
      id: 'reg-val-fa-2',
      created_at: new Date(Date.now() - 900000).toISOString(),
      game: 'valorant',
      modality: 'individual',
      team_name: 'Individual',
      is_free_agent: true,
      captain_name: 'Ricardo Chamorro',
      captain_game_id: 'RickySmokes#LAN',
      captain_whatsapp: '+593983344556',
      captain_email: 'ricky.c@gmail.com',
      amount_due: 1.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Inscripción individual lista (Rol: Controlador / Smokes).',
      members: [],
    },

    // --- FREE FIRE (ESCUADRAS Y SOLITARIO) ---
    {
      id: 'reg-ff-1',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      game: 'free_fire',
      modality: 'escuadras',
      team_name: 'Alpha Hunters',
      is_free_agent: false,
      captain_name: 'Brayan Silva',
      captain_game_id: 'BrayanFF_12',
      captain_whatsapp: '+593992345678',
      captain_email: 'brayan.s@gmail.com',
      amount_due: 4.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Comprobante verificado.',
      members: [
        { name: 'Juan Perez', game_id: 'Juancho_FF', whatsapp: '+593991234567' },
        { name: 'Esteban Carchi', game_id: 'Tiburón_7', whatsapp: '+593997654321' },
        { name: 'Joel Tulcán', game_id: 'JTulcan_Pro', whatsapp: '+593998888888' },
      ],
    },
    {
      id: 'reg-ff-2',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      game: 'free_fire',
      modality: 'escuadras',
      team_name: 'Los Intocables',
      is_free_agent: false,
      captain_name: 'Marco Tulcán',
      captain_game_id: 'M4rco_Pro',
      captain_whatsapp: '+593993456789',
      captain_email: 'marco.t@gmail.com',
      amount_due: 4.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Escuadra confirmada.',
      members: [
        { name: 'Alex Huertas', game_id: 'Alex_Sniper', whatsapp: '+593994567890' },
        { name: 'Edison Rosero', game_id: 'Eddy_Headshot', whatsapp: '+593995678901' },
        { name: 'William Cuasquer', game_id: 'Willy_Rush', whatsapp: '+593996789012' },
      ],
    },
    {
      id: 'reg-ff-solo-1',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      game: 'free_fire',
      modality: 'solitario',
      team_name: 'Kev_SoloFF',
      is_free_agent: false,
      captain_name: 'Kevin Portilla',
      captain_game_id: 'Kev_SoloFF',
      captain_whatsapp: '+593997788990',
      captain_email: 'kevin.p@gmail.com',
      amount_due: 1.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Modalidad Solitario confirmada.',
      members: [],
    },
    {
      id: 'reg-ff-solo-2',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      game: 'free_fire',
      modality: 'solitario',
      team_name: 'Bastidas_99',
      is_free_agent: false,
      captain_name: 'David Bastidas',
      captain_game_id: 'Bastidas_99',
      captain_whatsapp: '+593998899001',
      captain_email: 'david.b@gmail.com',
      amount_due: 1.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Modalidad Solitario confirmada.',
      members: [],
    },

    // --- FORTNITE (DÚOS) ---
    {
      id: 'reg-fn-1',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      game: 'fortnite',
      modality: 'duos',
      team_name: 'Chug Jug Dúo',
      is_free_agent: false,
      captain_name: 'Anthony Rosas',
      captain_game_id: 'Anthony_Box#NAE',
      captain_whatsapp: '+593961234567',
      captain_email: 'anthony.r@gmail.com',
      amount_due: 2.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Dúo oficial verificado.',
      members: [
        { name: 'Mauricio Pantoja', game_id: 'MauriPiece#NAE', whatsapp: '+593962345678' },
      ],
    },
    {
      id: 'reg-fn-2',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      game: 'fortnite',
      modality: 'duos',
      team_name: 'Storm Surge',
      is_free_agent: false,
      captain_name: 'Steven Guerrero',
      captain_game_id: 'Steven_Clutch#NAE',
      captain_whatsapp: '+593963456789',
      captain_email: 'steven.g@gmail.com',
      amount_due: 2.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Dúo verificado.',
      members: [
        { name: 'Jonathan Vallejo', game_id: 'Jona_HighGround#NAE', whatsapp: '+593964567890' },
      ],
    },
    {
      id: 'reg-fn-3',
      created_at: new Date(Date.now() - 1200000).toISOString(),
      game: 'fortnite',
      modality: 'duos',
      team_name: 'Zero Build Kings',
      is_free_agent: false,
      captain_name: 'Patricio Delgado',
      captain_game_id: 'Pato_Laser#NAE',
      captain_whatsapp: '+593965678901',
      captain_email: 'pato.d@gmail.com',
      amount_due: 2.00,
      status: 'pending',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'En revisión de comprobante.',
      members: [
        { name: 'Jorge Burbano', game_id: 'Burbano_Shotty#NAE', whatsapp: '+593966789012' },
      ],
    },

    // --- CLASH ROYALE (1v1) ---
    {
      id: 'reg-cr-1',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      game: 'clash_royale',
      modality: '1v1',
      team_name: 'Alex_Master',
      is_free_agent: false,
      captain_name: 'Alejandro Morales',
      captain_game_id: '#9PR88CLQ',
      captain_whatsapp: '+593963456789',
      captain_email: 'alex.m@hotmail.com',
      amount_due: 1.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Comprobante verificado.',
      members: [],
    },
    {
      id: 'reg-cr-2',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      game: 'clash_royale',
      modality: '1v1',
      team_name: 'Mat_LogBait',
      is_free_agent: false,
      captain_name: 'Mateo Cárdenas',
      captain_game_id: '#28Y00PQL',
      captain_whatsapp: '+593964567890',
      captain_email: 'mateo.c@gmail.com',
      amount_due: 1.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Jugador 1v1 confirmado.',
      members: [],
    },
    {
      id: 'reg-cr-3',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      game: 'clash_royale',
      modality: '1v1',
      team_name: 'Chris_Pekka',
      is_free_agent: false,
      captain_name: 'Christian Benalcázar',
      captain_game_id: '#88LU00Q',
      captain_whatsapp: '+593965678901',
      captain_email: 'chris.b@gmail.com',
      amount_due: 1.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Jugador 1v1 confirmado.',
      members: [],
    },
    {
      id: 'reg-cr-4',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      game: 'clash_royale',
      modality: '1v1',
      team_name: 'Erick_Miner',
      is_free_agent: false,
      captain_name: 'Erick Cadena',
      captain_game_id: '#99VR11Q',
      captain_whatsapp: '+593966789012',
      captain_email: 'erick.c@gmail.com',
      amount_due: 1.00,
      status: 'approved',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'Jugador 1v1 confirmado.',
      members: [],
    },
    {
      id: 'reg-cr-5',
      created_at: new Date(Date.now() - 600000).toISOString(),
      game: 'clash_royale',
      modality: '1v1',
      team_name: 'Josue_Hog',
      is_free_agent: false,
      captain_name: 'Josué Revelo',
      captain_game_id: '#33PQ22X',
      captain_whatsapp: '+593967890123',
      captain_email: 'josue.r@gmail.com',
      amount_due: 1.00,
      status: 'pending',
      receipt_url: '/assets/demo_receipt.svg',
      admin_notes: 'En verificación bancaria.',
      members: [],
    },
  ];

  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(defaultRegistrations));
  return defaultRegistrations;
};

// Generador de UUID v4 estándar (ej: a8098c1a-f86e-11da-bd1a-00112444be1e)
export const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getRegistrationById = async (id) => {
  if (!id) return null;
  const cleanId = String(id).trim();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('id', cleanId)
        .maybeSingle();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Error al buscar registro en Supabase:', e);
    }
  }

  const all = await getRegistrations();
  return all.find(r => String(r.id).trim().toLowerCase() === cleanId.toLowerCase()) || null;
};

export const sanitizeRegistrationForSupabase = (record) => {
  const allowed = [
    'id', 'created_at', 'game', 'game_name', 'modality', 'ff_modality',
    'team_name', 'is_free_agent', 'captain_name', 'captain_game_id',
    'captain_whatsapp', 'captain_email', 'captain_discord', 'members',
    'amount_due', 'total_amount', 'receipt_url', 'receipt_image',
    'payment_status', 'status', 'admin_notes', 'verified_at', 'updated_at'
  ];
  const clean = {};
  allowed.forEach((col) => {
    if (record[col] !== undefined) {
      clean[col] = record[col];
    }
  });
  return clean;
};

export const uploadReceiptToSupabase = async (file, registrationId) => {
  const supabase = getSupabaseClient();
  if (!supabase || !file) return null;

  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'png';
    const fileName = `${registrationId || generateUUID()}-${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);
      return publicUrl;
    }
    if (error) {
      console.warn('Supabase storage upload error:', error.message);
    }
  } catch (err) {
    console.warn('Error uploading receipt to Supabase storage:', err);
  }
  return null;
};

export const saveRegistration = async (registrationData) => {
  const supabase = getSupabaseClient();
  const recordId = registrationData.id || generateUUID();
  // Si hay un archivo y Supabase está activo, intentar subir al Storage
  let storageUrl = null;
  if (registrationData.receipt_file && supabase) {
    storageUrl = await uploadReceiptToSupabase(registrationData.receipt_file, recordId);
  }

  const finalReceiptUrl = storageUrl || registrationData.receipt_url || registrationData.receipt_image || null;

  const newRecord = {
    ...registrationData,
    id: recordId,
    created_at: registrationData.created_at || new Date().toISOString(),
    status: registrationData.status || 'pending',
    payment_status: registrationData.payment_status || (registrationData.status === 'payment_pending' ? 'unpaid' : 'paid'),
    receipt_url: finalReceiptUrl,
    receipt_image: registrationData.receipt_image || finalReceiptUrl,
  };

  delete newRecord.receipt_file;

  if (supabase) {
    try {
      const dbPayload = sanitizeRegistrationForSupabase(newRecord);
      const { data, error } = await supabase
        .from('registrations')
        .insert([dbPayload])
        .select();
      if (!error && data && data[0]) return data[0];
      if (error) {
        console.warn('⚠️ Error al insertar en Supabase:', error.message);
      }
    } catch (e) {
      console.warn('Supabase insert failed, fallback to local:', e);
    }
  }

  // Fallback Local
  const current = await getRegistrations();
  const updated = [newRecord, ...current.filter(r => r.id !== recordId)];
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  return newRecord;
};

export const updateRegistrationReceipt = async (id, receiptImage, receiptFile = null) => {
  if (!id) return null;
  const cleanId = String(id).trim();
  const now = new Date().toISOString();

  const supabase = getSupabaseClient();
  let storageUrl = null;
  if (receiptFile && supabase) {
    storageUrl = await uploadReceiptToSupabase(receiptFile, cleanId);
  }

  const finalReceiptUrl = storageUrl || receiptImage;

  const updates = {
    receipt_image: receiptImage || finalReceiptUrl,
    receipt_url: finalReceiptUrl,
    payment_status: 'paid',
    status: 'pending',
    updated_at: now,
    admin_notes: 'Comprobante subido mediante Enlace Mágico. Pendiente de verificación.'
  };

  if (supabase) {
    try {
      const dbUpdates = sanitizeRegistrationForSupabase(updates);
      await supabase
        .from('registrations')
        .update(dbUpdates)
        .eq('id', cleanId);
    } catch (e) {
      console.warn('Supabase update receipt failed:', e);
    }
  }

  const current = await getRegistrations();
  let found = null;
  const updated = current.map((r) => {
    if (String(r.id).trim().toLowerCase() === cleanId.toLowerCase()) {
      found = { ...r, ...updates };
      return found;
    }
    return r;
  });

  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  return found;
};

export const updateRegistrationStatus = async (id, status, notes = '') => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from('registrations')
        .update({ status, admin_notes: notes, verified_at: new Date().toISOString() })
        .eq('id', id);
    } catch (e) {}
  }

  const current = await getRegistrations();
  const updated = current.map((r) => 
    r.id === id ? { ...r, status, admin_notes: notes, verified_at: new Date().toISOString() } : r
  );
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  return updated;
};

// -------------------------------------------------------------
// BRACKETS & PARTIDOS
// -------------------------------------------------------------
export const getValorantMatches = () => {
  const local = localStorage.getItem(STORAGE_KEYS.VALORANT_MATCHES);
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  localStorage.setItem(STORAGE_KEYS.VALORANT_MATCHES, JSON.stringify(DEMO_VALORANT_MATCHES));
  return DEMO_VALORANT_MATCHES;
};

export const updateValorantMatch = (matchId, updates) => {
  const matches = getValorantMatches();
  const updated = matches.map(m => m.id === matchId ? { ...m, ...updates } : m);
  localStorage.setItem(STORAGE_KEYS.VALORANT_MATCHES, JSON.stringify(updated));
  return updated;
};

export const getClashMatches = () => {
  const local = localStorage.getItem(STORAGE_KEYS.CLASH_MATCHES);
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  localStorage.setItem(STORAGE_KEYS.CLASH_MATCHES, JSON.stringify(DEMO_CLASH_MATCHES));
  return DEMO_CLASH_MATCHES;
};

export const updateClashMatch = (matchId, updates) => {
  const matches = getClashMatches();
  const updated = matches.map(m => m.id === matchId ? { ...m, ...updates } : m);
  localStorage.setItem(STORAGE_KEYS.CLASH_MATCHES, JSON.stringify(updated));
  return updated;
};

// -------------------------------------------------------------
// BATTLE ROYALE STANDINGS (FREE FIRE & FORTNITE)
// -------------------------------------------------------------
export const getBattleRoyaleStandings = () => {
  const local = localStorage.getItem(STORAGE_KEYS.BR_STANDINGS);
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  localStorage.setItem(STORAGE_KEYS.BR_STANDINGS, JSON.stringify(DEMO_BATTLE_ROYALE_STANDINGS));
  return DEMO_BATTLE_ROYALE_STANDINGS;
};

export const saveBattleRoyaleStandings = (gameKey, newStandings) => {
  const current = getBattleRoyaleStandings();
  const updated = {
    ...current,
    [gameKey]: newStandings,
  };
  localStorage.setItem(STORAGE_KEYS.BR_STANDINGS, JSON.stringify(updated));
  return updated;
};

// -------------------------------------------------------------
// CRONOGRAMA
// -------------------------------------------------------------
export const getSchedule = () => {
  const local = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(INITIAL_SCHEDULE));
  return INITIAL_SCHEDULE;
};

export const saveSchedule = (scheduleList) => {
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(scheduleList));
  return scheduleList;
};
