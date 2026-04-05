const variants = {
  live: { bg: '#1A3A1A', text: '#4ADE80', dot: '#4ADE80' },
  hot: { bg: '#3A1A1A', text: '#F87171' },
  new: { bg: '#1A2A3A', text: '#60A5FA' },
};

export function Badge({ variant, children }) {
  const v = variants[variant];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] tracking-wider uppercase rounded-[2px]"
      style={{ background: v.bg, color: v.text, fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}
    >
      {v.dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: v.dot }}
          />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: v.dot }} />
        </span>
      )}
      {children}
    </span>
  );
}
