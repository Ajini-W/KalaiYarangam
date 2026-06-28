"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { searchTenants, type SearchTenantResult } from "@/services/onboarding";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
} as const;

export default function TenantSearchPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [businessType, setBusinessType] = React.useState("");
  const [results, setResults] = React.useState<SearchTenantResult[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  React.useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (name?: string, btype?: string) => {
    setSearching(true);
    setSearched(true);
    try {
      const res = await searchTenants({
        name: name || undefined,
        businessType: btype || undefined,
      });
      setResults(res.data);
    } catch {
      toast.error("Failed to search tenants");
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = (tenantId: string) => {
    router.push(`/onboarding/request-access?tenantId=${tenantId}`);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={cardVariants} className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Find Your Organization</h1>
        <p className="mt-1 text-sm text-text-secondary">Search for your academy, institute, or business to request access.</p>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="mb-6">
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input placeholder="Search by name..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch(query, businessType)} />
              <Select
                value={businessType}
                onChange={(e) => { setBusinessType(e.target.value); handleSearch(query, e.target.value); }}
                options={[
                  { value: "", label: "All Types" },
                  { value: "TRAINING", label: "Training Institute" },
                  { value: "RENTAL", label: "Rental Business" },
                  { value: "EVENT", label: "Event Management" },
                ]}
              />
              <Button onClick={() => handleSearch(query, businessType)} loading={searching}>Search</Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {searched && results.length === 0 && !searching && (
        <motion.div variants={cardVariants}>
          <Card>
            <CardBody className="py-12 text-center">
              <p className="text-text-secondary">No organizations found. Try a different search.</p>
            </CardBody>
          </Card>
        </motion.div>
      )}

      <motion.div variants={cardVariants} className="space-y-3">
        {results.map((tenant) => (
          <motion.button
            key={tenant.id}
            type="button"
            onClick={() => handleSelect(tenant.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full rounded-[var(--radius-md)] border border-border-default bg-surface p-4 text-left transition-colors hover:border-primary/50 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-primary">{tenant.name}</h3>
                  {tenant.status === "TRIAL" && (
                    <Badge variant="warning" className="shrink-0">
                      Trial
                    </Badge>
                  )}
                </div>
                <Badge variant="info" className="mt-1">{tenant.industry}</Badge>
              </div>
              {tenant.logoUrl && (
                <img src={tenant.logoUrl} alt="" className="h-10 w-10 rounded-[var(--radius-sm)] object-cover" />
              )}
            </div>
            {tenant.branches.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tenant.branches.map((b) => (
                  <span key={b.id} className="rounded-full bg-surface-raised px-2.5 py-0.5 text-xs text-text-secondary">
                    {b.name}{b.city ? `, ${b.city}` : ""}
                  </span>
                ))}
              </div>
            )}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
