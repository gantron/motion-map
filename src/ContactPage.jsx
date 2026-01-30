import { Link } from 'react-router-dom';
import { Home } from './Icons';

function ContactPage() {
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
            <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-white font-medium">Contact</Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700 p-12">
          <h1 className="text-5xl font-bold text-white mb-8">Get in Touch</h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">General Inquiries</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Have a question or want to learn more about Motion-Map?
              </p>
              <a 
                href="mailto:hello@motionmap.org" 
                className="text-indigo-400 hover:text-indigo-300 text-lg font-medium"
              >
                hello@motionmap.org
              </a>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Submit Your Work</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Ready to be featured on Motion-Map?
              </p>
              <Link 
                to="/" 
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-colors"
              >
                Submit Your Work
              </Link>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Partnerships & Collaborations</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Interested in partnering with Motion-Map or featuring your studio?
              </p>
              <a 
                href="mailto:partnerships@motionmap.org" 
                className="text-indigo-400 hover:text-indigo-300 text-lg font-medium"
              >
                partnerships@motionmap.org
              </a>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Follow Us</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Stay updated with the latest featured artists and platform updates.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/motionmapofficial" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Instagram
                </a>
                <a 
                  href="https://twitter.com/motionmaporg" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
