import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";

const industries = [
  {
    emoji: "🏋️",
    name: "Training Centers",
    description: "Manage batch schedules, student enrollments, attendance tracking, and fee collection for gyms, coaching centers, and skill academies.",
    href: "/industries/training",
    tags: ["Batch Management", "Attendance", "Fee Collection"],
  },
  {
    emoji: "🚗",
    name: "Rental Businesses",
    description: "Handle equipment, vehicle, or space rentals with real-time availability, deposit management, and damage reporting.",
    href: "/industries/rental",
    tags: ["Fleet Tracking", "Deposits", "Availability Calendar"],
  },
  {
    emoji: "🎉",
    name: "Event Organizers",
    description: "Sell tickets, manage venue capacity, coordinate staff, and send automated event reminders to attendees.",
    href: "/industries/events",
    tags: ["Ticketing", "Venue Management", "Reminders"],
  },
];

export function IndustriesSection() {
  return (
    <section id="industries" className="bg-black py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Industries"
          title="Built for your business type"
          description="Kalai Arangam is purpose-built for three high-growth verticals."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {industries.map((ind) => (
            <Link
              key={ind.name}
              href={ind.href}
              className="group flex flex-col rounded-xl border border-white/[0.06] bg-zinc-950 p-6 hover:border-brand/30 transition-all duration-300"
            >
              <div className="mb-4 text-4xl">{ind.emoji}</div>
              <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-brand transition-colors">
                {ind.name}
              </h3>
              <p className="mb-4 text-sm text-zinc-500 leading-relaxed flex-1">
                {ind.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {ind.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 text-xs text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
