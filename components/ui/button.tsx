import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("rounded-xl bg-primary px-4 py-2 text-white", className)} {...props} />
));
Button.displayName = "Button";
