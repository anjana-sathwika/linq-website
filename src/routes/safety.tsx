import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { ArrowLeft, Shield, AlertTriangle, Users, Phone, MessageCircle, MapPin, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/safety")({
  head: () => ({ meta: [{ title: "Safety & Verifications — linQ" }] }),
  component: Safety,
});

function Safety() {
  const navigate = useNavigate();

  const handleAlertOption = (option: string) => {
    const message = `🚨 SAFETY ALERT 🚨\n\nUser Request: ${option}\nTime: ${new Date().toLocaleString()}\n\nPlease investigate immediately.`;
    window.open(`https://wa.me/9502699398?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const message = `📍 LIVE LOCATION SHARING 📍\n\nMy current location:\nhttps://maps.google.com/?q=${latitude},${longitude}\n\nTime: ${new Date().toLocaleString()}\n\nPlease track my journey.`;
          
          // Share with safety team
          window.open(`https://wa.me/9502699398?text=${encodeURIComponent(message)}`, '_blank');
        },
        (error) => {
          alert("Unable to get location. Please enable location services.");
        }
      );
    } else {
      alert("Location services not supported on this device.");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Safety & Verifications</h1>
          <button 
            onClick={() => navigate({ to: "/profile" })}
            className="rounded-full bg-secondary p-2 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
        </div>

        {/* Safety Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <div className="size-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <MapPin className="size-6 text-green-600" />
            </div>
            <h3 className="font-semibold">Location Status</h3>
            <p className="text-2xl font-bold text-green-600">Active</p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <div className="size-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="size-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Verification Level</h3>
            <p className="text-2xl font-bold text-blue-600">Verified</p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <div className="size-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="size-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Emergency Contacts</h3>
            <p className="text-2xl font-bold text-purple-600">3 Active</p>
          </div>
          
          <div className="bg-card rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <div className="size-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="size-6 text-red-600" />
            </div>
            <h3 className="font-semibold">Safety Status</h3>
            <p className="text-2xl font-bold text-red-600">Protected</p>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
              <AlertTriangle className="size-5" />
              Emergency Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleShareLocation}
                className="w-full flex items-center gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-left transition hover:bg-red-100"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-red-500 text-white">
                  <MapPin className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-700">Share Live Location</p>
                  <p className="text-sm text-red-600">Share your real-time location with us</p>
                </div>
              </button>

              <button
                onClick={() => handleAlertOption("Immediate help needed")}
                className="w-full flex items-center gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-left transition hover:bg-red-100"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-red-500 text-white">
                  <AlertTriangle className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-700">Immediate Help</p>
                  <p className="text-sm text-red-600">Get instant assistance</p>
                </div>
              </button>

              <button
                onClick={() => handleAlertOption("Suspicious activity")}
                className="w-full flex items-center gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-left transition hover:bg-red-100"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-red-500 text-white">
                  <Shield className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-700">Report Suspicious Activity</p>
                  <p className="text-sm text-red-600">Report unsafe situations</p>
                </div>
              </button>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              Verification Status
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">ID Verification</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone Verification</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email Verification</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Background Check</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="font-medium">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Rules */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="size-4 text-primary" />
            <h2 className="font-semibold">Safety Rules</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p><strong>Women Priority:</strong> Women riders are prioritized to connect with women drivers first for enhanced safety.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p><strong>Not for Profit:</strong> This is a ride-sharing community, not a commercial service. Split costs fairly.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p><strong>Build Trust:</strong> Get to know your co-rider, become friends, then share rides regularly.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p><strong>Share Costs:</strong> Be transparent about fuel, tolls, and parking costs. Split equally.</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p><strong>Verify Profiles:</strong> Only ride with verified users. Check ratings and reviews.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="font-semibold">Quick Actions</h2>
          
          <button
            onClick={() => window.open("tel:+9502699398", "_self")}
            className="w-full flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition hover:bg-muted"
          >
            <Phone className="size-4 text-muted-foreground" />
            <span className="flex-1 font-medium">Call Safety Helpline</span>
          </button>

          <button
            onClick={() => window.open("https://wa.me/9502699398", "_blank")}
            className="w-full flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition hover:bg-muted"
          >
            <MessageCircle className="size-4 text-muted-foreground" />
            <span className="flex-1 font-medium">WhatsApp Support</span>
          </button>

          <button
            onClick={() => navigate({ to: "/profile" })}
            className="w-full flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition hover:bg-muted"
          >
            <Users className="size-4 text-muted-foreground" />
            <span className="flex-1 font-medium">Emergency Contacts</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
