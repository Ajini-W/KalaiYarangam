import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/Card";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Download, TrendingUp, Users, Package, CalendarCheck } from "lucide-react";

const summaryStats = [
  { title: "Total Revenue (Jun)",  value: "₹2,41,500", delta: "+18% vs May", deltaType: "increase" as const, icon: <TrendingUp size={20}/> },
  { title: "Training Revenue",     value: "₹1,12,000", delta: "46% of total",  deltaType: "neutral"  as const, icon: <Users size={20}/> },
  { title: "Rental Revenue",       value: "₹84,500",   delta: "35% of total",  deltaType: "neutral"  as const, icon: <Package size={20}/> },
  { title: "Events Revenue",       value: "₹45,000",   delta: "19% of total",  deltaType: "neutral"  as const, icon: <CalendarCheck size={20}/> },
];

const breakdown = [
  { module: "Training", item: "Bharatanatyam Batches", amount: "₹48,000",  count: 18, status: "active"   as const },
  { module: "Training", item: "Karate Batches",        amount: "₹36,000",  count: 20, status: "active"   as const },
  { module: "Rental",   item: "Sound Systems",         amount: "₹35,000",  count: 14, status: "active"   as const },
  { module: "Rental",   item: "LED Walls",             amount: "₹30,000",  count: 6,  status: "active"   as const },
  { module: "Events",   item: "Wedding Events",        amount: "₹45,000",  count: 3,  status: "active"   as const },
];

export default function RevenueReportsPage() {
  return (
    <PageContainer
      title="Revenue Reports"
      subtitle="June 2026 — financial overview"
      actions={
        <Button variant="outline" size="sm" leftIcon={<Download size={15}/>}>Export</Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <span className="text-sm text-text-secondary">Jun 1–14, 2026</span>
        </CardHeader>
        <CardBody className="pt-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-raised">
                {["Module","Item","Transactions","Revenue"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row, i) => (
                <tr key={i} className="border-b border-border-subtle last:border-0 hover:bg-surface-raised transition-colors">
                  <td className="px-4 py-3"><Badge variant={row.module === "Training" ? "brand" : row.module === "Rental" ? "info" : "warning"}>{row.module}</Badge></td>
                  <td className="px-4 py-3 font-medium text-text-primary">{row.item}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.count}</td>
                  <td className="px-4 py-3 font-semibold text-text-primary">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
