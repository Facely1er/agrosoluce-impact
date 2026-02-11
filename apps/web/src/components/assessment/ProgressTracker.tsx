import { useEffect, useRef } from 'react';
import type { AssessmentSection } from '@/types/assessment.types';
import styles from './ProgressTracker.module.css';

interface ProgressTrackerProps {
  progress: number;
  currentSection: number;
  totalSections: number; // Used implicitly for section count calculation
  sections: AssessmentSection[];
}

export function ProgressTracker({ 
  progress, 
  currentSection, 
  totalSections: _totalSections, // Kept for API consistency, calculated from sections.length
  sections 
}: ProgressTrackerProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.setProperty('--progress-width', `${progress}%`);
    }
  }, [progress]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      {/* Progress text */}
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-700">Assessment Progress</span>
        <span className="text-sm font-medium text-green-600">
          {progress}% Complete
        </span>
      </div>

      {/* Progress bar */}
      <div 
        ref={progressBarRef}
        className={`w-full bg-gray-200 rounded-full h-2.5 mb-4 ${styles.progressBarContainer}`}
        data-progress={progress}
      >
        <div 
          className={`bg-gradient-to-r from-green-600 to-green-700 h-2.5 rounded-full transition-all duration-500 ${styles.progressBar}`}
        />
      </div>

      {/* Section indicators */}
      <div className="flex justify-between">
        {sections.map((section, index) => {
          const isActive = index === currentSection;
          const isCompleted = index < currentSection;
          
          return (
            <div 
              key={section.id}
              className={`
                flex flex-col items-center text-center space-y-1 flex-1
                ${isActive ? 'text-green-600' : isCompleted ? 'text-green-500' : 'text-gray-400'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${isActive 
                  ? 'bg-green-600 text-white' 
                  : isCompleted 
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }
              `}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className="text-xs font-medium hidden md:block">
                {section.title.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

