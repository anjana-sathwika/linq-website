import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { useTheme, type Theme } from "@/lib/theme";
import { useStore } from "@/lib/store";
import { BadgeCheck, ChevronRight, Moon, Sun, Settings, CreditCard, Shield, LogOut, AlertTriangle } from "lucide-react";

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
            className="flex size-12 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
            title="Emergency SOS"
          >
            <AlertTriangle className="size-6" />
          </button>
        </div>

        {/* Identity card */}
        <section className="mt-5 flex items-center gap-4 rounded-3xl bg-card p-5">
          <div className="size-16 rounded-full bg-gradient-to-br from-primary/70 to-primary/20 ring-2 ring-primary/40" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">{profile?.name || "User"}</p>
              <BadgeCheck className="size-4 text-primary" />
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
          <button 
            onClick={() => navigate({ to: "/onboarding" })}
            className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
          >
            Edit
          </button>
        </section>

        {/* Emergency Contact */}
        {profile?.emergencyContact && (
          <section className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="size-4 text-orange-600" />
              <h3 className="font-semibold text-orange-700">Emergency Contact</h3>
            </div>
            <p className="text-sm">
              <strong>{profile.emergencyContactName || "Emergency Contact"}</strong>: {profile.emergencyContact}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This contact will be notified if you use the SOS feature
            </p>
          </section>
        )}

        {/* Appearance */}
        <section className="mt-7">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">APPEARANCE</h2>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition ${
                    active ? "border-primary bg-card" : "border-border bg-card/60"
                  }`}
                >
                  <span
                    className="size-12 rounded-full ring-2 ring-border"
                    style={{ background: t.swatch }}
                  />
                  <span className="text-sm font-semibold">{t.label}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">{t.desc}</span>
                </button>
              );
            })}
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
              Icon: Settings, 
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
