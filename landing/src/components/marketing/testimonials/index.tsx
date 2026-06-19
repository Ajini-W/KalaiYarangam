import { SectionHeader } from "@/components/shared/section-header";

const testimonials = [
  {
    quote: "Since adding this platform, our booking load is automated. Students can book batches online and we get paid instantly.",
    name: "Ravi Kumar",
    role: "Founder, RK Fitness Academy",
    initials: "RK",
  },
  {
    quote: "We were managing rentals through WhatsApp. Kalai Arangam gave us a proper system. Our utilization rate jumped 40%.",
    name: "Priya Nair",
    role: "Owner, Nair Rentals",
    initials: "PN",
  },
  {
    quote: "Event ticketing used to be a nightmare. Now attendees book online and we track everything in one dashboard.",
    name: "Arjun Singh",
    role: "Event Director, Spark Events",
    initials: "AS",
  },
  {
    quote: "The multi-location support is exactly what we needed for our 3 training centers. Best investment we made.",
    name: "Deepa Menon",
    role: "CEO, Skill Bridge Academy",
    initials: "DM",
  },
  {
    quote: "Quick onboarding, clean UI, and the payment integrations work flawlessly. Highly recommended.",
    name: "Karthik Raj",
    role: "MD, Rajlakshmi Rentals",
    initials: "KR",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-black py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Testimonials"
          title="See insights straight from our users"
        />

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid rounded-xl border border-white/[0.06] bg-zinc-950 p-6"
            >
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
