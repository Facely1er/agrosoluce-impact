/**
 * =====================================================
 * Child Labor Compliance Dashboard
 * Main dashboard component for monitoring compliance across cooperatives
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import {
  ChildLaborAssessment,
  CooperativeComplianceStatus,
  ComplianceDashboard,
  ComplianceRating,
  AssessmentFilters,
  ViolationSeverity,
} from '../types/child-labor-monitoring-types';
import { supabase } from '../lib/supabaseClient';

// Chart components (assuming you're using recharts or similar)
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  // State
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ComplianceDashboard | null>(null);
  const [cooperativeStatuses, setCooperativeStatuses] = useState<CooperativeComplianceStatus[]>([]);
  const [filters, setFilters] = useState<AssessmentFilters>({
    region,
  });

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch compliance statistics
      const { data: statuses, error } = await supabase
        .from('cooperative_compliance_status')
        .select('*')
        .order('compliance_score', { ascending: false });

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
    statuses: CooperativeComplianceStatus[]
  ): ComplianceDashboard => {
    const totalCooperatives = statuses.length;
    const compliantCooperatives = statuses.filter(
      (s) => s.complianceScore && s.complianceScore >= 75
    ).length;
    const complianceRate = totalCooperatives > 0
      ? (compliantCooperatives / totalCooperatives) * 100
      : 0;

    const totalViolations = statuses.reduce(
      (sum, s) => sum + (s.childLaborViolations || 0),
      0
    );

    const criticalViolations = statuses.filter(
      (s) => s.violationSeverity === ViolationSeverity.Critical || 
             s.violationSeverity === ViolationSeverity.Severe
    ).length;

    const averageComplianceScore = statuses.reduce(
      (sum, s) => sum + (s.complianceScore || 0),
      0
    ) / totalCooperatives || 0;

    return {
      totalCooperatives,
      compliantCooperatives,
      complianceRate,
      averageComplianceScore,
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
  const complianceDistribution = [
    {
      name: 'Excellent (90-100)',
      value: cooperativeStatuses.filter(s => (s.complianceScore || 0) >= 90).length,
      color: '#10B981',
    },
    {
      name: 'Good (75-89)',
      value: cooperativeStatuses.filter(
        s => (s.complianceScore || 0) >= 75 && (s.complianceScore || 0) < 90
      ).length,
      color: '#3B82F6',
    },
    {
      name: 'Fair (60-74)',
      value: cooperativeStatuses.filter(
        s => (s.complianceScore || 0) >= 60 && (s.complianceScore || 0) < 75
      ).length,
      color: '#F59E0B',
    },
    {
      name: 'Poor (<60)',
      value: cooperativeStatuses.filter(s => (s.complianceScore || 0) < 60).length,
      color: '#EF4444',
    },
  ];

  const regionalData = groupByRegion(cooperativeStatuses);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Loading compliance data...</span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center p-8 text-gray-600">
        No compliance data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Child Labor Compliance Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Monitoring child labor-free practices across {dashboardData.totalCooperatives} cooperatives
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Compliance Rate"
          value={`${dashboardData.complianceRate.toFixed(1)}%`}
          subtitle={`${dashboardData.compliantCooperatives} / ${dashboardData.totalCooperatives} cooperatives`}
          icon="✓"
          color="green"
          trend={dashboardData.complianceRate >= 75 ? 'up' : 'down'}
        />
        <MetricCard
          title="Avg Compliance Score"
          value={dashboardData.averageComplianceScore.toFixed(0)}
          subtitle="Out of 100"
          icon="📊"
          color="blue"
        />
        <MetricCard
          title="Total Violations"
          value={dashboardData.totalViolations.toString()}
          subtitle={`${dashboardData.criticalViolations} critical/severe`}
          icon="⚠️"
          color="red"
          trend={dashboardData.totalViolations === 0 ? 'neutral' : 'down'}
        />
        <MetricCard
          title="Active Certifications"
          value={dashboardData.activeCertifications.toString()}
          subtitle="Fair Trade, Rainforest Alliance, etc."
          icon="🏆"
          color="yellow"
        />
      </div>

      {/* Social Impact Highlight */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📚 Social Impact Achievements
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
        {/* Compliance Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complianceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {complianceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Compliance Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance by Region</h3>
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Cooperative Compliance Status</h3>
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
                  Compliance Score
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
                        {status.complianceScore?.toFixed(0) || 'N/A'}
                      </div>
                      <div className="ml-2">
                        {getComplianceScoreBar(status.complianceScore)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ComplianceBadge rating={status.complianceRating} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {status.childrenEnrolledSchool || 0} ({status.schoolEnrollmentRate?.toFixed(1) || 0}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ViolationBadge count={status.childLaborViolations || 0} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="mr-1">🏆</span>
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
    </div>
  );
};

// Helper Components
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: 'green' | 'blue' | 'red' | 'yellow';
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
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
        <span className="text-2xl">{icon}</span>
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

const ComplianceBadge: React.FC<{ rating: ComplianceRating }> = ({ rating }) => {
  const colorClasses = {
    Excellent: 'bg-green-100 text-green-800',
    Good: 'bg-blue-100 text-blue-800',
    Fair: 'bg-yellow-100 text-yellow-800',
    Poor: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[rating]}`}
    >
      {rating}
    </span>
  );
};

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

const getComplianceScoreBar = (score?: number) => {
  if (!score) return null;
  
  const percentage = score;
  const color =
    percentage >= 90 ? 'bg-green-500' :
    percentage >= 75 ? 'bg-blue-500' :
    percentage >= 60 ? 'bg-yellow-500' :
    'bg-red-500';
  
  return (
    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Helper function to group by region
const groupByRegion = (statuses: CooperativeComplianceStatus[]) => {
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

    existing.totalScore += status.complianceScore || 0;
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
