/**
 * HWI Card Component
 * 
 * Displays a single HWI score with alert level and optional component breakdown
 */

import React from 'react';
import { AlertLevelBadge } from './AlertLevelBadge';

export interface HWICardProps {
  score: number;
  alertLevel: 'green' | 'yellow' | 'red' | 'black';
  pharmacyName?: string;
  departement?: string;
  period?: string;
  year?: number;
  showComponents?: boolean;
  components?: {
    workforce_health: number;
    child_welfare: number;
    womens_health: number;
    womens_empowerment: number;
    nutrition: number;
    chronic_illness: number;
    acute_illness: number;
  };
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function HWICard({
  score,
  alertLevel,
  pharmacyName,
  departement,
  period,
  year,
  showComponents = false,
  components,
  size = 'md',
  onClick,
}: HWICardProps) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const titleClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const scoreClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 ${sizeClasses[size]} ${
        onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
      style={{ borderLeftColor: getAlertColor(alertLevel) }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {pharmacyName && (
            <h3 className={`font-semibold text-gray-900 dark:text-white ${titleClasses[size]}`}>
              {pharmacyName}
            </h3>
          )}
          {departement && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {departement}
            </p>
          )}
          {(period || year) && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {period} {year}
            </p>
          )}
        </div>
        <AlertLevelBadge level={alertLevel} />
      </div>

      {/* HWI Score */}
      <div className="flex items-baseline gap-2">
        <span className={`font-bold text-gray-900 dark:text-white ${scoreClasses[size]}`}>
          {score.toFixed(1)}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">/ 100</span>
      </div>

      {/* Component Breakdown */}
      {showComponents && components && (
        <div className="mt-4 space-y-2">
          <ComponentBar
            label="Workforce Health"
            score={components.workforce_health}
            size={size}
          />
          <ComponentBar
            label="Child Welfare"
            score={components.child_welfare}
            size={size}
          />
          <ComponentBar
            label="Women's Health"
            score={components.womens_health}
            size={size}
          />
          <ComponentBar
            label="Women's Empowerment"
            score={components.womens_empowerment}
            size={size}
          />
          <ComponentBar
            label="Nutrition"
            score={components.nutrition}
            size={size}
          />
          <ComponentBar
            label="Chronic Illness"
            score={components.chronic_illness}
            size={size}
          />
          <ComponentBar
            label="Acute Illness"
            score={components.acute_illness}
            size={size}
          />
        </div>
      )}
    </div>
  );
}

interface ComponentBarProps {
  label: string;
  score: number;
  size: 'sm' | 'md' | 'lg';
}

function ComponentBar({ label, score, size }: ComponentBarProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const barHeight = size === 'sm' ? 'h-1.5' : 'h-2';

  const color = getScoreColor(score);

  return (
    <div>
      <div className={`flex justify-between ${textSize} text-gray-600 dark:text-gray-400 mb-1`}>
        <span>{label}</span>
        <span>{score.toFixed(1)}</span>
      </div>
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${barHeight} overflow-hidden`}>
        <div
          className={`${barHeight} rounded-full transition-all duration-300`}
          style={{
            width: `${Math.min(score, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function getAlertColor(level: 'green' | 'yellow' | 'red' | 'black'): string {
  const colors = {
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    black: '#1f2937',
  };
  return colors[level];
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#1f2937'; // black
  if (score >= 50) return '#ef4444'; // red
  if (score >= 25) return '#f59e0b'; // yellow
  return '#10b981'; // green
}
