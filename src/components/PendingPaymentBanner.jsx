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
    <div className="fixed bottom-3 inset-x-3 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl sm:w-full z-50 animate-in slide-in-from-bottom duration-300 font-['Press_Start_2P',monospace]">
      <div className="relative border-4 border-yellow-300 bg-[#16243e] p-3.5 sm:p-5 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(253,224,71,0.25)] select-none">
        
        {/* Subtle Cyber Gradient Accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/[0.06] via-transparent to-sky-400/[0.06] pointer-events-none" />

        {/* Close "X" Button */}
        <button
          onClick={onDismiss}
          aria-label="Cerrar aviso temporalmente"
          className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-yellow-300 hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b-2 border-[#2b3f63]">
          <AlertCircle className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
          <span className="text-[8.5px] sm:text-[9.5px] text-yellow-300 uppercase tracking-wider font-bold">
            ★ PAGO PENDIENTE DETECTADO ★
          </span>
        </div>

        {/* Content Body */}
        <div className="space-y-2 mb-3.5 relative z-10 text-left">
          <p className="text-[9px] sm:text-[10px] text-slate-200 leading-relaxed font-mono">
            {captainName ? `¡Hola ${captainName}! ` : ''}Detectamos una pre-inscripción pendiente para:
          </p>

          <div className="p-2 sm:p-2.5 bg-[#0f172a] border-2 border-[#2e4469] flex items-center justify-between gap-2">
            <div className="truncate min-w-0">
              <span className="text-white text-xs sm:text-sm font-['Silkscreen',monospace] font-bold block truncate">
                {teamName}
              </span>
              <span className="text-[8px] sm:text-[9px] text-[#8ea4c7] font-mono block">
                {gameName.toUpperCase()}
              </span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[7.5px] text-[#8ea4c7] font-mono block">VALOR:</span>
              <span className="text-sm sm:text-base font-bold text-yellow-300 font-mono">
                ${amount}
              </span>
            </div>
          </div>

          <p className="text-[8px] sm:text-[9px] text-sky-300 font-mono">
            ¿Deseas continuar con el pago y subir tu comprobante ahora?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 relative z-10">
          <button
            onClick={() => onContinue(pendingPayment.id)}
            className="flex-1 py-2.5 sm:py-3 px-3 border-2 border-yellow-300 bg-yellow-300 hover:bg-white text-black text-[9px] sm:text-[10px] font-bold uppercase transition-colors shadow-md flex items-center justify-center gap-2 text-center cursor-pointer"
          >
            <span>[ CONTINUAR CON EL PAGO ]</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>

          <button
            onClick={onDismiss}
            className="py-2.5 sm:py-3 px-3 border-2 border-[#3b5482] bg-[#1a2947] hover:bg-[#253961] text-slate-300 hover:text-white text-[8.5px] sm:text-[9.5px] uppercase transition-colors text-center cursor-pointer"
          >
            [ MÁS TARDE ]
          </button>
        </div>

      </div>
    </div>
  );
}
