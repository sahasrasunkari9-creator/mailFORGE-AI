/**
 * MailForge AI — backend server
 *
 * Run:  npx tsx server/index.ts
 *
 *   API:   http://localhost:8787/api
 *   App:   http://localhost:8787   (serves the built client from ../dist)
 *
 * The server shares the exact same email engine as the client
 * (src/lib/engine.ts + src/lib/languages.ts), so cloud and local
 * modes produce consistent results. Data persists to server/data/db.json.
 */
import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateEmail, improveEmail, uid } from "../src/lib/engine";
import type {
  ActivityItem,
  ActivityType,
  GenInput,
  ImproveOp,
  StoredEmail,
} from "../src/lib/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const DIST_PATH = path.join(__dirname, "..", "dist");
const PORT = Number(process.env.PORT ?? 8787);
const VERSION = "1.0.0";

/* ---------------- database (JSON file, debounced writes) ---------------- */

interface DBShape {
  emails: StoredEmail[];
  activity: ActivityItem[];
}

let db: DBShape = { emails: [], activity: [] };
let saveTimer: ReturnType<typeof setTimeout> | null = null;

async function loadDb(): Promise<void> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<DBShape>;
    db = {
      emails: Array.isArray(parsed.emails) ? parsed.emails : [],
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
    };
  } catch {
    db = { emails: [], activity: [] };
  }
}

function persist(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void fs
      .mkdir(DATA_DIR, { recursive: true })
      .then(() => fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8"))
      .catch(() => {
        /* disk error — keep running in-memory */
      });
  }, 250);
}

/* ---------------- validation ---------------- */

const PURPOSES = new Set(["job", "followup", "proposal", "meeting", "support", "marketing", "thanks", "custom"]);
const TONES = new Set(["professional", "friendly", "formal", "persuasive", "casual"]);
const LENGTHS = new Set(["short", "medium", "detailed"]);
const LANGS = new Set(["en", "hi", "te", "ta"]);
const IMPROVE_OPS = new Set(["professional", "shorter", "friendlier", "grammar", "persuasive", "longer"]);
const ACTIVITY_TYPES = new Set(["generate", "save", "edit", "delete", "copy", "download", "send", "improve"]);

const str = (v: unknown): string => (typeof v === "string" ? v : "");

function parseInput(raw: unknown): { ok: true; value: GenInput } | { ok: false; error: string } {
  const b = (raw ?? {}) as Record<string, unknown>;
  const r = (b.recipient ?? {}) as Record<string, unknown>;
  const input: GenInput = {
    purpose: str(b.purpose) as GenInput["purpose"],
    recipient: { name: str(r.name), role: str(r.role), company: str(r.company) },
    description: str(b.description),
    tone: str(b.tone) as GenInput["tone"],
    length: str(b.length) as GenInput["length"],
    language: (LANGS.has(str(b.language)) ? str(b.language) : "en") as GenInput["language"],
  };
  if (!PURPOSES.has(input.purpose)) return { ok: false, error: "Invalid purpose" };
  if (!TONES.has(input.tone)) return { ok: false, error: "Invalid tone" };
  if (!LENGTHS.has(input.length)) return { ok: false, error: "Invalid length" };
  if (input.description.trim().length < 10) {
    return { ok: false, error: "Description must be at least 10 characters" };
  }
  return { ok: true, value: input };
}

function parseStoredEmail(raw: unknown): { ok: true; value: StoredEmail } | { ok: false; error: string } {
  const b = (raw ?? {}) as Record<string, unknown>;
  const inp = parseInput(b.input);
  if (!inp.ok) return { ok: false, error: `Invalid input: ${inp.error}` };
  if (typeof b.subject !== "string" || b.subject.trim().length === 0) {
    return { ok: false, error: "Subject is required" };
  }
  if (typeof b.body !== "string" || b.body.trim().length === 0) {
    return { ok: false, error: "Body is required" };
  }
  const email: StoredEmail = {
    id: typeof b.id === "string" && b.id.length > 0 ? b.id : uid(),
    subject: b.subject,
    greeting: str(b.greeting),
    body: b.body,
    closing: str(b.closing),
    input: inp.value,
    createdAt: typeof b.createdAt === "number" ? b.createdAt : Date.now(),
    updatedAt: typeof b.updatedAt === "number" ? b.updatedAt : Date.now(),
  };
  return { ok: true, value: email };
}

/* ---------------- app ---------------- */

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: "256kb" }));

/* health */
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    name: "MailForge AI Backend",
    mode: "cloud",
    version: VERSION,
    time: Date.now(),
    stored: db.emails.length,
  });
});

