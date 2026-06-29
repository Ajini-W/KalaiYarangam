"use client";

import { Clock, UserPlus, X, ArrowUpCircle, MessageSquare } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { WaitlistEntry } from "@/services/training";

interface WaitlistItemProps {
  entry: WaitlistEntry;
  position: number;
  onPromote: (id: string) => void;
  onWithdraw: (id: string) => void;
  onViewStudent?: (id: string) => void;
  loading?: boolean;
}

const priorityColors: Record<string, string> = {
  HIGH: "border-l-danger",
  MEDIUM: "border-l-warning",
  LOW: "border-l-info",
};

export function WaitlistItem({ entry, position, onPromote, onWithdraw, onViewStudent, loading }: WaitlistItemProps) {
  return (
    <Card className={cn("border-l-4", priorityColors[entry.priority] ?? "border-l-border")}>
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {position}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-primary">{entry.studentName}</p>
            <Badge
              variant={
                entry.priority === "HIGH" ? "danger" :
                entry.priority === "MEDIUM" ? "warning" : "info"
              }
              size="sm"
            >
              {entry.priority}
            </Badge>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
            <span>{entry.studentPhone}</span>
            {entry.studentEmail && <span>• {entry.studentEmail}</span>}
            {entry.batch && <span>• {entry.batch.name}</span>}
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {new Date(entry.requestedAt).toLocaleDateString()}
            </span>
          </div>
          {entry.notes && (
            <div className="mt-1 flex items-start gap-1 text-xs text-text-secondary">
              <MessageSquare size={10} className="mt-0.5 shrink-0" />
              <span>{entry.notes}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Badge
            variant={
              entry.status === "WAITING" ? "warning" :
              entry.status === "PROMOTED" ? "success" :
              entry.status === "WITHDRAWN" ? "danger" : "outline"
            }
            size="sm"
          >
            {entry.status}
          </Badge>
        </div>

        {entry.status === "WAITING" && (
          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="xs"
              variant="primary"
              onClick={() => onPromote(entry.id)}
              loading={loading}
              title="Promote to enrollment"
            >
              <UserPlus size={14} />
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onWithdraw(entry.id)}
              loading={loading}
              title="Withdraw"
            >
              <X size={14} />
            </Button>
          </div>
        )}

        {onViewStudent && (
          <Button size="xs" variant="ghost" onClick={() => onViewStudent(entry.id)} title="View details">
            <ArrowUpCircle size={14} />
          </Button>
        )}
      </div>
    </Card>
  );
}
