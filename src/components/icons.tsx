import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import type { Purpose } from "../lib/types";

type P = { className?: string };

function Svg({ className, children }: P & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-[1.15em] w-[1.15em] shrink-0", className)}
    >
      {children}
    </svg>
  );
}

export const IconLogo = ({ className }: P) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("h-7 w-7", className)}>
    <rect x="3" y="8" width="26" height="18" rx="5" fill="#0c2530" stroke="#38e2c6" strokeWidth="2" />
    <path d="M6 12l10 7 10-7" stroke="#38e2c6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="26" cy="8" r="5" fill="#ffc266" />
    <path d="M26 5.6l0.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" fill="#0c2530" />
  </svg>
);

export const IconSpark = ({ className }: P) => (
  <Svg className={className}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M18.5 15.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" />
  </Svg>
);

export const IconSend = ({ className }: P) => (
  <Svg className={className}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4z" />
  </Svg>
);

export const IconCopy = ({ className }: P) => (
  <Svg className={className}>
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5 15H4.5A1.5 1.5 0 013 13.5v-9A1.5 1.5 0 014.5 3h9A1.5 1.5 0 0115 4.5V5" />
  </Svg>
);

export const IconPencil = ({ className }: P) => (
  <Svg className={className}>
    <path d="M17 3a2.8 2.8 0 114 4L7.5 20.5 2 22l1.5-5.5z" />
  </Svg>
);

export const IconRefresh = ({ className }: P) => (
  <Svg className={className}>
    <path d="M21 12a9 9 0 11-2.6-6.3" />
    <path d="M21 3v6h-6" />
  </Svg>
);

export const IconDownload = ({ className }: P) => (
  <Svg className={className}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <path d="M7 10l5 5 5-5" />
    <path d="M12 15V3" />
  </Svg>
);

export const IconSave = ({ className }: P) => (
  <Svg className={className}>
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </Svg>
);

export const IconTrash = ({ className }: P) => (
  <Svg className={className}>
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </Svg>
);

export const IconSearch = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Svg>
);

export const IconPlus = ({ className }: P) => (
  <Svg className={className}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const IconMail = ({ className }: P) => (
  <Svg className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2.5 7l9.5 6.5L21.5 7" />
  </Svg>
);

export const IconClock = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const IconCheck = ({ className }: P) => (
  <Svg className={className}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);

export const IconX = ({ className }: P) => (
  <Svg className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

export const IconWand = ({ className }: P) => (
  <Svg className={className}>
    <path d="M15 4V2M15 10V8M11.5 6.5h-2M20.5 6.5h-2" />
    <path d="M17.8 8.2L3.5 22.5l-2-2L15.8 6.2z" fill="none" />
    <path d="M12 2l.7 1.8L14.5 4.5l-1.8.7L12 7l-.7-1.8-1.8-.7 1.8-.7z" />
  </Svg>
);

export const IconActivity = ({ className }: P) => (
  <Svg className={className}>
    <path d="M22 12h-4l-3 8L9 4l-3 8H2" />
  </Svg>
);

export const IconInbox = ({ className }: P) => (
  <Svg className={className}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5h13L22 12v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z" />
  </Svg>
);

export const IconEye = ({ className }: P) => (
  <Svg className={className}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const IconUser = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
  </Svg>
);

export const IconBuilding = ({ className }: P) => (
  <Svg className={className}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" />
  </Svg>
);

export const IconGlobe = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14.5 14.5 0 010 18M12 3a14.5 14.5 0 000 18" />
  </Svg>
);

export const IconAlert = ({ className }: P) => (
  <Svg className={className}>
    <path d="M12 3l10 18H2z" />
    <path d="M12 10v4M12 17.5v.5" />
  </Svg>
);

export const IconInfo = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8v.5" />
  </Svg>
);

export const IconBriefcase = ({ className }: P) => (
  <Svg className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2.5" />
    <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    <path d="M2 13h20" />
  </Svg>
);

export const IconRepeat = ({ className }: P) => (
  <Svg className={className}>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11V9a4 4 0 014-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 01-4 4H3" />
  </Svg>
);

export const IconFileText = ({ className }: P) => (
  <Svg className={className}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h6M9 17h6" />
  </Svg>
);

export const IconCalendar = ({ className }: P) => (
  <Svg className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2.5" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M9 16l2 2 4-4" />
  </Svg>
);

export const IconLifeBuoy = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="M5.7 5.7l3.8 3.8M14.5 14.5l3.8 3.8M18.3 5.7l-3.8 3.8M9.5 14.5l-3.8 3.8" />
  </Svg>
);

export const IconMegaphone = ({ className }: P) => (
  <Svg className={className}>
    <path d="M3 11v3a1 1 0 001 1h2l3.5 4.5a1 1 0 001.8-.6V6.1a1 1 0 00-1.8-.6L6 10H4a1 1 0 00-1 1z" />
    <path d="M14 8.5a5 5 0 010 8" />
    <path d="M17.5 5.5a9.5 9.5 0 010 14" />
  </Svg>
);

export const IconHeart = ({ className }: P) => (
  <Svg className={className}>
    <path d="M12 21S3 14.5 3 8.8C3 5.9 5.2 4 7.7 4c1.7 0 3.3.9 4.3 2.4C13 4.9 14.6 4 16.3 4 18.8 4 21 5.9 21 8.8 21 14.5 12 21 12 21z" />
  </Svg>
);

export const IconSliders = ({ className }: P) => (
  <Svg className={className}>
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
    <path d="M1.5 14h5M9.5 8h5M17.5 16h5" />
  </Svg>
);

export const IconTarget = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </Svg>
);

export const IconType = ({ className }: P) => (
  <Svg className={className}>
    <path d="M4 7V4h16v3" />
    <path d="M12 4v16" />
    <path d="M9 20h6" />
  </Svg>
);

export const IconScissors = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M8.5 7.5L20 20M8.5 16.5L20 4" />
  </Svg>
);

export const IconMaximize = ({ className }: P) => (
  <Svg className={className}>
    <path d="M15 3h6v6M9 21H3v-6" />
    <path d="M21 3l-7 7M3 21l7-7" />
  </Svg>
);

export const IconBolt = ({ className }: P) => (
  <Svg className={className}>
    <path d="M13 2L3 14h7l-1 8 11-13h-7z" />
  </Svg>
);

export const IconChevronDown = ({ className }: P) => (
  <Svg className={className}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);

export const IconArrowRight = ({ className }: P) => (
  <Svg className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const IconDashboard = ({ className }: P) => (
  <Svg className={className}>
    <rect x="3" y="3" width="8" height="10" rx="1.5" />
    <rect x="13" y="3" width="8" height="6" rx="1.5" />
    <rect x="13" y="11" width="8" height="10" rx="1.5" />
    <rect x="3" y="15" width="8" height="6" rx="1.5" />
  </Svg>
);

const PURPOSE_ICONS: Record<Purpose, (p: P) => ReactNode> = {
  job: IconBriefcase,
  followup: IconRepeat,
  proposal: IconFileText,
  meeting: IconCalendar,
  support: IconLifeBuoy,
  marketing: IconMegaphone,
  thanks: IconHeart,
  custom: IconSliders,
};

export function PurposeIcon({ purpose, className }: { purpose: Purpose; className?: string }) {
  const C = PURPOSE_ICONS[purpose];
  return <>{C({ className })}</>;
}
