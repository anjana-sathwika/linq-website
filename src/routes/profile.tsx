import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { useTheme, type Theme } from "@/lib/theme";
import { useStore } from "@/lib/store";
import { BadgeCheck, ChevronRight, Moon, Sun, Pencil, CreditCard, Shield, LogOut, Users, Star, CalendarDays } from "lucide-react";

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
        <div className="flex min-h-screen">
          {/* Left Side - Hero Section */}
          <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col justify-center px-12 py-16">
              <div className="max-w-lg">
                <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                  Welcome Back to linQ
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
                Access your profile to manage rides, view history, and connect with the linQ community.
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
                  <h2 className={`text-3xl font-bold ${theme === "sapphire" ? "text-white" : "text-gray-100"}`}>{profile?.name || "User"}</h2>
                  <div className={`flex items-center gap-2 ${theme === "sapphire" ? "text-white/80" : "text-gray-300"}`}>
                    <BadgeCheck className="size-5 text-primary bg-white/20 p-1 rounded-full" />
                    <span className="text-lg">4.9 ★ · 84 trips</span>
                  </div>
                </div>
              </div>
              
              {profile?.bio && (
                <p className={`leading-relaxed mb-6 ${theme === "sapphire" ? "text-white/90" : "text-gray-300"}`}>{profile.bio}</p>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-xl p-4 backdrop-blur ${theme === "sapphire" ? "bg-white/10" : "bg-gray-800/10"}`}>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 ${theme === "sapphire" ? "text-white" : "text-gray-100"}`}>
                    <BadgeCheck className="size-5 text-primary bg-white/20 p-1 rounded-full" />
                    Verification Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className={`text-sm ${theme === "sapphire" ? "text-white/80" : "text-gray-300"}`}>ID Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className={`text-sm ${theme === "sapphire" ? "text-white/80" : "text-gray-300"}`}>Phone Verified</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                  <h3 className="text-white font-semibold mb-2">Member Since</h3>
                  <p className="text-2xl text-white font-bold">2024</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Total Rides</h3>
                </div>
                <p className="text-3xl font-bold text-primary">84</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Star className="size-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Rating</h3>
                </div>
                <p className="text-3xl font-bold text-green-600">4.9</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <CalendarDays className="size-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Member Since</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">Jan 2024</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-5 text-primary" />
                  Personal Information
                </div>
                <Pencil className="size-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-white/80 mb-1">Full Name</p>
                  <p className="font-medium">{profile?.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/80 mb-1">Age</p>
                  <p className="font-medium">{profile?.age || "Not set"} years</p>
                </div>
                <div>
                  <p className="text-sm text-white/80 mb-1">Gender</p>
                  <p className="font-medium">{profile?.gender || "Not set"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-white/80 mb-1">Bio</p>
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
                    onClick={() => setTheme(theme === "sapphire" ? "sapphire-dark" : "sapphire")}
                    className="relative h-5 w-9 rounded-full bg-background transition-colors duration-300"
                  >
                    <div
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-primary transition-transform duration-300 ${
                        theme === "sapphire-dark" ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <Moon className="size-4 text-blue-500" />
                </div>

                {/* SOS Button */}
                <button
                  onClick={handleSOS}
                  className="group relative flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-red-500/40"
                  title="Emergency SOS - Click for immediate help"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse" />
                  <span className="relative z-10 text-xs font-bold uppercase tracking-wider">SOS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-8 lg:hidden">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate({ to: "/payments" })}
                className="bg-white/10 backdrop-blur rounded-xl p-6 text-left hover:bg-white/20 transition-all border border-white/20"
              >
                <CreditCard className="size-6 mb-3" />
                <h4 className="font-semibold">Payments</h4>
                <p className="text-sm text-muted-foreground">Manage plans & transactions</p>
              </button>
              
              <button
                onClick={() => navigate({ to: "/safety" })}
                className="bg-white/10 backdrop-blur rounded-xl p-6 text-left hover:bg-white/20 transition-all border border-white/20"
              >
                <Shield className="size-6 mb-3" />
                <h4 className="font-semibold">Safety</h4>
                <p className="text-sm text-muted-foreground">Emergency & verification</p>
              </button>
              
              <button
                onClick={() => navigate({ to: "/query" })}
                className="bg-white/10 backdrop-blur rounded-xl p-6 text-left hover:bg-white/20 transition-all border border-white/20"
              >
                <Pencil className="size-6 mb-3" />
                <h4 className="font-semibold">Support</h4>
                <p className="text-sm text-muted-foreground">Raise a query</p>
              </button>
              
              <button
                onClick={() => navigate({ to: "/onboarding" })}
                className="bg-white/10 backdrop-blur rounded-xl p-6 text-left hover:bg-white/20 transition-all border border-white/20"
              >
                <Pencil className="size-6 mb-3" />
                <h4 className="font-semibold">Edit Profile</h4>
                <p className="text-sm text-muted-foreground">Update your information</p>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="size-5 text-primary" />
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

            {/* Personal Information */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-5 text-primary" />
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

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </main>
  );
}
