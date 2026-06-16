import * as React from "react";
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/cn";

const config = {
  success: { icon: CheckCircle2, base: "bg-success-light border-success text-success-700" },
  warning: { icon: AlertTriangle, base: "bg-warning-light border-warning text-warning-700" },
  danger:  { icon: XCircle,       base: "bg-danger-light  border-danger  text-danger-700"  },
  info:    { icon: Info,           base: "bg-info-light    border-info    text-info-700"    },
} as const;

export interface AlertProps {
  type?: keyof typeof config;
  title?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({ type = "info", title, children, dismissible, onDismiss, className }: AlertProps) {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;

  const { icon: Icon, base } = config[type];
  const dismiss = () => { setVisible(false); onDismiss?.(); };

  return (
    <div role="alert" className={cn("flex gap-3 rounded-[var(--radius-md)] border p-4", base, className)}>
      <Icon className="mt-0.5 shrink-0" size={18} aria-hidden />
      <div className="flex-1 text-sm">
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        {children && <div className="opacity-90">{children}</div>}
      </div>
      {dismissible && (
        <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
