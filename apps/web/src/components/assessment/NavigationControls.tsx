interface NavigationControlsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  isLastSection: boolean;
  currentSection: number;
  totalSections: number;
}

export function NavigationControls({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  isLastSection,
  currentSection,
  totalSections
}: NavigationControlsProps) {
  return (
    <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
      {/* Back button */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all
          ${canGoBack
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        ← Previous
      </button>

      {/* Section indicator */}
      <div className="text-sm text-gray-500 font-medium">
        {currentSection} of {totalSections}
      </div>

      {/* Forward/Complete button */}
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all
          ${canGoForward
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isLastSection ? 'Complete Assessment' : 'Next →'}
      </button>
    </div>
  );
}

