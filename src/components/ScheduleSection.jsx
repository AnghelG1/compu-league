import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, ExternalLink, Radio } from 'lucide-react';
import { SCHEDULE_EVENTS, CONTACT_INFO } from '../data/tournamentData';

export default function ScheduleSection() {
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setSchedule(SCHEDULE_EVENTS);
  }, []);

  const filtered = selectedDay === 'all'
    ? schedule
    : schedule.filter(item => item.date === selectedDay);

  const filterButtons = [
    { id: 'all', label: 'TODOS LOS DÍAS' },
    { id: '2026-11-04', label: 'NOCHE 1 (4 NOV)' },
    { id: '2026-11-05', label: 'NOCHE 2 (5 NOV)' },
    { id: '2026-11-06', label: 'GRAN FINAL (6 NOV)' },
  ];

  return (
    <section id="cronograma" className="py-20 bg-[#0B0E14] text-slate-100 relative border-b border-white/10 font-sans select-none">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(245,158,11,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3">
            <div className="inline-block px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-400 text-xs font-display font-bold uppercase tracking-wider">
              3 NOCHES DE COMPETENCIA EN VIVO
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-wide font-display">
              CRONOGRAMA DE BATALLAS
            </h2>
            <p className="text-slate-400 text-sm max-w-xl font-sans leading-relaxed">
              Horario oficial para la comunidad estudiantil. Transmisión en vivo con casters en Facebook Live y salas oficiales en Discord.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((btn) => {
              const isSelected = selectedDay === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setSelectedDay(btn.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 font-display tracking-wider ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                      : 'border border-white/10 bg-slate-900/80 text-slate-400 hover:border-amber-400/40 hover:text-white'
                  }`}
                >
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isHovered = hoveredCard === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`p-6 rounded-2xl border bg-[#121824] flex flex-col justify-between transition-all duration-300 shadow-xl ${
                  isHovered ? 'border-amber-400/60 bg-[#161f30] -translate-y-1 shadow-[0_12px_30px_rgba(245,158,11,0.15)]' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10 font-display">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>{item.dayLabel.toUpperCase()}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-md border border-white/10 bg-[#0B0E14] text-slate-200 font-bold flex items-center gap-1.5 font-sans text-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.time}</span>
                    </span>
                  </div>

                  {/* Game & Stage Title */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white uppercase font-display tracking-wide">
                      {item.gameName}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {item.stageTitle}
                    </p>
                  </div>
                </div>

                {/* Footer: Stream Link */}
                <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-sans">
                    <Video className="w-4 h-4 text-rose-500" />
                    <span>{item.streamLabel}</span>
                  </div>

                  <a
                    href={CONTACT_INFO.streamFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400 hover:text-slate-950 text-amber-400 text-xs font-display font-bold uppercase transition-all tracking-wider"
                  >
                    <span>TRANSMISIÓN</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stream Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-[#121824] via-[#161f30] to-[#121824] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-500/10">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-white uppercase font-display tracking-wide">
                TRANSMISIÓN OFICIAL EN FACEBOOK LIVE & DISCORD
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                Casters en vivo, relatos de las finales y salas de coordinación oficial para los capitanes.
              </p>
            </div>
          </div>

          <a
            href={CONTACT_INFO.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-xs uppercase tracking-wider text-center transition-all shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.35)]"
          >
            SERVIDOR DE DISCORD
          </a>
        </div>

      </div>
    </section>
  );
}
