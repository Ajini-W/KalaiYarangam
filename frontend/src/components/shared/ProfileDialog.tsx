"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  IdCard, Lock, Settings, User, Mail, Phone, MapPin, Award,
  Loader2, KeyRound, Shield, History, Smartphone, Globe,
  Eye, EyeOff, Moon, Sun, Bell, BellOff, Camera, Check, X,
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

/* ─── Validation Schemas ─────────────────────────────────────────────────── */

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: z.string().optional().refine(
    (val) => !val || /^\+?[\d\s\-()]{7,15}$/.test(val),
    "Enter a valid phone number"
  ),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  addressLine1: z.string().max(200, "Address is too long").optional(),
  addressLine2: z.string().max(200, "Address is too long").optional(),
  city: z.string().max(100, "City name is too long").optional(),
  state: z.string().max(100, "State name is too long").optional(),
  pincode: z.string().optional().refine(
    (val) => !val || /^\d{4,10}$/.test(val),
    "Enter a valid pincode"
  ),
  emergencyName: z.string().max(100, "Name is too long").optional(),
  emergencyPhone: z.string().optional().refine(
    (val) => !val || /^\+?[\d\s\-()]{7,15}$/.test(val),
    "Enter a valid phone number"
  ),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

/* ─── Constants ──────────────────────────────────────────────────────────── */

const TABS = [
  { key: "info" as const, label: "Profile", icon: User },
  { key: "security" as const, label: "Security", icon: Lock },
  { key: "preferences" as const, label: "Settings", icon: Settings },
];

