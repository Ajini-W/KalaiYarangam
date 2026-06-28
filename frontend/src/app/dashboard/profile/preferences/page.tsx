"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Moon, Sun, Bell, BellOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { authService } from "@/services/auth.service";
import type { UserProfileData } from "@/services/auth.service";

export default function ProfilePreferencesPage() {
  const [profile, setProfile] = React.useState<UserProfileData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [theme, setTheme] = React.useState("system");
  const [notifEnabled, setNotifEnabled] = React.useState(true);
  const [pushEnabled, setPushEnabled] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
        const prefs = data.preferences as Record<string, unknown> | null;
        if (prefs) {
          setTheme((prefs.theme as string) || "system");
          setNotifEnabled(prefs.notificationsEnabled !== false);
          setPushEnabled(prefs.pushNotifications === true);
        }
      } catch {
        toast.error("Failed to load preferences");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    try {
      await authService.updatePreferences({ theme: newTheme, notificationsEnabled: notifEnabled, pushNotifications: pushEnabled });
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    } catch {
      toast.error("Failed to save theme preference");
    }
  };

  const handleNotifToggle = async (enabled: boolean) => {
    setNotifEnabled(enabled);
    try {
      await authService.updatePreferences({ theme, notificationsEnabled: enabled, pushNotifications: pushEnabled });
    } catch {
      toast.error("Failed to save notification preference");
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    setPushEnabled(enabled);
    try {
      await authService.updatePreferences({ theme, notificationsEnabled: notifEnabled, pushNotifications: enabled });
      if (enabled && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          toast.success("Push notifications enabled");
        } else {
          setPushEnabled(false);
          toast.error("Permission denied. Enable from browser settings.");
        }
      }
    } catch {
      toast.error("Failed to save push preference");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme */}
      <Card>
        <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="flex gap-2">
            {[
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Sun },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleThemeChange(value)}
                className={`flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors ${
                  theme === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-raised text-text-secondary hover:bg-surface-overlay"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-raised px-4 py-3">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">In-App Notifications</p>
                <p className="text-xs text-text-secondary">Receive notifications within the app</p>
              </div>
            </div>
            <Switch checked={notifEnabled} onCheckedChange={handleNotifToggle} />
          </div>
          <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-raised px-4 py-3">
            <div className="flex items-center gap-3">
              <BellOff size={18} className="text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Push Notifications</p>
                <p className="text-xs text-text-secondary">Receive push notifications on your device</p>
              </div>
            </div>
            <Switch checked={pushEnabled} onCheckedChange={handlePushToggle} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
