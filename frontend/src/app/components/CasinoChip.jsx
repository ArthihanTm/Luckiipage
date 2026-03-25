const chipColors = {
  1: { bg: '#E8E0D0', border: '#B0A890', text: '#1A2119' },
  5: { bg: '#8B1A1A', border: '#6B1414', text: '#E8E0D0' },
  25: { bg: '#1A6B1A', border: '#104A10', text: '#E8E0D0' },
  100: { bg: '#1A1A1A', border: '#444', text: '#C8A84B' },
  500: { bg: '#C8A84B', border: '#9A7A2A', text: '#1A2119' },
};

export function CasinoChip({ value, selected = false, onClick, size = 48 }) {
  const colors = chipColors[value] || chipColors[1];
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center rounded-full transition-transform"
      style={{
        width: size,
        height: size,
        background: colors.bg,
        border: `3px solid ${colors.border}`,
        boxShadow: selected ? '0 0 0 2px #C8A84B' : '0 2px 4px rgba(0,0,0,0.3)',
        transform: selected ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: size - 12,
          height: size - 12,
          border: `1.5px dashed ${colors.border}`,
        }}
      />
      <span
        className="relative z-10"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          fontSize: size < 40 ? 10 : 12,
          color: colors.text,
        }}
      >
        {value}
      </span>
    </button>
  );
}
