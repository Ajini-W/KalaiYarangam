"use client";

import * as React from "react";
import { toast } from "sonner";
import { certificatesService } from "@/services/certificates.service";
import type {
  Certificate,
  CertificateListParams,
  CertificateTemplate,
  CertificateVerificationResult,
  CreateCertificatePayload,
  GenerateBulkCertificatePayload,
} from "@/types/certificates";

export function useCertificateList(initialParams: CertificateListParams = {}) {
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);
  const [meta, setMeta] = React.useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [params, setParams] = React.useState(initialParams);

  const fetch = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await certificatesService.list(params);
      setCertificates(result.data);
      setMeta(result.meta);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load certificates";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { certificates, meta, loading, error, params, setParams, refetch: fetch };
}

export function useCertificate(id: string | null) {
  const [certificate, setCertificate] = React.useState<Certificate | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetch = React.useCallback(async () => {
    if (!id) {
      setCertificate(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await certificatesService.getById(id);
      setCertificate(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load certificate";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return { certificate, loading, error, refetch: fetch };
}

export function useCertificateTemplates() {
  const [templates, setTemplates] = React.useState<CertificateTemplate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    certificatesService
      .listTemplates()
      .then(setTemplates)
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to load templates";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { templates, loading, error };
}

export function useCertificateVerification(certificateNo: string | null) {
  const [result, setResult] = React.useState<CertificateVerificationResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const verify = React.useCallback(async (no: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await certificatesService.verify(no);
      setResult(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (certificateNo) {
      verify(certificateNo);
    }
  }, [certificateNo, verify]);

  return { result, loading, error, verify };
}

export function useCertificateMutations() {
  const [saving, setSaving] = React.useState(false);

  const create = async (payload: CreateCertificatePayload) => {
    setSaving(true);
    try {
      const result = await certificatesService.create(payload);
      toast.success("Certificate generated");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate certificate";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const generateBulk = async (payload: GenerateBulkCertificatePayload) => {
    setSaving(true);
    try {
      const result = await certificatesService.generateBulk(payload);
      toast.success(`${result.length} certificates generated`);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate certificates";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const reissue = async (id: string) => {
    setSaving(true);
    try {
      const result = await certificatesService.reissue(id);
      toast.success("Certificate reissued");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reissue certificate";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const revoke = async (id: string, reason?: string) => {
    setSaving(true);
    try {
      const result = await certificatesService.revoke(id, reason);
      toast.success("Certificate revoked");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to revoke certificate";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { saving, create, generateBulk, reissue, revoke };
}
