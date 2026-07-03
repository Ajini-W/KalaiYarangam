/**
 * Single control point for development mock data.
 *
 * ENABLE_DEV_MOCKS = true  → Always use mock data (skip API calls)
 * ENABLE_DEV_MOCKS = false → Use real APIs; fall back to mocks on network/5xx/404 errors
 */
export const ENABLE_DEV_MOCKS = true;
