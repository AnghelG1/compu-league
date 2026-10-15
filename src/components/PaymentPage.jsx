import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Upload, CheckCircle2, Clock, Shield, Flame, 
  Crown, Crosshair, Trophy, Copy, Check, Phone, AlertCircle, 
  Zap, FileText, CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getRegistrationById, updateRegistrationReceipt } from '../lib/storage';
import { BANK_INFO, CONTACT_INFO } from '../data/tournamentData';

export default function PaymentPage({ paymentId, onGoHome }) {
  const [targetId, setTargetId] = useState('');
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Form & receipt states
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  // Copy states
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Detect ID from props or URL
  useEffect(() => {
    let id = paymentId;
    if (!id) {
      try {
        const path = window.location.pathname;
        if (path.includes('/pago/')) {
          id = path.split('/pago/')[1]?.split('/')[0]?.split('?')[0];
        }
        if (!id) {
          const params = new URLSearchParams(window.location.search);
          id = params.get('id') || params.get('pago') || '';
        }
      } catch (e) {
        id = '';
      }
    }

    setTargetId(id || '');
    if (id) {
      loadTeam(id);
    } else {
      setLoading(false);
      setNotFound(true);
    }
  }, [paymentId]);

  const loadTeam = async (id) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await getRegistrationById(id);
      if (data) {
        setRegistration(data);
        setNotFound(false);
        if (data.receipt_image || data.receipt_url) {
          setReceiptPreview(data.receipt_image || data.receipt_url);
        }
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('El archivo no debe superar los 5MB.');
        return;
      }
      setErrorMsg('');
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
    } else if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSubmitVoucher = async (e) => {
    e.preventDefault();
    if (!receiptPreview) {
      setErrorMsg('Por favor selecciona o arrastra la captura de tu comprobante de pago.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      const updated = await updateRegistrationReceipt(targetId, receiptPreview, receiptFile);
      if (updated) {
        setRegistration(updated);
        try {
          const savedPending = localStorage.getItem('compu_league_pending_payment');
          if (savedPending) {
            const parsed = JSON.parse(savedPending);
            if (parsed.id === targetId) {
              localStorage.removeItem('compu_league_pending_payment');
            }
          }
        } catch (e) {}
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      setSuccessSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocurrió un error al guardar tu comprobante. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const getGameBadge = (gameId) => {
    switch (gameId) {
      case 'valorant':
        return { label: 'VALORANT (5v5 Táctico)', color: '#ff4655', icon: Crosshair };
      case 'free_fire':
        return { label: 'FREE FIRE (Escuadras / Solo)', color: '#f59e0b', icon: Flame };
      case 'fortnite':
        return { label: 'FORTNITE (Dúos)', color: '#38bdf8', icon: Shield };
      case 'clash_royale':
        return { label: 'CLASH ROYALE (1v1)', color: '#06b6d4', icon: Crown };
      default:
        return { label: 'E-SPORTS UPEC', color: '#eab308', icon: Trophy };
    }
  };

  const totalCost = registration?.total_amount || (
    registration?.members && registration.members.length > 0 
      ? registration.members.length + 1 
      : (registration?.amount_due || 1)
  );

  const cleanPhone = (phone) => {
    let p = (phone || '').replace(/[^0-9]/g, '');
    if (p.startsWith('0')) p = '593' + p.substring(1);
    else if (!p.startsWith('593') && p.length === 9) p = '593' + p;
    return p;
  };

  const whatsappStaffMsg = registration
    ? `Hola Staff Compu League 2026, he subido el comprobante de pago para mi equipo *${registration.team_name}* (ID: ${registration.id}). ¡Por favor confirmen mi inscripción!`
    : '';

  const whatsappNotifyUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(whatsappStaffMsg)}`;

  return (
    <div className="min-h-screen bg-[#151f33] text-slate-100 flex flex-col font-['Press_Start_2P',monospace] select-none py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(45,75,135,0.4),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(96,165,250,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(96,165,250,0.06)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full relative z-10 space-y-6">
        
        {/* Top Bar with Brand & Back Button */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#2f4469]">
          <button
            onClick={onGoHome}
            className="px-3 py-2 border-2 border-[#364e78] bg-[#1d2d4c] hover:border-yellow-300 text-[10px] text-yellow-300 transition flex items-center gap-2 cursor-pointer uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ VOLVER AL PORTAL ]</span>
          </button>

          <div className="flex items-center gap-2">
            <img 
              src="/assets/buho_pixel_start.png" 
              alt="Compu League" 
              className="w-7 h-7 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="text-xs sm:text-sm font-bold text-white font-['Silkscreen',monospace] tracking-wider">
              COMPU LEAGUE <span className="text-yellow-300">2026</span>
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. LOADING STATE                                          */}
        {/* ========================================================= */}
        {loading && (
          <div className="p-12 border-4 border-[#364e78] bg-[#1a2742] text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-yellow-300 uppercase tracking-widest font-['Silkscreen',monospace]">
              BUSCANDO EQUIPO EN LA BASE DE DATOS...
            </p>
            <p className="text-[10px] text-[#a5badb] font-mono">
              Validando Enlace Mágico UUID: {targetId || '...'}
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. NOT FOUND STATE                                        */}
        {/* ========================================================= */}
        {!loading && notFound && (
          <div className="p-8 sm:p-12 border-4 border-rose-500/50 bg-[#1a2742] text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-rose-500/20 border-2 border-rose-500 text-rose-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase font-['Silkscreen',monospace]">
              * ENLACE NO ENCONTRADO O INVÁLIDO
            </h2>
            <p className="text-xs text-[#a5badb] font-mono leading-relaxed max-w-md mx-auto">
              No encontramos ningún equipo asociado al ID <span className="text-yellow-300 font-mono">"{targetId}"</span>. Verifica que el enlace esté completo o realiza una nueva inscripción.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onGoHome}
                className="w-full sm:w-auto px-5 py-3 border-2 border-yellow-300 bg-yellow-300 text-black font-bold text-xs uppercase cursor-pointer hover:bg-white transition"
              >
                [ IR AL INICIO ]
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. FOUND TEAM - PAYMENT / VOUCHER UPLOAD SCREEN           */}
        {/* ========================================================= */}
        {!loading && registration && (
          <div className="space-y-6">
            
            {/* Header Badge */}
            <div className="p-4 sm:p-5 border-4 border-[#364e78] bg-[#1d2d4c] shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#2f4469]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-yellow-300 animate-pulse" />
                  <span className="text-[10px] text-yellow-300 uppercase font-bold tracking-wider font-mono">
                    ★ ENLACE MÁGICO DE PAGO Y ACREDITACIÓN ★
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] text-[#8ea4c7] font-mono truncate">
                  UUID: {registration.id}
                </span>
              </div>

              {/* Team Information Block */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-0.5 border text-[8px] font-bold font-mono uppercase"
                      style={{ 
                        borderColor: `${getGameBadge(registration.game || registration.game_id).color}80`, 
                        color: getGameBadge(registration.game || registration.game_id).color,
                        backgroundColor: '#121c2e'
                      }}
                    >
                      {getGameBadge(registration.game || registration.game_id).label}
                    </span>

                    {registration.status === 'approved' ? (
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[8px] font-bold font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        PAGO APROBADO
                      </span>
                    ) : (registration.receipt_image || registration.receipt_url) ? (
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/60 text-[8px] font-bold font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-amber-400" />
                        EN VERIFICACIÓN
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-500/60 text-[8px] font-bold font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-sky-400" />
                        PENDIENTE DE PAGO
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-white uppercase font-['Silkscreen',monospace] tracking-wider drop-shadow-sm">
                    {registration.team_name}
                  </h1>

                  <div className="text-[10px] text-[#a5badb] font-mono space-y-0.5">
                    <p>
                      Capitán: <strong className="text-white">{registration.captain_name}</strong> ({registration.captain_game_id})
                    </p>
                    <p>
                      WhatsApp: <strong className="text-amber-400">{registration.captain_whatsapp}</strong>
                    </p>
                  </div>
                </div>

                {/* Amount Due Pill */}
                <div className="p-3 bg-[#121c2e] border-2 border-yellow-300/60 text-center shrink-0 self-start sm:self-center">
                  <span className="text-[8px] text-[#8ea4c7] block uppercase font-mono">VALOR A TRANSFERIR</span>
                  <span className="text-xl sm:text-2xl font-bold text-yellow-300 font-mono tracking-tight">
                    ${Number(totalCost).toFixed(2)} USD
                  </span>
                  <span className="text-[7px] text-[#a5badb] block mt-0.5 font-mono">($1 por jugador)</span>
                </div>
              </div>
            </div>

            {/* ======================================================= */}
            {/* STATE A: ALREADY APPROVED BY STAFF                     */}
            {/* ======================================================= */}
            {registration.status === 'approved' && (
              <div className="p-6 border-4 border-emerald-500 bg-[#16233b] text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-emerald-400 uppercase font-['Silkscreen',monospace]">
                  ¡PAGO VALIDADO Y CUPO CONFIRMADO!
                </h3>
                <p className="text-xs text-[#a5badb] font-mono max-w-md mx-auto leading-relaxed">
                  Tu equipo ya está oficialmente acreditado en el fixture de Compu League 2026. Te hemos contactado o te contactaremos al WhatsApp del Capitán para la coordinación.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onGoHome}
                    className="px-6 py-3 border-2 border-emerald-400 bg-emerald-400 text-black font-bold text-xs uppercase cursor-pointer hover:bg-white transition"
                  >
                    [ VOLVER AL PORTAL OFICIAL ]
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STATE B: JUST SUBMITTED OR UNDER VERIFICATION           */}
            {/* ======================================================= */}
            {successSubmitted && (
              <div className="p-6 sm:p-8 border-4 border-emerald-400 bg-[#182a47] text-center space-y-4 shadow-2xl">
                <div className="w-14 h-14 bg-emerald-400/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase font-['Silkscreen',monospace]">
                  ¡COMPROBANTE SUBIDO CON ÉXITO!
                </h2>
                <p className="text-xs text-yellow-300 font-mono leading-relaxed max-w-lg mx-auto">
                  El comprobante ha sido registrado. El staff de Compu League E-Sports validará la transferencia en Banco Pichincha y actualizará tu cupo a CONFIRMADO.
                </p>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappNotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 border-2 border-emerald-400 bg-emerald-500 text-black font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-emerald-400 transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>AVISAR AL STAFF POR WHATSAPP</span>
                  </a>

                  <button
                    onClick={onGoHome}
                    className="w-full sm:w-auto px-5 py-3 border-2 border-[#364e78] bg-[#121c2e] hover:border-white text-white text-xs font-bold uppercase transition"
                  >
                    [ VOLVER AL INICIO ]
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STATE C: PAYMENT PENDING - UPLOAD VOUCHER               */}
            {/* ======================================================= */}
            {registration.status !== 'approved' && !successSubmitted && (
              <div className="space-y-6">
                
                {/* 1. Datos Bancarios */}
                <div className="p-5 border-4 border-[#364e78] bg-[#1d2d4c] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-[#2f4469]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-yellow-300 text-black flex items-center justify-center text-[11px] font-bold font-mono">
                        1
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-['Silkscreen',monospace]">
                        DATOS DE TRANSFERENCIA BANCARIA
                      </h3>
                    </div>
                    <span className="text-[10px] text-yellow-300 font-mono font-bold">
                      ${Number(totalCost).toFixed(2)} USD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#16233b] p-4 border-2 border-[#2f4469] font-mono">
                    <div>
                      <span className="text-[#8ea4c7] block text-[9px] uppercase">BANCO:</span>
                      <strong className="text-white text-sm">{BANK_INFO.bank}</strong>
                    </div>
                    <div>
                      <span className="text-[#8ea4c7] block text-[9px] uppercase">TIPO DE CUENTA:</span>
                      <strong className="text-white text-sm">{BANK_INFO.accountType}</strong>
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between p-3 bg-[#1f3052] border border-[#364e78]">
                      <div>
                        <span className="text-[#8ea4c7] block text-[9px] uppercase">NÚMERO DE CUENTA:</span>
                        <strong className="text-white text-base font-mono tracking-wider">
                          {BANK_INFO.accountNumber}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(BANK_INFO.accountNumber, 'account')}
                        className="px-3 py-1.5 border border-yellow-300/60 bg-[#253961] hover:bg-yellow-300 hover:text-black text-yellow-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer font-mono"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount ? 'COPIADO' : 'COPIAR'}</span>
                      </button>
                    </div>

                    <div>
                      <span className="text-[#8ea4c7] block text-[9px] uppercase">TITULAR:</span>
                      <strong className="text-white">{BANK_INFO.holderName}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="text-[#8ea4c7] block text-[9px] uppercase">CORREO:</span>
                        <strong className="text-zinc-300 truncate text-[11px] block">{BANK_INFO.email}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(BANK_INFO.email, 'email')}
                        className="p-2 border border-[#364e78] bg-[#1d2d4c] text-zinc-300 hover:text-white hover:border-yellow-300 transition cursor-pointer shrink-0"
                        title="Copiar correo"
                      >
                        {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Cuadro para Subir la Foto del Voucher */}
                <form onSubmit={handleSubmitVoucher} className="p-5 border-4 border-[#364e78] bg-[#1d2d4c] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-[#2f4469]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-yellow-300 text-black flex items-center justify-center text-[11px] font-bold font-mono">
                        2
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-['Silkscreen',monospace]">
                        SUBIR COMPROBANTE DE PAGO (VOUCHER)
                      </h3>
                    </div>
                    <span className="text-[9px] text-[#8ea4c7] font-mono">MAX 5MB</span>
                  </div>

                  {errorMsg && (
                    <div className="p-3 border-2 border-rose-500/60 bg-rose-500/20 text-rose-300 text-xs font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {!receiptPreview ? (
                    <label className="border-4 border-dashed border-[#364e78] hover:border-yellow-300 bg-[#16233b] p-8 flex flex-col items-center justify-center cursor-pointer transition group">
                      <Upload className="w-10 h-10 text-[#8ea4c7] mb-3 group-hover:text-yellow-300 transition-colors" />
                      <span className="text-xs sm:text-sm font-bold text-white mb-1.5 uppercase font-['Silkscreen',monospace] text-center">
                        CLIC AQUÍ PARA SUBIR LA FOTO DEL VOUCHER
                      </span>
                      <p className="text-[10px] text-[#a5badb] font-mono text-center">
                        Formatos soportados: JPG, PNG o captura de pantalla
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="p-4 border-2 border-[#364e78] bg-[#16233b] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={receiptPreview}
                          alt="Vista previa del comprobante"
                          className="w-20 h-20 object-cover border-2 border-yellow-300 shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-white block uppercase font-['Silkscreen',monospace]">
                            VOUCHER LISTO PARA CONFIRMAR
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                            <Check className="w-3.5 h-3.5" /> Imagen cargada correctamente
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => { setReceiptPreview(null); setReceiptFile(null); }}
                        className="w-full sm:w-auto px-4 py-2 border-2 border-rose-500/60 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs font-bold font-mono uppercase transition cursor-pointer"
                      >
                        [ CAMBIAR FOTO ]
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting || !receiptPreview}
                      className="w-full py-4 border-2 border-yellow-300 bg-yellow-300 hover:bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 font-['Silkscreen',monospace] disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                    >
                      {submitting ? (
                        <span>GUARDANDO COMPROBANTE...</span>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-black" />
                          <span>CONFIRMAR Y ENVIAR COMPROBANTE (${Number(totalCost).toFixed(2)} USD)</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* WhatsApp Help Box */}
                <div className="p-4 border-2 border-[#2f4469] bg-[#16233b] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-[#a5badb]">
                  <span>¿Tienes dudas con tu pago o la transferencia?</span>
                  <a
                    href={CONTACT_INFO.whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-white flex items-center gap-1.5 font-bold uppercase"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Escribir al Staff</span>
                  </a>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
