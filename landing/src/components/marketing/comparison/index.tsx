import { Check, X } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const rows = [
  { label: "Approach", us: "All-in-one platform", them: "Disconnected tools" },
  { label: "Setup Time", us: "Under 30 minutes", them: "Weeks of integration" },
  { label: "Booking System", us: "Built-in, real-time", them: "Manual or spreadsheets" },
  { label: "Payment Processing", us: "Native integrations", them: "Third-party hassle" },
  { label: "Support", us: "Long-term partnership", them: "One-and-done" },
  { label: "Analytics", us: "Live dashboards", them: "Manual reports" },
  { label: "Multi-location", us: "Included", them: "Extra cost or not supported" },
];

export function ComparisonSection() {
  return (
    <section className="bg-black py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Why Us"
          title="Kalai Arangam VS Traditional Providers"
        />

        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="py-4 px-6 text-left text-zinc-500 font-medium w-1/3">Feature</th>
                <th className="py-4 px-6 text-left text-brand font-semibold w-1/3">Kalai Arangam</th>
                <th className="py-4 px-6 text-left text-zinc-600 font-medium w-1/3">Traditional</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-white/[0.01]" : ""}
                >
                  <td className="py-4 px-6 text-zinc-400 font-medium">{row.label}</td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-2 text-white">
                      <Check size={14} className="text-brand shrink-0" />
                      {row.us}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-2 text-zinc-600">
                      <X size={14} className="text-red-600 shrink-0" />
                      {row.them}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
