"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, Calendar, Target, UserCheck, Archive, Edit3, MessageSquare, Clock, User, Building2, BookOpen, Activity } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Button, Card, CardHeader, CardBody, Badge, Modal, Input, Textarea, Select, Skeleton } from "@/components/ui";
import { getLead, updateLead, archiveLead, convertLead, createFollowup, getFollowups, type Lead, type LeadFollowup } from "@/services/leads";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

const statusConfig: Record<string, { label: string; variant: "info" | "brand" | "warning" | "success" | "danger" | "outline"; color: string }> = {
  NEW: { label: "New", variant: "info", color: "bg-info" },
  CONTACTED: { label: "Contacted", variant: "brand", color: "bg-primary" },
  FOLLOWUP: { label: "Follow Up", variant: "warning", color: "bg-warning" },
  INTERESTED: { label: "Interested", variant: "success", color: "bg-success" },
  DEMO_SCHEDULED: { label: "Demo Scheduled", variant: "info", color: "bg-info" },
  CONVERTED: { label: "Converted", variant: "success", color: "bg-success" },
  LOST: { label: "Lost", variant: "danger", color: "bg-danger" },
};

interface LeadDetailPageProps {
  leadId: string;
}

export function LeadDetailPage({ leadId }: LeadDetailPageProps) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [followups, setFollowups] = useState<LeadFollowup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"timeline" | "info" | "notes">("timeline");

  /* Followup form */
  const [followupModal, setFollowupModal] = useState(false);
  const [followupNotes, setFollowupNotes] = useState("");
  const [followupOutcome, setFollowupOutcome] = useState("");
  const [followupContactedVia, setFollowupContactedVia] = useState("");
  const [followupNextDate, setFollowupNextDate] = useState("");
  const [followupSubmitting, setFollowupSubmitting] = useState(false);

  /* Status change */
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  /* Archive */
  const [archiveConfirm, setArchiveConfirm] = useState(false);

  /* Convert */
  const [convertModal, setConvertModal] = useState(false);
  const [conversionData, setConversionData] = useState({ studentName: "", studentPhone: "", studentEmail: "", batchId: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [leadRes, followupsRes] = await Promise.all([
        getLead(leadId),
        getFollowups(leadId),
      ]);
      setLead(leadRes.data);
      setFollowups(followupsRes.data ?? []);
    } catch {
      toast.error("Failed to load lead");
      router.push("/leads");
    } finally {
      setLoading(false);
    }
  }, [leadId, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async () => {
    if (!lead || !newStatus) return;
    try {
      await updateLead(lead.id, { status: newStatus as any });
      toast.success("Status updated");
      setStatusModal(false);
      fetchData();
    } catch { toast.error("Failed to update status"); }
  };

  const handleArchive = async () => {
    if (!lead) return;
    try {
      await archiveLead(lead.id);
      toast.success("Lead archived");
      router.push("/leads");
    } catch { toast.error("Failed to archive lead"); }
  };

  const handleAddFollowup = async () => {
    if (!followupNotes.trim()) { toast.error("Notes are required"); return; }
    setFollowupSubmitting(true);
    try {
      await createFollowup(leadId, {
        notes: followupNotes,
        outcome: followupOutcome || undefined,
        contactedVia: followupContactedVia || undefined,
        nextDate: followupNextDate || undefined,
      });
      toast.success("Followup added");
      setFollowupModal(false);
      setFollowupNotes("");
      setFollowupOutcome("");
      setFollowupContactedVia("");
      setFollowupNextDate("");
      fetchData();
    } catch { toast.error("Failed to add followup"); }
    finally { setFollowupSubmitting(false); }
  };

  const handleConvert = async () => {
    if (!conversionData.studentName.trim()) { toast.error("Student name is required"); return; }
    try {
      await convertLead(leadId, conversionData);
      toast.success("Lead converted to student successfully");
      setConvertModal(false);
      fetchData();
    } catch { toast.error("Failed to convert lead"); }
  };

  if (loading) {
    return (
      <PageContainer back={() => router.push("/leads")}>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-4 w-72 rounded-[var(--radius-sm)]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2"><Skeleton className="h-[300px] rounded-[var(--radius-md)]" /></div>
            <Skeleton className="h-[300px] rounded-[var(--radius-md)]" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!lead) return null;

  const cfg = statusConfig[lead.status] || { label: lead.status, variant: "outline" as const, color: "bg-text-disabled" };

  return (
    <PageContainer back={() => router.push("/leads")}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl font-bold text-primary">{lead.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-primary">{lead.name}</h1>
              <Badge size="sm" variant={cfg.variant}>{cfg.label}</Badge>
            </div>
            <p className="text-sm text-text-secondary mt-1">{lead.phone}{lead.email ? ` · ${lead.email}` : ""}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {lead.status !== "CONVERTED" && lead.status !== "LOST" && (
            <Button size="sm" onClick={() => { setConversionData({ studentName: lead.name, studentPhone: lead.phone, studentEmail: lead.email ?? "", batchId: "" }); setConvertModal(true); }}>
              <UserCheck size={16} /> Convert
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => router.push(`/leads/${lead.id}/edit`)}>
            <Edit3 size={16} /> Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setNewStatus(lead.status); setStatusModal(true); }}>
            <Target size={16} /> Change Status
          </Button>
          {lead.status !== "LOST" && (
            <Button size="sm" variant="outline" className="text-danger" onClick={() => setArchiveConfirm(true)}>
              <Archive size={16} /> Archive
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-border">
            {[
              { key: "timeline", label: "Timeline", icon: Activity },
              { key: "info", label: "Information", icon: User },
              { key: "notes", label: "Notes", icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary",
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "timeline" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-primary">Follow-up Timeline</h3>
                <Button size="xs" onClick={() => setFollowupModal(true)}>
                  <MessageSquare size={14} /> Add Followup
                </Button>
              </div>

              {followups.length === 0 ? (
                <Card>
                  <CardBody>
                    <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                      <Activity size={28} className="mb-2 text-text-disabled" />
                      <p className="text-sm font-medium">No follow-ups yet</p>
                      <p className="text-xs mt-1">Add the first follow-up to this lead</p>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <div className="relative">
                  <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-border" />
                  <div className="space-y-4">
                    {followups.map((f, idx) => (
                      <div key={f.id} className="relative pl-10">
                        <div className={cn(
                          "absolute left-[10px] h-[15px] w-[15px] rounded-full border-2 border-surface",
                          idx === 0 ? "bg-primary" : "bg-border"
                        )} />
                        <Card>
                          <CardBody className="py-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-text-primary">{f.notes}</p>
                                {f.outcome && (
                                  <p className="text-xs text-text-secondary mt-1">
                                    Outcome: <span className="font-medium">{f.outcome}</span>
                                  </p>
                                )}
                                {f.contactedVia && (
                                  <Badge size="sm" variant="outline" className="mt-2">{f.contactedVia}</Badge>
                                )}
                              </div>
                              <span className="text-[10px] text-text-disabled shrink-0">
                                {new Date(f.createdAt).toLocaleDateString()} {new Date(f.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            {f.nextDate && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-warning">
                                <Clock size={12} />
                                Next: {new Date(f.nextDate).toLocaleDateString()}
                              </div>
                            )}
                            {f.user && (
                              <p className="text-[10px] text-text-disabled mt-1">by {f.user.name}</p>
                            )}
                          </CardBody>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "info" && (
            <Card>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Phone", value: lead.phone, icon: Phone },
                    { label: "Email", value: lead.email || "-", icon: Mail },
                    { label: "Course Interest", value: lead.course || "-", icon: BookOpen },
                    { label: "Lead Source", value: lead.source.replace(/_/g, " "), icon: Target },
                    { label: "Branch", value: lead.branch?.name || "-", icon: Building2 },
                    { label: "Assigned To", value: lead.assignedTo || "Unassigned", icon: User },
                    { label: "Created", value: new Date(lead.createdAt).toLocaleDateString(), icon: Calendar },
                    { label: "Last Updated", value: new Date(lead.updatedAt).toLocaleDateString(), icon: Calendar },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] bg-surface-raised">
                      <item.icon size={16} className="text-text-secondary shrink-0" />
                      <div>
                        <p className="text-xs text-text-secondary">{item.label}</p>
                        <p className="text-sm font-medium text-text-primary">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === "notes" && (
            <Card>
              <CardBody>
                {lead.notes ? (
                  <p className="text-sm text-text-primary whitespace-pre-wrap">{lead.notes}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                    <MessageSquare size={28} className="mb-2 text-text-disabled" />
                    <p className="text-sm font-medium">No notes</p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><h3 className="text-sm font-semibold">Lead Status</h3></CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-2">
                {Object.entries(statusConfig).map(([key, c]) => (
                  <div key={key} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", c.color)} />
                      <span className={cn("text-xs", lead.status === key ? "font-semibold text-text-primary" : "text-text-secondary")}>{c.label}</span>
                    </div>
                    {lead.status === key && <Badge size="sm" variant="brand">Current</Badge>}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {lead.nextFollowUp && (
            <Card>
              <CardHeader><h3 className="flex items-center gap-2 text-sm font-semibold"><Clock size={14} className="text-warning" /> Next Follow-up</h3></CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm font-medium">{new Date(lead.nextFollowUp).toLocaleDateString()}</p>
                <p className="text-xs text-text-secondary">{new Date(lead.nextFollowUp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader><h3 className="text-sm font-semibold">Quick Actions</h3></CardHeader>
            <CardBody className="pt-0 space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => setFollowupModal(true)}>
                <Phone size={14} /> Log Follow-up
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => router.push(`/leads/${lead.id}/edit`)}>
                <Edit3 size={14} /> Edit Lead
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Followup Modal */}
      <Modal open={followupModal} onClose={() => setFollowupModal(false)} title="Add Follow-up" size="md">
        <div className="space-y-4">
          <Select label="Contacted Via" value={followupContactedVia} onChange={(e) => setFollowupContactedVia(e.target.value)} options={[
            { value: "", label: "Select..." },
            { value: "CALL", label: "Call" },
            { value: "WHATSAPP", label: "WhatsApp" },
            { value: "SMS", label: "SMS" },
            { value: "EMAIL", label: "Email" },
            { value: "MEETING", label: "Meeting" },
            { value: "DEMO_CLASS", label: "Demo Class" },
            { value: "VISIT", label: "Visit" },
          ]} />
          <Textarea label="Notes *" value={followupNotes} onChange={(e) => setFollowupNotes(e.target.value)} placeholder="Follow-up notes..." rows={3} />
          <Input label="Outcome" value={followupOutcome} onChange={(e) => setFollowupOutcome(e.target.value)} placeholder="What was the outcome?" />
          <Input label="Next Follow-up Date" type="datetime-local" value={followupNextDate} onChange={(e) => setFollowupNextDate(e.target.value)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setFollowupModal(false)}>Cancel</Button>
            <Button onClick={handleAddFollowup} loading={followupSubmitting}>Save Follow-up</Button>
          </div>
        </div>
      </Modal>

      {/* Status Change Modal */}
      <Modal open={statusModal} onClose={() => setStatusModal(false)} title="Change Status" size="sm">
        <div className="space-y-4">
          <Select label="New Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} options={[
            { value: "NEW", label: "New" },
            { value: "CONTACTED", label: "Contacted" },
            { value: "FOLLOWUP", label: "Follow Up" },
            { value: "INTERESTED", label: "Interested" },
            { value: "DEMO_SCHEDULED", label: "Demo Scheduled" },
            { value: "CONVERTED", label: "Converted" },
            { value: "LOST", label: "Lost" },
          ]} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setStatusModal(false)}>Cancel</Button>
            <Button onClick={handleStatusChange}>Update Status</Button>
          </div>
        </div>
      </Modal>

      {/* Archive Confirmation */}
      <Modal open={archiveConfirm} onClose={() => setArchiveConfirm(false)} title="Archive Lead" size="sm"
        footer={<div className="flex gap-3"><Button variant="outline" size="sm" onClick={() => setArchiveConfirm(false)}>Cancel</Button><Button size="sm" onClick={handleArchive}>Archive</Button></div>}
      >
        <p className="text-sm text-text-secondary">Are you sure you want to archive &ldquo;{lead.name}&rdquo;?</p>
      </Modal>

      {/* Conversion Modal */}
      <Modal open={convertModal} onClose={() => setConvertModal(false)} title="Convert Lead to Student" size="md">
        <div className="space-y-4">
          <Input label="Student Name *" value={conversionData.studentName} onChange={(e) => setConversionData((p) => ({ ...p, studentName: e.target.value }))} placeholder="Student name" />
          <Input label="Student Phone" value={conversionData.studentPhone} onChange={(e) => setConversionData((p) => ({ ...p, studentPhone: e.target.value }))} placeholder="Phone" />
          <Input label="Student Email" value={conversionData.studentEmail} onChange={(e) => setConversionData((p) => ({ ...p, studentEmail: e.target.value }))} placeholder="Email" type="email" />
          <Input label="Batch ID (optional)" value={conversionData.batchId} onChange={(e) => setConversionData((p) => ({ ...p, batchId: e.target.value }))} placeholder="Assign to batch" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setConvertModal(false)}>Cancel</Button>
            <Button onClick={handleConvert}><UserCheck size={16} /> Convert to Student</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
