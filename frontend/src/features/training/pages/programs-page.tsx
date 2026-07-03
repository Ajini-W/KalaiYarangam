"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, MoreHorizontal, BookOpen, Edit3, Trash2, Copy, Archive, Eye } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Table, Badge, Pagination, SearchBar, FilterBar, Modal, ConfirmModal, Card, StatCard, Skeleton } from "@/components/ui";
import { ProgramForm, type FormData } from "../components/ProgramForm";
import { getCourses, createCourse, updateCourse, archiveCourse, restoreCourse, getCourseStats, type Course, type BatchStats } from "@/services/training";
import { toast } from "sonner";

export function ProgramsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<BatchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const pageSize = 10;

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCourses({ page, pageSize, search, status: activeFilters.status, sortBy: sortKey, sortDir });
      setCourses(res.data ?? []);
      setTotal(res.meta?.total ?? res.data?.length ?? 0);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilters, sortKey, sortDir]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getCourseStats();
      setStats(res.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, formData);
        toast.success("Program updated successfully");
      } else {
        await createCourse(formData);
        toast.success("Program created successfully");
      }
      setModalOpen(false);
      setEditingCourse(null);
      fetchCourses();
      fetchStats();
    } catch {
      toast.error("Failed to save program");
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (course: Course) => {
    try {
      await archiveCourse(course.id);
      toast.success("Program archived");
      fetchCourses();
      fetchStats();
    } catch {
      toast.error("Failed to archive program");
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const columns = [
    { key: "name", header: "Program", sortable: true, render: (row: Course) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-primary/10">
          <BookOpen size={14} className="text-primary" />
        </div>
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          {row.category && <p className="text-xs text-text-secondary">{row.category.name}</p>}
        </div>
      </div>
    )},
    { key: "duration", header: "Duration", render: (row: Course) => (
      <span className="text-sm text-text-secondary">{row.duration || "-"}</span>
    )},
    { key: "fee", header: "Fee", render: (row: Course) => (
      <span className="text-sm font-medium tabular-nums">{row.fee != null ? `₹${row.fee.toLocaleString()}` : "-"}</span>
    )},
    { key: "isActive", header: "Status", render: (row: Course) => (
      <Badge variant={row.isActive ? "success" : "outline"} size="sm">
        {row.isActive ? "Active" : "Inactive"}
      </Badge>
    )},
    { key: "actions", header: "", className: "w-20", render: (row: Course) => (
      <div className="flex items-center gap-1">
        <Button size="xs" variant="ghost" onClick={() => { setEditingCourse(row); setModalOpen(true); }} title="Edit">
          <Edit3 size={14} />
        </Button>
        <Button size="xs" variant="ghost" onClick={() => setDeleteConfirm(row)} title="Archive">
          <Archive size={14} />
        </Button>
        <Button size="xs" variant="ghost" title="Duplicate">
          <Copy size={14} />
        </Button>
      </div>
    )},
  ];

  const filterDefs = [
    { key: "status", label: "Status", options: [
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ]},
  ];

  return (
    <PageContainer
      title="Programs"
      subtitle="Manage your training programs"
      actions={
        <Button size="sm" onClick={() => { setEditingCourse(null); setModalOpen(true); }}>
          <Plus size={16} /> New Program
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard title="Total Programs" value={stats?.total ?? courses.length} icon={<BookOpen size={18} />} />
        <StatCard title="Active" value={courses.filter((c) => c.isActive).length} icon={<BookOpen size={18} />} />
        <StatCard title="Categories" value={new Set(courses.filter((c) => c.category?.name).map((c) => c.category?.name)).size} icon={<BookOpen size={18} />} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 pb-0">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search programs…" className="max-w-xs" />
          <FilterBar filters={filterDefs} active={activeFilters} onChange={(k, v) => setActiveFilters((p) => ({ ...p, [k]: v }))} onClear={() => setActiveFilters({})} />
        </div>
        <Table
          columns={columns}
          data={courses}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          emptyTitle="No programs found"
          emptyDescription="Create your first program to get started"
        />
        <div className="px-4 py-3">
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCourse(null); }}
        title={editingCourse ? "Edit Program" : "Create Program"}
        size="md"
      >
        <ProgramForm
          initialData={editingCourse}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditingCourse(null); }}
          loading={submitting}
        />
      </Modal>

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={async () => {
          if (deleteConfirm) await handleArchive(deleteConfirm);
          setDeleteConfirm(null);
        }}
        title="Archive Program"
        description={`Are you sure you want to archive "${deleteConfirm?.name}"? This action can be reversed.`}
        confirmLabel="Archive"
        intent="warning"
      />
    </PageContainer>
  );
}
