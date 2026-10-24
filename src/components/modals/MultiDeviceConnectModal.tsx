import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  Copy,
  Check,
  Radio,
  ExternalLink,
  QrCode,
  Sparkles,
  Wifi,
  Users
} from 'lucide-react';
import { liveChatManager, NetworkInfo } from '../../utils/liveChatSync';

interface MultiDeviceConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedCount: number;
}

export const MultiDeviceConnectModal: React.FC<MultiDeviceConnectModalProps> = ({
  isOpen,
  onClose,
  connectedCount
}) => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    liveChatManager.getNetworkInfo().then((info) => {
      if (isMounted) {
        setNetworkInfo(info);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentHost = window.location.hostname;
  const currentPort = window.location.port || '3000';
  const effectiveUrl =
    networkInfo?.networkUrl ||
    `${window.location.protocol}//${currentHost}:${currentPort}/?tab=study_chat`;

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(effectiveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleOpenCompanionTab = () => {
    window.open(effectiveUrl, '_blank', 'width=460,height=750');
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&color=14-184-166&bgcolor=10-15-26&data=${encodeURIComponent(
    effectiveUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md bg-[#0b101c] border border-teal-500/40 rounded-2xl shadow-2xl p-5 relative animate-in zoom-in-95 duration-150 text-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-inner hover:bg-[#152033] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3.5 border-b border-[#182338]">
          <div className="w-9 h-9 rounded-xl bg-teal-950/80 border border-teal-500/50 flex items-center justify-center text-teal-400 shadow-sm">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Live Multi-Device Presentation</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping inline-block" />
                Live Sync
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Connect your smartphone or tablet to chat simultaneously in real-time
            </p>
          </div>
        </div>

        {/* Active Connected Status Bar */}
        <div className="my-3.5 p-2.5 rounded-xl bg-[#0f1728] border border-[#1b2842] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            <span className="text-slate-300 font-medium">Currently Connected:</span>
          </div>
          <span className="font-mono text-teal-300 font-bold px-2 py-0.5 rounded bg-teal-950/80 border border-teal-700/60">
            {connectedCount} {connectedCount === 1 ? 'Device' : 'Devices'} In Sync
          </span>
        </div>

        {/* QR Code Presentation Box */}
        <div className="my-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#080d17] border border-[#19263f]">
          <div className="w-48 h-48 rounded-xl overflow-hidden bg-[#0a0f1a] border-2 border-teal-500/40 p-2 flex items-center justify-center shadow-inner relative group">
            <img
              src={qrImageUrl}
              alt="Scan to join Study Chat on mobile"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                // Fallback SVG if offline
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-teal-950/10 pointer-events-none rounded-lg" />
          </div>

          <p className="text-[11px] font-mono text-teal-300/90 mt-2.5 flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan with your phone camera to join</span>
          </p>
        </div>

        {/* Copyable Network URL */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Wifi className="w-3 h-3 text-teal-400" />
            Network Device URL (Same Wi-Fi)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={effectiveUrl}
              className="flex-1 bg-[#10192a] border border-[#1c2c48] rounded-xl px-3 py-2 text-xs font-mono text-teal-200 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md flex-shrink-0"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Companion Window & Presentation Pro-Tips */}
        <div className="mt-4 pt-3.5 border-t border-[#182338] space-y-2.5">
          <div className="flex items-center justify-between">
            <button
              onClick={handleOpenCompanionTab}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1.5 transition-colors group"
            >
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              <span>Simulate 2nd device on this laptop</span>
            </button>

            <span className="text-[10px] font-mono text-slate-500">
              Host: {networkInfo?.hostIp || currentHost}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0c1424] border border-[#16233a] text-[10px] text-slate-400 leading-relaxed space-y-1">
            <div className="text-teal-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>Demo Presenter Tip:</span>
            </div>
            <p>
              Open this on your phone. You can chat as yourself or switch to another character
              (like <strong>Aviral Maurya</strong> or <strong>Eknaath Bawane</strong>) using the
              persona selector on your phone. Everything you type on your phone updates on this
              screen instantly!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
