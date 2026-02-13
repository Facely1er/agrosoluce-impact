import { useParams } from 'react-router-dom';
import { AssessmentFlow } from '@/components/assessment';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import PageHeader from '@/components/layout/PageHeader';
import { ClipboardList } from 'lucide-react';

export default function AssessmentPage() {
  const { coop_id } = useParams<{ coop_id?: string }>();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 dark:from-gray-900 via-primary-50 dark:via-gray-900 to-white dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Compliance', path: '/monitoring' },
          { label: 'Self-Assessment', path: '/assessment' }
        ]} />
        <PageHeader
          badge="Farmers First • 100% Free"
          icon={ClipboardList}
          title="Cocoa Self-Assessment"
          subtitle="Cocoa supply-chain self-assessment for documentation and readiness. Self-reported only; non-certifying. Complements health and compliance monitoring for due diligence."
        />
        <AssessmentFlow cooperativeId={coop_id} />
      </div>
    </div>
  );
}

