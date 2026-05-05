import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Search as SearchIcon, MapPin, Building2, GraduationCap, Share2, MessageCircle, Smartphone } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — together." }] }),
  component: SearchPage,
});

const orgs = [
  { name: "IIT Bombay", type: "college", area: "Powai" },
  { name: "VJTI Mumbai", type: "college", area: "Matunga" },
  { name: "TCS BKC", type: "office", area: "Bandra Kurla Complex" },
  { name: "Infosys Hinjewadi", type: "office", area: "Pune" },
  { name: "St. Xavier's College", type: "college", area: "Fort" },
  { name: "Reliance Corporate Park", type: "office", area: "Ghansoli" },
];

function SearchPage() {
  const [q, setQ] = useState("");
  const filtered = orgs.filter((o) => o.name.toLowerCase().includes(q.toLowerCase()));
  const referralMsg = encodeURIComponent("Hey! Try together. — find verified ride partners going your way. https://together.app");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 pt-8 pb-32 lg:pt-12">
        <h1 className="text-3xl font-bold lg:text-4xl">Find a ride</h1>
        <p className="mt-1 text-sm text-muted-foreground">Search by your college, office, or destination.</p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <SearchIcon className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search college or office name…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <h2 className="mt-7 text-sm font-semibold text-muted-foreground">RESULTS</h2>
        <div className="mt-3 space-y-2">
          {filtered.map((o) => (
            <Link
              to="/matches"
              key={o.name}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/40"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                {o.type === "college" ? <GraduationCap className="size-4 text-primary" /> : <Building2 className="size-4 text-primary" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{o.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3" /> {o.area}
                </p>
              </div>
              <span className="text-xs text-primary font-medium">View matches →</span>
            </Link>
          ))}
        </div>

        {/* Refer */}
        <section className="mt-10 rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Share2 className="size-5 text-primary" />
            <h2 className="text-lg font-bold">Refer your circle</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            More riders from your college / office = better matches for you. Invite them in one tap.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={`https://wa.me/?text=${referralMsg}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle className="size-4" /> Share on WhatsApp
            </a>
            <a
              href={`sms:?body=${referralMsg}`}
              className="flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background"
            >
              <Smartphone className="size-4" /> Share via SMS
            </a>
          </div>
        </section>
      </div>
      <BottomNav />
    </main>
  );
}
