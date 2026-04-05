const suits = {
  hearts: { symbol: '♥', color: '#8B1A1A' },
  diamonds: { symbol: '♦', color: '#8B1A1A' },
  clubs: { symbol: '♣', color: '#1a1a1a' },
  spades: { symbol: '♠', color: '#1a1a1a' },
};

const sizes = {
  sm: { w: 48, h: 68, text: 'text-sm', suit: 'text-lg' },
  md: { w: 64, h: 90, text: 'text-base', suit: 'text-xl' },
  lg: { w: 80, h: 112, text: 'text-lg', suit: 'text-2xl' },
};

export function PlayingCard({
  rank,
  suit,
  faceDown = false,
  size = 'md',
  className = '',
  style: outerStyle,
}) {
  const s = sizes[size];
  const suitInfo = suits[suit];

  if (faceDown) {
    return (
      <div
        className={`rounded-[3px] flex items-center justify-center shrink-0 ${className}`}
        style={{
          width: s.w,
          height: s.h,
          background: 'repeating-linear-gradient(45deg, #8B1A1A, #8B1A1A 2px, #6B1414 2px, #6B1414 4px)',
          border: '2px solid #C8A84B',
          boxShadow: '2px 4px 12px rgba(0,0,0,0.5)',
          ...outerStyle,
        }}
      >
        <div className="w-3 h-3 rotate-45 border border-[#C8A84B]" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-[3px] relative shrink-0 ${className}`}
      style={{
        width: s.w,
        height: s.h,
        background: '#F5F0E8',
        border: '1px solid #D0C8B8',
        boxShadow: '2px 4px 12px rgba(0,0,0,0.5)',
        ...outerStyle,
      }}
    >
      <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none" style={{ color: suitInfo.color }}>
        <span className={s.text} style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
          {rank}
        </span>
        <span className="text-xs">{suitInfo.symbol}</span>
      </div>
      <div className={`absolute inset-0 flex items-center justify-center ${s.suit}`} style={{ color: suitInfo.color }}>
        {suitInfo.symbol}
      </div>
      <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180" style={{ color: suitInfo.color }}>
        <span className={s.text} style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
          {rank}
        </span>
        <span className="text-xs">{suitInfo.symbol}</span>
      </div>
    </div>
  );
}
