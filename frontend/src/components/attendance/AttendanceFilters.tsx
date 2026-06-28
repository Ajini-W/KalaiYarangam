"use client";

import { Input } from "@/components/ui/Input";
import { EntitySearch } from "@/components/shared/EntitySearch";
import type { SearchResultItem } from "@/services/search.service";

export interface AttendanceFiltersValue {
  batchId: string;
  batchLabel: string;
  dateFrom: string;
  dateTo: string;
}

interface AttendanceFiltersProps {
  value: AttendanceFiltersValue;
  onChange: (value: AttendanceFiltersValue) => void;
  showBatchSearch?: boolean;
}

export function AttendanceFilters({
  value,
  onChange,
  showBatchSearch = true,
}: AttendanceFiltersProps) {
  const handleBatchSelect = (item: SearchResultItem) => {
    onChange({ ...value, batchId: item.id, batchLabel: item.label });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {showBatchSearch && (
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">Batch</label>
          <EntitySearch
            searchType="batches"
            onSelect={handleBatchSelect}
            placeholder="Filter by batch…"
          />
          {value.batchLabel && (
            <p className="mt-1 text-xs text-text-secondary">Selected: {value.batchLabel}</p>
          )}
        </div>
      )}
      <Input
        type="date"
        label="From"
        value={value.dateFrom}
        onChange={(e) => onChange({ ...value, dateFrom: e.target.value })}
      />
      <Input
        type="date"
        label="To"
        value={value.dateTo}
        onChange={(e) => onChange({ ...value, dateTo: e.target.value })}
      />
    </div>
  );
}
