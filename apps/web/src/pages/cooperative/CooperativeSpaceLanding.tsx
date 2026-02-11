import { Link } from 'react-router-dom';
import { Building2, ArrowRight, CheckCircle, FileText, BarChart3, Shield, Users, Sprout, Zap, Globe, Info } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function CooperativeSpaceLanding() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full mb-8">
            <Building2 className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.cooperativeSpace.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            {t.cooperativeSpace.hero.subtitle}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t.cooperativeSpace.hero.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-500">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.evidence.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.evidence.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary-500">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-secondary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.coverage.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.coverage.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.compliance.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.compliance.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Sprout className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.farmersFirst.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.farmersFirst.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.enablement.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.enablement.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeSpace.features.producers.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.features.producers.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t.cooperativeSpace.benefits.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.documentation.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.documentation.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.gapAnalysis.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.gapAnalysis.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.enablement.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.enablement.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.transparency.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.transparency.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.traceability.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.traceability.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeSpace.benefits.compliance.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeSpace.benefits.compliance.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 rounded-xl shadow-lg p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.cooperativeSpace.cta.title}
          </h2>
          <p className="text-xl mb-8 text-white/95 max-w-2xl mx-auto">
            {t.cooperativeSpace.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cooperatives"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t.cooperativeSpace.cta.findCooperative}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              {t.cooperativeSpace.cta.learnMore}
            </Link>
          </div>
          <p className="text-sm text-white/80 mt-6">
            {t.cooperativeSpace.cta.freeNote}
          </p>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {t.cooperativeSpace.info.title}
              </h3>
              <p className="text-blue-800 leading-relaxed mb-3">
                {t.cooperativeSpace.info.description1}
              </p>
              <p className="text-blue-800 leading-relaxed">
                {t.cooperativeSpace.info.description2}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {t.cooperativeSpace.links.lookingFor}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link 
              to="/cooperatives" 
              className="text-primary-600 hover:text-primary-700 underline"
            >
              {t.cooperativeSpace.links.browseDirectory}
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              to="/buyer" 
              className="text-primary-600 hover:text-primary-700 underline"
            >
              {t.cooperativeSpace.links.buyerPortal}
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              to="/about" 
              className="text-primary-600 hover:text-primary-700 underline"
            >
              {t.cooperativeSpace.links.about}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

