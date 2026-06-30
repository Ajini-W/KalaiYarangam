"use client";

import * as React from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { notificationService } from "@/services/notification.service";

export default function SuperAdminNotificationsPage() {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [link, setLink] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [pushEnabled, setPushEnabled] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    setSending(true);
    setResult(null);
    try {
      const res = await notificationService.sendNotification(title, body, link || undefined);
      toast.success("Notification sent to all users!");
    } catch {
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <PageContainer title="Send Notification" subtitle="Send an in-app notification to all users">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Compose Notification</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Input label="Title" placeholder="e.g. System Maintenance" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea label="Body" placeholder="Write your message..." rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
            <Input label="Link (optional)" placeholder="/staff/dashboard" value={link} onChange={(e) => setLink(e.target.value)} />
            <div className="flex items-center gap-6 pt-2">
              <Button onClick={handleSend} loading={sending}>
                <Send size={16} className="mr-1.5" />
                Send to All Users
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Test Push</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <p className="text-sm text-text-secondary">
              Send a test push notification to verify FCM setup.
            </p>
            <Button variant="outline" className="w-full" onClick={async () => {
              try {
                await notificationService.sendNotification("Test Notification", "This is a test push notification from super admin.");
                toast.success("Test notification sent!");
              } catch {
                toast.error("Failed to send test notification");
              }
            }}>
              Send Test Notification
            </Button>
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
