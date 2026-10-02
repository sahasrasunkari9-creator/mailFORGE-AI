import { LANGUAGES, SUGGESTIONS, type LangPack } from "./languages";
import {
  LANG_LABELS,
  SIGNATURE_NAME,
  TONE_LABELS,
  type GenInput,
  type GeneratedEmail,
  type ImproveOp,
  type Purpose,
} from "./types";

/* ---------------- utilities ---------------- */

export function mulberry32(seed: number) {
  let a = Math.floor(seed * 0xffffffff) || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "email"
  );
}

function fill(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{${k}}`).join(v);
  }
  // tidy up leftover empty name pieces in subjects
  out = out.replace(/—\s*$/, "").replace(/\s—\s*$/g, " —").replace(/\s{2,}/g, " ");
  return out.trim();
}

function normalizeDescription(desc: string, lang: string): string {
  let t = desc.replace(/\s+/g, " ").trim();
  if (t.length > 320) t = t.slice(0, 317).trimEnd() + "…";
  const first = t[0];
  if (first && /[a-z]/.test(first)) t = first.toUpperCase() + t.slice(1);
  if (!/[.!?।…]$/.test(t) && lang === "en") t += ".";
  return t;
}

/* ---------------- generation ---------------- */

export function generateEmail(input: GenInput, seed: number): GeneratedEmail {
  const pack = LANGUAGES[input.language];
  const rng = mulberry32(Math.floor(seed * 1e9) || 7);

  const name = input.recipient.name.trim();
  const company = input.recipient.company.trim() || pack.companyFallback;
  const topic = pack.topicFallback[input.purpose];
  const desc = normalizeDescription(input.description, input.language);

  const vars = { name, company, topic, role: input.recipient.role.trim() };

  const g = pack.greeting[input.tone];
  const greeting = name ? fill(g.with, { name }) : g.without;

  const openBase = fill(pick(rng, pack.opener[input.purpose]), vars);
  const opener = (pack.openerTone[input.tone] + openBase).trim();

  const paras: string[] = [opener, fill(pack.core[input.purpose], vars)];
  if (desc) paras.push(pack.descLead + desc);
  if (input.length !== "short") paras.push(pack.support);
  if (input.length === "detailed") {
    paras.push(pack.detailNote + "\n" + pack.bullets[input.purpose].map((b) => "- " + fill(b, vars)).join("\n"));
  }
  if (input.tone === "persuasive") paras.push(pack.urgency);
  paras.push(fill(pack.cta[input.purpose], vars));

  const subject = fill(pick(rng, pack.subject[input.purpose]), vars).replace(/—\s*$/, "").trim();
  const closing = `${pack.closer[input.tone]}\n\n${pack.signature[input.tone]}\n${SIGNATURE_NAME}`;

  return { subject, greeting, body: paras.join("\n\n"), closing };
}

export function regenerateEmail(input: GenInput): GeneratedEmail {
  return generateEmail(input, Math.random());
}

/* ---------------- grammar heuristics ---------------- */

const CONTRACTIONS: Record<string, string> = {
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "can't": "cannot",
  "won't": "will not",
  "isn't": "is not",
  "it's": "it is",
  "I'm": "I am",
  "I'd": "I would",
  "I'll": "I will",
  "we're": "we are",
  "you're": "you are",
  "that's": "that is",
  "let's": "let us",
  "I've": "I have",
  "you've": "you have",
};

export function fixGrammar(text: string): string {
  let t = text;
  // smart spaces / line noise
  t = t.replace(/[\u00a0\u200b]+/g, " ").replace(/[ \t]{2,}/g, " ");
  t = t
    .split("\n")
    .map((line) => {
      let l = line.trimEnd();
      l = l.replace(/\bi\b/g, "I");
      l = l.replace(/\ba ([aeiouAEIOU])/g, "an $1");
      l = l.replace(/\b(\w+)\s+\1\b/gi, "$1");
      l = l.replace(/!{2,}/g, "!").replace(/\?{2,}/g, "?");
      l = l.replace(/\s+([,.!?;:])/g, "$1");
      l = l.replace(/([.!?])([^\s])/g, "$1 $2");
      l = l.replace(/\s{2,}/g, " ").trim();
      if (l && !/[.!?।…]$/.test(l) && !/,$/.test(l) && !/:$/.test(l)) l += ".";
      // capitalize first letter of each line
      const m = l.match(/^([A-Za-z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F])/);
      if (m) l = m[1].toUpperCase() + l.slice(1);
      return l;
    })
    .join("\n");
  return t;
}

export function applyProfessional(text: string): string {
  let t = text;
  for (const [from, to] of Object.entries(CONTRACTIONS)) {
    t = t.split(from).join(to);
  }
  return t;
}

/* ---------------- improve operations ---------------- */

function firstSentence(p: string): string {
  const m = p.match(/^(.*?[.!?।])/);
  return m ? m[1] : p.split("\n")[0];
}

export function improveEmail(
  email: GeneratedEmail,
  op: ImproveOp,
  input: GenInput
): { email: GeneratedEmail; summary: string } {
  const pack: LangPack = LANGUAGES[input.language];
  const company = input.recipient.company.trim() || pack.companyFallback;
  const e = { ...email };
  let summary = "";

  switch (op) {
    case "professional": {
      e.subject = fixGrammar(applyProfessional(e.subject));
      e.body = fixGrammar(applyProfessional(e.body));
      e.greeting = /^(Hi|Hey)\b/i.test(e.greeting) ? e.greeting.replace(/^(Hi|Hey)/i, "Dear") : e.greeting;
      const sig = e.closing.split("\n").filter(Boolean);
      if (sig.length >= 2) sig[0] = "Best regards,";
      e.closing = sig.join("\n");
      summary = "Expanded contractions and tightened formality";
      break;
    }
    case "shorter": {
      const paras = e.body.split("\n\n");
      const ctaP = fill(pack.cta[input.purpose], { company });
      const coreP = pack.core[input.purpose];
      const open = firstSentence(paras[0] ?? "");
      const descP = paras.find((p) => p.startsWith(pack.descLead));
      const coreFound = paras.find((p) => p === coreP);
      const kept: string[] = [open];
      if (coreFound) kept.push(coreFound);
      if (descP) kept.push(descP);
      kept.push(ctaP);
      e.body = fixGrammar(kept.join("\n\n"));
      summary = "Cut filler and kept only the essentials";
      break;
    }
    case "friendlier": {
      const name = input.recipient.name.trim();
      const fg = pack.greeting.friendly;
      e.greeting = name ? fill(fg.with, { name }) : fg.without;
      const paras = e.body.split("\n\n");
      if (!paras[0].includes(pack.openerTone.friendly)) paras[0] = pack.openerTone.friendly + paras[0];
      e.body = paras.join("\n\n");
      const sig = e.closing.split("\n").filter(Boolean);
      if (sig.length >= 2) sig[0] = pack.signature.friendly;
      e.closing = `${pack.closer.friendly}\n\n${sig.join("\n")}`;
      summary = "Warmed up the greeting and tone";
      break;
    }
    case "grammar": {
      e.subject = fixGrammar(e.subject);
      e.body = fixGrammar(e.body);
      e.greeting = fixGrammar(e.greeting);
      summary = "Fixed spacing, capitalization and common errors";
      break;
    }
    case "persuasive": {
      const paras = e.body.split("\n\n");
      if (!paras.some((p) => p.includes(pack.urgency))) paras.splice(paras.length - 1, 0, pack.urgency);
      e.body = paras.join("\n\n");
      const sig = e.closing.split("\n").filter(Boolean);
      if (sig.length >= 2) sig[0] = pack.signature.persuasive;
      e.closing = `${pack.closer.persuasive}\n\n${sig.join("\n")}`;
      summary = "Added urgency and a stronger close";
      break;
    }
    case "longer": {
      const paras = e.body.split("\n\n");
      const additions: string[] = [];
      if (!paras.some((p) => p.includes(pack.support))) additions.push(pack.support);
      if (!paras.some((p) => p.includes(pack.detailNote))) {
        const vars = { company, name: input.recipient.name.trim() };
        additions.push(
          pack.detailNote + "\n" + pack.bullets[input.purpose].map((b) => "- " + fill(b, vars)).join("\n")
        );
      }
      e.body = [...paras, ...additions].join("\n\n");
      summary = "Expanded with context and next steps";
      break;
    }
  }

  return { email: e, summary };
}

export const IMPROVE_LABELS: Record<ImproveOp, string> = {
  professional: "More professional",
  shorter: "Make shorter",
  friendlier: "Make friendlier",
  grammar: "Fix grammar",
  persuasive: "More persuasive",
  longer: "Make longer",
};

/* ---------------- suggestions ---------------- */

export interface AppliedSuggestion {
  id: string;
  label: string;
  text: string;
}

export function getSuggestions(purpose: Purpose, language: string): AppliedSuggestion[] {
  return SUGGESTIONS[purpose].map((s) => ({
    id: s.id,
    label: s.label,
    text: (s.text as Record<string, string>)[language] ?? s.text.en,
  }));
}

/* ---------------- misc ---------------- */

export function emailToPlainText(email: GeneratedEmail, to?: string): string {
  const lines: string[] = [];
  if (to) lines.push(`To: ${to}`);
  lines.push(`Subject: ${email.subject}`, "", email.greeting, "", email.body, "", email.closing);
  return lines.join("\n");
}

export function emailToEml(email: GeneratedEmail, recipient: { name: string; role: string; company: string }): string {
  const to = [recipient.name, recipient.role, recipient.company].filter(Boolean).join(", ") || "recipient@example.com";
  return [
    "From: Aarav Mehta <aarav@example.com>",
    `To: ${to}`,
    `Subject: ${email.subject}`,
    "",
    email.greeting,
    "",
    email.body,
    "",
    email.closing,
  ].join("\r\n");
}

export function wordCount(email: GeneratedEmail): number {
  return email.body.split(/\s+/).filter(Boolean).length;
}

export function describeInput(input: GenInput): string {
  return `${TONE_LABELS[input.tone]} · ${input.length} · ${LANG_LABELS[input.language]}`;
}

export function purposeLabel(p: Purpose): string {
  return {
    job: "Job Application",
    followup: "Follow-up",
    proposal: "Business Proposal",
    meeting: "Meeting Request",
    support: "Customer Support",
    marketing: "Marketing",
    thanks: "Thank You",
    custom: "Custom",
  }[p];
}
