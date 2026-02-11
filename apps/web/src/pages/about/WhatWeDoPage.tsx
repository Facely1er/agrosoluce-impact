import { Link } from 'react-router-dom';
import { 
  Eye, 
  FileText, 
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function WhatWeDoPage() {
  const { t } = useI18n();

  const features = [
    {
      id: 'visibility',
      icon: Eye,
      iconColor: 'primary',
      title: t.whatWeDo.features.visibility.title,
      description: t.whatWeDo.features.visibility.description,
      points: [
        t.whatWeDo.features.visibility.point1,
        t.whatWeDo.features.visibility.point2,
        t.whatWeDo.features.visibility.point3,
      ],
    },
    {
      id: 'coverage',
      icon: FileText,
      iconColor: 'blue',
      title: t.whatWeDo.features.coverage.title,
      description: t.whatWeDo.features.coverage.description,
      points: [
        t.whatWeDo.features.coverage.point1,
        t.whatWeDo.features.coverage.point2,
        t.whatWeDo.features.coverage.point3,
      ],
    },
    {
      id: 'dueDiligence',
      icon: Shield,
      iconColor: 'green',
      title: t.whatWeDo.features.dueDiligence.title,
      description: t.whatWeDo.features.dueDiligence.description,
      points: [
        t.whatWeDo.features.dueDiligence.point1,
        t.whatWeDo.features.dueDiligence.point2,
        t.whatWeDo.features.dueDiligence.point3,
      ],
      cta: t.whatWeDo.features.dueDiligence.cta,
      ctaLink: '/compliance/child-labor',
    },
    {
      id: 'farmersFirst',
      icon: Users,
      iconColor: 'teal',
      title: t.whatWeDo.features.farmersFirst.title,
      description: t.whatWeDo.features.farmersFirst.description,
      points: [
        t.whatWeDo.features.farmersFirst.point1,
        t.whatWeDo.features.farmersFirst.point2,
        t.whatWeDo.features.farmersFirst.point3,
      ],
    },
    {
      id: 'progress',
      icon: TrendingUp,
      iconColor: 'purple',
      title: t.whatWeDo.features.progress.title,
      description: t.whatWeDo.features.progress.description,
      points: [
        t.whatWeDo.features.progress.point1,
        t.whatWeDo.features.progress.point2,
        t.whatWeDo.features.progress.point3,
      ],
      cta: t.whatWeDo.features.progress.cta,
      ctaLink: '/assessment',
    },
  ];

  const getIconBgColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary-100',
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      teal: 'bg-teal-100',
      purple: 'bg-purple-100',
    };
    return colors[color] || 'bg-gray-100';
  };

  const getIconTextColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'text-primary-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      teal: 'text-teal-600',
      purple: 'text-purple-600',
    };
    return colors[color] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'What We Do' }
        ]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 rounded-xl shadow-lg p-8 md:p-12 mb-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {t.whatWeDo.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t.whatWeDo.subtitle}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-8 md:space-y-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-l-4 border-primary-500 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className={`${getIconBgColor(feature.iconColor)} w-16 h-16 rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-8 w-8 ${getIconTextColor(feature.iconColor)}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {feature.title}
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {feature.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                    {feature.cta && feature.ctaLink && (
                      <Link
                        to={feature.ctaLink}
                        className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 hover:underline"
                      >
                        {feature.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 md:p-8 border border-blue-200 shadow-md">
          <p className="text-lg text-blue-900 font-medium text-center">
            {t.whatWeDo.footer}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/cooperatives"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            {t.whatWeDo.cta}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

