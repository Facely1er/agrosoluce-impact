import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  FileText,
  Eye,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Handshake,
  Target
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function PartnerLandingPage() {
  const { t } = useI18n();

  const features = [
    {
      icon: FileText,
      title: t.partnerLanding.features.baselines.title,
      description: t.partnerLanding.features.baselines.description,
      points: [
        t.partnerLanding.features.baselines.point1,
        t.partnerLanding.features.baselines.point2,
        t.partnerLanding.features.baselines.point3,
      ],
    },
    {
      icon: Users,
      title: t.partnerLanding.features.monitoring.title,
      description: t.partnerLanding.features.monitoring.description,
      points: [
        t.partnerLanding.features.monitoring.point1,
        t.partnerLanding.features.monitoring.point2,
        t.partnerLanding.features.monitoring.point3,
        t.partnerLanding.features.monitoring.point4,
      ],
    },
    {
      icon: TrendingUp,
      title: t.partnerLanding.features.progress.title,
      description: t.partnerLanding.features.progress.description,
      points: [
        t.partnerLanding.features.progress.point1,
        t.partnerLanding.features.progress.point2,
        t.partnerLanding.features.progress.point3,
      ],
    },
    {
      icon: Eye,
      title: t.partnerLanding.features.views.title,
      description: t.partnerLanding.features.views.description,
      points: [
        t.partnerLanding.features.views.point1,
        t.partnerLanding.features.views.point2,
        t.partnerLanding.features.views.point3,
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-r from-green-600 via-green-700 to-teal-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
              <Handshake className="h-4 w-4" />
              <span>{t.partnerLanding.hero.tagline}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              {t.partnerLanding.hero.title}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-4 text-white/95 font-medium">
              {t.partnerLanding.hero.subtitle}
            </p>
            <p className="text-base md:text-lg lg:text-xl mb-10 text-white/85 max-w-3xl mx-auto leading-relaxed px-4">
              {t.partnerLanding.hero.description}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Partners & NGOs' }
        ]} />

        {/* The NGO & Program Challenge */}
        <section className="mb-16 md:mb-24">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t.partnerLanding.challenge.title}
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
              {t.partnerLanding.challenge.subtitle}
            </p>
            <ul className="space-y-3 mb-6">
              {t.partnerLanding.challenge.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <p className="text-lg text-green-900 font-medium">
                {t.partnerLanding.challenge.solution}
              </p>
            </div>
          </div>
        </section>

        {/* How AgroSoluce Supports Programs */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.partnerLanding.how.title}
            </h2>
          </div>

          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-l-4 border-green-500 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    <div className="flex-shrink-0">
                      <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center">
                        <Icon className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      <ul className="space-y-3">
                        {feature.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* What AgroSoluce Is (and Is Not) */}
        <section className="mb-16 md:mb-24">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {t.partnerLanding.whatIs.title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-green-900">
                    {t.partnerLanding.whatIs.is.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {t.partnerLanding.whatIs.is.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <h3 className="text-xl font-semibold text-red-900">
                    {t.partnerLanding.whatIs.isNot.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {t.partnerLanding.whatIs.isNot.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why NGOs & Partners Use AgroSoluce */}
        <section className="mb-16 md:mb-24">
          <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-xl shadow-lg p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {t.partnerLanding.why.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {t.partnerLanding.why.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Target className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-lg">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/pilot"
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {t.partnerLanding.cta.pilot}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/cooperatives"
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {t.partnerLanding.cta.explore}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            {t.partnerLanding.disclaimer}
          </p>
        </section>
      </div>
    </div>
  );
}

