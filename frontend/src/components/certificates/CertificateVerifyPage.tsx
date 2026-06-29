"use client";

import * as React from "react";
import { Search, ShieldCheck, ShieldX } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCertificateVerification } from "@/hooks/useCertificates";

export function CertificateVerifyPage() {
  const [query, setQuery] = React.useState("");
  const [submitted, setSubmitted] = React.useState<string | null>(null);
  const { result, loading, error, verify } = useCertificateVerification(submitted);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSubmitted(trimmed);
    await verify(trimmed);
  };

  return (
    <div className="min-h-screen bg-surface px-4 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">Verify Certificate</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter a certificate number to confirm its authenticity.
          </p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                label="Certificate number"
                placeholder="CERT-20260101-ABC123"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" loading={loading} leftIcon={<Search size={16} />}>
                Verify
              </Button>
            </form>
          </CardBody>
        </Card>

        {loading && submitted && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!loading && submitted && result && (
          <Card className={result.valid ? "border-success/50" : "border-danger/50"}>
            <CardBody className="flex flex-col items-center gap-3 py-8 text-center">
              {result.valid ? (
                <>
                  <ShieldCheck size={48} className="text-success" aria-hidden />
                  <p className="text-lg font-semibold text-text-primary">Valid Certificate</p>
                  <dl className="w-full space-y-2 text-sm">
                    <div>
                      <dt className="text-text-secondary">Student</dt>
                      <dd className="font-medium text-text-primary">{result.studentName}</dd>
                    </div>
                    <div>
                      <dt className="text-text-secondary">Course</dt>
                      <dd className="font-medium text-text-primary">{result.courseName}</dd>
                    </div>
                    <div>
                      <dt className="text-text-secondary">Issued</dt>
                      <dd className="font-medium text-text-primary">
                        {result.issuedDate
                          ? new Date(result.issuedDate).toLocaleDateString()
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-text-secondary">Certificate No</dt>
                      <dd className="font-mono text-text-primary">{result.certNumber}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <>
                  <ShieldX size={48} className="text-danger" aria-hidden />
                  <p className="text-lg font-semibold text-text-primary">Invalid Certificate</p>
                  <p className="text-sm text-text-secondary">{result.message ?? "This certificate could not be verified."}</p>
                </>
              )}
            </CardBody>
          </Card>
        )}

        {error && !loading && (
          <p role="alert" className="text-center text-sm text-danger">{error}</p>
        )}
      </div>
    </div>
  );
}
