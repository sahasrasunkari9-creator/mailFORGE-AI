import { useEffect, useMemo, useState } from "react";
import {
  emailToEml,
  emailToPlainText,
  getSuggestions,
  IMPROVE_LABELS,
  slugify,
  wordCount,
} from "../lib/engine";
import { copyToClipboard } from "../lib/clipboard";
import { track } from "../lib/api";
import {
  PURPOSE_LABELS,
  LANG_LABELS,
  LENGTH_LABELS,
  TONE_LABELS,
  type GenInput,
  type GeneratedEmail,
  type ImproveOp,
} from "../lib/types";
import { useToast } from "./Toast";
import { Button, Chip, Spinner } from "./ui";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconPencil,
  IconRefresh,
  IconSave,
  IconSend,
  IconSpark,
  IconTarget,
  IconWand,
  PurposeIcon,
} from "./icons";

interface Props {
  email: GeneratedEmail;
  input: GenInput;
  saved: boolean;
  regenBusy: boolean;
  improving: ImproveOp | null;
  onSave: () => void;
  onRegenerate: () => void;
  onImprove: (op: ImproveOp) => void;
  onSuggestionApply: (label: string, text: string) => void;
  onEditSave: (email: GeneratedEmail) => void;
}

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="glass-chip inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium text-mist-300">
      {children}
    </span>
  );
}

