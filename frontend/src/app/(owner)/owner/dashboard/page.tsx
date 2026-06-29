"use client";

import Link from "next/link";
import { Users, Building2, BarChart3, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DashboardView } from "@/components/dashboard";

export default function OwnerDashboard() {
  return (
    <DashboardView
      roleLabel="Owner · Here's your business overview."
      quickActions={
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardBody className="pt-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { label: "Students", icon: <Users size={18} />, href: "/owner/students" },
                { label: "Branches", icon: <Building2 size={18} />, href: "/owner/branches" },
                { label: "Reports", icon: <BarChart3 size={18} />, href: "/owner/reports" },
                { label: "Settings", icon: <Settings size={18} />, href: "/owner/settings" },
              ].map((a) => (
                <Link key={a.label} href={a.href}>
                  <Button variant="outline" className="h-auto w-full justify-start gap-2.5 px-3 py-3">
                    <span className="shrink-0">{a.icon}</span>
                    {a.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      }
    />
  );
}
