/**
 * Framework Compliance Badge Component
 * Displays the current agricultural health framework version and compliance status
 */

import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui';

export interface FrameworkComplianceBadgeProps {
  /** Framework version being followed */
  version?: string;
  /** Compliance status */
  status: 'compliant' | 'partial' | 'review-needed';
  /** Show detailed tooltip on hover */
  showTooltip?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export function FrameworkComplianceBadge({
  version = '1.0',
  status,
  showTooltip = true,
  size = 'md',
}: FrameworkComplianceBadgeProps) {
  const statusConfig = {
    compliant: {
      icon: CheckCircle2,
      color: 'bg-wellness-100 text-wellness-700 border-wellness-300',
      label: 'Framework Compliant',
      description: 'All required health indicators tracked',
    },
    partial: {
      icon: Info,
      color: 'bg-health-100 text-health-700 border-health-300',
      label: 'Partial Compliance',
      description: 'Some health indicators pending',
    },
    'review-needed': {
      icon: AlertCircle,
      color: 'bg-warning/10 text-warning border-warning/30',
      label: 'Review Needed',
      description: 'Framework compliance requires review',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div 
      className="inline-flex items-center gap-2"
      role="status"
      aria-label={`Framework version ${version}: ${config.label}`}
    >
      <div
        className={`
          inline-flex items-center gap-1.5 rounded-lg border font-medium
          ${config.color} ${sizeClasses[size]}
          ${showTooltip ? 'cursor-help' : ''}
        `}
        title={showTooltip ? config.description : undefined}
        aria-describedby={showTooltip ? `framework-desc-${status}` : undefined}
      >
        <Icon className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} aria-hidden="true" />
        <span>Framework v{version}</span>
      </div>
      {size !== 'sm' && (
        <span className="text-xs text-gray-500 dark:text-gray-400" id={`framework-desc-${status}`}>
          {config.label}
        </span>
      )}
    </div>
  );
}

/**
 * Framework Tooltip Component
 * Provides contextual help for framework-specific terminology
 */
export interface FrameworkTooltipProps {
  /** Term to explain */
  term: string;
  /** Definition/explanation */
  definition: string;
  /** Category of the term */
  category?: 'health' | 'sustainability' | 'compliance' | 'general';
}

export function FrameworkTooltip({ term, definition, category = 'general' }: FrameworkTooltipProps) {
  const categoryColors = {
    health: 'border-health-300 bg-health-50 text-health-900',
    sustainability: 'border-wellness-300 bg-wellness-50 text-wellness-900',
    compliance: 'border-primary-300 bg-primary-50 text-primary-900',
    general: 'border-gray-300 bg-gray-50 text-gray-900',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-medium border
        cursor-help transition-all hover:shadow-md
        ${categoryColors[category]}
      `}
      title={definition}
      role="tooltip"
      aria-label={`${term}: ${definition}`}
      tabIndex={0}
    >
      <Info className="h-3 w-3" aria-hidden="true" />
      {term}
    </span>
  );
}
