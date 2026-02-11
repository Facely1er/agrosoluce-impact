import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-2 border rounded-lg resize-y',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-gray-50 disabled:cursor-not-allowed',
            'transition-colors duration-200',
            error
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

