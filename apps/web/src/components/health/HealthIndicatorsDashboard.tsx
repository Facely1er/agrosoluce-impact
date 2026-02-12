/**
 * Enhanced Health Indicators Dashboard
 * Displays comprehensive health metrics beyond malaria
 */

import { useState } from 'react';
import { Activity, Heart, Users, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

export interface HealthIndicator {
  id: string;
  category: 'malaria' | 'nutrition' | 'occupational-safety' | 'healthcare-access' | 'preventive-care';
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  description: string;
}

export interface HealthIndicatorsDashboardProps {
  indicators?: HealthIndicator[];
  cooperativeId?: string;
}

const mockIndicators: HealthIndicator[] = [
  {
    id: '1',
    category: 'malaria',
    name: 'Antimalarial Sales Index',
    value: 85,
    unit: 'index',
    trend: 'down',
    status: 'good',
    description: 'Declining antimalarial sales indicate improving workforce health',
  },
  {
    id: '2',
    category: 'nutrition',
    name: 'Nutrition Program Participation',
    value: 62,
    unit: '%',
    trend: 'up',
    status: 'warning',
    description: 'Percentage of families enrolled in nutrition programs',
  },
  {
    id: '3',
    category: 'occupational-safety',
    name: 'Safety Incidents',
    value: 3,
    unit: 'incidents/month',
    trend: 'stable',
    status: 'good',
    description: 'Reported occupational health and safety incidents',
  },
  {
    id: '4',
    category: 'healthcare-access',
    name: 'Healthcare Facility Access',
    value: 78,
    unit: '%',
    trend: 'up',
    status: 'good',
    description: 'Percentage of workers with access to healthcare facilities',
  },
  {
    id: '5',
    category: 'preventive-care',
    name: 'Preventive Health Measures',
    value: 45,
    unit: '%',
    trend: 'up',
    status: 'warning',
    description: 'Uptake of preventive health measures (vaccinations, screenings)',
  },
];

const categoryConfig = {
  malaria: {
    icon: Activity,
    color: 'text-health-600',
    bgColor: 'bg-health-100',
    label: 'Malaria & Disease',
  },
  nutrition: {
    icon: Heart,
    color: 'text-wellness-600',
    bgColor: 'bg-wellness-100',
    label: 'Nutrition',
  },
  'occupational-safety': {
    icon: Shield,
    color: 'text-vitality-600',
    bgColor: 'bg-vitality-100',
    label: 'Occupational Safety',
  },
  'healthcare-access': {
    icon: Users,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
    label: 'Healthcare Access',
  },
  'preventive-care': {
    icon: TrendingUp,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100',
    label: 'Preventive Care',
  },
};

export function HealthIndicatorsDashboard({ indicators = mockIndicators }: HealthIndicatorsDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredIndicators = selectedCategory
    ? indicators.filter((i) => i.category === selectedCategory)
    : indicators;

  const categories = Array.from(new Set(indicators.map((i) => i.category)));

  return (
    <div className="space-y-6" role="region" aria-label="Health Indicators Dashboard">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Health indicator categories">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          role="tab"
          aria-selected={selectedCategory === null}
          aria-controls="indicators-panel"
        >
          All Indicators
        </button>
        {categories.map((category) => {
          const config = categoryConfig[category as keyof typeof categoryConfig];
          const Icon = config.icon;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === category
                  ? `${config.bgColor} ${config.color}`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              role="tab"
              aria-selected={selectedCategory === category}
              aria-controls="indicators-panel"
              aria-label={config.label}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Indicators Grid */}
      <div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        id="indicators-panel"
        role="tabpanel"
        aria-label={selectedCategory ? `${selectedCategory} indicators` : 'All health indicators'}
      >
        {filteredIndicators.map((indicator) => {
          const config = categoryConfig[indicator.category];
          const Icon = config.icon;

          const statusColors = {
            good: 'border-wellness-300 bg-wellness-50',
            warning: 'border-warning/30 bg-warning/10',
            critical: 'border-error/30 bg-error/10',
          };

          const trendIcons = {
            up: '↗',
            down: '↘',
            stable: '→',
          };

          return (
            <Card key={indicator.id} className={`${statusColors[indicator.status]} border-2`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${config.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${config.color}`} aria-hidden="true" />
                  </div>
                  <span 
                    className="text-2xl" 
                    title={`Trend: ${indicator.trend}`}
                    aria-label={`Trend: ${indicator.trend}`}
                  >
                    {trendIcons[indicator.trend]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {indicator.name}
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <span aria-label={`${indicator.value} ${indicator.unit}`}>
                    {indicator.value}
                  </span>
                  <span className="text-lg text-gray-600 ml-1" aria-hidden="true">
                    {indicator.unit}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{indicator.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">{config.label}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredIndicators.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No indicators found for the selected category.</p>
        </div>
      )}
    </div>
  );
}
