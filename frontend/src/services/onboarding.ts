import { apiClient } from "./api-client";
import type { ApiResponse } from "./types";

export interface OnboardingProgress {
  progress: {
    id: string;
    userId: string;
    selectedRole: string | null;
    currentStep: string;
    isCompleted: boolean;
    completedAt: string | null;
  };
  user: {
    status: string;
    role: string;
    email: string;
    name: string;
  };
  isFirstLogin: boolean;
}

export interface SelectRoleRequest {
  role: string;
}

export interface ProfileSetupRequest {
  fullName: string;
  mobileNumber: string;
  profilePhoto?: string;
  address?: string;
  timeZone?: string;
  preferredLanguage?: string;
  dateOfBirth?: string;
  gender?: string;
  parentContact?: string;
  companyName?: string;
}

export interface TenantSetupRequest {
  businessName: string;
  businessType: string;
  registrationNumber?: string;
  gstNumber?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  address?: string;
}

export interface BranchSetupRequest {
  branchName: string;
  address?: string;
  contactNumber?: string;
}

export interface ModuleSelectionRequest {
  training: boolean;
  rental: boolean;
  event: boolean;
}

export interface SubscriptionSelectionRequest {
  plan: string;
}

export interface SearchTenantRequest {
  name?: string;
  businessType?: string;
  location?: string;
}

export interface SearchTenantResult {
  id: string;
  name: string;
  slug: string;
  industry: string;
  status: string;
  logoUrl: string | null;
  branches: { id: string; name: string; city: string | null; state: string | null }[];
}

export interface RequestAccessPayload {
  tenantId: string;
  preferredBranchId?: string;
  notes?: string;
  skills?: string[];
  specialization?: string;
  courseId?: string;
}

export interface AccessRequest {
  id: string;
  tenantId: string;
  branchId: string | null;
  userId: string;
  role: string;
  status: string;
  notes: string | null;
  preferredBranchId: string | null;
  skills: string[];
  specialization: string | null;
  courseId: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; phone: string | null; role: string };
  tenant: { id: string; name: string };
  branch: { id: string; name: string } | null;
  reviewer: { id: string; name: string; email: string } | null;
}

export interface ApproveAccessRequest {
  requestId: string;
  branchId?: string;
  role?: string;
}

export interface RejectAccessRequest {
  requestId: string;
  reason?: string;
}

export async function getOnboardingProgress(): Promise<ApiResponse<OnboardingProgress>> {
  const response = await apiClient.get<ApiResponse<OnboardingProgress>>("/onboarding/progress");
  return response.data;
}

export async function selectRole(data: SelectRoleRequest): Promise<ApiResponse<{ role: string; nextStep: string }>> {
  const response = await apiClient.post<ApiResponse<{ role: string; nextStep: string }>>("/onboarding/role", data);
  return response.data;
}

export async function setupProfile(data: ProfileSetupRequest): Promise<ApiResponse<{ nextStep: string; completed?: boolean; redirectTo?: string }>> {
  const response = await apiClient.post<ApiResponse<{ nextStep: string; completed?: boolean; redirectTo?: string }>>("/onboarding/profile", data);
  return response.data;
}

export async function setupTenant(data: TenantSetupRequest): Promise<ApiResponse<{ tenant: { id: string; name: string; slug: string }; nextStep: string }>> {
  const response = await apiClient.post<ApiResponse<{ tenant: { id: string; name: string; slug: string }; nextStep: string }>>("/onboarding/tenant", data);
  return response.data;
}

export async function setupBranch(data: BranchSetupRequest): Promise<ApiResponse<{ branch: { id: string; name: string; isDefault: boolean }; nextStep: string }>> {
  const response = await apiClient.post<ApiResponse<{ branch: { id: string; name: string; isDefault: boolean }; nextStep: string }>>("/onboarding/branch", data);
  return response.data;
}

export async function selectModules(data: ModuleSelectionRequest): Promise<ApiResponse<{ nextStep: string }>> {
  const response = await apiClient.post<ApiResponse<{ nextStep: string }>>("/onboarding/modules", data);
  return response.data;
}

export async function selectSubscription(data: SubscriptionSelectionRequest): Promise<ApiResponse<{ token: { accessToken: string; user: Record<string, unknown> }; redirectTo: string }>> {
  const response = await apiClient.post<ApiResponse<{ token: { accessToken: string; user: Record<string, unknown> }; redirectTo: string }>>("/onboarding/subscription", data);
  return response.data;
}

export async function completeClientOnboarding(): Promise<ApiResponse<{ redirectTo: string }>> {
  const response = await apiClient.post<ApiResponse<{ redirectTo: string }>>("/onboarding/complete-client");
  return response.data;
}

export async function searchTenants(data: SearchTenantRequest): Promise<ApiResponse<SearchTenantResult[]>> {
  const response = await apiClient.post<ApiResponse<SearchTenantResult[]>>("/onboarding/tenants/search", data);
  return response.data;
}

export async function requestAccess(data: RequestAccessPayload): Promise<ApiResponse<{ status: string; tokens?: { accessToken: string; refreshToken: string; user: Record<string, unknown> } }>> {
  const response = await apiClient.post<ApiResponse<{ status: string; tokens?: { accessToken: string; refreshToken: string; user: Record<string, unknown> } }>>("/onboarding/request-access", data);
  return response.data;
}

export async function listAccessRequests(status?: string): Promise<ApiResponse<AccessRequest[]>> {
  const params = status ? { status } : {};
  const response = await apiClient.get<ApiResponse<AccessRequest[]>>("/onboarding/access-requests", { params });
  return response.data;
}

export async function approveAccessRequest(data: ApproveAccessRequest): Promise<ApiResponse<{ status: string }>> {
  const response = await apiClient.post<ApiResponse<{ status: string }>>("/onboarding/access-requests/approve", data);
  return response.data;
}

export async function rejectAccessRequest(data: RejectAccessRequest): Promise<ApiResponse<{ status: string }>> {
  const response = await apiClient.post<ApiResponse<{ status: string }>>("/onboarding/access-requests/reject", data);
  return response.data;
}
