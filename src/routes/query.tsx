import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { useState } from "react";
import { ArrowLeft, MessageSquare, Send, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/query")({
  head: () => ({ meta: [{ title: "Raise a Query — linQ" }] }),
  component: Query,
});

function Query() {
  const navigate = useNavigate();
  const [queryType, setQueryType] = useState<"general" | "payment" | "safety" | "technical">("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const queryTypes = [
    { id: "general", label: "General Query", description: "App usage, features, suggestions" },
    { id: "payment", label: "Payment Issue", description: "Refunds, plan changes, billing" },
    { id: "safety", label: "Safety Concern", description: "Report incidents, harassment, fraud" },
    { id: "technical", label: "Technical Issue", description: "Bugs, crashes, performance" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    const queryData = {
      type: queryType,
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    // Send to backend (mock)
    console.log("Query submitted:", queryData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setSubject("");
      setMessage("");
      setQueryType("general");
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-md px-5 pt-8 pb-32">
          <div className="text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h1 className="mb-3 text-2xl font-bold text-green-600">Query Submitted!</h1>
            <p className="mb-6 text-muted-foreground">
              We've received your query and will respond within 24 hours. You'll get an email with our response.
            </p>
            <button
              onClick={() => navigate({ to: "/profile" })}
              className="rounded-full bg-primary py-3 font-semibold text-background transition hover:opacity-90"
            >
              Back to Profile
            </button>
          </div>
        </div>
          <BottomNav />
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Raise a Query</h1>
          <button 
            onClick={() => navigate({ to: "/profile" })}
            className="rounded-full bg-secondary p-2 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Query Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Query Type</label>
                <select 
                  value={queryType} 
                  onChange={(e) => setQueryType(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
                >
                  <option value="general">General Query</option>
                  <option value="payment">Payment Issue</option>
                  <option value="safety">Safety Concern</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your query"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please provide detailed information about your query..."
                  rows={8}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 py-4 font-semibold text-primary-foreground transition hover:from-primary/90 hover:to-primary disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Query"}
              </button>
            </form>
          </div>

          {/* Right Column - Help Resources */}
          <div className="space-y-6">
            {/* Quick Help Card */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="size-5 text-primary" />
                Quick Help
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="size-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="size-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Emergency</p>
                    <p className="text-sm text-muted-foreground">For urgent issues, use the SOS feature</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="size-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Track Status</p>
                    <p className="text-sm text-muted-foreground">Check your email for updates on your query</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="size-5 text-primary" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border border-border rounded-xl">
                  <Mail className="size-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@linq.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border border-border rounded-xl">
                  <Phone className="size-5 text-green-500" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">1800-LINQ-HELP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                Response Times
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">General queries</span>
                  <span className="font-medium">24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment issues</span>
                  <span className="font-medium">12 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Safety concerns</span>
                  <span className="font-medium">6 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Technical issues</span>
                  <span className="font-medium">48 hours</span>
                </div>
              </div>
            </div>
          </div>
            <li>• Payment issues: 12 hours</li>
            <li>• Safety concerns: 6 hours</li>
            <li>• Technical issues: 48 hours</li>
          </ul>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
