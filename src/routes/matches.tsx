import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { useStore, generateMatches, type MatchProfile } from "@/lib/store";
import {
  BadgeCheck,
  Instagram,
  Lock,
  MessageCircle,
  Send,
  Star,
  X,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/matches")({
  head: () => ({ meta: [{ title: "Your matches — together." }] }),
  component: Matches,
});

function Matches() {
  const { lastQuery, signedIn, unlockedIds, unlock, canUnlock } = useStore();
  const navigate = useNavigate();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const matches = generateMatches(lastQuery);

  function handleOpen(m: MatchProfile) {
    if (!signedIn) {
      navigate({ to: "/login" });
      return;
    }
    if (unlockedIds.includes(m.id)) return;
    if (canUnlock()) unlock(m.id);
    else setPaywallOpen(true);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 pt-8 pb-32 lg:px-8 lg:pt-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Live matches</p>
            <h1 className="mt-2 text-3xl font-bold lg:text-4xl">
              {lastQuery ? `${lastQuery.pickup || "Anywhere"} → ${lastQuery.drop || "Anywhere"}` : "All matches"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {matches.length} riders matched · {unlockedIds.length} unlocked
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => {
            const unlocked = unlockedIds.includes(m.id);
            return (
              <MatchCard key={m.id} m={m} unlocked={unlocked} onOpen={() => handleOpen(m)} />
            );
          })}
        </div>
      </div>

      {paywallOpen && <Paywall onClose={() => setPaywallOpen(false)} />}
      <BottomNav />
    </main>
  );
}

function MatchCard({ m, unlocked, onOpen }: { m: MatchProfile; unlocked: boolean; onOpen: () => void }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5 transition hover:border-primary/40">
      <div className="flex items-center gap-3">
        <div className={`size-14 rounded-full bg-gradient-to-br ${m.avatar}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold">{m.name}</p>
            <BadgeCheck className="size-4 text-primary" />
          </div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-primary text-primary" /> {m.rating.toFixed(1)} · {m.timing}
          </p>
        </div>
        <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
          {m.overlapPct}%
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-background/60 p-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-foreground" />
          <span className="font-medium">{m.pickup}</span>
        </div>
        <div className="my-1 ml-[3px] h-3 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary" />
          <span className="font-medium">{m.drop}</span>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">"{m.bio}"</p>

      {unlocked ? (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ConnectBtn method="whatsapp" id={m.connectId} active={m.connect === "whatsapp"} />
          <ConnectBtn method="instagram" id={m.connectId} active={m.connect === "instagram"} />
          <ConnectBtn method="telegram" id={m.connectId} active={m.connect === "telegram"} />
        </div>
      ) : (
        <button
          onClick={onOpen}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Lock className="size-4" /> Unlock contact
        </button>
      )}
    </article>
  );
}

function ConnectBtn({ method, id, active }: { method: "whatsapp" | "instagram" | "telegram"; id: string; active: boolean }) {
  const meta = {
    whatsapp: { label: "WhatsApp", Icon: MessageCircle, href: `https://wa.me/${id.replace(/[^\d]/g, "")}` },
    instagram: { label: "Instagram", Icon: Instagram, href: `https://instagram.com/${id.replace("@", "")}` },
    telegram: { label: "Telegram", Icon: Send, href: `https://t.me/${id.replace("@", "")}` },
  }[method];
  return (
    <a
      href={meta.href}
      target="_blank"
      rel="noreferrer"
      className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-[10px] font-medium transition ${
        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"
      }`}
    >
      <meta.Icon className="size-4" />
      {meta.label}
    </a>
  );
}

function Paywall({ onClose }: { onClose: () => void }) {
  const { upgrade } = useStore();

  function pick(plan: "weekly" | "monthly") {
    upgrade(plan);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-5 backdrop-blur">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-7">
        <button onClick={onClose} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-secondary">
          <X className="size-4" />
        </button>
        <Sparkles className="size-8 text-primary" />
        <h2 className="mt-3 text-2xl font-bold">Unlock more matches</h2>
        <p className="mt-1 text-sm text-muted-foreground">You've used your 2 free unlocks. Pick a plan to keep connecting.</p>

        <div className="mt-6 space-y-3">
          <PlanRow title="Free" price="₹0" desc="2 profiles total" current />
          <PlanRow title="Weekly pass" price="₹19" desc="10 profiles / day for 7 days" cta="Pay ₹19" onClick={() => pick("weekly")} />
          <PlanRow title="Monthly" price="₹49" desc="Unlimited profiles for 30 days" highlight cta="Pay ₹49" onClick={() => pick("monthly")} />
        </div>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">Razorpay coming soon. Mock unlock for now.</p>
        <Link to="/pricing" className="mt-2 block text-center text-xs font-medium text-primary">See full pricing</Link>
      </div>
    </div>
  );
}

function PlanRow({ title, price, desc, cta, onClick, current, highlight }: { title: string; price: string; desc: string; cta?: string; onClick?: () => void; current?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-2xl border p-4 ${highlight ? "border-primary bg-primary/5" : "border-border"}`}>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold">{title}</p>
          {current && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">CURRENT</span>}
          {highlight && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">BEST</span>}
        </div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold">{price}</p>
        {cta && (
          <button onClick={onClick} className="mt-1 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
            {cta}
          </button>
        )}
      </div>
    </div>
  );
}
