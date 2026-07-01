"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  IdCard, Lock, Settings, User, Mail, Phone, MapPin, Award,
  Loader2, KeyRound, Shield, History, Smartphone, Globe,
  Eye, EyeOff, Moon, Sun, Bell, BellOff,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { ImageCropper } from "@/components/ui/ImageCropper";
import { authService, type UserProfileData, type UpdateProfilePayload } from "@/services/auth.service";
import { useProfileModal } from "@/store/profile.store";

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

const TABS = [
  { key: "info" as const, label: "Profile Info", icon: User },
  { key: "security" as const, label: "Password & Security", icon: Lock },
  { key: "preferences" as const, label: "Preferences", icon: Settings },
];

export function ProfileDialog() {
  const { open, tab, setOpen, setTab } = useProfileModal();
  const [profile, setProfile] = React.useState<UserProfileData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [passwordSaving, setPasswordSaving] = React.useState(false);

  // Preferences state
  const [theme, setTheme] = React.useState("system");
  const [notifEnabled, setNotifEnabled] = React.useState(true);
  const [pushEnabled, setPushEnabled] = React.useState(false);

  const close = () => setOpen(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await authService.getProfile();
      setProfile(data);
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
      const prefs = data.preferences as Record<string, unknown> | null;
      if (prefs) {
        setTheme((prefs.theme as string) || "system");
        setNotifEnabled(prefs.notificationsEnabled !== false);
        setPushEnabled(prefs.pushNotifications === true);
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [form]);

  React.useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleProfileSubmit = async (values: ProfileForm) => {
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
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!newPassword) { toast.error("New password is required"); return; }
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setPasswordSaving(true);
    try {
      if (profile?.hasPassword) {
        if (!currentPassword) { toast.error("Current password is required"); setPasswordSaving(false); return; }
        await authService.changePassword({ currentPassword, newPassword });
      } else {
        await authService.setPassword({ newPassword });
      }
      toast.success("Password updated");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
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
    } catch { toast.error("Failed to save theme"); }
  };

  const handleNotifToggle = async (enabled: boolean) => {
    setNotifEnabled(enabled);
    try { await authService.updatePreferences({ theme, notificationsEnabled: enabled, pushNotifications: pushEnabled }); } catch { toast.error("Failed to save notification preference"); }
  };

  const handlePushToggle = async (enabled: boolean) => {
    setPushEnabled(enabled);
    try {
      await authService.updatePreferences({ theme, notificationsEnabled: notifEnabled, pushNotifications: enabled });
      if (enabled && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") { setPushEnabled(false); toast.error("Permission denied"); }
      }
    } catch { toast.error("Failed to save push preference"); }
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <Modal open={open} onClose={close} size="xl" title="My Profile">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Tab: Profile Info */}
          {tab === "info" && (
            <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary text-xl font-bold">
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : initials}
                  </div>
                  <ImageCropper
                    currentAvatar={profile?.avatarUrl ?? null}
                    onSave={async (base64) => {
                      try {
                        const updated = await authService.updateProfile({ avatarUrl: base64 });
                        setProfile(updated);
                        toast.success("Photo updated");
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Failed to update photo");
                      }
                    }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{profile?.name}</p>
                  <p className="text-sm text-text-secondary">{profile?.email}</p>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="info">{profile?.role}</Badge>
                    <Badge variant={profile?.status === "ACTIVE" ? "success" : "warning"}>{profile?.status}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><User size={14} /> Personal Information</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input label="Full Name" required error={form.formState.errors.name?.message} {...form.register("name")} />
                  <Input label="Email" value={profile?.email ?? ""} disabled leftAddon={<Mail size={16} />} />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-3">
                  <Input label="Phone" type="tel" leftAddon={<Phone size={16} />} {...form.register("phone")} />
                  <Input label="Date of Birth" type="date" {...form.register("dateOfBirth")} />
                  <Select label="Gender" options={[{ value: "", label: "Select" }, { value: "MALE", label: "Male" }, { value: "FEMALE", label: "Female" }, { value: "OTHER", label: "Other" }]} {...form.register("gender")} />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><MapPin size={14} /> Address</p>
                <Input label="Address Line 1" {...form.register("addressLine1")} />
                <Input label="Address Line 2" className="mt-3" {...form.register("addressLine2")} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-3">
                  <Input label="City" {...form.register("city")} />
                  <Input label="State" {...form.register("state")} />
                  <Input label="Pincode" {...form.register("pincode")} />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><Award size={14} /> Emergency Contact</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input label="Contact Name" {...form.register("emergencyName")} />
                  <Input label="Contact Phone" type="tel" {...form.register("emergencyPhone")} />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-primary mb-3">About</p>
                <Textarea label="Bio" rows={3} {...form.register("bio")} />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="ghost" onClick={() => form.reset()}>Reset</Button>
                <Button type="submit" loading={saving}>Save Changes</Button>
              </div>
            </form>
          )}

          {/* Tab: Password & Security */}
          {tab === "security" && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2"><Lock size={14} /> {profile?.hasPassword ? "Change Password" : "Set Password"}</p>
                <p className="text-xs text-text-secondary mb-3">
                  {profile?.hasPassword ? "Enter your current password and a new one to update." : "You signed up via Google. Set a password to also log in with email."}
                </p>
                <div className="space-y-3">
                  {profile?.hasPassword && (
                    <Input
                      label="Current Password"
                      type={showCurrent ? "text" : "password"}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      leftAddon={<Lock size={16} />}
                      rightAddon={
                        <button type="button" onClick={() => setShowCurrent((v) => !v)} className="text-gray-400 hover:text-primary transition-colors" tabIndex={-1}>
                          {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                    />
                  )}
                  <Input
                    label="New Password"
                    type={showNew ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    leftAddon={<Lock size={16} />}
                    rightAddon={
                      <button type="button" onClick={() => setShowNew((v) => !v)} className="text-gray-400 hover:text-primary transition-colors" tabIndex={-1}>
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                  <Input
                    label="Confirm New Password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    leftAddon={<Lock size={16} />}
                    rightAddon={
                      <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-gray-400 hover:text-primary transition-colors" tabIndex={-1}>
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                  <div className="flex justify-end pt-1">
                    <Button type="button" loading={passwordSaving} onClick={handlePasswordSave}>
                      <KeyRound size={16} className="mr-2" />
                      {profile?.hasPassword ? "Change Password" : "Set Password"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><Shield size={14} /> Account Security</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-raised px-4 py-3">
                    <div className="flex items-center gap-3">
                      <History size={18} className="text-text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">Last Login</p>
                        <p className="text-xs text-text-secondary">{profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : "First login"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-raised px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Smartphone size={18} className="text-text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">Account Created</p>
                        <p className="text-xs text-text-secondary">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-raised px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">Email Status</p>
                        <p className="text-xs text-text-secondary">Email verification status from auth</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Preferences */}
          {tab === "preferences" && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-text-primary mb-3">Theme</p>
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
                        theme === value ? "bg-primary text-primary-foreground" : "bg-surface-raised text-text-secondary hover:bg-surface-overlay"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-text-primary mb-3">Notifications</p>
                <div className="space-y-2">
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
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
