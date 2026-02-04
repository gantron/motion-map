import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [zoomLevel, setZoomLevel] = useState('world'); // 'world', 'country', 'state'
  const [selectedRegion, setSelectedRegion] = useState(null); // e.g., 'USA'
  const [selectedState, setSelectedState] = useState(null); // e.g., 'NC'
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [sheetData, setSheetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRefs = useRef({});
  const sidebarVideoRef = useRef(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSortMode, setMobileSortMode] = useState('random'); // 'random', 'name', 'country'
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sort mobile artists
  const sortMobileArtists = (artistsObj) => {
    const entries = Object.entries(artistsObj);
    
    switch(mobileSortMode) {
      case 'name':
        return entries.sort(([, a], [, b]) => 
          (a.name || '').localeCompare(b.name || '')
        );
      case 'country':
        return entries.sort(([, a], [, b]) => {
          const countryA = a.country || '';
          const countryB = b.country || '';
          if (countryA === countryB) {
            return (a.name || '').localeCompare(b.name || '');
          }
          return countryA.localeCompare(countryB);
        });
      case 'random':
      default:
        // Shuffle array randomly but consistently per session
        return entries.sort(() => Math.random() - 0.5);
    }
  };

  // Generate slug from artist name
  const generateSlug = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .trim();
  };

  // Clear hover state when view mode changes to prevent animation conflicts
  useEffect(() => {
    setHoveredState(null);
  }, [viewMode]);

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

  // ========================================
  // WORLD GRID - SIMPLE V1
  // Philosophy: Fewer countries = larger tiles = better artist visibility
  // Grid shows 44 countries, ~8 rows × 12 columns
  // ========================================
  const worldGridBase = {
    // NORTH AMERICA (3 countries, 9 tiles)
    'Canada-1':[0,1], 'Canada-2':[0,2],
    'USA-1':[1,0], 'USA-2':[1,1], 'USA-3':[1,2],
    'USA-4':[2,1], 'USA-5':[2,2],
    'Mexico-1':[2,0],  // NEW: up one, left one
    'Mexico-2':[3,1],  // Original Mexico position
    
    // CENTRAL/SOUTH AMERICA (6 countries, 7 tiles) - STAGGERED
    'Costa Rica-1':[4,2],  // Moved right from [4,1]
    'Venezuela-1':[5,2],   // NEW: Above middle Brazil tile
    'Colombia-1':[5,3],    // Moved down-right from [5,1]
    'Brazil-1':[6,2], 'Brazil-2':[6,3],
    'Peru-1':[6,1],
    'Argentina-1':[7,2],
    
    // EUROPE (7 countries, 7 tiles)
    'UK-1':[1,5],
    'France-1':[2,5],
    'Portugal-1':[3,4],    // NEW: Left of Spain
    'Spain-1':[3,5],
    'Germany-1':[2,6],
    'Italy-1':[3,6],
    'Poland-1':[2,7],
    
    // RUSSIA (1 country, 4 tiles - spans Europe to Asia)
    'Russia-1':[0,8], 'Russia-2':[0,9], 'Russia-3':[0,10],
    'Russia-4':[1,9],      // NEW: Beneath middle Russia tile
    
    // AFRICA (6 countries, 6 tiles)
    'Morocco-1':[4,5],
    'Nigeria-1':[5,5],
    'Ghana-1':[5,6],
    'Kenya-1':[6,6],
    'South Africa-1':[7,6],
    'Egypt-1':[4,6],
    
    // MIDDLE EAST (3 countries, 3 tiles)
    'Turkey-1':[3,7],
    'Israel-1':[4,7],
    'Saudi Arabia-1':[5,7],
    
    // ASIA (7 countries, 10 tiles)
    'Nepal-1':[3,8],
    'China-1':[2,8], 'China-2':[2,9],
    'China-3':[1,10],      // NEW: Beneath 3rd Russia tile
    'India-1':[4,8], 'India-2':[5,8],
    'Japan-1':[2,11],
    'Korea-1':[2,10],
    
    // SOUTHEAST ASIA (3 countries, 3 tiles) - MOVED UP
    'Thailand-1':[3,9],
    'Vietnam-1':[3,10],
    'Indonesia-1':[4,10],
    
    // OCEANIA (2 countries, 3 tiles) - NOW AN ISLAND
    'Australia-1':[6,10], 'Australia-2':[6,11],
    'New Zealand-1':[7,11]
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

  // City coordinates database (lat, long) - expand this as needed
  const cityCoordinates = {
    // North Carolina
    'Charlotte': [35.2271, -80.8431],
    'Raleigh': [35.7796, -78.6382],
    'Durham': [35.9940, -78.8986],
    'Greensboro': [36.0726, -79.7920],
    'Winston-Salem': [36.0999, -80.2442],
    'Fayetteville': [35.0527, -78.8784],
    'Cary': [35.7915, -78.7811],
    'Wilmington': [34.2257, -77.9447],
    'High Point': [35.9557, -80.0053],
    'Asheville': [35.5951, -82.5515],
    'Chapel Hill': [35.9132, -79.0558],
    'Greenville': [35.6127, -77.3663],
    'Jacksonville': [34.7540, -77.4302],
    'Rocky Mount': [35.9382, -77.7905],
    'Wilson': [35.7213, -77.9155],
    'Hickory': [35.7344, -81.3412],
    // Japan
    'Tokyo': [35.6762, 139.6503],
    'Osaka': [34.6937, 135.5023],
    'Kyoto': [35.0116, 135.7681],
    'Yokohama': [35.4437, 139.6380],
    'Nagoya': [35.1815, 136.9066],
    'Sapporo': [43.0642, 141.3469],
    'Fukuoka': [33.5904, 130.4017],
    'Kobe': [34.6901, 135.1955],
    'Hiroshima': [34.3853, 132.4553],
    'Sendai': [38.2682, 140.8694]
  };

  // Generate geographic grid from city coordinates
  const generateGeographicGrid = (cities) => {
    if (cities.length === 0) return {};
    
    // Get coordinates for each city
    const citiesWithCoords = cities
      .map(city => ({
        name: city,
        coords: cityCoordinates[city]
      }))
      .filter(c => c.coords); // Only include cities we have coords for
    
    if (citiesWithCoords.length === 0) return {};
    
    // Find bounds
    const lats = citiesWithCoords.map(c => c.coords[0]);
    const longs = citiesWithCoords.map(c => c.coords[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLong = Math.min(...longs);
    const maxLong = Math.max(...longs);
    
    // Calculate grid dimensions based on number of cities
    // Fewer cities = larger grid (more spacing)
    const numCities = citiesWithCoords.length;
    let gridCols, gridRows;
    
    if (numCities <= 4) {
      gridCols = 4;
      gridRows = 3;
    } else if (numCities <= 8) {
      gridCols = 5;
      gridRows = 4;
    } else {
      gridCols = 6;
      gridRows = 5;
    }
    
    // Normalize coordinates to grid positions
    const grid = {};
    citiesWithCoords.forEach(city => {
      const [lat, long] = city.coords;
      
      // Normalize lat/long to 0-1 range
      const normalizedLat = (lat - minLat) / (maxLat - minLat || 1);
      const normalizedLong = (long - minLong) / (maxLong - minLong || 1);
      
      // Convert to grid position
      // Latitude goes top to bottom (invert)
      // Longitude goes left to right
      const row = Math.round((1 - normalizedLat) * (gridRows - 1));
      const col = Math.round(normalizedLong * (gridCols - 1));
      
      grid[city.name] = [row, col];
    });
    
    return grid;
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
  const activeData = sheetData || { world: {}, countries: {}, states: {} };
  
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

  // Handle shareable artist links - VERY safe SSR version
  useEffect(() => {
    // Triple check we're in browser
    if (typeof window === 'undefined') return;
    if (typeof URLSearchParams === 'undefined') return;
    if (!window.location) return;
    if (!sheetData) return;
    
    try {
      const params = new URLSearchParams(window.location.search);
      const artistParam = params.get('artist');
      const openSubmitParam = params.get('openSubmit');
      
      if (artistParam && currentData[artistParam]) {
        setSelectedArtist({ ...currentData[artistParam], code: artistParam });
      }
      
      // Auto-open submission form if URL param present
      if (openSubmitParam === 'true') {
        setIsSubmissionFormOpen(true);
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch (e) {
      // Silently fail if anything goes wrong
      console.error('Error loading from URL:', e);
    }
  }, [sheetData]);
  
  // Ensure currentMonthIndex is valid
  const safeIndex = monthsArchive.length > 0 ? Math.max(0, Math.min(currentMonthIndex, monthsArchive.length - 1)) : 0;
  const currentMonth = monthsArchive[safeIndex] || { month: '', year: 2026, key: '' };
  
  // Triple-check that month and year are valid
  const displayMonth = currentMonth?.month || 'January';
  const displayYear = currentMonth?.year || 2026;
  const currentMonthKey = currentMonth?.key || '2026-01';
  
  // Get data based on zoom level
  const rawData = (() => {
    if (zoomLevel === 'world') {
      return activeData.world[currentMonthKey] || {};
    } else if (zoomLevel === 'country') {
      return activeData.countries[selectedRegion]?.[currentMonthKey] || {};
    } else if (zoomLevel === 'state') {
      const stateKey = `${selectedRegion}-${selectedState}`;
      return activeData.states?.[stateKey]?.[currentMonthKey] || {};
    }
    return {};
  })();

  const getCurrentGrid = () => {
    if (viewMode === 'archive') {
      const allArtists = [];
      const allData = zoomLevel === 'world' 
        ? activeData.world 
        : zoomLevel === 'country'
        ? (activeData.countries[selectedRegion] || {})
        : (activeData.states[`${selectedRegion}-${selectedState}`] || {});
      
      Object.entries(allData).forEach(([month, artists]) => {
        Object.keys(artists).forEach(code => {
          allArtists.push(`${code}-${month}`);
        });
      });
      
      return generateGridLayout(allArtists);
    }
    
    if (zoomLevel === 'world') {
      return viewMode === 'grid' ? generateGridLayout(Object.keys(generateWorldGrid())) : generateWorldGrid();
    } else if (zoomLevel === 'country' && selectedRegion === 'USA') {
      return viewMode === 'grid' ? generateGridLayout(Object.keys(usStatesMapGrid)) : usStatesMapGrid;
    } else if (zoomLevel === 'state') {
      // Get cities from current state data
      const cities = Object.keys(rawData);
      // Use geographic grid for map view, alphabetical grid for grid view
      return viewMode === 'grid' ? generateGridLayout(cities) : generateGeographicGrid(cities);
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
      // Drilling from World to Country (USA)
      const countryMatch = code.match(/^(.+?)-\d+$/);
      const country = countryMatch ? countryMatch[1] : code;
      
      if (activeData.countries[country]) {
        setSelectedRegion(country);
        setZoomLevel('country');
        // Don't reset month - keep current month
        setHoveredState(null);
        setSelectedArtist(null);
      }
    } else if (zoomLevel === 'country') {
      // Drilling from Country to State (NC, CA, FL, etc.)
      const stateKey = `${selectedRegion}-${code}`;
      if (activeData.states && activeData.states[stateKey]) {
        setSelectedState(code);
        setZoomLevel('state');
        // Don't reset month - keep current month
        setHoveredState(null);
        setSelectedArtist(null);
      }
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel === 'state') {
      // Zoom out from State to Country
      setZoomLevel('country');
      setSelectedState(null);
      // Don't reset month - keep current month
      setHoveredState(null);
      setSelectedArtist(null);
    } else if (zoomLevel === 'country') {
      // Zoom out from Country to World
      setZoomLevel('world');
      setSelectedRegion(null);
      // Don't reset month - keep current month
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

    // SIMPLE V1: Larger base sizes for better artist visibility (20% bigger)
    let baseCellSize = zoomLevel === 'world' ? 180 : 160;
    const itemCount = Object.keys(currentGrid).length;
    
    if (zoomLevel === 'state') {
      // Fewer cities = bigger boxes
      if (itemCount <= 4) {
        baseCellSize = 185;
      } else if (itemCount <= 8) {
        baseCellSize = 155;
      } else {
        baseCellSize = 140;
      }
    }
    
    const baseGap = 8; // Reduced from 10 for tighter spacing
    
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
      <div className="w-full h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center">
        <style>{`
          @keyframes rotate1 {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
          }
          @keyframes rotate2 {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(450deg) rotateY(270deg); }
          }
          @keyframes rotate3 {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(270deg) rotateY(450deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .loader-container {
            perspective: 1000px;
            width: 100px;
            height: 100px;
            position: relative;
          }
          .rotating-square {
            position: absolute;
            top: 50%;
            left: 50%;
            transform-style: preserve-3d;
            transform-origin: center;
          }
          .square-1 {
            animation: rotate1 4s linear infinite;
            margin: -40px 0 0 -40px;
          }
          .square-2 {
            animation: rotate2 5s linear infinite;
            margin: -35px 0 0 -35px;
          }
          .square-3 {
            animation: rotate3 6s linear infinite;
            margin: -30px 0 0 -30px;
          }
          .pulse-text {
            animation: pulse 2s ease-in-out infinite;
          }
        `}</style>
        <div className="text-center">
          <div className="loader-container mx-auto mb-8">
            <svg className="rotating-square square-1" width="80" height="80" viewBox="0 0 80 80">
              <rect x="2" y="2" width="76" height="76" rx="14" 
                    fill="none" stroke="rgba(99, 102, 241, 0.8)" 
                    strokeWidth="3" vectorEffect="non-scaling-stroke"/>
            </svg>
            <svg className="rotating-square square-2" width="70" height="70" viewBox="0 0 70 70">
              <rect x="2" y="2" width="66" height="66" rx="12" 
                    fill="none" stroke="rgba(168, 85, 247, 0.7)" 
                    strokeWidth="3" vectorEffect="non-scaling-stroke"/>
            </svg>
            <svg className="rotating-square square-3" width="60" height="60" viewBox="0 0 60 60">
              <rect x="2" y="2" width="56" height="56" rx="10" 
                    fill="none" stroke="rgba(236, 72, 153, 0.5)" 
                    strokeWidth="3" vectorEffect="non-scaling-stroke"/>
            </svg>
          </div>
          <div className="text-white text-2xl font-bold mb-3">MotionMap</div>
          <div className="text-slate-400 text-lg pulse-text">Loading artists...</div>
        </div>
      </div>
    );
  }

  // Mobile View - Simple scrollable list
  if (isMobile) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-black via-slate-950 to-black flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 p-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <rect x="6" y="6" width="24" height="24" rx="4" 
                      stroke="url(#gradient)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <h1 className="text-lg font-bold text-white">MotionMap</h1>
            </div>
            <button
              onClick={() => setIsSubmissionFormOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium"
            >
              Submit
            </button>
          </div>
          
          {/* Month Navigation - Mobile */}
          {viewMode !== 'archive' && (
            <div className="flex items-center justify-between gap-2 mt-3">
              <button
                onClick={() => navigateMonth(-1)}
                disabled={currentMonthIndex === 0}
                className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white rounded-lg"
              >
                <ChevronLeft />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg">
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
            </div>
          )}
          
          {/* Sort Dropdown */}
          <div className="mt-3 flex items-center justify-end gap-2">
            <span className="text-xs text-slate-400">Sort:</span>
            <select
              value={mobileSortMode}
              onChange={(e) => setMobileSortMode(e.target.value)}
              className="text-xs bg-slate-700 text-white rounded-lg px-2 py-1 border border-slate-600 focus:outline-none focus:border-indigo-500"
            >
              <option value="random">Random</option>
              <option value="name">A-Z</option>
              <option value="country">By Country</option>
            </select>
          </div>
        </div>

        {/* Mobile Artist List */}
        <div className="flex-1 overflow-y-scroll overscroll-contain p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {Object.keys(currentData).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-white mb-2">No Artists This Month</h3>
              <p className="text-slate-400">Check back soon or explore the archive!</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto">
              {sortMobileArtists(currentData).map(([code, artist]) => {
                const videoInfo = artist.videoUrl ? getVideoEmbedInfo(artist.videoUrl) : null;
                const hasValidPoster = artist.posterUrl && 
                                      artist.posterUrl.trim().length > 0 &&
                                      artist.posterUrl !== '#N/A';
                
                return (
                  <div 
                    key={code}
                    className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-600 relative">
                      {videoInfo && (videoInfo.type === 'youtube' || videoInfo.type === 'vimeo') ? (
                        <iframe
                          src={videoInfo.embedUrl}
                          className="absolute inset-0 w-full h-full"
                          allow="autoplay; encrypted-media"
                        />
                      ) : hasValidPoster ? (
                        <img 
                          src={artist.posterUrl} 
                          alt={artist.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    
                    {/* Artist Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-1">{artist.name}</h3>
                      {artist.country && (
                        <p className="text-sm text-slate-400 mb-3">
                          {[artist.city, artist.state, artist.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                      
                      {artist.bio && (
                        <p className="text-sm text-slate-300 mb-3 line-clamp-2">{artist.bio}</p>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          to={`/artist/${artist.name ? artist.name.toLowerCase().replace(/[^a-z0-9]+/g, '') : code}`}
                          className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm text-center font-medium"
                        >
                          View Profile
                        </Link>
                        {artist.instagram && (
                          <a
                            href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                          >
                            <Instagram />
                          </a>
                        )}
                        {artist.website && (
                          <a
                            href={artist.website.startsWith('http') ? artist.website : `https://${artist.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                          >
                            <Globe />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Footer */}
        <div className="bg-slate-950/90 border-t border-slate-800 py-3 px-4 text-center">
          <p className="text-xs text-slate-500">
            Best viewed on desktop • <Link to="/about" className="text-slate-400 hover:text-white">About</Link>
          </p>
        </div>

        {/* Submission Form */}
        <SubmissionForm 
          isOpen={isSubmissionFormOpen} 
          onClose={() => setIsSubmissionFormOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex flex-col">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out 0.1s backwards;
        }
      `}</style>
      
      {/* Header */}
      <div className="bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 p-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="6" y="6" width="24" height="24" rx="4" 
                      stroke="url(#gradient)" strokeWidth="2" 
                      className="animate-pulse"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Title */}
              <h1 className="text-xl font-bold text-white">MotionMap</h1>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex gap-3 items-center">
            {/* Submit Button */}
            <button
              onClick={() => setIsSubmissionFormOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Submit Your Work
            </button>
            
            {/* Archive Toggle */}
            <button
              onClick={() => setViewMode('archive')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'archive' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Archive - All Time"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            {/* Month Navigation */}
            {viewMode !== 'archive' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  disabled={currentMonthIndex === 0}
                  className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white rounded-lg transition-colors"
                >
                  <ChevronLeft />
                </button>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg min-w-[140px] justify-center">
                  <Calendar />
                  <span className="text-sm font-medium">{displayMonth} {displayYear}</span>
                </div>
                <button
                  onClick={() => navigateMonth(1)}
                  disabled={currentMonthIndex === monthsArchive.length - 1}
                  className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white rounded-lg transition-colors"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Map + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Floating Zoom + Map/Grid Toggle - Flush Top Right Corner */}
          <div className="absolute top-0 right-0 z-50 flex gap-1 bg-slate-700/90 backdrop-blur-sm rounded-bl-lg p-1 shadow-lg">
            {/* Zoom Level Controls */}
            <button
              onClick={() => {
                if (zoomLevel !== 'world') {
                  setZoomLevel('world');
                  setSelectedRegion(null);
                  setSelectedState(null);
                  setSelectedArtist(null);
                }
              }}
              className={`p-2 rounded transition-colors ${
                zoomLevel === 'world' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="World View"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            {selectedRegion && (
              <button
                onClick={() => {
                  if (zoomLevel !== 'country') {
                    setZoomLevel('country');
                    setSelectedState(null);
                    setSelectedArtist(null);
                  }
                }}
                className={`p-2 rounded transition-colors ${
                  zoomLevel === 'country' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title={`${selectedRegion} View`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
            )}
            
            {selectedState && (
              <button
                onClick={() => {
                  if (zoomLevel !== 'state') {
                    setZoomLevel('state');
                    setSelectedArtist(null);
                  }
                }}
                className={`p-2 rounded transition-colors ${
                  zoomLevel === 'state' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title={`${selectedState} View`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
            
            {/* Divider */}
            {(selectedRegion || selectedState) && (
              <div className="w-px bg-slate-600 mx-1"></div>
            )}
            
            {/* Map/Grid Toggle */}
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
          </div>
          
          <div className="flex-1 flex items-start justify-start p-4 overflow-auto">
            <div 
              className="relative mx-auto" 
              style={{ 
                width: gridWidth, 
                height: gridHeight,
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {(() => {
                // Calculate max distance once for all items
                const allPositions = Object.values(currentGrid);
                const maxRow = allPositions.length > 0 ? Math.max(...allPositions.map(([r]) => r)) : 1;
                const maxCol = allPositions.length > 0 ? Math.max(...allPositions.map(([, c]) => c)) : 1;
                const maxDistance = Math.sqrt(maxRow * maxRow + maxCol * maxCol);
                
                return Object.entries(currentGrid).map(([code, [row, col]]) => {
                  const isHovered = hoveredState === code;
                  const hasContent = !!currentData[code];
                  const isSelected = selectedArtist?.code === code;
                  const x = col * (cellSize + gap);
                  const y = row * (cellSize + gap);

                  // Calculate staggered delay with randomization
                  const distanceFromOrigin = Math.sqrt(row * row + col * col);
                  const normalizedDistance = maxDistance > 0 ? distanceFromOrigin / maxDistance : 0;
                  const baseDelay = normalizedDistance * 0.6;
                  const randomDelay = Math.random() * 0.4;
                  const staggerDelay = baseDelay + randomDelay;
                  
                  const baseDuration = 0.4;
                  const randomDuration = Math.random() * 0.2;
                  const transitionDuration = baseDuration + randomDuration;

                  return (
                    <div
                      key={code}
                      className="absolute"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        transform: isHovered ? 'translateY(-8px) scale(1.1)' : 'translateY(0)',
                        zIndex: isHovered ? 10 : (isSelected ? 5 : 1),
                        cursor: 'pointer', // All boxes are now clickable
                        transition: `left ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1) ${staggerDelay}s, top ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1) ${staggerDelay}s, width ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1) ${staggerDelay}s, height ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1) ${staggerDelay}s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)`
                      }}
                      onMouseEnter={() => {
                        if (!('ontouchstart' in window)) {
                          setHoveredState(code); // Hover works on ALL boxes now
                        }
                      }}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => {
                        if (hasContent) {
                          handleItemClick(code);
                        } else {
                          // Empty box - open submission form with country pre-filled
                          const country = code.replace(/-\d+$/, '');
                          setIsSubmissionFormOpen(true);
                          // TODO: Pass country to form to pre-fill
                        }
                      }}
                      onDoubleClick={() => handleItemDoubleClick(code)}
                    >
                      {isHovered && (
                        <div
                          className="absolute inset-0 bg-black/40 rounded-[14px] blur-xl"
                          style={{ transform: 'translateY(8px)' }}
                        />
                      )}
                      <div
                        className={`w-full h-full rounded-[14px] border-2 overflow-hidden relative transition-all duration-200 ${
                          hasContent
                            ? isSelected 
                              ? 'border-indigo-400 shadow-lg shadow-indigo-500/50'
                              : 'border-indigo-500/50 shadow-lg'
                            : isHovered
                              ? 'border-slate-600 bg-slate-800/50'
                              : 'border-slate-700/30'
                        } ${
                          hasContent ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-slate-800/30'
                        }`}
                      >
                        {/* Video or Poster Display */}
                        {(() => {
                          const hasValidVideo = hasContent && currentData[code].videoUrl && 
                                              currentData[code].videoUrl.trim().length > 0 &&
                                              currentData[code].videoUrl !== '#N/A';
                          
                          if (hasValidVideo) {
                            const videoInfo = getVideoEmbedInfo(currentData[code].videoUrl);
                            if (videoInfo) {
                              if (videoInfo.type === 'youtube' || videoInfo.type === 'vimeo') {
                                return (
                                  <div className="absolute inset-0 overflow-hidden rounded-[14px]">
                                    <iframe
                                      src={videoInfo.embedUrl}
                                      className="absolute"
                                      style={{
                                        left: '50%',
                                        top: '50%',
                                        width: '177.78%',
                                        height: '177.78%',
                                        transform: 'translate(-50%, -50%)',
                                        pointerEvents: 'none'
                                      }}
                                      allow="autoplay; encrypted-media"
                                    />
                                  </div>
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
                          
                          return null;
                        })()}
                        
                        {/* Country name on hover - ALL boxes */}
                        {zoomLevel === 'world' && isHovered && (
                          <div className="absolute bottom-2 right-2">
                            <span className="text-xs font-bold text-white drop-shadow-lg">
                              {code.replace(/-\d+$/, '')}
                            </span>
                            {!hasContent && (
                              <div className="text-[10px] text-white/60 mt-0.5">
                                Submit here
                              </div>
                            )}
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
                });
              })()}
            </div>
          </div>
          
          {/* Footer Credits */}
          <div className="bg-slate-950/50 border-t border-slate-800 py-3 px-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
              <div className="flex items-center gap-4 text-slate-500">
                <span>Designed by <a href="https://blueteamstudio.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">BlueTeam Studio</a></span>
                <span>•</span>
                <span>Sound by <a href="https://www.thechicken.net/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">The Chicken</a></span>
              </div>
              <div className="flex gap-4">
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-slate-950 border-l border-slate-800 flex flex-col overflow-hidden flex-shrink-0">
          {selectedArtist ? (
            <div key={selectedArtist.code} className="flex-1 flex flex-col overflow-hidden animate-fadeIn">
              {/* Artist Header */}
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 relative flex-shrink-0 animate-slideDown">
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
              <div className="flex-1 overflow-y-auto animate-slideUp">
                {/* Video/Poster */}
                {(() => {
                  const hasValidVideo = selectedArtist.videoUrl && 
                                       selectedArtist.videoUrl.trim().length > 0 &&
                                       selectedArtist.videoUrl !== '#N/A';
                  
                  if (hasValidVideo) {
                    const videoInfo = getVideoEmbedInfo(selectedArtist.videoUrl);
                    if (videoInfo) {
                      if (videoInfo.type === 'youtube' || videoInfo.type === 'vimeo') {
                        return (
                          <div className="mb-4">
                            <iframe
                              src={videoInfo.embedUrl}
                              className="w-full aspect-video"
                              allow="autoplay; encrypted-media; fullscreen"
                            />
                            <a
                              href={selectedArtist.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white transition-colors text-sm mb-4"
                            >
                              {videoInfo.type === 'youtube' ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ marginTop: '-5px' }}>
                                  <path d="M23.977 6.416c-.105 2.338-1.382 5.854-3.828 10.548-2.496 4.836-4.605 7.254-6.328 7.254-1.067 0-1.969-.98-2.706-2.939l-1.48-5.418c-.547-1.96-1.135-2.939-1.762-2.939-.137 0-.617.287-1.438.862L5.5 12.5l.973-1.173c1.24-1.214 2.175-1.865 2.805-1.955 1.488-.143 2.406.875 2.754 3.051.375 2.366.636 3.837.785 4.414.44 1.995.926 2.992 1.457 2.992.411 0 1.026-.648 1.848-1.944.824-1.297 1.266-2.283 1.326-2.958.12-1.122-.324-1.683-1.332-1.683-.472 0-.959.107-1.46.322.969-3.171 2.82-4.715 5.551-4.631 2.024.062 2.979 1.369 2.867 3.921z"/>
                                </svg>
                              )}
                              <span>Watch on {videoInfo.type === 'youtube' ? 'YouTube' : 'Vimeo'}</span>
                            </a>
                          </div>
                        );
                      } else if (videoInfo.type === 'direct') {
                        return (
                          <video
                            ref={sidebarVideoRef}
                            className="w-full aspect-video mb-4 object-cover"
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
                  
                  const hasValidPoster = selectedArtist.posterUrl && 
                                        selectedArtist.posterUrl.trim().length > 0 &&
                                        selectedArtist.posterUrl !== '#N/A';
                  
                  if (hasValidPoster) {
                    return (
                      <img 
                        src={selectedArtist.posterUrl} 
                        alt={selectedArtist.name}
                        className="w-full aspect-video object-cover mb-4"
                      />
                    );
                  }
                  
                  return (
                    <div className="w-full aspect-video bg-gradient-to-br from-indigo-600 to-purple-600 mb-4" />
                  );
                })()}

                {/* Content with padding */}
                <div className="px-6">
                  {/* Bio */}
                  {selectedArtist.bio && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">About</h3>
                      <p className="text-slate-300 leading-relaxed">{selectedArtist.bio}</p>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 mb-4">
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

                  {/* View Artist Page Button */}
                  {selectedArtist.name && (
                    <Link
                      to={`/artist/${generateSlug(selectedArtist.name)}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors mb-4"
                    >
                      <span className="text-sm font-medium">View Full Profile</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}

                  {/* Share Button */}
                  <button
                    onClick={() => {
                      try {
                        if (typeof window !== 'undefined' && window.location && selectedArtist.name) {
                          const slug = generateSlug(selectedArtist.name);
                          const shareUrl = `${window.location.origin}/artist/${slug}`;
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(shareUrl).then(() => {
                              alert('Link copied! Share this URL to link directly to this artist.');
                            });
                          }
                        }
                      } catch (e) {
                        console.error('Error sharing:', e);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors mb-6"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-sm font-medium">Share Artist</span>
                  </button>

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
            </div>
          ) : (
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
