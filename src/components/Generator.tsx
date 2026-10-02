import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { IMPROVE_LABELS, uid } from "../lib/engine";
import { apiGenerate, apiImprove, apiSaveEmail, track, useApiMode } from "../lib/api";
import {
  LANG_OPTIONS,
  PURPOSE_LABELS,
  TONE_LABELS,
  LENGTH_LABELS,
  type GenInput,
  type GeneratedEmail,
  type ImproveOp,
  type Lang,
  type LengthOpt,
  type Purpose,
  type StoredEmail,
  type Tone,
} from "../lib/types";
import { useToast } from "./Toast";
import { Button, Chip, Field, GlassCard } from "./ui";
import { IconBriefcase, IconBuilding, IconGlobe, IconSend, IconSpark, IconUser, PurposeIcon } from "./icons";
import EmailPreview from "./EmailPreview";

const STEPS = [
  "Reading your brief…",
  "Choosing structure & subject line…",
  "Writing the body in your tone…",
  "Personalizing recipient details…",
  "Polishing grammar & flow…",
];

const PURPOSES: Purpose[] = ["job", "followup", "proposal", "meeting", "support", "marketing", "thanks", "custom"];
const TONES: Tone[] = ["professional", "friendly", "formal", "persuasive", "casual"];
const LENGTHS: LengthOpt[] = ["short", "medium", "detailed"];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Props {
  demoTick: number;
  focusTick: number;
}

