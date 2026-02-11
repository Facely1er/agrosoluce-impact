import type { AssessmentResults } from '@/types/assessment.types';
import { ScoreCircle } from './ScoreCircle';
import { RecommendationCard } from './RecommendationCard';
import { Building2, Shield, Baby, BarChart3, Wrench, Phone } from 'lucide-react';

interface ResultsDashboardProps {
  results: AssessmentResults;
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'High readiness based on self-assessment - toolkit available';
    if (score >= 60) return 'Good readiness with areas to strengthen - toolkit recommended';
    return 'Foundational improvements needed before engaging buyers';
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
        <p className="text-gray-600">Self-assessment summary (not a certification or compliance determination)</p>
        
        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 text-left">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> This is a self-assessment tool. It is non-certifying and does not replace audits or verification. 
            Final sourcing decisions and compliance determinations remain the responsibility of buyers and operators.
          </p>
        </div>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Score Circle */}
        <ScoreCircle score={results.overallScore} />

        {/* Score Label */}
        <h3 className={`text-xl font-bold mb-2 ${getScoreColor(results.overallScore)}`}>
          Self-Assessment Score
        </h3>
        
        <p className={`text-lg mb-2 ${getScoreColor(results.overallScore)}`}>
          {getScoreLabel(results.overallScore)}
        </p>
        
        <p className="text-sm text-gray-500 mb-6 italic">
          Self-assessment (not certified)
        </p>

        {/* Section Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(results.sectionScores).map(([sectionId, score]) => {
            const section = {
              'farm-profile': { name: 'Farm Profile', icon: Building2 },
              'security-data': { name: 'Security', icon: Shield },
              'child-protection': { name: 'Child Protection', icon: Baby },
              'economic-performance': { name: 'Economic', icon: BarChart3 }
            }[sectionId] || { name: sectionId, icon: BarChart3 };

            const IconComponent = section.icon;
            return (
              <div key={sectionId} className="text-center">
                <div className="flex justify-center mb-2">
                  <IconComponent className="h-10 w-10 text-primary-600" />
                </div>
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
            className="flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            onClick={() => alert('Implementation toolkit coming soon!')}
          >
            <Wrench className="h-5 w-5" />
            Access Toolkit
          </button>
          
          <button 
            className="flex items-center gap-2 bg-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
            onClick={() => alert('Expert consultation coming soon!')}
          >
            <Phone className="h-5 w-5" />
            Speak with Expert
          </button>
        </div>
      </div>
    </div>
  );
}

