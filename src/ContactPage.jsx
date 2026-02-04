import { Link } from 'react-router-dom';
import { Home } from './Icons';

function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-slate-950 to-black">
      {/* Header Navigation */}
      <div className="bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-indigo-400 transition-colors">
            <Home />
            <span className="font-medium">Back to Map</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-white font-medium">Contact</Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - empty for symmetry with About page */}
          <div></div>
          
          {/* Right: Contact Content */}
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
            <h1 className="text-4xl font-bold text-white mb-6">Get in Touch</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-3">General Inquiries</h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  Have a question or want to learn more about MotionMap?
                </p>
                <a 
                  href="mailto:hello@motionmap.org" 
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  hello@motionmap.org
                </a>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3">Partnerships & Collaborations</h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  Interested in partnering with MotionMap or have a collaboration idea?
                </p>
                <a 
                  href="mailto:partnerships@motionmap.org" 
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  partnerships@motionmap.org
                </a>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3">Technical Support</h2>
                <p className="text-slate-300 leading-relaxed mb-3">
                  Experiencing issues with the platform? Let us know.
                </p>
                <a 
                  href="mailto:hello@motionmap.org" 
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  hello@motionmap.org
                </a>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <p className="text-slate-400 text-sm">
                  We typically respond within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
