
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus:outline-none active:outline-none relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "gradient-primary text-white shadow-elegant hover:shadow-luxury hover:scale-105 active:scale-95",
        destructive: "bg-red-600 text-white shadow-elegant hover:bg-red-700 hover:shadow-luxury hover:scale-105",
        outline: "border-2 border-gray-200 bg-white hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 shadow-sm hover:shadow-elegant",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-elegant hover:scale-105",
        ghost: "hover:bg-gray-100 hover:text-gray-900 hover:scale-105",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
        accent: "gradient-accent text-white shadow-elegant hover:shadow-luxury hover:scale-105 active:scale-95",
        success: "gradient-success text-white shadow-elegant hover:shadow-luxury hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-2xl px-8 text-base font-bold",
        xl: "h-16 rounded-2xl px-10 text-lg font-bold",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
