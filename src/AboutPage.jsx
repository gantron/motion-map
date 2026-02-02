import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronLeft, ChevronRight, Globe, Instagram } from './Icons';
import { loadData } from './dataLoader';

function AboutPage() {
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load latest artists
  useEffect(() => {
    loadData().then(data => {
      // Get the most recent month's data
      const allMonths = Object.keys(data.world).sort().reverse();
      const latestMonth = allMonths[0];
      
      if (latestMonth && data.world[latestMonth]) {
        const artists = Object.entries(data.world[latestMonth])
          .map(([code, artist]) => ({ ...artist, code }))
          .slice(0, 5); // Get latest 5 artists
        
        setFeaturedArtists(artists);
      }
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to load featured artists:', error);
      setIsLoading(false);
    });
  }, []);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (featuredArtists.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentArtistIndex(prev => (prev + 1) % featuredArtists.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [featuredArtists.length]);

  const currentArtist = featuredArtists[currentArtistIndex];

  const nextArtist = () => {
    setCurrentArtistIndex((prev) => (prev + 1) % featuredArtists.length);
  };

  const prevArtist = () => {
    setCurrentArtistIndex((prev) => (prev - 1 + featuredArtists.length) % featuredArtists.length);
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
          {/* Left: About Text */}
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
                <Link 
                  to="/" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-colors"
                >
                  Submit Your Work
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Featured Artist Carousel */}
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
            {isLoading ? (
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-slate-400 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading featured artists...</p>
                </div>
              </div>
            ) : featuredArtists.length === 0 ? (
              <div className="h-full flex items-center justify-center p-12">
                <p className="text-slate-400 text-center">No featured artists yet. Check back soon!</p>
              </div>
            ) : (
              <div className="relative h-full">
                {/* Artist Video/Poster */}
                <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-600 relative">
                  {currentArtist?.posterUrl && currentArtist.posterUrl !== '#N/A' && (
                    <img 
                      src={currentArtist.posterUrl} 
                      alt={currentArtist.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Navigation Arrows */}
                  {featuredArtists.length > 1 && (
                    <>
                      <button
                        onClick={prevArtist}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        onClick={nextArtist}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      >
                        <ChevronRight />
                      </button>
                    </>
                  )}
                </div>

                {/* Artist Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{currentArtist?.name}</h3>
                      {currentArtist?.country && (
                        <p className="text-slate-400">
                          {[currentArtist.city, currentArtist.state, currentArtist.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {currentArtistIndex + 1} / {featuredArtists.length}
                    </div>
                  </div>

                  {currentArtist?.bio && (
                    <p className="text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {currentArtist.bio}
                    </p>
                  )}

                  {/* Artist Links */}
                  <div className="flex gap-2">
                    {currentArtist?.videoUrl && currentArtist.videoUrl !== '#N/A' && (
                      <a
                        href={currentArtist.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Watch Video
                      </a>
                    )}
                    {currentArtist?.website && (
                      <a
                        href={currentArtist.website.startsWith('http') ? currentArtist.website : `https://${currentArtist.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        title="Website"
                      >
                        <Globe />
                      </a>
                    )}
                    {currentArtist?.instagram && (
                      <a
                        href={`https://instagram.com/${currentArtist.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        title="Instagram"
                      >
                        <Instagram />
                      </a>
                    )}
                  </div>

                  {/* Dots indicator */}
                  {featuredArtists.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {featuredArtists.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentArtistIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentArtistIndex 
                              ? 'bg-indigo-500' 
                              : 'bg-slate-600 hover:bg-slate-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
