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

