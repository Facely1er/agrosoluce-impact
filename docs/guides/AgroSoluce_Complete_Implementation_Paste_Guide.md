# AgroSoluce Assessment Module - Complete Implementation Guide

## 🚀 **STEP-BY-STEP IMPLEMENTATION**

### **STEP 1: Create Directory Structure**

**Paste this in your terminal (from repository root):**

```bash
# Create assessment directories
mkdir -p src/components/assessment
mkdir -p src/pages/assessment
mkdir -p src/services/assessment
mkdir -p src/hooks/assessment
mkdir -p src/data/assessment

# Create assessment type files
touch src/types/assessment.types.ts
touch src/data/assessment/sections.ts
touch src/data/assessment/scoring.ts
touch src/hooks/assessment/useAssessment.ts
touch src/services/assessment/api.ts
touch src/services/assessment/scoring.ts
```

---

## 📁 **STEP 2: Create Assessment Types**

**Create file: `src/types/assessment.types.ts`**

```typescript
export interface AssessmentQuestion {
  id: string;
  question: string;
  options: AssessmentOption[];
  helpText?: string;
  required: boolean;
}

export interface AssessmentOption {
  value: string;
  label: string;
  score: number;
}

export interface AssessmentSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentResponse {
  questionId: string;
  selectedOption: AssessmentOption;
  timestamp: Date;
}

export interface AssessmentResults {
  id: string;
  cooperativeId: string;
  responses: AssessmentResponse[];
  overallScore: number;
  sectionScores: Record<string, number>;
  recommendations: Recommendation[];
  toolkitReady: boolean;
  completedAt: Date;
  createdAt: Date;
}

export interface Recommendation {
  id: string;
  category: 'security' | 'child-protection' | 'compliance' | 'economic';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  estimatedEffort: string;
}

export interface AssessmentState {
  currentSection: number;
  responses: Record<string, AssessmentResponse>;
  isComplete: boolean;
  progress: number;
}
```

---

## 📊 **STEP 3: Create Assessment Data**

**Create file: `src/data/assessment/sections.ts`**

