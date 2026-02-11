import { Link } from 'react-router-dom';
import { 
  UsersRound, 
  Briefcase, 
  Handshake,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function WhoItsForPage() {
  const { t } = useI18n();

  const audiences = [
    {
      id: 'cooperatives',
      icon: UsersRound,
      iconColor: 'primary',
      title: t.whoItsFor.audiences.cooperatives.title,
      benefits: [
        t.whoItsFor.audiences.cooperatives.benefit1,
        t.whoItsFor.audiences.cooperatives.benefit2,
        t.whoItsFor.audiences.cooperatives.benefit3,
        t.whoItsFor.audiences.cooperatives.benefit4,
      ],
      cta: t.whoItsFor.audiences.cooperatives.cta,
      ctaLink: '/cooperative',
    },
    {
      id: 'buyers',
      icon: Briefcase,
      iconColor: 'blue',
      title: t.whoItsFor.audiences.buyers.title,
      benefits: [
        t.whoItsFor.audiences.buyers.benefit1,
        t.whoItsFor.audiences.buyers.benefit2,
        t.whoItsFor.audiences.buyers.benefit3,
        t.whoItsFor.audiences.buyers.benefit4,
      ],
      cta: t.whoItsFor.audiences.buyers.cta,
      ctaLink: '/buyer',
    },
    {
      id: 'partners',
      icon: Handshake,
      iconColor: 'green',
      title: t.whoItsFor.audiences.partners.title,
      benefits: [
        t.whoItsFor.audiences.partners.benefit1,
        t.whoItsFor.audiences.partners.benefit2,
        t.whoItsFor.audiences.partners.benefit3,
        t.whoItsFor.audiences.partners.benefit4,
      ],
      cta: t.whoItsFor.audiences.partners.cta,
    },
  ];

  const getIconBgColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary-100',
      blue: 'bg-blue-100',
      green: 'bg-green-100',
    };
    return colors[color] || 'bg-gray-100';
  };

  const getIconTextColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'text-primary-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
    };
    return colors[color] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Who It\'s For' }
        ]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 rounded-xl shadow-lg p-8 md:p-12 mb-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {t.whoItsFor.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t.whoItsFor.subtitle}
            </p>
          </div>
        </div>

        {/* Audiences */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {audiences.map((audience) => {
            const Icon = audience.icon;
            return (
              <div
                key={audience.id}
                className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary-500 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className={`${getIconBgColor(audience.iconColor)} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                  <Icon className={`h-8 w-8 ${getIconTextColor(audience.iconColor)}`} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  {audience.title}
                </h2>
                <ul className="space-y-4 mb-8">
                  {audience.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                {audience.cta && audience.ctaLink && (
                  <Link
                    to={audience.ctaLink}
                    className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 hover:underline"
                  >
                    {audience.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {audience.cta && !audience.ctaLink && (
                  <p className="text-primary-600 font-semibold">
                    {audience.cta}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200 shadow-md">
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            {t.whoItsFor.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

