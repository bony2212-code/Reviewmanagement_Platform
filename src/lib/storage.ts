import { Client, Lead, AdminCredentials } from './types';
import { DEFAULT_CLIENTS } from './data';

const STORAGE_KEY = 'review_growth_hub_clients_v3';
const LEADS_KEY = 'review_growth_hub_leads_v1';
const AUTH_CREDS_KEY = 'rgh_admin_creds_v1';
const AUTH_SESSION_KEY = 'rgh_admin_session_v1';

export function getStoredClients(): Client[] {
  if (typeof window === 'undefined') return DEFAULT_CLIENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let modified = false;
        // Ensure client_1 reflects updated keywords if it was previously initialized with default
        const c1 = parsed.find((c: Client) => c.id === 'client_1');
        if (c1 && c1.keywords === 'Wheelchair, Hospital Bed, Mobility Solutions, Oxygen Concentrator, Walker') {
          c1.keywords = 'Hospital Bed, Mobility Solutions, Oxygen Concentrator, Walker, Walker / Walking Stick';
          modified = true;
        }

        // Backfill start_date and expiry_date if missing from previous version
        parsed.forEach((c: Client) => {
          if (!c.start_date) {
            const def = DEFAULT_CLIENTS.find((dc) => dc.id === c.id);
            c.start_date = def?.start_date || (c.createdAt ? c.createdAt.split('T')[0] : '2026-10-01');
            modified = true;
          }
          if (!c.expiry_date) {
            const def = DEFAULT_CLIENTS.find((dc) => dc.id === c.id);
            c.expiry_date = def?.expiry_date || '2027-10-26';
            modified = true;
          }
        });

        // Add any missing default sample clients (e.g. client_5 expired, client_6 upcoming)
        DEFAULT_CLIENTS.forEach((dc) => {
          if (!parsed.some((c: Client) => c.id === dc.id)) {
            parsed.push(dc);
            modified = true;
          }
        });

        if (modified) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
    // initialize defaults
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTS));
    return DEFAULT_CLIENTS;
  } catch (e) {
    console.error("Failed to load clients", e);
    return DEFAULT_CLIENTS;
  }
}

export function saveStoredClients(clients: Client[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    // Asynchronously sync with server API for cross-device/phone access
    fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clients),
    }).catch(() => {
      // offline/client-side fallback is handled safely
    });
  } catch (e) {
    console.error("Failed to save clients", e);
  }
}

export function getStoredLeads(): Lead[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch (e) {
    console.error("Failed to load leads", e);
    return [];
  }
}

export function saveStoredLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error("Failed to save leads", e);
  }
}

export function getAdminCredentials(): AdminCredentials {
  if (typeof window === 'undefined') return { username: 'admin', password: 'admin@123' };
  try {
    const raw = localStorage.getItem(AUTH_CREDS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to read admin credentials", e);
  }
  return { username: 'admin', password: 'admin@123' };
}

export function saveAdminCredentials(creds: AdminCredentials): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_CREDS_KEY, JSON.stringify(creds));
  } catch (e) {
    console.error("Failed to save admin credentials", e);
  }
}

export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true' || localStorage.getItem(AUTH_SESSION_KEY) === 'true';
}

export function setSessionAuthenticated(remember: boolean): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
  if (remember) {
    localStorage.setItem(AUTH_SESSION_KEY, 'true');
  }
}

export function clearSessionAuth(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(AUTH_SESSION_KEY);
}

const AGENCY_PHONE_KEY = 'rgh_agency_contact_number_v1';
export const DEFAULT_AGENCY_PHONE = '919876543210';

export function getAgencyContactNumber(): string {
  if (typeof window === 'undefined') return DEFAULT_AGENCY_PHONE;
  try {
    const raw = localStorage.getItem(AGENCY_PHONE_KEY);
    if (raw && raw.trim()) return raw.trim();
  } catch (e) {
    console.error("Failed to read agency phone", e);
  }
  return DEFAULT_AGENCY_PHONE;
}

export function saveAgencyContactNumber(phone: string): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = phone.trim();
    localStorage.setItem(AGENCY_PHONE_KEY, clean);
    // sync to backend API so all devices and client funnels update in real-time
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agencyPhone: clean }),
    }).catch(() => {});
  } catch (e) {
    console.error("Failed to save agency phone", e);
  }
}

// 24-Hour Review Locking System
const USED_REVIEWS_KEY = 'rgh_used_reviews_lock_v1';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

interface LocalUsedReview {
  clientId: string;
  reviewText: string;
  timestamp: number;
}

export function getUsedReviewsLocal(clientId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USED_REVIEWS_KEY);
    if (!raw) return [];
    const parsed: LocalUsedReview[] = JSON.parse(raw);
    const now = Date.now();
    const active = parsed.filter(
      (item) => item.clientId === clientId && now - item.timestamp <= TWENTY_FOUR_HOURS_MS
    );
    return active.map((item) => item.reviewText);
  } catch {
    return [];
  }
}

export async function markReviewUsed(clientId: string, reviewText: string): Promise<void> {
  if (typeof window === 'undefined' || !reviewText || !clientId) return;
  try {
    const now = Date.now();
    const raw = localStorage.getItem(USED_REVIEWS_KEY);
    const current: LocalUsedReview[] = raw ? JSON.parse(raw) : [];

    // Filter out expired entries (> 24 hours)
    const valid = current.filter((item) => now - item.timestamp <= TWENTY_FOUR_HOURS_MS);

    // Add current review lock
    const updated = [{ clientId, reviewText: reviewText.trim(), timestamp: now }, ...valid];
    localStorage.setItem(USED_REVIEWS_KEY, JSON.stringify(updated));

    // Synchronize to server API so other users on different phones/devices do not see this review for 24 hours
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, reviewText: reviewText.trim() }),
    }).catch(() => {});
  } catch (e) {
    console.error("Failed to mark review as used:", e);
  }
}

export async function fetchServerUsedReviews(clientId: string): Promise<string[]> {
  const local = getUsedReviewsLocal(clientId);
  if (typeof window === 'undefined' || !clientId) return local;

  try {
    const res = await fetch(`/api/reviews?clientId=${encodeURIComponent(clientId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.usedReviews)) {
        // Merge into local cache
        const now = Date.now();
        const serverReviews: string[] = data.usedReviews;
        const raw = localStorage.getItem(USED_REVIEWS_KEY);
        const current: LocalUsedReview[] = raw ? JSON.parse(raw) : [];
        const valid = current.filter((item) => now - item.timestamp <= TWENTY_FOUR_HOURS_MS);

        serverReviews.forEach((txt) => {
          if (!valid.some((v) => v.clientId === clientId && v.reviewText === txt)) {
            valid.push({ clientId, reviewText: txt, timestamp: now });
          }
        });

        localStorage.setItem(USED_REVIEWS_KEY, JSON.stringify(valid));
        return Array.from(new Set([...local, ...serverReviews]));
      }
    }
  } catch (err) {
    console.warn("Could not fetch remote used reviews, relying on local cache:", err);
  }

  return local;
}


