'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { Printer, ArrowLeft, Star, Camera } from 'lucide-react';
import { Client } from '../../lib/types';
import { decodeClientData, DEFAULT_CLIENTS, encodeClientData, formatDateRange } from '../../lib/data';
import { getStoredClients } from '../../lib/storage';

function StandeeContent() {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [client, setClient] = useState<Client>(DEFAULT_CLIENTS[0]);

  useEffect(() => {
    const dParam = searchParams.get('d');
    const idParam = searchParams.get('id');
    const storedClients = getStoredClients();
    let initialClient = DEFAULT_CLIENTS[0];

    // 1. If dParam is provided in URL, decode immediately
    if (dParam) {
      const decoded = decodeClientData(dParam);
      if (decoded && decoded.name) {
        initialClient = decoded;
      }
    }

    // 2. If idParam is provided, check storedClients
    if (idParam) {
      const match = storedClients.find((c) => c.id === idParam) || DEFAULT_CLIENTS.find((c) => c.id === idParam);
      if (match) initialClient = match;
    } else if (!dParam && storedClients.length > 0) {
      initialClient = storedClients[0];
    }

    setClient(initialClient);

    const targetId = idParam || initialClient.id;
    if (targetId) {
      fetch(`/api/clients?id=${encodeURIComponent(targetId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.client) {
            setClient(data.client);
          }
        })
        .catch(() => { });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!client || typeof window === 'undefined') return;

    const base = window.location.origin;
    // Guaranteed standalone QR Code URL with permanent ID and full decoded payload
    const funnelUrl = `${base}/review?id=${encodeURIComponent(client.id)}&d=${encodeClientData(client)}`;

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, funnelUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      });
    }
  }, [client]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-slate-900">

      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print max-w-sm w-full mb-4 flex items-center justify-between">
        <Link
          href="/SmartXCRM_admin"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-300 px-2.5 py-1 rounded-xl shadow-xs">
          📅 {formatDateRange(client.start_date, client.expiry_date)}
        </span>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1.5 transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Standee A5 Card Display */}
      <div className="standee-card max-w-sm w-full bg-white rounded-3xl p-8 border-4 border-slate-900 text-center shadow-2xl relative overflow-hidden">

        {/* Top badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-extrabold tracking-wider uppercase mb-5">
          <span className="text-amber-400">★★★★★</span>
          <span>Google Reviews</span>
        </div>

        {/* Business Header */}
        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-snug mb-1">
          {client.name}
        </h1>

        {client.person_name && (
          <p className="text-xs font-semibold text-slate-700 mb-1">
            {client.category === 'healthcare' || /dr\b|doctor/i.test(client.person_name) ? '👨‍⚕️ ' : '👤 '}
            {client.person_name}
          </p>
        )}

        <p className="text-xs font-bold text-indigo-700 tracking-wide uppercase mb-5">
          📍 {client.city}
        </p>

        {/* Trilingual Call to Action */}
        <div className="space-y-1 mb-5">
          <h2 className="text-lg font-black text-slate-800 leading-tight">
            Loved your experience with us?
          </h2>
          <p className="text-sm font-bold text-slate-700">
            તમારો અનુભવ કેવો રહ્યો? રિવ્યૂ આપો!
          </p>
          <p className="text-xs font-semibold text-slate-500">
            अपना अनुभव शेयर करें और 5-स्टार रेटिंग दें!
          </p>
        </div>

        {/* QR Code Centerpiece */}
        <div className="inline-block p-3.5 rounded-3xl border-2 border-slate-900 bg-white shadow-md mb-5">
          <canvas ref={canvasRef} className="rounded-xl w-48 h-48 mx-auto" />
        </div>

        {/* Quick instructions */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4 text-xs font-semibold text-slate-700 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-indigo-600 font-bold">
            <Camera className="w-3.5 h-3.5" />
            <span>Scan with Phone Camera</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Choose Language: 🇬🇧 English • 🇮🇳 हिन्दी • 🇮🇳 ગુજરાતી
          </div>
        </div>

        {/* 5 Star rating icons row */}
        <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-400" />
          ))}
        </div>

        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
          1-Tap Instant Review • Takes 10 Seconds
        </p>

      </div>

    </div>
  );
}

export default function StandeePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StandeeContent />
    </Suspense>
  );
}
