import { ButtonHTMLAttributes, forwardRef } from "react";

// Actually I can just use clsx/tailwind-merge without cva for simplicity to avoid installing another package, or just manual logic. 
// Let's stick to manual class logic for now to keep it lightweight.

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'tech';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'default',
    size = 'md',
    isLoading,
    children,
    ...props
}, ref) => {

    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-circuit-green disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variants = {
        default: "bg-circuit-green text-circuit-bg hover:bg-circuit-green/90 shadow-sm",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "border border-circuit-border bg-transparent hover:bg-circuit-card hover:text-circuit-text shadow-sm",
        secondary: "bg-circuit-green/10 text-circuit-green hover:bg-circuit-green/20 border border-transparent hover:border-circuit-green/20 transition-all",
        ghost: "hover:bg-circuit-card hover:text-circuit-text",
        link: "text-circuit-green underline-offset-4 hover:underline",
        tech: "bg-circuit-card border border-circuit-green/50 text-circuit-green hover:bg-circuit-green hover:text-circuit-bg shadow-[0_0_10px_rgba(0,255,157,0.1)] hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all duration-300"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10"
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
