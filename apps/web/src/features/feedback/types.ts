// TypeScript types for Feedback and Survey System

export type FeedbackType = 'bug' | 'feature_request' | 'complaint' | 'compliment' | 'suggestion';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'urgent';
export type FeedbackStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SurveyStatus = 'draft' | 'submitted' | 'reviewed';

export interface SatisfactionSurvey {
  id: string;
  cooperativeId: string;
  surveyMonth: string; // ISO date string (first day of month)
  submittedBy?: string;
  submittedAt?: string;
  
  // Standard questions (1-5 scale)
  platformMeetsNeeds?: number; // 1-5
  technicalSupportSufficient?: number; // 1-5
  trainingAppropriate?: number; // 1-5
  wouldRecommend?: number; // 1-5
  satisfiedWithImprovements?: number; // 1-5
  
  // Qualitative questions
  mostHelpfulFeature?: string;
  mostMissingFeature?: string;
  howCanWeServeBetter?: string;
  challengesEncountered?: string;
  suggestions?: string;
  
  // Impact questions
  hoursSavedPerWeek?: number;
  priceImprovementPercentage?: number;
  problemsAvoided?: string;
  unexpectedBenefits?: string;
  otherCooperativesRecommended?: string;
  
  overallSatisfaction?: number; // 1-10
  status: SurveyStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeedbackSubmission {
  id: string;
  cooperativeId?: string;
  userProfileId?: string;
  feedbackType: FeedbackType;
  subject?: string;
  content: string;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  assignedTo?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SurveyResponse {
  questionId: string;
  question: string;
  answer: number | string;
  type: 'scale' | 'text';
}

