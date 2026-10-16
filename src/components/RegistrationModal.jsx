import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Check, Copy, Upload, AlertCircle, 
  Zap, Phone, Link2, Send,
  ArrowRight, LoaderCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BANK_INFO, GAMES, CONTACT_INFO } from '../data/tournamentData';
import { saveRegistration, generateUUID } from '../lib/storage';

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
  const [copiedBankField, setCopiedBankField] = useState('');
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
  const receiptInputRef = useRef(null);

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

  const handleReceiptFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('El comprobante debe ser una imagen JPG, PNG u otro formato de imagen.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('La imagen del comprobante no debe superar los 5MB.');
      return;
    }

    setErrorMessage('');
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = () => setReceiptPreview(reader.result);
    reader.onerror = () => setErrorMessage('No se pudo leer la imagen. Intenta seleccionarla nuevamente.');
    reader.readAsDataURL(file);
  };

  const handleReceiptChange = (e) => {
    handleReceiptFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleReceiptPaste = (e) => {
    const imageItem = Array.from(e.clipboardData?.items || []).find((item) => item.type.startsWith('image/'));
    const imageFile = imageItem?.getAsFile();
    if (imageFile) {
      e.preventDefault();
      handleReceiptFile(imageFile);
    }
  };

  const handleReceiptDrop = (e) => {
    e.preventDefault();
    handleReceiptFile(e.dataTransfer.files?.[0]);
  };

  const removeReceipt = () => {
    setReceiptPreview(null);
    setReceiptFile(null);
    setErrorMessage('');
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'magic') {
      setCopiedMagicLink(true);
      setTimeout(() => setCopiedMagicLink(false), 2500);
      } else {
        setCopiedBankField(type);
        setTimeout(() => setCopiedBankField(''), 2000);
      }
    } catch (error) {
      console.error('No se pudo copiar al portapapeles:', error);
      setErrorMessage('No se pudo copiar automáticamente. Selecciona el dato y cópialo manualmente.');
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
    if (submitting) return;
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
      setErrorMessage('Para pagar ahora, por favor adjunta la captura del comprobante bancario. O pulsa en PAGAR DESPUÉS para pre-registrarte sin comprobante en este momento.');
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
        payment_status: 'unpaid',
        admin_notes: isPayLater ? 'Pre-registro generado (Pagar después). Pendiente de comprobante.' : '',
      };

      await saveRegistration(registrationRecord);

      // Si seleccionó pagar después, guardar recordatorio en este dispositivo
      if (isPayLater) {
        try {
          localStorage.setItem('compu_league_pending_payment', JSON.stringify({
            id: registrationRecord.id,
            team_name: registrationRecord.team_name,
            game: registrationRecord.game,
            game_name: gameConfig.name,
            captain_name: registrationRecord.captain_name,
            amount_due: registrationRecord.amount_due,
            created_at: registrationRecord.created_at,
          }));
        } catch (e) {
          console.warn('No se pudo guardar pago pendiente en localStorage:', e);
        }
      } else {
        try {
          localStorage.removeItem('compu_league_pending_payment');
        } catch (e) {}
      }

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
    ? `🎮 *COMPU LEAGUE E-SPORTS 2026*\n\n¡Hola ${successData.captain_name}! Tu pre-registro para *${successData.team_name}* en *${gameConfig.name}* ha sido guardado.\n\n📌 *Link para pagar y subir comprobante ($${totalCost.toFixed(2)} USD):*\n${magicLink}\n\n📌 *O envía tu comprobante al WhatsApp Staff 0962074110 con:*\n- Nombre: ${successData.captain_name}\n- ID: ${successData.id}`
    : '';

  const whatsappCaptainUrl = successData
    ? `https://wa.me/${cleanPhone(successData.captain_whatsapp)}?text=${encodeURIComponent(whatsappSelfMessage)}`
    : '';

  const whatsappStaffReportUrl = successData
    ? `https://wa.me/593962074110?text=${encodeURIComponent(`Hola Staff Compu League, envío mi comprobante de pago para el equipo *${successData.team_name}*.\n- Nombre: ${successData.captain_name}\n- ID de registro: ${successData.id}\n- Torneo: ${gameConfig.name}\n- Valor: $${totalCost.toFixed(2)} USD`)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 font-sans select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-[#090D15] border-4 border-black shadow-brutal-yellow overflow-hidden my-3 sm:my-6">
        
        {/* Modal Arcade Cabinet Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-black border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/buho_pixel_start.png"
              alt="Logo Torneo"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain shape-crisp drop-shadow-[0_0_8px_rgba(255,230,0,0.5)] shrink-0"
              style={{ imageRendering: 'pixelated' }}
            />
            <div>
              <div className="font-pixel text-[9px] text-[#FFE600] uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#FF0055] inline-block animate-arcade-blink" />
                <span>[ TERMINAL // INSCRIPCION OFICIAL ]</span>
              </div>
              <h3 className="text-base sm:text-xl font-black uppercase text-white font-display tracking-wider leading-none mt-0.5">
                COMPU LEAGUE <span className="text-[#FFE600]">2026</span>
              </h3>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="btn-arcade-press p-2 border-2 border-black bg-[#FF0055] text-white hover:bg-[#FF3377] transition cursor-pointer shadow-brutal-black font-black"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto space-y-5 bg-[#090D15]">
          
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
                    alt="Búho pixel"
                    className="w-full h-full object-contain shape-crisp drop-shadow-[0_0_15px_rgba(255,230,0,0.6)]"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="inline-block px-3 py-1 bg-black text-[#00F0FF] border-2 border-[#00F0FF] font-pixel text-[9px] uppercase shadow-brutal-black">
                    ★ PRE-REGISTRO GUARDADO ★
                  </div>
                  <h4 className="text-xl sm:text-3xl font-black uppercase text-white font-display tracking-wide drop-shadow-[2px_2px_0px_#000]">
                    ¡PRE-REGISTRO COMPLETADO!
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto font-cyber">
                    Tu cupo para <strong className="text-[#FFE600] font-pixel text-xs">{successData.team_name}</strong> en <strong className="text-white font-pixel text-xs">{gameConfig.name}</strong> ha sido apartado.
                  </p>
                </div>

                {/* Info Card */}
                <div className="p-4 sm:p-5 bg-black border-2 border-black text-left max-w-xl mx-auto space-y-3 font-cyber text-xs text-slate-300 shadow-brutal-black">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 font-pixel text-[9px]">
                    <span className="text-slate-400">ESTADO:</span>
                    <span className="px-2 py-0.5 bg-[#00F0FF] text-black font-black uppercase">
                      PRE-REGISTRADO (PENDIENTE PAGO)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-pixel text-[8px] text-slate-500 uppercase block">CAPITAN / JUGADOR:</span>
                      <strong className="text-white font-bold">{successData.captain_name} ({successData.captain_game_id})</strong>
                    </div>
                    <div>
                      <span className="font-pixel text-[8px] text-slate-500 uppercase block">ID DE REGISTRO:</span>
                      <strong className="text-[#FFE600] font-mono text-[11px] break-all">{successData.id}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between font-pixel">
                    <span className="text-slate-400 text-[10px]">VALOR TOTAL:</span>
                    <strong className="text-xl text-[#FFE600] font-black">${totalCost.toFixed(2)} USD</strong>
                  </div>
                </div>

                {/* Box 1: Link generado */}
                <div className="p-4 sm:p-5 bg-black border-2 border-[#FFE600] text-left max-w-xl mx-auto space-y-3 shadow-brutal-yellow">
                  <div className="flex items-center justify-between font-pixel text-[9px]">
                    <span className="text-[#FFE600] uppercase font-bold flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-[#FFE600]" />
                      1. TU LINK DE PAGO GENERADO
                    </span>
                    <span className="text-slate-400">ACCESO DIRECTO</span>
                  </div>

                  <div className="p-3 bg-[#0C121D] border-2 border-black text-xs font-mono text-[#00F0FF] break-all select-all font-bold">
                    {magicLink}
                  </div>

                  {/* Action Buttons: Copiar y Enviar por WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(magicLink, 'magic')}
                      className="btn-arcade-press shadow-brutal-black px-4 py-3 bg-[#FFE600] text-black font-pixel font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border-2 border-black"
                    >
                      {copiedMagicLink ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedMagicLink ? '¡LINK COPIADO!' : 'COPIAR LINK'}</span>
                    </button>

                    <a
                      href={whatsappCaptainUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-arcade-press shadow-brutal-black px-4 py-3 bg-[#00F0FF] text-black font-pixel font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-black"
                    >
                      <Send className="w-4 h-4" />
                      <span>ENVIARME EL LINK</span>
                    </a>
                  </div>
                </div>

                {/* Box 2: Opción WhatsApp 0962074110 */}
                <div className="p-4 sm:p-5 bg-black border-2 border-[#10B981] text-left max-w-xl mx-auto space-y-3 shadow-brutal-black">
                  <div className="flex items-center justify-between font-pixel text-[9px]">
                    <span className="text-[#10B981] uppercase font-bold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                      2. O ENVIA EL COMPROBANTE AL WHATSAPP
                    </span>
                    <span className="text-slate-400">STAFF OFICIAL</span>
                  </div>

                  <p className="text-xs text-slate-300 font-cyber leading-relaxed">
                    También puedes transferir y enviar la captura, tu nombre (<strong className="text-white">{successData.captain_name}</strong>) y tu ID al WhatsApp <strong className="text-[#10B981] font-bold">0962074110</strong>:
                  </p>

                  <a
                    href={whatsappStaffReportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-arcade-press shadow-brutal-black w-full px-4 py-3 bg-[#10B981] text-black font-pixel font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-black"
                  >
                    <Send className="w-4 h-4" />
                    <span>ENVIAR CAPTURA AL WHATSAPP 0962074110</span>
                  </a>
                </div>

                {/* Direct Go To Payment Page Option */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {onNavigateToPayment && (
                    <button
                      type="button"
                      onClick={() => onNavigateToPayment(successData.id)}
                      className="btn-arcade-press shadow-brutal-cyan w-full sm:w-auto px-5 py-3 border-2 border-black bg-[#00F0FF] text-black font-pixel font-black text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>[ IR A SUBIR EL PAGO AHORA ]</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-arcade-press shadow-brutal-black w-full sm:w-auto px-6 py-3 border-2 border-black bg-black text-slate-300 hover:text-white font-pixel text-[10px] uppercase cursor-pointer"
                  >
                    CERRAR
                  </button>
                </div>
              </div>
            ) : (
              /* PAGAR AHORA SUCCESS */
              <div className="text-center py-6 px-4 space-y-6">
                <div className="w-20 h-20 mx-auto">
                  <img
                    src="/assets/buho_pixel_start.png"
                    alt="Búho feliz"
                    className="w-full h-full object-contain shape-crisp drop-shadow-[0_0_15px_rgba(255,230,0,0.6)]"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl sm:text-3xl font-black uppercase text-white font-display tracking-wide drop-shadow-[2px_2px_0px_#000]">
                    ¡INSCRIPCIÓN ENVIADA EXITOSAMENTE!
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto font-cyber">
                    Hemos recibido el registro de <strong className="text-[#FFE600] font-pixel text-xs">{successData.team_name}</strong> para <strong className="text-white font-pixel text-xs">{gameConfig.name}</strong> y tu comprobante por <strong className="text-[#FFE600] font-pixel text-xs">${totalCost.toFixed(2)} USD</strong>.
                  </p>
                </div>

                <div className="p-5 bg-black border-2 border-black text-left max-w-lg mx-auto space-y-3 font-cyber text-xs text-slate-300 shadow-brutal-black">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 font-pixel text-[9px]">
                    <span className="text-slate-400">ESTADO DEL REGISTRO:</span>
                    <span className="px-2 py-0.5 bg-[#FFE600] text-black font-black uppercase">
                      EN VERIFICACION BANCARIA
                    </span>
                  </div>
                  <div>
                    <span className="font-pixel text-[8px] text-slate-500 uppercase block">CAPITAN / JUGADOR:</span>
                    <span className="text-white font-bold">{successData.captain_name} ({successData.captain_game_id})</span>
                  </div>
                  <div>
                    <span className="font-pixel text-[8px] text-slate-500 uppercase block">WHATSAPP DE CONTACTO:</span>
                    <span className="text-[#FFE600] font-mono font-bold">{successData.captain_whatsapp}</span>
                  </div>
                  <div className="pt-2 text-[10px] text-slate-400 leading-relaxed border-t border-white/10 font-cyber">
                    ⚠️ El staff de Compu League E-Sports validará tu comprobante de Banco Pichincha. Una vez verificado, te agregaremos al grupo oficial de WhatsApp y coordinaremos tus partidas.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={CONTACT_INFO.whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-arcade-press shadow-brutal-black w-full sm:w-auto px-6 py-3.5 font-pixel font-black text-[10px] uppercase tracking-wider text-black bg-[#10B981] hover:bg-white transition flex items-center justify-center gap-2 border-2 border-black"
                  >
                    <Phone className="w-4 h-4" />
                    <span>[ ESCRIBIR A WHATSAPP STAFF ]</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-arcade-press shadow-brutal-black w-full sm:w-auto px-6 py-3.5 font-pixel text-[10px] uppercase tracking-wider text-slate-300 hover:text-white bg-black border-2 border-black transition cursor-pointer"
                  >
                    CERRAR
                  </button>
                </div>
              </div>
            )
          ) : (
            /* ======================================================== */
            /* REGISTRATION FORM                                        */
            /* ======================================================== */
            <form onSubmit={(e) => handleSubmit(e, paymentMode)} onPaste={handleReceiptPaste} className="space-y-6">
              <input
                ref={receiptInputRef}
                type="file"
                accept="image/*"
                onChange={handleReceiptChange}
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
              />
              
              {errorMessage && (
                <div className="p-3.5 bg-black border-2 border-[#FF0055] text-[#FF0055] font-pixel text-[10px] flex items-start gap-2.5 shadow-brutal-black">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#FF0055] mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Selector de Juego (Arcade Cartridges) */}
              <div className="space-y-2.5">
                <label className="font-pixel text-[10px] text-[#FFE600] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#FFE600] text-black border border-black flex items-center justify-center text-[10px] font-black">1</span>
                  <span>SELECCIONA EL VIDEOJUEGO // SLOT</span>
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {GAMES.map((game) => {
                    const isSelected = selectedGame === game.id;
                    return (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => setSelectedGame(game.id)}
                        className={`btn-arcade-press p-3 border-2 border-black text-left transition relative cursor-pointer ${
                          isSelected
                            ? 'bg-[#FFE600] text-black shadow-brutal-yellow font-black'
                            : 'bg-black text-slate-300 hover:text-white shadow-brutal-black'
                        }`}
                      >
                        <h4 className="font-display font-black text-sm uppercase leading-tight">
                          {game.name}
                        </h4>
                        <span className={`font-pixel text-[8px] block mt-1 ${isSelected ? 'text-black' : 'text-[#FFE600]'}`}>
                          {game.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tipo de Participación */}
              <div className="p-4 bg-black border-2 border-black space-y-3 shadow-brutal-black">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-pixel text-[9px] text-[#FFE600] uppercase">
                      TIPO DE PARTICIPACION
                    </h4>
                    <p className="text-xs text-slate-400 font-cyber mt-0.5">
                      ¿Participas con tu equipo armado o te inscribes de forma individual?
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFreeAgent(false)}
                      className={`btn-arcade-press font-pixel text-[9px] px-3 py-2 border-2 border-black uppercase cursor-pointer ${
                        !isFreeAgent
                          ? 'bg-[#FFE600] text-black font-black shadow-brutal-yellow'
                          : 'bg-[#0E1524] text-slate-400 hover:text-white shadow-brutal-black'
                      }`}
                    >
                      CON MI EQUIPO
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFreeAgent(true)}
                      className={`btn-arcade-press font-pixel text-[9px] px-3 py-2 border-2 border-black uppercase cursor-pointer ${
                        isFreeAgent
                          ? 'bg-[#00F0FF] text-black font-black shadow-brutal-cyan'
                          : 'bg-[#0E1524] text-slate-400 hover:text-white shadow-brutal-black'
                      }`}
                    >
                      INDIVIDUAL
                    </button>
                  </div>
                </div>

                {/* Submodalidad Free Fire */}
                {selectedGame === 'free_fire' && !isFreeAgent && (
                  <div className="pt-3 border-t-2 border-white/10 space-y-2">
                    <span className="font-pixel text-[8px] text-[#FFE600] uppercase block">
                      MODALIDAD FREE FIRE PARA TU EQUIPO:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFfModality('escuadras')}
                        className={`btn-arcade-press p-2.5 border-2 border-black text-left font-pixel text-[9px] cursor-pointer ${
                          ffModality === 'escuadras'
                            ? 'bg-[#FFE600] text-black font-black shadow-brutal-yellow'
                            : 'bg-[#0E1524] text-slate-300 shadow-brutal-black'
                        }`}
                      >
                        SOLO ESCUADRAS (4P - $4)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFfModality('both')}
                        className={`btn-arcade-press p-2.5 border-2 border-black text-left font-pixel text-[9px] cursor-pointer ${
                          ffModality === 'both'
                            ? 'bg-[#FFE600] text-black font-black shadow-brutal-yellow'
                            : 'bg-[#0E1524] text-slate-300 shadow-brutal-black'
                        }`}
                      >
                        ESCUADRAS + INDIVIDUAL ($4)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nombre de Equipo */}
              {!isFreeAgent && selectedGame !== 'clash_royale' && (
                <div className="space-y-1.5">
                  <label className="font-pixel text-[9px] uppercase text-[#FFE600] block font-bold">
                    NOMBRE DEL EQUIPO / CLAN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EJ. CYBERKNIGHTS, NULLPOINTERS, DRAGONS..."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black border-2 border-black text-xs text-[#00F0FF] placeholder:text-slate-600 focus:border-[#FFE600] focus:outline-none font-pixel uppercase shadow-brutal-black"
                  />
                </div>
              )}

              {/* 2. Datos del Capitán */}
              <div className="space-y-2.5">
                <label className="font-pixel text-[10px] text-[#FFE600] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#FFE600] text-black border border-black flex items-center justify-center text-[10px] font-black">2</span>
                  <span>{isFreeAgent || selectedGame === 'clash_royale' ? 'DATOS DEL JUGADOR' : 'DATOS DEL CAPITAN'}</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="font-pixel text-[8px] text-slate-400 uppercase">NOMBRE COMPLETO *</span>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Mendoza"
                      value={captain.name}
                      onChange={(e) => setCaptain({ ...captain, name: e.target.value })}
                      className="w-full px-3 py-2 bg-black border-2 border-black text-xs text-white placeholder:text-slate-600 focus:border-[#FFE600] focus:outline-none font-cyber shadow-brutal-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-pixel text-[8px] text-slate-400 uppercase">ID EN JUEGO (NICK) *</span>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Shadow#LAN"
                      value={captain.gameId}
                      onChange={(e) => setCaptain({ ...captain, gameId: e.target.value })}
                      className="w-full px-3 py-2 bg-black border-2 border-black text-xs text-[#00F0FF] placeholder:text-slate-600 focus:border-[#FFE600] focus:outline-none font-cyber shadow-brutal-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-pixel text-[8px] text-slate-400 uppercase">WHATSAPP ACTIVO *</span>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 0987654321"
                      value={captain.whatsapp}
                      onChange={(e) => setCaptain({ ...captain, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 bg-black border-2 border-black text-xs text-[#FFE600] placeholder:text-slate-600 focus:border-[#FFE600] focus:outline-none font-mono shadow-brutal-black"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Miembros del Equipo */}
              {!isFreeAgent && selectedGame !== 'clash_royale' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-pixel text-[10px] text-[#FFE600] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#FFE600] text-black border border-black flex items-center justify-center text-[10px] font-black">3</span>
                      <span>COMPAÑEROS DE EQUIPO (ROSTER)</span>
                    </label>
                    <span className="font-pixel text-[8px] text-slate-400">
                      {selectedGame === 'valorant' ? '4 TITULARES (+1 SUPLENTE)' : selectedGame === 'free_fire' ? '3 TITULARES' : '1 PAREJA / DUO'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {Array.from({ length: selectedGame === 'valorant' ? 4 : selectedGame === 'free_fire' ? 3 : 1 }).map((_, idx) => (
                      <div key={idx} className="p-3 bg-black border-2 border-black grid grid-cols-1 sm:grid-cols-3 gap-2 shadow-brutal-black">
                        <input
                          type="text"
                          required
                          placeholder={`Jugador #${idx + 2} - Nombre`}
                          value={members[idx]?.name || ''}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          className="px-3 py-2 bg-[#0C121D] border border-white/10 text-xs text-white placeholder:text-slate-600 focus:border-[#FFE600] focus:outline-none font-cyber"
                        />
                        <input
                          type="text"
                          required
                          placeholder="ID de Juego / Nick"
                          value={members[idx]?.gameId || ''}
                          onChange={(e) => handleMemberChange(idx, 'gameId', e.target.value)}
                          className="px-3 py-2 bg-[#0C121D] border border-white/10 text-xs text-[#00F0FF] placeholder:text-slate-600 focus:border-[#FFE600] focus:outline-none font-cyber"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="WhatsApp (+593...)"
                          value={members[idx]?.whatsapp || ''}
                          onChange={(e) => handleMemberChange(idx, 'whatsapp', e.target.value)}
                          className="px-3 py-2 bg-[#0C121D] border border-white/10 text-xs text-[#FFE600] placeholder:text-slate-600 focus:border-[#FFE600] focus:outline-none font-mono"
                        />
                      </div>
                    ))}

                    {/* Suplente Opcional en Valorant */}
                    {selectedGame === 'valorant' && (
                      <div className="pt-1">
                        {!hasSubstitute ? (
                          <button
                            type="button"
                            onClick={() => setHasSubstitute(true)}
                            className="btn-arcade-press font-pixel text-[9px] font-bold text-[#FFE600] p-2 bg-black border-2 border-[#FFE600] uppercase cursor-pointer shadow-brutal-black"
                          >
                            + AGREGAR SUPLENTE OPCIONAL (GRATIS)
                          </button>
                        ) : (
                          <div className="p-3 bg-[#110B1C] border-2 border-[#A855F7] space-y-2 shadow-brutal-purple">
                            <div className="flex items-center justify-between font-pixel text-[8px] text-[#A855F7] font-bold uppercase">
                              <span>SUPLENTE OPCIONAL (JUGADOR #6):</span>
                              <button
                                type="button"
                                onClick={() => setHasSubstitute(false)}
                                className="text-rose-400 hover:text-white cursor-pointer"
                              >
                                [ QUITAR ]
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Nombre Suplente"
                                value={members[4]?.name || ''}
                                onChange={(e) => handleMemberChange(4, 'name', e.target.value)}
                                className="px-3 py-2 bg-black border border-white/20 text-xs text-white placeholder:text-slate-600 focus:border-[#A855F7] focus:outline-none font-cyber"
                              />
                              <input
                                type="text"
                                placeholder="ID Juego Suplente"
                                value={members[4]?.gameId || ''}
                                onChange={(e) => handleMemberChange(4, 'gameId', e.target.value)}
                                className="px-3 py-2 bg-black border border-white/20 text-xs text-[#A855F7] placeholder:text-slate-600 focus:border-[#A855F7] focus:outline-none font-cyber"
                              />
                              <input
                                type="tel"
                                placeholder="WhatsApp Suplente"
                                value={members[4]?.whatsapp || ''}
                                onChange={(e) => handleMemberChange(4, 'whatsapp', e.target.value)}
                                className="px-3 py-2 bg-black border border-white/20 text-xs text-white placeholder:text-slate-600 focus:border-[#A855F7] focus:outline-none font-mono"
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
              <div className="space-y-4 p-4 sm:p-5 bg-black border-4 border-black shadow-brutal-black">
                <div className="flex items-center justify-between pb-3 border-b-2 border-white/10 font-pixel">
                  <label className="text-[10px] text-[#FFE600] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#FFE600] text-black border border-black flex items-center justify-center text-[10px] font-black">4</span>
                    <span>¿PAGAR AHORA O PAGAR DESPUES?</span>
                  </label>
                  <span className="px-2.5 py-1 bg-[#FFE600] text-black font-black text-xs">
                    TOTAL: ${totalCost.toFixed(2)} USD
                  </span>
                </div>

                {/* LOS 2 BOTONES SELECTORES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('now')}
                    className={`btn-arcade-press p-4 border-2 text-left transition flex flex-col justify-between cursor-pointer hover:border-[#FFE600] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE600] ${
                      paymentMode === 'now'
                        ? 'border-black bg-[#FFE600] text-black shadow-brutal-yellow font-black'
                        : 'border-white/20 bg-[#0B101A] text-slate-300 shadow-brutal-black'
                    }`}
                  >
                    <div className="flex items-center justify-between font-pixel text-[10px]">
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-current" />
                        PAGAR AHORA
                      </span>
                      {paymentMode === 'now' && (
                        <span className="bg-black text-[#FFE600] px-1.5 py-0.5 text-[8px]">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-2 font-cyber leading-relaxed ${paymentMode === 'now' ? 'text-black font-bold' : 'text-slate-400'}`}>
                      Ver datos bancarios y subir la foto del comprobante ahora mismo.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('later')}
                    className={`btn-arcade-press p-4 border-2 text-left transition flex flex-col justify-between cursor-pointer hover:border-[#00F0FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00F0FF] ${
                      paymentMode === 'later'
                        ? 'border-black bg-[#00F0FF] text-black shadow-brutal-cyan font-black'
                        : 'border-white/20 bg-[#0B101A] text-slate-300 shadow-brutal-black'
                    }`}
                  >
                    <div className="flex items-center justify-between font-pixel text-[10px]">
                      <span className="flex items-center gap-2">
                        <Link2 className="w-4 h-4" />
                        PAGAR DESPUES
                      </span>
                      {paymentMode === 'later' && (
                        <span className="bg-black text-[#00F0FF] px-1.5 py-0.5 text-[8px]">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-2 font-cyber leading-relaxed ${paymentMode === 'later' ? 'text-black font-bold' : 'text-slate-400'}`}>
                      Paga después con el link que se te genera o enviando la captura al WhatsApp 0962074110.
                    </p>
                  </button>
                </div>

                {/* SÓLO SE MUESTRAN LOS DATOS BANCARIOS Y COMPROBANTE SI ELIGIÓ "PAGAR AHORA" */}
                {paymentMode === 'now' && (
                  <div className="space-y-4 pt-3 border-t-2 border-white/10 animate-in fade-in duration-150">
                    
                    {/* Caja de Datos Bancarios */}
                    <div className="p-4 bg-[#090D15] border-2 border-black space-y-3 shadow-brutal-black">
                      <div className="flex items-center justify-between font-pixel text-[9px]">
                        <span className="text-[#FFE600] uppercase font-bold">
                          DATOS DE TRANSFERENCIA BANCARIA
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className="font-pixel text-[11px] text-slate-300 uppercase block">BANCO</span>
                            <strong className="text-white font-cyber text-sm">{BANK_INFO.bank}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_INFO.bank, 'bank')}
                            aria-label={copiedBankField === 'bank' ? 'Banco copiado' : 'Copiar banco'}
                            className="btn-arcade-press shadow-brutal-yellow px-3 py-2 bg-[#FFE600] text-black border-2 border-black font-pixel text-[8px] uppercase flex items-center gap-1 cursor-pointer font-black"
                          >
                            <span>{copiedBankField === 'bank' ? 'COPIADO ✓' : 'COPIAR'}</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className="font-pixel text-[11px] text-slate-300 uppercase block">TIPO CUENTA</span>
                            <strong className="text-white font-cyber text-sm">{BANK_INFO.accountType}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_INFO.accountType, 'accountType')}
                            aria-label={copiedBankField === 'accountType' ? 'Tipo de cuenta copiado' : 'Copiar tipo de cuenta'}
                            className="btn-arcade-press shadow-brutal-yellow px-3 py-2 bg-[#FFE600] text-black border-2 border-black font-pixel text-[8px] uppercase flex items-center gap-1 cursor-pointer font-black"
                          >
                            <span>{copiedBankField === 'accountType' ? 'COPIADO ✓' : 'COPIAR'}</span>
                          </button>
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between gap-2 p-2.5 bg-[#0C121D] border-2 border-black">
                          <div>
                            <span className="font-pixel text-[11px] text-[#FFE600] block uppercase">NUMERO CUENTA</span>
                            <strong className="text-white font-pixel text-sm sm:text-base tracking-wider">{BANK_INFO.accountNumber}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_INFO.accountNumber, 'accountNumber')}
                            aria-label={copiedBankField === 'accountNumber' ? 'Número de cuenta copiado' : 'Copiar número de cuenta'}
                            className="btn-arcade-press shadow-brutal-yellow px-3 py-1.5 bg-[#FFE600] text-black border-2 border-black font-pixel text-[8px] uppercase tracking-wider flex items-center gap-1 cursor-pointer font-black"
                          >
                            <span>{copiedBankField === 'accountNumber' ? 'COPIADO ✓' : 'COPIAR'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className="font-pixel text-[11px] text-slate-300 block uppercase">TITULAR</span>
                            <strong className="text-white font-cyber text-sm">{BANK_INFO.holderName}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(BANK_INFO.holderName, 'holderName')}
                            aria-label={copiedBankField === 'holderName' ? 'Titular copiado' : 'Copiar titular'}
                            className="btn-arcade-press shadow-brutal-yellow px-3 py-2 bg-[#FFE600] text-black border-2 border-black font-pixel text-[8px] uppercase flex items-center gap-1 cursor-pointer font-black"
                          >
                            <span>{copiedBankField === 'holderName' ? 'COPIADO ✓' : 'COPIAR'}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-slate-300">
                        En la referencia o comentario de la transferencia, escribe:{' '}
                        <strong className="text-white">
                          {isFreeAgent ? (captain.gameId || captain.name || 'tu nick') : (teamName || 'el nombre de tu equipo')}
                        </strong>
                        .
                      </p>
                    </div>

                    {/* Subida de Captura */}
                    <div className="space-y-2">
                      <span className="font-pixel text-[9px] uppercase text-[#FFE600] block font-bold">
                        ADJUNTAR CAPTURA DEL COMPROBANTE *
                      </span>

                      {!receiptPreview ? (
                        <button
                          type="button"
                          onClick={() => receiptInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleReceiptDrop}
                          className="crt-monitor-screen w-full border-4 border-dashed border-white/20 hover:border-[#FFE600] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE600] bg-black p-6 flex flex-col items-center justify-center cursor-pointer transition group"
                        >
                          <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-[#FFE600] transition-colors" />
                          <span className="font-pixel text-[10px] font-black text-white mb-1 uppercase tracking-wider text-center group-hover:text-[#FFE600]">
                            CLIC, ARRASTRA O PEGA TU COMPROBANTE (CTRL+V)
                          </span>
                          <span className="text-sm text-slate-300 font-cyber text-center">
                            JPG, PNG o imagen (máx. 5 MB). En móvil puedes usar la cámara o galería.
                          </span>
                        </button>
                      ) : (
                        <div className="p-3 bg-black border-2 border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={receiptPreview}
                              alt="Vista previa comprobante"
                              className="w-14 h-14 object-cover border-2 border-[#FFE600]"
                            />
                            <div className="min-w-0">
                              <span className="text-sm font-semibold text-white block truncate">
                                {receiptFile?.name || 'Comprobante cargado'}
                              </span>
                              <span className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                                <Check className="w-3 h-3 stroke-[3]" />
                                {receiptFile ? `${(receiptFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Imagen adjunta'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => receiptInputRef.current?.click()}
                              className="btn-arcade-press shadow-brutal-yellow px-3 py-2 bg-[#FFE600] text-black border-2 border-black font-pixel text-[8px] uppercase font-black cursor-pointer"
                            >
                              REEMPLAZAR
                            </button>
                            <button
                              type="button"
                              onClick={removeReceipt}
                              className="btn-arcade-press shadow-brutal-black px-3 py-2 bg-[#0B101A] text-white border-2 border-white/30 font-pixel text-[8px] uppercase font-black cursor-pointer"
                            >
                              QUITAR
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* SI SELECCIONÓ PAGAR DESPUÉS: EXPLICACIÓN DIRECTA */}
                {paymentMode === 'later' && (
                  <div className="p-4 bg-black border-2 border-[#00F0FF] space-y-3 pt-3 animate-in fade-in duration-150 shadow-brutal-cyan">
                    <div className="flex items-center gap-2 font-pixel text-[9px] text-[#00F0FF]">
                      <span className="w-2 h-2 bg-[#00F0FF] inline-block animate-arcade-blink" />
                      <span className="uppercase font-bold">
                        PAGAR DESPUES (${totalCost.toFixed(2)} USD)
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-cyber leading-relaxed">
                      ¡Aparta tu cupo ahora mismo! Paga después con cualquiera de estas opciones:
                    </p>

                    <div className="space-y-2 text-xs font-cyber text-slate-300">
                      <div className="p-3 bg-[#0C121D] border-2 border-black flex items-start gap-2.5">
                        <span className="text-[#00F0FF] font-pixel text-[9px] shrink-0 font-bold">1.</span>
                        <span>
                          <strong className="text-white">Con el link que se te genera:</strong> Al registrarte se creará un link exclusivo donde podrás entrar cuando quieras a subir la captura de tu comprobante.
                        </span>
                      </div>
                      <div className="p-3 bg-[#0C121D] border-2 border-black flex items-start gap-2.5">
                        <span className="text-[#10B981] font-pixel text-[9px] shrink-0 font-bold">2.</span>
                        <span>
                          <strong className="text-white">O por WhatsApp:</strong> Envía la captura de transferencia, tu nombre e ID de registro directamente al WhatsApp <strong className="text-[#10B981]">0962074110</strong>.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Botón de Confirmación según la Opción Elegida */}
              <div className="sticky bottom-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#090D15] border-t-2 border-white/10">
                {paymentMode === 'now' ? (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-arcade-press shadow-brutal-pink w-full py-4 bg-[#FFE600] hover:bg-[#FFF04D] text-black font-pixel font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-2 border-black"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        <span>ENVIANDO REGISTRO...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-black" />
                        <span>ENVIAR COMPROBANTE E INSCRIBIRME (${totalCost.toFixed(2)} USD)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-arcade-press shadow-brutal-cyan w-full py-4 bg-[#00F0FF] hover:bg-[#5CE1E6] text-black font-pixel font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-2 border-black"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        <span>GUARDANDO REGISTRO...</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 stroke-[3]" />
                        <span>REGISTRAR Y PAGAR DESPUÉS</span>
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
