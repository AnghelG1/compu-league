import React, { useRef, useState } from 'react';
import { cn } from '../../lib/utils';

/**
 * Corner crosshair mark, drawn like a precision engineering or surveying mark.
 */
export const CornerCross = ({ position = 'top-left', className }) => {
  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={cn(
        'pointer-events-none absolute z-20 size-3 text-amber-400/50',
        positionClasses[position],
        className
      )}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
};

/**
 * Technical Corner Bracket (viewfinder frame)
 */
export const CornerBracket = ({ position = 'top-left', className }) => {
  const bracketPaths = {
    'top-left': 'M8 1H1v7',
    'top-right': 'M1 1h7v7',
    'bottom-left': 'M8 8H1V1',
    'bottom-right': 'M1 8h7V1',
  };

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 9 9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={cn('pointer-events-none absolute size-2 text-zinc-500/60', positionClasses[position], className)}
    >
      <path d={bracketPaths[position]} />
    </svg>
  );
};

/**
 * Interactive Spotlight Card - Zero Radii / Sharp Corners
 */
export const SpotlightCard = ({
  children,
  className,
  spotlightColor = 'rgba(245, 158, 11, 0.08)',
  showCorners = true,
  showRails = true,
  as: Component = 'div',
  ...props
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);
  };

  return (
    <Component
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative overflow-hidden rounded-none bg-[#0c0c10] border border-zinc-800 transition-all duration-200 hover:border-zinc-700',
        className
      )}
      {...props}
    >
      {/* Subtle pointer follow spotlight */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(350px circle at var(--mx, 50%) var(--my, 50%), ${spotlightColor}, transparent 65%)`,
        }}
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* 1px Hairline border rails */}
      {showRails && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-zinc-700/30 to-transparent" />
        </>
      )}

      {/* Precision corner marks */}
      {showCorners && (
        <>
          <CornerBracket position="top-left" />
          <CornerBracket position="top-right" />
          <CornerBracket position="bottom-left" />
          <CornerBracket position="bottom-right" />
        </>
      )}

      <div className="relative z-10">{children}</div>
    </Component>
  );
};
