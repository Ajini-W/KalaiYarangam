"use client";

import { Card, CardBody } from "@/components/ui/Card";
import { ProgressBar } from "./ProgressBar";
import { LevelBeltIndicator } from "./LevelBeltIndicator";
import type { ProgressRecord } from "@/types/progress";

interface ProgressCardProps {
  record: ProgressRecord;
  onClick?: () => void;
  simple?: boolean;
}

export function ProgressCard({ record, onClick, simple }: ProgressCardProps) {
  return (
    <Card
      className={onClick ? "cursor-pointer transition-colors hover:border-primary/40" : undefined}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <CardBody className="flex gap-4 py-4">
        <LevelBeltIndicator
          grade={record.grade}
          percentage={record.percentage}
          size={simple ? "sm" : "md"}
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="truncate font-medium text-text-primary">
              {record.student?.name ?? "Student"}
            </p>
            {!simple && record.batch?.name && (
              <p className="text-xs text-text-secondary">{record.batch.name}</p>
            )}
          </div>
          <ProgressBar value={record.percentage} label={simple ? "Overall progress" : record.module ?? "Overall"} />
          {!simple && record.remarks && (
            <p className="line-clamp-2 text-xs text-text-secondary">{record.remarks}</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
