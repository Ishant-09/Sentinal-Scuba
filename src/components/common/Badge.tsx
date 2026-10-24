import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'purple' | 'red' | 'slate' | 'amber' | 'emerald';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const variantStyles = {
  cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50 hover:bg-cyan-950/80',
  blue: 'bg-blue-950/60 text-blue-300 border-blue-800/50 hover:bg-blue-950/80',
  purple: 'bg-purple-950/60 text-purple-300 border-purple-800/50 hover:bg-purple-950/80',
  red: 'bg-rose-950/60 text-rose-300 border-rose-800/50 hover:bg-rose-950/80',
  slate: 'bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-slate-800/80',
  amber: 'bg-amber-950/60 text-amber-300 border-amber-800/50 hover:bg-amber-950/80',
  emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50 hover:bg-emerald-950/80'
};

const dotColors = {
  cyan: 'bg-cyan-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  red: 'bg-rose-400',
  slate: 'bg-slate-400',
  amber: 'bg-amber-400',
  emerald: 'bg-emerald-400'
};

const sizeStyles = {
  xs: 'px-1.5 py-0.5 text-[10px] tracking-wider font-semibold',
  sm: 'px-2 py-0.5 text-xs font-medium',
  md: 'px-2.5 py-1 text-xs font-semibold'
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'xs',
  className = '',
  dot = false
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border uppercase transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />}
      {children}
    </span>
  );
};
