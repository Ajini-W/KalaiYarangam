"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Camera, Moon, Sun, Bell, BellOff, Lock, KeyRound } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { authService } from "@/services/auth.service";
import { notificationService } from "@/services/notification.service";
import type { UserProfileData, UpdateProfilePayload } from "@/services/auth.service";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<UserProfileData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [theme, setTheme] = React.useState("system");
  const [notifEnabled, setNotifEnabled] = React.useState(true);
  const [pushEnabled, setPushEnabled] = React.useState(false);
  const [passwordSaving, setPasswordSaving] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

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
        form.reset({
          name: data.name,
          phone: data.phone ?? "",
          dateOfBirth: data.profile?.dateOfBirth ?? "",
          gender: data.profile?.gender ?? "",
          addressLine1: data.profile?.addressLine1 ?? "",
          addressLine2: data.profile?.addressLine2 ?? "",
          city: data.profile?.city ?? "",
          state: data.profile?.state ?? "",
          pincode: data.profile?.pincode ?? "",
          emergencyName: data.profile?.emergencyName ?? "",
          emergencyPhone: data.profile?.emergencyPhone ?? "",
          bio: data.profile?.bio ?? "",
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const handleSubmit = async (values: ProfileForm) => {
    setSaving(true);
    try {
      const payload: UpdateProfilePayload = {};
      if (values.name !== profile?.name) payload.name = values.name;
      if (values.phone !== (profile?.phone ?? "")) payload.phone = values.phone || undefined;
      if (values.dateOfBirth !== (profile?.profile?.dateOfBirth ?? "")) payload.dateOfBirth = values.dateOfBirth || undefined;
      if (values.gender !== (profile?.profile?.gender ?? "")) payload.gender = values.gender || undefined;
      if (values.addressLine1 !== (profile?.profile?.addressLine1 ?? "")) payload.addressLine1 = values.addressLine1 || undefined;
      if (values.addressLine2 !== (profile?.profile?.addressLine2 ?? "")) payload.addressLine2 = values.addressLine2 || undefined;
      if (values.city !== (profile?.profile?.city ?? "")) payload.city = values.city || undefined;
      if (values.state !== (profile?.profile?.state ?? "")) payload.state = values.state || undefined;
      if (values.pincode !== (profile?.profile?.pincode ?? "")) payload.pincode = values.pincode || undefined;
      if (values.emergencyName !== (profile?.profile?.emergencyName ?? "")) payload.emergencyName = values.emergencyName || undefined;
      if (values.emergencyPhone !== (profile?.profile?.emergencyPhone ?? "")) payload.emergencyPhone = values.emergencyPhone || undefined;
      if (values.bio !== (profile?.profile?.bio ?? "")) payload.bio = values.bio || undefined;

      const updated = await authService.updateProfile(payload);
      setProfile(updated);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!newPassword) {
      toast.error("New password is required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setPasswordSaving(true);
    try {
      if (profile?.hasPassword) {
        if (!currentPassword) {
          toast.error("Current password is required");
          setPasswordSaving(false);
          return;
        }
        await authService.changePassword({ currentPassword, newPassword });
      } else {
        await authService.setPassword({ newPassword });
      }
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setProfile((prev) => prev ? { ...prev, hasPassword: true } : prev);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  };

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

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your personal information and preferences.</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Avatar & Role Card */}
        <Card>
          <CardBody>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </div>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-surface-raised text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Upload photo"
                >
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <p className="text-lg font-semibold text-text-primary">{profile?.name}</p>
                <p className="text-sm text-text-secondary">{profile?.email}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant="info">{profile?.role}</Badge>
                  <Badge variant={profile?.status === "ACTIVE" ? "success" : "warning"}>{profile?.status}</Badge>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full Name" required error={form.formState.errors.name?.message} {...form.register("name")} />
              <Input label="Email" value={profile?.email ?? ""} disabled />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="Phone" type="tel" {...form.register("phone")} />
              <Input label="Date of Birth" type="date" {...form.register("dateOfBirth")} />
              <Select
                label="Gender"
                options={[
                  { value: "", label: "Select" },
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" },
                ]}
                {...form.register("gender")}
              />
            </div>
          </CardBody>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader><CardTitle>Address</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Input label="Address Line 1" {...form.register("addressLine1")} />
            <Input label="Address Line 2" {...form.register("addressLine2")} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="City" {...form.register("city")} />
              <Input label="State" {...form.register("state")} />
              <Input label="Pincode" {...form.register("pincode")} />
            </div>
          </CardBody>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader><CardTitle>Emergency Contact</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Contact Name" {...form.register("emergencyName")} />
              <Input label="Contact Phone" type="tel" {...form.register("emergencyPhone")} />
            </div>
          </CardBody>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader><CardTitle>Bio</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Textarea label="About" rows={4} {...form.register("bio")} />
          </CardBody>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
          <CardBody className="space-y-4 pt-0">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">Theme</label>
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
            </div>
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

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={18} />
              {profile?.hasPassword ? "Change Password" : "Set Password"}
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4 pt-0">
            <p className="text-sm text-text-secondary">
              {profile?.hasPassword
                ? "Enter your current password and a new one to update."
                : "You signed up via Google. Set a password to also log in with email."}
            </p>
            {profile?.hasPassword && (
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            )}
            <Input
              label="New Password"
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                loading={passwordSaving}
                onClick={handlePasswordSave}
              >
                <KeyRound size={16} className="mr-2" />
                {profile?.hasPassword ? "Change Password" : "Set Password"}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Button type="button" variant="ghost" onClick={() => form.reset()}>Reset</Button>
          <Button type="submit" loading={saving}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
