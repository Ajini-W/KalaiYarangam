"use client";

import * as React from "react";
import { Menu, Search, Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Breadcrumb } from "./Breadcrumb";

interface TopbarProps {
  onMenuToggle: () => void;
  className?: string;
}

export function Topbar({ onMenuToggle, className }: TopbarProps) {
  const [dark, setDark] = React.useState(false);

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-[60px] shrink-0 items-center gap-4 border-b border-border bg-surface/95 px-4 backdrop-blur-sm",
        className,
      )}
    >
      {/* Left */}
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

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Search */}
        <button className="rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors" aria-label="Search">
          <Search size={18} />
        </button>

        {/* Dark mode */}
        <button onClick={toggleDark} className="rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors" aria-label="Toggle dark mode">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" aria-hidden />
        </button>

        {/* User menu */}
        <button className="ml-1 flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 hover:bg-surface-overlay transition-colors">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            A
          </span>
          <span className="hidden md:block text-sm font-medium text-text-primary">Admin</span>
          <ChevronDown size={14} className="text-text-secondary" />
        </button>
      </div>
    </header>
  );
}
