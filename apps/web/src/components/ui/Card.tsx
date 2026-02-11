import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'elevated' | 'gradient';
  accentColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', accentColor = 'primary', className, children, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-xl border border-gray-100';
    
    const variants = {
      default: 'shadow-md',
      accent: 'shadow-md border-l-4',
      elevated: 'shadow-lg',
      gradient: 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white border-0 shadow-lg',
    };

    const accentColors = {
      primary: 'border-primary-500',
      secondary: 'border-secondary-500',
      success: 'border-success',
      warning: 'border-warning',
      error: 'border-error',
      info: 'border-blue-500',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          variant === 'accent' && accentColors[accentColor],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-bold text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-gray-600 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-4 border-t border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;

