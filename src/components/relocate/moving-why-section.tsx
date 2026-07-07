"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { MOVING_WHY_CHOOSE, MOVING_CARE_ITEMS, MOVING_PROCESS } from "@/lib/moving/constants";
import { MOVING_IMAGES } from "@/lib/moving/images";
import { SectionHeader } from "@/components/ui/section-header";
import { MotionSection } from "@/components/motion/motion-section";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export function MovingWhySection() {
  return (
    <MotionSection className="bg-section-gradient">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeader
            eyebrow="Why Choose Citywide"
            title="We Move With Care"
            subtitle="Your belongings deserve professional handling. Our trained team delivers reliable service on every move."
          />
          <Stagger className="mt-8 space-y-4">
            {MOVING_WHY_CHOOSE.map(({ title, description }) => (
              <StaggerItem key={title}>
                <div className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={MOVING_IMAGES.crew}
              alt="Citywide professional movers loading a truck"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 max-w-xs rounded-2xl border border-border bg-white p-5 shadow-xl dark:bg-gray-900 sm:-right-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-green-600">
              We Move With Care!
            </p>
            <ul className="space-y-2">
              {MOVING_CARE_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

export function MovingProcessSection() {
  return (
    <MotionSection className="bg-blue-500 text-white">
      <SectionHeader
        eyebrow="How It Works"
        title="Your Move in Four Simple Steps"
        subtitle="From first call to final box — we make moving straightforward and stress-free."
        centered
        light
        className="mb-12"
      />
      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MOVING_PROCESS.map(({ step, title, description }) => (
          <StaggerItem key={step}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <span className="text-3xl font-extrabold text-green-300">{step}</span>
              <h3 className="mt-3 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{description}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </MotionSection>
  );
}
