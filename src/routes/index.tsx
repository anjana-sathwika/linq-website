import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useMemo, useState, useCallback } from "react";
import {
  Bell,
  Users,
  ShieldCheck,
  Zap,
  Briefcase,
  Plane,
  Search,
  ArrowUpDown,
  Star,
  BadgeCheck,
  MapPin,
  Sparkles,
  Sun,
  Moon,
  Car,
  Bike,
  Truck,
  CalendarDays,
  RefreshCw,
  Check,
  X,
} from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Switch } from "@/components/ui/switch";
import { LocationInput } from "@/components/location-input";
import { useTheme } from "@/lib/theme";
import { useStore, type RideType, type RideQuery, type VehicleType, type Location, generateMatches } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "linQ — Go Together Rides" },
      { name: "description", content: "Go Together Rides - Verified ride-sharing for instant trips, daily commutes, and planned long-distance journeys." },
      { property: "og:title", content: "linQ — Go Together Rides" },
      { property: "og:description", content: "Go Together Rides - Verified ride-sharing carpools." },
    ],
  }),
  component: Home,
});

const rideTypes: { id: RideType; tag: string; title: string; subtitle: string; Icon: typeof Zap }[] = [
  { id: "instant", tag: "NOW", title: "Instant", subtitle: "Match in minutes", Icon: Zap },
  { id: "daily", tag: "COMMUTE", title: "Daily", subtitle: "Office / college route", Icon: Briefcase },
  { id: "long", tag: "PLANNED", title: "Planned / Long Distance", subtitle: "Scheduled & city-to-city", Icon: Plane },
];

const previewMatches = generateMatches(null).slice(0, 3);

function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="lg:hidden"><MobileHome /></div>
      <div className="hidden lg:block"><DesktopHome /></div>
      <BottomNav />
    </main>
  );
}

/* ----------------- shared ride form hook ----------------- */
function useRideForm() {
  const { signedIn, setLastQuery, postRide } = useStore();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<RideType>("instant");
  const [pickup, setPickup] = useState<Location | null>(null);
  const [drop, setDrop] = useState<Location | null>(null);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [seats, setSeats] = useState(1);
  const [days, setDays] = useState<string[]>([]);
  const [returnJourney, setReturnJourney] = useState(false);
  const [returnTime, setReturnTime] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Memoize swap function to prevent recreation
  const swap = useCallback(() => {
    setPickup(drop);
    setDrop(pickup);
  }, [drop, pickup]);

  // Memoize buildQuery function
  const buildQuery = useCallback((): RideQuery | null => {
    if (!pickup || !drop) return null;
    return { rideType: selected, pickup, drop, hasVehicle, vehicleType, seats, days, returnJourney, returnTime, date, time };
  }, [selected, pickup, drop, hasVehicle, vehicleType, seats, days, returnJourney, returnTime, date, time]);

  // Memoize findMatch function
  const findMatch = useCallback(() => {
    if (!pickup || !drop) return;
    setConfirmOpen(true);
  }, [pickup, drop]);

  // Memoize confirmPost function - remove circular dependency
  const confirmPost = useCallback((post: boolean) => {
    const q = buildQuery();
    if (!q) return;
    setLastQuery(q);
    if (post && signedIn) postRide(q);
    setConfirmOpen(false);
    if (!signedIn) navigate({ to: "/login" });
    else navigate({ to: "/matches" });
  }, [buildQuery, signedIn, setLastQuery, postRide, navigate]);

  // Memoize state object to prevent recreation
  const state = useMemo(() => ({
    selected, pickup, drop, hasVehicle, vehicleType, seats, days, returnJourney, returnTime, date, time, confirmOpen
  }), [selected, pickup, drop, hasVehicle, vehicleType, seats, days, returnJourney, returnTime, date, time, confirmOpen]);

  // Memoize setters object to prevent recreation
  const set = useMemo(() => ({
    setSelected, setPickup, setDrop, setHasVehicle, setVehicleType, setSeats, setDays, setReturnJourney, setReturnTime, setDate, setTime, setConfirmOpen
  }), [setSelected, setPickup, setDrop, setHasVehicle, setVehicleType, setSeats, setDays, setReturnJourney, setReturnTime, setDate, setTime, setConfirmOpen]);

  return useMemo(() => ({
    state,
    set,
    swap,
    findMatch,
    confirmPost,
  }), [state, set, swap, findMatch, confirmPost]);
}

