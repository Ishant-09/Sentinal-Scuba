import React from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertOctagon, X, Sparkles, Headphones } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'achievement' | 'study';
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-700 bg-slate-900/95 text-slate-200';
        let icon = <Info className="w-4 h-4 text-cyan-400" />;

        if (toast.type === 'study') {
          borderClass = 'border-teal-500/60 bg-[#091522]/95 text-teal-100 shadow-[0_0_20px_rgba(20,184,166,0.3)] ring-1 ring-teal-500/30';
          icon = <Headphones className="w-4 h-4 text-teal-400 flex-shrink-0 animate-pulse" />;
        } else if (toast.type === 'success') {
          borderClass = 'border-cyan-500/50 bg-[#0c1a2e]/95 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.25)]';
          icon = <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/50 bg-[#241017]/95 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
          icon = <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />;
        } else if (toast.type === 'achievement') {
          borderClass = 'border-purple-500/50 bg-[#160f2e]/95 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
          icon = <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/50 bg-[#21160a]/95 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.25)]';
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-card border backdrop-blur-md transition-all duration-300 animate-slide-in-right ${borderClass}`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-semibold leading-tight">{toast.title}</h5>
              {toast.description && (
                <p className="text-[11px] text-slate-300/80 mt-0.5 leading-snug">{toast.description}</p>
              )}
              {toast.actionText && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    onDismiss(toast.id);
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-[11px] tracking-wide transition-all shadow-md active:scale-95"
                >
                  <Headphones className="w-3 h-3" />
                  <span>{toast.actionText}</span>
                </button>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-0.5 -mr-1 -mt-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
