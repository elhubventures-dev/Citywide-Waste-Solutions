import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: { index: false },
};

export default function PaySuccessPage({
  searchParams,
}: {
  searchParams: { invoice?: string };
}) {
  return (
    <section className="section min-h-[70vh] flex items-center">
      <div className="container">
        <div className="mx-auto max-w-md text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground">Payment Confirmed!</h1>
            {searchParams.invoice && (
              <p className="mt-2 text-muted-foreground">
                Invoice <strong>#{searchParams.invoice}</strong> has been paid successfully.
              </p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              A receipt has been sent to your email address. Thank you for choosing
              Citywide Waste Solutions!
            </p>
          </div>

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
  );
}
