"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Lock, KeyRound, Shield, History, Eye, EyeOff, Smartphone, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import type { UserProfileData } from "@/services/auth.service";

export default function ProfileSecurityPage() {
  const [profile, setProfile] = React.useState<UserProfileData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [passwordSaving, setPasswordSaving] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              leftAddon={<Lock size={16} />}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="text-gray-400 hover:text-primary transition-colors"
                  tabIndex={-1}
                >
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
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="text-gray-400 hover:text-primary transition-colors"
                tabIndex={-1}
              >
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
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-gray-400 hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              loading={passwordSaving}
              onClick={handlePasswordSave}
            >
              <KeyRound size={16} className="mr-2" />
              {profile?.hasPassword ? "Change Password" : "Set Password"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Security Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-raised px-4 py-3">
            <div className="flex items-center gap-3">
              <History size={18} className="text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Last Login</p>
                <p className="text-xs text-text-secondary">
                  {profile?.lastLoginAt
                    ? new Date(profile.lastLoginAt).toLocaleString()
                    : "First login"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface-raised px-4 py-3">
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Account Created</p>
                <p className="text-xs text-text-secondary">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
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
        </CardBody>
      </Card>
    </div>
  );
}
