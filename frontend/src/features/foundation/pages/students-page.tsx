"use client";

import { useState, useEffect, useCallback } from "react";
import { User, Phone, Mail, GraduationCap } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Card, Table, Badge, Pagination, SearchBar, Skeleton } from "@/components/ui";
import { getStudents, type Student } from "@/services/students";
import { useRouter } from "next/navigation";

export function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStudents(search);
      setStudents(res.data?.data ?? []);
      setTotal(res.data?.meta?.total ?? 0);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const columns = [
    { key: "name", header: "Student", render: (row: Student) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <span className="font-semibold text-primary">{row.name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
        </div>
      </div>
    )},
    { key: "contact", header: "Contact Info", render: (row: Student) => (
      <div>
        <p className="flex items-center gap-1 text-sm text-text-secondary"><Phone size={12}/> {row.phone || "-"}</p>
        <p className="flex items-center gap-1 text-xs text-text-secondary mt-0.5"><Mail size={12}/> {row.email || "-"}</p>
      </div>
    )},
    { key: "status", header: "Status", render: (row: Student) => (
      <Badge variant="success" size="sm">Active</Badge>
    )},
  ];

  return (
    <PageContainer
      title="Students"
      subtitle="Manage enrolled students and their progress"
    >
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 pb-0">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search students..." className="max-w-xs" />
        </div>
        <Table
          columns={columns}
          data={students}
          loading={loading}
          emptyTitle="No students found"
          emptyDescription="Converted leads will appear here as students"
          onRowClick={(row) => router.push(`/students/${row.id}`)}
        />
        <div className="px-4 py-3">
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </Card>
    </PageContainer>
  );
}
