import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, type ConnectMethod, type Profile } from "@/lib/store";
import { CheckCircle2, Instagram, MessageCircle, Send } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Create profile — linQ" }] }),
  component: Onboarding,
});

function Onboarding() {
  const { pendingProfile, signedIn, completeProfile } = useStore();
  const navigate = useNavigate();
  const [created, setCreated] = useState(false);

  useEffect(() => {
    if (!pendingProfile && !signedIn) navigate({ to: "/login" });
  }, [pendingProfile, signedIn, navigate]);

  const [name, setName] = useState(pendingProfile?.name ?? "");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<Profile["gender"]>("");
  const [bio, setBio] = useState("");
  const [connect, setConnect] = useState<ConnectMethod>("whatsapp");
  const [connectId, setConnectId] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");

  const bioWords = bio.trim() ? bio.trim().split(/\s+/).length : 0;
  const valid = name && phone && age && gender && bio && bioWords <= 20 && connectId && emergencyContact && emergencyContactName;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    completeProfile({
      name,
      email: pendingProfile?.email ?? "you@gmail.com",
      phone,
      age: parseInt(age, 10),
      gender,
      bio,
      connect,
      connectId,
      emergencyContact,
      emergencyContactName,
    });
    setCreated(true);
    setTimeout(() => navigate({ to: "/" }), 1400);
  }

  if (created) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-10 text-center">
          <CheckCircle2 className="size-16 text-primary" />
          <h2 className="text-xl font-semibold">Account Created Successfully! 🎉</h2>
          <p className="text-muted-foreground">
            Welcome to linQ! Your profile has been created and you're all set to start sharing rides.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting you to home page...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <form onSubmit={submit} className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-7">
        <h1 className="text-2xl font-bold">Tell us about you</h1>
        <p className="mt-1 text-sm text-muted-foreground">A short profile helps riders trust you.</p>

        <div className="mt-6 space-y-5">
          <Field label="Full name">
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </Field>
          <Field label="Phone number">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" className="input" />
          </Field>
          <Field label="Age">
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 25" min="16" max="100" className="input" />
          </Field>

          <Field label="Gender">
            <div className="flex gap-2">
              {(["male", "female", "other"] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 rounded-full border px-4 py-2 text-sm capitalize transition ${gender === g ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"
                    }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </Field>

          <Field label={`Short bio (${bioWords}/20 words)`}>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="e.g. Engineer who loves indie music and quiet morning rides."
            />
            {bioWords > 20 && <p className="mt-1 text-xs text-destructive">Keep it under 20 words.</p>}
          </Field>

          <Field label="How should others reach you?">
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
                { id: "instagram", label: "Instagram", Icon: Instagram },
                { id: "telegram", label: "Telegram", Icon: Send },
              ] as const).map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setConnect(c.id)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs transition ${connect === c.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"
                    }`}
                >
                  <c.Icon className="size-5" />
                  {c.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label={connect === "whatsapp" ? "WhatsApp number" : `${connect[0].toUpperCase()}${connect.slice(1)} username`}>
            {connect === "whatsapp" && (
              <div className="mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sameAsPhone"
                  checked={connectId === phone && phone !== ""}
                  onChange={(e) => {
                    if (e.target.checked && phone) setConnectId(phone);
                    else if (!e.target.checked && connectId === phone) setConnectId("");
                  }}
                  className="size-3.5 rounded border-border"
                />
                <label htmlFor="sameAsPhone" className="text-xs text-muted-foreground cursor-pointer">
                  Same as the no. provided above
                </label>
              </div>
            )}
            <input
              value={connectId}
              onChange={(e) => setConnectId(e.target.value)}
              placeholder={connect === "whatsapp" ? "+91 …" : "@yourhandle"}
              className="input"
            />
          </Field>

          <Field label="Emergency Contact Name">
            <input
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              placeholder="e.g. John Doe"
              className="input"
            />
          </Field>

          <Field label="Emergency Contact Number">
            <input
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="+91 98xxxx1122"
              className="input"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={!valid}
          className="mt-7 w-full rounded-full bg-primary py-3.5 font-semibold text-primary-foreground transition disabled:opacity-50"
        >
          Create account
        </button>
      </form>

      <style>{`.input { width:100%; border-radius: 0.75rem; border:1px solid hsl(var(--border)); background: var(--color-background); padding: 0.65rem 0.9rem; font-size: 0.95rem; outline: none; } .input:focus { border-color: var(--color-primary); }`}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
