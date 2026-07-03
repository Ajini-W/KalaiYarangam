import * as React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T extends { id?: string | number }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string | number>;
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  sortKey?: string;
  sortDir?: string;
  onSort?: (key: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function Table<T extends { id?: string | number }>({
  columns, data, loading, selectable,
  selectedIds, onSelectAll, onSelectRow,
  sortKey, sortDir, onSort,
  emptyTitle = "No data", emptyDescription,
  className,
}: TableProps<T>) {
  const allSelected = data.length > 0 && data.every((r) => r.id != null && selectedIds?.has(r.id));

  return (
    <div className={cn("w-full overflow-x-auto rounded-[var(--radius-md)] border border-border", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-raised">
            {selectable && (
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="accent-primary"
                  aria-label="Select all"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary",
                  col.sortable && "cursor-pointer select-none hover:text-text-primary",
                  col.headerClassName,
                )}
                onClick={() => col.sortable && onSort?.(String(col.key))}
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    sortKey === String(col.key)
                      ? sortDir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      : <ArrowUpDown size={12} className="opacity-40" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border-subtle">
                {selectable && <td className="px-3 py-3"><Skeleton className="h-4 w-4" /></td>}
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)}>
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </td>
            </tr>
          ) : (
            data.map((row, ri) => (
              <tr
                key={row.id ?? ri}
                className={cn(
                  "border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-raised",
                  row.id != null && selectedIds?.has(row.id) && "bg-primary/5",
                )}
              >
                {selectable && (
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={row.id != null && (selectedIds?.has(row.id) ?? false)}
                      onChange={(e) => row.id != null && onSelectRow?.(row.id, e.target.checked)}
                      className="accent-primary"
                      aria-label="Select row"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={String(col.key)} className={cn("px-4 py-3 text-text-primary", col.className)}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
