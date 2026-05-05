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
      <div className="mx-auto max-w-md px-5 pt-8 pb-32">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate({ to: "/profile" })}
            className="rounded-full bg-secondary p-2"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-2xl font-bold">Safety & Verifications</h1>
        </div>

        {/* Emergency Actions */}
        <div className="mb-6 space-y-3">
          <h2 className="font-semibold text-red-500">Emergency Actions</h2>
          
          <button
            onClick={handleShareLocation}
            className="w-full flex items-center gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-left transition hover:bg-red-100"
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
            className="w-full flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-left transition hover:bg-orange-100"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-orange-500 text-white">
              <AlertTriangle className="size-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-orange-700">Send Alert</p>
              <p className="text-sm text-orange-600">Get immediate assistance</p>
            </div>
          </button>
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
