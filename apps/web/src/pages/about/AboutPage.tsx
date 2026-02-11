import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Target, 
  ArrowRight,
  CheckCircle,
  XCircle,
  Heart,
  Eye,
  TrendingUp,
  FileText,
  Shield
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function AboutPage() {
  const { t } = useI18n();

  const designPrinciples = [
    {
      icon: Heart,
      title: t.about.designPrinciples.farmerFirst.title,
      description: t.about.designPrinciples.farmerFirst.description,
    },
    {
      icon: TrendingUp,
      title: t.about.designPrinciples.progress.title,
      description: t.about.designPrinciples.progress.description,
    },
    {
      icon: Eye,
      title: t.about.designPrinciples.transparency.title,
      description: t.about.designPrinciples.transparency.description,
    },
    {
      icon: Target,
      title: t.about.designPrinciples.process.title,
      description: t.about.designPrinciples.process.description,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'About' }
        ]} />

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 rounded-xl shadow-lg p-8 md:p-12 mb-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {t.about.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              {t.about.subtitle}
            </p>
          </div>
        </div>

        {/* Why AgroSoluce Exists */}
        <section className="mb-16 md:mb-24">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-l-4 border-primary-500">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-8 w-8 text-primary-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t.about.why.title}
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              {t.about.why.subtitle}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-50 rounded-xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-red-900 mb-4">
                  {t.about.why.problem.title}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{t.about.why.problem.question1}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{t.about.why.problem.question2}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{t.about.why.problem.question3}</span>
                  </li>
                </ul>
                <p className="mt-4 text-red-800 font-medium">
                  {t.about.why.problem.reality}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-green-900 mb-4">
                  {t.about.why.solution.title}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{t.about.why.solution.point1}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{t.about.why.solution.point2}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{t.about.why.solution.point3}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{t.about.why.solution.point4}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What AgroSoluce Is Not */}
        <section className="mb-16 md:mb-24">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-orange-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t.about.whatNot.title}
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              {t.about.whatNot.subtitle}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {t.about.whatNot.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                  <XCircle className="h-6 w-6 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
              <p className="text-lg text-blue-900 font-medium">
                {t.about.whatNot.footer}
              </p>
            </div>
          </div>
        </section>

        {/* Design Principles */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.about.designPrinciples.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.about.designPrinciples.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {designPrinciples.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* One Sentence */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl shadow-lg p-8 md:p-12 text-white text-center">
          <FileText className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <p className="text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed max-w-4xl mx-auto">
            {t.about.oneSentence}
          </p>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cooperatives"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {t.about.cta.explore}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/what-we-do"
              className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {t.about.cta.learnMore}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

