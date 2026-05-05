import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { useStore, generateMatches } from "@/lib/store";
import { Calendar, MapPin, Plus, Trash2, Lock, BadgeCheck, Star } from "lucide-react";

export const Route = createFileRoute("/trips")({
  head: () => ({ meta: [{ title: "Trips — linQ" }] }),
  component: Trips,
});

function Trips() {
  const { posts, unlockedIds } = useStore();
  const [tab, setTab] = useState<"posts" | "unlocked">("posts");
  const allMatches = generateMatches(null);
  const unlocked = allMatches.filter((m) => unlockedIds.includes(m.id));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-5 pt-8 pb-32 lg:pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold lg:text-4xl">Your trips</h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="size-4" /> Post a ride
          </Link>
        </div>

        <div className="mt-6 inline-flex rounded-full border border-border bg-card p-1">
          <TabBtn active={tab === "posts"} onClick={() => setTab("posts")}>My ride posts</TabBtn>
          <TabBtn active={tab === "unlocked"} onClick={() => setTab("unlocked")}>Unlocked profiles</TabBtn>
        </div>

        {tab === "posts" ? (
          <div className="mt-6 space-y-3">
            {posts.length === 0 && (
              <Empty msg="No ride posts yet. Search for a ride from the home page to auto-post yours." />
            )}
            {posts.map((p) => (
              <article key={p.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-primary">
                    {p.rideType === "long" ? "Planned" : p.rideType}
                  </span>
                  <button className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm">
                  <MapPin className="size-4 text-primary" />
                  <span className="font-medium">{p.pickup} → {p.drop}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {p.hasVehicle && (
                    <>
                      <Tag>{p.seats} seats</Tag>
                      {p.vehicleType && <Tag>{p.vehicleType}</Tag>}
                    </>
                  )}
                  {p.days && p.days.length > 0 && <Tag>{p.days.join(", ")}</Tag>}
                  {p.returnJourney && <Tag>Return @ {p.returnTime || "tbd"}</Tag>}
                  {p.date && <Tag><Calendar className="size-3" /> {p.date} {p.time}</Tag>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unlocked.length === 0 && <Empty msg="You haven't unlocked any profiles yet." />}
            {unlocked.map((m) => (
              <article key={m.id} className="rounded-3xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-full bg-gradient-to-br ${m.avatar}`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold">{m.name}</p>
                      <BadgeCheck className="size-3.5 text-primary" />
                    </div>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3 fill-primary text-primary" /> {m.rating.toFixed(1)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">"{m.bio}"</p>
                <p className="mt-3 text-xs"><span className="text-muted-foreground">Contact:</span> <span className="font-medium text-primary">{m.connectId}</span></p>
              </article>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
    >
      {children}
    </button>
  );
}
function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1">{children}</span>;
}
function Empty({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
      <Lock className="size-6" />
      {msg}
    </div>
  );
}
