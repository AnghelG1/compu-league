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
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans select-none py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background radial glow & esports grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(245,158,11,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full relative z-10 space-y-6">
        
        {/* Top Bar with Brand & Back Button */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            onClick={onGoHome}
            className="px-4 py-2 rounded-xl border border-white/10 bg-slate-900/80 hover:border-amber-400/40 text-xs font-display font-bold text-amber-400 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLVER AL PORTAL</span>
          </button>

          <div className="flex items-center gap-2.5">
            <img 
              src="/assets/buho_hd.png" 
              alt="Compu League" 
              className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            />
            <span className="text-sm sm:text-base font-bold text-white font-display tracking-wider">
              COMPU LEAGUE <span className="text-amber-400">2026</span>
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. LOADING STATE                                          */}
        {/* ========================================================= */}
        {loading && (
          <div className="p-12 rounded-2xl border border-white/10 bg-[#121824] text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-amber-400 uppercase tracking-widest font-display font-bold">
              BUSCANDO EQUIPO EN LA BASE DE DATOS...
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Buscando ID de pago: {targetId || '...'}
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. NOT FOUND STATE                                        */}
        {/* ========================================================= */}
        {!loading && notFound && (
          <div className="p-8 sm:p-12 rounded-2xl border border-rose-500/30 bg-[#121824] text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase font-display tracking-wide">
              ENLACE NO ENCONTRADO O INVÁLIDO
            </h2>
            <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-md mx-auto">
              No encontramos ningún equipo asociado al ID <span className="text-amber-400 font-mono">"{targetId}"</span>. Verifica que el enlace esté completo o realiza una nueva inscripción.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onGoHome}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider cursor-pointer hover:bg-amber-300 transition shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                IR AL INICIO
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
            <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#121824] shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-wider font-display">
                    PAGO Y ACREDITACIÓN DE EQUIPO
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono truncate">
                  ID: {registration.id}
                </span>
              </div>

              {/* Team Information Block */}
              <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-md border text-[10px] font-bold font-display uppercase tracking-wider"
                      style={{ 
                        borderColor: `${getGameBadge(registration.game || registration.game_id).color}80`, 
                        color: getGameBadge(registration.game || registration.game_id).color,
                        backgroundColor: '#0B0E14'
                      }}
                    >
                      {getGameBadge(registration.game || registration.game_id).label}
                    </span>

                    {registration.status === 'approved' ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-display flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        PAGO APROBADO
                      </span>
                    ) : (registration.receipt_image || registration.receipt_url) ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold font-display flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        EN VERIFICACIÓN
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/30 text-[10px] font-bold font-display flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-400" />
                        PENDIENTE DE PAGO
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase font-display tracking-wide drop-shadow-sm">
                    {registration.team_name}
                  </h1>

                  <div className="text-xs text-slate-400 font-sans space-y-0.5">
                    <p>
                      Capitán: <strong className="text-white">{registration.captain_name}</strong> ({registration.captain_game_id})
                    </p>
                    <p>
                      WhatsApp: <strong className="text-amber-400 font-mono">{registration.captain_whatsapp}</strong>
                    </p>
                  </div>
                </div>

                {/* Amount Due Pill */}
                <div className="p-4 rounded-xl bg-[#0B0E14] border border-amber-400/30 text-center shrink-0 self-start sm:self-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-display font-bold">VALOR A TRANSFERIR</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-display tracking-tight">
                    ${Number(totalCost).toFixed(2)} USD
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 font-sans">($1 por jugador)</span>
                </div>
              </div>
            </div>

            {/* ======================================================= */}
            {/* STATE A: ALREADY APPROVED BY STAFF                     */}
            {/* ======================================================= */}
            {registration.status === 'approved' && (
              <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-[#121824] text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-emerald-400 uppercase font-display tracking-wide">
                  ¡PAGO VALIDADO Y CUPO CONFIRMADO!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
                  Tu equipo ya está oficialmente acreditado en el fixture de Compu League 2026. Te hemos contactado o te contactaremos al WhatsApp del Capitán para la coordinación.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onGoHome}
                    className="px-6 py-3 rounded-xl bg-emerald-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider cursor-pointer hover:bg-emerald-300 transition shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                  >
                    VOLVER AL PORTAL OFICIAL
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STATE B: JUST SUBMITTED OR UNDER VERIFICATION           */}
            {/* ======================================================= */}
            {successSubmitted && (
              <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-[#121824] text-center space-y-4 shadow-2xl">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white uppercase font-display tracking-wide">
                  ¡COMPROBANTE SUBIDO CON ÉXITO!
                </h2>
                <p className="text-xs sm:text-sm text-amber-300/90 font-sans leading-relaxed max-w-lg mx-auto">
                  El comprobante ha sido registrado. El staff de Compu League E-Sports validará la transferencia en Banco Pichincha y actualizará tu cupo a CONFIRMADO.
                </p>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappNotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                  >
                    <Phone className="w-4 h-4" />
                    <span>AVISAR AL STAFF POR WHATSAPP</span>
                  </a>

                  <button
                    onClick={onGoHome}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 bg-slate-900/80 hover:border-white/20 text-white text-xs font-display font-bold uppercase tracking-wider transition"
                  >
                    VOLVER AL INICIO
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
                <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#121824] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black font-display shadow-md shadow-amber-400/20">
                        1
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white uppercase font-display tracking-wider">
                        DATOS DE TRANSFERENCIA BANCARIA
                      </h3>
                    </div>
                    <span className="text-xs text-amber-400 font-display font-bold">
                      ${Number(totalCost).toFixed(2)} USD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#0B0E14] p-4 rounded-xl border border-white/10">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-display font-bold">BANCO</span>
                      <strong className="text-white text-sm font-sans">{BANK_INFO.bank}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-display font-bold">TIPO DE CUENTA</span>
                      <strong className="text-white text-sm font-sans">{BANK_INFO.accountType}</strong>
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-slate-900/80 rounded-xl border border-white/10">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-display font-bold">NÚMERO DE CUENTA</span>
                        <strong className="text-white text-base sm:text-lg font-mono tracking-wider">
                          {BANK_INFO.accountNumber}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(BANK_INFO.accountNumber, 'account')}
                        className="px-3.5 py-2 rounded-lg border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400 hover:text-slate-950 text-amber-400 text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount ? 'COPIADO' : 'COPIAR'}</span>
                      </button>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-display font-bold">TITULAR</span>
                      <strong className="text-white font-sans">{BANK_INFO.holderName}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="text-slate-400 block text-[10px] uppercase font-display font-bold">CORREO</span>
                        <strong className="text-slate-300 truncate text-xs block font-mono">{BANK_INFO.email}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(BANK_INFO.email, 'email')}
                        className="p-2 rounded-lg border border-white/10 bg-slate-900/60 text-slate-300 hover:text-white hover:border-amber-400/40 transition cursor-pointer shrink-0"
                        title="Copiar correo"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Cuadro para Subir la Foto del Voucher */}
                <form onSubmit={handleSubmitVoucher} className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#121824] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black font-display shadow-md shadow-amber-400/20">
                        2
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white uppercase font-display tracking-wider">
                        SUBIR COMPROBANTE DE PAGO (VOUCHER)
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">MAX 5MB</span>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-sans flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {!receiptPreview ? (
                    <label className="border-2 border-dashed border-white/20 hover:border-amber-400/60 rounded-2xl bg-[#0B0E14] p-8 flex flex-col items-center justify-center cursor-pointer transition group">
                      <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-amber-400 transition-colors" />
                      <span className="text-sm font-bold text-white mb-1.5 uppercase font-display tracking-wider text-center">
                        CLIC AQUÍ PARA SUBIR LA FOTO DEL VOUCHER
                      </span>
                      <p className="text-xs text-slate-400 font-sans text-center">
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
                    <div className="p-4 rounded-xl border border-white/10 bg-[#0B0E14] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={receiptPreview}
                          alt="Vista previa del comprobante"
                          className="w-20 h-20 object-cover rounded-lg border border-amber-400/40 shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-sm font-bold text-white block uppercase font-display tracking-wider">
                            VOUCHER LISTO PARA CONFIRMAR
                          </span>
                          <span className="text-xs text-emerald-400 flex items-center gap-1 font-sans">
                            <Check className="w-3.5 h-3.5" /> Imagen cargada correctamente
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => { setReceiptPreview(null); setReceiptFile(null); }}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-display font-bold uppercase tracking-wider transition cursor-pointer"
                      >
                        CAMBIAR FOTO
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting || !receiptPreview}
                      className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-sm sm:text-base uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                    >
                      {submitting ? (
                        <span>GUARDANDO COMPROBANTE...</span>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-slate-950" />
                          <span>CONFIRMAR Y ENVIAR COMPROBANTE (${Number(totalCost).toFixed(2)} USD)</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* WhatsApp Help Box */}
                <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-slate-400">
                  <span>¿Prefieres enviar la captura directamente por WhatsApp?</span>
                  <a
                    href={`https://wa.me/593962074110?text=${encodeURIComponent(`Hola Staff Compu League, adjunto captura de transferencia para mi equipo ${registration.team_name} (ID: ${registration.id}, Capitán: ${registration.captain_name}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-display font-bold uppercase tracking-wider transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp 0962074110</span>
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
