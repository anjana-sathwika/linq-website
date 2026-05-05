import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { useTheme, type Theme } from "@/lib/theme";
import { useStore } from "@/lib/store";
import { BadgeCheck, ChevronRight, Moon, Sun, Pencil, CreditCard, Shield, LogOut } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — linQ" }] }),
  component: Profile,
});

const themes: { id: Theme; label: string; desc: string; Icon: typeof Sun; swatch: string }[] = [
  { id: "sapphire", label: "Day", desc: "White & royal blue", Icon: Sun, swatch: "linear-gradient(135deg,#ffffff,#1e3aef)" },
  { id: "sapphire-dark", label: "Night", desc: "Black & royal blue", Icon: Moon, swatch: "linear-gradient(135deg,#0a0e1a,#1e3aef)" },
];

function Profile() {
  const { theme, setTheme } = useTheme();
  const { signedIn, profile, signOut } = useStore();
  const navigate = useNavigate();

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
        <div className="mx-auto max-w-md px-5 pt-8 pb-32">
          <h1 className="text-3xl font-bold">Profile</h1>
          
          <div className="mt-12 text-center">
            <div className="mx-auto mb-6 size-20 rounded-full bg-gradient-to-br from-primary/70 to-primary/20 ring-2 ring-primary/40 flex items-center justify-center">
              <LogOut className="size-8 text-muted-foreground" />
            </div>
            
            <h2 className="mb-3 text-xl font-semibold">Sign In Required</h2>
            <p className="mb-8 text-muted-foreground">
              Please sign in to view your profile and access all features.
            </p>
            
            <button
              onClick={() => navigate({ to: "/login" })}
              className="w-full rounded-full bg-primary py-4 font-semibold text-background transition hover:opacity-90"
            >
              Sign In with Google
            </button>
          </div>
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md px-5 pt-8 pb-32">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          
          {/* SOS Button */}
          <button
            onClick={handleSOS}
            className="group relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-red-500/40 hover:from-red-600 hover:to-red-700"
            title="Emergency SOS - Click for immediate help"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse" />
            <span className="relative z-10 text-sm font-bold uppercase tracking-wider">SOS</span>
          </button>
        </div>

        {/* Identity card */}
        <section className="mt-5 flex items-center gap-4 rounded-3xl bg-card p-5">
          <div className="size-16 rounded-full bg-gradient-to-br from-primary/70 to-primary/20 ring-2 ring-primary/40" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{profile?.name || "User"}</p>
                <BadgeCheck className="size-4 text-primary" />
              </div>
              <button
                onClick={() => navigate({ to: "/onboarding" })}
                className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
              >
                <Pencil className="size-3" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              {profile?.age ? `${profile.age} years` : ""} · 
              {profile?.gender || ""} · 
              4.9 ★ · 84 trips
            </p>
            {profile?.bio && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
            )}
          </div>
        </section>

        {/* Appearance */}
        <section className="mt-7">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">APPEARANCE</h2>
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Sun className="size-5 text-yellow-500" />
              <span className="text-sm font-medium">Day</span>
            </div>
            <button
              onClick={() => setTheme(theme === "sapphire" ? "sapphire-dark" : "sapphire")}
              className="relative h-6 w-11 rounded-full bg-muted transition-colors duration-300"
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-primary transition-transform duration-300 ${
                  theme === "sapphire-dark" ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Night</span>
              <Moon className="size-5 text-blue-500" />
            </div>
          </div>
        </section>

        {/* Menu */}
        <section className="mt-7 overflow-hidden rounded-2xl bg-card">
          {[
            { 
              Icon: CreditCard, 
              label: "Payments",
              action: () => navigate({ to: "/payments" })
            },
            { 
              Icon: Shield, 
              label: "Safety & Verifications",
              action: () => navigate({ to: "/safety" })
            },
            { 
              Icon: Pencil, 
              label: "Raise a Query",
              action: () => navigate({ to: "/query" })
            },
            { 
              Icon: LogOut, 
              label: "Sign out",
              action: () => {
                signOut();
                navigate({ to: "/login" });
              }
            },
          ].map((m, i, arr) => (
            <button
              key={m.label}
              onClick={m.action}
              className={`flex w-full items-center gap-4 px-4 py-4 text-left ${
                i < arr.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-secondary">
                <m.Icon className="size-4" />
              </span>
              <span className="flex-1 font-medium">{m.label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </section>
      </div>
      <BottomNav />
    </main>
  );
}
