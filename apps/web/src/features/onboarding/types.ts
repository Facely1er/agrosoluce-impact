// TypeScript types for Farmers First Onboarding System

export type OnboardingStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';

export interface CooperativeOnboarding {
  id: string;
  cooperativeId: string;
  status: OnboardingStatus;
  currentStep: number;
  startedAt?: string;
  completedAt?: string;
  welcomeCallScheduledAt?: string;
  welcomeCallCompletedAt?: string;
  onboardingChampionId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OnboardingStep {
  id: string;
  onboardingId: string;
  stepNumber: number;
  stepName: string;
  stepDescription?: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  createdAt?: string;
}

export interface OnboardingStepDefinition {
  stepNumber: number;
  stepName: string;
  stepDescription: string;
  component: string; // Component name to render
  required: boolean;
}

export const DEFAULT_ONBOARDING_STEPS: OnboardingStepDefinition[] = [
  {
    stepNumber: 1,
    stepName: 'Welcome & Introduction',
    stepDescription: 'Learn about AgroSoluce and the Farmers First approach',
    component: 'WelcomeStep',
    required: true
  },
  {
    stepNumber: 2,
    stepName: 'Account Setup',
    stepDescription: 'Configure your cooperative profile and user accounts',
    component: 'AccountSetupStep',
    required: true
  },
  {
    stepNumber: 3,
    stepName: 'Data Migration',
    stepDescription: 'Import your existing cooperative data',
    component: 'DataMigrationStep',
    required: false
  },
  {
    stepNumber: 4,
    stepName: 'Security Configuration',
    stepDescription: 'Set up security settings and passwords',
    component: 'SecurityStep',
    required: true
  },
  {
    stepNumber: 5,
    stepName: 'Training Champions',
    stepDescription: 'Designate training champions for your cooperative',
    component: 'ChampionsStep',
    required: true
  },
  {
    stepNumber: 6,
    stepName: 'Baseline Assessment',
    stepDescription: 'Complete baseline measurements before using AgroSoluce',
    component: 'BaselineStep',
    required: true
  },
  {
    stepNumber: 7,
    stepName: 'Welcome Call',
    stepDescription: 'Schedule and complete your welcome call',
    component: 'WelcomeCallStep',
    required: true
  }
];

