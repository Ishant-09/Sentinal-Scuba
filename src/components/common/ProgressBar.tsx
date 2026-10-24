import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barColor?: string;
  height?: string;
  showText?: boolean;
  glow?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
  barColor = 'bg-cyan-500',
  height = 'h-1.5',
  showText = false,
  glow = false
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center text-xs mb-1 font-mono text-slate-400">
          <span>{value} / {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${height} border border-slate-700/40 relative`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out ${barColor} ${
            glow ? 'shadow-[0_0_10px_rgba(6,182,212,0.4)]' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
