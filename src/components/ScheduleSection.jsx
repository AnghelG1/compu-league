import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Radio, ExternalLink } from 'lucide-react';
import { getSchedule } from '../lib/storage';
import { CONTACT_INFO } from '../data/tournamentData';

export default function ScheduleSection() {
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setSchedule(getSchedule());
  }, []);

  const filtered = selectedDay === 'all' 
    ? schedule 
    : schedule.filter(s => s.date === selectedDay);

  const filterButtons = [
    { id: 'all', label: 'TODOS' },
    { id: '2026-11-04', label: 'NOCHE 1 (4 NOV)' },
    { id: '2026-11-05', label: 'NOCHE 2 (5 NOV)' },
    { id: '2026-11-06', label: 'GRAN FINAL (6 NOV)' },
  ];

  return (
    <section id="cronograma" className="py-20 bg-[#090e1a] text-slate-100 relative border-b-4 border-[#243556] font-['Press_Start_2P',monospace] select-none">
      
      {/* Background Pixel Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e2d4a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b-4 border-[#243556]">
          <div className="space-y-3">
            <div className="inline-block px-3 py-1.5 border-2 border-yellow-300/80 bg-[#0f172a] text-yellow-300 text-[10px] uppercase">
              ★ 3 NOCHES DE COMPETENCIA ★
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold uppercase text-white tracking-wider font-['Silkscreen',monospace] drop-shadow-[0_4px_0_#070b14]">
              CRONOGRAMA DE BATALLAS
            </h2>
            <p className="text-[#8ea4c7] text-xs max-w-xl font-mono leading-relaxed">
              * Horario oficial para la comunidad estudiantil. Transmision en vivo por Facebook Live y Discord.
            </p>
          </div>

          {/* Filter Pills (Undertale Menu Style) */}
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((btn) => {
              const isSelected = selectedDay === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setSelectedDay(btn.id)}
                  className={`px-3.5 py-2.5 border-2 text-[10px] uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-yellow-300 bg-yellow-300 text-black font-bold'
                      : 'border-[#253759] bg-[#0d1629] text-[#8ea4c7] hover:border-[#60a5fa] hover:text-slate-100'
                  }`}
                >
                  <span>[ {btn.label} ]</span>
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
                className={`p-6 border-4 bg-[#0d1629] flex flex-col justify-between transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.4)] ${
                  isHovered ? 'border-yellow-300 bg-[#121c33]' : 'border-[#2d4268]'
                }`}
              >
                <div className="space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-center justify-between text-[10px] pb-3 border-b-2 border-[#1c2a47]">
                    <span className="text-yellow-300 font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-yellow-300" />
                      <span>{item.dayLabel.toUpperCase()}</span>
                    </span>
                    <span className="px-2 py-0.5 border border-[#2b3e62] bg-[#080d1a] text-slate-100 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-yellow-300" />
                      <span>{item.time}</span>
                    </span>
                  </div>

                  {/* Game & Stage Title */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white uppercase font-['Silkscreen',monospace] tracking-wider">
                      {item.gameName}
                    </h3>
                    <p className="text-[10px] text-slate-300 font-mono leading-relaxed">
                      * {item.stageTitle}
                    </p>
                  </div>
                </div>

                {/* Footer: Stream Link */}
                <div className="pt-4 mt-6 border-t-2 border-[#1c2a47] flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 text-[#8ea4c7]">
                    <Video className="w-3.5 h-3.5 text-red-500" />
                    <span>{item.streamLabel}</span>
                  </div>

                  <a
                    href={CONTACT_INFO.streamFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 px-3 py-1.5 border-2 border-[#3b598b] hover:border-yellow-300 bg-[#142340] hover:bg-[#1b2f56] hover:text-yellow-300 text-slate-100 text-[9px] uppercase transition-colors"
                  >
                    <span>[ TRANSMISION ]</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stream Banner (Undertale Dialogue Box) */}
        <div className="mt-12 p-6 sm:p-8 border-4 border-[#2d4268] bg-[#0d1629] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-red-500 bg-red-950/40 flex items-center justify-center text-red-500 shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-white uppercase font-['Silkscreen',monospace]">
                * TRANSMISION OFICIAL EN FACEBOOK LIVE & DISCORD
              </h4>
              <p className="text-[10px] text-[#8ea4c7] font-mono">
                Casters en vivo, relatos de las finales y salas de coordinacion para los equipos.
              </p>
            </div>
          </div>

          <a
            href={CONTACT_INFO.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 border-2 border-yellow-300 bg-yellow-300 hover:bg-white text-black font-bold text-xs uppercase text-center transition-colors shrink-0"
          >
            [ SERVIDOR DE DISCORD ]
          </a>
        </div>

      </div>
    </section>
  );
}
