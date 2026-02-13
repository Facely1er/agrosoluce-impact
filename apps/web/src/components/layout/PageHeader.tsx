import type { LucideIcon } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional badge text (e.g. "Compliance & Monitoring") shown above title */
  badge?: string;
  /** Optional icon shown next to badge or title */
  icon?: LucideIcon;
  /** Optional: center title/subtitle (default: false, left-aligned) */
  centered?: boolean;
  /** Optional: use secondary gradient (directory-style) instead of primary */
  variant?: 'primary' | 'secondary';
}

/**
 * Shared page header used by both website and toolkit pages for consistent look.
 * Matches the gradient banner style from About, Directory, and reference pages.
 */
export default function PageHeader({
  title,
  subtitle,
  badge,
  icon: Icon,
  centered = false,
  variant = 'primary',
}: PageHeaderProps) {
  const gradientClass =
    variant === 'secondary'
      ? 'from-secondary-500 to-secondary-600 dark:from-secondary-600 dark:to-secondary-700'
      : 'from-primary-600 via-primary-700 to-secondary-500 dark:from-primary-700 dark:via-primary-800 dark:to-secondary-600';

  return (
    <div
      className={`bg-gradient-to-r ${gradientClass} rounded-xl shadow-lg p-8 md:p-12 mb-8 text-white relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
      <div className={`relative z-10 ${centered ? 'text-center' : ''}`}>
        {(badge || Icon) && (
          <div className={`flex items-center gap-3 mb-4 ${centered ? 'justify-center' : ''}`}>
            {Icon && (
              <Icon className="h-8 w-8 text-white/90 flex-shrink-0" />
            )}
            {badge && (
              <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p
            className={`text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed ${
              centered ? 'mx-auto' : ''
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
