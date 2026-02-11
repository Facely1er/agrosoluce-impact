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
  _responses: Record<string, any>
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Overall score recommendations
  if (overallScore >= 80) {
    recommendations.push({
      id: 'excellent-performance',
      category: 'compliance',
      priority: 'low',
      title: '🎉 Excellent! Strong foundation demonstrated.',
      description: 'Your cooperative demonstrates strong practices across all areas.',
      actionItems: [
        'Explore premium market opportunities',
        'Share best practices with other cooperatives',
        'Access advanced platform features'
      ],
      estimatedEffort: '1-2 weeks'
    });
  } else if (overallScore >= 60) {
    recommendations.push({
      id: 'good-foundation',
      category: 'compliance',
      priority: 'medium',
      title: 'Good foundation. Implementation toolkit available.',
      description: 'You have a solid foundation with some areas for improvement.',
      actionItems: [
        'Access the AgroSoluce implementation toolkit',
        'Focus on strengthening weak areas',
        'Continue building on your foundation'
      ],
      estimatedEffort: '2-4 weeks'
    });
  } else {
    recommendations.push({
      id: 'foundation-building',
      category: 'compliance',
      priority: 'high',
      title: 'Let\'s strengthen your foundation with basic improvements.',
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
      title: 'Child protection policies need immediate attention.',
      description: 'Strengthening child protection measures is essential for responsible operations.',
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

