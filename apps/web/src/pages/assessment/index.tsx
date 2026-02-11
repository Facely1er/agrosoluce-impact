import { useParams } from 'react-router-dom';
import { AssessmentFlow } from '@/components/assessment';

export default function AssessmentPage() {
  const { coop_id } = useParams<{ coop_id?: string }>();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <AssessmentFlow cooperativeId={coop_id} />
    </div>
  );
}

