import axios from "axios";
import { ENABLE_DEV_MOCKS } from "@/config/mock.config";

export interface MockFallbackResult<T> {
  data: T;
  usingMock: boolean;
}

export function isRecoverableApiError(err: unknown): boolean {
  if (axios.isAxiosError(err)) {
    if (!err.response) return true;
    const status = err.response.status;
    return status === 404 || status >= 500;
  }
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes("network error") ||
      msg.includes("failed to fetch") ||
      msg.includes("econnrefused") ||
      msg.includes("timeout")
    );
  }
  return false;
}

export async function withMockFallback<T>(
  apiCall: () => Promise<T>,
  getMockData: () => T,
): Promise<MockFallbackResult<T>> {
  if (ENABLE_DEV_MOCKS) {
    return { data: getMockData(), usingMock: true };
  }

  try {
    const data = await apiCall();
    return { data, usingMock: false };
  } catch (err) {
    if (isRecoverableApiError(err)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Dev Mock] API unavailable — using mock data");
      }
      return { data: getMockData(), usingMock: true };
    }
    throw err;
  }
}
