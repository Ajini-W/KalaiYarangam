import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

const faqs = [
  {
    q: "Can I use only one module?",
    a: "Absolutely. Start with just Training, Rental, or Event management and pay only for what you use. You can add more modules anytime as your business grows.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes - every plan starts with a 20-day free trial that includes full access to all modules. No credit card is required to get started.",
  },
  {
    q: "Can I manage multiple branches?",
    a: "Yes. Multi-branch operations are built in. Manage locations, staff, and inventory across branches while owners get a consolidated view of the entire business.",
  },
  {
    q: "Do you support mobile devices?",
    a: "kalaiArangam is mobile-first. Your team can manage attendance, bookings, payments, and tasks from any phone, tablet, or desktop.",
  },
  {
    q: "Is my data secure?",
    a: "Your data is protected with role-based access control, audit logs, encryption, and true multi-tenant isolation so each business stays completely separate.",
  },
];

export function Faq() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything you need to know before getting started."
        />

        <Reveal className="mt-12">
          <Accordion type="single" className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="mb-3 rounded-2xl border border-border bg-card px-5 transition-all data-[state=open]:border-primary/30 data-[state=open]:shadow-md data-[state=open]:shadow-primary/5"
              >
                <AccordionTrigger className="text-left font-heading text-base font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
