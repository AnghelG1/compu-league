import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, ExternalLink, Radio } from 'lucide-react';
import { INITIAL_SCHEDULE, CONTACT_INFO } from '../data/tournamentData';

export default function ScheduleSection() {
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setSchedule(INITIAL_SCHEDULE || []);
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
    <section id="cronograma" className="py-14 sm:py-20 bg-[#07090F] text-slate-100 font-sans select-none border-b-4 border-black relative overflow-hidden">
      
      {/* Background Cyber Grid */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#FFE600 1px, transparent 1px), linear-gradient(90deg, #FFE600 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="bg-[#0B101A] border-4 border-black p-5 sm:p-6 mb-8 shadow-brutal-black">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 bg-black text-[#FFE600] border-2 border-[#FFE600] font-pixel text-[9px] uppercase shadow-brutal-black">
                ★ 3 NOCHES DE COMPETENCIA EN VIVO ★
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-wide font-display drop-shadow-[2px_2px_0px_#000]">
                CRONOGRAMA <span className="text-[#FFE600]">// HORARIOS OFICIALES</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-cyber leading-relaxed">
                Horario oficial para la comunidad universitaria. Transmisión en directo con casters y salas oficiales de partida.
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
                    className={`btn-arcade-press font-pixel text-[9px] sm:text-[10px] px-3.5 py-2.5 border-2 border-black uppercase font-bold cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFE600] text-black shadow-brutal-yellow font-black'
                        : 'bg-black text-slate-400 hover:text-white shadow-brutal-black'
                    }`}
                  >
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-[#0A0E17] border-4 border-black p-5 shadow-brutal-black flex flex-col justify-between transition-all duration-150"
              >
                <div className="space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-center justify-between text-xs pb-3 border-b-2 border-black font-pixel text-[8px] sm:text-[9px]">
                    <span className="text-[#FFE600] font-bold flex items-center gap-1.5 uppercase">
                      <Calendar className="w-3.5 h-3.5 text-[#FFE600]" />
                      <span>{item.dayLabel.toUpperCase()}</span>
                    </span>
                    <span className="px-2 py-0.5 bg-black border border-white/20 text-white font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FFE600]" />
                      <span>{item.time}</span>
                    </span>
                  </div>

                  {/* Game & Stage Title */}
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-display tracking-wide drop-shadow-[1px_1px_0px_#000]">
                      {item.gameName}
                    </h3>
                    <p className="text-xs text-slate-300 font-cyber leading-relaxed">
                      {item.stageTitle}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t-2 border-black flex items-center justify-between font-pixel text-[8px]">
                  <span className="text-[#10B981] flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse text-[#10B981]" />
                    <span>EN VIVO POR STREAM</span>
                  </span>
                  <span className="bg-black text-slate-400 border border-white/20 px-2 py-0.5">
                    {item.status || 'PROGRAMADO'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
