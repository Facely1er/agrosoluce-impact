import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  CheckCircle,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { OnboardingWizard, OnboardingProgress } from '@/features/onboarding/components';
import { SatisfactionSurvey, FeedbackForm } from '@/features/feedback/components';
import { BaselineAssessment, MonthlyProgressReport, ImpactDashboard } from '@/features/value-tracking/components';
import { TrainingList } from '@/features/training/components';
import { getFarmersFirstSummary } from '@/features/farmers/api/farmersFirstApi';
import type { FarmersFirstSummary } from '@/features/farmers/api/farmersFirstApi';

interface FarmersFirstDashboardProps {
  cooperativeId?: string; // Optional prop for when used as embedded component
}

export default function FarmersFirstDashboard({ cooperativeId: propCooperativeId }: FarmersFirstDashboardProps = {}) {
  const { id: paramCooperativeId } = useParams<{ id: string }>();
  const cooperativeId = propCooperativeId || paramCooperativeId;
  const [activeTab, setActiveTab] = useState<'overview' | 'onboarding' | 'baseline' | 'survey' | 'training' | 'progress' | 'impact' | 'feedback'>('overview');
  const [summary, setSummary] = useState<FarmersFirstSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooperativeId) {
      loadSummary();
    }
  }, [cooperativeId]);

  const loadSummary = async () => {
    if (!cooperativeId) return;
    
    setLoading(true);
    setError(null);
    
    const result = await getFarmersFirstSummary(cooperativeId);
    
    if (result.error) {
      setError(result.error.message);
    } else {
      setSummary(result.data);
    }
    
    setLoading(false);
  };

  if (!cooperativeId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cooperative ID is required</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-primary-500">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Farmers First Dashboard
          </h1>
          <p className="text-gray-600">
            Outils et ressources pour maximiser l'impact d'AgroSoluce
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="inline h-4 w-4 mr-2" />
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('onboarding')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'onboarding'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="inline h-4 w-4 mr-2" />
                Onboarding
              </button>
              <button
                onClick={() => setActiveTab('baseline')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'baseline'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="inline h-4 w-4 mr-2" />
                Évaluation de Base
              </button>
              <button
                onClick={() => setActiveTab('survey')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'survey'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="inline h-4 w-4 mr-2" />
                Enquête de Satisfaction
              </button>
              <button
                onClick={() => setActiveTab('training')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'training'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="inline h-4 w-4 mr-2" />
                Formation
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'progress'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="inline h-4 w-4 mr-2" />
                Progrès Mensuel
              </button>
              <button
                onClick={() => setActiveTab('impact')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'impact'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="inline h-4 w-4 mr-2" />
                Impact
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'feedback'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="inline h-4 w-4 mr-2" />
                Feedback
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Summary Tiles */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-5 w-5" />
                      <p>Error loading summary: {error}</p>
                    </div>
                    <button
                      onClick={loadSummary}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : summary ? (
                  <>
                    {/* Empty State: No farmers */}
                    {summary.totalFarmers === 0 ? (
                      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No farmers onboarded yet</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Start onboarding farmers to track their progress and impact.
                        </p>
                        <button
                          onClick={() => setActiveTab('onboarding')}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Start onboarding farmers
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Onboarding Coverage Tile */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <Users className="h-6 w-6 text-blue-600" />
                            <h3 className="text-sm font-medium text-gray-600">Onboarding Coverage</h3>
                          </div>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {summary.farmersOnboarded} / {summary.totalFarmers}
                          </div>
                          <div className="text-sm text-gray-600">
                            {summary.onboardingCoveragePercentage.toFixed(1)}% coverage
                          </div>
                        </div>

                    {/* Declarations Coverage Tile */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <h3 className="text-sm font-medium text-gray-600">Declarations Coverage</h3>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {summary.farmersWithDeclarations} / {summary.totalFarmers}
                      </div>
                      <div className="text-sm text-gray-600">
                        {summary.declarationsCoveragePercentage.toFixed(1)}% coverage
                      </div>
                      {summary.totalDeclarations === 0 && summary.totalFarmers > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-yellow-600">Declarations missing</p>
                        </div>
                      )}
                    </div>

                    {/* Training Coverage Tile */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                        <h3 className="text-sm font-medium text-gray-600">Training Coverage</h3>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {summary.completedTrainingSessions} / {summary.totalTrainingSessions}
                      </div>
                      <div className="text-sm text-gray-600">
                        {summary.trainingCoveragePercentage.toFixed(1)}% completed
                      </div>
                      {summary.totalTrainingSessions === 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">No training sessions yet</p>
                        </div>
                      )}
                    </div>

                    {/* Impact Tracking Tile */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <BarChart3 className="h-6 w-6 text-orange-600" />
                        <h3 className="text-sm font-medium text-gray-600">Impact Tracking</h3>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {summary.impactDataPoints}
                      </div>
                      <div className="text-sm text-gray-600">
                        {summary.hasBaseline ? 'Baseline set' : 'No baseline'}
                      </div>
                      {summary.impactDataPoints === 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">No progress data yet</p>
                        </div>
                      )}
                    </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="h-5 w-5" />
                      <p>No summary data available</p>
                    </div>
                  </div>
                )}

                {/* Onboarding Progress */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Progrès de l'Onboarding</h2>
                  <OnboardingProgress cooperativeId={cooperativeId} />
                </div>

                {/* Impact Dashboard Preview */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact d'AgroSoluce</h2>
                  <ImpactDashboard cooperativeId={cooperativeId} />
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions Rapides</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('onboarding')}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Onboarding</h3>
                      </div>
                      <p className="text-sm text-blue-700">
                        Complétez votre processus d'onboarding
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab('training')}
                      className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-6 w-6 text-green-600" />
                        <h3 className="font-semibold text-green-900">Formation</h3>
                      </div>
                      <p className="text-sm text-green-700">
                        Accédez aux modules de formation
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab('progress')}
                      className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                        <h3 className="font-semibold text-purple-900">Progrès Mensuel</h3>
                      </div>
                      <p className="text-sm text-purple-700">
                        Soumettez votre rapport mensuel
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab('survey')}
                      className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="h-6 w-6 text-orange-600" />
                        <h3 className="font-semibold text-orange-900">Enquête</h3>
                      </div>
                      <p className="text-sm text-orange-700">
                        Complétez l'enquête de satisfaction
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'onboarding' && (
              <div>
                <OnboardingWizard 
                  cooperativeId={cooperativeId}
                  onComplete={() => {
                    setActiveTab('overview');
                  }}
                />
              </div>
            )}

            {activeTab === 'baseline' && (
              <div>
                <BaselineAssessment 
                  cooperativeId={cooperativeId}
                  onComplete={() => {
                    setActiveTab('overview');
                  }}
                />
              </div>
            )}

            {activeTab === 'survey' && (
              <div>
                <SatisfactionSurvey 
                  cooperativeId={cooperativeId}
                  onComplete={() => {
                    setActiveTab('overview');
                  }}
                />
              </div>
            )}

            {activeTab === 'training' && (
              <div>
                <TrainingList cooperativeId={cooperativeId} />
              </div>
            )}

            {activeTab === 'progress' && (
              <div>
                <MonthlyProgressReport 
                  cooperativeId={cooperativeId}
                  onComplete={() => {
                    setActiveTab('overview');
                  }}
                />
              </div>
            )}

            {activeTab === 'impact' && (
              <div>
                <ImpactDashboard cooperativeId={cooperativeId} />
              </div>
            )}

            {activeTab === 'feedback' && (
              <div>
                <FeedbackForm 
                  cooperativeId={cooperativeId}
                  onComplete={() => {
                    setActiveTab('overview');
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

