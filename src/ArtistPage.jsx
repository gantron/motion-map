import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadData } from './dataLoader';
import { Globe, Instagram, Home } from './Icons';

function ArtistPage() {
  const { slug } = useParams();
  const [artist, setArtist] = useState(null);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData().then(data => {
      // Find artist by slug across all months and locations
      let foundArtist = null;
      const submissions = [];

      // Search through all data
      Object.entries(data.world || {}).forEach(([month, artists]) => {
        Object.entries(artists).forEach(([code, artistData]) => {
          const artistSlug = generateSlug(artistData.name);
          if (artistSlug === slug) {
            if (!foundArtist) {
              foundArtist = { ...artistData, code, slug: artistSlug };
            }
            submissions.push({
              ...artistData,
              month,
              code
            });
          }
        });
      });

      // Also search countries and states
      Object.entries(data.countries || {}).forEach(([country, months]) => {
        Object.entries(months).forEach(([month, artists]) => {
          Object.entries(artists).forEach(([code, artistData]) => {
            const artistSlug = generateSlug(artistData.name);
            if (artistSlug === slug && !submissions.find(s => s.month === month)) {
              if (!foundArtist) {
                foundArtist = { ...artistData, code, slug: artistSlug };
              }
              submissions.push({
                ...artistData,
                month,
                code
              });
            }
          });
        });
      });

      Object.entries(data.states || {}).forEach(([state, months]) => {
        Object.entries(months).forEach(([month, artists]) => {
          Object.entries(artists).forEach(([code, artistData]) => {
            const artistSlug = generateSlug(artistData.name);
            if (artistSlug === slug && !submissions.find(s => s.month === month)) {
              if (!foundArtist) {
                foundArtist = { ...artistData, code, slug: artistSlug };
              }
              submissions.push({
                ...artistData,
                month,
                code
              });
            }
          });
        });
      });

      // Sort submissions by month (newest first)
      submissions.sort((a, b) => b.month.localeCompare(a.month));

      setArtist(foundArtist);
      setAllSubmissions(submissions);
      setIsLoading(false);
    });
  }, [slug]);

  // Generate slug from name (same logic as backend)
  const generateSlug = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .trim();
  };

  // Format month for display
  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading artist...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Artist not found</div>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Back to Map
          </Link>
        </div>
      </div>
    );
  }

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
            <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Banner Image */}
      <div className="w-full h-96 relative overflow-hidden">
        {artist.posterUrl ? (
          <img 
            src={artist.posterUrl} 
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Artist Info */}
      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
          <h1 className="text-4xl font-bold text-white mb-2">{artist.name}</h1>
          {artist.country && (
            <p className="text-xl text-slate-300 mb-6">
              {[artist.city, artist.state, artist.country].filter(Boolean).join(', ')}
            </p>
          )}

          {artist.bio && (
            <p className="text-slate-300 leading-relaxed mb-6">{artist.bio}</p>
          )}

          {/* Links */}
          <div className="flex gap-3 mb-6">
            {artist.website && (
              <a
                href={artist.website.startsWith('http') ? artist.website : `https://${artist.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Globe />
                <span className="text-sm">Website</span>
              </a>
            )}
            {artist.instagram && (
              <a
                href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors"
              >
                <Instagram />
                <span className="text-sm">Instagram</span>
              </a>
            )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied!');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Submissions Grid */}
        {allSubmissions.length > 0 && (
          <div className="mt-12 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Submissions ({allSubmissions.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allSubmissions.map((submission, index) => (
                <div
                  key={`${submission.month}-${index}`}
                  className="aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-indigo-500 transition-colors cursor-pointer group"
                >
                  {submission.posterUrl ? (
                    <img 
                      src={submission.posterUrl} 
                      alt={`${submission.name} - ${formatMonth(submission.month)}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm">{formatMonth(submission.month)}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">{formatMonth(submission.month)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtistPage;
