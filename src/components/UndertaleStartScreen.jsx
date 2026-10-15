import React, { useState, useEffect, useRef } from 'react';

// Authentic Undertale 8-Bit Web Audio API Sound Synthesizer
const play8BitSound = (type) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'text') {
      // Classic Undertale text dialog chirp (square wave blip)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140 + Math.random() * 40, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'select') {
      // Undertale menu beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'start') {
      // Undertale Soul / Level Start Chime
      const notes = [440, 659.25, 880, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.36);
      });
    }
  } catch {
    // AudioContext blocked or unsupported
  }
};

// Generate fixed pixel stars to avoid hydration mismatch
const STATIC_STARS = [
  { top: '6%', left: '8%', type: 'cross', delay: '0.2s', duration: '3.1s' },
  { top: '12%', left: '18%', type: 'dot', delay: '1.4s', duration: '2.5s' },
  { top: '8%', left: '32%', type: 'cross', delay: '0.8s', duration: '4.0s' },
  { top: '15%', left: '48%', type: 'diamond', delay: '2.1s', duration: '3.3s' },
  { top: '5%', left: '62%', type: 'cross', delay: '0.5s', duration: '2.8s' },
  { top: '14%', left: '78%', type: 'dot', delay: '1.7s', duration: '3.6s' },
  { top: '9%', left: '91%', type: 'cross', delay: '2.4s', duration: '3.0s' },
  { top: '22%', left: '12%', type: 'diamond', delay: '1.1s', duration: '3.5s' },
  { top: '28%', left: '26%', type: 'dot', delay: '0.3s', duration: '2.9s' },
  { top: '24%', left: '42%', type: 'cross', delay: '2.8s', duration: '4.2s' },
  { top: '30%', left: '58%', type: 'dot', delay: '1.9s', duration: '2.6s' },
  { top: '22%', left: '72%', type: 'cross', delay: '0.7s', duration: '3.4s' },
  { top: '27%', left: '86%', type: 'diamond', delay: '1.5s', duration: '3.8s' },
  { top: '36%', left: '6%', type: 'dot', delay: '2.0s', duration: '2.7s' },
  { top: '40%', left: '19%', type: 'cross', delay: '0.9s', duration: '3.7s' },
  { top: '35%', left: '35%', type: 'diamond', delay: '1.8s', duration: '3.2s' },
  { top: '38%', left: '65%', type: 'dot', delay: '0.4s', duration: '2.8s' },
  { top: '34%', left: '82%', type: 'cross', delay: '2.2s', duration: '4.1s' },
  { top: '42%', left: '93%', type: 'dot', delay: '1.3s', duration: '3.0s' },
  { top: '48%', left: '14%', type: 'cross', delay: '0.6s', duration: '3.3s' },
  { top: '46%', left: '88%', type: 'diamond', delay: '2.5s', duration: '3.5s' },
];

