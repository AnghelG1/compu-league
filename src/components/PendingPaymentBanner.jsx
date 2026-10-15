import React from 'react';
import { AlertCircle, ArrowRight, X, Clock, Coins } from 'lucide-react';

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
    <div className="fixed bottom-3 inset-x-3 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl sm:w-full z-50 animate-in slide-in-from-bottom duration-200 font-sans select-none">
      <div className="relative border-4 border-black bg-[#0C111C] p-4 sm:p-5 shadow-brutal-yellow">
        
        {/* Close "X" Button */}
        <button
          onClick={onDismiss}
          aria-label="Cerrar aviso temporalmente"
          className="btn-arcade-press absolute top-3 right-3 p-1.5 border-2 border-black bg-black text-white hover:text-[#FFE600] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black font-pixel text-[9px] sm:text-[10px]">
          <span className="w-2.5 h-2.5 bg-[#FF0055] inline-block animate-arcade-blink" />
          <span className="text-[#FFE600] uppercase font-bold tracking-wider">
            [ ! ] PENDING COIN // PRE-REGISTRO DETECTADO
          </span>
        </div>

        {/* Content Body */}
        <div className="space-y-2 mb-4 relative z-10 text-left">
          <p className="text-xs text-slate-300 font-cyber">
            {captainName ? `¡Hola ${captainName}! ` : ''}Detectamos una pre-inscripción pendiente en este dispositivo:
          </p>

          <div className="p-3 bg-black border-2 border-black flex items-center justify-between gap-3 shadow-brutal-black">
            <div className="truncate min-w-0">
              <span className="text-white text-base sm:text-lg font-black font-display uppercase tracking-wider block truncate">
                {teamName}
              </span>
              <span className="text-xs text-[#00F0FF] font-pixel uppercase tracking-wider block mt-0.5">
                {gameName}
              </span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[8px] text-slate-400 font-pixel uppercase block">TICKET:</span>
              <span className="text-base sm:text-xl font-black text-[#FFE600] font-pixel block">
                ${amount} <span className="text-xs text-slate-400">USD</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-[#00F0FF] font-cyber">
            ¿Deseas completar el pago con comprobante bancario ahora?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1 relative z-10">
          <button
            type="button"
            onClick={() => onContinue(pendingPayment.id)}
            className="btn-arcade-press shadow-brutal-pink flex-1 py-3.5 px-4 bg-[#FFE600] text-black border-2 border-black font-pixel font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-center cursor-pointer"
          >
            <span>[ CONTINUAR CON EL PAGO ]</span>
            <ArrowRight className="w-4 h-4 shrink-0 stroke-[3]" />
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="btn-arcade-press shadow-brutal-black py-3 px-4 border-2 border-black bg-black text-slate-300 hover:text-white font-pixel text-[10px] uppercase tracking-wider transition-all text-center cursor-pointer"
          >
            MÁS TARDE
          </button>
        </div>

      </div>
    </div>
  );
}
