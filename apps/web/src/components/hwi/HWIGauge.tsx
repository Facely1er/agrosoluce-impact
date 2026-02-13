/**
 * HWI Gauge Component
 * 
 * Circular gauge visualization for HWI score with color gradient
 */

import React from 'react';

export interface HWIGaugeProps {
  score: number;
  size?: number;
  showLabel?: boolean;
  showThresholds?: boolean;
}

export function HWIGauge({ 
  score, 
  size = 200, 
  showLabel = true, 
  showThresholds = false 
}: HWIGaugeProps) {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  const color = getGaugeColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {score.toFixed(1)}
          </span>
          {showLabel && (
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              HWI Score
            </span>
          )}
        </div>
      </div>

      {/* Threshold markers */}
      {showThresholds && (
        <div className="mt-4 flex justify-between w-full text-xs text-gray-600 dark:text-gray-400">
          <span>0 - Green</span>
          <span>25 - Yellow</span>
          <span>50 - Red</span>
          <span>75 - Black</span>
        </div>
      )}
    </div>
  );
}

function getGaugeColor(score: number): string {
  if (score >= 75) return '#1f2937'; // black
  if (score >= 50) return '#ef4444'; // red
  if (score >= 25) return '#f59e0b'; // yellow
  return '#10b981'; // green
}
