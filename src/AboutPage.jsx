import { Link } from 'react-router-dom';
import { Home } from './Icons';

function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-slate-950 to-black">
      {/* Header Navigation */}
      <div className="bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-indigo-400 transition-colors">
            <Home />
            <span className="font-medium">Back to Map</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/about" className="text-white font-medium">About</Link>
            <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700 p-12">
          <h1 className="text-5xl font-bold text-white mb-8">About Motion-Map</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-6">
              Motion-Map is a visual platform celebrating motion designers and animators from around the world.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              We believe in making motion design more discoverable and accessible. By mapping artists geographically, 
              we create connections between creators and their communities while showcasing the global reach of motion design.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">How It Works</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Each month, artists from around the world submit their work to be featured on Motion-Map. 
              Explore the map to discover new artists, dive into countries and states to see local talent, 
              and visit individual artist pages to see their complete portfolio of submissions.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Get Featured</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Are you a motion designer or animator? Submit your work to be featured on Motion-Map. 
              Click "Submit Your Work" on the main map to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
