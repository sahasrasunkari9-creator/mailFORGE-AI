/**
 * API layer — talks to the MailForge backend (server/index.ts) when it is
 * reachable, and transparently falls back to the on-device engine +
 * localStorage when it is not (e.g. static hosting).
 */
import { useEffect, useState } from "react";
import { generateEmail, improveEmail } from "./engine";
import {
  deleteEmail as localDelete,
  loadActivity,
  loadEmails,
  logActivity,
  saveEmail as localSave,
  updateEmail as localUpdate,
} from "./store";
import type {
  ActivityItem,
  ActivityType,
  GenInput,
  GeneratedEmail,
  ImproveOp,
  StoredEmail,
} from "./types";

export type ApiMode = "cloud" | "local";

/** Relative by default so the same build works on any host with the backend. */
const BASE = "/api";

/* ---------------- mode pub/sub ---------------- */

let currentMode: ApiMode = "local";
const listeners = new Set<(m: ApiMode) => void>();

export function getApiMode(): ApiMode {
  return currentMode;
}

function setMode(m: ApiMode): void {
  if (m !== currentMode) {
    currentMode = m;
    listeners.forEach((l) => l(m));
  }
}

export function onApiMode(cb: (m: ApiMode) => void): () => void {
  listeners.add(cb);
  cb(currentMode);
  return () => {
    listeners.delete(cb);
  };
}

export function useApiMode(): ApiMode {
  const [mode, setModeState] = useState<ApiMode>(currentMode);
  useEffect(() => onApiMode(setModeState), []);
  return mode;
}

/* ---------------- transport ---------------- */

function fetchJson<T>(path: string, init?: RequestInit, timeoutMs = 3500): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  return fetch(`${BASE}${path}`, {
    ...init,
    signal: ctrl.signal,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  })
    .then((res) => (res.ok ? res.json() as Promise<T> : null))
    .catch(() => null)
    .finally(() => clearTimeout(timer));
}

/** Call /api/health once at startup to decide the working mode. */
export async function detectApi(): Promise<ApiMode> {
  const health = await fetchJson<{ ok: boolean; name: string }>("/health", undefined, 2000);
  const mode: ApiMode = health && health.ok ? "cloud" : "local";
  setMode(mode);
  return mode;
}

/* ---------------- operations (cloud-first, local fallback) ---------------- */

export interface Sourced<T> {
  data: T;
  source: ApiMode;
}

export async function apiGenerate(input: GenInput): Promise<Sourced<GeneratedEmail>> {
  const cloud = await fetchJson<{ email: GeneratedEmail }>(
    "/generate",
    { method: "POST", body: JSON.stringify({ input }) },
    6000
  );
  if (cloud?.email) return { data: cloud.email, source: "cloud" };
  return { data: generateEmail(input, Math.random()), source: "local" };
}

export async function apiImprove(
  email: GeneratedEmail,
  input: GenInput,
  op: ImproveOp
): Promise<{ email: GeneratedEmail; summary: string; source: ApiMode }> {
  const cloud = await fetchJson<{ email: GeneratedEmail; summary: string }>(
    "/improve",
    { method: "POST", body: JSON.stringify({ email, input, op }) },
    6000
  );
  if (cloud?.email) return { email: cloud.email, summary: cloud.summary, source: "cloud" };
  const local = improveEmail(email, op, input);
  return { email: local.email, summary: local.summary, source: "local" };
}

export async function apiListEmails(): Promise<Sourced<StoredEmail[]>> {
  const cloud = await fetchJson<{ emails: StoredEmail[] }>("/emails");
  if (cloud?.emails) return { data: cloud.emails, source: "cloud" };
  return { data: loadEmails(), source: "local" };
}

export async function apiSaveEmail(email: StoredEmail): Promise<Sourced<StoredEmail>> {
  const cloud = await fetchJson<{ email: StoredEmail }>(
    "/emails",
    { method: "POST", body: JSON.stringify(email) }
  );
  if (cloud?.email) return { data: cloud.email, source: "cloud" };
  return { data: localSave(email), source: "local" };
}

export async function apiUpdateEmail(id: string, patch: Partial<StoredEmail>): Promise<Sourced<StoredEmail | null>> {
  const cloud = await fetchJson<{ email: StoredEmail | null }>(
    `/emails/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(patch) }
  );
  if (cloud?.email) return { data: cloud.email, source: "cloud" };
  return { data: localUpdate(id, patch), source: "local" };
}

export async function apiDeleteEmail(id: string): Promise<ApiMode> {
  const cloud = await fetchJson<{ ok: boolean }>(`/emails/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (cloud?.ok) return "cloud";
  localDelete(id);
  return "local";
}

export async function apiLoadActivity(): Promise<Sourced<ActivityItem[]>> {
  const cloud = await fetchJson<{ activity: ActivityItem[] }>("/activity");
  if (cloud?.activity) return { data: cloud.activity, source: "cloud" };
  return { data: loadActivity(), source: "local" };
}

/**
 * Log an activity entry: always stored locally, and mirrored to the backend
 * (fire-and-forget) when the cloud API is connected.
 */
export function track(type: ActivityType, label: string): void {
  logActivity(type, label);
  if (getApiMode() === "cloud") {
    void fetchJson("/activity", { method: "POST", body: JSON.stringify({ type, label }) }, 1500);
  }
}
