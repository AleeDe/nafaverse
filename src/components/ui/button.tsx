import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'gradient' | 'glow' | 'outline' | 'soft';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50 disabled:pointer-events-none';

    const gradientClasses = 'bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] hover:from-[#A78BFA]/90 hover:to-[#60A5FA]/90 text-white shadow-md';
    
    const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      ghost: 'hover:bg-white/10 text-white',
      gradient: gradientClasses,
      glow: gradientClasses,
      outline: 'border border-white/20 text-white hover:bg-white/10',
      soft: 'bg-white/10 text-white hover:bg-white/20'
    };

    const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
      default: 'h-10 px-4',
      sm: 'h-9 px-3',
      lg: 'h-12 px-6 text-lg'
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';