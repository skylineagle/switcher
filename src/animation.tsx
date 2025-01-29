import { COLORS } from "./consts";

export const Animation = () => {
  return (
    <div className="relative size-full -z-10 overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        <div className="absolute inset-0" />
      </div>

      <svg
        className="w-full h-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        aria-labelledby="analytics-chart-title"
      >
        <title id="analytics-chart-title">Analytics Chart</title>
        <path
          className="animate-chart-line-1"
          d="M0,150 Q100,100 200,140 T400,120"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          className="animate-chart-line-2"
          d="M0,100 Q100,150 200,90 T400,110"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2673E6" />
            <stop offset="100%" stopColor="#2673E6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#af57db" />
            <stop offset="100%" stopColor="#af57db" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex items-center justify-around">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-pulse-dot"
            style={{
              backgroundColor: COLORS[i % COLORS.length],
              animationDelay: `${i * 300}ms`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
};