/* AI generation */
app.post("/api/generate", (req, res) => {
  const t0 = Date.now();
  const parsed = parseInput(req.body?.input ?? req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const email = generateEmail(parsed.value, Math.random());
  res.json({ source: "cloud", email, latencyMs: Date.now() - t0 });
});

/* AI improve (tone / shorten / grammar / persuade / expand) */
app.post("/api/improve", (req, res) => {
  const { email, input, op } = (req.body ?? {}) as {
    email?: StoredEmail;
    input?: GenInput;
    op?: ImproveOp;
  };
  const parsed = parseInput(input);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  if (!op || !IMPROVE_OPS.has(op)) {
    res.status(400).json({ error: "Invalid improve operation" });
    return;
  }
  if (!email || typeof email.subject !== "string" || typeof email.body !== "string") {
    res.status(400).json({ error: "Missing email payload" });
    return;
  }
  const result = improveEmail(
    {
      subject: email.subject,
      greeting: str(email.greeting),
      body: email.body,
      closing: str(email.closing),
    },
    op,
    parsed.value
  );
  res.json({ source: "cloud", email: result.email, summary: result.summary });
});

/* emails: list (with server-side search + filter) */
app.get("/api/emails", (req, res) => {
  const purpose = str(req.query.purpose);
  const q = str(req.query.q).toLowerCase();
  let emails = db.emails;
  if (purpose && purpose !== "all") emails = emails.filter((e) => e.input.purpose === purpose);
  if (q) {
    emails = emails.filter((e) =>
      [e.subject, e.body, e.greeting, e.closing, e.input.recipient.name, e.input.recipient.role, e.input.recipient.company]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }
  res.json({ source: "cloud", emails });
});

/* emails: create / upsert */
app.post("/api/emails", (req, res) => {
  const parsed = parseStoredEmail(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }
  const email = parsed.value;
  const idx = db.emails.findIndex((e) => e.id === email.id);
  if (idx >= 0) db.emails[idx] = email;
  else db.emails.unshift(email);
  persist();
  res.json({ source: "cloud", email });
});

/* emails: update */
app.put("/api/emails/:id", (req, res) => {
  const id = str(req.params.id);
  const idx = db.emails.findIndex((e) => e.id === id);
  if (idx < 0) {
    res.status(404).json({ error: "Email not found" });
    return;
  }
  const patch = (req.body ?? {}) as Partial<StoredEmail>;
  const next: StoredEmail = {
    ...db.emails[idx],
    ...("subject" in patch ? { subject: str(patch.subject) } : {}),
    ...("greeting" in patch ? { greeting: str(patch.greeting) } : {}),
    ...("body" in patch ? { body: str(patch.body) } : {}),
    ...("closing" in patch ? { closing: str(patch.closing) } : {}),
    updatedAt: Date.now(),
  };
  if (!next.subject.trim()) {
    res.status(400).json({ error: "Subject cannot be empty" });
    return;
  }
  db.emails[idx] = next;
  persist();
  res.json({ source: "cloud", email: next });
});

/* emails: delete */
app.delete("/api/emails/:id", (req, res) => {
  const id = str(req.params.id);
  const before = db.emails.length;
  db.emails = db.emails.filter((e) => e.id !== id);
  const removed = db.emails.length < before;
  if (removed) persist();
  res.json({ source: "cloud", ok: removed });
});

/* activity feed */
app.get("/api/activity", (_req, res) => {
  res.json({ source: "cloud", activity: db.activity });
});

app.post("/api/activity", (req, res) => {
  const { type, label } = (req.body ?? {}) as { type?: ActivityType; label?: string };
  if (!type || !ACTIVITY_TYPES.has(type) || typeof label !== "string") {
    res.status(400).json({ error: "Invalid activity payload" });
    return;
  }
  db.activity.unshift({ id: uid(), type, label, ts: Date.now() });
  db.activity = db.activity.slice(0, 40);
  persist();
  res.json({ source: "cloud", ok: true });
});

/* static client build */
app.use(express.static(DIST_PATH));
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) {
    next();
    return;
  }
  const indexHtml = path.join(DIST_PATH, "index.html");
  fs.access(indexHtml)
    .then(() => res.sendFile(indexHtml))
    .catch(() =>
      res.status(503).json({
        error: "Client build not found — run `npm run build` first, then reload.",
      })
    );
});

/* JSON 404 + error handler */
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[mailforge] server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

/* ---------------- boot ---------------- */

void (async () => {
  await loadDb();
  app.listen(PORT, () => {
    console.log("MailForge AI backend is running");
    console.log(`  API:  http://localhost:${PORT}/api`);
    console.log(`  App:  http://localhost:${PORT}  (serves ../dist)`);
    console.log(`  Data: ${DB_PATH}`);
    console.log(`  Stored emails: ${db.emails.length}`);
  });
})();
