import { Calendar, TrendingDown, AlertTriangle, BookOpen } from 'lucide-react';
import {
  ANALYTICS_DATA_RANGE,
  TIME_LAG_CORRELATION,
  ANALYTICS_REFERENCES,
} from '@/data/analyticsMethodology';

interface TimelinePhase {
  id: string;
  label: string;
  months: string;
  description: string;
  impact: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

export function TimeLagCorrelationTimeline() {
  const phases: TimelinePhase[] = [
    {
      id: 'surge',
      label: 'Malaria Surge Period',
      months: 'August - September',
      description: 'Peak transmission season in cocoa-growing regions',
      impact: `Workers experience ${TIME_LAG_CORRELATION.lostWorkdaysPerEpisode.min}-${TIME_LAG_CORRELATION.lostWorkdaysPerEpisode.max} lost workdays per malaria episode`,
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-300',
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    },
    {
      id: 'impact',
      label: 'Harvest Efficiency Impact',
      months: 'October - December',
      description: 'Critical harvest period with reduced workforce capacity',
      impact: `${TIME_LAG_CORRELATION.harvestEfficiencyReductionPercent.min}-${TIME_LAG_CORRELATION.harvestEfficiencyReductionPercent.max}% reduction in harvest efficiency documented`,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-300',
      icon: <TrendingDown className="h-5 w-5 text-amber-600" />,
    },
    {
      id: 'shortfall',
      label: 'Production Shortfalls',
      months: 'January - March',
      description: 'Visible production deficits from delayed/incomplete harvest',
      impact: 'Lower yields and quality degradation observed',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50 border-orange-300',
      icon: <Calendar className="h-5 w-5 text-orange-600" />,
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Time-Lag Correlation Analysis
        </h3>
        <p className="text-sm text-gray-600">
          Academic research demonstrates a 2-6 month lag between malaria surges and measurable
          production impacts in cocoa-growing regions.
        </p>
      </div>

      {/* Desktop Timeline View */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-red-300 via-amber-300 to-orange-300" />

          {/* Timeline Phases */}
          <div className="grid grid-cols-3 gap-4 relative">
            {phases.map((phase, index) => (
              <div key={phase.id} className="relative">
                {/* Timeline Dot */}
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-16 h-16 rounded-full ${phase.bgColor} border-2 flex items-center justify-center shadow-lg z-10`}
                  >
                    {phase.icon}
                  </div>
                </div>

                {/* Phase Card */}
                <div className={`${phase.bgColor} border-2 rounded-lg p-4`}>
                  <div className="text-center mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-white rounded-full">
                      Phase {index + 1}
                    </span>
                  </div>
                  <h4 className={`text-lg font-bold ${phase.color} mb-2 text-center`}>
                    {phase.label}
                  </h4>
                  <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                    {phase.months}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Impact:</p>
                    <p className="text-xs text-gray-600">{phase.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Timeline View */}
      <div className="md:hidden space-y-4">
        {phases.map((phase, index) => (
          <div key={phase.id} className="relative">
            {/* Connector Line (except for last item) */}
            {index < phases.length - 1 && (
              <div className="absolute left-8 top-16 bottom-0 w-1 bg-gradient-to-b from-red-300 via-amber-300 to-orange-300" />
            )}

            {/* Phase Card */}
            <div className="flex gap-4">
              {/* Timeline Dot */}
              <div
                className={`w-16 h-16 rounded-full ${phase.bgColor} border-2 flex items-center justify-center flex-shrink-0 shadow-lg z-10`}
              >
                {phase.icon}
              </div>

              {/* Content */}
              <div className={`flex-1 ${phase.bgColor} border-2 rounded-lg p-4`}>
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-white rounded-full">
                    Phase {index + 1}
                  </span>
                </div>
                <h4 className={`text-lg font-bold ${phase.color} mb-1`}>{phase.label}</h4>
                <p className="text-sm font-medium text-gray-700 mb-2">{phase.months}</p>
                <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Impact:</p>
                  <p className="text-xs text-gray-600">{phase.impact}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Methodology & substantiation */}
      <div className="mt-6 space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Methodology & data
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>
              <strong>Lag window:</strong> {TIME_LAG_CORRELATION.lagWindowMonths.min}–{TIME_LAG_CORRELATION.lagWindowMonths.max} months between health surge and measurable production impact (peer-reviewed evidence).
            </li>
            <li>
              <strong>Data range:</strong> Health proxy from VRAC pharmacy surveillance {ANALYTICS_DATA_RANGE.health.label}; harvest impact from documented studies in cocoa-growing regions.
            </li>
            <li>
              <strong>Limitation:</strong> Quantitative correlation coefficients (e.g. Pearson) would require paired health and harvest time series per site; current narrative is based on regional alignment and literature.
            </li>
          </ul>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">References</p>
          <ul className="text-xs text-gray-600 space-y-1">
            {ANALYTICS_REFERENCES.map((ref) => (
              <li key={ref.id}>
                <span className="font-medium">{ref.label}:</span> {ref.note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
