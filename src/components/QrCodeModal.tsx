'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, ExternalLink, QrCode as QrIcon, Wifi, Laptop, Globe } from 'lucide-react';
import { Client } from '../lib/types';
import {
  isClientExpired,
  isClientUpcoming,
  getClientDaysLeft,
  getDaysUntilStart,
  formatDate,
  formatDateRange,
  buildClientReviewUrl
} from '../lib/data';

interface QrCodeModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
}

export default function QrCodeModal({ isOpen, client, onClose }: QrCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [funnelUrl, setFunnelUrl] = useState('');
  const [selectedBase, setSelectedBase] = useState('');
  const [networkHost, setNetworkHost] = useState('');
  const [localHost, setLocalHost] = useState('');
  const [customHost, setCustomHost] = useState('');
  const [activeHostMode, setActiveHostMode] = useState<'network' | 'local' | 'custom'>('network');

  // Detect local IP and set host options
  useEffect(() => {
    if (!isOpen || !client) return;

    if (typeof window !== 'undefined') {
      const curOrigin = window.location.origin;
      setLocalHost(curOrigin);

      // Default to current origin first
      let initialBase = curOrigin;
      setSelectedBase(initialBase);

      // Fetch network IP for mobile scanning
      fetch('/api/host-info')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.networkOrigin) {
            setNetworkHost(data.networkOrigin);
            // If user is accessing via localhost, recommend network IP for mobile scanning
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
              setSelectedBase(data.networkOrigin);
              setActiveHostMode('network');
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen, client]);

  // Re-render QR code whenever client or selectedBase changes
  useEffect(() => {
    if (!isOpen || !client || !selectedBase) return;

    const url = buildClientReviewUrl(selectedBase, client);
    setFunnelUrl(url);

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 320,
        margin: 2,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });
    }
  }, [isOpen, client, selectedBase]);

  if (!isOpen || !client) return null;

  const handleCopy = () => {
    if (!funnelUrl) return;
    navigator.clipboard.writeText(funnelUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${client.name.replace(/\s+/g, '_')}_QR_Code.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleSwitchHost = (mode: 'network' | 'local' | 'custom', customVal?: string) => {
    setActiveHostMode(mode);
    if (mode === 'network' && networkHost) {
      setSelectedBase(networkHost);
    } else if (mode === 'local' && localHost) {
      setSelectedBase(localHost);
    } else if (mode === 'custom') {
      const val = customVal !== undefined ? customVal : (customHost || localHost);
      setSelectedBase(val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-100 text-center my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition absolute top-5 right-5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-2 border border-indigo-500/20">
          <QrIcon className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white mb-0.5">
          {client.name}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Scan with any phone camera to instantly open this client&apos;s review funnel.
        </p>

        {/* QR Host Switcher (Ensures mobile phone can reach server over Wi-Fi) */}
        {networkHost && (
          <div className="mb-4 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span>QR Scan Target URL:</span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {activeHostMode === 'network' ? '📱 Mobile Wi-Fi Active' : activeHostMode === 'local' ? '💻 PC Localhost' : '🌐 Custom'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleSwitchHost('network')}
                className={`py-1.5 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition text-left ${
                  activeHostMode === 'network'
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Wifi className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Wi-Fi IP ({networkHost.replace('http://', '')})</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchHost('local')}
                className={`py-1.5 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition text-left ${
                  activeHostMode === 'local'
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">PC Localhost (3000)</span>
              </button>
            </div>
          </div>
        )}

        {/* QR Code Container */}
        <div className="inline-block p-4 rounded-3xl bg-white shadow-xl shadow-indigo-500/10 mb-3 border-4 border-slate-950">
          <canvas ref={canvasRef} className="rounded-xl w-60 h-60 mx-auto" />
        </div>

        {/* Plan Validity Status Window */}
        <div className={`mb-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border ${
          isClientUpcoming(client)
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            : isClientExpired(client)
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        }`}>
          {isClientUpcoming(client) ? (
            <>
              <span>🟡 Scheduled:</span>
              <span>Opens {formatDate(client.start_date)} (in {getDaysUntilStart(client.start_date)}d)</span>
            </>
          ) : isClientExpired(client) ? (
            <>
              <span>🔴 Expired:</span>
              <span>Ended {formatDate(client.expiry_date)}</span>
            </>
          ) : (
            <>
              <span>🟢 Active:</span>
              <span>{formatDateRange(client.start_date, client.expiry_date)}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">({getClientDaysLeft(client.expiry_date)}d left)</span>
            </>
          )}
        </div>

        {/* Display Funnel URL */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left mb-4 flex items-center justify-between gap-2">
          <div className="truncate text-xs font-mono text-slate-300 select-all">
            {funnelUrl}
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res QR</span>
          </button>

          <a
            href={funnelUrl}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Funnel</span>
          </a>
        </div>

      </div>
    </div>
  );
}
