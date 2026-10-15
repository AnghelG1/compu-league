import React from 'react';
import { AlertCircle, ArrowRight, X, Clock, DollarSign } from 'lucide-react';

export default function PendingPaymentBanner({
  pendingPayment,
  onContinue,
  onDismiss
}) {
  if (!pendingPayment) return null;

  const teamName = pendingPayment.team_name || 'Tu Equipo';
  const gameName = pendingPayment.game_name || pendingPayment.game || 'Torneo';
  const captainName = pendingPayment.captain_name || '';
  const amount = Number(pendingPayment.amount_due || pendingPayment.total_amount || 1).toFixed(2);

  return (
    <div className="fixed bottom-3 inset-x-3 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl sm:w-full z-50 animate-in slide-in-from-bottom duration-300 font-sans">
      <div className="relative rounded-2xl border border-amber-400/50 bg-[#121824]/95 backdrop-blur-md p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(245,158,11,0.2)] select-none">
        
        {/* Subtle Cyber Gradient Accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/[0.08] via-transparent to-sky-400/[0.08] rounded-2xl pointer-events-none" />

        {/* Close "X" Button */}
        <button
          onClick={onDismiss}
          aria-label="Cerrar aviso temporalmente"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
          <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
          <span className="text-xs text-amber-400 uppercase tracking-wider font-display font-bold">
            PAGO PENDIENTE DETECTADO
          </span>
        </div>

        {/* Content Body */}
        <div className="space-y-2 mb-4 relative z-10 text-left">
          <p className="text-xs text-slate-300 font-sans">
            {captainName ? `¡Hola ${captainName}! ` : ''}Detectamos una pre-inscripción pendiente para:
          </p>

          <div className="p-3 bg-[#0B0E14] rounded-xl border border-white/10 flex items-center justify-between gap-3">
            <div className="truncate min-w-0">
              <span className="text-white text-sm sm:text-base font-display font-bold block truncate">
                {teamName}
              </span>
              <span className="text-xs text-slate-400 font-display uppercase tracking-wider block">
                {gameName}
              </span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-display block">VALOR:</span>
              <span className="text-base sm:text-lg font-black text-amber-400 font-display">
                ${amount} USD
              </span>
            </div>
          </div>

          <p className="text-xs text-sky-400 font-sans">
            ¿Deseas continuar con el pago y subir tu comprobante ahora?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1 relative z-10">
          <button
            onClick={() => onContinue(pendingPayment.id)}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-display font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 text-center cursor-pointer"
          >
            <span>CONTINUAR CON EL PAGO</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <button
            onClick={onDismiss}
            className="py-3 px-4 rounded-xl border border-white/10 bg-slate-900/80 hover:border-white/20 text-slate-300 hover:text-white text-xs font-display font-bold uppercase tracking-wider transition-all text-center cursor-pointer"
          >
            MÁS TARDE
          </button>
        </div>

      </div>
    </div>
  );
}
