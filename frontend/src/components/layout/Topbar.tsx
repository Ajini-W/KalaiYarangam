"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, Sun, Moon, User, Settings, Lock, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { Breadcrumb } from "./Breadcrumb";
import { useAuthStore } from "@/store/auth.store";

interface TopbarProps {
  onMenuToggle: () => void;
  className?: string;
}

export function Topbar({ onMenuToggle, className }: TopbarProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [dark, setDark] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-[60px] shrink-0 items-center gap-4 border-b border-border bg-surface/95 px-4 backdrop-blur-sm",
        className,
      )}
    >
      <button
        onClick={onMenuToggle}
        className="rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:block flex-1">
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button className="rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors" aria-label="Search">
          <Search size={18} />
        </button>

        <button onClick={toggleDark} className="rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors" aria-label="Toggle dark mode">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" aria-hidden />
        </button>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="ml-1 flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 hover:bg-surface-overlay transition-colors"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
              {initials}
            </span>
            <span className="hidden md:block text-sm font-medium text-text-primary">
              {user?.name || "User"}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-[var(--radius-md)] border border-border bg-surface shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                <p className="text-xs text-text-secondary truncate">{user?.email}</p>
              </div>
              <Link
                href="/dashboard/settings/organisation"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors"
              >
                <Settings size={16} className="text-text-secondary" />
                Settings
              </Link>
              <Link
                href="/dashboard/settings/change-password"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors"
              >
                <Lock size={16} className="text-text-secondary" />
                Change Password
              </Link>
              <hr className="border-border my-1" />
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-surface-overlay transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
