import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Plan = "free" | "weekly" | "monthly";
export type ConnectMethod = "instagram" | "whatsapp" | "telegram";
export type RideType = "instant" | "daily" | "long";
export type VehicleType = "car" | "bike" | "auto";

export type Profile = {
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other" | "";
  bio: string;
  connect: ConnectMethod;
  connectId: string;
};

export type RideQuery = {
  rideType: RideType;
  pickup: string;
  drop: string;
  hasVehicle: boolean;
  vehicleType?: VehicleType;
  seats: number;
  // daily
  days?: string[]; // e.g. ['Mon','Tue']
  returnJourney?: boolean;
  returnTime?: string;
  // long / planned
  date?: string;
  time?: string;
};

export type RidePost = RideQuery & {
  id: string;
  ownerName: string;
  createdAt: number;
};

export type MatchProfile = {
  id: string;
  name: string;
  avatar: string;
  overlapPct: number;
  pickup: string;
  drop: string;
  timing: string;
  bio: string;
  connect: ConnectMethod;
  connectId: string;
  rating: number;
};

type Ctx = {
  signedIn: boolean;
  profile: Profile | null;
  posts: RidePost[];
  unlockedIds: string[];
  plan: Plan;
  planExpiry: number | null;
  // pending profile creation flow
  pendingProfile: { email: string; name: string } | null;
  // last query (used to drive matches page)
  lastQuery: RideQuery | null;

  signInWithGoogle: () => void;
  completeProfile: (p: Profile) => void;
  signOut: () => void;
  setLastQuery: (q: RideQuery) => void;
  postRide: (q: RideQuery) => RidePost;
  unlock: (id: string) => void;
  canUnlock: () => boolean;
  upgrade: (p: Plan) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

const KEY = "linq-store-v1";

type Persisted = {
  profile: Profile | null;
  posts: RidePost[];
  unlockedIds: string[];
  plan: Plan;
  planExpiry: number | null;
};

function load(): Persisted {
  if (typeof window === "undefined")
    return { profile: null, posts: [], unlockedIds: [], plan: "free", planExpiry: null };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) throw 0;
    return JSON.parse(raw);
  } catch {
    return { profile: null, posts: [], unlockedIds: [], plan: "free", planExpiry: null };
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<RidePost[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [plan, setPlan] = useState<Plan>("free");
  const [planExpiry, setPlanExpiry] = useState<number | null>(null);
  const [pendingProfile, setPendingProfile] = useState<{ email: string; name: string } | null>(null);
  const [lastQuery, setLastQuery] = useState<RideQuery | null>(null);

  useEffect(() => {
    const d = load();
    setProfile(d.profile);
    setPosts(d.posts);
    setUnlockedIds(d.unlockedIds);
    setPlan(d.plan);
    setPlanExpiry(d.planExpiry);
  }, []);

  useEffect(() => {
    const data: Persisted = { profile, posts, unlockedIds, plan, planExpiry };
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [profile, posts, unlockedIds, plan, planExpiry]);

  const value = useMemo<Ctx>(
    () => ({
      signedIn: !!profile,
      profile,
      posts,
      unlockedIds,
      plan,
      planExpiry,
      pendingProfile,
      lastQuery,
      signInWithGoogle: () => {
        // mock: simulate google returning name+email
        setPendingProfile({ email: "you@gmail.com", name: "Aanya M." });
      },
      completeProfile: (p) => {
        setProfile(p);
        setPendingProfile(null);
      },
      signOut: () => {
        setProfile(null);
        setUnlockedIds([]);
        setPlan("free");
        setPlanExpiry(null);
      },
      setLastQuery,
      postRide: (q) => {
        const post: RidePost = {
          ...q,
          id: "post-" + Math.random().toString(36).slice(2, 9),
          ownerName: profile?.name ?? "You",
          createdAt: Date.now(),
        };
        setPosts((prev) => [post, ...prev]);
        return post;
      },
      unlock: (id) => setUnlockedIds((prev) => (prev.includes(id) ? prev : [...prev, id])),
      canUnlock: () => {
        if (plan === "monthly" && planExpiry && planExpiry > Date.now()) return true;
        if (plan === "weekly" && planExpiry && planExpiry > Date.now()) return unlockedIds.length < 10;
        return unlockedIds.length < 2;
      },
      upgrade: (p) => {
        setPlan(p);
        const now = Date.now();
        if (p === "weekly") setPlanExpiry(now + 7 * 24 * 3600 * 1000);
        else if (p === "monthly") setPlanExpiry(now + 30 * 24 * 3600 * 1000);
        else setPlanExpiry(null);
      },
    }),
    [profile, posts, unlockedIds, plan, planExpiry, pendingProfile, lastQuery],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}

// Mock match generator based on a query
export function generateMatches(q: RideQuery | null): MatchProfile[] {
  const base: Omit<MatchProfile, "pickup" | "drop">[] = [
    { id: "m1", name: "Aarav S.", avatar: "from-blue-500/60 to-indigo-500/20", overlapPct: 92, timing: "Matches your timing", bio: "Engineer, calm driver, music lover.", connect: "whatsapp", connectId: "+91 98xxxx1122", rating: 4.9 },
    { id: "m2", name: "Meera K.", avatar: "from-pink-500/60 to-purple-500/20", overlapPct: 87, timing: "±10 min flexible", bio: "Designer, loves indie playlists.", connect: "instagram", connectId: "@meera.k", rating: 4.8 },
    { id: "m3", name: "Rohan P.", avatar: "from-emerald-500/60 to-teal-500/20", overlapPct: 78, timing: "Same window daily", bio: "Student, prefers AC rides.", connect: "telegram", connectId: "@rohan_p", rating: 5.0 },
    { id: "m4", name: "Saanvi G.", avatar: "from-amber-500/60 to-orange-500/20", overlapPct: 74, timing: "Weekday commuter", bio: "Analyst, quiet rides preferred.", connect: "whatsapp", connectId: "+91 90xxxx7788", rating: 4.7 },
    { id: "m5", name: "Karan V.", avatar: "from-cyan-500/60 to-blue-500/20", overlapPct: 69, timing: "Returns same way", bio: "Founder, early bird.", connect: "instagram", connectId: "@karanv", rating: 4.6 },
    { id: "m6", name: "Diya N.", avatar: "from-rose-500/60 to-pink-500/20", overlapPct: 65, timing: "Flexible weekends", bio: "Teacher, friendly conversations.", connect: "telegram", connectId: "@diyan", rating: 4.8 },
  ];
  return base.map((b) => ({
    ...b,
    pickup: q?.pickup || "Bandra West",
    drop: q?.drop || "BKC",
  }));
}
