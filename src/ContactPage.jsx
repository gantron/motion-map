import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from './Icons';
import { loadData } from './dataLoader';

function ContactPage() {
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate slug from artist name
  const generateSlug = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .trim();
  };

  // Load latest 6 artists for 2x3 grid
  useEffect(() => {
    loadData().then(data => {
      // Get the most recent month's data
      const allMonths = Object.keys(data.world).sort().reverse();
      const latestMonth = allMonths[0];
      
      if (latestMonth && data.world[latestMonth]) {
        const artists = Object.entries(data.world[latestMonth])
          .map(([code, artist]) => ({ ...artist, code }))
          .slice(0, 6); // Get latest 6 artists for 2x3 grid
        
        setFeaturedArtists(artists);
      }
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to load featured artists:', error);
      setIsLoading(false);
    });
  }, []);

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
          {/* LEFT: Featured Artists Grid (2x3) */}
          <div>
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-slate-400 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading artists...</p>
                </div>
              </div>
            ) : featuredArtists.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                <p className="text-slate-400 text-center">No featured artists yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {featuredArtists.map((artist) => (
                  <Link
                    key={artist.code}
                    to={`/artist/${generateSlug(artist.name)}`}
                    className="group relative aspect-square bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-400 transition-all"
                  >
                    {/* Artist Image */}
                    {artist.posterUrl && artist.posterUrl !== '#N/A' && (
                      <img 
                        src={artist.posterUrl} 
                        alt={artist.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-bold text-sm mb-0.5">{artist.name}</h3>
                        {artist.country && (
                          <p className="text-slate-300 text-xs">
                            {[artist.city, artist.country].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
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
