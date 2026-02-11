import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import { isSupabaseConfigured, getSupabaseConfigStatus } from './lib/supabase';

// Lazy load all route components for code splitting
const HomePage = lazy(() => import('./pages/home/HomePage'));
const CooperativeDirectory = lazy(() => import('./pages/marketplace/CooperativeDirectory'));
const CooperativeProfile = lazy(() => import('./pages/marketplace/CooperativeProfile'));
const BuyerPortal = lazy(() => import('./pages/buyer/BuyerPortal'));
const BuyerRequestForm = lazy(() => import('./pages/buyer/BuyerRequestForm'));
const BuyerMatches = lazy(() => import('./pages/buyer/BuyerMatches'));
const BuyerLandingPage = lazy(() => import('./pages/buyer/BuyerLandingPage'));
const AboutPage = lazy(() => import('./pages/about/AboutPage'));
const WhatWeDoPage = lazy(() => import('./pages/about/WhatWeDoPage'));
const WhoItsForPage = lazy(() => import('./pages/about/WhoItsForPage'));
const PartnerLandingPage = lazy(() => import('./pages/partners/PartnerLandingPage'));
const CooperativeDashboard = lazy(() => import('./pages/cooperative/CooperativeDashboard'));
const FarmersFirstDashboard = lazy(() => import('./pages/cooperative/FarmersFirstDashboard'));
const DirectoryPage = lazy(() => import('./pages/directory/DirectoryPage'));
const DirectoryDetailPage = lazy(() => import('./pages/directory/DirectoryDetailPage'));
const CooperativeWorkspace = lazy(() => import('./pages/workspace/CooperativeWorkspace'));
const PilotListingPage = lazy(() => import('./pages/pilot/PilotListingPage'));
const PilotDashboardPage = lazy(() => import('./pages/pilot/PilotDashboardPage'));
const FarmerProtectionPage = lazy(() => import('./pages/principles/FarmerProtectionPage'));
const RegulatoryReferencesPage = lazy(() => import('./pages/regulatory/RegulatoryReferencesPage'));
const NGORegistryPage = lazy(() => import('./pages/references/NGORegistryPage'));
const DueCarePrinciplesPage = lazy(() => import('./pages/governance/DueCarePrinciplesPage'));
const ChildLaborDashboard = lazy(() => import('./components/compliance').then(m => ({ default: m.ChildLaborDashboard })));
const AssessmentForm = lazy(() => import('./components/compliance').then(m => ({ default: m.AssessmentForm })));
const AssessmentPage = lazy(() => import('./pages/assessment'));
const MonitoringPage = lazy(() => import('./pages/monitoring/MonitoringPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  // Check Supabase configuration on app startup
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const configStatus = getSupabaseConfigStatus();
      console.warn(
        '⚠️ AgroSoluce: Supabase is not configured.\n' +
        `Configuration: URL=${configStatus.urlConfigured ? '✓' : '✗'}, ` +
        `Key=${configStatus.keyConfigured ? '✓' : '✗'}\n` +
        'Database features will not be available. ' +
        'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
      );
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-secondary-50 dark:from-gray-900 via-primary-50 dark:via-gray-900 to-white dark:to-gray-800">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cooperatives" element={<CooperativeDirectory />} />
            <Route path="/cooperatives/:id" element={<CooperativeProfile />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/directory/:coop_id" element={<DirectoryDetailPage />} />
            <Route path="/workspace/:coop_id" element={<CooperativeWorkspace />} />
            <Route path="/pilot" element={<PilotListingPage />} />
            <Route path="/pilot/:pilot_id" element={<PilotDashboardPage />} />
            <Route path="/buyers" element={<BuyerLandingPage />} />
            <Route path="/buyer" element={<BuyerPortal />} />
            <Route path="/buyer/request" element={<BuyerRequestForm />} />
            <Route path="/buyer/requests/:requestId/matches" element={<BuyerMatches />} />
            <Route path="/buyer/*" element={<BuyerPortal />} />
            <Route path="/partners" element={<PartnerLandingPage />} />
            <Route path="/ngos" element={<PartnerLandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/what-we-do" element={<WhatWeDoPage />} />
            <Route path="/who-its-for" element={<WhoItsForPage />} />
            <Route path="/cooperative/*" element={<CooperativeDashboard />} />
            <Route path="/cooperative/:id/farmers-first" element={<FarmersFirstDashboard />} />
            <Route path="/principles/farmer-protection" element={<FarmerProtectionPage />} />
            <Route path="/regulatory-references" element={<RegulatoryReferencesPage />} />
            <Route path="/references/ngo" element={<NGORegistryPage />} />
            <Route path="/governance/due-care" element={<DueCarePrinciplesPage />} />
            <Route
              path="/monitoring"
              element={
                <ErrorBoundary>
                  <MonitoringPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/compliance/child-labor"
              element={
                <ErrorBoundary>
                  <ChildLaborDashboard />
                </ErrorBoundary>
              }
            />
            <Route
              path="/compliance/assessments/new"
              element={
                <ErrorBoundary>
                  <AssessmentForm />
                </ErrorBoundary>
              }
            />
            <Route
              path="/compliance/assessments/:id/edit"
              element={
                <ErrorBoundary>
                  <AssessmentForm />
                </ErrorBoundary>
              }
            />
            <Route
              path="/assessment/:coop_id?"
              element={
                <ErrorBoundary>
                  <AssessmentPage />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