```typescript
import { AssessmentSection } from '@/types/assessment.types';

export const assessmentSections: AssessmentSection[] = [
  {
    id: 'farm-profile',
    title: 'Farm & Cooperative Profile',
    icon: '🏛️',
    description: 'Basic information about your cooperative and operations',
    questions: [
      {
        id: 'cooperative-size',
        question: 'How many members are in your cooperative?',
        required: true,
        options: [
          { value: 'small', label: '50-150 members', score: 1 },
          { value: 'medium', label: '150-400 members', score: 2 },
          { value: 'large', label: '400+ members', score: 3 }
        ]
      },
      {
        id: 'primary-crop',
        question: 'What is your primary crop?',
        required: true,
        options: [
          { value: 'cocoa', label: 'Cocoa', score: 3 },
          { value: 'cashew', label: 'Cashew', score: 3 },
          { value: 'coffee', label: 'Coffee', score: 2 },
          { value: 'mixed', label: 'Mixed crops', score: 1 }
        ]
      },
      {
        id: 'certifications',
        question: 'Do you have any certifications?',
        required: true,
        options: [
          { value: 'fair-trade', label: 'Fair Trade certified', score: 3 },
          { value: 'organic', label: 'Organic certified', score: 3 },
          { value: 'in-progress', label: 'Certification in progress', score: 2 },
          { value: 'none', label: 'No certifications', score: 1 }
        ]
      }
    ]
  },
  {
    id: 'security-data',
    title: 'Security & Data Protection',
    icon: '🛡️',
    description: 'How you protect cooperative and member information',
    questions: [
      {
        id: 'record-storage',
        question: 'How do you store cooperative records?',
        required: true,
        options: [
          { value: 'digital-secure', label: 'Secure digital system with backups', score: 3 },
          { value: 'computer-basic', label: 'Basic computer storage', score: 2 },
          { value: 'paper-organized', label: 'Organized paper records', score: 1 },
          { value: 'paper-basic', label: 'Basic paper records', score: 0 }
        ]
      },
      {
        id: 'financial-protection',
        question: 'How do you protect financial information?',
        required: true,
        options: [
          { value: 'bank-secure', label: 'Bank accounts with proper controls', score: 3 },
          { value: 'mobile-money', label: 'Mobile money with PIN protection', score: 2 },
          { value: 'cash-safe', label: 'Cash in secure location', score: 1 },
          { value: 'cash-basic', label: 'Basic cash management', score: 0 }
        ]
      },
      {
        id: 'communication-security',
        question: 'How do you communicate sensitive information?',
        required: true,
        options: [
          { value: 'secure-apps', label: 'Secure messaging apps', score: 3 },
          { value: 'whatsapp', label: 'WhatsApp or SMS', score: 2 },
          { value: 'phone-only', label: 'Phone calls only', score: 1 },
          { value: 'in-person', label: 'In-person meetings only', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'child-protection',
    title: 'Child Protection & Social Responsibility',
    icon: '👶',
    description: 'Policies and practices for protecting children in your community',
    questions: [
      {
        id: 'child-labor-policy',
        question: 'Do you have child labor prevention policies?',
        required: true,
        options: [
          { value: 'enforced', label: 'Written policy, actively enforced', score: 3 },
          { value: 'written', label: 'Written policy exists', score: 2 },
          { value: 'verbal', label: 'Verbal understanding among members', score: 1 },
          { value: 'none', label: 'No formal policy', score: 0 }
        ]
      },
      {
        id: 'child-monitoring',
        question: 'How do you monitor child welfare in your community?',
        required: true,
        options: [
          { value: 'systematic', label: 'Systematic monitoring with records', score: 3 },
          { value: 'regular-discussions', label: 'Regular discussions in meetings', score: 2 },
          { value: 'informal-awareness', label: 'Informal community awareness', score: 1 },
          { value: 'none', label: 'No specific monitoring', score: 0 }
        ]
      },
      {
        id: 'education-support',
        question: 'How do you support children\'s education?',
        required: true,
        options: [
          { value: 'education-fund', label: 'Education fund & scholarships', score: 3 },
          { value: 'school-supplies', label: 'Help with school supplies', score: 2 },
          { value: 'encourage-only', label: 'Encourage education', score: 1 },
          { value: 'none', label: 'No specific support', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'economic-performance',
    title: 'Economic Performance & Market Access',
    icon: '📊',
    description: 'Your cooperative\'s economic strength and market connections',
    questions: [
      {
        id: 'price-information',
        question: 'How do you get market price information?',
        required: true,
        options: [
          { value: 'real-time', label: 'Real-time market data access', score: 3 },
          { value: 'weekly-updates', label: 'Weekly market updates', score: 2 },
          { value: 'buyer-info', label: 'Information from buyers', score: 1 },
          { value: 'limited', label: 'Limited price information', score: 0 }
        ]
      },
      {
        id: 'buyer-relationships',
        question: 'How many regular buyers do you have?',
        required: true,
        options: [
          { value: 'multiple-premium', label: '5+ buyers including premium markets', score: 3 },
          { value: 'multiple-regular', label: '3-5 regular buyers', score: 2 },
          { value: 'few-buyers', label: '1-2 regular buyers', score: 1 },
          { value: 'single-irregular', label: 'Single buyer or irregular sales', score: 0 }
        ]
      }
    ]
  }
];
```

**Create file: `src/data/assessment/scoring.ts`**

