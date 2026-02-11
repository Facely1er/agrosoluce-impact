import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-primary-50 to-white">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
            <Link
              to="/directory"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Browse Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

