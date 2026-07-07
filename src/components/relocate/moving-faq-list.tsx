"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOVING_FAQS } from "@/lib/moving/constants";
import { MotionSection } from "@/components/motion/motion-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground transition-colors hover:bg-muted/50"
        aria-expanded={open}
      >
        {question}
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-green-600 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}

interface MovingFaqListProps {
  limit?: number;
  showHeader?: boolean;
  wrapSection?: boolean;
}

export function MovingFaqList({
  limit,
  showHeader = true,
  wrapSection = true,
}: MovingFaqListProps) {
  const faqs = limit ? MOVING_FAQS.slice(0, limit) : MOVING_FAQS;

  const content = (
    <>
      {showHeader && (
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about booking and preparing for your move."
          centered
          className="mb-12"
        />
      )}
      <Stagger className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq) => (
          <StaggerItem key={faq.question}>
            <FaqItem question={faq.question} answer={faq.answer} />
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );

  if (!wrapSection) return content;

  return (
    <MotionSection className="bg-background" animate={!showHeader}>
      {content}
    </MotionSection>
  );
}