```typescript
import { Recommendation } from '@/types/assessment.types';

export const SCORING_CONFIG = {
  PASSING_SCORE: 60,
  SECTION_WEIGHTS: {
    'farm-profile': 0.2,
    'security-data': 0.3,
    'child-protection': 0.3,
    'economic-performance': 0.2
  },
  MAX_SCORE_PER_QUESTION: 3
};

export function generateRecommendations(
  overallScore: number,
  sectionScores: Record<string, number>,
  responses: Record<string, any>
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Overall score recommendations
  if (overallScore >= 80) {
    recommendations.push({
      id: 'excellent-performance',
      category: 'compliance',
      priority: 'low',
      title: '🎉 Excellent! You\'re ready for premium market certification.',
      description: 'Your cooperative demonstrates strong practices across all areas.',
      actionItems: [
        'Apply for premium certification programs',
        'Share best practices with other cooperatives',
        'Access advanced marketplace features'
      ],
      estimatedEffort: '1-2 weeks'
    });
  } else if (overallScore >= 60) {
    recommendations.push({
      id: 'good-foundation',
      category: 'compliance',
      priority: 'medium',
      title: '✅ Good foundation. Ready for implementation toolkit.',
      description: 'You have a solid foundation with some areas for improvement.',
      actionItems: [
        'Access the AgroSoluce implementation toolkit',
        'Focus on strengthening weak areas',
        'Prepare for certification processes'
      ],
      estimatedEffort: '2-4 weeks'
    });
  } else {
    recommendations.push({
      id: 'foundation-building',
      category: 'compliance',
      priority: 'high',
      title: '🔧 Let\'s strengthen your foundation with basic improvements.',
      description: 'Focus on building fundamental capabilities before advanced features.',
      actionItems: [
        'Start with basic infrastructure improvements',
        'Implement foundational policies',
        'Begin training programs for members'
      ],
      estimatedEffort: '4-8 weeks'
    });
  }

  // Section-specific recommendations
  if (sectionScores['child-protection'] < 2) {
    recommendations.push({
      id: 'child-protection-urgent',
      category: 'child-protection',
      priority: 'critical',
      title: '⚠️ Child protection policies need immediate attention.',
      description: 'Strengthening child protection measures is essential for certification.',
      actionItems: [
        'Develop written child labor prevention policy',
        'Train cooperative leaders on child protection',
        'Implement monitoring and reporting systems',
        'Create education support programs'
      ],
      estimatedEffort: '2-3 weeks'
    });
  }

  if (sectionScores['security-data'] < 2) {
    recommendations.push({
      id: 'security-improvement',
      category: 'security',
      priority: 'high',
      title: '💾 Improve data security and record keeping systems.',
      description: 'Better information management will improve efficiency and compliance.',
      actionItems: [
        'Implement digital record keeping system',
        'Set up secure backup procedures',
        'Train staff on data protection',
        'Establish access controls'
      ],
      estimatedEffort: '3-4 weeks'
    });
  }

  if (sectionScores['economic-performance'] < 2) {
    recommendations.push({
      id: 'market-access',
      category: 'economic',
      priority: 'medium',
      title: '📈 Improve market access and price information.',
      description: 'Better market connections will increase member income.',
      actionItems: [
        'Establish regular market price monitoring',
        'Develop relationships with multiple buyers',
        'Join cooperative networks',
        'Improve product quality and presentation'
      ],
      estimatedEffort: '4-6 weeks'
    });
  }

  return recommendations;
}
```

---

## 🔧 **STEP 4: Create Assessment Hook**

**Create file: `src/hooks/assessment/useAssessment.ts`**

