export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#060b13]">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 dark:opacity-10 animate-pulse"
          style={{
            background: "radial-gradient(circle, #e11d48, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 dark:opacity-10 animate-pulse"
          style={{
            background: "radial-gradient(circle, #f97316, transparent 70%)",
            filter: "blur(60px)",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Loader content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo mark + spinning ring */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Outer spinning gradient ring */}
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              background:
                "conic-gradient(from 0deg, #e11d48, #f97316, #e11d48 80%, transparent 100%)",
              padding: "3px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          {/* Inner circle with logo letter */}
          <div className="w-16 h-16 rounded-full bg-white dark:bg-[#060b13] border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-lg z-10">
            <span className="text-2xl font-black text-gray-900 dark:text-white select-none">
              A<span className="text-red-600">G</span>
            </span>
          </div>
        </div>

        {/* Pulsing dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-red-500 dark:bg-rose-500"
              style={{
                animation: "bounce 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Text */}
        <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 tracking-widest uppercase">
          Loading…
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
