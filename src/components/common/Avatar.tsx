import React from 'react';

interface AvatarProps {
  seed: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
  isOnline?: boolean;
  statusColor?: string;
  alt?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-14 h-14 text-lg'
};

const statusSizeMap = {
  xs: 'w-1.5 h-1.5 ring-1',
  sm: 'w-2 h-2 ring-1.5',
  md: 'w-2.5 h-2.5 ring-2',
  lg: 'w-3 h-3 ring-2',
  xl: 'w-3.5 h-3.5 ring-2'
};

export const Avatar: React.FC<AvatarProps> = ({
  seed,
  size = 'md',
  className = '',
  showStatus = false,
  isOnline = true,
  statusColor = 'bg-cyan-400',
  alt = 'Avatar'
}) => {
  const normSeed = seed.toLowerCase();

  // Distinct anime avatar SVG presets tailored to the character archetypes
  const renderAnimeSvg = () => {
    switch (normSeed) {
      case 'ishant':
        // Rune Architect - Cyan-tinted spiky/styled hair, focused anime eyes, glowing runic monocle/earpiece
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <rect width="64" height="64" fill="#0d1f38" />
            {/* Skin */}
            <circle cx="32" cy="34" r="16" fill="#fde2d0" />
            <path d="M24 38c0 4 3.5 8 8 8s8-4 8-8" fill="#fad2bc" />
            {/* Eyes */}
            <ellipse cx="27" cy="33" rx="2.5" ry="3.5" fill="#0f172a" />
            <circle cx="28" cy="32" r="1" fill="#ffffff" />
            <ellipse cx="37" cy="33" rx="2.5" ry="3.5" fill="#06b6d4" />
            <circle cx="38" cy="32" r="1" fill="#ffffff" />
            {/* Eyebrows */}
            <path d="M24 28l4-1.5M36 26.5l4 1.5" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" />
            {/* Anime Hair - Sharp bangs and rune architect cyan tips */}
            <path d="M18 28c2-10 10-18 24-15 8 2 10 9 8 16-2-4-5-8-10-8-3 0-5 3-7 1-3-2-6-1-8 3-2 2-5 3-7 3z" fill="#164e63" />
            <path d="M22 24c3-5 9-9 17-7 4 1 6 5 4 10-2-3-4-5-7-4-2 0-4 3-6 2-3-1-5 0-8 3z" fill="#06b6d4" />
            {/* Bangs */}
            <path d="M22 26l3 7-1-6 4 7 1-7 4 6 1-6 3 5" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" />
            {/* Runic headset / collar */}
            <path d="M16 54c3-8 10-12 16-12s13 4 16 12" fill="#0e7490" />
            <circle cx="43" cy="34" r="3" fill="#22d3ee" fillOpacity="0.8" />
          </svg>
        );

      case 'astra':
        // Guild Master NPC Astra - Sleek platinum/silver hair with celestial cyan hairpin & mentor grace
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <rect width="64" height="64" fill="#131b2e" />
            {/* Skin */}
            <circle cx="32" cy="34" r="15" fill="#fff1e6" />
            {/* Eyes */}
            <ellipse cx="27" cy="33" rx="2.8" ry="3.8" fill="#0891b2" />
            <circle cx="28" cy="31.8" r="1.1" fill="#ffffff" />
            <circle cx="26.2" cy="34.5" r="0.6" fill="#a5f3fc" />
            <ellipse cx="37" cy="33" rx="2.8" ry="3.8" fill="#0891b2" />
            <circle cx="38" cy="31.8" r="1.1" fill="#ffffff" />
            <circle cx="36.2" cy="34.5" r="0.6" fill="#a5f3fc" />
            {/* Gentle smile */}
            <path d="M29 39c1.5 1 4.5 1 6 0" stroke="#f472b6" strokeWidth="1.2" strokeLinecap="round" />
            {/* Platinum Anime Hair */}
            <path d="M16 32c1-12 11-20 24-18 9 1 12 8 11 18-2-5-6-10-12-10-4 0-7 4-10 2-4-2-7 0-9 4-2 1-3 2-4 4z" fill="#cbd5e1" />
            <path d="M20 28l4 9-2-8 5 9 1-9 5 8 2-8 3 8" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            {/* Robe & Guild Master Brooch */}
            <path d="M18 54c3-7 9-11 14-11s11 4 14 11" fill="#1e293b" />
            <circle cx="32" cy="44" r="2.5" fill="#38bdf8" />
            {/* Hairpin star */}
            <polygon points="44,20 45,23 48,24 45,25 44,28 43,25 40,24 43,23" fill="#38bdf8" />
          </svg>
        );

      case 'akira':
        // Shadow Scholar - Deep midnight navy hair, analytical wire glasses, calm gaze
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <rect width="64" height="64" fill="#091326" />
            <circle cx="32" cy="34" r="15" fill="#fae8d4" />
            {/* Eyes */}
            <ellipse cx="26" cy="33" rx="2.2" ry="3.2" fill="#1e293b" />
            <ellipse cx="38" cy="33" rx="2.2" ry="3.2" fill="#1e293b" />
            <circle cx="27" cy="32" r="0.8" fill="#fff" />
            <circle cx="39" cy="32" r="0.8" fill="#fff" />
            {/* Glasses */}
            <rect x="23" y="29.5" width="7" height="7" rx="1.5" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
            <rect x="34" y="29.5" width="7" height="7" rx="1.5" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
            <line x1="30" y1="33" x2="34" y2="33" stroke="#38bdf8" strokeWidth="1.2" />
            {/* Dark Sleek Hair */}
            <path d="M17 30c1-11 9-18 22-17 9 1 12 7 11 16-2-4-5-8-10-8-3 0-6 4-9 2-3-2-6-1-8 3-2 1-4 2-6 4z" fill="#1e293b" />
            <path d="M21 27l4 8-1-7 4 8 2-8 3 7" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            {/* Coat */}
            <path d="M16 54c3-7 9-11 16-11s13 4 16 11" fill="#0f172a" />
          </svg>
        );

      case 'mika':
        // Arcane Healer - Soft violet hair, delicate side ribbon, emerald/violet aura
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <rect width="64" height="64" fill="#1e1338" />
            <circle cx="32" cy="34" r="15" fill="#fde8e8" />
            {/* Eyes */}
            <ellipse cx="26" cy="33" rx="2.5" ry="3.5" fill="#7c3aed" />
            <circle cx="27" cy="32" r="1" fill="#fff" />
            <ellipse cx="38" cy="33" rx="2.5" ry="3.5" fill="#7c3aed" />
            <circle cx="39" cy="32" r="1" fill="#fff" />
            {/* Violet Hair */}
            <path d="M17 30c2-11 10-18 22-17 8 1 11 7 10 16-3-5-6-8-10-8-3 0-5 3-8 1-3-2-6-1-8 3-2 2-4 3-6 5z" fill="#6d28d9" />
            <path d="M20 28l4 7-2-7 4 8 2-8 4 7 1-7 3 6" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
            {/* Healer cloak */}
            <path d="M16 54c3-7 9-11 16-11s13 4 16 11" fill="#4c1d95" />
            <circle cx="32" cy="44" r="2.5" fill="#a855f7" />
          </svg>
        );

      case 'ren':
        // Blade of Logic - Fiery crimson tint / energetic anime spike hair
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <rect width="64" height="64" fill="#241014" />
            <circle cx="32" cy="34" r="15" fill="#fad6c4" />
            {/* Fierce eyes */}
            <path d="M24 32l5 2M40 32l-5 2" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="27" cy="34" rx="2.2" ry="2.8" fill="#1c1917" />
            <circle cx="28" cy="33" r="0.8" fill="#fff" />
            <ellipse cx="37" cy="34" rx="2.2" ry="2.8" fill="#1c1917" />
            <circle cx="38" cy="33" r="0.8" fill="#fff" />
            {/* Spiky hair */}
            <path d="M16 32l3-12 7 5 6-11 6 10 7-7 3 15-4-3-4 5-5-5-5 5-5-5z" fill="#991b1b" />
            <path d="M20 25l4-8 5 4 4-8 4 7 5-5 2 10" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 54c3-7 9-11 16-11s13 4 16 11" fill="#450a0a" />
          </svg>
        );

      case 'kai':
        // Starbound Coder - Teal hair with high collar & visor reflection
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <rect width="64" height="64" fill="#06241e" />
            <circle cx="32" cy="34" r="15" fill="#fed7aa" />
            <ellipse cx="27" cy="33" rx="2.5" ry="3.5" fill="#047857" />
            <circle cx="28" cy="32" r="1" fill="#fff" />
            <ellipse cx="37" cy="33" rx="2.5" ry="3.5" fill="#047857" />
            <circle cx="38" cy="32" r="1" fill="#fff" />
            <path d="M17 32c1-11 9-18 22-17 8 1 11 7 10 16-3-5-6-8-10-8-3 0-5 3-8 1-3-2-6-1-8 3-2 2-4 3-6 5z" fill="#065f46" />
            <path d="M21 28l4 7-2-7 4 8 2-8 3 7 1-7 3 6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 54c3-7 9-11 16-11s13 4 16 11" fill="#022c22" />
          </svg>
        );

      case 'sora':
        // Windcaller - Amber gold hair, playful expression
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <rect width="64" height="64" fill="#241e0a" />
            <circle cx="32" cy="34" r="15" fill="#fef3c7" />
            <ellipse cx="27" cy="33" rx="2.5" ry="3.5" fill="#d97706" />
            <circle cx="28" cy="32" r="1" fill="#fff" />
            <ellipse cx="37" cy="33" rx="2.5" ry="3.5" fill="#d97706" />
            <circle cx="38" cy="32" r="1" fill="#fff" />
            <path d="M17 32c1-11 9-18 22-17 8 1 11 7 10 16-3-5-6-8-10-8-3 0-5 3-8 1-3-2-6-1-8 3-2 2-4 3-6 5z" fill="#b45309" />
            <path d="M21 28l4 7-2-7 4 8 2-8 3 7 1-7 3 6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 54c3-7 9-11 16-11s13 4 16 11" fill="#451a03" />
          </svg>
        );

      case 'sp':
        // Shadow Protocol Guild emblem avatar
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <rect width="64" height="64" fill="#082f49" />
            <polygon points="32,8 52,20 52,44 32,56 12,44 12,20" stroke="#06b6d4" strokeWidth="2.5" fill="#0c4a6e" />
            <polygon points="32,16 44,25 44,39 32,48 20,39 20,25" fill="#0284c7" />
            <path d="M32 20v24M22 32h20" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      default:
        // Generic crisp stylish anime avatar
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <rect width="64" height="64" fill="#0f172a" />
            <circle cx="32" cy="34" r="15" fill="#fed7aa" />
            <ellipse cx="27" cy="33" rx="2.2" ry="3.2" fill="#0284c7" />
            <circle cx="28" cy="32" r="0.9" fill="#fff" />
            <ellipse cx="37" cy="33" rx="2.2" ry="3.2" fill="#0284c7" />
            <circle cx="38" cy="32" r="0.9" fill="#fff" />
            <path d="M17 31c1-11 9-18 22-17 8 1 11 7 10 16-3-5-6-8-10-8-3 0-5 3-8 1-3-2-6-1-8 3-2 2-4 3-6 5z" fill="#334155" />
            <path d="M21 28l4 7-2-7 4 8 2-8 3 7" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 54c3-7 9-11 16-11s13 4 16 11" fill="#1e293b" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 rounded-full select-none ${sizeMap[size]} ${className}`} title={alt}>
      <div className="w-full h-full rounded-full overflow-hidden ring-1 ring-white/10 shadow-sm transition-transform duration-200 hover:scale-105">
        {renderAnimeSvg()}
      </div>
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-[#070b13] ${
            isOnline ? statusColor : 'bg-slate-500'
          } ${statusSizeMap[size]}`}
        />
      )}
    </div>
  );
};
