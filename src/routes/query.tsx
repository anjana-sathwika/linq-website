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
        </main>
    );
  }

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
          <h1 className="text-2xl font-bold">Raise a Query</h1>
        </div>

        {/* Query Type Selection */}
        <div className="mb-6">
          <h2 className="mb-3 font-semibold">Query Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {queryTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setQueryType(type.id as any)}
                className={`rounded-xl border p-3 text-left transition ${
                  queryType === type.id 
                    ? "border-primary bg-primary/10" 
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <p className="font-medium">{type.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Query Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={100}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {subject.length}/100 characters
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Detailed Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide all relevant details about your query..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={6}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {message.length}/500 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !subject.trim() || !message.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-background transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Submit Query</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Info */}
        <div className="mt-6 rounded-xl bg-muted p-4">
          <h3 className="mb-2 font-semibold flex items-center gap-2">
            <MessageSquare className="size-4" />
            Response Time
          </h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• General queries: 24 hours</li>
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
