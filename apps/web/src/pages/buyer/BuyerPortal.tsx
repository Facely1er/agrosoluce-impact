import { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { 
  Search, 
  UsersRound, 
  Heart, 
  Briefcase, 
  FileText, 
  Shield, 
  TrendingUp, 
  MapPin,
  CheckCircle,
  ArrowRight,
  Eye,
  BarChart3,
  Target,
  AlertCircle,
  Info
} from 'lucide-react';

export default function BuyerPortal() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Buyers', path: '/buyers' },
          { label: 'Buyer Portal' }
        ]} />
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 rounded-xl shadow-xl p-8 md:p-12 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4 border border-white/20">
              <Briefcase className="h-4 w-4" />
              <span>Buyer Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Source Responsibly with Confidence
            </h1>
            <p className="text-xl md:text-2xl mb-2 text-white/95">
              Discover, evaluate, and connect with EUDR-compliant cooperatives
            </p>
            <p className="text-lg text-white/85 max-w-3xl leading-relaxed">
              AgroSoluce™ provides buyers with transparent access to cooperative documentation coverage, 
              compliance readiness, and farmer engagement metrics. Make informed sourcing decisions 
              based on real evidence, not promises.
            </p>
          </div>
        </div>

        {/* Key Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Transparent Visibility</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              See exactly what documentation exists, what's missing, and where cooperatives 
              are in their compliance journey. No hidden gaps or overstated readiness.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Evaluate compliance risks across multiple frameworks (EUDR, CMMC, GDPR) 
              with evidence-based scoring and gap analysis.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Progress Tracking</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Monitor cooperative improvement over time. Track documentation coverage, 
              farmer engagement, and readiness metrics as they evolve.
            </p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/cooperatives"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-primary-500 group transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
                <UsersRound className="h-8 w-8 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Explore Cooperatives</h3>
                <p className="text-sm text-gray-600">
                  Browse our directory
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Access the interactive map and directory of cooperatives with documentation coverage, 
              compliance metrics, and farmer engagement data.
            </p>
          </Link>

          <Link
            to="/buyer/request"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-secondary-500 group border-2 border-secondary-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-secondary-100 p-3 rounded-lg group-hover:bg-secondary-200 transition-colors">
                <Briefcase className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Create Sourcing Request</h3>
                <p className="text-sm text-gray-600">
                  Get matched
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-secondary-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Submit your sourcing requirements (commodity, volume, compliance needs) and receive 
              intelligent matches with cooperatives that meet your criteria.
            </p>
          </Link>

          <Link
            to="/directory"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-blue-500 group transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Canonical Directory</h3>
                <p className="text-sm text-gray-600">
                  Verified records
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Access the canonical directory of verified cooperative records with standardized 
              data, coverage bands, and compliance status.
            </p>
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Analytics & Reports</h3>
                <p className="text-sm text-gray-600">
                  Coming soon
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Advanced analytics, compliance dashboards, and custom reporting tools for 
              comprehensive supply chain due diligence.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="h-4 w-4" />
              <span>Feature in development</span>
            </div>
          </div>
        </div>

        {/* What You Can Do Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What You Can Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Evaluate Documentation Coverage</h4>
                  <p className="text-sm text-gray-600">
                    Review what evidence exists for each cooperative: land rights, farmer registrations, 
                    traceability systems, and compliance documentation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Assess Compliance Readiness</h4>
                  <p className="text-sm text-gray-600">
                    View readiness scores, gap analysis, and maturity levels across EUDR, CMMC, 
                    and other regulatory frameworks.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Track Farmer Engagement</h4>
                  <p className="text-sm text-gray-600">
                    Understand how cooperatives engage with farmers: training programs, support 
                    services, and farmer-first initiatives.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Filter by Criteria</h4>
                  <p className="text-sm text-gray-600">
                    Use advanced filters: commodity type, region, coverage level, compliance status, 
                    and certification to find the right partners.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Request Sourcing Matches</h4>
                  <p className="text-sm text-gray-600">
                    Submit your sourcing requirements and receive intelligent matches based on 
                    commodity, volume, geography, and compliance needs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Monitor Progress</h4>
                  <p className="text-sm text-gray-600">
                    Track how cooperatives improve over time with documentation coverage trends, 
                    readiness improvements, and engagement metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6 mb-8 shadow-md">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                About AgroSoluce™ for Buyers
              </h3>
              <p className="text-blue-800 leading-relaxed mb-3">
                AgroSoluce™ provides transparency into cooperative documentation and compliance status. 
                We help you understand <strong>what exists, what's missing, and where to focus your due diligence</strong>. 
                This platform does not replace audits or certifications, but rather makes visible the 
                reality of farmer engagement, documentation coverage, and improvement efforts.
              </p>
              <p className="text-blue-800 leading-relaxed">
                <strong>What you get:</strong> Evidence-based insights, gap analysis, progress tracking, 
                and intelligent matching. <strong>What you don't get:</strong> Guarantees, certifications, 
                or audit replacements. We start from the farmer, structure reality at the cooperative level, 
                and support credible EUDR-aligned due diligence.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/buyers"
            className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Learn More</h3>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-white/90 leading-relaxed">
              Read our comprehensive guide for buyers on how AgroSoluce™ supports responsible sourcing 
              and due diligence processes.
            </p>
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-400 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Questions about using the platform, understanding compliance metrics, or finding 
              the right cooperatives? We're here to help.
            </p>
            <button className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-2">
              Contact Support <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

