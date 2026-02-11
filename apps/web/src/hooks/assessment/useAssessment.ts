import { useState, useCallback, useEffect } from 'react';
import { AssessmentState, AssessmentResponse, AssessmentResults } from '@/types/assessment.types';
import { assessmentSections } from '@/data/assessment/sections';
import { SCORING_CONFIG, generateRecommendations } from '@/data/assessment/scoring';
import { createAssessment, getLatestAssessment } from '@/features/assessment/api/assessmentApi';

interface UseAssessmentOptions {
  cooperativeId?: string;
  onComplete?: (results: AssessmentResults) => void;
}

export function useAssessment(options?: UseAssessmentOptions) {
  const { cooperativeId, onComplete } = options || {};
  const [state, setState] = useState<AssessmentState>({
    currentSection: 0,
    responses: {},
    isComplete: false,
    progress: 0
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  // Save assessment to Supabase
  const saveAssessmentToSupabase = useCallback(async (results: AssessmentResults) => {
    if (!cooperativeId) {
      console.warn('No cooperativeId provided, skipping Supabase save');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const { data, error } = await createAssessment(cooperativeId, results);
      
      if (error) {
        console.error('Error saving assessment to Supabase:', error);
        setSaveError(error.message);
        // Keep localStorage as backup even if Supabase save fails
        return;
      }

      // Clear localStorage after successful save
      if (cooperativeId) {
        localStorage.removeItem(`agrosoluce_assessment_${cooperativeId}`);
      }
      localStorage.removeItem('agrosoluce_assessment');

      // Call onComplete callback if provided
      if (onComplete && data) {
        onComplete(results);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error in saveAssessmentToSupabase:', error);
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  }, [cooperativeId, onComplete]);

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
      const weight = SCORING_CONFIG.SECTION_WEIGHTS[sectionId as keyof typeof SCORING_CONFIG.SECTION_WEIGHTS] || 0;
      return acc + (score * weight);
    }, 0);

    const overallScore = Math.round(weightedScore);
    const toolkitReady = overallScore >= SCORING_CONFIG.PASSING_SCORE;

    // Generate recommendations
    const recommendations = generateRecommendations(overallScore, sectionScores, state.responses);

    return {
      id: crypto.randomUUID(),
      cooperativeId: cooperativeId || '', // Use provided cooperativeId
      responses: Object.values(state.responses),
      overallScore,
      sectionScores,
      recommendations,
      toolkitReady,
      completedAt: new Date(),
      createdAt: new Date()
    };
  }, [state.responses, cooperativeId]);

  // Navigate to next section
  const nextSection = useCallback(async () => {
    if (state.currentSection < assessmentSections.length - 1) {
      setState(prev => ({ ...prev, currentSection: prev.currentSection + 1 }));
    } else {
      // Assessment is complete - save to Supabase
      setState(prev => ({ ...prev, isComplete: true }));
      
      if (cooperativeId) {
        const results = calculateResults();
        if (results) {
          results.cooperativeId = cooperativeId;
          await saveAssessmentToSupabase(results);
        }
      }
    }
  }, [state.currentSection, cooperativeId, calculateResults, saveAssessmentToSupabase]);

  // Navigate to previous section
  const prevSection = useCallback(() => {
    if (state.currentSection > 0) {
      setState(prev => ({ ...prev, currentSection: prev.currentSection - 1 }));
    }
  }, [state.currentSection]);

  // Load assessment from Supabase or localStorage on mount
  useEffect(() => {
    const loadAssessment = async () => {
      if (cooperativeId) {
        // Try to load from Supabase first
        const { data: latestAssessment, error } = await getLatestAssessment(cooperativeId);
        
        if (!error && latestAssessment && latestAssessment.assessment_data?.responses) {
          // Load completed assessment from Supabase
          const responses: Record<string, AssessmentResponse> = {};
          latestAssessment.assessment_data.responses.forEach((r: any) => {
            responses[r.questionId] = {
              questionId: r.questionId,
              selectedOption: r.selectedOption,
              timestamp: new Date(r.timestamp),
            };
          });
          
          setState({
            currentSection: assessmentSections.length - 1,
            responses,
            isComplete: true,
            progress: 100,
          });
          return;
        }
      }

      // Fallback to localStorage for in-progress assessments
      const storageKey = cooperativeId 
        ? `agrosoluce_assessment_${cooperativeId}` 
        : 'agrosoluce_assessment';
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        try {
          const parsedState = JSON.parse(saved);
          // Convert timestamp strings back to Date objects
          if (parsedState.responses) {
            Object.keys(parsedState.responses).forEach(key => {
              if (parsedState.responses[key].timestamp) {
                parsedState.responses[key].timestamp = new Date(parsedState.responses[key].timestamp);
              }
            });
          }
          setState(parsedState);
        } catch (error) {
          console.error('Failed to load saved assessment from localStorage:', error);
        }
      }
    };

    loadAssessment();
  }, [cooperativeId]);

  // Save in-progress assessment to localStorage as temporary buffer
  useEffect(() => {
    if (!state.isComplete) {
      const storageKey = cooperativeId 
        ? `agrosoluce_assessment_${cooperativeId}` 
        : 'agrosoluce_assessment';
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state, cooperativeId]);

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
    saving,
    saveError,
    reset: () => {
      setState({
        currentSection: 0,
        responses: {},
        isComplete: false,
        progress: 0
      });
      setSaveError(null);
      // Clear localStorage
      if (cooperativeId) {
        localStorage.removeItem(`agrosoluce_assessment_${cooperativeId}`);
      }
      localStorage.removeItem('agrosoluce_assessment');
    }
  };
}

