import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-bold text-white", className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-black text-sm font-black">
        K
      </span>
      <span className="text-lg tracking-tight">Kalai Arangam</span>
    </Link>
  );
}
