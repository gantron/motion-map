import { Link, useNavigate } from 'react-router-dom';
import { Home } from './Icons';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center p-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-2xl w-full text-center">
        {/* 404 Artwork */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/404-artwork.png" 
            alt="404 Error" 
            className="w-64 h-64 object-contain animate-fadeIn"
            onError={(e) => {
              // Fallback if image doesn't load
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Error Message */}
        <div className="mb-8 animate-slideUp">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-xl text-slate-400 mb-4">
            We couldn't find what you're looking for.
          </p>
          <p className="text-slate-500">
            The page you're trying to reach doesn't exist or may have been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-colors"
          >
            <Home />
            <span>Back to Map</span>
          </Link>
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Go Back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Looking for something specific?</h3>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Explore Artists
            </Link>
            <span className="text-slate-600">•</span>
            <Link to="/about" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              About Motion-Map
            </Link>
            <span className="text-slate-600">•</span>
            <Link to="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-slate-500 text-sm">
          <p>
            If you think this is an error, please{' '}
            <Link to="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              let us know
            </Link>
            .
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out 0.2s backwards;
        }
      `}</style>
    </div>
  );
}

export default NotFound;
