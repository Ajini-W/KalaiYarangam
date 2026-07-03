"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ErrorState, EmptyState } from "@/components/ui/EmptyState";
import { useProgressList } from "@/hooks/useProgress";
import { ProgressCard } from "./ProgressCard";
import { ProgressBar } from "./ProgressBar";
import { LevelBeltIndicator } from "./LevelBeltIndicator";
import { SkillChecklist, modulesToSkills } from "./SkillChecklist";

interface StudentProgressViewProps {
  title?: string;
  subtitle?: string;
  studentId?: string;
}

export function StudentProgressView({
  title = "My Progress",
  subtitle = "See how you're doing in your classes.",
  studentId,
}: StudentProgressViewProps) {
  const { records, loading, error, refetch } = useProgressList({
    page: 1,
    pageSize: 50,
    studentId,
  });

  const latest = records[0];
  const skills = modulesToSkills(records);

  if (error && !loading) {
    return (
      <PageContainer title={title} subtitle={subtitle}>
        <ErrorState
          code={500}
          title="Unable to load your progress"
          description={error}
          action={{ label: "Retry", onClick: refetch }}
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer title={title} subtitle={subtitle}>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </PageContainer>
    );
  }

  if (records.length === 0) {
    return (
      <PageContainer title={title} subtitle={subtitle}>
        <EmptyState
          variant="no-data"
          title="No progress yet"
          description="Your teacher will update your progress after classes and activities."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title={title} subtitle={subtitle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <Card variant="elevated" className="lg:col-span-1">
          <CardHeader><CardTitle>Your level</CardTitle></CardHeader>
          <CardBody className="flex flex-col items-center gap-4 pt-0">
            <LevelBeltIndicator
              grade={latest?.grade}
              percentage={latest?.percentage}
              size="lg"
            />
            <ProgressBar
              value={latest?.percentage ?? 0}
              label="Overall progress"
              size="md"
            />
            {latest?.batch?.name && (
              <p className="text-sm text-text-secondary">{latest.batch.name}</p>
            )}
          </CardBody>
        </Card>

        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader><CardTitle>What you&apos;ve learned</CardTitle></CardHeader>
          <CardBody className="space-y-6 pt-0">
            <SkillChecklist items={skills} title="Skills" />
            <div className="space-y-3">
              {records.map((record) => (
                <ProgressCard key={record.id} record={record} simple />
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </PageContainer>
  );
}
