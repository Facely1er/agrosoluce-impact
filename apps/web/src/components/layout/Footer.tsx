import { Link } from 'react-router-dom';
import { Mail, UsersRound, Briefcase, Shield, Scale, Info, FileText, Users, Building2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity group mb-4"
            >
              <img 
                src="/agrosoluce.png" 
                alt={t.footer.logoAlt} 
                className="h-12 w-auto transition-transform group-hover:scale-105"
              />
              <div>
                <h2 className="text-primary-600 dark:text-primary-400 font-bold text-lg leading-tight">AgroSoluce™</h2>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight">{t.footer.sourceIntelligence}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{t.footer.byErmits}</p>
              </div>
            </Link>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{t.footer.navigation}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link 
                  to="/cooperatives" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <UsersRound className="h-3 w-3" />
                  {t.nav.cooperatives}
                </Link>
              </li>
              <li>
                <Link 
                  to="/buyers" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Briefcase className="h-3 w-3" />
                  {t.nav.buyers}
                </Link>
              </li>
              <li>
                <Link 
                  to="/partners" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  {t.footer.partners}
                </Link>
              </li>
              <li>
                <Link 
                  to="/cooperative" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Building2 className="h-3 w-3" />
                  {t.nav.cooperativeSpace}
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{t.footer.about}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Info className="h-3 w-3" />
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link 
                  to="/what-we-do" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" />
                  {t.footer.whatWeDo}
                </Link>
              </li>
              <li>
                <Link 
                  to="/who-its-for" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  {t.footer.whoItsFor}
                </Link>
              </li>
              <li>
                <Link 
                  to="/principles/farmer-protection" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Scale className="h-3 w-3" />
                  {t.footer.principles}
                </Link>
              </li>
              <li>
                <Link 
                  to="/regulatory-references" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" />
                  {t.footer.regulatoryReferences}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Compliance */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{t.footer.resources}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/compliance/child-labor" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  {t.nav.compliance}
                </Link>
              </li>
              <li>
                <Link 
                  to="/directory" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Building2 className="h-3 w-3" />
                  {t.footer.directory}
                </Link>
              </li>
              <li>
                <Link 
                  to="/references/ngo" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" />
                  {t.footer.ngoRegistry}
                </Link>
              </li>
              <li>
                <Link 
                  to="/governance/due-care" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Scale className="h-3 w-3" />
                  {t.footer.dueCarePrinciples}
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:contact@agrosoluce.ci" 
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" />
                  {t.footer.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} ERMITS LLC. {t.footer.copyright}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center md:text-right">
              <span className="text-gray-400 dark:text-gray-500">AgroSoluce™</span> - {t.footer.description}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