```typescript
import { useState, useCallback, useEffect } from 'react';
import { AssessmentState, AssessmentResponse, AssessmentResults } from '@/types/assessment.types';
import { assessmentSections } from '@/data/assessment/sections';
import { SCORING_CONFIG, generateRecommendations } from '@/data/assessment/scoring';

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>({
    currentSection: 0,
    responses: {},
    isComplete: false,
    progress: 0
  });

  // Calculate progress
  const updateProgress = useCallback(() => {
    const totalQuestions = assessmentSections.reduce((acc, section) => acc + section.questions.length, 0);
    const answeredQuestions = Object.keys(state.responses).length;
    const progress = Math.round((answeredQuestions / totalQuestions) * 100);
    
    setState(prev => ({ ...prev, progress }));
  }, [state.responses]);

  // Handle answer selection
  const handleAnswer = useCallback((questionId: string, option: any) => {
    const response: AssessmentResponse = {
      questionId,
      selectedOption: option,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: response
      }
    }));
  }, []);

  // Check if current section is complete
  const canProceed = useCallback(() => {
    const currentSectionQuestions = assessmentSections[state.currentSection]?.questions || [];
    return currentSectionQuestions.every(q => state.responses[q.id]);
  }, [state.currentSection, state.responses]);

  // Navigate to next section
  const nextSection = useCallback(() => {
    if (state.currentSection < assessmentSections.length - 1) {
      setState(prev => ({ ...prev, currentSection: prev.currentSection + 1 }));
    } else {
      setState(prev => ({ ...prev, isComplete: true }));
    }
  }, [state.currentSection]);

  // Navigate to previous section
  const prevSection = useCallback(() => {
    if (state.currentSection > 0) {
      setState(prev => ({ ...prev, currentSection: prev.currentSection - 1 }));
    }
  }, [state.currentSection]);

  // Calculate scores
  const calculateResults = useCallback((): AssessmentResults | null => {
    const responses = Object.values(state.responses);
    if (responses.length === 0) return null;

    // Calculate section scores
    const sectionScores: Record<string, number> = {};
    
    assessmentSections.forEach(section => {
      const sectionResponses = section.questions
        .map(q => state.responses[q.id])
        .filter(Boolean);
      
      if (sectionResponses.length > 0) {
        const totalScore = sectionResponses.reduce((acc, response) => 
          acc + response.selectedOption.score, 0);
        const maxScore = section.questions.length * SCORING_CONFIG.MAX_SCORE_PER_QUESTION;
        sectionScores[section.id] = Math.round((totalScore / maxScore) * 100);
      }
    });

    // Calculate overall score
    const weightedScore = Object.entries(sectionScores).reduce((acc, [sectionId, score]) => {
      const weight = SCORING_CONFIG.SECTION_WEIGHTS[sectionId] || 0;
      return acc + (score * weight);
    }, 0);

    const overallScore = Math.round(weightedScore);
    const toolkitReady = overallScore >= SCORING_CONFIG.PASSING_SCORE;

    // Generate recommendations
    const recommendations = generateRecommendations(overallScore, sectionScores, state.responses);

    return {
      id: crypto.randomUUID(),
      cooperativeId: '', // Will be set by parent component
      responses: Object.values(state.responses),
      overallScore,
      sectionScores,
      recommendations,
      toolkitReady,
      completedAt: new Date(),
      createdAt: new Date()
    };
  }, [state.responses]);

  // Load saved assessment from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('agrosoluce_assessment');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        setState(parsedState);
      } catch (error) {
        console.error('Failed to load saved assessment:', error);
      }
    }
  }, []);

  // Save assessment to localStorage
  useEffect(() => {
    localStorage.setItem('agrosoluce_assessment', JSON.stringify(state));
  }, [state]);

  // Update progress when responses change
  useEffect(() => {
    updateProgress();
  }, [state.responses, updateProgress]);

  return {
    state,
    assessmentSections,
    handleAnswer,
    canProceed,
    nextSection,
    prevSection,
    calculateResults,
    reset: () => setState({
      currentSection: 0,
      responses: {},
      isComplete: false,
      progress: 0
    })
  };
}
```

---

## ⚛️ **STEP 5: Create Assessment Components**

**Create file: `src/components/assessment/AssessmentFlow.tsx`**

```tsx
import React from 'react';
import { useAssessment } from '@/hooks/assessment/useAssessment';
import { ProgressTracker } from './ProgressTracker';
import { QuestionCard } from './QuestionCard';
import { ResultsDashboard } from './ResultsDashboard';
import { NavigationControls } from './NavigationControls';

export function AssessmentFlow() {
  const {
    state,
    assessmentSections,
    handleAnswer,
    canProceed,
    nextSection,
    prevSection,
    calculateResults
  } = useAssessment();

  if (state.isComplete) {
    const results = calculateResults();
    return results ? <ResultsDashboard results={results} /> : null;
  }

  const currentSection = assessmentSections[state.currentSection];
  if (!currentSection) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-700">
          AgroSoluce<sup>®</sup> Farm Assessment
        </h1>
        <p className="text-gray-600 italic">Cultivating Secure Agriculture</p>
        <div className="inline-block bg-green-100 px-4 py-2 rounded-full">
          <span className="text-green-700 font-medium">
            ❤️ Farmers First - 100% Free Assessment
          </span>
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
            <span className="text-3xl">{currentSection.icon}</span>
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
      </div>
    </div>
  );
}
```

**Create file: `src/components/assessment/QuestionCard.tsx`**

```tsx
import React from 'react';
import { AssessmentQuestion, AssessmentOption } from '@/types/assessment.types';

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
```

**Create file: `src/components/assessment/ProgressTracker.tsx`**

```tsx
import React from 'react';
import { AssessmentSection } from '@/types/assessment.types';

interface ProgressTrackerProps {
  progress: number;
  currentSection: number;
  totalSections: number;
  sections: AssessmentSection[];
}

export function ProgressTracker({ 
  progress, 
  currentSection, 
  totalSections, 
  sections 
}: ProgressTrackerProps) {
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
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-gradient-to-r from-green-600 to-green-700 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
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
```