/* -------------------------------------------------------------------------- */
/*  MOBILE                                                                    */
/* -------------------------------------------------------------------------- */
function MobileHome() {
  const form = useRideForm();
  const { state, set, swap, findMatch, confirmPost } = form;

  return (
    <div className="mx-auto w-full max-w-md px-5 pt-6 pb-40">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-gradient-to-br from-primary/70 to-primary/30 ring-2 ring-primary/40" />
          <div>
            <p className="text-xs text-muted-foreground">Welcome to</p>
            <p className="text-base font-semibold">linQ</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggleBtn />
          <IconBtn><Bell className="size-5" /></IconBtn>
        </div>
      </header>

      <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-primary">WHERE TO TODAY?</p>
      <h1 className="mt-2 text-5xl font-bold leading-[1.05] tracking-tight">
        Go Together<br />Rides
      </h1>
      <div className="mt-5 flex flex-wrap gap-2">
        <Pill><Users className="size-3.5" />12,400+ riders</Pill>
        <Pill><ShieldCheck className="size-3.5" />ID verified</Pill>
      </div>

      {/* Ride type */}
      <section className="mt-7">
        <h2 className="mb-3 text-lg font-semibold">Choose ride type</h2>
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden after:w-2 after:shrink-0">
          {rideTypes.map((r) => (
            <RideCard key={r.id} r={r} active={state.selected === r.id} onClick={() => set.setSelected(r.id)} />
          ))}
        </div>
      </section>

      {/* Search/Plan card */}
      <RideForm form={form} className="mt-5" />

      {/* Preview matches */}
      <section className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Nearby matches</h2>
            <p className="text-xs text-muted-foreground">Live · within 2km of you</p>
          </div>
          <button onClick={findMatch} className="text-sm font-medium text-primary">See all</button>
        </div>
        <div className="mt-3 space-y-3">
          {previewMatches.map((m) => (
            <article key={m.id} className="flex items-center gap-4 rounded-2xl bg-card p-4">
              <div className={`size-12 rounded-full bg-gradient-to-br ${m.avatar}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{m.name}</p>
                  <BadgeCheck className="size-3 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{m.pickup.name} → {m.drop.name}</p>
                <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="size-3 fill-primary text-primary" /> {m.rating.toFixed(1)} · {m.overlapPct}% match
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {state.confirmOpen && <ConfirmPostModal onCancel={() => set.setConfirmOpen(false)} onChoose={confirmPost} />}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  DESKTOP                                                                    */
/* -------------------------------------------------------------------------- */
function DesktopHome() {
  const form = useRideForm();
  const { state, set, confirmPost } = form;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="pointer-events-none absolute -top-40 -left-40 size-[40rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 60%)" }} />
        <div className="pointer-events-none absolute -bottom-40 -right-32 size-[40rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 60%)" }} />

        <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-10 px-8 py-20">
          <div className="col-span-7 flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" /> Verified ride-sharing, reimagined
            </span>
            <p className="mt-6 text-sm font-semibold tracking-[0.25em] text-primary">WHERE TO TODAY?</p>
            <h1 className="mt-3 text-7xl font-bold leading-[1.02] tracking-tight">
              Go Together<br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent pb-2">Rides</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Match with verified riders heading the same way at the same time. Instant pickups,
              daily commutes, and planned long-distance trips — all in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Pill><Users className="size-3.5" />12,400+ riders</Pill>
              <Pill><ShieldCheck className="size-3.5" />ID verified</Pill>
              <Pill><Star className="size-3.5 fill-primary text-primary" />4.9 avg rating</Pill>
            </div>

            <div className="mt-10">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Choose ride type</h2>
              <div className="grid grid-cols-3 gap-4">
                {rideTypes.map((r) => (
                  <RideCard key={r.id} r={r} active={state.selected === r.id} onClick={() => set.setSelected(r.id)} fullWidth />
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-5 flex flex-col justify-center">
            <div className="rounded-3xl border border-border bg-card/80 p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Plan your ride</h3>
                  <p className="text-sm text-muted-foreground">
                    {state.selected === "instant" ? "Get matched in minutes" : state.selected === "daily" ? "Recurring commute" : "Scheduled / long distance"}
                  </p>
                </div>
                <span className="flex size-11 items-center justify-center rounded-2xl"
                  style={{ background: "color-mix(in oklab, var(--color-primary) 15%, transparent)", color: "var(--color-primary)" }}>
                  <MapPin className="size-5" />
                </span>
              </div>
              <RideForm form={form} embedded />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-8 py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">How it works</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight">Three taps to a shared ride</h2>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6">
          {[
            { Icon: MapPin, title: "Set your route", desc: "Pickup, drop, ride type — done." },
            { Icon: Users, title: "Match instantly", desc: "Verified riders going the same way." },
            { Icon: ShieldCheck, title: "Go Together", desc: "Split costs, save planet, stay safe." },
          ].map((s, i) => (
            <div key={s.title} className="rounded-3xl border border-border bg-card p-7">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl"
                  style={{ background: "color-mix(in oklab, var(--color-primary) 15%, transparent)", color: "var(--color-primary)" }}>
                  <s.Icon className="size-5" />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">STEP 0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/50">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} linQ — Go Together Rides.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Support</a>
          </div>
        </div>
      </footer>

      {state.confirmOpen && <ConfirmPostModal onCancel={() => set.setConfirmOpen(false)} onChoose={confirmPost} />}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ride form (shared mobile + desktop)                                       */
/* -------------------------------------------------------------------------- */
function RideForm({ form, className = "", embedded = false }: { form: ReturnType<typeof useRideForm>; className?: string; embedded?: boolean }) {
  const { state, set, swap, findMatch } = form;
  void embedded;
  const dayLabels = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], []);

  const presets = useMemo(() => [
    { label: "Mon–Fri", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    { label: "Mon–Sat", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
  ], []);

  return (
    <div className={`${embedded ? "" : "rounded-3xl bg-card p-5"} ${className}`}>
      {/* Pickup / drop */}
      <div className="flex items-start gap-3">
        <div className="mt-3 flex flex-col items-center">
          <span className="size-3 rounded-full bg-foreground" />
          <span className="my-1 h-8 w-px bg-border" />
          <span className="size-3 rounded-full bg-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <LocationInput
              value={state.pickup}
              onChange={set.setPickup}
              placeholder="Enter pickup location"
              className="bg-transparent"
            />
          </div>
          <div className="h-px bg-border" />
          <div>
            <LocationInput
              value={state.drop}
              onChange={set.setDrop}
              placeholder="Where are you going?"
              className="bg-transparent"
            />
          </div>
        </div>
        <button onClick={swap} className="flex size-10 shrink-0 items-center justify-center self-center rounded-full bg-secondary">
          <ArrowUpDown className="size-4" />
        </button>
      </div>

      {/* Vehicle */}
      <div className="mt-4 rounded-2xl border border-border/60 bg-background/40 p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Car className="size-4 text-primary" /> Do you have a vehicle?
          </span>
          <Switch checked={state.hasVehicle} onCheckedChange={set.setHasVehicle} />
        </div>
        {state.hasVehicle && (
          <>
            <div className="mt-3">
              <span className="text-xs text-muted-foreground">Vehicle type</span>
              <div className="mt-2 flex gap-2">
                {[
                  { type: "car" as VehicleType, label: "Car", Icon: Car },
                  { type: "bike" as VehicleType, label: "Bike", Icon: Bike },
                  { type: "auto" as VehicleType, label: "Auto", Icon: Truck },
                ].map(({ type, label, Icon }) => (
                  <button
                    key={type}
                    onClick={() => set.setVehicleType(type)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${state.vehicleType === type
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Icon className="size-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Seats available</span>
              <NumberStep value={state.seats} setValue={set.setSeats} min={1} max={6} />
            </div>
          </>
        )}
      </div>

      {/* Daily extras */}
      {state.selected === "daily" && (
        <div className="mt-3 rounded-2xl border border-border/60 bg-background/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Travel days</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {dayLabels.map((d) => {
              const on = state.days.includes(d);
              return (
                <button key={d} onClick={() => set.setDays(on ? state.days.filter(x => x !== d) : [...state.days, d])}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>
                  {d}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex gap-2">
            {presets.map((p) => (
              <button key={p.label} onClick={() => set.setDays(p.days)} className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground">
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <RefreshCw className="size-4 text-primary" /> Open to return journey?
            </span>
            <Switch checked={state.returnJourney} onCheckedChange={set.setReturnJourney} />
          </div>
          {state.returnJourney && (
            <input type="time" value={state.returnTime} onChange={(e) => set.setReturnTime(e.target.value || "")}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          )}
        </div>
      )}

      {/* Long distance */}
      {state.selected === "long" && (
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-border/60 bg-background/40 p-3">
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Date</span>
            <input type="date" value={state.date} onChange={(e) => set.setDate(e.target.value || "")} className="w-full rounded-lg border border-border bg-background px-2 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time</span>
            <input type="time" value={state.time} onChange={(e) => set.setTime(e.target.value || "")} className="w-full rounded-lg border border-border bg-background px-2 py-2 text-sm" />
          </label>
          <p className="col-span-2 flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarDays className="size-3" /> For all planned, scheduled & city-to-city trips.
          </p>
        </div>
      )}

      <button onClick={findMatch} disabled={!state.pickup || !state.drop}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 shadow-md">
        <Search className="size-4" /> Find a match
      </button>
    </div>
  );
}

/* ---------- bits ---------- */
function ConfirmPostModal({ onCancel, onChoose }: { onCancel: () => void; onChoose: (post: boolean) => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-5 backdrop-blur">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-7">
        <button onClick={onCancel} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-secondary">
          <X className="size-4" />
        </button>
        <Sparkles className="size-7 text-primary" />
        <h2 className="mt-3 text-xl font-bold">Post this ride too?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Make your route visible so others heading the same way can match with you. You can edit or delete it from Trips later.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => onChoose(false)} className="rounded-full border border-border bg-background py-3 text-sm font-semibold">
            Just find matches
          </button>
          <button onClick={() => onChoose(true)} className="flex items-center justify-center gap-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
            <Check className="size-4" /> Post & match
          </button>
        </div>
      </div>
    </div>
  );
}

function RideCard({ r, active, onClick, fullWidth }: { r: typeof rideTypes[number]; active: boolean; onClick: () => void; fullWidth?: boolean }) {
  return (
    <button onClick={onClick}
      className={`relative flex h-44 ${fullWidth ? "w-full" : "min-w-[10.5rem] shrink-0 snap-start"} flex-col justify-between rounded-3xl border p-4 text-left transition ${active ? "border-primary bg-primary/10 shadow-[0_10px_30px_-12px_rgba(var(--color-primary),0.4)]" : "border-border bg-card/60 hover:border-primary/40"
        }`}>
      <div className="flex items-start justify-between">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium tracking-wider text-muted-foreground">{r.tag}</span>
        <span className={`flex size-9 items-center justify-center rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
          <r.Icon className="size-4" />
        </span>
      </div>
      <div>
        <p className="text-lg font-semibold leading-tight">{r.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{r.subtitle}</p>
      </div>
    </button>
  );
}


function NumberStep({ value, setValue, min, max }: { value: number; setValue: (n: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setValue(Math.max(min, value - 1))} className="flex size-7 items-center justify-center rounded-full bg-secondary">−</button>
      <span className="w-6 text-center text-sm font-bold">{value}</span>
      <button onClick={() => setValue(Math.min(max, value + 1))} className="flex size-7 items-center justify-center rounded-full bg-secondary">+</button>
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return <button className="flex size-10 items-center justify-center rounded-full bg-secondary text-foreground">{children}</button>;
}

function ThemeToggleBtn() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "sapphire";
  return (
    <button aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"} onClick={toggle}
      className="flex size-10 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/80">
      {isLight ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground">{children}</span>;
}
