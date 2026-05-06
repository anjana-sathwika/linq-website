import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { useTheme } from "@/lib/theme";
import { useStore } from "@/lib/store";
import {
  BadgeCheck,
  ChevronRight,
  Moon,
  Sun,
  CreditCard,
  Shield,
  LifeBuoy,
  LogOut,
  Siren,
  Star,
  MapPin,
  Pencil,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — together." }] }),
  component: Profile,
});

const menu = [
  { Icon: CreditCard, label: "Payments", desc: "Plans, billing & history", to: "/payments" as const },
  { Icon: Shield, label: "Safety & verification", desc: "SOS, ID & emergency contacts", to: "/safety" as const },
  { Icon: LifeBuoy, label: "Support", desc: "Submit queries & get help", to: "/query" as const },
];

function Profile() {
  const { theme, toggle } = useTheme();
  const { profile, signOut, signedIn } = useStore();
  const navigate = useNavigate();
  const isDark = theme === "sapphire-dark";

  const name = profile?.name ?? "Aanya M.";
  const email = profile?.email ?? "you@gmail.com";

  // Handle SOS button click
  const handleSOS = () => {
    const message = `🚨 EMERGENCY ALERT 🚨\n\nUser: ${profile?.name || 'Unknown'}\nLocation: Sharing live location\nTime: ${new Date().toLocaleString()}\n\nPlease track immediately!`;
    
    // Share with emergency service
    window.open(`https://wa.me/9502699398?text=${encodeURIComponent(message)}`, '_blank');
    
    // Share with us
    if (profile?.emergencyContact) {
      window.open(`https://wa.me/${profile.emergencyContact}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  // If not signed in, show sign-in prompt
  if (!signedIn) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen">
          {/* Left Side - Hero Section */}
          <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col justify-center px-12 py-16">
              <div className="max-w-lg">
                <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                  Welcome Back to together
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Your trusted ride-sharing community is waiting. Sign in to access your profile, manage rides, and connect with fellow travelers.
                </p>
                <button
                  onClick={() => navigate({ to: "/login" })}
                  className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
                >
                  Sign In to Continue
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="flex-1 flex items-center justify-center px-8 py-12 bg-background">
            <div className="w-full max-w-md">
              <div className="mx-auto mb-8 size-24 rounded-full bg-gradient-to-br from-primary/70 to-primary/20 ring-4 ring-primary/40 flex items-center justify-center shadow-2xl">
                <LogOut className="size-12 text-muted-foreground" />
              </div>
              
              <h2 className="text-3xl font-bold text-center mb-4">Sign In Required</h2>
              <p className="text-center text-muted-foreground mb-8 leading-relaxed">
                Access your profile to manage rides, view history, and connect with the together community.
              </p>
              
              <button
                onClick={() => navigate({ to: "/login" })}
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:from-primary/90 hover:to-primary transition-all transform hover:scale-105 shadow-xl text-lg"
              >
                Sign In to Your Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Signed in profile view with enhanced laptop/desktop layout
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Left Side - Profile Info & Stats */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex flex-col px-12 py-16">
            {/* User Profile Card */}
            <div className={`mb-8 rounded-3xl ${theme === "sapphire" ? "bg-white/10" : "bg-gray-900/10"} backdrop-blur-xl p-8 ${theme === "sapphire" ? "border-white/20" : "border-gray-700/20"} shadow-2xl`}>
              <div className="flex items-center gap-6 mb-6">
                <div className="size-24 rounded-full bg-gradient-to-br from-primary/70 to-primary/20 ring-4 ring-primary/40 shadow-xl" />
                <div>
                  <h2 className={`text-3xl font-bold ${theme === "sapphire" ? "text-white" : "text-gray-100"}`}>{name}</h2>
                  <div className={`flex items-center gap-2 ${theme === "sapphire" ? "text-white/80" : "text-gray-300"}`}>
                    <BadgeCheck className="size-5 text-primary bg-white/20 p-1 rounded-full" />
                    <span className="text-lg">4.9 ★ · 84 trips</span>
                  </div>
                </div>
              </div>
              
              {profile?.bio && (
                <p className={`leading-relaxed mb-6 ${theme === "sapphire" ? "text-white/90" : "text-gray-300"}`}>{profile.bio}</p>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className={`rounded-xl p-4 backdrop-blur ${theme === "sapphire" ? "bg-white/10" : "bg-gray-800/10"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`size-10 rounded-full bg-primary/20 flex items-center justify-center ${theme === "sapphire" ? "text-primary" : "text-gray-100"}`}>
                    <Star className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Total Rides</h3>
                </div>
                <p className={`text-3xl font-bold ${theme === "sapphire" ? "text-primary" : "text-gray-100"}`}>84</p>
              </div>
              
              <div className={`rounded-xl p-4 backdrop-blur ${theme === "sapphire" ? "bg-white/10" : "bg-gray-800/10"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`size-10 rounded-full bg-green-500/20 flex items-center justify-center ${theme === "sapphire" ? "text-primary" : "text-gray-100"}`}>
                    <Star className="size-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Rating</h3>
                </div>
                <p className={`text-3xl font-bold ${theme === "sapphire" ? "text-green-600" : "text-gray-300"}`}>4.9</p>
              </div>
              
              <div className={`rounded-xl p-4 backdrop-blur ${theme === "sapphire" ? "bg-white/10" : "bg-gray-800/10"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`size-10 rounded-full bg-blue-500/20 flex items-center justify-center ${theme === "sapphire" ? "text-primary" : "text-gray-100"}`}>
                    <CalendarDays className="size-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Member Since</h3>
                </div>
                <p className={`text-3xl font-bold ${theme === "sapphire" ? "text-blue-600" : "text-gray-300"}`}>Jan 2024</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className={`rounded-3xl ${theme === "sapphire" ? "bg-white/10" : "bg-gray-800/10"} backdrop-blur p-6 ${theme === "sapphire" ? "border-white/20" : "border-gray-700/20"} shadow-2xl`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center justify-between ${theme === "sapphire" ? "text-white" : "text-gray-100"}`}>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-5 text-primary bg-white/20 p-1 rounded-full" />
                  Personal Information
                </div>
                <Pencil className="size-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium">{profile?.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Age</p>
                  <p className="font-medium">{profile?.age || "Not set"} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Gender</p>
                  <p className="font-medium">{profile?.gender || "Not set"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Bio</p>
                  <p className="font-medium">{profile?.bio || "No bio added yet"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Main Content */}
        <div className="flex-1 bg-background">
          {/* Top Bar */}
          <div className="border-b border-border bg-card px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">My Profile</h1>
              
              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2">
                  <Sun className="size-4 text-yellow-500" />
                  <button
                    onClick={() => toggle()}
                    className="relative h-5 w-9 rounded-full bg-primary transition-colors duration-300"
                  >
                    <div
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform duration-300 ${
                        theme === "sapphire-dark" ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <Moon className="size-4 text-blue-500" />
                </button>
                </div>

                {/* SOS Button */}
                <button
                  onClick={handleSOS}
                  className="group relative flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-red-500/40"
                  title="Emergency SOS - Click for immediate help"
                >
                  <div className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse" />
                  <span className="relative z-10 text-xs font-bold uppercase tracking-wider">SOS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Star className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Total Rides</h3>
                </div>
                <p className="text-3xl font-bold text-primary">84</p>
              </div>
              
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Star className="size-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Rating</h3>
                </div>
                <p className="text-3xl font-bold text-green-600">4.9</p>
              </div>
              
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CalendarDays className="size-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Member Since</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">Jan 2024</p>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="p-8">
              <button
                onClick={() => {
                  signOut();
                  navigate({ to: "/login" });
                }}
                className="w-full bg-destructive text-destructive-foreground px-6 py-3 rounded-xl font-semibold hover:bg-destructive/90 transition-all flex items-center justify-center"
              >
                <LogOut className="size-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="lg:hidden">
        {/* Hero header with gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/60" />
          <div className="absolute -right-12 -top-12 size-48 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -left-10 top-20 size-32 rounded-full bg-white/10 blur-2xl" />

          <div className="relative px-5 pt-6 pb-20">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary-foreground">Profile</h1>
              <Link
                to="/safety"
                className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-3.5 py-1.5 text-xs font-bold text-destructive-foreground shadow-lg ring-2 ring-white/20"
              >
                <Siren className="size-3.5" /> SOS
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="size-20 rounded-full bg-gradient-to-br from-white/90 to-white/40 ring-4 ring-white/30 backdrop-blur" />
              <div className="flex-1 text-primary-foreground">
                <div className="flex items-center gap-1.5">
                  <p className="text-xl font-bold">{name}</p>
                  <BadgeCheck className="size-5 fill-white text-primary" />
                </div>
                <p className="text-sm opacity-90">{email}</p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Star className="size-3.5 fill-current" /> 4.9
                  </span>
                  <span className="opacity-70">·</span>
                  <span className="opacity-90">84 trips</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto -mt-12 max-w-md px-5 pb-32">
          {/* Stats */}
          <section className="grid grid-cols-3 gap-2.5 rounded-3xl border border-border bg-card p-4 shadow-lg">
            {[
              { label: "Trips", value: "84" },
              { label: "Unlocked", value: "12" },
              { label: "CO₂ saved", value: "47kg" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </section>

          {/* Edit button */}
          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-3 text-sm font-semibold hover:bg-secondary/80">
            <Pencil className="size-4" /> Edit profile
          </button>

          {/* Appearance toggle */}
          <section className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </span>
              <div>
                <p className="text-sm font-semibold">Appearance</p>
                <p className="text-xs text-muted-foreground">{isDark ? "Night mode" : "Day mode"}</p>
              </div>
            </div>
            <button
              onClick={toggle}
              role="switch"
              aria-checked={isDark}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${isDark ? "bg-primary" : "bg-secondary"}`}
            >
              <span
                className={`absolute top-0.5 size-6 rounded-full bg-background shadow transition-all ${
                  isDark ? "left-[calc(100%-1.625rem)]" : "left-0.5"
                }`}
              />
            </button>
          </section>

          {/* Quick action grid */}
          <h3 className="mt-6 mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Account
          </h3>
          <section className="grid grid-cols-2 gap-3">
            {menu.map((m) => (
              <Link
                key={m.label}
                to={m.to}
                className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4 transition active:scale-[0.98]"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <m.Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">{m.label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{m.desc}</p>
                </div>
              </Link>
            ))}
            <Link
              to="/trips"
              className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4 transition active:scale-[0.98]"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">My trips</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">Posts & unlocks</p>
              </div>
            </Link>
          </section>

          {/* Sign out */}
          <button
            onClick={signOut}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-semibold text-destructive"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