export default function EmailPreview({
  email,
  input,
  saved,
  regenBusy,
  improving,
  onSave,
  onRegenerate,
  onImprove,
  onSuggestionApply,
  onEditSave,
}: Props) {
  const { push } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GeneratedEmail>(email);
  const [applied, setApplied] = useState<string[]>([]);

  useEffect(() => {
    setDraft(email);
    setEditing(false);
    setApplied([]);
  }, [email]);

  const suggestions = useMemo(() => getSuggestions(input.purpose, input.language), [input.purpose, input.language]);
  const toLabel = [input.recipient.name, input.recipient.role, input.recipient.company]
    .filter(Boolean)
    .join(" · ") || "recipient";

  const doCopy = async () => {
    const ok = await copyToClipboard(emailToPlainText(email, toLabel));
    if (ok) {
      push("success", "Email copied to clipboard");
      track("copy", `Copied "${email.subject}"`);
    } else {
      push("error", "Copy failed — your browser blocked clipboard access");
    }
  };

  const doDownload = () => {
    try {
      const blob = new Blob([emailToEml(email, input.recipient)], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(email.subject)}.eml`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      push("success", "Email downloaded as .eml");
      track("download", `Downloaded "${email.subject}"`);
    } catch {
      push("error", "Download failed — please try again");
    }
  };

  const doSend = () => {
    try {
      const body = `${email.greeting}\n\n${email.body}\n\n${email.closing}`;
      const href = `mailto:${toLabel.includes("@") ? toLabel : ""}?subject=${encodeURIComponent(
        email.subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      push("info", "Opening your mail client…");
      track("send", `Sent "${email.subject}" via mail client`);
    } catch {
      push("error", "Could not open your mail client");
    }
  };

  const startEdit = () => {
    setDraft({ ...email });
    setEditing(true);
  };

  const saveEdit = () => {
    if (!draft.subject.trim()) {
      push("error", "Subject cannot be empty");
      return;
    }
    onEditSave(draft);
    setEditing(false);
  };

  const renderBody = () =>
    email.body.split("\n\n").map((p, i) => {
      if (p.includes("\n- ")) {
        const [intro, ...rest] = p.split("\n");
        return (
          <div key={i}>
            <p>{intro}</p>
            <ul className="mb-3.5 ml-4 list-disc space-y-1 marker:text-aqua-400">
              {rest.map((li, j) => (
                <li key={j}>{li.replace(/^- /, "")}</li>
              ))}
            </ul>
          </div>
        );
      }
      return <p key={i}>{p}</p>;
    });

  return (
    <div className="anim-fade-up space-y-4">
      {/* email card */}
      <div className="glass overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/8 px-4 py-3 sm:px-6">
          <span className="anim-pulse-dot mr-1 inline-block h-2 w-2 rounded-full bg-aqua-400" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-mist-400">
            Generated email
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <MetaChip>
              <PurposeIcon purpose={input.purpose} className="h-3.5 w-3.5 text-aqua-300" />
              {PURPOSE_LABELS[input.purpose]}
            </MetaChip>
            <MetaChip>{TONE_LABELS[input.tone]}</MetaChip>
            <MetaChip>{LENGTH_LABELS[input.length]}</MetaChip>
            <MetaChip>{LANG_LABELS[input.language]}</MetaChip>
            <MetaChip>{wordCount(email)} words</MetaChip>
          </div>
        </div>

        {editing ? (
          <div className="space-y-3 bg-ink-950/45 p-4 sm:p-6">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-mist-400">
                Subject
              </label>
              <input className="field" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-mist-400">
                Greeting
              </label>
              <input className="field" value={draft.greeting} onChange={(e) => setDraft({ ...draft, greeting: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-mist-400">
                Body
              </label>
              <textarea
                className="field min-h-[180px] resize-y leading-relaxed"
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-mist-400">
                Closing
              </label>
              <textarea
                className="field min-h-[70px] resize-y leading-relaxed"
                value={draft.closing}
                onChange={(e) => setDraft({ ...draft, closing: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" icon={<IconPencil className="h-4 w-4" />} onClick={saveEdit}>
                Save changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-ink-950/45 px-4 py-5 sm:px-7 sm:py-6">
            <div className="mb-4 flex flex-wrap items-baseline gap-x-8 gap-y-1 text-[13px]">
              <span className="text-mist-400">
                To: <span className="font-medium text-mist-200">{toLabel}</span>
              </span>
              <span className="text-mist-400">
                From: <span className="font-medium text-mist-200">Aarav Mehta</span>
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold leading-snug text-mist-100 sm:text-[22px]">
              {email.subject}
            </h3>
            <div className="email-body mt-4 max-w-[62ch] text-[15px] leading-relaxed text-mist-200/95">
              <p className="font-medium text-mist-100">{email.greeting}</p>
              {renderBody()}
              <div className="mt-1 whitespace-pre-line font-medium text-mist-100">{email.closing}</div>
            </div>
          </div>
        )}

        {/* improve with AI */}
        <div className="border-t border-white/8 px-4 py-3.5 sm:px-6">
          <div className="mb-2.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-mist-400">
            <IconWand className="h-4 w-4 text-ember-300" />
            Improve with AI
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(IMPROVE_LABELS) as ImproveOp[]).map((op) => (
              <Chip key={op} onClick={() => onImprove(op)} disabled={improving !== null} className="h-8 px-2.5 text-[12px]">
                {improving === op ? <Spinner className="h-3.5 w-3.5" /> : <IconSpark className="h-3.5 w-3.5 text-aqua-300" />}
                {IMPROVE_LABELS[op]}
              </Chip>
            ))}
          </div>
        </div>

        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/8 px-4 py-3.5 sm:px-6">
          <Button variant="secondary" size="sm" icon={<IconCopy className="h-4 w-4" />} onClick={doCopy}>
            Copy
          </Button>
          <Button variant="secondary" size="sm" icon={<IconPencil className="h-4 w-4" />} onClick={startEdit}>
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            loading={regenBusy}
            icon={<IconRefresh className="h-4 w-4" />}
            onClick={onRegenerate}
          >
            Regenerate
          </Button>
          <Button variant="secondary" size="sm" icon={<IconDownload className="h-4 w-4" />} onClick={doDownload}>
            Download
          </Button>
          <Button
            variant={saved ? "soft" : "secondary"}
            size="sm"
            icon={saved ? <IconCheck className="h-4 w-4 text-aqua-300" /> : <IconSave className="h-4 w-4" />}
            onClick={onSave}
            disabled={saved}
          >
            {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="primary" size="sm" className="ml-auto" icon={<IconSend className="h-4 w-4" />} onClick={doSend}>
            Send Email
          </Button>
        </div>

        {/* AI suggestions */}
        <div className="border-t border-white/8 px-4 py-3.5 sm:px-6">
          <div className="mb-2.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-mist-400">
            <IconTarget className="h-4 w-4 text-aqua-300" />
            AI suggestions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => {
              const done = applied.includes(s.id);
              return (
                <Chip
                  key={s.id}
                  className="h-8 px-2.5 text-[12px]"
                  active={done}
                  onClick={() => {
                    if (done) return;
                    setApplied((prev) => [...prev, s.id]);
                    onSuggestionApply(s.label, s.text);
                  }}
                  disabled={done}
                >
                  {done ? <IconCheck className="h-3.5 w-3.5" /> : <IconSpark className="h-3.5 w-3.5 text-ember-300" />}
                  {s.label}
                </Chip>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
