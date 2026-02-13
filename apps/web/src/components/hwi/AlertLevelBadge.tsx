/**
 * Alert Level Badge Component
 * 
 * Color-coded badge with tooltip showing alert level description
 */

import React from 'react';

export interface AlertLevelBadgeProps {
  level: 'green' | 'yellow' | 'red' | 'black';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AlertLevelBadge({ level, showLabel = true, size = 'md' }: AlertLevelBadgeProps) {
  const config = {
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-800 dark:text-green-200',
      label: 'Normal',
      description: 'Normal conditions - routine monitoring',
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-800 dark:text-yellow-200',
      label: 'Elevated',
      description: 'Elevated stress - increase surveillance',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-800 dark:text-red-200',
      label: 'Crisis',
      description: 'Crisis conditions - activate response mechanisms',
    },
    black: {
      bg: 'bg-gray-800 dark:bg-gray-700',
      text: 'text-white',
      label: 'Severe',
      description: 'Severe crisis - emergency intervention required',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const { bg, text, label, description } = config[level];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${bg} ${text} ${sizeClasses[size]}`}
      title={description}
    >
      {showLabel && label}
    </span>
  );
}
