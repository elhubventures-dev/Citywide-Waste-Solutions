import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/motion/page-hero";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: { index: false },
};

export default function PaySuccessPage({ searchParams }: { searchParams: { invoice?: string } }) {
  const description = searchParams.invoice
    ? `Invoice #${searchParams.invoice} has been paid successfully. A receipt has been sent to your email.`
    : "Your payment was processed successfully. A receipt has been sent to your email.";

  return (
    <>
      <PageHero centered eyebrow="Payments" title="Payment Confirmed!" description={description} />

      <section className="section min-h-[40vh]">
        <div className="container -mt-4 pb-16">
          <div className="mx-auto max-w-md space-y-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <p className="text-sm text-muted-foreground">
              Thank you for choosing Citywide Waste Solutions!
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="primary" size="lg">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
