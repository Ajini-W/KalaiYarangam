"use client";

import { useState } from "react";
import { Search, X, Check, Star, UserPlus, UserMinus } from "lucide-react";
import { Button, Badge, Card, CardHeader, CardBody, Skeleton } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Trainer, Batch } from "@/services/training";

interface TrainerAssignmentPanelProps {
  trainers: Trainer[];
  assignedBatches: Batch[];
  loading?: boolean;
  onAssign: (trainerId: string, batchId: string) => Promise<void>;
  onRemove: (trainerId: string, batchId: string) => Promise<void>;
  onSetPrimary: (trainerId: string, batchId: string) => Promise<void>;
  trainerBatches?: Record<string, Batch[]>;
  defaultTrainerId?: string | null;
}

export function TrainerAssignmentPanel({
  trainers,
  assignedBatches,
  loading,
  onAssign,
  onRemove,
  onSetPrimary,
  trainerBatches,
  defaultTrainerId,
}: TrainerAssignmentPanelProps) {
  const [search, setSearch] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(defaultTrainerId ?? null);
  const [assigning, setAssigning] = useState(false);

  const filteredTrainers = trainers.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAssign = async (batchId: string) => {
    if (!selectedTrainer) return;
    setAssigning(true);
    try {
      await onAssign(selectedTrainer, batchId);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-[300px] rounded-[var(--radius-md)]" />
        <Skeleton className="h-[300px] rounded-[var(--radius-md)]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold">Trainers</h3>
          <span className="text-xs text-text-secondary">{trainers.length} total</span>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trainers…"
              className="h-8 w-full rounded-[var(--radius-sm)] border border-border bg-surface pl-8 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="max-h-[350px] space-y-1 overflow-y-auto">
            {filteredTrainers.map((trainer) => (
              <button
                key={trainer.id}
                onClick={() => setSelectedTrainer(trainer.id === selectedTrainer ? null : trainer.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-left transition-colors",
                  selectedTrainer === trainer.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-surface-overlay text-text-primary",
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {trainer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{trainer.name}</p>
                  <p className="text-xs text-text-secondary truncate">{trainer.email}</p>
                </div>
                <Badge
                  variant={trainer.status === "ACTIVE" ? "success" : trainer.status === "ON_LEAVE" ? "warning" : "outline"}
                  size="sm"
                >
                  {trainer.status === "ACTIVE" ? "Active" : trainer.status === "ON_LEAVE" ? "On Leave" : "Inactive"}
                </Badge>
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold">
            {selectedTrainer ? "Assigned Batches" : "Available Batches"}
          </h3>
          <span className="text-xs text-text-secondary">
            {selectedTrainer
              ? `${(trainerBatches?.[selectedTrainer] ?? []).length} assigned`
              : `${assignedBatches.length} total`}
          </span>
        </CardHeader>
        <CardBody className="pt-0">
          {!selectedTrainer ? (
            <p className="py-8 text-center text-sm text-text-secondary">Select a trainer to manage assignments</p>
          ) : (trainerBatches?.[selectedTrainer] ?? []).length === 0 && assignedBatches.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-secondary">No batches assigned yet</p>
          ) : (
            <div className="max-h-[350px] space-y-2 overflow-y-auto">
              {(trainerBatches?.[selectedTrainer] ?? []).length > 0
                ? (trainerBatches?.[selectedTrainer] ?? []).map((batch) => (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary truncate">{batch.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant={batch.status === "ACTIVE" ? "success" : batch.status === "UPCOMING" ? "info" : "outline"}
                            size="sm"
                          >
                            {batch.status}
                          </Badge>
                          {(batch as { isPrimary?: boolean }).isPrimary && (
                            <Badge variant="brand" size="sm">
                              <Star size={10} className="mr-0.5" /> Primary
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => onSetPrimary(selectedTrainer, batch.id)}
                          title="Set as primary"
                        >
                          <Star size={14} />
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => onRemove(selectedTrainer, batch.id)}
                          title="Remove from batch"
                        >
                          <UserMinus size={14} />
                        </Button>
                      </div>
                    </div>
                  ))
                : assignedBatches.map((batch) => {
                    const tBatches = trainerBatches?.[selectedTrainer];
                    const isAssigned = tBatches?.some((b) => b.id === batch.id);
                    return (
                      <div
                        key={batch.id}
                        className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border px-3 py-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary truncate">{batch.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant={batch.status === "ACTIVE" ? "success" : batch.status === "UPCOMING" ? "info" : "outline"}
                              size="sm"
                            >
                              {batch.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {isAssigned ? (
                            <>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => onSetPrimary(selectedTrainer, batch.id)}
                                title="Set as primary"
                              >
                                <Star size={14} />
                              </Button>
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => onRemove(selectedTrainer, batch.id)}
                                title="Remove from batch"
                              >
                                <UserMinus size={14} />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => handleAssign(batch.id)}
                              loading={assigning}
                              title="Assign to batch"
                            >
                              <UserPlus size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
