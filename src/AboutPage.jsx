import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home } from './Icons';
import { loadData } from './dataLoader';

function AboutPage() {
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleSubmitClick = () => {
    // Navigate to home page with submission form trigger
    navigate('/?openSubmit=true');
  };

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
            <Link to="/about" className="text-white font-medium">About</Link>
            <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* LEFT: Featured Artists Grid (2x3) - No Container */}
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

          {/* RIGHT: About Text */}
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
            <h1 className="text-4xl font-bold text-white mb-6">About MotionMap</h1>
            
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                MotionMap is a visual platform celebrating motion designers and animators from around the world.
              </p>

              <div>
                <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
                <p className="text-slate-300 leading-relaxed">
                  We believe in making motion design more discoverable and accessible. By mapping artists geographically, 
                  we create connections between creators and their communities while showcasing the global reach of motion design.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3">How It Works</h2>
                <p className="text-slate-300 leading-relaxed">
                  Each month, artists from around the world submit their work to be featured on MotionMap. 
                  Explore the map to discover new artists, dive into countries and states to see local talent, 
                  and visit individual artist pages to see their complete portfolio of submissions.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-3">Get Featured</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Are you a motion designer or animator? Submit your work to be featured on MotionMap.
                </p>
                <button 
                  onClick={handleSubmitClick}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-colors"
                >
                  Submit Your Work
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
