import type { Recommendation } from '@/types/assessment.types';
import { Shield, Baby, ClipboardList, BarChart3, Pin } from 'lucide-react';

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
      case 'security': return Shield;
      case 'child-protection': return Baby;
      case 'compliance': return ClipboardList;
      case 'economic': return BarChart3;
      default: return Pin;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {(() => {
            const IconComponent = getCategoryIcon(recommendation.category);
            return <IconComponent className="h-6 w-6 text-primary-600" />;
          })()}
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

