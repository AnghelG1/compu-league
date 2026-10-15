import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Upload, CheckCircle2, Clock, Shield, Flame, 
  Crown, Crosshair, Trophy, Copy, Check, Phone, AlertCircle, 
  Zap, FileText, CheckCircle, Terminal
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
        return { label: 'VALORANT (5v5 TÁCTICO)', color: '#FF0055', icon: Crosshair };
      case 'free_fire':
        return { label: 'FREE FIRE (ESCUADRAS / SOLO)', color: '#FFE600', icon: Flame };
      case 'fortnite':
        return { label: 'FORTNITE (DÚOS)', color: '#00F0FF', icon: Shield };
      case 'clash_royale':
        return { label: 'CLASH ROYALE (1v1)', color: '#A855F7', icon: Crown };
      default:
        return { label: 'E-SPORTS UPEC', color: '#FFE600', icon: Trophy };
    }
  };

  const totalCost = registration?.total_amount || (
    registration?.members && registration.members.length > 0 
      ? registration.members.length + 1 
      : (registration?.amount_due || 1)
  );

  const whatsappStaffMsg = registration
    ? `Hola Staff Compu League 2026, he subido el comprobante de pago para mi equipo *${registration.team_name}* (ID: ${registration.id}). ¡Por favor confirmen mi inscripción!`
    : '';

  const whatsappNotifyUrl = `https://wa.me/593962074110?text=${encodeURIComponent(whatsappStaffMsg)}`;

  return (
    <div className="min-h-screen bg-[#07090F] text-slate-100 flex flex-col font-sans select-none py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Cyber Grid */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#FFE600 1px, transparent 1px), linear-gradient(90deg, #FFE600 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-3xl mx-auto w-full relative z-10 space-y-6">
        
        {/* Top Bar with Brand & Back Button */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black">
          <button
            type="button"
            onClick={onGoHome}
            className="btn-arcade-press shadow-brutal-black px-4 py-2 border-2 border-black bg-black hover:bg-[#121A2A] font-pixel text-[10px] text-[#FFE600] uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ VOLVER AL PORTAL ]</span>
          </button>

          <div className="flex items-center gap-2.5">
            <img 
              src="/assets/buho_pixel_start.png" 
              alt="Compu League" 
              className="w-8 h-8 object-contain shape-crisp drop-shadow-[0_0_8px_rgba(255,230,0,0.5)]"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="font-pixel text-xs font-bold text-white tracking-wider">
              COMPU LEAGUE <span className="text-[#FFE600]">2026</span>
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. LOADING STATE                                          */}
        {/* ========================================================= */}
        {loading && (
          <div className="p-12 border-4 border-black bg-[#0B101A] text-center space-y-4 shadow-brutal-black">
            <div className="w-10 h-10 border-4 border-[#FFE600] border-t-transparent animate-spin mx-auto" />
            <p className="font-pixel text-xs text-[#FFE600] uppercase tracking-widest">
              BUSCANDO EQUIPO EN LA BASE DE DATOS...
            </p>
            <p className="font-pixel text-[9px] text-slate-500">
              TARGET ID: {targetId || '...'}
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. NOT FOUND STATE                                        */}
        {/* ========================================================= */}
        {!loading && notFound && (
          <div className="p-8 sm:p-12 border-4 border-black bg-[#0B101A] text-center space-y-4 shadow-brutal-pink">
            <div className="w-14 h-14 bg-black border-2 border-[#FF0055] text-[#FF0055] mx-auto flex items-center justify-center shadow-brutal-black">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-white uppercase font-display tracking-wide">
              ENLACE NO ENCONTRADO O INVÁLIDO
            </h2>
            <p className="text-xs text-slate-400 font-cyber leading-relaxed max-w-md mx-auto">
              No encontramos ningún equipo asociado al ID <span className="text-[#FFE600] font-pixel text-[10px]">"{targetId}"</span>. Verifica que el enlace esté completo o realiza una nueva inscripción.
            </p>
            <div className="pt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={onGoHome}
                className="btn-arcade-press shadow-brutal-yellow px-6 py-3 bg-[#FFE600] text-black border-2 border-black font-pixel font-black text-xs uppercase tracking-wider cursor-pointer"
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
            <div className="p-5 sm:p-6 border-4 border-black bg-[#0B101A] shadow-brutal-black space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black font-pixel text-[9px] sm:text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#FFE600] inline-block animate-arcade-blink" />
                  <span className="text-[#FFE600] uppercase font-bold tracking-wider">
                    PAYMENT TERMINAL // COIN VALIDATION
                  </span>
                </div>
                <span className="text-slate-400 truncate">
                  ID: #{registration.id.slice(0, 10).toUpperCase()}
                </span>
              </div>

              {/* Team Information Block */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span 
                      className="px-2.5 py-1 border-2 border-black font-pixel text-[9px] uppercase font-bold"
                      style={{ 
                        backgroundColor: getGameBadge(registration.game || registration.game_id).color,
                        color: '#000'
                      }}
                    >
                      {getGameBadge(registration.game || registration.game_id).label}
                    </span>

                    {registration.status === 'approved' ? (
                      <span className="px-2.5 py-1 bg-[#10B981] text-black border-2 border-black font-pixel text-[9px] font-black flex items-center gap-1">
                        CONFIRMADO
                      </span>
                    ) : (registration.receipt_image || registration.receipt_url) ? (
                      <span className="px-2.5 py-1 bg-[#FFE600] text-black border-2 border-black font-pixel text-[9px] font-black flex items-center gap-1">
                        EN VERIFICACIÓN
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#00F0FF] text-black border-2 border-black font-pixel text-[9px] font-black flex items-center gap-1">
                        PENDIENTE DE PAGO
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black text-white uppercase font-display tracking-wide drop-shadow-[2px_2px_0px_#000]">
                    {registration.team_name}
                  </h1>

                  <div className="text-xs text-slate-300 font-cyber space-y-0.5">
                    <p>
                      Capitán: <strong className="text-white">{registration.captain_name}</strong> ({registration.captain_game_id})
                    </p>
                    <p>
                      WhatsApp: <strong className="text-[#FFE600] font-mono">{registration.captain_whatsapp}</strong>
                    </p>
                  </div>
                </div>

                {/* Amount Due Pill */}
                <div className="p-4 bg-black border-2 border-black shadow-brutal-yellow text-center shrink-0 self-start sm:self-center">
                  <span className="font-pixel text-[8px] text-slate-400 block uppercase">VALOR A TRANSFERIR:</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FFE600] font-pixel tracking-tight block mt-1">
                    ${Number(totalCost).toFixed(2)} <span className="text-xs text-slate-400">USD</span>
                  </span>
                  <span className="font-pixel text-[8px] text-slate-500 block mt-1">($1 POR JUGADOR)</span>
                </div>
              </div>
            </div>

            {/* ======================================================= */}
            {/* STATE A: ALREADY APPROVED BY STAFF                     */}
            {/* ======================================================= */}
            {registration.status === 'approved' && (
              <div className="p-6 sm:p-8 border-4 border-black bg-[#0B101A] text-center space-y-4 shadow-brutal-cyan">
                <div className="w-14 h-14 bg-[#10B981] text-black border-2 border-black mx-auto flex items-center justify-center shadow-brutal-black">
                  <CheckCircle className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-[#10B981] uppercase font-display tracking-wide drop-shadow-[1px_1px_0px_#000]">
                  ¡PAGO VALIDADO Y CUPO CONFIRMADO!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-cyber max-w-md mx-auto leading-relaxed">
                  Tu equipo ya está oficialmente acreditado en el fixture de Compu League 2026. Te contactaremos al WhatsApp del Capitán para la coordinación de salas.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onGoHome}
                    className="btn-arcade-press shadow-brutal-yellow px-6 py-3 bg-[#FFE600] text-black border-2 border-black font-pixel font-black text-xs uppercase tracking-wider cursor-pointer"
                  >
                    [ VOLVER AL PORTAL ]
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STATE B: JUST SUBMITTED OR UNDER VERIFICATION           */}
            {/* ======================================================= */}
            {successSubmitted && (
              <div className="p-6 sm:p-8 border-4 border-black bg-[#0B101A] text-center space-y-4 shadow-brutal-yellow">
                <div className="w-14 h-14 bg-[#FFE600] text-black border-2 border-black mx-auto flex items-center justify-center shadow-brutal-black">
                  <CheckCircle2 className="w-8 h-8 stroke-[3]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-display tracking-wide drop-shadow-[2px_2px_0px_#000]">
                  ¡COMPROBANTE SUBIDO CON ÉXITO!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-cyber leading-relaxed max-w-lg mx-auto">
                  El comprobante ha sido registrado. El staff de Compu League E-Sports validará la transferencia en Banco Pichincha y actualizará tu cupo a CONFIRMADO.
                </p>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappNotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-arcade-press shadow-brutal-black w-full sm:w-auto px-6 py-3.5 bg-[#10B981] text-black border-2 border-black font-pixel font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>[ NOTIFICAR STAFF POR WHATSAPP ]</span>
                  </a>

                  <button
                    type="button"
                    onClick={onGoHome}
                    className="btn-arcade-press shadow-brutal-black w-full sm:w-auto px-6 py-3.5 border-2 border-black bg-black text-white font-pixel text-xs uppercase tracking-wider"
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
                <div className="p-5 sm:p-6 border-4 border-black bg-[#0B101A] space-y-4 shadow-brutal-black">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#FFE600] text-black border border-black flex items-center justify-center text-xs font-pixel font-black">
                        1
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-white uppercase font-display tracking-wider">
                        DATOS DE TRANSFERENCIA BANCARIA
                      </h3>
                    </div>
                    <span className="font-pixel text-xs text-[#FFE600] font-bold">
                      ${Number(totalCost).toFixed(2)} USD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black p-4 border-2 border-black">
                    <div>
                      <span className="font-pixel text-[8px] text-slate-500 block uppercase">BANCO</span>
                      <strong className="text-white text-sm font-cyber">{BANK_INFO.bank}</strong>
                    </div>
                    <div>
                      <span className="font-pixel text-[8px] text-slate-500 block uppercase">TIPO DE CUENTA</span>
                      <strong className="text-white text-sm font-cyber">{BANK_INFO.accountType}</strong>
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-[#0C121D] border-2 border-black shadow-brutal-black">
                      <div>
                        <span className="font-pixel text-[8px] text-[#FFE600] block uppercase">NÚMERO DE CUENTA</span>
                        <strong className="text-white text-base sm:text-lg font-pixel tracking-wider">
                          {BANK_INFO.accountNumber}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(BANK_INFO.accountNumber, 'account')}
                        className="btn-arcade-press shadow-brutal-yellow px-3.5 py-2 border-2 border-black bg-[#FFE600] text-black font-pixel text-[9px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-black"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount ? 'COPIADO' : 'COPIAR'}</span>
                      </button>
                    </div>

                    <div>
                      <span className="font-pixel text-[8px] text-slate-500 block uppercase">TITULAR</span>
                      <strong className="text-white font-cyber text-sm">{BANK_INFO.holderName}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="font-pixel text-[8px] text-slate-500 block uppercase">CORREO</span>
                        <strong className="text-slate-300 truncate text-xs block font-mono">{BANK_INFO.email}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(BANK_INFO.email, 'email')}
                        className="btn-arcade-press p-2 border-2 border-black bg-black text-slate-300 hover:text-white transition cursor-pointer shrink-0"
                        title="Copiar correo"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Cuadro para Subir la Foto del Voucher */}
                <form onSubmit={handleSubmitVoucher} className="p-5 sm:p-6 border-4 border-black bg-[#0B101A] space-y-4 shadow-brutal-black">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#FFE600] text-black border border-black flex items-center justify-center text-xs font-pixel font-black">
                        2
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-white uppercase font-display tracking-wider">
                        SCANNER // SUBIR COMPROBANTE DE PAGO
                      </h3>
                    </div>
                    <span className="font-pixel text-[8px] text-slate-400">MAX 5MB</span>
                  </div>

                  {errorMsg && (
                    <div className="p-3 border-2 border-[#FF0055] bg-black text-[#FF0055] font-pixel text-[10px] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#FF0055]" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {!receiptPreview ? (
                    <label className="crt-monitor-screen border-4 border-dashed border-white/20 hover:border-[#FFE600] bg-black p-8 flex flex-col items-center justify-center cursor-pointer transition group">
                      <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#FFE600] transition-colors" />
                      <span className="font-pixel text-xs font-black text-white mb-1.5 uppercase tracking-wider text-center group-hover:text-[#FFE600]">
                        [ CLIC AQUÍ PARA INSERTAR FOTO DEL VOUCHER ]
                      </span>
                      <p className="text-xs text-slate-400 font-cyber text-center">
                        Formatos soportados: JPG, PNG o captura de transferencia
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="p-4 border-2 border-black bg-black flex flex-col sm:flex-row items-center justify-between gap-4 shadow-brutal-black">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={receiptPreview}
                          alt="Vista previa del comprobante"
                          className="w-20 h-20 object-cover border-2 border-[#FFE600] shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="font-pixel text-xs font-black text-white block uppercase tracking-wider">
                            VOUCHER LISTO
                          </span>
                          <span className="font-pixel text-[9px] text-[#10B981] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> IMAGEN CARGADA
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => { setReceiptPreview(null); setReceiptFile(null); }}
                        className="btn-arcade-press shadow-brutal-pink w-full sm:w-auto px-4 py-2 border-2 border-black bg-[#FF0055] text-white font-pixel text-[9px] uppercase tracking-wider cursor-pointer font-black"
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
                      className="btn-arcade-press shadow-brutal-yellow w-full py-4 bg-[#FFE600] hover:bg-[#FFF04D] text-black border-2 border-black font-pixel font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span>GUARDANDO EN LA BASE DE DATOS...</span>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-black" />
                          <span>[ INSERT VOUCHER // CONFIRMAR PAGO (${Number(totalCost).toFixed(2)} USD) ]</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* WhatsApp Help Box */}
                <div className="p-4 border-2 border-black bg-black flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-cyber text-slate-400 shadow-brutal-black">
                  <span>¿Prefieres enviar la captura directamente por WhatsApp?</span>
                  <a
                    href={`https://wa.me/593962074110?text=${encodeURIComponent(`Hola Staff Compu League, adjunto captura de transferencia para mi equipo ${registration.team_name} (ID: ${registration.id}, Capitán: ${registration.captain_name}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#10B981] hover:text-emerald-300 flex items-center gap-1.5 font-pixel text-[10px] uppercase tracking-wider"
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