export default function UndertaleStartScreen({ onEnterGame, initialName = '' }) {
  const [gamerTag, setGamerTag] = useState(initialName || '');
  const [isHoveringPlay, setIsHoveringPlay] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null); // 'direct', 'exit'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value.toUpperCase().slice(0, 14);
    setGamerTag(val);
    play8BitSound('text');
  };

  const handleConfirm = () => {
    if (!gamerTag.trim()) {
      play8BitSound('select');
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      return;
    }

    const name = gamerTag.trim();
    play8BitSound('start');
    setWelcomeName(name);
    setShowWelcome(true);

    // Save GamerTag to localStorage
    try {
      localStorage.setItem('compu_league_gamertag', name);
    } catch {
      // Storage unavailable
    }

    // Show black welcome screen, then enter real page
    setTimeout(() => {
      onEnterGame(name);
    }, 2000);
  };

  const handleExit = () => {
    play8BitSound('select');
    
    // Method 1: Universal Chromium / Edge / Chrome opener trick to allow window.close()
    try {
      window.open('', '_self', '');
      window.close();
    } catch {
      // Ignored
    }

    // Method 2: Standard close
    try {
      window.close();
    } catch {
      // Ignored
    }

    // Method 3: Top frame close
    try {
      if (window.top) {
        window.top.close();
      }
    } catch {
      // Ignored
    }

    // Method 4: If browser strictly prevents tab closure, redirect to about:blank
    setTimeout(() => {
      try {
        window.location.href = "about:blank";
      } catch {
        // Ignored
      }
    }, 150);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  if (showWelcome) {
    const cleanWelcomeName = (welcomeName || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return (
      <div className="h-screen w-screen bg-black text-white font-['Press_Start_2P',monospace] flex flex-col items-center justify-center text-center p-6 select-none animate-fadeIn">
        <div className="space-y-6 max-w-xl flex flex-col items-center justify-center">
          {/* Beating Red Soul Heart */}
          <div className="w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 16 16" width="32" height="32" className="animate-heartbeat" style={{ shapeRendering: 'crispEdges' }}>
              <path 
                fill="#FF0000" 
                d="M 3 2 H 7 V 3 H 9 V 2 H 13 V 7 H 12 V 9 H 11 V 11 H 10 V 12 H 9 V 13 H 7 V 12 H 6 V 11 H 5 V 9 H 4 V 7 H 3 Z" 
              />
              <path fill="#FFAAAA" d="M 4 3 H 6 V 4 H 4 Z" opacity="0.6" />
            </svg>
          </div>

          <h1 className="text-base sm:text-xl lg:text-2xl text-white font-['Press_Start_2P',monospace] uppercase tracking-widest leading-relaxed">
            BIENVENIDO {cleanWelcomeName}
          </h1>

          <p className="text-[10px] sm:text-xs text-yellow-400 font-['Press_Start_2P',monospace] tracking-widest uppercase animate-pulse">
            * Cargando el torneo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen min-h-screen h-[100dvh] w-screen w-full overflow-hidden bg-black text-white font-['Press_Start_2P',monospace] select-none flex flex-col justify-between items-center">
      
      {/* ========================================================= */}
      {/* 1. TWINKLING PIXEL STARS SKY                              */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {STATIC_STARS.map((s, idx) => (
          <div
            key={idx}
            className="absolute transition-opacity"
            style={{
              top: s.top,
              left: s.left,
              animation: `star-twinkle ${s.duration} ease-in-out infinite`,
              animationDelay: s.delay,
            }}
          >
            {s.type === 'cross' ? (
              // 5-pixel cross star
              <svg width="10" height="10" viewBox="0 0 5 5" className="shape-crisp">
                <rect x="2" y="0" width="1" height="5" fill="#C2E9FB" />
                <rect x="0" y="2" width="5" height="1" fill="#C2E9FB" />
                <rect x="2" y="2" width="1" height="1" fill="#FFFFFF" />
              </svg>
            ) : s.type === 'diamond' ? (
              // Diamond sparkle
              <svg width="8" height="8" viewBox="0 0 4 4" className="shape-crisp">
                <rect x="1" y="0" width="2" height="1" fill="#FFFFFF" />
                <rect x="0" y="1" width="4" height="2" fill="#9AE6B4" />
                <rect x="1" y="3" width="2" height="1" fill="#FFFFFF" />
              </svg>
            ) : (
              // Single pixel dot
              <div className="w-1.5 h-1.5 bg-white opacity-80" />
            )}
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 2. SILHOUETTE SKYLINE ("NEW HOME" CASTLE AT BOTTOM)      */}
      {/* ========================================================= */}
      <div className="absolute bottom-0 inset-x-0 w-full pointer-events-none z-10 flex flex-col justify-end">
        <svg 
          viewBox="0 0 1200 480" 
          preserveAspectRatio="none" 
          className="w-full h-64 sm:h-80 lg:h-[380px] xl:h-[440px] drop-shadow-[0_-15px_30px_rgba(40,20,80,0.6)]"
          style={{ shapeRendering: 'crispEdges' }}
        >
          {/* Layer 1: Distant Castle Spires & Towers (Deep Purple #120924) */}
          <path 
            fill="#120924" 
            d="
              M 0 480 
              V 320 H 40 V 300 H 60 V 320 H 90 V 280 H 110 V 260 H 130 V 280 H 150 V 320 
              H 220 V 290 H 250 V 270 H 280 V 290 H 310 V 340 
              H 450 V 220 H 470 V 190 H 510 V 220 H 530 V 340 
              H 670 V 220 H 690 V 190 H 730 V 220 H 750 V 340 
              H 890 V 290 H 920 V 270 H 950 V 290 H 980 V 320 
              H 1050 V 280 H 1070 V 260 H 1090 V 280 H 1110 V 320 H 1140 V 300 H 1160 V 320 H 1200 V 480 Z
            " 
          />

          {/* Layer 2: Midground Gothic City & Battlements (#1C103A) */}
          <path 
            fill="#1C103A" 
            d="
              M 0 480 
              V 360 H 30 V 340 H 50 V 360 H 80 V 340 H 100 V 360 H 140 
              V 320 H 170 V 300 H 200 V 320 H 230 V 370 
              H 360 V 330 H 380 V 310 H 400 V 330 H 430 V 380 
              H 770 V 330 H 800 V 310 H 820 V 330 H 840 V 370 
              H 970 V 320 H 1000 V 300 H 1030 V 320 H 1060 V 360 
              H 1100 V 340 H 1120 V 360 H 1150 V 340 H 1170 V 360 H 1200 V 480 Z
            " 
          />

          {/* Layer 3: Central Grand Cathedral / Domed Palace (#28174E) */}
          {/* Main Dome base and curvature */}
          <path 
            fill="#28174E" 
            d="
              M 440 480 
              V 360 H 480 V 330 H 510 V 300 H 540 V 270 H 570 V 250 H 630 V 270 H 660 V 300 H 690 V 330 H 720 V 360 H 760 V 480 Z
            " 
          />
          {/* Dome Top Lantern Tower */}
          <rect x="580" y="200" width="40" height="50" fill="#28174E" />
          <polygon points="570,200 600,165 630,200" fill="#28174E" />
          <rect x="597" y="150" width="6" height="15" fill="#28174E" />

          {/* Glowing Windows inside Central Dome (Warm undertale purple/amber) */}
          <rect x="560" y="320" width="16" height="26" fill="#3D2374" />
          <rect x="592" y="320" width="16" height="26" fill="#58359E" />
          <rect x="624" y="320" width="16" height="26" fill="#3D2374" />
          <rect x="594" y="220" width="12" height="16" fill="#7547C9" />

          {/* Left Watchtower with square crenellations */}
          <rect x="230" y="270" width="80" height="210" fill="#221342" />
          <rect x="230" y="250" width="16" height="20" fill="#221342" />
          <rect x="262" y="250" width="16" height="20" fill="#221342" />
          <rect x="294" y="250" width="16" height="20" fill="#221342" />
          <rect x="264" y="310" width="12" height="30" fill="#0C0517" />
          <rect x="264" y="370" width="12" height="30" fill="#0C0517" />

          {/* Right Watchtower with square crenellations */}
          <rect x="890" y="270" width="80" height="210" fill="#221342" />
          <rect x="890" y="250" width="16" height="20" fill="#221342" />
          <rect x="922" y="250" width="16" height="20" fill="#221342" />
          <rect x="954" y="250" width="16" height="20" fill="#221342" />
          <rect x="924" y="310" width="12" height="30" fill="#0C0517" />
          <rect x="924" y="370" width="12" height="30" fill="#0C0517" />

          {/* Layer 4: Foreground Wall with Battlements (#1D0E3A) */}
          <path 
            fill="#1D0E3A" 
            d="
              M 0 480 
              V 420 
              H 20 V 400 H 40 V 420 H 60 V 400 H 80 V 420 H 100 V 400 H 120 V 420 H 140 
              H 160 V 400 H 180 V 420 H 200 V 400 H 220 V 420 H 240 V 400 H 260 V 420 H 280
              H 300 V 400 H 320 V 420 H 340 V 400 H 360 V 420 H 380 V 400 H 400 V 420 H 420
              H 440 V 400 H 460 V 420 H 480 V 400 H 500 V 420 H 520 V 400 H 540 V 420 H 560
              H 580 V 400 H 600 V 420 H 620 V 400 H 640 V 420 H 660 V 400 H 680 V 420 H 700
              H 720 V 400 H 740 V 420 H 760 V 400 H 780 V 420 H 800 V 400 H 820 V 420 H 840
              H 860 V 400 H 880 V 420 H 900 V 400 H 920 V 420 H 940 V 400 H 960 V 420 H 980
              H 1000 V 400 H 1020 V 420 H 1040 V 400 H 1060 V 420 H 1080 V 400 H 1100 V 420 H 1120
              H 1140 V 400 H 1160 V 420 H 1180 V 400 H 1200 V 480 Z
            " 
          />
        </svg>
      </div>


      {/* ========================================================= */}
      {/* 3. MAIN CENTER: UNDERTALE TITLE & "NAME THE PLAYER"       */}
      {/* ========================================================= */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full text-center py-4 sm:py-6 my-auto">
        
        {/* LOGO: "COMPU LEAGUE" (Undertale Font Style) WITH PIXEL ART EMBLEM */}
        <div className="text-center mb-5 sm:mb-7 w-full flex flex-col items-center justify-center">
          {/* Emblem Pixel Logo (Larger) */}
          <div className="mb-3 sm:mb-4">
            <img 
              src="/assets/buho_pixel_start.png" 
              alt="Compu League E-Sports" 
              className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-60 lg:h-60 object-contain animate-float mx-auto drop-shadow-[0_4px_14px_rgba(0,0,0,0.8)]"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <div className="text-center mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white font-['Silkscreen',monospace] font-bold tracking-wider leading-tight drop-shadow-[0_4px_0_#333] text-center select-none">
              COMPU LEAGUE
            </h1>
          </div>

          {/* Subtitle in pixel font */}
          <div className="flex items-center justify-center mt-2.5 sm:mt-3 text-xs sm:text-sm text-yellow-400 tracking-[0.25em] uppercase text-center font-['Press_Start_2P',monospace]">
            <span>E-SPORTS 2026</span>
          </div>
        </div>

        {/* PROMPT: INTRODUCE TU NOMBRE (BLANCO) */}
        <div className="w-full text-center space-y-4 mb-7 sm:mb-9 flex flex-col items-center justify-center">
          <p className="text-sm sm:text-base text-white tracking-[0.25em] uppercase text-center">
            INTRODUCE TU NOMBRE
          </p>

          {/* PIXEL INPUT BOX (GRIS) */}
          <div className={`relative mx-auto w-full max-w-sm sm:max-w-md transition-transform ${shakeInput ? 'animate-shake' : ''}`}>
            
            <div className="relative bg-black border-4 border-zinc-400 p-3.5 sm:p-4 flex items-center justify-center shadow-[0_0_0_3px_#000000,0_0_20px_rgba(160,160,160,0.15)]">
              {/* Pulsing Red Heart Cursor Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 16 16" width="18" height="18" className="animate-heartbeat" style={{ shapeRendering: 'crispEdges' }}>
                  <path 
                    fill="#FF0000" 
                    d="M 3 2 H 7 V 3 H 9 V 2 H 13 V 7 H 12 V 9 H 11 V 11 H 10 V 12 H 9 V 13 H 7 V 12 H 6 V 11 H 5 V 9 H 4 V 7 H 3 Z" 
                  />
                  <path fill="#FFAAAA" d="M 4 3 H 6 V 4 H 4 Z" opacity="0.6" />
                </svg>
              </div>

              <input
                ref={inputRef}
                id="gamerTagInput"
                name="gamerTag"
                type="text"
                value={gamerTag}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="TU NOMBRE"
                maxLength={14}
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-transparent text-center text-zinc-400 px-10 font-['Press_Start_2P',monospace] text-base sm:text-xl tracking-widest uppercase outline-none placeholder:text-zinc-600 focus:placeholder-transparent cursor-text"
              />
            </div>

            {/* Error Message when empty */}
            {shakeInput && (
              <p className="text-xs text-red-500 tracking-wider mt-2.5 animate-pulse text-center">
                * Debes escribir un nombre.
              </p>
            )}
          </div>
        </div>

        {/* ======================================================= */}
        {/* BUTTONS: [ JUGAR ] & [ SALIR ] (Undertale Menu Style)   */}
        {/* ======================================================= */}
        <div className="mt-2 sm:mt-4 flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
          <button
            type="button"
            onClick={handleConfirm}
            onMouseEnter={() => {
              setIsHoveringPlay(true);
              play8BitSound('select');
            }}
            onMouseLeave={() => setIsHoveringPlay(false)}
            className="group relative inline-flex items-center justify-center px-6 py-2.5 sm:py-3 cursor-pointer transition-colors outline-none"
          >
            {/* Red Heart jumps next to [ JUGAR ] when hovering */}
            <div 
              className={`absolute -left-7 sm:-left-9 top-1/2 -translate-y-1/2 w-5 h-5 transition-opacity duration-150 ${
                isHoveringPlay ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
              }`}
            >
              <svg viewBox="0 0 16 16" width="20" height="20" style={{ shapeRendering: 'crispEdges' }}>
                <path 
                  fill="#FF0000" 
                  d="M 3 2 H 7 V 3 H 9 V 2 H 13 V 7 H 12 V 9 H 11 V 11 H 10 V 12 H 9 V 13 H 7 V 12 H 6 V 11 H 5 V 9 H 4 V 7 H 3 Z" 
                />
              </svg>
            </div>

            {/* Button text: turns yellow on hover just like Undertale */}
            <span className={`text-lg sm:text-2xl tracking-[0.2em] uppercase transition-colors text-center ${
              isHoveringPlay ? 'text-yellow-300' : 'text-white'
            }`}>
              [ JUGAR ]
            </span>
          </button>

          {/* Opcion: Salir (Cierra la pagina o pestaña) */}
          <button
            type="button"
            onClick={handleExit}
            onMouseEnter={() => {
              setHoveredOption('exit');
              play8BitSound('select');
            }}
            onMouseLeave={() => setHoveredOption(null)}
            className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 cursor-pointer transition-colors outline-none"
          >
            <span className={`text-red-500 text-xs sm:text-sm transition-opacity duration-150 ${
              hoveredOption === 'exit' ? 'opacity-100' : 'opacity-0'
            }`}>
              ♥
            </span>
            <span className={`text-xs sm:text-sm tracking-wider uppercase transition-colors text-center ${
              hoveredOption === 'exit' ? 'text-yellow-300' : 'text-zinc-400 hover:text-white'
            }`}>
              [ SALIR ]
            </span>
          </button>
        </div>

      </main>

      {/* ========================================================= */}
      {/* 5. BOTTOM QUOTE & DETERMINATION                           */}
      {/* ========================================================= */}
      <footer className="relative z-20 pb-2.5 sm:pb-3.5 px-4 text-center w-full flex flex-col items-center justify-center space-y-1.5">

        <p className="text-[9px] sm:text-[10px] text-purple-300/70 tracking-[0.2em] text-center font-['Press_Start_2P',monospace]">
          VALORANT 5v5 • FREE FIRE • FORTNITE • CLASH ROYALE
        </p>
      </footer>

      {/* ========================================================= */}
      {/* 6. SOUL FLASH TRANSITION OVERLAY                          */}
      {/* ========================================================= */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-700 animate-soul-flash" />
      )}

    </div>
  );
}