export default function Generator({ demoTick, focusTick }: Props) {
  const { push } = useToast();
  const apiMode = useApiMode();

  const [purpose, setPurpose] = useState<Purpose>("meeting");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [length, setLength] = useState<LengthOpt>("medium");
  const [language, setLanguage] = useState<Lang | "other">("en");
  const [descError, setDescError] = useState("");

  const [genStep, setGenStep] = useState(-1); // -1 idle, 0..4 generating
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [input, setInput] = useState<GenInput | null>(null);
  const [improving, setImproving] = useState<ImproveOp | null>(null);
  const [regenBusy, setRegenBusy] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const alive = useRef(true);
  const genLock = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const buildInput = (): GenInput | null => {
    const desc = description.trim();
    if (desc.length < 10) {
      setDescError("Describe your email in at least 10 characters so the AI has something to work with.");
      return null;
    }
    setDescError("");
    return {
      purpose,
      recipient: { name: name.trim(), role: role.trim(), company: company.trim() },
      description: desc,
      tone,
      length,
      language: language === "other" ? "en" : language,
    };
  };

  const runGeneration = async (inp: GenInput) => {
    if (genLock.current) return;
    genLock.current = true;
    setGenStep(0);
    for (let i = 0; i < STEPS.length; i++) {
      if (!alive.current) return;
      setGenStep(i);
      await sleep(i === 0 ? 300 : 380);
    }
    if (!alive.current) return;
    try {
      const { data: result, source } = await apiGenerate(inp);
      setEmail(result);
      setInput(inp);
      setSavedId(null);
      push(
        "success",
        source === "cloud"
          ? "Cloud API drafted your email — review, refine, or send it."
          : "Your email is ready — drafted by the on-device engine."
      );
      track("generate", `Generated "${result.subject}"`);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch {
      push("error", "Generation failed — please try again.");
    }
    if (alive.current) setGenStep(-1);
    genLock.current = false;
  };

  const handleGenerate = () => {
    const inp = buildInput();
    if (!inp) {
      push("error", "Please complete the required fields first.");
      descRef.current?.focus();
      return;
    }
    if (language === "other") {
      push("info", "\"Other\" selected — drafting in English for now.");
    }
    void runGeneration(inp);
  };

  /* --- demo --- */
  useEffect(() => {
    if (demoTick === 0) return;
    const inp: GenInput = {
      purpose: "meeting",
      recipient: { name: "Priya Sharma", role: "Head of Design", company: "Nimbus Labs" },
      description:
        "I would like to schedule a 30-minute call to share our Q3 design partnership idea and see if it fits their roadmap. We worked together on the Orbit project last year and it went very well.",
      tone: "professional",
      length: "medium",
      language: "en",
    };
    setPurpose(inp.purpose);
    setName(inp.recipient.name);
    setRole(inp.recipient.role);
    setCompany(inp.recipient.company);
    setDescription(inp.description);
    setTone(inp.tone);
    setLength(inp.length);
    setLanguage("en");
    setDescError("");
    void runGeneration(inp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoTick]);

  /* --- external focus --- */
  useEffect(() => {
    if (focusTick === 0) return;
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setFlash(true);
    setTimeout(() => setFlash(false), 2100);
    setTimeout(() => descRef.current?.focus({ preventScroll: true }), 450);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTick]);

  const handleRegenerate = async () => {
    if (!input || regenBusy) return;
    setRegenBusy(true);
    await sleep(950);
    if (!alive.current) return;
    const { data: result } = await apiGenerate(input);
    setEmail(result);
    setSavedId(null);
    setRegenBusy(false);
    push("success", "Regenerated with a fresh variation.");
    track("generate", `Regenerated "${result.subject}"`);
  };

  const handleImprove = async (op: ImproveOp) => {
    if (!email || !input || improving) return;
    setImproving(op);
    await sleep(750);
    if (!alive.current) return;
    const { email: next, summary, source } = await apiImprove(email, input, op);
    setEmail(next);
    setImproving(null);
    setSavedId(null);
    push(
      "success",
      `Improved via ${source === "cloud" ? "cloud API" : "local engine"} — ${summary.toLowerCase()}.`
    );
    track("improve", `${IMPROVE_LABELS[op]}: "${next.subject}"`);
  };

  const handleSave = async () => {
    if (!email || !input || savedId) return;
    const stored: StoredEmail = {
      id: uid(),
      ...email,
      input,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const { source } = await apiSaveEmail(stored);
    setSavedId(stored.id);
    push(
      "success",
      source === "cloud"
        ? "Saved to the cloud library — find it in the Dashboard."
        : "Saved to your library — find it in the Dashboard."
    );
    track("save", `Saved "${email.subject}"`);
  };

  const handleSuggestion = (label: string, text: string) => {
    if (!email || !input) return;
    const company = input.recipient.company.trim() || "your team";
    const clean = text.split("{company}").join(company);
    const next: GeneratedEmail = { ...email, body: `${email.body}\n\n${clean}` };
    setEmail(next);
    setSavedId(null);
    push("success", `Suggestion applied — ${label.toLowerCase()}.`);
    track("improve", `Applied suggestion "${label}"`);
  };

  const handleEditSave = (updated: GeneratedEmail) => {
    setEmail(updated);
    setSavedId(null);
    push("success", "Changes saved to this draft.");
    track("edit", `Edited "${updated.subject}"`);
  };

  const generating = genStep >= 0;

  return (
    <div className="space-y-6">
      {/* ---------------- form panel ---------------- */}
      <GlassCard className={cn("relative overflow-hidden", flash && "anim-ring-flash")}>
        <div ref={panelRef} />
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-aqua-500/10 blur-3xl" />
        <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-aqua-400/15 text-aqua-300">
              <IconSpark className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="font-display text-[15px] font-semibold leading-tight text-mist-100">
                AI Email Generator
              </h2>
              <p className="text-[11px] text-mist-500">Input → AI drafting → professional email</p>
            </div>
          </div>
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] transition-colors",
              apiMode === "cloud"
                ? "border-aqua-400/25 bg-aqua-400/10 text-aqua-300"
                : "border-ember-400/25 bg-ember-400/10 text-ember-300"
            )}
            title={apiMode === "cloud" ? "Connected to the MailForge cloud API" : "Backend offline — drafting on-device"}
          >
            <span className="anim-pulse-dot h-1.5 w-1.5 rounded-full bg-current" />
            {apiMode === "cloud" ? "Cloud API" : "Local engine"}
          </span>
        </div>

        <div className="space-y-5 px-4 py-5 sm:px-6">
          {/* purpose */}
          <Field label="Email purpose">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PURPOSES.map((p) => (
                <Chip key={p} active={purpose === p} onClick={() => setPurpose(p)} className="h-10 justify-start px-2.5 text-[12px]">
                  <PurposeIcon purpose={p} className="h-4 w-4" />
                  {PURPOSE_LABELS[p]}
                </Chip>
              ))}
            </div>
          </Field>

          {/* recipient */}
          <Field label="Recipient" hint="optional — makes it personal">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="relative">
                <IconUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
                <input className="field pl-9" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="relative">
                <IconBriefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
                <input className="field pl-9" placeholder="Role / Position" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div className="relative">
                <IconBuilding className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
                <input className="field pl-9" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>
          </Field>

          {/* description */}
          <Field label="Email description" error={descError} hint={`${description.length} chars`}>
            <textarea
              ref={descRef}
              rows={4}
              className={cn("field resize-y leading-relaxed", descError && "field-error")}
              placeholder="Describe what you want to say… e.g. follow up on the pricing proposal I sent last week and ask for their feedback"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (descError && e.target.value.trim().length >= 10) setDescError("");
              }}
            />
          </Field>

          {/* tone + length */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Tone">
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <Chip key={t} active={tone === t} onClick={() => setTone(t)} className="h-8 px-2.5 text-[12px]">
                    {TONE_LABELS[t]}
                  </Chip>
                ))}
              </div>
            </Field>
            <Field label="Length">
              <div className="flex flex-wrap gap-1.5">
                {LENGTHS.map((l) => (
                  <Chip key={l} active={length === l} onClick={() => setLength(l)} className="h-8 px-3 text-[12px]">
                    {LENGTH_LABELS[l]}
                  </Chip>
                ))}
              </div>
            </Field>
          </div>

          {/* language */}
          <Field label="Language">
            <div className="flex flex-wrap gap-1.5">
              {LANG_OPTIONS.map((l) => (
                <Chip key={l.value} active={language === l.value} onClick={() => setLanguage(l.value)} className="h-8 px-3 text-[12px]">
                  <IconGlobe className="h-3.5 w-3.5" />
                  {l.label}
                </Chip>
              ))}
            </div>
          </Field>

          {/* generate */}
          <div className="space-y-2 pt-1">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              loading={generating}
              icon={<IconSend className="h-4.5 w-4.5" />}
              onClick={handleGenerate}
            >
              {generating ? STEPS[genStep] : email ? "Generate Again" : "Generate Email"}
            </Button>
            <div className="h-1 overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-gradient-to-r from-aqua-500 to-aqua-300 transition-all duration-500 ease-out"
                style={{ width: generating ? `${((genStep + 1) / STEPS.length) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ---------------- skeleton while generating ---------------- */}
      {generating && (
        <div className="glass anim-fade-in rounded-2xl p-5 sm:p-6" aria-hidden="true">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-8 w-8 animate-pulse rounded-lg bg-aqua-400/20" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-mist-500">
              {STEPS[genStep]}
            </span>
          </div>
          <div className="space-y-3">
            <div className="anim-shimmer h-6 w-3/5 rounded-md" />
            <div className="anim-shimmer h-4 w-2/3 rounded-md" />
            <div className="anim-shimmer h-4 w-full rounded-md" />
            <div className="anim-shimmer h-4 w-5/6 rounded-md" />
            <div className="anim-shimmer h-4 w-4/6 rounded-md" />
          </div>
        </div>
      )}

      {/* ---------------- result ---------------- */}
      {email && input && !generating && (
        <div ref={resultRef} className="scroll-mt-24">
          <EmailPreview
            email={email}
            input={input}
            saved={savedId !== null}
            regenBusy={regenBusy}
            improving={improving}
            onSave={handleSave}
            onRegenerate={() => void handleRegenerate()}
            onImprove={(op) => void handleImprove(op)}
            onSuggestionApply={handleSuggestion}
            onEditSave={handleEditSave}
          />
        </div>
      )}
    </div>
  );
}
