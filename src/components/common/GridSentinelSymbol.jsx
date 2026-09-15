import React from 'react';

/**
 * GridSentinel Custom Project Symbol
 * Official emblem: Hexagonal shield encasing an interconnected smart-grid neural node matrix.
 * Replaces generic energy lightning symbols with an authentic, distinctive system identity.
 */
export default function GridSentinelSymbol({
  size = 28,
  glow = true,
  animate = false,
  className = '',
  style = {}
}) {
  const gradientId = `gs-grad-${Math.random().toString(36).substr(2, 6)}`;
  const filterId = `gs-glow-${Math.random().toString(36).substr(2, 6)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: glow ? `drop-shadow(0 0 8px rgba(59, 130, 246, 0.45))` : 'none',
        ...style
      }}
    >
      <defs>
        {/* Gradient for shield border & node tracks */}
        <linearGradient id={gradientId} x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        {/* Glow filter */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Sentinel Outer Shield Contour */}
      <path
        d="M50 8 L84 22 C84 55 68 78 50 92 C32 78 16 55 16 22 Z"
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(15, 23, 42, 0.85)"
      />

      {/* Inner Guard Trim */}
      <path
        d="M50 16 L76 27 C76 52 64 71 50 82 C36 71 24 52 24 27 Z"
        stroke="rgba(56, 189, 248, 0.25)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Smart Grid Interconnect Lines (Hexagonal Bus Matrix) */}
      <g stroke={`url(#${gradientId})`} strokeWidth="2" strokeOpacity="0.85">
        {/* Outer hexagonal node links */}
        <line x1="50" y1="28" x2="68" y2="40" />
        <line x1="68" y1="40" x2="68" y2="60" />
        <line x1="68" y1="60" x2="50" y2="72" />
        <line x1="50" y1="72" x2="32" y2="60" />
        <line x1="32" y1="60" x2="32" y2="40" />
        <line x1="32" y1="40" x2="50" y2="28" />

        {/* Radial cross-ties to Sentinel Central Node */}
        <line x1="50" y1="50" x2="50" y2="28" strokeDasharray={animate ? "3 2" : "none"} />
        <line x1="50" y1="50" x2="68" y2="40" strokeDasharray={animate ? "3 2" : "none"} />
        <line x1="50" y1="50" x2="68" y2="60" strokeDasharray={animate ? "3 2" : "none"} />
        <line x1="50" y1="50" x2="50" y2="72" strokeDasharray={animate ? "3 2" : "none"} />
        <line x1="50" y1="50" x2="32" y2="60" strokeDasharray={animate ? "3 2" : "none"} />
        <line x1="50" y1="50" x2="32" y2="40" strokeDasharray={animate ? "3 2" : "none"} />

        {/* Star-grid triangulation */}
        <line x1="50" y1="28" x2="68" y2="60" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="68" y1="40" x2="32" y2="60" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="68" y1="60" x2="32" y2="40" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="50" y1="72" x2="32" y2="40" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="50" y1="72" x2="68" y2="40" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="50" y1="28" x2="32" y2="60" strokeOpacity="0.35" strokeWidth="1" />
      </g>

      {/* Grid Substation Nodes */}
      <circle cx="50" cy="28" r="3.2" fill="#38bdf8" />
      <circle cx="68" cy="40" r="3.2" fill="#38bdf8" />
      <circle cx="68" cy="60" r="3.2" fill="#38bdf8" />
      <circle cx="50" cy="72" r="3.2" fill="#38bdf8" />
      <circle cx="32" cy="60" r="3.2" fill="#38bdf8" />
      <circle cx="32" cy="40" r="3.2" fill="#38bdf8" />

      {/* Sentinel Core Node (Heart of AI Intelligence) */}
      <circle cx="50" cy="50" r="6" fill="#3b82f6" />
      <circle cx="50" cy="50" r="3" fill="#ffffff" />
      
      {/* Pulse Beacon Effect */}
      <circle
        cx="50"
        cy="50"
        r="9"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeOpacity="0.6"
        fill="none"
      />
    </svg>
  );
}
