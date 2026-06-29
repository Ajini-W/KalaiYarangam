"use client";

import { Select } from "@/components/ui/Select";
import type { ExportFormat } from "@/types/reports";

const FORMAT_OPTIONS = [
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel (XLSX)" },
  { value: "pdf", label: "PDF" },
];

interface FormatSelectorProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <Select
      label="Export format"
      options={FORMAT_OPTIONS}
      value={value}
      onChange={(e) => onChange(e.target.value as ExportFormat)}
    />
  );
}
