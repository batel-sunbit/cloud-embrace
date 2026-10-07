export function Branch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden>
      <path d="M5 40 C 50 30, 100 35, 195 20" />
      {[30, 60, 90, 120, 150, 175].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${38 - i * 3} q 6 -14 16 -16 q -4 12 -16 16`} />
          <path d={`M${x + 8} ${37 - i * 3} q 8 10 18 9 q -8 -9 -18 -9`} />
        </g>
      ))}
    </svg>
  );
}
