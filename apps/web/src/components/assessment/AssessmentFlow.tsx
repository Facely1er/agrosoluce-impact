import { useAssessment } from '@/hooks/assessment/useAssessment';
import { ProgressTracker } from './ProgressTracker';
import { QuestionCard } from './QuestionCard';
import { ResultsDashboard } from './ResultsDashboard';
import { NavigationControls } from './NavigationControls';
import { Heart, Building2, Shield, Baby, BarChart3 } from 'lucide-react';

interface AssessmentFlowProps {
  cooperativeId?: string;
  onComplete?: () => void;
}

export function AssessmentFlow({ cooperativeId, onComplete }: AssessmentFlowProps) {
  const {
    state,
    assessmentSections,
    handleAnswer,
    canProceed,
    nextSection,
    prevSection,
    calculateResults,
    saving,
    saveError
  } = useAssessment({ 
    cooperativeId,
    onComplete: () => {
      if (onComplete) {
        onComplete();
      }
    }
  });

  if (state.isComplete) {
    const results = calculateResults();
    return results ? <ResultsDashboard results={results} /> : null;
  }

  const currentSection = assessmentSections[state.currentSection];
  if (!currentSection) return null;

  // Map icon string to React component
  const getSectionIcon = (iconString: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      '🏛️': Building2,
      '🛡️': Shield,
      '👶': Baby,
      '📊': BarChart3,
    };
    const IconComponent = iconMap[iconString] || Building2;
    return <IconComponent className="h-8 w-8 text-green-700" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-700">
          Cocoa Self-Assessment
        </h1>
        <p className="text-gray-600 italic">Cocoa Due-Diligence Self-Assessment</p>
        <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
          <Heart className="h-4 w-4 text-green-700" fill="currentColor" />
          <span className="text-green-700 font-medium">
            Farmers First - 100% Free Assessment
          </span>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 text-left max-w-2xl mx-auto">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> This self-assessment applies to cocoa supply chains only. It is based on cooperative self-reported information and does not constitute certification, verification, or regulatory approval. Final sourcing decisions and compliance determinations remain the responsibility of buyers and operators.
          </p>
        </div>
      </div>

      {/* Progress */}
      <ProgressTracker 
        progress={state.progress}
        currentSection={state.currentSection}
        totalSections={assessmentSections.length}
        sections={assessmentSections}
      />

      {/* Assessment Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-700 flex items-center gap-3">
            {getSectionIcon(currentSection.icon)}
            {currentSection.title}
          </h2>
          <p className="text-gray-600 mt-2">{currentSection.description}</p>
          <div className="text-sm text-gray-500 mt-2">
            Section {state.currentSection + 1} of {assessmentSections.length}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {currentSection.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedOption={state.responses[question.id]?.selectedOption}
              onAnswer={(option) => handleAnswer(question.id, option)}
            />
          ))}
        </div>

        {/* Navigation */}
        <NavigationControls
          canGoBack={state.currentSection > 0}
          canGoForward={canProceed()}
          onBack={prevSection}
          onForward={nextSection}
          isLastSection={state.currentSection === assessmentSections.length - 1}
          currentSection={state.currentSection + 1}
          totalSections={assessmentSections.length}
        />
        
        {/* Save Status */}
        {saving && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm text-center">
            Saving assessment...
          </div>
        )}
        {saveError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
            Error saving: {saveError}
          </div>
        )}
      </div>
    </div>
  );
}

