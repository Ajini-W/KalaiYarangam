"use client";

import { Toaster } from "sonner";

/**
 * Drop <ToastProvider /> inside your root layout (inside <body>).
 * Use toast() from "sonner" anywhere in the app.
 *
 * Usage:
 *   import { toast } from "sonner"
 *   toast.success("Saved!")
 *   toast.error("Something went wrong")
 *   toast.promise(promise, { loading: "Saving…", success: "Done!", error: "Failed" })
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-[var(--radius-md)] shadow-[var(--shadow-2)] text-sm font-medium",
        },
      }}
    />
  );
}
