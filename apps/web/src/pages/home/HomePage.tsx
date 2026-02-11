import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Shield, 
  TrendingUp, 
  ArrowRight,
  Users,
  FileText,
  BarChart3,
  Target,
  Zap,
  MapPin,
  Award,
  ClipboardList,
  AlertTriangle,
  Leaf,
  Scale,
  Heart
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { EUDR_COMMODITIES_IN_SCOPE } from '@/types';
import { Button, Card, CardContent, Badge } from '@/components/ui';

export default function HomePage() {
  const { t } = useI18n();
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Split description into carousel items
  const carouselItems = [
    t.landing.carousel.item1,
    t.landing.carousel.item2,
    t.landing.carousel.item3,
  ];

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const outcomes = [
    {
      id: 'buyerConnections',
      icon: TrendingUp,
      iconColor: 'primary',
      title: t.landing.outcomes.buyerConnections.title,
      feature: t.landing.outcomes.buyerConnections.feature,
      outcomes: [
        t.landing.outcomes.buyerConnections.outcome1,
        t.landing.outcomes.buyerConnections.outcome2,
        t.landing.outcomes.buyerConnections.outcome3,
      ],
      cta: t.landing.outcomes.buyerConnections.cta,
      ctaLink: '/buyer',
    },
    {
      id: 'readiness',
      icon: Target,
      iconColor: 'green',
      title: t.landing.outcomes.readiness.title,
      feature: t.landing.outcomes.readiness.feature,
      outcomes: [
        t.landing.outcomes.readiness.outcome1,
        t.landing.outcomes.readiness.outcome2,
        t.landing.outcomes.readiness.outcome3,
      ],
    },
    {
      id: 'coverage',
      icon: BarChart3,
      iconColor: 'blue',
      title: t.landing.outcomes.coverage.title,
      feature: t.landing.outcomes.coverage.feature,
      outcomes: [
        t.landing.outcomes.coverage.outcome1,
        t.landing.outcomes.coverage.outcome2,
        t.landing.outcomes.coverage.outcome3,
      ],
    },
    {
      id: 'assessment',
      icon: ClipboardList,
      iconColor: 'purple',
      title: t.landing.outcomes.assessment.title,
      feature: t.landing.outcomes.assessment.feature,
      outcomes: [
        t.landing.outcomes.assessment.outcome1,
        t.landing.outcomes.assessment.outcome2,
        t.landing.outcomes.assessment.outcome3,
      ],
      cta: t.landing.outcomes.assessment.cta,
      ctaLink: '/assessment',
    },
    {
      id: 'evidence',
      icon: FileText,
      iconColor: 'orange',
      title: t.landing.outcomes.evidence.title,
      feature: t.landing.outcomes.evidence.feature,
      outcomes: [
        t.landing.outcomes.evidence.outcome1,
        t.landing.outcomes.evidence.outcome2,
        t.landing.outcomes.evidence.outcome3,
      ],
    },
    {
      id: 'compliance',
      icon: Shield,
      iconColor: 'red',
      title: t.landing.outcomes.compliance.title,
      feature: t.landing.outcomes.compliance.feature,
      outcomes: [
        t.landing.outcomes.compliance.outcome1,
        t.landing.outcomes.compliance.outcome2,
        t.landing.outcomes.compliance.outcome3,
      ],
      cta: t.landing.outcomes.compliance.cta,
      ctaLink: '/compliance/child-labor',
    },
    {
      id: 'farmersFirst',
      icon: Users,
      iconColor: 'teal',
      title: t.landing.outcomes.farmersFirst.title,
      feature: t.landing.outcomes.farmersFirst.feature,
      outcomes: [
        t.landing.outcomes.farmersFirst.outcome1,
        t.landing.outcomes.farmersFirst.outcome2,
        t.landing.outcomes.farmersFirst.outcome3,
      ],
    },
    {
      id: 'traceability',
      icon: MapPin,
      iconColor: 'indigo',
      title: t.landing.outcomes.traceability.title,
      feature: t.landing.outcomes.traceability.feature,
      outcomes: [
        t.landing.outcomes.traceability.outcome1,
        t.landing.outcomes.traceability.outcome2,
        t.landing.outcomes.traceability.outcome3,
      ],
    },
    {
      id: 'gaps',
      icon: Award,
      iconColor: 'yellow',
      title: t.landing.outcomes.gaps.title,
      feature: t.landing.outcomes.gaps.feature,
      outcomes: [
        t.landing.outcomes.gaps.outcome1,
        t.landing.outcomes.gaps.outcome2,
        t.landing.outcomes.gaps.outcome3,
      ],
    },
  ];

  const getIconBgColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary-100',
      green: 'bg-green-100',
      blue: 'bg-blue-100',
      purple: 'bg-purple-100',
      orange: 'bg-orange-100',
      red: 'bg-red-100',
      teal: 'bg-teal-100',
      indigo: 'bg-indigo-100',
      yellow: 'bg-yellow-100',
    };
    return colors[color] || 'bg-gray-100';
  };

  const getIconTextColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'text-primary-600',
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      teal: 'text-teal-600',
      indigo: 'text-indigo-600',
      yellow: 'text-yellow-600',
    };
    return colors[color] || 'text-gray-600';
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10 bg-no-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-6">
              <Badge variant="primary" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <Zap className="h-4 w-4 mr-2" />
                {t.landing.hero.tagline}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              {t.landing.hero.title}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-4 text-white/95 font-medium">
              {t.landing.heroSubtitle.line1}<br />
              {t.landing.heroSubtitle.line2}
            </p>
            <div className="text-base md:text-lg lg:text-xl mb-10 text-white/85 max-w-3xl mx-auto leading-relaxed px-4 min-h-[4rem] md:min-h-[5rem] flex items-center justify-center">
              <p 
                key={carouselIndex}
                className="animate-fade-in"
              >
                {carouselItems[carouselIndex]}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 px-4">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="group"
              >
                <Link to="/cooperatives">
                  {t.landing.hero.ctaCooperatives}
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="primary"
                size="lg"
                className="group bg-secondary-600 hover:bg-secondary-700 border-2 border-secondary-400"
              >
                <Link to="/buyers">
                  {t.landing.hero.ctaBuyer}
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <p className="text-xs md:text-sm text-white/70 px-4">
              {t.landing.hero.freeNote}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="text-center p-4 md:p-6 bg-primary-50 border-primary-100">
              <CardContent className="p-0">
                <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-600 mb-2">{EUDR_COMMODITIES_IN_SCOPE.length}</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium mb-2">{t.landing.stats.productCategories}</div>
                <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {EUDR_COMMODITIES_IN_SCOPE.map(c => c.label).join(', ')}
                </div>
              </CardContent>
            </Card>
            <Card className="text-center p-4 md:p-6 bg-secondary-50 border-secondary-100">
              <CardContent className="p-0">
                <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-secondary-600 mb-2">31</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium mb-2">{t.landing.stats.regions}</div>
                <div className="text-xs text-gray-500 mt-2">{t.landing.stats.regionsNote}</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4 md:p-6 bg-green-50 border-green-100">
              <CardContent className="p-0">
                <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-600 mb-2">3+</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">{t.landing.stats.complianceFrameworks}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t.landing.quickLinks.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.landing.quickLinks.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="accent" accentColor="primary" className="p-8 hover:shadow-xl transition-all cursor-pointer">
              <Link to="/buyers" className="block">
                <h3 className="text-xl font-bold mb-3 text-gray-900">{t.landing.quickLinks.forBuyers.title}</h3>
                <p className="text-gray-600 mb-4">
                  {t.landing.quickLinks.forBuyers.description}
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center gap-2">
                  {t.landing.quickLinks.forBuyers.learnMore} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Card>
            
            <Card variant="accent" accentColor="success" className="p-8 hover:shadow-xl transition-all cursor-pointer">
              <Link to="/partners" className="block">
                <h3 className="text-xl font-bold mb-3 text-gray-900">{t.landing.quickLinks.forPartners.title}</h3>
                <p className="text-gray-600 mb-4">
                  {t.landing.quickLinks.forPartners.description}
                </p>
                <span className="text-green-600 font-semibold inline-flex items-center gap-2">
                  {t.landing.quickLinks.forPartners.learnMore} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Card>
            
            <Card variant="accent" accentColor="info" className="p-8 hover:shadow-xl transition-all cursor-pointer">
              <Link to="/what-we-do" className="block">
                <h3 className="text-xl font-bold mb-3 text-gray-900">{t.landing.quickLinks.whatWeDo.title}</h3>
                <p className="text-gray-600 mb-4">
                  {t.landing.quickLinks.whatWeDo.description}
                </p>
                <span className="text-blue-600 font-semibold inline-flex items-center gap-2">
                  {t.landing.quickLinks.whatWeDo.learnMore} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Challenges Section - Enhanced Visual Design */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-400 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="mb-6">
              <Badge variant="error" size="lg" className="animate-pulse">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t.landing.challenges.tagline}
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              {t.landing.challenges.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4 leading-relaxed">
              {t.landing.challenges.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Regulatory Pressure */}
            <Card 
              variant="elevated" 
              className="p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden bg-white"
            >
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
              
              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
              
              <CardContent className="p-0 relative z-10">
                {/* Large icon with gradient background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Scale className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors">
                  {t.landing.challenges.regulatory.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base font-medium">
                  {t.landing.challenges.regulatory.description}
                </p>
                
                {/* Visual separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-red-200 to-transparent mb-6"></div>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 group/item">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center group-hover/item:bg-red-200 transition-colors">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                      {t.landing.challenges.regulatory.point1}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center group-hover/item:bg-red-200 transition-colors">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                      {t.landing.challenges.regulatory.point2}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center group-hover/item:bg-red-200 transition-colors">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                      {t.landing.challenges.regulatory.point3}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Environmental Issues */}
            <Card 
              variant="elevated" 
              className="p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden bg-white"
            >
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700"></div>
              
              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
              
              <CardContent className="p-0 relative z-10">
                {/* Large icon with gradient background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors">
                  {t.landing.challenges.environmental.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base font-medium">
                  {t.landing.challenges.environmental.description}
                </p>
                
                {/* Visual separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent mb-6"></div>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 group/item">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center group-hover/item:bg-orange-200 transition-colors">
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                      {t.landing.challenges.environmental.point1}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center group-hover/item:bg-orange-200 transition-colors">
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                      {t.landing.challenges.environmental.point2}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center group-hover/item:bg-orange-200 transition-colors">
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                      {t.landing.challenges.environmental.point3}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Social Challenges */}
            <Card 
              variant="elevated" 
              className="p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden bg-white"
            >
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700"></div>
              
              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full opacity-50 group-hover:opacity-75 transition-opacity"></div>
              
              <CardContent className="p-0 relative z-10">
                {/* Large icon with gradient background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-yellow-600 transition-colors">
                  {t.landing.challenges.social.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base font-medium">
                  {t.landing.challenges.social.description}
                </p>
                
                {/* Visual separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-yellow-200 to-transparent mb-6"></div>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 group/item">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center group-hover/item:bg-yellow-200 transition-colors">
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                      {t.landing.challenges.social.point1}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center group-hover/item:bg-yellow-200 transition-colors">
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                      {t.landing.challenges.social.point2}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center group-hover/item:bg-yellow-200 transition-colors">
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                      {t.landing.challenges.social.point3}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brief Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t.landing.value.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t.landing.value.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {outcomes.slice(0, 5).map((outcome) => {
              const Icon = outcome.icon;
              return (
                <Card 
                  key={outcome.id} 
                  className="bg-gradient-to-br from-white to-gray-50 p-6 hover:shadow-lg transition-all"
                >
                  <CardContent className="p-0">
                    <div className={`${getIconBgColor(outcome.iconColor)} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${getIconTextColor(outcome.iconColor)}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {outcome.title}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center">
            <Link
              to="/what-we-do"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 hover:underline"
            >
              {t.about.cta.learnMore} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-secondary-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10 bg-no-repeat"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Target className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
            {t.landing.cta.title}
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 px-4">
            {t.landing.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="group"
            >
              <Link to="/cooperatives">
                {t.landing.cta.buttonCooperatives}
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="primary"
              size="lg"
              className="group bg-secondary-600 hover:bg-secondary-700 border-2 border-secondary-400"
            >
              <Link to="/buyer">
                {t.landing.cta.buttonBuyer}
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

