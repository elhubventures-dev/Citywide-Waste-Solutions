"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-all duration-250 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-green-500 text-white hover:bg-green-600 shadow-green hover:shadow-green/40",
        secondary: "bg-blue-500 text-white hover:bg-blue-600 shadow-blue hover:shadow-blue/40",
        outline:
          "border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10",
        "outline-invert":
          "border-2 border-green-500 bg-white text-green-600 hover:bg-green-500 hover:text-white",
        "outline-white": "border-2 border-white/80 text-white hover:bg-white/10",
        ghost: "text-foreground hover:bg-muted hover:text-foreground",
        earth: "bg-earth-500 text-white hover:bg-earth-600",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-green-600 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8  px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
