import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiDeleteEmail,
  apiListEmails,
  apiLoadActivity,
  apiUpdateEmail,
  track,
  type ApiMode,
} from "../lib/api";
import { copyToClipboard } from "../lib/clipboard";
import { emailToPlainText } from "../lib/engine";
import { timeAgo } from "../lib/store";
import {
  LANG_LABELS,
  PURPOSE_LABELS,
  TONE_LABELS,
  type ActivityItem,
  type ActivityType,
  type GeneratedEmail,
  type Purpose,
  type StoredEmail,
} from "../lib/types";
import { useToast } from "./Toast";
import { Button, Chip, GlassCard, Modal } from "./ui";
import {
  IconActivity,
  IconCopy,
  IconDownload,
  IconInbox,
  IconMail,
  IconPencil,
  IconPlus,
  IconSearch,
  IconSend,
  IconSpark,
  IconTrash,
  IconWand,
  PurposeIcon,
} from "./icons";

const ACTIVITY_META: Record<ActivityType, { icon: React.ReactNode; cls: string }> = {
  generate: { icon: <IconSpark className="h-3.5 w-3.5" />, cls: "bg-aqua-400/15 text-aqua-300" },
  save: { icon: <IconMail className="h-3.5 w-3.5" />, cls: "bg-aqua-400/15 text-aqua-300" },
  edit: { icon: <IconPencil className="h-3.5 w-3.5" />, cls: "bg-ember-400/15 text-ember-300" },
  delete: { icon: <IconTrash className="h-3.5 w-3.5" />, cls: "bg-danger-400/15 text-danger-300" },
  copy: { icon: <IconCopy className="h-3.5 w-3.5" />, cls: "bg-white/8 text-mist-300" },
  download: { icon: <IconDownload className="h-3.5 w-3.5" />, cls: "bg-white/8 text-mist-300" },
  send: { icon: <IconSend className="h-3.5 w-3.5" />, cls: "bg-aqua-400/15 text-aqua-300" },
  improve: { icon: <IconWand className="h-3.5 w-3.5" />, cls: "bg-ember-400/15 text-ember-300" },
};

const ALL_PURPOSES: Purpose[] = ["job", "followup", "proposal", "meeting", "support", "marketing", "thanks", "custom"];