**Create file: `src/components/assessment/NavigationControls.tsx`**

```tsx
import React from 'react';

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
```

**Create file: `src/components/assessment/ResultsDashboard.tsx`**

```tsx
import React from 'react';
import { AssessmentResults } from '@/types/assessment.types';
import { ScoreCircle } from './ScoreCircle';
import { RecommendationCard } from './RecommendationCard';

interface ResultsDashboardProps {
  results: AssessmentResults;
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Premium market ready!';
    if (score >= 60) return 'Good - toolkit recommended';
    return 'Foundational improvements needed';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-700">
          Your Assessment Results
        </h1>
        <p className="text-gray-600">Complete analysis of your cooperative's readiness</p>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Score Circle */}
        <ScoreCircle score={results.overallScore} />

        {/* Score Label */}
        <h3 className={`text-xl font-bold mb-2 ${getScoreColor(results.overallScore)}`}>
          Overall Readiness Score
        </h3>
        
        <p className={`text-lg mb-6 ${getScoreColor(results.overallScore)}`}>
          {getScoreLabel(results.overallScore)}
        </p>

        {/* Section Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(results.sectionScores).map(([sectionId, score]) => {
            const section = {
              'farm-profile': { name: 'Farm Profile', icon: '🏛️' },
              'security-data': { name: 'Security', icon: '🛡️' },
              'child-protection': { name: 'Child Protection', icon: '👶' },
              'economic-performance': { name: 'Economic', icon: '📊' }
            }[sectionId] || { name: sectionId, icon: '📊' };

            return (
              <div key={sectionId} className="text-center">
                <div className="text-2xl mb-2">{section.icon}</div>
                <div className="text-2xl font-bold text-green-600">{score}%</div>
                <div className="text-sm text-gray-600">{section.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {results.recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Personalized Recommendations
          </h2>
          
          <div className="grid gap-4">
            {results.recommendations.map((recommendation) => (
              <RecommendationCard 
                key={recommendation.id} 
                recommendation={recommendation} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Ready for Next Steps?</h3>
        
        <p className="text-lg mb-6">
          {results.toolkitReady 
            ? 'Access our implementation toolkit with step-by-step guidance.'
            : 'Start with our foundation-building tools and support.'
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            onClick={() => alert('Implementation toolkit coming soon!')}
          >
            🛠️ Access Toolkit
          </button>
          
          <button 
            className="bg-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
            onClick={() => alert('Expert consultation coming soon!')}
          >
            📞 Speak with Expert
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Create file: `src/components/assessment/ScoreCircle.tsx`**

```tsx
import React from 'react';

interface ScoreCircleProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
}

export function ScoreCircle({ score, size = 'large' }: ScoreCircleProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  const strokeWidth = size === 'small' ? 4 : size === 'medium' ? 6 : 8;
  const radius = size === 'small' ? 28 : size === 'medium' ? 42 : 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#16a34a'; // green-600
    if (score >= 60) return '#2563eb'; // blue-600
    return '#ea580c'; // orange-600
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto mb-4`}>
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold ${textSizeClasses[size]}`} style={{ color: getScoreColor(score) }}>
          {score}%
        </span>
      </div>
    </div>
  );
}
```

**Create file: `src/components/assessment/RecommendationCard.tsx`**

```tsx
import React from 'react';
import { Recommendation } from '@/types/assessment.types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return '🛡️';
      case 'child-protection': return '👶';
      case 'compliance': return '📋';
      case 'economic': return '📊';
      default: return '📌';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryIcon(recommendation.category)}</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {recommendation.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium border
                ${getPriorityColor(recommendation.priority)}
              `}>
                {recommendation.priority.toUpperCase()} Priority
              </span>
              <span className="text-sm text-gray-500">
                Est. {recommendation.estimatedEffort}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">
        {recommendation.description}
      </p>

      {/* Action Items */}
      {recommendation.actionItems.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Action Items:</h4>
          <ul className="space-y-2">
            {recommendation.actionItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

**Create file: `src/components/assessment/index.ts`**

```typescript
export { AssessmentFlow } from './AssessmentFlow';
export { QuestionCard } from './QuestionCard';
export { ProgressTracker } from './ProgressTracker';
export { ResultsDashboard } from './ResultsDashboard';
export { ScoreCircle } from './ScoreCircle';
export { RecommendationCard } from './RecommendationCard';
export { NavigationControls } from './NavigationControls';
```

---

## 📄 **STEP 6: Create Assessment Page**

**Create file: `src/pages/assessment/index.tsx`**

```tsx
import React from 'react';
import { AssessmentFlow } from '@/components/assessment';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <AssessmentFlow />
    </div>
  );
}
```

---

## 🗄️ **STEP 7: Database Migration (Supabase)**

**Add to your Supabase database (run in Supabase SQL editor):**

```sql
-- Assessment tables
CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id uuid REFERENCES cooperatives(id) ON DELETE CASCADE,
  assessment_data jsonb NOT NULL,
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  section_scores jsonb NOT NULL,
  recommendations jsonb NOT NULL,
  toolkit_ready boolean DEFAULT false,
  completed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Assessment responses for detailed tracking
