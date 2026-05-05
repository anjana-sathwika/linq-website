import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
      <div className="mx-auto max-w-md px-5 pt-8 pb-32">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate({ to: "/profile" })}
            className="rounded-full bg-secondary p-2"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-2xl font-bold">Payments</h1>
        </div>

        {/* Current Plan Status */}
        <div className={`mb-6 rounded-2xl border p-4 ${planStatus.color.includes('red') ? 'border-red-200 bg-red-50' : planStatus.color.includes('orange') ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Current Plan</h2>
            <span className={`text-sm font-medium ${planStatus.color}`}>
              {planStatus.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="size-4" />
            <span className="font-medium capitalize">{plan}</span>
            {planExpiry && (
              <span className="text-sm text-muted-foreground">
                · Expires {new Date(planExpiry).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Unlocks Available */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="size-4 text-green-500" />
            <h2 className="font-semibold">Unlocks Available</h2>
          </div>
          <div className="text-2xl font-bold text-primary">
            {plan === "monthly" ? "∞" : plan === "weekly" ? "10" : "2"}
          </div>
          <p className="text-sm text-muted-foreground">
            {plan === "monthly" ? "Unlimited unlocks this month" : 
             plan === "weekly" ? "Unlocks remaining this week" : 
             "Unlocks remaining today"}
          </p>
        </div>

        {/* Payment History */}
        <div>
          <h2 className="mb-4 font-semibold">Payment History</h2>
          <div className="space-y-3">
            {mockPayments.map((payment) => (
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
