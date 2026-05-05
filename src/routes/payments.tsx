import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { useStore } from "@/lib/store";
import { ArrowLeft, CreditCard, Calendar, Clock, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Payments — linQ" }] }),
  component: Payments,
});

function Payments() {
  const { plan, planExpiry, profile } = useStore();
  const navigate = useNavigate();

  const mockPayments = [
    {
      id: "pay1",
      date: "2024-05-01",
      description: "Weekly Plan",
      amount: "₹199",
      status: "completed",
      unlocksRemaining: 10
    },
    {
      id: "pay2", 
      date: "2024-04-24",
      description: "Daily Pass",
      amount: "₹49",
      status: "completed",
      unlocksRemaining: 2
    }
  ];

  const getPlanStatus = () => {
    if (!planExpiry) return { status: "No active plan", color: "text-muted-foreground" };
    
    const now = Date.now();
    const expiryTime = planExpiry;
    const daysRemaining = Math.ceil((expiryTime - now) / (24 * 60 * 60 * 1000));
    
    if (daysRemaining <= 0) {
      return { status: "Plan expired", color: "text-red-500" };
    } else if (daysRemaining <= 3) {
      return { status: `Expires in ${daysRemaining} days`, color: "text-orange-500" };
    } else {
      return { status: `Valid for ${daysRemaining} days`, color: "text-green-500" };
    }
  };

  const planStatus = getPlanStatus();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Payments</h1>
          <button 
            onClick={() => navigate({ to: "/profile" })}
            className="rounded-full bg-secondary p-2 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className={`bg-card rounded-2xl border p-6 text-center ${
            planStatus.color.includes('red') ? 'border-red-200 bg-red-50' : 
            planStatus.color.includes('orange') ? 'border-orange-200 bg-orange-50' : 
            'border-green-200 bg-green-50'
          }`}>
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <div className={`size-12 rounded-full ${
                planStatus.color.includes('red') ? 'bg-red-500' : 
                planStatus.color.includes('orange') ? 'bg-orange-500' : 
                'bg-green-500'
              } flex items-center justify-center`}>
                <CreditCard className="size-6 text-white" />
              </div>
            </div>
            <h3 className="font-semibold">Active Plan</h3>
            <p className="text-2xl font-bold text-green-600 capitalize">{plan}</p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <div className="size-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="size-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Total Spent</h3>
            <p className="text-2xl font-bold text-blue-600">₹1,247</p>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <div className="size-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="size-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Rides This Month</h3>
            <p className="text-2xl font-bold text-purple-600">23</p>
          </div>
          
          <div className={`bg-card rounded-2xl border p-6 text-center ${
            planStatus.color.includes('red') ? 'border-red-200 bg-red-50' : 
            planStatus.color.includes('orange') ? 'border-orange-200 bg-orange-50' : 
            'border-green-200 bg-green-50'
          }`}>
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <div className={`size-12 rounded-full ${
                planStatus.color.includes('red') ? 'bg-red-500' : 
                planStatus.color.includes('orange') ? 'bg-orange-500' : 
                'bg-green-500'
              } flex items-center justify-center`}>
                <CreditCard className="size-6 text-white" />
              </div>
            </div>
            <h3 className="font-semibold">Plan Status</h3>
            <p className={`text-lg font-medium ${planStatus.color}`}>{planStatus.status}</p>
            {planExpiry && (
              <p className="text-sm text-muted-foreground mt-2">
                Expires {new Date(planExpiry).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Plan Details & Upgrade */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="size-5 text-primary" />
              Current Plan Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plan Type</span>
                <span className="font-medium capitalize">{plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Unlocks Available</span>
                <span className="font-medium">
                  {plan === "monthly" ? "∞" : plan === "weekly" ? "10" : "2"}
                </span>
              </div>
              {planExpiry && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="text-sm">{new Date(planExpiry).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Upgrade Options</h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl p-4 text-left hover:from-primary/90 hover:to-primary transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Weekly Plan</h4>
                    <p className="text-sm text-primary/80">Best for regular commuters</p>
                  </div>
                  <span className="text-xl font-bold">₹199/week</span>
                </div>
              </button>
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 text-left hover:from-blue-700 hover:to-blue-800 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Monthly Plan</h4>
                    <p className="text-sm text-blue-100">Perfect for frequent travelers</p>
                  </div>
                  <span className="text-xl font-bold">₹599/month</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="size-5 text-muted-foreground" />
            Recent Transactions
          </h3>
          
          <div className="space-y-3">
            {mockPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-xl bg-card/50 hover:bg-card transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`size-10 rounded-full flex items-center justify-center ${
                    payment.status === 'completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                  }`}>
                    {payment.status === 'completed' ? (
                      <CheckCircle className="size-5 text-green-600" />
                    ) : (
                      <Clock className="size-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
              <div key={payment.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="text-sm">{payment.date}</span>
                      {payment.status === "completed" && (
                        <CheckCircle className="size-4 text-green-500" />
                      )}
                    </div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-lg font-bold text-primary">{payment.amount}</p>
                  </div>
                </div>
                {payment.unlocksRemaining && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {payment.unlocksRemaining} unlocks included
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
