import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, Home, Search, ClipboardList, CreditCard, User, Sun, Moon } from "lucide-react";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";

const links = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/search", label: "Find a ride", Icon: Search },
  { to: "/trips", label: "Trips", Icon: ClipboardList },
  { to: "/pricing", label: "Pricing", Icon: CreditCard },
] as const;

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { signedIn, profile } = useStore();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 hidden w-full border-b border-border/60 bg-background/80 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            linQ
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <l.Icon className="size-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="rounded-full border border-border bg-card/60 p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "sapphire" ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
          </button>
          {signedIn ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-2 py-1.5 pr-4 text-sm font-medium hover:bg-secondary"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary/30 text-primary-foreground">
                <User className="size-4" />
              </span>
              <span className="max-w-[8rem] truncate">{profile?.name ?? "Profile"}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
