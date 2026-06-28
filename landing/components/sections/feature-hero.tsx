"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import {
  Users,
  ClipboardList,
  Wallet,
  CalendarDays,
  MessageSquare,
  Package,
  CalendarCheck,
  FileText,
  Smartphone,
  BarChart3,
  ShieldCheck,
  Layers,
  GraduationCap,
  Bell,
  CreditCard,
  Globe,
  Zap,
  Lock,
  TrendingUp,
  Clock,
  UserCheck,
  Settings,
  PieChart,
  FileCheck,
  Headphones,
  Cloud,
  RefreshCw,
  AlertTriangle,
  Target,
  Repeat,
  Send,
  Eye,
  LayoutDashboard,
  Database,
  Workflow,
  GitBranch,
  QrCode,
  MapPin,
  Star,
  BookOpen,
  Video,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Users,
  ClipboardList,
  Wallet,
  CalendarDays,
  MessageSquare,
  Package,
  CalendarCheck,
  FileText,
  Smartphone,
  BarChart3,
  ShieldCheck,
  Layers,
  GraduationCap,
  Bell,
  CreditCard,
  Globe,
  Zap,
  Lock,
  TrendingUp,
  Clock,
  UserCheck,
  Settings,
  PieChart,
  FileCheck,
  Headphones,
  Cloud,
  RefreshCw,
  AlertTriangle,
  Target,
  Repeat,
  Send,
  Eye,
  LayoutDashboard,
  Database,
  Workflow,
  GitBranch,
  QrCode,
  MapPin,
  Star,
  BookOpen,
  Video,
  MessageCircle,
};

export function FeatureHero({
  iconName,
  bgColor,
  color,
  category,
  name,
  tagline,
  stats,
}: {
  iconName: string;
  bgColor: string;
  color: string;
  category: string;
  name: string;
  tagline: string;
  stats?: { value: string; label: string }[];
}) {
  const Icon = iconMap[iconName] || Users;

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:pt-20">
      {/* Rich background matching main hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-alt via-background to-background" />
        <div className="absolute left-[10%] top-[5%] h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute right-[5%] top-[10%] h-[400px] w-[400px] rounded-full bg-accent-blue/8 blur-[120px]" />
        <div className="absolute left-[40%] top-[30%] h-[300px] w-[300px] rounded-full bg-accent-red/6 blur-[100px]" />
        {/* Decorative floating shapes */}
        <div className="absolute left-[8%] top-[20%] size-16 rounded-2xl bg-primary/10 rotate-12 animate-float" />
        <div className="absolute right-[12%] top-[15%] size-12 rounded-full bg-accent-blue/10 animate-float-delayed" />
        <div className="absolute left-[20%] bottom-[30%] size-10 rounded-xl bg-accent-red/10 -rotate-12 animate-float-slow" />
        <div className="absolute right-[15%] bottom-[25%] size-14 rounded-2xl bg-accent-cyan/10 rotate-45 animate-float" />
        <div className="absolute left-[50%] top-[8%] size-8 rounded-full bg-accent-green/10 animate-float-delayed" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`mx-auto grid size-20 place-items-center rounded-3xl ${bgColor} ${color} mb-8 shadow-lg`}
        >
          <Icon className="size-10" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-sm"
        >
          {category}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 text-balance font-heading text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <a
            href="https://sarran.formaloo.co/zpwci7"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-6 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
            style={{
              background: "linear-gradient(135deg, #FFB21D 0%, #FF8A00 100%)",
            }}
          >
            <Heart className="size-4 shrink-0 sm:size-5" />
            Join Wishlist
          </a>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
