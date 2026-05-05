import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { useStore, type Plan } from "@/lib/store";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — together." },
      { name: "description", content: "Free, weekly and monthly plans for together. ride matching." },
    ],
  }),
  component: Pricing,
});

const tiers: { id: Plan; name: string; price: string; per: string; perks: string[]; highlight?: boolean }[] = [
  { id: "free", name: "Free", price: "₹0", per: "forever", perks: ["2 profile unlocks total", "Post your ride", "Basic matching"] },
  { id: "weekly", name: "Weekly pass", price: "₹19", per: "7 days", perks: ["10 unlocks per day", "Priority matching", "All connect options"] },
  { id: "monthly", name: "Monthly", price: "₹49", per: "30 days", perks: ["Unlimited unlocks", "Priority matching", "Boosted ride post visibility"], highlight: true },
];

function Pricing() {
  const { plan, upgrade } = useStore();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-32 lg:px-8 lg:pt-16">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Pricing</p>
          <h1 className="mt-2 text-3xl font-bold lg:text-5xl">Simple, fair, ride-shared</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground lg:text-base">
            Start free. Upgrade only when you want more matches.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => {
            const current = plan === t.id;
            return (
              <div
                key={t.id}
                className={`relative rounded-3xl border p-7 ${
                  t.highlight ? "border-primary bg-primary/5 shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--color-primary)_50%,transparent)]" : "border-border bg-card"
                }`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Most popular
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <h3 className="font-semibold">{t.name}</h3>
                </div>
                <p className="mt-4">
                  <span className="text-4xl font-bold">{t.price}</span>
                  <span className="ml-2 text-sm text-muted-foreground">/ {t.per}</span>
                </p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <Check className="size-4 text-primary" /> {p}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={current}
                  onClick={() => upgrade(t.id)}
                  className={`mt-7 w-full rounded-full py-3 text-sm font-semibold transition ${
                    current
                      ? "bg-secondary text-muted-foreground"
                      : t.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground text-background"
                  }`}
                >
                  {current ? "Current plan" : t.id === "free" ? "Downgrade" : `Pay ${t.price}`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Razorpay integration coming soon. Plan unlocks are simulated.
        </p>
      </div>
      <BottomNav />
    </main>
  );
}