const GENDER_OPTIONS = [
  { value: "", label: "Select" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

/* ─── Password Strength ──────────────────────────────────────────────────── */

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Lowercase", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.met).length;

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < score
                ? score <= 1
                  ? "bg-danger"
                  : score <= 2
                    ? "bg-warning"
                    : "bg-success"
                : "bg-border"
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {checks.map((c) => (
          <span
            key={c.label}
            className={cn(
              "flex items-center gap-1 text-xs",
              c.met ? "text-success" : "text-text-secondary"
            )}
          >
            {c.met ? <Check size={10} /> : <X size={10} />}
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Profile Dialog ─────────────────────────────────────────────────────── */

export function ProfileDialog() {
  const { open, tab, setOpen, setTab } = useProfileModal();
  const [profile, setProfile] = React.useState<UserProfileData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [passwordSaving, setPasswordSaving] = React.useState(false);
  const [passwordErrors, setPasswordErrors] = React.useState<Record<string, string>>({});

  const [theme, setTheme] = React.useState("system");
  const [notifEnabled, setNotifEnabled] = React.useState(true);
  const [pushEnabled, setPushEnabled] = React.useState(false);

  const close = () => setOpen(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
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
    if (open) {
      load();
      setPasswordErrors({});
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
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
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setPasswordErrors({});
    const result = passwordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        errors[key] = issue.message;
      });
      setPasswordErrors(errors);
      return;
    }
    setPasswordSaving(true);
    try {
      if (profile?.hasPassword) {
        if (!currentPassword) {
          setPasswordErrors({ currentPassword: "Current password is required" });
          setPasswordSaving(false);
          return;
        }
        await authService.changePassword({ currentPassword, newPassword });
      } else {
        await authService.setPassword({ newPassword });
      }
      toast.success("Password updated successfully");
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
    try { await authService.updatePreferences({ theme, notificationsEnabled: enabled, pushNotifications: pushEnabled }); } catch { toast.error("Failed to save preference"); }
  };

  const handlePushToggle = async (enabled: boolean) => {
    setPushEnabled(enabled);
    try {
      await authService.updatePreferences({ theme, notificationsEnabled: notifEnabled, pushNotifications: enabled });
      if (enabled && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") { setPushEnabled(false); toast.error("Permission denied"); }
      }
    } catch { toast.error("Failed to save preference"); }
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <Modal open={open} onClose={close} size="xl" className="max-h-[90vh] sm:max-h-[85vh]">
      {/* Mobile-first Tab Bar */}
      <div className="flex border-b border-border -mx-6 px-2 sm:px-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors min-w-0",
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            <t.icon size={14} className="shrink-0" />
            <span className="truncate">{t.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(85vh-120px)] -mx-6 px-4 sm:px-6">
          {/* Tab: Profile Info */}
          {tab === "info" && (
            <form onSubmit={form.handleSubmit(handleProfileSubmit)} className="space-y-5 py-4">
              {/* Avatar Section */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="relative shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary text-xl font-bold ring-2 ring-primary/20 ring-offset-2 ring-offset-surface">
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
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text-primary truncate">{profile?.name}</p>
                  <p className="text-sm text-text-secondary truncate">{profile?.email}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge variant="info" size="sm">{profile?.role}</Badge>
                    <Badge variant={profile?.status === "ACTIVE" ? "success" : "warning"} size="sm">{profile?.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <section>
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <User size={14} className="text-primary" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    required
                    error={form.formState.errors.name?.message}
                    placeholder="Enter your full name"
                    {...form.register("name")}
                  />
                  <Input
                    label="Email"
                    value={profile?.email ?? ""}
                    disabled
                    leftAddon={<Mail size={14} />}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-3">
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    error={form.formState.errors.phone?.message}
                    leftAddon={<Phone size={14} />}
                    {...form.register("phone")}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    {...form.register("dateOfBirth")}
                  />
                  <Select
                    label="Gender"
                    options={GENDER_OPTIONS}
                    {...form.register("gender")}
                  />
                </div>
              </section>

              {/* Address */}
              <section>
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-primary" /> Address
                </h3>
                <div className="space-y-3">
                  <Input
                    label="Address Line 1"
                    placeholder="Street address"
                    error={form.formState.errors.addressLine1?.message}
                    {...form.register("addressLine1")}
                  />
                  <Input
                    label="Address Line 2"
                    placeholder="Apartment, suite, etc. (optional)"
                    {...form.register("addressLine2")}
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Input label="City" placeholder="City" {...form.register("city")} />
                    <Input label="State" placeholder="State" {...form.register("state")} />
                    <Input
                      label="Pincode"
                      placeholder="000000"
                      error={form.formState.errors.pincode?.message}
                      {...form.register("pincode")}
                    />
                  </div>
                </div>
              </section>

              {/* Emergency Contact */}
              <section>
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Award size={14} className="text-primary" /> Emergency Contact
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    label="Contact Name"
                    placeholder="Emergency contact name"
                    {...form.register("emergencyName")}
                  />
                  <Input
                    label="Contact Phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    error={form.formState.errors.emergencyPhone?.message}
                    leftAddon={<Phone size={14} />}
                    {...form.register("emergencyPhone")}
                  />
                </div>
              </section>

              {/* Bio */}
              <section>
                <h3 className="text-sm font-semibold text-text-primary mb-3">About</h3>
                <Textarea
                  label="Bio"
                  rows={3}
                  placeholder="Tell us about yourself (optional)"
                  error={form.formState.errors.bio?.message}
                  {...form.register("bio")}
                />
                <p className="text-xs text-text-secondary mt-1">
                  {form.watch("bio")?.length ?? 0}/500 characters
                </p>
              </section>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4 pb-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => form.reset()}>
                  Reset
                </Button>
                <Button type="submit" loading={saving} size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* Tab: Password & Security */}
          {tab === "security" && (
            <div className="space-y-5 py-4">
              {/* Password Section */}
              <section>
                <h3 className="text-sm font-semibold text-text-primary mb-1 flex items-center gap-2">
                  <Lock size={14} className="text-primary" /> {profile?.hasPassword ? "Change Password" : "Set Password"}
                </h3>
                <p className="text-xs text-text-secondary mb-4">
                  {profile?.hasPassword
                    ? "Enter your current password and choose a new one."
                    : "You signed up via Google. Set a password to also log in with email."}
                </p>
                <div className="space-y-3">
                  {profile?.hasPassword && (
                    <div>
                      <Input
                        label="Current Password"
                        type={showCurrent ? "text" : "password"}
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        error={passwordErrors.currentPassword}
                        leftAddon={<Lock size={14} />}
                        rightAddon={
                          <button type="button" onClick={() => setShowCurrent((v) => !v)} className="text-text-secondary hover:text-primary transition-colors" tabIndex={-1}>
                            {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        }
                      />
                    </div>
                  )}
                  <div>
                    <Input
                      label="New Password"
                      type={showNew ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      error={passwordErrors.newPassword}
                      leftAddon={<Lock size={14} />}
                      rightAddon={
                        <button type="button" onClick={() => setShowNew((v) => !v)} className="text-text-secondary hover:text-primary transition-colors" tabIndex={-1}>
                          {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      }
                    />
                    <div className="mt-2">
                      <PasswordStrength password={newPassword} />
                    </div>
                  </div>
                  <div>
                    <Input
                      label="Confirm New Password"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={passwordErrors.confirmPassword}
                      leftAddon={<Lock size={14} />}
                      rightAddon={
                        <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-text-secondary hover:text-primary transition-colors" tabIndex={-1}>
                          {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      }
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <Button type="button" size="sm" loading={passwordSaving} onClick={handlePasswordSave}>
                      <KeyRound size={14} className="mr-1.5" />
                      {profile?.hasPassword ? "Update Password" : "Set Password"}
                    </Button>
                  </div>
                </div>
              </section>

              {/* Security Info */}
              <section className="border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Shield size={14} className="text-primary" /> Account Security
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: History, label: "Last Login", value: profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : "First login" },
                    { icon: Smartphone, label: "Account Created", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A" },
                    { icon: Globe, label: "Email Status", value: profile?.emailVerified ? "Verified" : "Not verified" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3 border border-border/50">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-text-secondary" />
                        <p className="text-sm font-medium text-text-primary">{label}</p>
                      </div>
                      <p className="text-xs text-text-secondary">{value}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Tab: Preferences */}
          {tab === "preferences" && (
            <div className="space-y-5 py-4">
              {/* Theme */}
              <section>
                <h3 className="text-sm font-semibold text-text-primary mb-3">Appearance</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Settings },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleThemeChange(value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 text-xs font-medium transition-all border",
                        theme === value
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted/30 text-text-secondary border-border hover:border-primary/50 hover:text-text-primary",
                      )}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Notifications */}
              <section className="border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Notifications</h3>
                <div className="space-y-2">
                  {[
                    { icon: Bell, label: "In-App Notifications", desc: "Receive notifications within the app", checked: notifEnabled, onToggle: handleNotifToggle },
                    { icon: BellOff, label: "Push Notifications", desc: "Receive push notifications on your device", checked: pushEnabled, onToggle: handlePushToggle },
                  ].map(({ icon: Icon, label, desc, checked, onToggle }) => (
                    <div key={label} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3 border border-border/50">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-text-secondary" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{label}</p>
                          <p className="text-xs text-text-secondary">{desc}</p>
                        </div>
                      </div>
                      <Switch checked={checked} onCheckedChange={onToggle} />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
