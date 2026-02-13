export interface PageFooterNoteProps {
  children: React.ReactNode;
  /** 'blue' = info style (e.g. What We Do), 'gray' = disclaimer style (e.g. Farmer Protection) */
  variant?: 'blue' | 'gray';
}

/**
 * Shared footer note block used on website and toolkit pages for disclaimers / info.
 */
export default function PageFooterNote({
  children,
  variant = 'gray',
}: PageFooterNoteProps) {
  const variantClass =
    variant === 'blue'
      ? 'bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 md:p-8 border border-blue-200 dark:border-blue-800 shadow-md'
      : 'bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6';

  const textClass =
    variant === 'blue'
      ? 'text-lg text-blue-900 dark:text-blue-100 font-medium text-center'
      : 'text-sm text-gray-600 dark:text-gray-400 text-center';

  return (
    <div className={`mt-8 md:mt-12 ${variantClass}`}>
      <p className={textClass}>{children}</p>
    </div>
  );
}
