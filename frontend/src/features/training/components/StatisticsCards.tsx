"use client";

import { BookOpen, Layers, GraduationCap, Users, Clock, FileText, Calendar, BarChart3 } from "lucide-react";
import { StatCard, Skeleton } from "@/components/ui";
import type { TrainingStats } from "@/services/training";

interface StatisticsCardsProps {
  stats?: TrainingStats | null;
  loading?: boolean;
}

export function StatisticsCards({ stats, loading }: StatisticsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-[var(--radius-md)]" />
        ))}
      </div>
    );
  }

  const cards = [
    { title: "Programs", value: stats?.totalPrograms ?? 0, icon: <BookOpen size={18} /> },
    { title: "Active Batches", value: stats?.activeBatches ?? 0, icon: <Layers size={18} /> },
    { title: "Active Trainers", value: stats?.activeTrainers ?? 0, icon: <GraduationCap size={18} /> },
    { title: "Total Students", value: stats?.totalStudents ?? 0, icon: <Users size={18} /> },
    { title: "Today's Classes", value: stats?.todayClasses ?? 0, icon: <Calendar size={18} /> },
    { title: "Upcoming Sessions", value: stats?.upcomingSessions ?? 0, icon: <Clock size={18} /> },
    { title: "Pending Documents", value: stats?.pendingDocuments ?? 0, icon: <FileText size={18} /> },
    { title: "Occupancy Rate", value: `${stats?.occupancyRate ?? 0}%`, icon: <BarChart3 size={18} /> },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} />
      ))}
    </div>
  );
}
