import { Link } from 'react-router-dom';
import { Building2, ArrowRight, CheckCircle, FileText, BarChart3, Shield, Users, Sprout } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';

interface CooperativeLandingPageProps {
  cooperativeId?: string;
}

export default function CooperativeLandingPage({ cooperativeId }: CooperativeLandingPageProps) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <Building2 className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.cooperativeWorkspaceLanding.hero.title}
          </h1>
          <p className="text-xl text-gray-600 mb-2 max-w-2xl mx-auto">
            {t.cooperativeWorkspaceLanding.hero.subtitle}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t.cooperativeWorkspaceLanding.hero.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-500">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeWorkspaceLanding.features.evidence.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeWorkspaceLanding.features.evidence.description}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeWorkspaceLanding.features.coverage.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeWorkspaceLanding.features.coverage.description}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeWorkspaceLanding.features.compliance.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeWorkspaceLanding.features.compliance.description}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.cooperativeWorkspaceLanding.features.farmersFirst.title}</h3>
                <p className="text-sm text-gray-600">
                  {t.cooperativeWorkspaceLanding.features.farmersFirst.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits List */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t.cooperativeWorkspaceLanding.benefits.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeWorkspaceLanding.benefits.documentation.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeWorkspaceLanding.benefits.documentation.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeWorkspaceLanding.benefits.gapAnalysis.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeWorkspaceLanding.benefits.gapAnalysis.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeWorkspaceLanding.benefits.enablement.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeWorkspaceLanding.benefits.enablement.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t.cooperativeWorkspaceLanding.benefits.transparency.title}</h4>
                <p className="text-sm text-gray-600">
                  {t.cooperativeWorkspaceLanding.benefits.transparency.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 rounded-xl shadow-lg p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.cooperativeWorkspaceLanding.cta.title}
          </h2>
          <p className="text-xl mb-8 text-white/95 max-w-2xl mx-auto">
            {t.cooperativeWorkspaceLanding.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cooperatives"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t.cooperativeWorkspaceLanding.cta.register}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              {t.cooperativeWorkspaceLanding.cta.learnMore}
            </Link>
          </div>
          <p className="text-sm text-white/80 mt-6">
            {t.cooperativeWorkspaceLanding.cta.freeNote}
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            {t.cooperativeWorkspaceLanding.additional.alreadyRegistered}
          </p>
          <p className="text-sm text-gray-500">
            {t.cooperativeWorkspaceLanding.additional.errorMessage}{' '}
            <Link to="/cooperatives" className="text-primary-600 hover:text-primary-700 underline">
              {t.cooperativeWorkspaceLanding.additional.checkDirectory}
            </Link>
            {' '}to find your cooperative.
          </p>
        </div>
      </div>
    </div>
  );
}

