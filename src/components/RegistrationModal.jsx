import React, { useState, useEffect } from 'react';
import { 
  X, Check, Copy, Upload, AlertCircle, 
  Zap, Phone, Link2, ExternalLink, Send, 
  CheckCircle2, Clock, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BANK_INFO, GAMES, CONTACT_INFO } from '../data/tournamentData';
import { saveRegistration, generateUUID } from '../lib/storage';
import buhoImg from '../assets/buho.png';

export default function RegistrationModal({ 
  isOpen, 
  onClose, 
  preselectedGame = 'valorant', 
  initialGamerTag = '',
  onNavigateToPayment
}) {
  const [selectedGame, setSelectedGame] = useState(preselectedGame || 'valorant');
  const [isFreeAgent, setIsFreeAgent] = useState(false);
  const [paymentMode, setPaymentMode] = useState('now'); // 'now' | 'later'
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMagicLink, setCopiedMagicLink] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [successMode, setSuccessMode] = useState('now');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [teamName, setTeamName] = useState('');
  const [ffModality, setFfModality] = useState('both'); // 'escuadras', 'solitario', 'both'
  const [captain, setCaptain] = useState({
    name: initialGamerTag || '',
    gameId: initialGamerTag || '',
    whatsapp: '',
    email: '',
    discord: '',
  });

  useEffect(() => {
    if (preselectedGame) {
      setSelectedGame(preselectedGame);
    }
  }, [preselectedGame]);

  useEffect(() => {
    if (initialGamerTag) {
      setCaptain(prev => ({
        ...prev,
        name: prev.name || initialGamerTag,
        gameId: prev.gameId || initialGamerTag
      }));
    }
  }, [initialGamerTag]);

  const [members, setMembers] = useState([
    { name: '', gameId: '', whatsapp: '', isSubstitute: false }
  ]);

  const [hasSubstitute, setHasSubstitute] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);

  const gameConfig = GAMES.find(g => g.id === selectedGame) || GAMES[0];

  // Calculate total price ($1 USD per player)
  let totalCost = 1.00;
  if (!isFreeAgent) {
    if (selectedGame === 'valorant') {
      totalCost = 5.00;
    } else if (selectedGame === 'free_fire') {
      totalCost = (ffModality === 'solitario') ? 1.00 : 4.00;
    } else if (selectedGame === 'fortnite') {
      totalCost = 2.00;
    } else if (selectedGame === 'clash_royale') {
      totalCost = 1.00;
    }
  }

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    if (!updated[index]) {
      updated[index] = { name: '', gameId: '', whatsapp: '', isSubstitute: false };
    }
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('La imagen del comprobante no debe superar los 5MB.');
        return;
      }
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === 'magic') {
      setCopiedMagicLink(true);
      setTimeout(() => setCopiedMagicLink(false), 2500);
    }
  };

  const cleanPhone = (phone) => {
    let p = (phone || '').replace(/[^0-9]/g, '');
    if (p.startsWith('0')) p = '593' + p.substring(1);
    else if (!p.startsWith('593') && p.length === 9) p = '593' + p;
    return p;
  };

  const handleSubmit = async (e, forcedMode) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage('');

    const targetMode = forcedMode || paymentMode;

    if (!captain.name.trim() || !captain.gameId.trim() || !captain.whatsapp.trim()) {
      setErrorMessage('Por favor completa todos los datos obligatorios del Capitán / Jugador principal.');
      return;
    }

    if (!isFreeAgent && selectedGame !== 'clash_royale') {
      if (!teamName.trim()) {
        setErrorMessage('Por favor ingresa el nombre de tu equipo.');
        return;
      }

      const requiredCount = selectedGame === 'valorant' ? 4 : selectedGame === 'free_fire' ? 3 : 1;
      for (let i = 0; i < requiredCount; i++) {
        const m = members[i];
        if (!m || !m.name?.trim() || !m.gameId?.trim() || !m.whatsapp?.trim()) {
          setErrorMessage(`Por favor completa todos los datos del Jugador #${i + 2}.`);
          return;
        }
      }
    }

    if (targetMode === 'now' && !receiptPreview) {
      setErrorMessage('Para pagar ahora, por favor adjunta la captura del comprobante bancario. O pulsa en [ PAGAR DESPUÉS ] para pre-registrarte sin comprobante en este momento.');
      return;
    }

    try {
      setSubmitting(true);

      const teamMembersToSave = isFreeAgent ? [] : members.slice(0, selectedGame === 'valorant' ? (hasSubstitute ? 5 : 4) : selectedGame === 'free_fire' ? 3 : 1);
      const isPayLater = targetMode === 'later';
      const recordUUID = generateUUID();

      const registrationRecord = {
        id: recordUUID,
        created_at: new Date().toISOString(),
        game: selectedGame,
        game_id: selectedGame,
        game_name: gameConfig.name,
        team_name: isFreeAgent ? `Individual (${captain.name})` : teamName,
        is_free_agent: isFreeAgent,
        modality: isFreeAgent ? 'individual' : (selectedGame === 'valorant' ? '5v5' : selectedGame === 'fortnite' ? 'duos' : selectedGame === 'clash_royale' ? '1v1' : 'escuadras'),
        ff_modality: selectedGame === 'free_fire' ? (isFreeAgent ? 'individual' : ffModality) : null,
        captain_name: captain.name,
        captain_game_id: captain.gameId,
        captain_whatsapp: captain.whatsapp,
        captain_email: captain.email || '',
        captain_discord: captain.discord || '',
        members: teamMembersToSave,
        total_amount: totalCost,
        amount_due: totalCost,
        receipt_file: isPayLater ? null : receiptFile,
        receipt_image: isPayLater ? null : receiptPreview,
        receipt_url: isPayLater ? null : receiptPreview,
        status: isPayLater ? 'payment_pending' : 'pending',
        payment_status: isPayLater ? 'unpaid' : 'paid',
        admin_notes: isPayLater ? 'Pre-registro generado con Enlace Mágico. Pendiente de comprobante.' : '',
      };

      await saveRegistration(registrationRecord);

      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
      });

      setSuccessMode(targetMode);
      setSuccessData(registrationRecord);
    } catch (err) {
      console.error(err);
      setErrorMessage('Ocurrió un error al guardar tu registro. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const magicLink = successData 
    ? `${window.location.origin}/pago/${successData.id}` 
    : '';

  const whatsappSelfMessage = successData
    ? `🎮 *COMPU LEAGUE E-SPORTS 2026*\n\n¡Hola ${successData.captain_name}! Tu pre-registro para *${successData.team_name}* en *${gameConfig.name}* ha sido guardado exitosamente.\n\n📌 *Enlace Mágico para subir comprobante de pago ($${totalCost.toFixed(2)} USD):*\n${magicLink}\n\nGuarda este enlace para subir tu comprobante de Banco Pichincha cuando tengas el dinero listo. ¡Nos vemos en la arena! 🔥`
    : '';

  const whatsappCaptainUrl = successData
    ? `https://wa.me/${cleanPhone(successData.captain_whatsapp)}?text=${encodeURIComponent(whatsappSelfMessage)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#1a2742] border-4 border-[#364e78] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#151f33] border-b-2 border-[#2f4469] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/buho_pixel_start.png"
              alt="Logo Torneo"
              className="w-10 h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              style={{ imageRendering: 'pixelated' }}
            />
            <div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white flex items-center gap-2 font-['Silkscreen',monospace]">
                Inscripción Oficial
                <span className="text-[10px] px-2.5 py-0.5 bg-[#253961] border border-[#476799] text-yellow-300 font-mono">
                  Compu League 2026
                </span>
              </h3>
              <p className="text-xs text-[#a5badb] font-mono">
                Compu League E-Sports 2026 • Torneo de Videojuegos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[82vh] overflow-y-auto space-y-6">
          
          {successData ? (
            /* ======================================================== */
            /* SUCCESS STATES (PAGAR AHORA vs PAGAR DESPUÉS)            */
            /* ======================================================== */
            successMode === 'later' ? (
              /* ENLACE MÁGICO CON UUID (PAGAR DESPUÉS) */
              <div className="text-center py-4 px-2 sm:px-4 space-y-5">
                <div className="w-20 h-20 mx-auto">
                  <img
                    src="/assets/buho_pixel_start.png"
                    alt="Búho feliz"
                    className="w-full h-full object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-400 text-[10px] font-mono font-bold uppercase inline-block">
                    ★ ENLACE MÁGICO CON UUID GENERADO ★
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold uppercase text-white font-['Silkscreen',monospace]">
                    ¡PRE-REGISTRO COMPLETADO!
                  </h4>
                  <p className="text-slate-300 text-xs max-w-md mx-auto font-mono">
                    Tu cupo para <strong className="text-yellow-300">{successData.team_name}</strong> en <strong className="text-white">{gameConfig.name}</strong> está apartado.
                  </p>
                </div>

                {/* Info Card */}
                <div className="p-4 sm:p-5 bg-[#16233b] border-2 border-[#364e78] text-left max-w-xl mx-auto space-y-3 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2f4469]">
                    <span className="text-[#a5badb]">Estado del registro:</span>
                    <span className="px-2.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-500 font-bold uppercase text-[10px]">
                      Pre-Registrado (Pendiente Pago)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#8ea4c7] block">Capitán:</span>
                      <strong className="text-white">{successData.captain_name} ({successData.captain_game_id})</strong>
                    </div>
                    <div>
                      <span className="text-[#8ea4c7] block">WhatsApp Capitán:</span>
                      <strong className="text-amber-400">{successData.captain_whatsapp}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2f4469] flex items-center justify-between">
                    <span className="text-[#a5badb]">Valor a pagar luego:</span>
                    <strong className="text-base text-yellow-300 font-mono">${totalCost.toFixed(2)} USD</strong>
                  </div>
                </div>

                {/* Magic Link Box with UUID */}
                <div className="p-4 sm:p-5 bg-[#121c2e] border-2 border-yellow-300/80 text-left max-w-xl mx-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-yellow-300 uppercase font-['Silkscreen',monospace] flex items-center gap-1.5">
                      <Link2 className="w-4 h-4 text-yellow-300" />
                      TU ENLACE MÁGICO EXCLUSIVO
                    </span>
                    <span className="text-[8px] text-[#8ea4c7] font-mono">UUID PROTEGIDO</span>
                  </div>

                  <div className="p-3 bg-[#1a2742] border border-[#364e78] text-[10px] sm:text-xs font-mono text-sky-300 break-all select-all font-bold">
                    {magicLink}
                  </div>

                  {/* Action Buttons: Copiar y Enviar por WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(magicLink, 'magic')}
                      className="px-4 py-3 border-2 border-yellow-300 bg-yellow-300 hover:bg-white text-black font-bold text-[10px] sm:text-xs uppercase transition flex items-center justify-center gap-2 cursor-pointer font-['Silkscreen',monospace]"
                    >
                      {copiedMagicLink ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedMagicLink ? '¡ENLACE COPIADO!' : 'COPIAR ENLACE'}</span>
                    </button>

                    <a
                      href={whatsappCaptainUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 border-2 border-emerald-400 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] sm:text-xs uppercase transition flex items-center justify-center gap-2 font-['Silkscreen',monospace]"
                    >
                      <Send className="w-4 h-4" />
                      <span>ENVIARME POR WHATSAPP</span>
                    </a>
                  </div>

                  <p className="text-[9px] text-[#8ea4c7] font-mono leading-relaxed pt-1 text-center">
                    * Abre este enlace en cualquier momento cuando tengas el dinero. La página reconocerá a tu equipo automáticamente y podrás subir la captura del voucher sin volver a escribir ningún dato.
                  </p>
                </div>

                {/* Direct Go To Payment Page Option */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {onNavigateToPayment && (
                    <button
                      type="button"
                      onClick={() => onNavigateToPayment(successData.id)}
                      className="w-full sm:w-auto px-5 py-2.5 border-2 border-sky-400 bg-[#16233b] hover:bg-sky-400 hover:text-black text-sky-300 font-bold text-[10px] uppercase transition flex items-center justify-center gap-1.5 font-mono cursor-pointer"
                    >
                      <span>IR A SUBIR EL PAGO AHORA</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2.5 border-2 border-[#364e78] bg-[#16233b] hover:border-white text-slate-300 hover:text-white font-bold text-[10px] uppercase transition font-mono cursor-pointer"
                  >
                    [ CERRAR ]
                  </button>
                </div>
              </div>
            ) : (
              /* PAGAR AHORA SUCCESS */
              <div className="text-center py-6 px-4 space-y-6">
                <div className="w-24 h-24 mx-auto">
                  <img
                    src="/assets/buho_pixel_start.png"
                    alt="Búho feliz"
                    className="w-full h-full object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl sm:text-2xl font-bold uppercase text-white font-['Silkscreen',monospace]">
                    ¡Inscripción Enviada Exitosamente!
                  </h4>
                  <p className="text-zinc-300 text-xs max-w-md mx-auto font-mono">
                    Hemos recibido el registro de <strong className="text-yellow-300">{successData.team_name}</strong> para <strong className="text-white">{gameConfig.name}</strong> y tu comprobante por <strong className="text-amber-400">${totalCost.toFixed(2)} USD</strong>.
                  </p>
                </div>

                <div className="p-5 bg-[#16233b] border-2 border-[#364e78] text-left max-w-lg mx-auto space-y-3 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2f4469]">
                    <span className="text-zinc-400 font-medium">Estado del registro:</span>
                    <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-400 border border-amber-400/40 font-bold uppercase text-[10px]">
                      En Verificación Bancaria
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block font-medium">Capitán / Jugador:</span>
                    <span className="text-white font-bold">{successData.captain_name} ({successData.captain_game_id})</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block font-medium">WhatsApp de contacto:</span>
                    <span className="text-amber-400 font-bold">{successData.captain_whatsapp}</span>
                  </div>
                  <div className="pt-2 text-[10px] text-zinc-400 leading-relaxed border-t border-[#2f4469] font-mono">
                    ⚠️ El staff de Compu League E-Sports validará tu comprobante de Banco Pichincha. Una vez verificado, te agregaremos al grupo oficial de WhatsApp y coordinaremos tus partidas.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={CONTACT_INFO.whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 font-bold text-xs uppercase tracking-wider text-black bg-emerald-400 hover:bg-white transition flex items-center justify-center gap-2 font-mono"
                  >
                    <Phone className="w-4 h-4" />
                    Escribir a WhatsApp Staff
                  </a>
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3 font-bold text-xs uppercase tracking-wider text-zinc-300 hover:text-white bg-[#16233b] border border-[#2f4469] transition font-mono cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )
          ) : (
            /* ======================================================== */
            /* REGISTRATION FORM                                        */
            /* ======================================================== */
            <form onSubmit={(e) => handleSubmit(e, paymentMode)} className="space-y-6">
              
              {errorMessage && (
                <div className="p-4 bg-rose-500/15 border-2 border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 font-mono">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Selector de Juego */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-400 text-black flex items-center justify-center text-[11px] font-bold">1</span>
                  Selecciona el Videojuego
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {GAMES.map((game) => {
                    const isSelected = selectedGame === game.id;
                    return (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => setSelectedGame(game.id)}
                        className={`p-3 border-2 text-left transition relative cursor-pointer ${
                          isSelected
                            ? 'border-yellow-300 bg-[#223559] shadow-md'
                            : 'border-[#2f4469] bg-[#16233b] hover:border-slate-400'
                        }`}
                      >
                        <h4 className="text-xs font-bold uppercase text-white font-['Silkscreen',monospace] leading-tight">
                          {game.name}
                        </h4>
                        <span className="text-[9px] text-amber-400 block mt-1 font-mono">
                          {game.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tipo de Participación */}
              <div className="p-4 bg-[#16233b] border-2 border-[#2f4469] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white font-['Silkscreen',monospace]">
                      Tipo de Participación
                    </h4>
                    <p className="text-[10px] text-[#8ea4c7] font-mono">
                      ¿Participas con tu equipo armado o te inscribes de forma individual?
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFreeAgent(false)}
                      className={`px-3 py-2 text-[10px] font-bold uppercase transition font-['Silkscreen',monospace] cursor-pointer ${
                        !isFreeAgent
                          ? 'border-2 border-yellow-300 bg-yellow-300 text-black'
                          : 'border-2 border-[#2f4469] bg-[#1d2d4c] text-[#8ea4c7]'
                      }`}
                    >
                      Con mi Equipo
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFreeAgent(true)}
                      className={`px-3 py-2 text-[10px] font-bold uppercase transition font-['Silkscreen',monospace] cursor-pointer ${
                        isFreeAgent
                          ? 'border-2 border-yellow-300 bg-yellow-300 text-black'
                          : 'border-2 border-[#2f4469] bg-[#1d2d4c] text-[#8ea4c7]'
                      }`}
                    >
                      Individual
                    </button>
                  </div>
                </div>

                {/* Submodalidad Free Fire */}
                {selectedGame === 'free_fire' && !isFreeAgent && (
                  <div className="pt-3 border-t border-[#2f4469] space-y-2">
                    <span className="text-[10px] text-[#8ea4c7] font-mono uppercase font-bold block">
                      Modalidad Free Fire para tu equipo:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setFfModality('escuadras')}
                        className={`p-2 border text-left transition cursor-pointer ${
                          ffModality === 'escuadras'
                            ? 'border-yellow-300 bg-[#253961] text-yellow-300 font-bold'
                            : 'border-[#2f4469] bg-[#1d2d4c] text-slate-300'
                        }`}
                      >
                        [ Solo Escuadras (4 Jugadores - $4) ]
                      </button>
                      <button
                        type="button"
                        onClick={() => setFfModality('both')}
                        className={`p-2 border text-left transition cursor-pointer ${
                          ffModality === 'both'
                            ? 'border-yellow-300 bg-[#253961] text-yellow-300 font-bold'
                            : 'border-[#2f4469] bg-[#1d2d4c] text-slate-300'
                        }`}
                      >
                        [ Escuadras + Entrada Individual ($4) ]
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nombre de Equipo */}
              {!isFreeAgent && selectedGame !== 'clash_royale' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-[#a5badb] block font-bold">
                    Nombre del Equipo / Clan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. CyberKnights, NullPointers, Los Galácticos..."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#16233b] border-2 border-[#2f4469] text-xs text-white placeholder-[#687f9d] focus:border-yellow-300 focus:outline-none font-mono uppercase"
                  />
                </div>
              )}

              {/* 2. Datos del Capitán */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-400 text-black flex items-center justify-center text-[11px] font-bold">2</span>
                  {isFreeAgent || selectedGame === 'clash_royale' ? 'Datos del Jugador' : 'Datos del Capitán'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8ea4c7] font-mono uppercase">Nombre Completo *</span>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Mendoza"
                      value={captain.name}
                      onChange={(e) => setCaptain({ ...captain, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#16233b] border border-[#2f4469] text-xs text-white placeholder-[#687f9d] focus:border-yellow-300 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8ea4c7] font-mono uppercase">ID en Juego (Nick + Tag) *</span>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Shadow#LAN"
                      value={captain.gameId}
                      onChange={(e) => setCaptain({ ...captain, gameId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#16233b] border border-[#2f4469] text-xs text-white placeholder-[#687f9d] focus:border-yellow-300 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8ea4c7] font-mono uppercase">WhatsApp Activo *</span>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 0987654321"
                      value={captain.whatsapp}
                      onChange={(e) => setCaptain({ ...captain, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 bg-[#16233b] border border-[#2f4469] text-xs text-white placeholder-[#687f9d] focus:border-yellow-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Miembros del Equipo */}
              {!isFreeAgent && selectedGame !== 'clash_royale' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <span className="w-5 h-5 bg-amber-400 text-black flex items-center justify-center text-[11px] font-bold">3</span>
                      Compañeros de Equipo (Roster Oficial)
                    </label>
                    <span className="text-[10px] text-[#8ea4c7] font-mono">
                      {selectedGame === 'valorant' ? '4 Titulares (+1 Suplente opcional)' : selectedGame === 'free_fire' ? '3 Titulares' : '1 Pareja / Dúo'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {Array.from({ length: selectedGame === 'valorant' ? 4 : selectedGame === 'free_fire' ? 3 : 1 }).map((_, idx) => (
                      <div key={idx} className="p-3 bg-[#16233b] border border-[#2f4469] grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          placeholder={`Jugador #${idx + 2} - Nombre`}
                          value={members[idx]?.name || ''}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          className="px-3 py-2 bg-[#121c2e] border border-[#2f4469] text-xs text-white placeholder-[#687f9d] focus:border-yellow-300 focus:outline-none"
                        />
                        <input
                          type="text"
                          required
                          placeholder="ID de Juego / Nick"
                          value={members[idx]?.gameId || ''}
                          onChange={(e) => handleMemberChange(idx, 'gameId', e.target.value)}
                          className="px-3 py-2 bg-[#121c2e] border border-[#2f4469] text-xs text-white placeholder-[#687f9d] focus:border-yellow-300 focus:outline-none"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="WhatsApp (+593...)"
                          value={members[idx]?.whatsapp || ''}
                          onChange={(e) => handleMemberChange(idx, 'whatsapp', e.target.value)}
                          className="px-3 py-2 bg-[#121c2e] border border-[#2f4469] text-xs text-white placeholder-[#687f9d] focus:border-yellow-300 focus:outline-none"
                        />
                      </div>
                    ))}

                    {/* Suplente Opcional en Valorant */}
                    {selectedGame === 'valorant' && (
                      <div className="pt-2">
                        {!hasSubstitute ? (
                          <button
                            type="button"
                            onClick={() => setHasSubstitute(true)}
                            className="text-xs font-bold text-amber-400 hover:text-white flex items-center gap-1.5 p-2 bg-amber-400/10 border border-amber-400/30 uppercase font-mono cursor-pointer"
                          >
                            + Agregar Suplente Opcional (Gratis, incluido en los $5)
                          </button>
                        ) : (
                          <div className="p-3 bg-[#223559] border border-amber-400/40 space-y-2">
                            <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase font-mono">
                              <span>Suplente Opcional (Jugador #6):</span>
                              <button
                                type="button"
                                onClick={() => setHasSubstitute(false)}
                                className="text-zinc-400 hover:text-rose-400 text-[11px] normal-case cursor-pointer"
                              >
                                Quitar suplente
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Nombre del Suplente"
                                value={members[4]?.name || ''}
                                onChange={(e) => handleMemberChange(4, 'name', e.target.value)}
                                className="px-3 py-2 bg-[#16233b] border border-[#2f4469] text-xs text-white placeholder-[#687f9d] focus:border-yellow-300 focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="ID de Juego Suplente"
                                value={members[4]?.gameId || ''}
                                onChange={(e) => handleMemberChange(4, 'gameId', e.target.value)}
                                className="px-3 py-2 bg-[#16233b] border border-[#2f4469] text-xs text-white placeholder-[#687f9d] focus:border-yellow-300 focus:outline-none"
                              />
                              <input
                                type="tel"
                                placeholder="WhatsApp Suplente"
                                value={members[4]?.whatsapp || ''}
                                onChange={(e) => handleMemberChange(4, 'whatsapp', e.target.value)}
                                className="px-3 py-2 bg-[#16233b] border border-[#2f4469] text-xs text-white placeholder-[#687f9d] focus:border-yellow-300 focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* 4. PREGUNTA: ¿PAGAR AHORA O PAGAR DESPUÉS?               */}
              {/* ======================================================== */}
              <div className="space-y-4 p-5 bg-[#1d2d4c] border-4 border-[#364e78]">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#2f4469]">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <span className="w-5 h-5 bg-amber-400 text-black flex items-center justify-center text-[11px] font-bold font-mono">4</span>
                    ¿Deseas pagar ahora o pagar después?
                  </label>
                  <span className="px-2.5 py-1 bg-yellow-300 text-black font-black font-mono text-xs">
                    TOTAL: ${totalCost.toFixed(2)} USD
                  </span>
                </div>

                {/* LOS 2 BOTONES SELECTORES: SE PREGUNTA PRIMERO, ANTES DE LOS DATOS BANCARIOS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('now')}
                    className={`p-4 border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                      paymentMode === 'now'
                        ? 'border-yellow-300 bg-[#253961] shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                        : 'border-[#2f4469] bg-[#16233b] hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs font-['Silkscreen',monospace] flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                        PAGAR AHORA
                      </span>
                      {paymentMode === 'now' && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-yellow-300 text-black font-bold font-mono">
                          SELECCIONADO
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#a5badb] mt-2 font-mono leading-relaxed">
                      Ver datos bancarios y subir la foto del comprobante ahora mismo.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('later')}
                    className={`p-4 border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                      paymentMode === 'later'
                        ? 'border-sky-400 bg-[#1b3457] shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                        : 'border-[#2f4469] bg-[#16233b] hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs font-['Silkscreen',monospace] flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-sky-400" />
                        PAGAR DESPUÉS
                      </span>
                      {paymentMode === 'later' && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-sky-400 text-black font-bold font-mono">
                          SELECCIONADO
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#a5badb] mt-2 font-mono leading-relaxed">
                      Enlace Mágico con UUID. Aparta tu cupo sin pagar ahora y sube el voucher luego.
                    </p>
                  </button>
                </div>

                {/* SÓLO SE MUESTRAN LOS DATOS BANCARIOS Y COMPROBANTE SI ELIGIÓ "PAGAR AHORA" */}
                {paymentMode === 'now' && (
                  <div className="space-y-4 pt-3 border-t-2 border-[#2f4469] animate-in fade-in duration-200">
                    
                    {/* Caja de Datos Bancarios */}
                    <div className="p-4 bg-[#16233b] border-2 border-[#2f4469] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-white font-['Silkscreen',monospace]">
                          Datos de Transferencia Bancaria
                        </span>
                        <span className="text-xs text-yellow-300 font-mono font-bold">
                          ${totalCost.toFixed(2)} USD
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-[#121c2e] p-3 border border-[#2f4469] font-mono">
                        <div>
                          <span className="text-[#8ea4c7] block text-[9px]">BANCO:</span>
                          <strong className="text-white text-xs">{BANK_INFO.bank}</strong>
                        </div>
                        <div>
                          <span className="text-[#8ea4c7] block text-[9px]">TIPO DE CUENTA:</span>
                          <strong className="text-white text-xs">{BANK_INFO.accountType}</strong>
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between p-2 bg-[#1f3052] border border-[#364e78]">
                          <div>
                            <span className="text-[#8ea4c7] block text-[9px]">NÚMERO DE CUENTA:</span>
                            <strong className="text-white text-sm font-mono tracking-wider">{BANK_INFO.accountNumber}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_INFO.accountNumber, 'account')}
                            className="px-2.5 py-1 bg-[#253961] hover:bg-yellow-300 hover:text-black text-yellow-300 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedAccount ? 'COPIADO' : 'COPIAR'}</span>
                          </button>
                        </div>

                        <div>
                          <span className="text-[#8ea4c7] block text-[9px]">TITULAR:</span>
                          <strong className="text-white text-xs">{BANK_INFO.holderName}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="truncate pr-1">
                            <span className="text-[#8ea4c7] block text-[9px]">CORREO:</span>
                            <strong className="text-zinc-300 text-[10px] truncate block">{BANK_INFO.email}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_INFO.email, 'email')}
                            className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                            title="Copiar correo"
                          >
                            {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Subida de Captura */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase text-[#a5badb] block font-bold">
                        Adjuntar Captura del Comprobante de Pago *
                      </span>

                      {!receiptPreview ? (
                        <label className="border-2 border-dashed border-[#364e78] hover:border-yellow-300 bg-[#16233b] p-6 flex flex-col items-center justify-center cursor-pointer transition group">
                          <Upload className="w-8 h-8 text-[#8ea4c7] mb-2 group-hover:text-yellow-300 transition-colors" />
                          <span className="text-xs font-bold text-white mb-1 uppercase font-mono">
                            Clic para subir comprobante o arrastra la captura aquí
                          </span>
                          <span className="text-[10px] text-[#8ea4c7] font-mono">
                            Formatos soportados: JPG, PNG o captura de pantalla (Max 5MB)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleReceiptChange}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="p-3 bg-[#16233b] border border-[#2f4469] flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={receiptPreview}
                              alt="Vista previa comprobante"
                              className="w-14 h-14 object-cover border border-[#364e78]"
                            />
                            <div>
                              <span className="text-xs font-bold text-white block font-mono uppercase">
                                Comprobante listo
                              </span>
                              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                                <Check className="w-3 h-3" /> Imagen cargada
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setReceiptPreview(null); setReceiptFile(null); }}
                            className="px-3 py-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[10px] font-bold font-mono uppercase transition cursor-pointer"
                          >
                            Cambiar
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* SI SELECCIONÓ PAGAR DESPUÉS: NO HAY DATOS BANCARIOS NI COMPROBANTE */}
                {paymentMode === 'later' && (
                  <div className="p-4 bg-[#16233b] border-2 border-sky-400/60 space-y-3 pt-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-sky-400 animate-pulse" />
                      <h4 className="text-xs font-bold uppercase text-white font-['Silkscreen',monospace]">
                        ⚡ MODO CERO FRICCIÓN: ENLACE MÁGICO CON UUID
                      </h4>
                    </div>

                    <p className="text-[11px] text-[#a5badb] font-mono leading-relaxed">
                      ¡No necesitas tener el dinero ahora mismo para asegurar tu cupo! Al pulsar en el botón de abajo:
                    </p>

                    <div className="space-y-1.5 text-[10px] font-mono text-zinc-300 pl-2">
                      <div className="flex items-start gap-2">
                        <span className="text-sky-300 font-bold">1.</span>
                        <span>Se registrará tu equipo en el fixture oficial con estado <strong>PRE-REGISTRADO</strong>.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-sky-300 font-bold">2.</span>
                        <span>Se generará un <strong>Enlace Mágico con UUID</strong> único imposible de adivinar.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-sky-300 font-bold">3.</span>
                        <span>Podrás <strong>copiar el link</strong> o <strong>enviártelo por WhatsApp</strong> en un clic.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-sky-300 font-bold">4.</span>
                        <span>Cuando recaudes los <strong>${totalCost.toFixed(2)} USD</strong>, abres el link y subes directo el voucher sin escribir nada más.</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Botón de Confirmación según la Opción Elegida */}
              <div className="pt-2">
                {paymentMode === 'now' ? (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 border-2 border-yellow-300 bg-yellow-300 hover:bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer font-['Silkscreen',monospace] disabled:opacity-50 shadow-md"
                  >
                    {submitting ? (
                      <span>Enviando registro y comprobante...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-black" />
                        <span>PAGAR AHORA Y ENVIAR REGISTRO (${totalCost.toFixed(2)} USD)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 border-2 border-sky-400 bg-sky-400 hover:bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer font-['Silkscreen',monospace] disabled:opacity-50 shadow-md"
                  >
                    {submitting ? (
                      <span>Generando Enlace Mágico y Pre-registro...</span>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 text-black" />
                        <span>PRE-REGISTRARSE Y GENERAR ENLACE MÁGICO (PAGAR DESPUÉS)</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
