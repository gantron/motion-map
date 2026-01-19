import { useState, useRef, useEffect } from 'react';
import {
  X, Calendar, Globe, Instagram, ChevronLeft, ChevronRight,
  Map, Grid, Home
} from './Icons';
import { loadData, getAvailableMonths } from './dataLoader';

function App() {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [viewMode, setViewMode] = useState('map');
  const [zoomLevel, setZoomLevel] = useState('world');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [sheetData, setSheetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRefs = useRef({});

  // Fallback demo data (used if Google Sheets not configured)
  const demoData = {
    world: {
      '2026-01': {
        'USA': {
          name: 'Zan Gantt',
          country: 'USA',
          region: 'North America',
          bio: 'Motion designer representing the United States.',
          website: 'zan.blue',
          instagram: '@zangantt',
          videoUrl: null,
          posterUrl: null,
          monthsActive: 1
        },
        'Japan': {
          name: 'Zan Gantt',
          country: 'Japan',
          region: 'Asia',
          bio: 'Motion designer representing Japan.',
          website: 'zan.blue',
          instagram: '@zangantt',
          videoUrl: null,
          posterUrl: null,
          monthsActive: 1
        },
        'UK': {
          name: 'Zan Gantt',
          country: 'UK',
          region: 'Europe',
          bio: 'Motion designer representing the UK.',
          website: 'zan.blue',
          instagram: '@zangantt',
          videoUrl: null,
          posterUrl: null,
          monthsActive: 1
        }
      }
    },
    countries: {
      'USA': {
        '2026-01': {
          'CA': {
            name: 'Zan Gantt',
            state: 'California',
            country: 'USA',
            bio: 'Motion designer.',
            website: 'zan.blue',
            instagram: '@zangantt',
            videoUrl: null,
            posterUrl: null,
            monthsActive: 1
          },
          'NY': {
            name: 'Zan Gantt',
            state: 'New York',
            country: 'USA',
            bio: 'Motion designer.',
            website: 'zan.blue',
            instagram: '@zangantt',
            videoUrl: null,
            posterUrl: null,
            monthsActive: 1
          },
          'TX': {
            name: 'Zan Gantt',
            state: 'Texas',
            country: 'USA',
            bio: 'Motion designer.',
            website: 'zan.blue',
            instagram: '@zangantt',
            videoUrl: null,
            posterUrl: null,
            monthsActive: 1
          },
          'FL': {
            name: 'Zan Gantt',
            state: 'Florida',
            country: 'USA',
            bio: 'Motion designer.',
            website: 'zan.blue',
            instagram: '@zangantt',
            videoUrl: null,
            posterUrl: null,
            monthsActive: 1
          },
          'WA': {
            name: 'Zan Gantt',
            state: 'Washington',
            country: 'USA',
            bio: 'Motion designer.',
            website: 'zan.blue',
            instagram: '@zangantt',
            videoUrl: null,
            posterUrl: null,
            monthsActive: 1
          }
        }
      }
    }
  };

  // Load data from Google Sheets on mount
  useEffect(() => {
    loadData().then(data => {
      // Check if we got real data or empty data
      const hasData = Object.keys(data.world).length > 0 || Object.keys(data.countries).length > 0;
      setSheetData(hasData ? data : demoData);
      setIsLoading(false);
    });
  }, []);

  const worldGrid = {
    'Canada': [0, 3],
    'Russia': [0, 7],
    'USA': [1, 3],
    'Europe': [1, 6],
    'China': [1, 8],
    'Japan': [1, 9],
    'Korea': [1, 10],
    'Mexico': [2, 3],
    'Middle East': [2, 6],
    'India': [2, 8],
    'Central America': [3, 3],
    'Africa': [3, 5],
    'Southeast Asia': [3, 8],
    'South America': [4, 3],
    'Australia': [5, 9]
  };

  const usStatesMapGrid = {
    'WA': [0, 0], 'ME': [0, 11],
    'OR': [1, 0], 'ID': [1, 1], 'MT': [1, 2], 'ND': [1, 3], 'MN': [1, 4], 'WI': [1, 5], 'MI': [1, 6], 'VT': [1, 9], 'NH': [1, 10],
    'CA': [2, 0], 'NV': [2, 1], 'WY': [2, 2], 'SD': [2, 3], 'IA': [2, 4], 'IL': [2, 5], 'IN': [2, 6], 'OH': [2, 7], 'PA': [2, 8], 'NY': [2, 9], 'MA': [2, 10], 'CT': [2, 11], 'RI': [2, 12],
    'UT': [3, 1], 'CO': [3, 2], 'NE': [3, 3], 'MO': [3, 4], 'KY': [3, 5], 'WV': [3, 6], 'VA': [3, 7], 'MD': [3, 8], 'DE': [3, 9], 'NJ': [3, 10],
    'AZ': [4, 3], 'NM': [4, 4], 'KS': [4, 5], 'AR': [4, 6], 'TN': [4, 7], 'NC': [4, 8],
    'OK': [5, 3], 'LA': [5, 4], 'MS': [5, 5], 'AL': [5, 6], 'GA': [5, 7], 'SC': [5, 8],
    'TX': [6, 4], 'FL': [6, 9],
    'AK': [8, 0], 'HI': [8, 1]
  };

  const stateNames = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
  };

  const generateGridLayout = (items) => {
    const cols = Math.ceil(Math.sqrt(items.length * 1.5));
    const grid = {};
    items.forEach((item, i) => {
      grid[item] = [Math.floor(i / cols), i % cols];
    });
    return grid;
  };

  // Use loaded data or show loading state
  const activeData = sheetData || demoData;
  const monthsArchive = sheetData ? getAvailableMonths(sheetData) : [{ month: 'January', year: 2026, key: '2026-01' }];
  const currentMonth = monthsArchive[currentMonthIndex];
  const currentMonthKey = currentMonth?.key || '2026-01';
  
  const currentData = zoomLevel === 'world'
    ? (activeData.world[currentMonthKey] || {})
    : (activeData.countries[selectedRegion]?.[currentMonthKey] || {});

  const getCurrentGrid = () => {
    if (zoomLevel === 'world') {
      return viewMode === 'grid' ? generateGridLayout(Object.keys(worldGrid)) : worldGrid;
    } else if (selectedRegion === 'USA') {
      return viewMode === 'grid' ? generateGridLayout(Object.keys(usStatesMapGrid)) : usStatesMapGrid;
    }
    return {};
  };

  const currentGrid = getCurrentGrid();

  useEffect(() => {
    Object.values(videoRefs.current).forEach(v => {
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });
    if (hoveredState && videoRefs.current[hoveredState]) {
      videoRefs.current[hoveredState].play();
    }
  }, [hoveredState]);

  // Handle window resize for responsive grid
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = (code) => {
    if (zoomLevel === 'world' && currentData[code]) {
      if (activeData.countries[code]) {
        setSelectedRegion(code);
        setZoomLevel('country');
        setCurrentMonthIndex(0);
        setHoveredState(null);
      } else {
        setSelectedArtist({ ...currentData[code], code });
      }
    } else if (currentData[code]) {
      setSelectedArtist({ ...currentData[code], code });
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel === 'country') {
      setZoomLevel('world');
      setSelectedRegion(null);
      setCurrentMonthIndex(0);
      setHoveredState(null);
    }
  };

  const closeModal = () => setSelectedArtist(null);

  const navigateMonth = (dir) => {
    const newIdx = currentMonthIndex + dir;
    if (newIdx >= 0 && newIdx < monthsArchive.length) {
      setCurrentMonthIndex(newIdx);
      setHoveredState(null);
    }
  };

  const getGridDimensions = () => {
    // Responsive cell sizes based on screen width
    const screenWidth = window.innerWidth;
    let cellSize, gap;
    
    if (screenWidth < 640) {
      // Mobile: smaller boxes
      cellSize = 50;
      gap = 4;
    } else if (screenWidth < 1024) {
      // Tablet: medium boxes
      cellSize = 80;
      gap = 6;
    } else {
      // Desktop: larger boxes
      cellSize = 100;
      gap = 8;
    }
    
    if (Object.keys(currentGrid).length === 0) {
      return { width: 800, height: 600, cellSize, gap };
    }
    
    const positions = Object.values(currentGrid);
    const maxRow = Math.max(...positions.map(p => p[0]));
    const maxCol = Math.max(...positions.map(p => p[1]));
    
    return {
      width: (maxCol + 1) * (cellSize + gap),
      height: (maxRow + 1) * (cellSize + gap),
      cellSize,
      gap
    };
  };

  const { width: gridWidth, height: gridHeight, cellSize, gap } = getGridDimensions();

  // Show loading indicator while data is being fetched
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎬</div>
          <div className="text-white text-xl font-bold mb-2">Motion-Map</div>
          <div className="text-slate-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Motion-Map</h1>
              <p className="text-slate-400 text-sm">
                {zoomLevel === 'world' ? 'Discover artists around the world' : `Exploring ${selectedRegion}`}
              </p>
            </div>
            {zoomLevel === 'country' && (
              <button
                onClick={handleZoomOut}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
              >
                <Home />
                World View
              </button>
            )}
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex gap-1 bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'map' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Map />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid />
              </button>
            </div>
            <button
              onClick={() => navigateMonth(-1)}
              disabled={currentMonthIndex === 0}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white rounded-lg"
            >
              <ChevronLeft />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg">
              <Calendar />
              <span className="text-sm font-medium">{currentMonth.month} {currentMonth.year}</span>
            </div>
            <button
              onClick={() => navigateMonth(1)}
              disabled={currentMonthIndex === monthsArchive.length - 1}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white rounded-lg"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="relative" style={{ width: gridWidth, height: gridHeight }}>
          {Object.entries(currentGrid).map(([code, [row, col]]) => {
            const isHovered = hoveredState === code;
            const hasContent = !!currentData[code];
            const x = col * (cellSize + gap);
            const y = row * (cellSize + gap);

            return (
              <div
                key={code}
                className="absolute transition-all duration-300"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  transform: isHovered ? 'translateY(-12px) scale(1.15)' : 'translateY(0)',
                  zIndex: isHovered ? 10 : 1,
                  cursor: hasContent ? 'pointer' : 'default'
                }}
                onMouseEnter={() => {
                  // Only show hover on non-touch devices
                  if (hasContent && !('ontouchstart' in window)) {
                    setHoveredState(code);
                  }
                }}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleItemClick(code)}
              >
                {isHovered && (
                  <div
                    className="absolute inset-0 bg-black/40 rounded-lg blur-xl"
                    style={{ transform: 'translateY(12px)' }}
                  />
                )}
                <div
                  className={`w-full h-full rounded-lg border-2 overflow-hidden relative ${
                    hasContent
                      ? isHovered
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 shadow-lg'
                        : 'bg-gradient-to-br from-indigo-600 to-purple-700 border-indigo-500'
                      : 'bg-slate-700 border-slate-600 opacity-30'
                  } transition-all`}
                >
                  {/* Artwork background image */}
                  {hasContent && currentData[code].posterUrl && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${currentData[code].posterUrl})`,
                      }}
                    />
                  )}
                  {/* Gradient overlay when no artwork or for contrast */}
                  {hasContent && !isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-purple-600/40" />
                  )}
                  <div className={`absolute inset-0 flex items-center justify-center p-2 transition-all ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                    <span
                      className={`font-bold text-white drop-shadow-lg text-center ${
                        cellSize < 60 
                          ? 'text-[10px]'
                          : cellSize < 90
                          ? 'text-sm'
                          : 'text-lg'
                      }`}
                    >
                      {code}
                    </span>
                  </div>
                  {/* Small label in bottom-right on hover */}
                  {isHovered && (
                    <div className="absolute bottom-2 right-2">
                      <span className="text-xs font-bold text-white drop-shadow-lg">
                        {code}
                      </span>
                    </div>
                  )}
                  {isHovered && hasContent && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Hover Preview */}
          {hoveredState && currentData[hoveredState] && (
            <div
              className="fixed bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden z-50"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                maxWidth: '90vw'
              }}
            >
              <div className="p-4">
                <div className="text-xs text-slate-400 mb-1 uppercase">
                  {zoomLevel === 'world' && activeData.countries[hoveredState] ? 'Click to Explore' : 'Now Playing'}
                </div>
                <div className="text-lg font-bold text-white mb-1">{currentData[hoveredState].name}</div>
                <div className="text-sm text-slate-300 mb-3">
                  {zoomLevel === 'world' ? hoveredState : (stateNames[hoveredState] || hoveredState)}
                </div>
                
                {/* Video or Poster */}
                {currentData[hoveredState].videoUrl ? (
                  <video 
                    className="w-full aspect-video rounded-lg"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={currentData[hoveredState].posterUrl || ''}
                  >
                    <source src={currentData[hoveredState].videoUrl} type="video/mp4" />
                  </video>
                ) : currentData[hoveredState].posterUrl ? (
                  <img 
                    src={currentData[hoveredState].posterUrl} 
                    alt={currentData[hoveredState].name}
                    className="w-full aspect-video rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-2xl mb-2">🎬</div>
                      <div className="text-xs opacity-70">No preview</div>
                    </div>
                  </div>
                )}
                <div className="mt-3 text-xs text-slate-400 text-center">
                  {zoomLevel === 'world' && activeData.countries[hoveredState] ? 'Click to explore' : 'Click for details'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-800/30 border-t border-slate-700 p-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div className="flex gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-600 to-purple-700 border-2 border-indigo-500" />
              <span>Featured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-slate-700 border-2 border-slate-600 opacity-30" />
              <span>Available</span>
            </div>
          </div>
          <div className="text-slate-400">
            <span className="font-semibold text-slate-300">Hover</span> to preview •{' '}
            <span className="font-semibold text-slate-300">Click</span> to {zoomLevel === 'world' ? 'explore' : 'view'}
          </div>
        </div>
      </div>

      {/* Artist Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-700 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full"
              >
                <X />
              </button>
              <div className="text-sm text-indigo-100 mb-2">
                {zoomLevel === 'world'
                  ? `${selectedArtist.code} • ${currentMonth.month} ${currentMonth.year}`
                  : `${stateNames[selectedArtist.code] || selectedArtist.code} • ${currentMonth.month} ${currentMonth.year}`}
              </div>
              <h2 className="text-3xl font-bold text-white">{selectedArtist.name}</h2>
            </div>
            <div className="p-6">
              {/* Video or Poster in Modal */}
              {selectedArtist.videoUrl ? (
                <video 
                  className="w-full aspect-video rounded-xl mb-6"
                  controls
                  poster={selectedArtist.posterUrl || ''}
                >
                  <source src={selectedArtist.videoUrl} type="video/mp4" />
                </video>
              ) : selectedArtist.posterUrl ? (
                <img 
                  src={selectedArtist.posterUrl} 
                  alt={selectedArtist.name}
                  className="w-full aspect-video rounded-xl mb-6 object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl mb-6 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-3">🎨</div>
                    <div className="text-lg font-medium">Motion Design</div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">About</h3>
                  <p className="text-slate-200">{selectedArtist.bio}</p>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <a
                    href={`https://${selectedArtist.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                  >
                    <Globe />
                    <span className="text-sm">Website</span>
                  </a>
                  <a
                    href={`https://instagram.com/${selectedArtist.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
                  >
                    <Instagram />
                    <span className="text-sm">Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
