"use client";

import * as React from "react";
import { Plus, ExternalLink, Copy, Eye } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Table, type Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterBar, type FilterDef } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { FeePlanStatusBadge } from "@/features/finance/components/StatusBadge";
import { useFeePlans } from "@/features/finance/hooks/useFeePlans";
import { useAuthStore } from "@/store/auth.store";
import { Receipt, Wallet, Ban, Users } from "lucide-react";
import type { FeePlan } from "@/services/finance";

const statusFilters: FilterDef[] = [
  {
    key: "status",
    label: "All Statuses",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];

export default function FeePlansPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "";
  const canManage = role === "SUPER_ADMIN" || role === "OWNER" || role === "BRANCH_MANAGER";
  const canDelete = role === "SUPER_ADMIN";

  const {
    loading, feePlans, total,
    page, setPage, pageSize,
    search, setSearch,
    statusFilter, setStatusFilter,
    courseFilter, setCourseFilter,
    sortKey, sortDir, handleSort,
    modalOpen, setModalOpen,
    editingFeePlan, saving,
    openCreate, openEdit, onSubmit,
    actionConfirm, actionSaving, confirmAction, closeActionConfirm,
    requestAction, handleDuplicate,
    courseOptions,
    register, errors, handleSubmit,
  } = useFeePlans();

  const columns: Column<FeePlan>[] = React.useMemo(() => [
    { key: "planName", header: "Plan Name", sortable: true },
    { key: "courseName", header: "Course", sortable: true },
    {
      key: "admissionFee",
      header: "Admission Fee",
      render: (row) => `$${row.admissionFee.toLocaleString()}`,
    },
    {
      key: "tuitionFee",
      header: "Tuition Fee",
      render: (row) => `$${row.tuitionFee.toLocaleString()}`,
    },
    { key: "installments", header: "Installments" },
    {
      key: "discount",
      header: "Discount",
      render: (row) => `${row.discount}%`,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <FeePlanStatusBadge status={row.status} />,
    },
    {
      key: "studentsAssigned",
      header: "Students",
      render: (row) => (
        <span className="tabular-nums">{row.studentsAssigned}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="xs" onClick={() => {}} title="View">
            <Eye size={14} />
          </Button>
          {canManage && (
            <>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => openEdit(row)}
                title="Edit"
              >
                <ExternalLink size={14} />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleDuplicate(row)}
                title="Duplicate"
              >
                <Copy size={14} />
              </Button>
              {row.status === "active" ? (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => requestAction(row, "deactivate")}
                  title="Deactivate"
                >
                  <Ban size={14} />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => requestAction(row, "activate")}
                  title="Activate"
                >
                  <Badge variant="success" size="sm">Activate</Badge>
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => requestAction(row, "delete")}
                  title="Delete"
                  className="text-danger"
                >
                  <span className="text-xs">Del</span>
                </Button>
              )}
            </>
          )}
        </div>
      ),
    },
  ], [openEdit, handleDuplicate, requestAction, canManage, canDelete]);

  const activePlans = feePlans.filter((fp) => fp.status === "active");
  const inactivePlans = feePlans.filter((fp) => fp.status === "inactive");
  const totalStudents = feePlans.reduce((sum, fp) => sum + fp.studentsAssigned, 0);

  const confirmActionType = actionConfirm.action;
  const actionLabels: Record<string, { title: string; desc: string; intent: "info" | "danger" | "warning" }> = {
    activate: { title: "Activate Fee Plan", desc: "This fee plan will be available for use.", intent: "info" },
    deactivate: { title: "Deactivate Fee Plan", desc: "This fee plan will no longer be available.", intent: "warning" },
    delete: { title: "Delete Fee Plan", desc: "This action cannot be undone.", intent: "danger" },
  };
  const actionLabel = confirmActionType ? actionLabels[confirmActionType] : null;

  return (
    <PageContainer
      title="Fee Plans"
      subtitle="Manage fee plan templates"
      actions={
        canManage ? (
          <Button leftIcon={<Plus size={16} />} onClick={openCreate}>
            Create Fee Plan
          </Button>
        ) : undefined
      }
    >
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Fee Plans"
          value={total}
          icon={<Receipt size={20} />}
        />
        <StatCard
          title="Active Plans"
          value={activePlans.length}
          icon={<Wallet size={20} />}
          delta={`${total > 0 ? Math.round((activePlans.length / total) * 100) : 0}%`}
          deltaType="increase"
        />
        <StatCard
          title="Inactive Plans"
          value={inactivePlans.length}
          icon={<Ban size={20} />}
        />
        <StatCard
          title="Students Assigned"
          value={totalStudents}
          icon={<Users size={20} />}
        />
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by plan name or course…"
          className="w-full sm:max-w-xs"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Select
            options={[{ value: "", label: "All Courses" }, ...courseOptions.map((c) => ({ value: c.value, label: c.label }))]}
            value={courseFilter}
            onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
            className="w-44"
            aria-label="Filter by course"
          />
          <FilterBar
            filters={statusFilters}
            active={{ status: statusFilter }}
            onChange={(key, value) => { setStatusFilter(value); setPage(1); }}
            onClear={() => { setStatusFilter(""); setCourseFilter(""); setPage(1); }}
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : feePlans.length === 0 ? (
        <EmptyState
          title="No fee plans found"
          description={search || statusFilter ? "Try adjusting your search or filters" : "Create your first fee plan to get started"}
          action={!search && !statusFilter && canManage ? { label: "Create Fee Plan", onClick: openCreate } : undefined}
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={feePlans}
            loading={false}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFeePlan ? "Edit Fee Plan" : "Create Fee Plan"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={saving}>
              {editingFeePlan ? "Save Changes" : "Save Fee Plan"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Plan Name"
              required
              error={errors.planName?.message}
              {...register("planName")}
              placeholder="e.g. Standard Plan"
            />
            <SearchableSelect
              label="Course"
              required
              placeholder="Search course..."
              options={courseOptions}
              value={editingFeePlan ? editingFeePlan.courseId : undefined}
              onChange={(v) => register("courseId").onChange({ target: { value: v } })}
              error={errors.courseId?.message}
              emptyMessage="No courses available"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Validity"
              required
              error={errors.validity?.message}
              {...register("validity")}
              placeholder="e.g. 6 months"
            />
            <Input
              label="Admission Fee"
              type="number"
              required
              error={errors.admissionFee?.message}
              {...register("admissionFee")}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Tuition Fee"
              type="number"
              required
              error={errors.tuitionFee?.message}
              {...register("tuitionFee")}
            />
            <Input
              label="Installments"
              type="number"
              required
              error={errors.installments?.message}
              {...register("installments")}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Discount %"
              type="number"
              required
              error={errors.discount?.message}
              {...register("discount")}
            />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={actionConfirm.open}
        onClose={closeActionConfirm}
        onConfirm={confirmAction}
        title={actionLabel?.title ?? ""}
        description={
          actionConfirm.feePlan
            ? `${actionLabel?.desc ?? ""} (${actionConfirm.feePlan.planName})`
            : ""
        }
        intent={actionLabel?.intent ?? "info"}
        confirmLabel={confirmActionType ? confirmActionType.charAt(0).toUpperCase() + confirmActionType.slice(1) : "Confirm"}
        loading={actionSaving}
      />
    </PageContainer>
  );
}
