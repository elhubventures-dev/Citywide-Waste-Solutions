import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { scaleIn } from "@/lib/motion-presets";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < rating ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4 text-gray-200"}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Quote className="mb-4 h-6 w-6 text-green-200" />
      <StarRating rating={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
        &ldquo;{testimonial.text}&rdquo;
      </blockquote>
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700 dark:bg-green-950/40">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{testimonial.name}</div>
          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="section bg-background" aria-labelledby="testimonials-heading">
      <div className="container">
        <Reveal className="mb-14">
          <SectionHeader
            eyebrow="Testimonials"
            title="What Our Clients Say About Us"
            subtitle="Professional, timely, and trusted — hear from homeowners, contractors, and businesses across Ontario."
            centered
            id="testimonials-heading"
          />
        </Reveal>
        <Reveal variants={scaleIn} className="mb-10 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-card">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">4.9/5</span>
            <span className="text-sm text-muted-foreground">from 200+ reviews</span>
          </div>
        </Reveal>
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.id}>
              <TestimonialCard testimonial={t} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
