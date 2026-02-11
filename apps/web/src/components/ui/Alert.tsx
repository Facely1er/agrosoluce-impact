import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, onClose, className, children, ...props }, ref) => {
    const variants = {
      success: {
        container: 'bg-green-50 border-green-200',
        icon: 'text-green-600',
        title: 'text-green-800',
        content: 'text-green-700',
        iconComponent: CheckCircle,
      },
      error: {
        container: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        title: 'text-red-800',
        content: 'text-red-700',
        iconComponent: AlertCircle,
      },
      warning: {
        container: 'bg-yellow-50 border-yellow-200',
        icon: 'text-yellow-600',
        title: 'text-yellow-800',
        content: 'text-yellow-700',
        iconComponent: AlertTriangle,
      },
      info: {
        container: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        content: 'text-blue-700',
        iconComponent: Info,
      },
    };

    const variantStyles = variants[variant];
    const IconComponent = variantStyles.iconComponent;

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-4 border shadow-sm',
          variantStyles.container,
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <IconComponent className={cn('h-5 w-5 mt-0.5 flex-shrink-0', variantStyles.icon)} />
          <div className="flex-1 min-w-0">
            {title && (
              <p className={cn('font-medium mb-1', variantStyles.title)}>
                {title}
              </p>
            )}
            <div className={cn('text-sm', variantStyles.content)}>
              {children}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                'ml-auto flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors',
                variantStyles.icon
              )}
              aria-label="Close alert"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;

