export type Purpose =
  | "job"
  | "followup"
  | "proposal"
  | "meeting"
  | "support"
  | "marketing"
  | "thanks"
  | "custom";

export type Tone = "professional" | "friendly" | "formal" | "persuasive" | "casual";
export type LengthOpt = "short" | "medium" | "detailed";
export type Lang = "en" | "hi" | "te" | "ta";

export interface Recipient {
  name: string;
  role: string;
  company: string;
}

export interface GenInput {
  purpose: Purpose;
  recipient: Recipient;
  description: string;
  tone: Tone;
  length: LengthOpt;
  language: Lang;
}

export interface GeneratedEmail {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
}

export interface StoredEmail extends GeneratedEmail {
  id: string;
  input: GenInput;
  createdAt: number;
  updatedAt: number;
}

export type ActivityType =
  | "generate"
  | "save"
  | "edit"
  | "delete"
  | "copy"
  | "download"
  | "send"
  | "improve";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  label: string;
  ts: number;
}

export type ImproveOp =
  | "professional"
  | "shorter"
  | "friendlier"
  | "grammar"
  | "persuasive"
  | "longer";

export interface Suggestion {
  id: string;
  label: string;
  text: Record<Lang, string>;
}

export const PURPOSE_LABELS: Record<Purpose, string> = {
  job: "Job Application",
  followup: "Follow-up",
  proposal: "Business Proposal",
  meeting: "Meeting Request",
  support: "Customer Support",
  marketing: "Marketing",
  thanks: "Thank You",
  custom: "Custom",
};

export const TONE_LABELS: Record<Tone, string> = {
  professional: "Professional",
  friendly: "Friendly",
  formal: "Formal",
  persuasive: "Persuasive",
  casual: "Casual",
};

export const LENGTH_LABELS: Record<LengthOpt, string> = {
  short: "Short",
  medium: "Medium",
  detailed: "Detailed",
};

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
};

export const LANG_OPTIONS: { value: Lang | "other"; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "te", label: "Telugu" },
  { value: "ta", label: "Tamil" },
  { value: "other", label: "Other" },
];

export const SIGNATURE_NAME = "Aarav Mehta";
