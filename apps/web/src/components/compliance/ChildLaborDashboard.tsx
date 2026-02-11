/**
 * =====================================================
 * Child Labor Monitoring Dashboard
 * Main dashboard component for tracking documentation and self-assessments
 * Note: This does not make compliance determinations
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, BarChart3, AlertTriangle, Award, Plus, BookOpen, Trophy } from 'lucide-react';
import {
  CooperativeReadinessStatus,
  MonitoringDashboard,
  ReadinessRating,
  AssessmentFilters,
  ViolationSeverity,
  // Legacy types for backward compatibility
  CooperativeComplianceStatus,
  ComplianceDashboard,
  ComplianceRating,
} from '@/types/child-labor-monitoring-types';
import { supabase } from '@/lib/supabase';

// Chart components
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChildLaborDashboardProps {
  region?: string;
  onCooperativeClick?: (cooperativeId: string) => void;
}

const ChildLaborDashboard: React.FC<ChildLaborDashboardProps> = ({
  region,
  onCooperativeClick,
}) => {
  const navigate = useNavigate();
  // State
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<MonitoringDashboard | null>(null);
  const [cooperativeStatuses, setCooperativeStatuses] = useState<CooperativeReadinessStatus[]>([]);
  const [filters, _setFilters] = useState<AssessmentFilters>({
    region,
  });

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized');
        setLoading(false);
        return;
      }

      // Fetch readiness statistics (self-assessment data)
      const { data: statuses, error } = await supabase
        .from('cooperative_compliance_status') // Database table name unchanged for now
        .select('*')
        .order('compliance_score', { ascending: false }); // Database column name unchanged for now

      if (error) throw error;

      setCooperativeStatuses(statuses || []);

      // Calculate dashboard metrics
      const metrics = calculateDashboardMetrics(statuses || []);
      setDashboardData(metrics);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDashboardMetrics = (
    statuses: CooperativeReadinessStatus[]
  ): MonitoringDashboard => {
    const totalCooperatives = statuses.length;
    const cooperativesWithGoodScores = statuses.filter(
      (s) => (s.readinessScore || s.complianceScore) && (s.readinessScore || s.complianceScore || 0) >= 75
    ).length;
    const documentationCoverageRate = totalCooperatives > 0
      ? (cooperativesWithGoodScores / totalCooperatives) * 100
      : 0;

    const totalViolations = statuses.reduce(
      (sum, s) => sum + (s.childLaborViolations || 0),
      0
    );

    const criticalViolations = statuses.filter(
      (s) => s.violationSeverity === ViolationSeverity.Critical || 
             s.violationSeverity === ViolationSeverity.Severe
    ).length;

    const averageReadinessScore = statuses.reduce(
      (sum, s) => sum + (s.readinessScore || s.complianceScore || 0),
      0
    ) / totalCooperatives || 0;

      return {
        totalCooperatives,
        cooperativesWithGoodScores,
        documentationCoverageRate,
      averageReadinessScore,
      totalAssessments: totalCooperatives,
      assessmentsDueThisMonth: statuses.filter(s => 
        s.nextAssessmentDue && 
        new Date(s.nextAssessmentDue) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length,
      totalViolations,
      criticalViolations,
      activeCertifications: statuses.reduce((sum, s) => sum + s.activeCertifications, 0),
      expiringSoonCertifications: 0, // Would need separate query
    };
  };

  // Chart data preparation
  const readinessDistribution = [
    {
      name: 'Excellent (90-100)',
      value: cooperativeStatuses.filter(s => {
        const score = s.readinessScore || s.complianceScore || 0;
        return score >= 90;
      }).length,
      color: '#10B981',
    },
    {
      name: 'Good (75-89)',
      value: cooperativeStatuses.filter(s => {
        const score = s.readinessScore || s.complianceScore || 0;
        return score >= 75 && score < 90;
      }).length,
      color: '#3B82F6',
    },
    {
      name: 'Fair (60-74)',
      value: cooperativeStatuses.filter(s => {
        const score = s.readinessScore || s.complianceScore || 0;
        return score >= 60 && score < 75;
      }).length,
      color: '#F59E0B',
    },
    {
      name: 'Poor (<60)',
      value: cooperativeStatuses.filter(s => {
        const score = s.readinessScore || s.complianceScore || 0;
        return score < 60;
      }).length,
      color: '#EF4444',
    },
  ];

  const regionalData = groupByRegion(cooperativeStatuses);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="border-b border-gray-200 pb-4">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center p-8 text-gray-600">
        No assessment data available. Please ensure the database schema is deployed.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Child Labor Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Tracking documentation and self-assessments across {dashboardData.totalCooperatives} cooperatives
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3 max-w-2xl">
            <p className="text-xs text-yellow-800">
              <strong>Important:</strong> This dashboard displays self-assessment data. Assessments are non-certifying and do not replace audits or verification. This does not make compliance determinations. Final sourcing decisions and compliance determinations remain the responsibility of buyers and operators.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/compliance/assessments/new')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Documentation Coverage Rate"
          value={`${dashboardData.documentationCoverageRate.toFixed(1)}%`}
          subtitle={`${dashboardData.cooperativesWithGoodScores} / ${dashboardData.totalCooperatives} cooperatives with assessment scores ≥75`}
          icon={CheckCircle2}
          color="green"
          trend={dashboardData.documentationCoverageRate >= 75 ? 'up' : 'down'}
        />
        <MetricCard
          title="Avg Readiness Score"
          value={dashboardData.averageReadinessScore.toFixed(0)}
          subtitle="Self-assessment score (0-100 scale, not a compliance determination)"
          icon={BarChart3}
          color="blue"
        />
        <MetricCard
          title="Total Violations"
          value={dashboardData.totalViolations.toString()}
          subtitle={`${dashboardData.criticalViolations} critical/severe`}
          icon={AlertTriangle}
          color="red"
          trend={dashboardData.totalViolations === 0 ? 'neutral' : 'down'}
        />
        <MetricCard
          title="Active Certifications"
          value={dashboardData.activeCertifications.toString()}
          subtitle="Fair Trade, Rainforest Alliance, etc."
          icon={Award}
          color="yellow"
        />
      </div>

      {/* Social Impact Highlight */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary-600" />
          Social Impact Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">681+</div>
            <div className="text-sm text-gray-600 mt-1">Children in School</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">22</div>
            <div className="text-sm text-gray-600 mt-1">Youth Jobs Created</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600">€2.78M</div>
            <div className="text-sm text-gray-600 mt-1">Economic Impact</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Assessment Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={readinessDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {readinessDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Assessment Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Assessment Scores by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageScore" fill="#10B981" name="Avg Score" />
              <Bar dataKey="violations" fill="#EF4444" name="Violations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cooperatives Table */}
      {cooperativeStatuses.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Cooperative Assessment Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cooperative
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Readiness Score
                    <span className="text-xs font-normal normal-case ml-1 text-gray-400">(Self-assessment)</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School Enrollment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Violations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certifications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Assessment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cooperativeStatuses.map((status) => (
                  <tr
                    key={status.cooperativeId}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onCooperativeClick?.(status.cooperativeId)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {status.cooperativeName}
                      </div>
                      <div className="text-sm text-gray-500">{status.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {status.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {(status.readinessScore || status.complianceScore)?.toFixed(0) || 'N/A'}
                        </div>
                        <div className="ml-2">
                          {getReadinessScoreBar(status.readinessScore || status.complianceScore)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ReadinessBadge rating={status.readinessRating || (status as any).complianceRating} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {status.childrenEnrolledSchool || 0} ({status.schoolEnrollmentRate?.toFixed(1) || 0}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ViolationBadge count={status.childLaborViolations || 0} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        {status.activeCertifications}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {status.nextAssessmentDue
                        ? new Date(status.nextAssessmentDue).toLocaleDateString()
                        : 'Not scheduled'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
          <p>No cooperative assessment data found. Add sample data to see results.</p>
        </div>
      )}
    </div>
  );
};

// Helper Components
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'green' | 'blue' | 'red' | 'yellow';
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: IconComponent,
  color,
  trend,
}) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <IconComponent className="h-6 w-6" />
        {trend && <TrendIndicator trend={trend} />}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium mb-1">{title}</div>
      <div className="text-xs opacity-75">{subtitle}</div>
    </div>
  );
};

const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'neutral' }> = ({ trend }) => {
  if (trend === 'neutral') return null;
  
  return (
    <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
      {trend === 'up' ? '↑' : '↓'}
    </span>
  );
};

const ReadinessBadge: React.FC<{ rating: ReadinessRating }> = ({ rating }) => {
  const colorClasses = {
    Excellent: 'bg-green-100 text-green-800',
    Good: 'bg-blue-100 text-blue-800',
    Fair: 'bg-yellow-100 text-yellow-800',
    Poor: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[rating]}`}
      title="Readiness rating based on self-assessment (not a compliance determination)"
    >
      {rating}
    </span>
  );
};

// Legacy alias for backward compatibility
const ComplianceBadge = ReadinessBadge;

const ViolationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        ✓ None
      </span>
    );
  }

  const colorClass = count > 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {count} found
    </span>
  );
};

const ReadinessScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const barRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${score}%`;
    }
  }, [score]);
  
  const color =
    score >= 90 ? 'bg-green-500' :
    score >= 75 ? 'bg-blue-500' :
    score >= 60 ? 'bg-yellow-500' :
    'bg-red-500';
  
  return (
    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        ref={barRef}
        className={`h-full ${color} readiness-score-bar`}
        title={`Readiness score: ${score}% (self-assessment, not a compliance determination)`}
      />
    </div>
  );
};

const getReadinessScoreBar = (score?: number) => {
  if (!score) return null;
  return <ReadinessScoreBar score={score} />;
};

// Legacy aliases for backward compatibility
const ComplianceScoreBar = ReadinessScoreBar;
const getComplianceScoreBar = getReadinessScoreBar;

// Helper function to group by region
const groupByRegion = (statuses: CooperativeReadinessStatus[]) => {
  const regionMap = new Map<string, {
    region: string;
    totalScore: number;
    count: number;
    violations: number;
  }>();

  statuses.forEach(status => {
    const existing = regionMap.get(status.region) || {
      region: status.region,
      totalScore: 0,
      count: 0,
      violations: 0,
    };

    existing.totalScore += status.readinessScore || status.complianceScore || 0;
    existing.count += 1;
    existing.violations += status.childLaborViolations || 0;

    regionMap.set(status.region, existing);
  });

  return Array.from(regionMap.values()).map(({ region, totalScore, count, violations }) => ({
    region,
    averageScore: count > 0 ? totalScore / count : 0,
    violations,
  }));
};

export default ChildLaborDashboard;

