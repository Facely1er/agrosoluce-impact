import { Link } from 'react-router-dom';
import { 
  Eye, 
  FileText, 
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Briefcase,
  Shield
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function BuyerLandingPage() {
  const { t } = useI18n();

  const features = [
    {
      icon: Eye,
      title: t.buyerLanding.features.discover.title,
      description: t.buyerLanding.features.discover.description,
      points: [
        t.buyerLanding.features.discover.point1,
        t.buyerLanding.features.discover.point2,
        t.buyerLanding.features.discover.point3,
      ],
    },
    {
      icon: FileText,
      title: t.buyerLanding.features.coverage.title,
      description: t.buyerLanding.features.coverage.description,
      points: [
        t.buyerLanding.features.coverage.point1,
        t.buyerLanding.features.coverage.point2,
        t.buyerLanding.features.coverage.point3,
      ],
    },
    {
      icon: Users,
      title: t.buyerLanding.features.engagement.title,
      description: t.buyerLanding.features.engagement.description,
      points: [
        t.buyerLanding.features.engagement.point1,
        t.buyerLanding.features.engagement.point2,
        t.buyerLanding.features.engagement.point3,
      ],
    },
    {
      icon: TrendingUp,
      title: t.buyerLanding.features.progress.title,
      description: t.buyerLanding.features.progress.description,
      points: [
        t.buyerLanding.features.progress.point1,
        t.buyerLanding.features.progress.point2,
        t.buyerLanding.features.progress.point3,
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
              <Briefcase className="h-4 w-4" />
              <span>{t.buyerLanding.hero.tagline}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              {t.buyerLanding.hero.title}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-4 text-white/95 font-medium">
              {t.buyerLanding.hero.subtitle}
            </p>
            <p className="text-base md:text-lg lg:text-xl mb-10 text-white/85 max-w-3xl mx-auto leading-relaxed px-4">
              {t.buyerLanding.hero.description}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* The Buyer Problem */}
        <section className="mb-16 md:mb-24">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t.buyerLanding.problem.title}
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
              {t.buyerLanding.problem.subtitle}
            </p>
            <ul className="space-y-3 mb-6">
              {t.buyerLanding.problem.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <p className="text-lg text-blue-900 font-medium">
                {t.buyerLanding.problem.solution}
              </p>
            </div>
          </div>
        </section>

        {/* How AgroSoluce Supports Buyer Due Diligence */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.buyerLanding.how.title}
            </h2>
          </div>

          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-l-4 border-primary-500"
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    <div className="flex-shrink-0">
                      <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary-600" />
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

        {/* What Buyers Get (and What They Don't) */}
        <section className="mb-16 md:mb-24">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {t.buyerLanding.whatGet.title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-green-900">
                    {t.buyerLanding.whatGet.youGet.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {t.buyerLanding.whatGet.youGet.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <h3 className="text-xl font-semibold text-red-900">
                    {t.buyerLanding.whatGet.youDont.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {t.buyerLanding.whatGet.youDont.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-lg text-blue-900 font-medium">
                {t.buyerLanding.whatGet.footer}
              </p>
            </div>
          </div>
        </section>

        {/* Why Buyers Use AgroSoluce */}
        <section className="mb-16 md:mb-24">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl shadow-lg p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {t.buyerLanding.why.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {t.buyerLanding.why.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
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
              to="/cooperatives"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {t.buyerLanding.cta.explore}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/buyer"
              className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {t.buyerLanding.cta.pilot}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            {t.buyerLanding.disclaimer}
          </p>
        </section>
      </div>
    </div>
  );
}

