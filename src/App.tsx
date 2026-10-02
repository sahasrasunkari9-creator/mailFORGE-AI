import { useEffect, useState } from "react";
import Scene3D from "./components/Scene3D";
import { detectApi, onApiMode, type ApiMode } from "./lib/api";
import Generator from "./components/Generator";
import Dashboard from "./components/Dashboard";
import { ToastProvider } from "./components/Toast";
import { Button } from "./components/ui";
import { cn } from "./utils/cn";
import {
  IconArrowRight,
  IconBolt,
  IconDashboard,
  IconGlobe,
  IconLogo,
  IconScissors,
  IconSliders,
  IconSpark,
  IconTarget,
  IconType,
  IconWand,
} from "./components/icons";

type View = "home" | "dashboard";

const FEATURES = [
  { icon: <IconTarget className="h-4 w-4" />, label: "Smart subject lines" },
  { icon: <IconSliders className="h-4 w-4" />, label: "Tone transformation" },
  { icon: <IconType className="h-4 w-4" />, label: "Grammar correction" },
  { icon: <IconGlobe className="h-4 w-4" />, label: "Multi-language drafting" },
  { icon: <IconScissors className="h-4 w-4" />, label: "Shorten & expand" },
  { icon: <IconWand className="h-4 w-4" />, label: "Personalized suggestions" },
];

function Nav({ view, setView, apiMode }: { view: View; setView: (v: View) => void; apiMode: ApiMode }) {
  const tabs: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Generator", icon: <IconSpark className="h-4 w-4" /> },
    { id: "dashboard", label: "Dashboard", icon: <IconDashboard className="h-4 w-4" /> },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-ink-950/65 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
          onClick={() => setView("home")}
          aria-label="MailForge AI home"
        >
          <IconLogo />
          <span className="font-display text-[17px] font-semibold tracking-tight text-mist-100">
            MailForge <span className="text-aqua-300">AI</span>
          </span>
        </button>

        <nav className="ml-auto flex items-center gap-1 rounded-xl border border-white/8 bg-white/[0.03] p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-all duration-200",
                view === t.id
                  ? "bg-aqua-400/15 text-aqua-200 shadow-[inset_0_0_0_1px_rgba(56,226,198,0.35)]"
                  : "text-mist-400 hover:bg-white/5 hover:text-mist-100"
              )}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </nav>

        <span
          className={cn(
            "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] transition-colors md:flex",
            apiMode === "cloud"
              ? "border-aqua-400/30 bg-aqua-400/10 text-aqua-300"
              : "border-ember-400/30 bg-ember-400/10 text-ember-300"
          )}
          title={
            apiMode === "cloud"
              ? "Connected to the MailForge cloud API"
              : "Backend not reachable — using the on-device engine"
          }
        >
          <span className="anim-pulse-dot h-1.5 w-1.5 rounded-full bg-current" />
          {apiMode === "cloud" ? "Cloud API" : "Local engine"}
        </span>
      </div>
    </header>
  );
}

function Hero({ onGenerate, onDemo }: { onGenerate: () => void; onDemo: () => void }) {
  return (
    <div className="max-w-xl">
      <span className="glass-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11.5px] font-semibold text-aqua-200">
        <IconBolt className="h-3.5 w-3.5 text-ember-300" />
        AI email studio
      </span>
      <h1 className="mt-5 font-display text-[2.5rem] font-semibold leading-[1.06] tracking-tight text-mist-100 sm:text-5xl xl:text-[3.5rem]">
        Write Better
        <br />
        Emails with <span className="text-glow text-aqua-300">AI</span>
      </h1>
      <p className="mt-5 max-w-md text-[16px] leading-relaxed text-mist-300 sm:text-lg">
        Generate professional, personalized emails in seconds with the power of AI.
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Button variant="primary" size="lg" icon={<IconSpark className="h-4.5 w-4.5" />} onClick={onGenerate}>
          Generate Email
        </Button>
        <Button variant="secondary" size="lg" icon={<IconArrowRight className="h-4.5 w-4.5" />} onClick={onDemo}>
          Try Demo
        </Button>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-[12.5px] text-mist-500">
        <span className="font-medium text-mist-400">Describe it</span>
        <IconArrowRight className="h-3.5 w-3.5 text-aqua-400/70" />
        <span className="font-medium text-mist-400">AI drafts it</span>
        <IconArrowRight className="h-3.5 w-3.5 text-aqua-400/70" />
        <span className="font-medium text-mist-400">You send it</span>
        <span className="ml-2 hidden h-1 w-1 rounded-full bg-mist-500 sm:block" />
        <span className="hidden sm:inline">English · Hindi · Telugu · Tamil</span>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [demoTick, setDemoTick] = useState(0);
  const [focusTick, setFocusTick] = useState(0);
  const [apiMode, setApiMode] = useState<ApiMode>("local");

  useEffect(() => {
    let mounted = true;
    void detectApi().then((m) => {
      if (mounted) setApiMode(m);
    });
    const off = onApiMode((m) => {
      if (mounted) setApiMode(m);
    });
    return () => {
      mounted = false;
      off();
    };
  }, []);

  const goNewEmail = () => {
    setView("home");
    window.scrollTo({ top: 0 });
    setFocusTick((t) => t + 1);
  };

  return (
    <ToastProvider>
      <Scene3D />
      {/* atmospheric overlays */}
      <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_600px_at_72%_-10%,rgba(56,226,198,0.13),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(850px_500px_at_5%_110%,rgba(255,194,102,0.07),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(4,7,12,0.6)_100%)]" />
      </div>

      <Nav view={view} setView={setView} apiMode={apiMode} />

      <main className="relative z-10 pt-16">
        {view === "home" ? (
          <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
            <section className="grid gap-10 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-8">
              <div className="anim-fade-up lg:col-span-5">
                <Hero
                  onGenerate={() => setFocusTick((t) => t + 1)}
                  onDemo={() => setDemoTick((t) => t + 1)}
                />
              </div>
              <div className="anim-fade-up lg:col-span-7" style={{ animationDelay: "90ms" }}>
                <Generator demoTick={demoTick} focusTick={focusTick} />
              </div>
            </section>

            {/* capabilities band */}
            <section className="mt-14">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-display text-[15px] font-semibold text-mist-200">What the engine does</h2>
                <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
                {FEATURES.map((f, i) => (
                  <div
                    key={f.label}
                    className="glass-soft group flex items-center gap-2.5 rounded-xl px-3.5 py-3 transition-all duration-300 hover:border-aqua-400/30 hover:bg-aqua-400/5"
                    style={{ transitionDelay: `${i * 20}ms` }}
                  >
                    <span className="text-aqua-300 transition-transform duration-300 group-hover:scale-110">{f.icon}</span>
                    <span className="text-[12.5px] font-medium text-mist-300 group-hover:text-mist-100">{f.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <Dashboard onNewEmail={goNewEmail} />
        )}
      </main>

      <footer className="relative z-10 border-t border-white/5 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-[12px] text-mist-500 sm:px-6">
          <span className="flex items-center gap-2">
            <IconLogo className="h-5 w-5" />
            MailForge AI — an AI email studio
          </span>
          <span>Every email stays on your device. No accounts, no tracking.</span>
        </div>
      </footer>
    </ToastProvider>
  );
}
