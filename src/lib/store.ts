import type { ActivityItem, ActivityType, StoredEmail } from "./types";
import { uid } from "./engine";

const EMAILS_KEY = "mailforge:emails:v1";
const ACTIVITY_KEY = "mailforge:activity:v1";

export function loadEmails(): StoredEmail[] {
  try {
    const raw = localStorage.getItem(EMAILS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistEmails(emails: StoredEmail[]): void {
  try {
    localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
  } catch {
    /* storage unavailable — ignore */
  }
}

export function saveEmail(email: StoredEmail): StoredEmail {
  const emails = loadEmails();
  const idx = emails.findIndex((e) => e.id === email.id);
  email.updatedAt = Date.now();
  if (idx >= 0) emails[idx] = email;
  else emails.unshift(email);
  persistEmails(emails);
  return email;
}

export function updateEmail(id: string, patch: Partial<StoredEmail>): StoredEmail | null {
  const emails = loadEmails();
  const idx = emails.findIndex((e) => e.id === id);
  if (idx < 0) return null;
  emails[idx] = { ...emails[idx], ...patch, updatedAt: Date.now() };
  persistEmails(emails);
  return emails[idx];
}

export function deleteEmail(id: string): void {
  persistEmails(loadEmails().filter((e) => e.id !== id));
}

/* ---------------- activity ---------------- */

export function loadActivity(): ActivityItem[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logActivity(type: ActivityType, label: string): void {
  try {
    const items = loadActivity();
    items.unshift({ id: uid(), type, label, ts: Date.now() });
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(items.slice(0, 40)));
  } catch {
    /* ignore */
  }
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
