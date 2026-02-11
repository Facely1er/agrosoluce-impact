import { Link } from 'react-router-dom';
import { 
  Shield, 
  BarChart3, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  FileCheck, 
  Eye,
  BookOpen,
  Target,
  ArrowRight,
  Info,
  Award,
  Clock,
  MapPin
} from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function MonitoringPage() {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 dark:from-gray-900 via-primary-50 dark:via-gray-900 to-white dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Monitoring', path: '/monitoring' }
        ]} />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-xl shadow-2xl p-8 md:p-12 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-white/90" />
              <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">Compliance & Monitoring</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Child Labor Monitoring & Compliance
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-3xl">
              Track documentation, self-assessments, and improvement efforts across agricultural cooperatives
            </p>
            <p className="text-base text-white/80 max-w-3xl mb-6 leading-relaxed">
              AgroSoluce™ supports learning, monitoring, and improvement — not marketing narratives. 
              Our monitoring platform helps cooperatives, buyers, and partners track child labor prevention 
              efforts, documentation coverage, and compliance readiness across supply chains.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/compliance/child-labor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all border border-white/30 font-medium"
              >
                <BarChart3 className="h-5 w-5" />
                View Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/compliance/assessments/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all border border-white/20 font-medium"
              >
                <FileCheck className="h-5 w-5" />
                New Assessment
              </Link>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Documentation Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Monitor documentation coverage rates, track self-assessment scores, and identify gaps 
              in compliance readiness across cooperatives.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Farmer Engagement</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Track farmer-level activities at cooperative scale, including training participation, 
              declarations, and baseline indicators.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Progress Monitoring</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Record readiness snapshots, track visible improvements, and monitor remaining gaps 
              over time to support continuous improvement.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Risk Assessment</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Identify and track child labor violations, assess severity levels, and monitor 
              remediation efforts across regions and cooperatives.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Certification Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Monitor active certifications, track expiration dates, and understand certification 
              coverage across the cooperative network.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Regional Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              View assessment scores, violation patterns, and improvement trends by region to 
              identify areas requiring focused support.
            </p>
          </div>
        </div>

        {/* What You Can Monitor */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">What You Can Monitor</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Documentation Coverage Rate</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Percentage of cooperatives with assessment scores ≥75, indicating strong documentation coverage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Average Readiness Score</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Self-assessment scores (0-100 scale) indicating overall compliance readiness across cooperatives.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">School Enrollment Rates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Track children enrolled in school and enrollment rates as indicators of child labor prevention efforts.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Violation Tracking</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Monitor total violations, identify critical and severe cases, and track remediation progress.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Assessment Schedule</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Track upcoming assessments, monitor due dates, and ensure regular evaluation cycles.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Certification Status</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Monitor active certifications (Fair Trade, Rainforest Alliance, etc.) and track expiration dates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-primary-50 dark:from-primary-900/20 to-secondary-50 dark:to-secondary-900/20 rounded-xl shadow-lg p-8 mb-8 border border-primary-100 dark:border-primary-800/30">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">How Monitoring Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Self-Assessments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Cooperatives complete structured self-assessments covering documentation, policies, 
                monitoring systems, and child labor prevention measures.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Data Aggregation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Assessment data is aggregated at the cooperative level, providing visibility into 
                documentation coverage, readiness scores, and improvement areas.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Progress Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Regular snapshots enable tracking of improvements over time, helping identify 
                successful interventions and areas requiring additional support.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-400 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Important: Non-Certifying Platform</h3>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed mb-3">
                This monitoring dashboard displays self-assessment data and documentation tracking. 
                <strong className="font-semibold"> Assessments are non-certifying and do not replace audits or verification.</strong> 
                This platform does not make compliance determinations.
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-xs leading-relaxed">
                Final sourcing decisions and compliance determinations remain the responsibility of buyers and operators. 
                AgroSoluce™ supports monitoring and due diligence efforts but does not certify outcomes or replace 
                independent verification.
              </p>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Getting Started</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">For Cooperatives</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Complete a self-assessment to establish your baseline documentation coverage and readiness score
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Upload documentation and evidence to support your assessment responses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Track your progress over time and identify areas for improvement
                  </span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">For Buyers & Partners</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-secondary-600 dark:text-secondary-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Explore the monitoring dashboard to view assessment data across cooperatives
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-secondary-600 dark:text-secondary-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Use regional and cooperative-level insights to inform your due diligence process
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-secondary-600 dark:text-secondary-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Track improvement efforts and support cooperatives in their compliance journey
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/compliance/child-labor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Eye className="h-5 w-5" />
              View Monitoring Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

