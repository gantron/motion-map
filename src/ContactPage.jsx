import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Globe, Instagram } from './Icons';
import { loadData } from './dataLoader';

function ContactPage() {
  const [featuredArtist, setFeaturedArtist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load random featured artist
  useEffect(() => {
    loadData().then(data => {
      // Get all artists from most recent month
      const allMonths = Object.keys(data.world).sort().reverse();
      const latestMonth = allMonths[0];
      
      if (latestMonth && data.world[latestMonth]) {
        const allArtists = Object.entries(data.world[latestMonth])
          .map(([code, artist]) => ({ ...artist, code }));
        
        // Pick random artist with valid poster
        const artistsWithPosters = allArtists.filter(a => 
          a.posterUrl && a.posterUrl !== '#N/A'
        );
        
        if (artistsWithPosters.length > 0) {
          const randomArtist = artistsWithPosters[
            Math.floor(Math.random() * artistsWithPosters.length)
          ];
          setFeaturedArtist(randomArtist);
        }
      }
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to load featured artist:', error);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-slate-950 to-black relative">
      {/* Background Featured Artist */}
      {featuredArtist?.posterUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={featuredArtist.posterUrl} 
            alt=""
            className="w-full h-full object-cover opacity-30 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header Navigation */}
        <div className="bg-slate-950/50 backdrop-blur-sm border-b border-slate-800 p-4">
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

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 p-12">
            <h1 className="text-5xl font-bold text-white mb-8">Get in Touch</h1>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">General Inquiries</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Have a question or want to learn more about MotionMap?
                </p>
                <a 
                  href="mailto:hello@motionmap.org" 
                  className="text-indigo-400 hover:text-indigo-300 text-lg font-medium transition-colors"
                >
                  hello@motionmap.org
                </a>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Submit Your Work</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Ready to be featured on MotionMap?
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
                  Interested in partnering with MotionMap or featuring your studio?
                </p>
                <a 
                  href="mailto:partnerships@motionmap.org" 
                  className="text-indigo-400 hover:text-indigo-300 text-lg font-medium transition-colors"
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
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <Instagram />
                    <span>Instagram</span>
                  </a>
                  <a 
                    href="https://twitter.com/motionmaporg" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <Globe />
                    <span>Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Artist Credit */}
          {featuredArtist && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Featured artwork by{' '}
                <span className="text-slate-400 font-medium">{featuredArtist.name}</span>
                {featuredArtist.country && (
                  <span className="text-slate-600">
                    {' '}from {featuredArtist.country}
                  </span>
                )}
              </p>
              {(featuredArtist.instagram || featuredArtist.website) && (
                <div className="flex justify-center gap-3 mt-2">
                  {featuredArtist.instagram && (
                    <a
                      href={`https://instagram.com/${featuredArtist.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-indigo-400 transition-colors text-xs"
                    >
                      @{featuredArtist.instagram.replace('@', '')}
                    </a>
                  )}
                  {featuredArtist.website && (
                    <a
                      href={featuredArtist.website.startsWith('http') ? featuredArtist.website : `https://${featuredArtist.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-indigo-400 transition-colors text-xs"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
