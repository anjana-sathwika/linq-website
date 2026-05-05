import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { supabase } from "./supabase";

export type Plan = "free" | "weekly" | "monthly";
export type ConnectMethod = "instagram" | "whatsapp" | "telegram";
export type RideType = "instant" | "daily" | "long";
export type VehicleType = "car" | "bike" | "auto";

export interface Location {
  name: string;
  lat: number;
  lng: number;
  display_name?: string;
}

export type Profile = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "male" | "female" | "other" | "";
  bio: string;
  connect: ConnectMethod;
  connectId: string;
  emergencyContact?: string; // Emergency contact number
  emergencyContactName?: string; // Emergency contact name
};

export type RideQuery = {
  rideType: RideType;
  pickup: Location;
  drop: Location;
  hasVehicle: boolean;
  vehicleType?: VehicleType;
  seats: number;
  days?: string[];
  returnJourney?: boolean;
  returnTime?: string;
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
  pickup: Location;
  drop: Location;
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
  pendingProfile: { email: string; name: string } | null;
  lastQuery: RideQuery | null;

  signInWithGoogle: () => void;
  completeProfile: (p: Profile) => Promise<void>;
  signOut: () => Promise<void>;
  setLastQuery: (q: RideQuery) => void;
  postRide: (q: RideQuery) => Promise<RidePost | void>;
  unlock: (id: string) => void;
  canUnlock: () => boolean;
  upgrade: (p: Plan) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

const KEY = "linq-local-store";

function loadLocal() {
  if (typeof window === "undefined") return { unlockedIds: [], plan: "free" as Plan, planExpiry: null };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { unlockedIds: [], plan: "free", planExpiry: null };
  } catch {
    return { unlockedIds: [], plan: "free", planExpiry: null };
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<RidePost[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [plan, setPlan] = useState<Plan>("free");
  const [planExpiry, setPlanExpiry] = useState<number | null>(null);
  const [pendingProfile, setPendingProfile] = useState<{ email: string; name: string } | null>(null);
  const [lastQuery, setLastQuery] = useState<RideQuery | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initial load of Supabase session and Local unlocks/subscriptions
  useEffect(() => {
    const local = loadLocal();
    setUnlockedIds(local.unlockedIds || []);
    setPlan(local.plan || "free");
    setPlanExpiry(local.planExpiry || null);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user ?? null);
      if (session?.user) checkProfile(session.user);
      else setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
      if (session?.user) checkProfile(session.user);
      else {
        setProfile(null);
        setPendingProfile(null);
        setPosts([]);
        setIsInitializing(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save local subscription state continuously
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(KEY, JSON.stringify({ unlockedIds, plan, planExpiry }));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [unlockedIds, plan, planExpiry]);

  const checkProfile = async (user: any) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (data && !error) {
      setProfile(data);
      setPendingProfile(null);
      // Fetch user's posts
      const { data: userPosts } = await supabase.from("rides").select("*").eq("owner_id", user.id);
      if (userPosts) setPosts(userPosts);
    } else {
      setPendingProfile({ email: user.email, name: user.user_metadata?.full_name || "" });
    }
    setIsInitializing(false);
  };

  const value = useMemo<Ctx>(() => {
    const signInWithGoogle = () => {
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
    };

    const completeProfile = async (p: Profile) => {
      if (!sessionUser) return;
      const { error } = await supabase.from("profiles").upsert({
        id: sessionUser.id,
        ...p,
      });
      if (!error) {
        setProfile({ id: sessionUser.id, ...p });
        setPendingProfile(null);
      } else {
        console.error("Failed to create profile", error);
      }
    };

    const signOut = async () => {
      await supabase.auth.signOut();
      setProfile(null);
      setPendingProfile(null);
      setUnlockedIds([]);
      setPlan("free");
      setPlanExpiry(null);
    };

    const postRide = async (q: RideQuery) => {
      if (!profile || !sessionUser) return;
      const postData = {
        owner_id: sessionUser.id,
        ownerName: profile.name,
        createdAt: Date.now(),
        ...q,
        // Supabase JSONB helps store the nested Location object easily without complex Postgres types initially
        pickup: q.pickup,
        drop: q.drop,
      };

      const { data, error } = await supabase.from("rides").insert([postData]).select().single();
      if (!error && data) {
        setPosts((prev) => [data, ...prev]);
        return data;
      } else {
        console.error("Failed to post ride", error);
      }
    };

    const unlock = (id: string) => setUnlockedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

    const canUnlock = () => {
      const now = Date.now();
      if (plan === "monthly" && planExpiry && planExpiry > now) return true;
      if (plan === "weekly" && planExpiry && planExpiry > now) return unlockedIds.length < 10;
      return unlockedIds.length < 2;
    };

    const upgrade = (p: Plan) => {
      setPlan(p);
      const now = Date.now();
      if (p === "weekly") setPlanExpiry(now + 7 * 24 * 3600 * 1000);
      else if (p === "monthly") setPlanExpiry(now + 30 * 24 * 3600 * 1000);
      else setPlanExpiry(null);
    };

    return {
      signedIn: !!profile,
      profile,
      posts,
      unlockedIds,
      plan,
      planExpiry,
      pendingProfile: isInitializing ? null : pendingProfile,
      lastQuery,
      signInWithGoogle,
      completeProfile,
      signOut,
      setLastQuery,
      postRide,
      unlock,
      canUnlock,
      upgrade,
    };
  }, [profile, posts, unlockedIds, plan, planExpiry, pendingProfile, lastQuery, sessionUser, isInitializing]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}

// Retain simple mock match generator until PostGIS geospatial matching is required
export function generateMatches(q: RideQuery | null): MatchProfile[] {
  const base: Omit<MatchProfile, "pickup" | "drop">[] = [
    { id: "m1", name: "Aarav S.", avatar: "from-blue-500/60 to-indigo-500/20", overlapPct: 92, timing: "Matches your timing", bio: "Engineer, calm driver, music lover.", connect: "whatsapp", connectId: "+91 98xxxx1122", rating: 4.9 },
    { id: "m2", name: "Meera K.", avatar: "from-pink-500/60 to-purple-500/20", overlapPct: 87, timing: "±10 min flexible", bio: "Designer, loves indie playlists.", connect: "instagram", connectId: "@meera.k", rating: 4.8 },
    { id: "m3", name: "Rohan P.", avatar: "from-emerald-500/60 to-teal-500/20", overlapPct: 78, timing: "Same window daily", bio: "Student, prefers AC rides.", connect: "telegram", connectId: "@rohan_p", rating: 5.0 },
    { id: "m4", name: "Saanvi G.", avatar: "from-amber-500/60 to-orange-500/20", overlapPct: 74, timing: "Weekday commuter", bio: "Analyst, quiet rides preferred.", connect: "whatsapp", connectId: "+91 90xxxx7788", rating: 4.7 },
  ];

  const defaultPickup: Location = { name: "Bandra West", lat: 19.0596, lng: 72.8295 };
  const defaultDrop: Location = { name: "BKC", lat: 19.0759, lng: 72.8774 };

  return base.map((b) => ({
    ...b,
    pickup: q?.pickup || defaultPickup,
    drop: q?.drop || defaultDrop,
  }));
}
