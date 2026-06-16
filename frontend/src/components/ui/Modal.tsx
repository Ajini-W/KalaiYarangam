"use client";

import * as React from "react";
import { X, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

/* ─── Modal ───────────────────────────────────────────────────────────────── */
const modalSizes = {
  sm:   "max-w-sm",
  md:   "max-w-lg",
  lg:   "max-w-2xl",
  xl:   "max-w-4xl",
  full: "max-w-full h-full rounded-none m-0",
} as const;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: keyof typeof modalSizes;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, description, size = "md", footer, children, className }: ModalProps) {
  // Focus trap + ESC
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-labelledby={title ? "modal-title" : undefined}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      {/* Panel */}
      <div className={cn(
        "relative z-10 flex w-full flex-col rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-4)] animate-in fade-in zoom-in-95 duration-[var(--duration-modal)]",
        modalSizes[size],
        className,
      )}>
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
            <div>
              {title && <h2 id="modal-title" className="text-base font-semibold text-text-primary">{title}</h2>}
              {description && <p className="mt-0.5 text-sm text-text-secondary">{description}</p>}
            </div>
            <button onClick={onClose} className="rounded-[var(--radius-sm)] p-1 text-text-secondary hover:bg-surface-overlay transition-colors" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        )}
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {/* Footer */}
        {footer && <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

/* ─── ConfirmModal ────────────────────────────────────────────────────────── */
const intentConfig = {
  danger:  { icon: AlertTriangle, iconClass: "text-danger",  confirmVariant: "danger"     as const },
  warning: { icon: AlertTriangle, iconClass: "text-warning", confirmVariant: "primary"    as const },
  info:    { icon: Info,          iconClass: "text-info",    confirmVariant: "primary"    as const },
  success: { icon: CheckCircle2,  iconClass: "text-success", confirmVariant: "primary"    as const },
} as const;

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  intent?: keyof typeof intentConfig;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmModal({
  open, onClose, onConfirm,
  title, description,
  intent = "danger",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading,
}: ConfirmModalProps) {
  const { icon: Icon, iconClass, confirmVariant } = intentConfig[intent];
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <div className="flex gap-4">
        <Icon className={cn("mt-0.5 shrink-0", iconClass)} size={22} aria-hidden />
        <div>
          <p className="font-semibold text-text-primary">{title}</p>
          {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
        </div>
      </div>
    </Modal>
  );
}

/* ─── BottomSheet ─────────────────────────────────────────────────────────── */
export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoint?: "half" | "full";
}

export function BottomSheet({ open, onClose, title, children, snapPoint = "half" }: BottomSheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className={cn(
        "relative z-10 flex flex-col rounded-t-[var(--radius-xl)] bg-surface shadow-[var(--shadow-4)]",
        snapPoint === "half" ? "max-h-[55vh]" : "max-h-[92vh]",
      )}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-border" aria-hidden />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pb-3">
            <h2 className="text-base font-semibold text-text-primary">{title}</h2>
            <button onClick={onClose} className="rounded p-1 text-text-secondary hover:bg-surface-overlay" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-5 pb-8">{children}</div>
      </div>
    </div>
  );
}
