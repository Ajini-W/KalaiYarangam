import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1),
  );

  const btn = (label: React.ReactNode, onClick: () => void, disabled: boolean, active = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-8 min-w-8 items-center justify-center rounded-[var(--radius-sm)] px-2 text-sm transition-colors",
        active ? "bg-brand-500 text-white" : "text-text-secondary hover:bg-surface-overlay disabled:opacity-40 disabled:cursor-not-allowed",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 text-sm text-text-secondary", className)}>
      <span>{from}–{to} of {total}</span>
      <div className="flex items-center gap-1">
        {btn(<ChevronLeft size={16} />, () => onPageChange(page - 1), page === 1)}
        {pages.reduce<React.ReactNode[]>((acc, p, i, arr) => {
          if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push(<span key={`ellipsis-${p}`} className="px-1">…</span>);
          acc.push(btn(String(p), () => onPageChange(p), false, p === page));
          return acc;
        }, [])}
        {btn(<ChevronRight size={16} />, () => onPageChange(page + 1), page === totalPages)}
      </div>
    </div>
  );
}
