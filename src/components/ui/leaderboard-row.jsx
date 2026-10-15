import React from 'react';
import { Trophy, Flame, Skull, ShieldCheck, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export function RankBadge({ rank }) {
  if (rank === 1) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-amber-400 text-black font-mono text-xs font-black shadow-sm">
        <Trophy className="w-3.5 h-3.5 text-black" />
        <span>#1 TOP</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs font-bold">
        <span>#2</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-zinc-900 border border-amber-600/40 text-amber-500 font-mono text-xs font-bold">
        <span>#3</span>
      </div>
    );
  }
  return <span className="font-mono text-xs text-zinc-500 font-semibold">#{rank}</span>;
}

export function LeaderboardRow({
  rank,
  teamName,
  captain,
  kills,
  isWinner,
  status,
  isLive = false,
  index = 0,
}) {
  return (
    <div
      className={cn(
        'group relative flex items-center justify-between p-3.5 rounded-none border transition-colors duration-150',
        isWinner
          ? 'bg-amber-400/10 border-amber-400/50 hover:bg-amber-400/15'
          : index % 2 === 0
            ? 'bg-zinc-950/70 border-zinc-800/80 hover:bg-zinc-900/60'
            : 'bg-black/40 border-zinc-900 hover:bg-zinc-900/50'
      )}
    >
      {/* Left: Rank & Team Identity */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-16 shrink-0 flex items-center justify-start">
          <RankBadge rank={rank} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn('font-bold text-sm truncate font-sport uppercase tracking-wide', isWinner ? 'text-amber-400' : 'text-zinc-100')}>
              {teamName}
            </span>
            {isWinner && (
              <span className="shrink-0 text-[10px] uppercase font-mono font-black px-1.5 py-0.5 rounded-none bg-amber-400 text-black">
                Ganador
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-400 block truncate font-mono">
            Cap: {captain}
          </span>
        </div>
      </div>

      {/* Right: Kills & Match Status */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        {/* Kills Counter */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <Skull className="w-3.5 h-3.5 text-rose-500" />
          <span className="font-bold text-zinc-200">{kills}</span>
          <span className="text-[10px] text-zinc-500 uppercase hidden sm:inline">bajas</span>
        </div>

        {/* Status Badge */}
        <div className="text-right">
          <span
            className={cn(
              'px-2.5 py-1 rounded-none text-xs font-medium font-mono inline-flex items-center gap-1.5',
              isWinner
                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/50'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
            )}
          >
            {isWinner ? (
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <span className="w-1.5 h-1.5 bg-zinc-600" />
            )}
            <span className="truncate max-w-[130px] sm:max-w-none uppercase text-[11px]">{status}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
