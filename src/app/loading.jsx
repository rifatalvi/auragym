export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fafaf8] dark:bg-[#0c0908] transition-colors duration-500 overflow-hidden">

      {/* Chalk-dust texture / ambient glow, tuned to the logo's maroon, not generic red-orange */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full opacity-[0.07] dark:opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, #7a0e0e, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Faint platform lines, grounds the mark in "gym floor" rather than floating in space */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #1a1a1a 0px, #1a1a1a 1px, transparent 1px, transparent 64px)",
          }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-9 z-10">

        {/* Hand-drawn monogram, traced like chalk script rather than pulsing in a box */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 2px 18px rgba(122,14,14,0.18))" }}
          >
            <defs>
              <linearGradient id="strokeFade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b1414" />
                <stop offset="100%" stopColor="#5c0a0a" />
              </linearGradient>
            </defs>
            <image
              href="/logo-ag.png"
              x="0"
              y="0"
              width="500"
              height="500"
              style={{
                mixBlendMode: "normal",
              }}
              className="auragym-mark"
            />
          </svg>

          {/* Rotating chalk-ring, plate-edge motif instead of a generic spinner ring */}
          <svg
            className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] animate-[spin_2.6s_linear_infinite]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="47"
              stroke="#7a0e0e"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              strokeDasharray="6 10"
              strokeLinecap="round"
              className="dark:stroke-[#c4453a]"
            />
          </svg>
        </div>

        {/* Wordmark set in a script-leaning treatment to echo the logo's letterforms */}
        <div className="flex flex-col items-center gap-3">
          <h3
            className="text-3xl font-bold tracking-tight text-[#2a1313] dark:text-[#f1e9e4]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.01em" }}
          >
            Aura<span className="text-[#8b1414] dark:text-[#c4453a]">Gym</span>
          </h3>

          {/* Loading bar styled as a barbell being loaded, plates filling left to right */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2a1313]/30 dark:bg-[#f1e9e4]/30" />
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-3.5 h-5 rounded-[2px] bg-[#7a0e0e] dark:bg-[#c4453a]"
                style={{
                  animation: "plateLoad 1.6s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
            <span className="w-1.5 h-1.5 rounded-full bg-[#2a1313]/30 dark:bg-[#f1e9e4]/30" />
          </div>

          <p className="text-[11px] uppercase tracking-[0.25em] text-[#6b5a52] dark:text-[#9c8a82] mt-1">
            Loading your session
          </p>
        </div>
      </div>

      <style>{`
        @keyframes plateLoad {
          0%, 100% { opacity: 0.25; transform: scaleY(0.6); }
          50% { opacity: 1; transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[spin_2.6s_linear_infinite] { animation: none !important; }
          [style*="plateLoad"] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}