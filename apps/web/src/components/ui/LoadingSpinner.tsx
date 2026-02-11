import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'white';
  text?: string;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', variant = 'primary', text, className, ...props }, ref) => {
    const sizes = {
      sm: 'h-4 w-4 border-2',
      md: 'h-8 w-8 border-2',
      lg: 'h-12 w-12 border-4',
    };

    const variants = {
      primary: 'border-primary-600 border-t-transparent',
      secondary: 'border-secondary-600 border-t-transparent',
      white: 'border-white border-t-transparent',
    };

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center', className)}
        {...props}
      >
        <div
          className={cn(
            'animate-spin rounded-full',
            sizes[size],
            variants[variant]
          )}
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
        {text && (
          <p className={cn(
            'mt-4 text-sm',
            variant === 'white' ? 'text-white' : 'text-gray-600'
          )}>
            {text}
          </p>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;