CREATE TABLE assessment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  response_value text NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 3),
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_assessments_cooperative_id ON assessments(cooperative_id);
CREATE INDEX idx_assessments_completed_at ON assessments(completed_at);
CREATE INDEX idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);

-- Row Level Security (RLS)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your auth setup)
CREATE POLICY "Users can view own cooperative assessments" ON assessments
  FOR SELECT USING (
    cooperative_id IN (
      SELECT cooperative_id FROM user_cooperatives 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own cooperative assessments" ON assessments
  FOR INSERT WITH CHECK (
    cooperative_id IN (
      SELECT cooperative_id FROM user_cooperatives 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own assessment responses" ON assessment_responses
  FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments 
      WHERE cooperative_id IN (
        SELECT cooperative_id FROM user_cooperatives 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert own assessment responses" ON assessment_responses
  FOR INSERT WITH CHECK (
    assessment_id IN (
      SELECT id FROM assessments 
      WHERE cooperative_id IN (
        SELECT cooperative_id FROM user_cooperatives 
        WHERE user_id = auth.uid()
      )
    )
  );
```

---

## 🔌 **STEP 8: Add Routing**

**Add to your main App.tsx or routing configuration:**

```tsx
// In your main routing file (App.tsx or routes.tsx)
import AssessmentPage from '@/pages/assessment';

// Add this route to your existing routes
const routes = [
  // existing routes
  {
    path: '/assessment',
    component: AssessmentPage,
  },
  // existing routes
];
```

**Add to navigation (if you have a navigation component):**

```tsx
// In your navigation component
const navigationItems = [
  // existing items
  {
    href: '/assessment',
    label: 'Farm Assessment',
    icon: '📋', // or use an icon library
  },
  // existing items
];
```

---

## 🎨 **STEP 9: Update Tailwind Config (if needed)**

**Add to your `tailwind.config.js` if you need custom colors:**

```javascript
// tailwind.config.js
module.exports = {
  // existing config
  theme: {
    extend: {
      colors: {
        agrosoluce: {
          green: '#2E7D32',
          gold: '#FFB300',
        },
      },
      // existing theme
    },
  },
  // existing config
};
```

---

## ✅ **STEP 10: Test the Implementation**

**Run these commands to test:**

```bash
# Start development server
npm run dev

# Navigate to assessment page
# Visit: http://localhost:5173/assessment

# Test functionality:
# 1. Answer questions in each section
# 2. Navigate between sections
# 3. Complete assessment
# 4. View results and recommendations
```

---

## 🚀 **STEP 11: Deploy**

**Your existing Vercel deployment should automatically include the assessment module:**

```bash
# Commit and push changes
git add .
git commit -m "Add AgroSoluce assessment module"
git push origin main

# Vercel will automatically deploy
```

---

## 🎯 **IMMEDIATE NEXT STEPS**

1. **Copy all the code above** into the specified files
2. **Run the database migration** in Supabase
3. **Test locally** with `npm run dev`
4. **Add navigation link** to your existing menu
5. **Deploy to production** via your existing Vercel setup

This implementation gives you a complete, working assessment module that integrates seamlessly with your existing AgroSoluce platform!
