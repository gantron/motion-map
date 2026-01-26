import { useState, useRef, useEffect } from 'react';
import {
  X, Calendar, Globe, Instagram, ChevronLeft, ChevronRight,
  Map, Grid, Home
} from './Icons';
import { loadData, getAvailableMonths } from './dataLoader';
import SubmissionForm from './SubmissionForm';

function App() {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [viewMode, setViewMode] = useState('map');
  const [zoomLevel, setZoomLevel] = useState('world');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [sheetData, setSheetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRefs = useRef({});
  const sidebarVideoRef = useRef(null);

  // Helper function to get embed URL for video platforms
  const getVideoEmbedInfo = (url) => {
    if (!url) return null;

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${youtubeMatch[1]}`
      };
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1`
      };
    }

    // Direct video file
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return {
        type: 'direct',
        embedUrl: url
      };
    }

    return null;
  };

  // Fallback demo data (not used if sheets load)
  const demoData = {
    world: {},
    countries: {},
    states: {}
  };

  // Load data from Google Sheets on mount
  useEffect(() => {
    loadData().then(data => {
      setSheetData(data);
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to load data:', error);
      setSheetData({ world: {}, countries: {}, states: {} });
      setIsLoading(false);
    });
  }, []);

  // World grid with multiple boxes per country (roughly geographical)
  const worldGridBase = {
    'USA-1': [1, 1], 'USA-2': [1, 2], 'USA-3': [1, 3], 'USA-4': [1, 4],
    'Canada-1': [0, 1], 'Canada-2': [0, 2], 'Canada-3': [0, 3],
    'Mexico-1': [2, 2], 'Mexico-2': [2, 3],
    'Brazil-1': [4, 3], 'Brazil-2': [4, 4], 'Brazil-3': [5, 3],
    'Argentina-1': [6, 3], 'Argentina-2': [6, 4],
    'UK-1': [1, 7], 'UK-2': [1, 8],
    'France-1': [2, 7], 'France-2': [2, 8],
    'Germany-1': [1, 9], 'Germany-2': [2, 9],
    'Spain-1': [3, 7], 'Spain-2': [3, 8],
    'Italy-1': [3, 9], 'Italy-2': [3, 10],
    'Nigeria-1': [5, 8], 'Nigeria-2': [5, 9],
    'Egypt-1': [3, 11], 'Egypt-2': [3, 12],
    'South Africa-1': [7, 8], 'South Africa-2': [7, 9],
    'UAE-1': [3, 13], 'UAE-2': [3, 14],
    'Russia-1': [0, 11], 'Russia-2': [0, 12], 'Russia-3': [0, 13], 'Russia-4': [0, 14],
    'China-1': [2, 14], 'China-2': [2, 15], 'China-3': [3, 15],
    'Japan-1': [1, 16], 'Japan-2': [1, 17], 'Japan-3': [1, 18],
    'Korea-1': [2, 16], 'Korea-2': [2, 17],
    'India-1': [4, 12], 'India-2': [4, 13], 'India-3': [5, 12],
    'Thailand-1': [4, 15], 'Thailand-2': [4, 16],
    'Singapore-1': [5, 16],
    'Australia-1': [7, 16], 'Australia-2': [7, 17], 'Australia-3': [7, 18],
    'New Zealand-1': [8, 18]
  };

  const generateWorldGrid = () => worldGridBase;

  // US States map grid (geographically accurate)
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

  const generateGridLayout = (items) => {
    const grid = {};
    const gridSize = Math.ceil(Math.sqrt(items.length));
    items.forEach((item, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      grid[item] = [row, col];
    });
    return grid;
  };

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use loaded data
  const activeData = sheetData || demoData;
  
  // Get available months
  let monthsArchive = [];
  if (sheetData) {
    try {
      monthsArchive = getAvailableMonths(sheetData);
    } catch (error) {
      console.error('Error getting available months:', error);
      monthsArchive = [];
    }
  }
  
  // Find the current month or closest available month
  const findCurrentMonthIndex = () => {
    if (monthsArchive.length === 0) return 0;
    
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const exactMatch = monthsArchive.findIndex(m => m.key === currentKey);
    if (exactMatch !== -1) return exactMatch;
    
    let closestIndex = 0;
    let closestDiff = Infinity;
    
    monthsArchive.forEach((month, index) => {
      const monthDate = new Date(month.year, parseInt(month.key.split('-')[1]) - 1);
      const diff = Math.abs(monthDate - now);
      
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = index;
      }
    });
    
    return closestIndex;
  };
  
  // Set initial month index to current month (only on first load)
  const [hasSetInitialMonth, setHasSetInitialMonth] = useState(false);
  useEffect(() => {
    if (!hasSetInitialMonth && monthsArchive.length > 0) {
      const currentIdx = findCurrentMonthIndex();
      setCurrentMonthIndex(currentIdx);
      setHasSetInitialMonth(true);
    }
  }, [monthsArchive.length, hasSetInitialMonth]);
  
  // Ensure currentMonthIndex is valid
  const safeIndex = monthsArchive.length > 0 ? Math.max(0, Math.min(currentMonthIndex, monthsArchive.length - 1)) : 0;
  const currentMonth = monthsArchive[safeIndex] || { month: '', year: 2026, key: '' };
  
  // Triple-check that month and year are valid
  const displayMonth = currentMonth?.month || 'January';
  const displayYear = currentMonth?.year || 2026;
  const currentMonthKey = currentMonth?.key || '2026-01';
  
  const rawData = zoomLevel === 'world'
    ? (activeData.world[currentMonthKey] || {})
    : (activeData.countries[selectedRegion]?.[currentMonthKey] || {});

  const getCurrentGrid = () => {
    if (viewMode === 'archive') {
      const allArtists = [];
      const allData = zoomLevel === 'world' ? activeData.world : (activeData.countries[selectedRegion] || {});
      
      Object.entries(allData).forEach(([month, artists]) => {
        Object.keys(artists).forEach(code => {
          allArtists.push(`${code}-${month}`);
        });
      });
      
      return generateGridLayout(allArtists);
    }
    
    if (zoomLevel === 'world') {
      return viewMode === 'grid' ? generateGridLayout(Object.keys(generateWorldGrid())) : generateWorldGrid();
    } else if (selectedRegion === 'USA') {
      return viewMode === 'grid' ? generateGridLayout(Object.keys(usStatesMapGrid)) : usStatesMapGrid;
    }
    return {};
  };

  const currentGrid = getCurrentGrid();

  // Map grid boxes to data
  const currentData = {};
  
  if (viewMode === 'archive') {
    const allData = zoomLevel === 'world' ? activeData.world : (activeData.countries[selectedRegion] || {});
    
    Object.keys(currentGrid).forEach(gridKey => {
      const match = gridKey.match(/^(.+?)-(\d{4}-\d{2})$/);
      if (match) {
        const [, countryCode, month] = match;
        if (allData[month] && allData[month][countryCode]) {
          currentData[gridKey] = { ...allData[month][countryCode], month, displayMonth: month };
        }
      }
    });
  } else {
    Object.keys(currentGrid).forEach(gridKey => {
      const gridMatch = gridKey.match(/^(.+?)-(\d+)$/);
      
      if (gridMatch) {
        const [, country, boxNum] = gridMatch;
        
        if (rawData[gridKey]) {
          currentData[gridKey] = rawData[gridKey];
        } else if (rawData[country]) {
          currentData[gridKey] = rawData[country];
        }
      } else {
        if (rawData[gridKey]) {
          currentData[gridKey] = rawData[gridKey];
        }
      }
    });
  }

  // Video control
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

  // Sidebar video control
  useEffect(() => {
    if (sidebarVideoRef.current && selectedArtist) {
      sidebarVideoRef.current.play();
    }
  }, [selectedArtist]);

  const handleItemClick = (code) => {
    if (currentData[code]) {
      setSelectedArtist({ ...currentData[code], code });
    }
  };

  const handleItemDoubleClick = (code) => {
    if (zoomLevel === 'world') {
      const countryMatch = code.match(/^(.+?)-\d+$/);
      const country = countryMatch ? countryMatch[1] : code;
      
      if (activeData.countries[country]) {
        setSelectedRegion(country);
        setZoomLevel('country');
        setCurrentMonthIndex(0);
        setHoveredState(null);
        setSelectedArtist(null);
      }
    } else if (zoomLevel === 'country') {
      const stateKey = `${selectedRegion}-${code}`;
      if (activeData.states && activeData.states[stateKey]) {
        console.log('State drill-down coming soon:', code);
      }
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel === 'country') {
      setZoomLevel('world');
      setSelectedRegion(null);
      setCurrentMonthIndex(0);
      setHoveredState(null);
      setSelectedArtist(null);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonthIndex(prev => Math.max(0, Math.min(prev + direction, monthsArchive.length - 1)));
  };

  const getGridDimensions = () => {
    const worldGrid = generateWorldGrid();
    let maxRow = 0, maxCol = 0;
    
    Object.values(currentGrid).forEach(([row, col]) => {
      maxRow = Math.max(maxRow, row);
      maxCol = Math.max(maxCol, col);
    });

    const baseCellSize = 120;
    const baseGap = 16;
    
    const availableWidth = windowSize.width - 64 - 400;
    const availableHeight = windowSize.height - 200;
    
    const gridWidth = (maxCol + 1) * baseCellSize + maxCol * baseGap;
    const gridHeight = (maxRow + 1) * baseCellSize + maxRow * baseGap;
    
    let scale = 1;
    if (gridWidth > availableWidth || gridHeight > availableHeight) {
      scale = Math.min(availableWidth / gridWidth, availableHeight / gridHeight);
    }
    
    const cellSize = Math.floor(baseCellSize * scale);
    const gap = Math.max(2, Math.floor(baseGap * scale));
    
    return {
      cellSize,
      gap,
      gridWidth: (maxCol + 1) * cellSize + maxCol * gap,
      gridHeight: (maxRow + 1) * cellSize + maxRow * gap
    };
  };

  const { cellSize, gap, gridWidth, gridHeight } = getGridDimensions();

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
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 flex-shrink-0">
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
            <button
              onClick={() => setIsSubmissionFormOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Submit Your Work
            </button>
            <div className="flex gap-1 bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'map' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Map View"
              >
                <Map />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid />
              </button>
              <button
                onClick={() => setViewMode('archive')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'archive' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Archive View"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
            </div>
            {viewMode === 'archive' ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg">
                <Calendar />
                <span className="text-sm font-medium">Archive - All Time</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigateMonth(-1)}
                  disabled={currentMonthIndex === 0}
                  className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white rounded-lg"
                >
                  <ChevronLeft />
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg">
                  <Calendar />
                  <span className="text-sm font-medium">{displayMonth} {displayYear}</span>
                </div>
                <button
                  onClick={() => navigateMonth(1)}
                  disabled={currentMonthIndex === monthsArchive.length - 1}
                  className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white rounded-lg"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Map + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 flex items-start justify-start p-8 overflow-auto">
          <div className="relative mx-auto" style={{ width: gridWidth, height: gridHeight }}>
            {Object.entries(currentGrid).map(([code, [row, col]]) => {
              const isHovered = hoveredState === code;
              const hasContent = !!currentData[code];
              const isSelected = selectedArtist?.code === code;
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
                    transform: isHovered ? 'translateY(-8px) scale(1.1)' : 'translateY(0)',
                    zIndex: isHovered ? 10 : (isSelected ? 5 : 1),
                    cursor: hasContent ? 'pointer' : 'default'
                  }}
                  onMouseEnter={() => {
                    if (hasContent && !('ontouchstart' in window)) {
                      setHoveredState(code);
                    }
                  }}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleItemClick(code)}
                  onDoubleClick={() => handleItemDoubleClick(code)}
                >
                  {isHovered && (
                    <div
                      className="absolute inset-0 bg-black/40 rounded-lg blur-xl"
                      style={{ transform: 'translateY(8px)' }}
                    />
                  )}
                  <div
                    className={`w-full h-full rounded-lg border-2 overflow-hidden relative ${
                      hasContent
                        ? isSelected 
                          ? 'border-indigo-400 shadow-lg shadow-indigo-500/50'
                          : 'border-indigo-500/50 shadow-lg'
                        : 'border-slate-700/30'
                    } ${
                      hasContent ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-slate-800/30'
                    }`}
                  >
                    {/* Video or Poster Display */}
                    {(() => {
                      // Only try to display video if videoUrl exists and is valid
                      const hasValidVideo = hasContent && currentData[code].videoUrl && 
                                          currentData[code].videoUrl.trim().length > 0 &&
                                          currentData[code].videoUrl !== '#N/A';
                      
                      if (hasValidVideo) {
                        const videoInfo = getVideoEmbedInfo(currentData[code].videoUrl);
                        if (videoInfo) {
                          if (videoInfo.type === 'youtube' || videoInfo.type === 'vimeo') {
                            return (
                              <iframe
                                src={videoInfo.embedUrl}
                                className="absolute inset-0 w-full h-full"
                                allow="autoplay; encrypted-media"
                                style={{ pointerEvents: 'none' }}
                              />
                            );
                          } else if (videoInfo.type === 'direct') {
                            return (
                              <video
                                ref={el => videoRefs.current[code] = el}
                                className="absolute inset-0 w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                                poster={currentData[code].posterUrl || ''}
                              >
                                <source src={videoInfo.embedUrl} type="video/mp4" />
                              </video>
                            );
                          }
                        }
                      }
                      
                      // Show poster if available (and no valid video)
                      const hasValidPoster = hasContent && currentData[code].posterUrl && 
                                            currentData[code].posterUrl.trim().length > 0 &&
                                            currentData[code].posterUrl !== '#N/A';
                      
                      if (hasValidPoster) {
                        return (
                          <img 
                            src={currentData[code].posterUrl} 
                            alt={currentData[code].name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        );
                      }
                      
                      // If no video or poster, just show gradient (already set as background)
                      return null;
                    })()}
                    
                    {!hasContent && zoomLevel === 'world' && (
                      <div className="absolute bottom-2 right-2">
                        <span className="text-xs font-bold text-white/30 drop-shadow-lg">
                          {code.replace(/-\d+$/, '')}
                        </span>
                      </div>
                    )}
                    
                    {zoomLevel === 'world' && isHovered && hasContent && (
                      <div className="absolute bottom-2 right-2">
                        <span className="text-xs font-bold text-white drop-shadow-lg">
                          {code.replace(/-\d+$/, '')}
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
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col overflow-hidden flex-shrink-0">
          {selectedArtist ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Artist Header */}
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 relative flex-shrink-0">
                <button
                  onClick={() => setSelectedArtist(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X />
                </button>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedArtist.name}</h2>
                {selectedArtist.country && (
                  <p className="text-indigo-100">
                    {[selectedArtist.city, selectedArtist.state, selectedArtist.country].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>

              {/* Artist Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Video/Poster */}
                {(() => {
                  // Check for valid video URL
                  const hasValidVideo = selectedArtist.videoUrl && 
                                       selectedArtist.videoUrl.trim().length > 0 &&
                                       selectedArtist.videoUrl !== '#N/A';
                  
                  if (hasValidVideo) {
                    const videoInfo = getVideoEmbedInfo(selectedArtist.videoUrl);
                    if (videoInfo) {
                      if (videoInfo.type === 'youtube' || videoInfo.type === 'vimeo') {
                        return (
                          <iframe
                            src={videoInfo.embedUrl.replace('autoplay=1&mute=1', 'autoplay=0')}
                            className="w-full aspect-video rounded-lg mb-6"
                            allow="encrypted-media; fullscreen"
                          />
                        );
                      } else if (videoInfo.type === 'direct') {
                        return (
                          <video
                            ref={sidebarVideoRef}
                            className="w-full aspect-video rounded-lg mb-6 object-cover"
                            controls
                            loop
                            poster={selectedArtist.posterUrl || ''}
                          >
                            <source src={videoInfo.embedUrl} type="video/mp4" />
                          </video>
                        );
                      }
                    }
                  }
                  
                  // Check for valid poster URL
                  const hasValidPoster = selectedArtist.posterUrl && 
                                        selectedArtist.posterUrl.trim().length > 0 &&
                                        selectedArtist.posterUrl !== '#N/A';
                  
                  if (hasValidPoster) {
                    return (
                      <img 
                        src={selectedArtist.posterUrl} 
                        alt={selectedArtist.name}
                        className="w-full aspect-video rounded-lg object-cover mb-6"
                      />
                    );
                  }
                  
                  // Fallback gradient
                  return (
                    <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 mb-6" />
                  );
                })()}

                {/* Bio */}
                {selectedArtist.bio && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">About</h3>
                    <p className="text-slate-300 leading-relaxed">{selectedArtist.bio}</p>
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-3">
                  {selectedArtist.website && (
                    <a
                      href={selectedArtist.website.startsWith('http') ? selectedArtist.website : `https://${selectedArtist.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      <Globe />
                      <span className="text-sm">Website</span>
                    </a>
                  )}
                  {selectedArtist.instagram && (
                    <a
                      href={`https://instagram.com/${selectedArtist.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors"
                    >
                      <Instagram />
                      <span className="text-sm">Instagram</span>
                    </a>
                  )}
                </div>

                {/* Drill-down hint */}
                {(() => {
                  const countryMatch = selectedArtist.code?.match(/^(.+?)-\d+$/);
                  const country = countryMatch ? countryMatch[1] : selectedArtist.code;
                  const canDrillDown = (zoomLevel === 'world' && activeData.countries[country]);
                  
                  return canDrillDown && (
                    <div className="mt-6 p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-lg">
                      <p className="text-sm text-indigo-300">
                        💡 <strong>Tip:</strong> Double-click on the map to explore more artists from {country}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-bold text-white mb-2">Select an Artist</h3>
                <p className="text-slate-400">Click on any highlighted box to view artist details</p>
                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg text-left">
                  <p className="text-sm text-slate-300 mb-2">
                    <strong className="text-white">Single-click:</strong> View artist
                  </p>
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Double-click:</strong> Explore region
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submission Form Modal */}
      <SubmissionForm 
        isOpen={isSubmissionFormOpen} 
        onClose={() => setIsSubmissionFormOpen(false)} 
      />
    </div>
  );
}

export default App;