export default function Dashboard({ onNewEmail }: { onNewEmail: () => void }) {
  const { push } = useToast();
  const [emails, setEmails] = useState<StoredEmail[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [source, setSource] = useState<ApiMode | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Purpose | "all">("all");
  const [editing, setEditing] = useState<StoredEmail | null>(null);
  const [deleting, setDeleting] = useState<StoredEmail | null>(null);
  const [draft, setDraft] = useState<GeneratedEmail>({ subject: "", greeting: "", body: "", closing: "" });

  const refresh = useCallback(async () => {
    const [e, a] = await Promise.all([apiListEmails(), apiLoadActivity()]);
    setEmails(e.data);
    setActivity(a.data);
    setSource(e.source);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return emails.filter((e) => {
      if (filter !== "all" && e.input.purpose !== filter) return false;
      if (!q) return true;
      const hay = [e.subject, e.body, e.greeting, e.closing, e.input.recipient.name, e.input.recipient.role, e.input.recipient.company].join(" ").toLowerCase();
      const desc = e.input.description.toLowerCase();
      return hay.includes(q) || desc.includes(q);
    });
  }, [emails, query, filter]);

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    const langs = new Set(emails.map((e) => e.input.language));
    return {
      total: emails.length,
      week: emails.filter((e) => e.createdAt >= weekAgo).length,
      langs: langs.size,
    };
  }, [emails]);

  const openEdit = (e: StoredEmail) => {
    setDraft({ subject: e.subject, greeting: e.greeting, body: e.body, closing: e.closing });
    setEditing(e);
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!draft.subject.trim()) {
      push("error", "Subject cannot be empty.");
      return;
    }
    await apiUpdateEmail(editing.id, draft);
    track("edit", `Edited "${draft.subject}"`);
    void refresh();
    push("success", "Email updated in your library.");
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await apiDeleteEmail(deleting.id);
    track("delete", `Deleted "${deleting.subject}"`);
    void refresh();
    push("success", `Deleted "${deleting.subject}".`);
    setDeleting(null);
  };

  const copyEmail = async (e: StoredEmail) => {
    const ok = await copyToClipboard(emailToPlainText(e));
    if (ok) {
      track("copy", `Copied "${e.subject}"`);
      void refresh();
      push("success", "Email copied to clipboard.");
    } else {
      push("error", "Copy failed — clipboard access blocked.");
    }
  };

  return (
    <div className="anim-fade-up mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-mist-100 sm:text-3xl">Email Library</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-mist-400">
            {emails.length} saved {emails.length === 1 ? "email" : "emails"} · {stats.week} this week
            {source !== null && (
              <span
                className={
                  source === "cloud"
                    ? "glass-chip inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold text-aqua-300"
                    : "glass-chip inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold text-ember-300"
                }
              >
                <span className="anim-pulse-dot h-1.5 w-1.5 rounded-full bg-current" />
                {source === "cloud" ? "Synced with cloud API" : "Stored on this device"}
              </span>
            )}
          </p>
        </div>
        <Button variant="primary" icon={<IconPlus className="h-4 w-4" />} onClick={onNewEmail}>
          New Email
        </Button>
      </div>

      {/* search + filters */}
      <div className="mb-5 space-y-3">
        <div className="relative max-w-md">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
          <input
            className="field pl-10"
            placeholder="Search subject, body, recipient…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="scrollbar-slim -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          <Chip active={filter === "all"} onClick={() => setFilter("all")} className="h-8 shrink-0 px-3 text-[12px]">
            All
          </Chip>
          {ALL_PURPOSES.map((p) => (
            <Chip key={p} active={filter === p} onClick={() => setFilter(p)} className="h-8 shrink-0 px-2.5 text-[12px]">
              <PurposeIcon purpose={p} className="h-3.5 w-3.5" />
              {PURPOSE_LABELS[p]}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* list */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="glass space-y-3 rounded-2xl p-5" aria-hidden="true">
              <div className="anim-shimmer h-5 w-2/3 rounded-md" />
              <div className="anim-shimmer h-16 w-full rounded-lg" />
              <div className="anim-shimmer h-16 w-full rounded-lg" />
              <p className="pt-1 text-center text-[12px] text-mist-500">Loading your library…</p>
            </div>
          ) : emails.length === 0 ? (
            <div className="glass flex flex-col items-center rounded-2xl border-dashed px-6 py-16 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-aqua-400/10 text-aqua-300">
                <IconInbox className="h-7 w-7" />
              </span>
              <h3 className="font-display text-lg font-semibold text-mist-100">No emails yet</h3>
              <p className="mt-1 max-w-xs text-sm text-mist-400">
                Generate your first email and hit <span className="text-mist-200">Save</span> — it will land here, ready to
                search, edit and resend.
              </p>
              <Button variant="primary" className="mt-5" icon={<IconSpark className="h-4 w-4" />} onClick={onNewEmail}>
                Create your first email
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass flex flex-col items-center rounded-2xl px-6 py-14 text-center">
              <IconSearch className="mb-3 h-8 w-8 text-mist-500" />
              <h3 className="font-display text-base font-semibold text-mist-100">No matches</h3>
              <p className="mt-1 text-sm text-mist-400">
                Nothing found{query ? ` for “${query}”` : ""} in this view. Try a different search or filter.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((e) => (
                <GlassCard key={e.id} hover className="group flex flex-col p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="glass-chip inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-aqua-300">
                      <PurposeIcon purpose={e.input.purpose} className="h-3.5 w-3.5" />
                      {PURPOSE_LABELS[e.input.purpose]}
                    </span>
                    <span className="text-[11px] text-mist-500">{timeAgo(e.updatedAt)}</span>
                  </div>
                  <h3 className="font-display text-[15px] font-semibold leading-snug text-mist-100">{e.subject}</h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-mist-400">{e.body.replace(/^- /gm, "")}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-mist-500">
                    <span className="rounded-md bg-white/5 px-1.5 py-0.5">{TONE_LABELS[e.input.tone]}</span>
                    <span className="rounded-md bg-white/5 px-1.5 py-0.5">{e.input.length}</span>
                    <span className="rounded-md bg-white/5 px-1.5 py-0.5">{LANG_LABELS[e.input.language]}</span>
                    {e.input.recipient.name && (
                      <span className="rounded-md bg-white/5 px-1.5 py-0.5">to {e.input.recipient.name}</span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-1.5 border-t border-white/6 pt-3">
                    <Button variant="ghost" size="sm" icon={<IconPencil className="h-3.5 w-3.5" />} onClick={() => openEdit(e)}>
                      View / Edit
                    </Button>
                    <Button variant="ghost" size="sm" icon={<IconCopy className="h-3.5 w-3.5" />} onClick={() => void copyEmail(e)}>
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-danger-300 hover:bg-danger-500/10 hover:text-danger-300"
                      icon={<IconTrash className="h-3.5 w-3.5" />}
                      onClick={() => setDeleting(e)}
                    >
                      Delete
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* sidebar */}
        <div className="space-y-4 lg:col-span-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total", value: stats.total },
              { label: "This week", value: stats.week },
              { label: "Languages", value: stats.langs },
            ].map((s) => (
              <GlassCard key={s.label} className="p-3.5 text-center">
                <div className="font-display text-2xl font-semibold text-aqua-300">{s.value}</div>
                <div className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.1em] text-mist-500">{s.label}</div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-4">
            <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-mist-400">
              <IconActivity className="h-4 w-4 text-aqua-300" />
              Recent activity
            </div>
            {activity.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-mist-500">
                Your activity will appear here as you generate, edit and send emails.
              </p>
            ) : (
              <ul className="space-y-1">
                {activity.slice(0, 12).map((a) => (
                  <li key={a.id} className="flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${ACTIVITY_META[a.type].cls}`}
                    >
                      {ACTIVITY_META[a.type].icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium text-mist-200">{a.label}</p>
                      <p className="text-[11px] text-mist-500">{timeAgo(a.ts)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>
      </div>

      {/* edit modal */}
      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Edit email" wide>
        {editing && (
          <div className="space-y-3">
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
                className="field min-h-[190px] resize-y leading-relaxed"
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
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button variant="primary" icon={<IconPencil className="h-4 w-4" />} onClick={() => void saveEdit()}>
                Save changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* delete modal */}
      <Modal open={deleting !== null} onClose={() => setDeleting(null)} title="Delete email?">
        {deleting && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-mist-300">
              This will permanently remove{" "}
              <span className="font-semibold text-mist-100">“{deleting.subject}”</span> from your library. This cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeleting(null)}>
                Cancel
              </Button>
              <Button variant="danger" icon={<IconTrash className="h-4 w-4" />} onClick={() => void confirmDelete()}>
                Delete email
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
