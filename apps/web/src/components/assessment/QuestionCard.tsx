import type { AssessmentQuestion, AssessmentOption } from '@/types/assessment.types';

interface QuestionCardProps {
  question: AssessmentQuestion;
  selectedOption?: AssessmentOption;
  onAnswer: (option: AssessmentOption) => void;
}

export function QuestionCard({ question, selectedOption, onAnswer }: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {question.question}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {question.helpText && (
          <p className="text-sm text-gray-600">{question.helpText}</p>
        )}
      </div>

      <div className="grid gap-3">
        {question.options.map((option) => {
          const isSelected = selectedOption?.value === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onAnswer(option)}
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                ${isSelected
                  ? 'border-green-600 bg-gradient-to-r from-green-600 to-green-700 text-white'
                  : 'border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50'
                }
              `}
            >
              {/* Radio indicator */}
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected
                  ? 'border-white bg-white'
                  : 'border-gray-300'
                }
              `}>
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                )}
              </div>

              {/* Option text */}
              <span className="font-medium text-left flex-1">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

