// src/dataLoader.js
// This file handles loading data from Google Sheets

const SHEET_URLS = {
  world: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSNm8Ske4pUlToMxmtWvB0mdv2OUzPxMZZruAMAZJCF6p8vhYaVeXU02CXVRxwumlvSXPEA2QYHWGVh/pub?gid=1980238028&single=true&output=csv',
  
  // Country-level sheets (states/regions within country)
  countries: {
    USA: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSNm8Ske4pUlToMxmtWvB0mdv2OUzPxMZZruAMAZJCF6p8vhYaVeXU02CXVRxwumlvSXPEA2QYHWGVh/pub?gid=264097165&single=true&output=csv',
    // Add more countries as needed:
    // Japan: 'YOUR_JAPAN_SHEET_URL',
    // UK: 'YOUR_UK_SHEET_URL',
  },
  
  // State-level sheets (cities within state/region)
  states: {
    'USA-NC': 'YOUR_NC_SHEET_URL', // Format: cities in North Carolina
    'USA-CA': 'YOUR_CA_SHEET_URL', // Format: cities in California
    // Add more states as needed:
    // 'USA-NY': 'YOUR_NY_SHEET_URL',
    // 'Japan-Tokyo': 'YOUR_TOKYO_SHEET_URL',
  }
};

// Parse CSV text into array of objects
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj;
  });
}

// Convert sheet data to the app's data structure
// level: 'world', 'country', or 'state'
function transformSheetData(rows, level = 'world') {
  const dataByMonth = {};
  
  rows.forEach(row => {
    const month = row.Month; // Format: 2026-01
    let code;
    
    // Determine the code based on level
    if (level === 'world') {
      code = row.Country;
    } else if (level === 'country') {
      code = row.State || row.Region || row.Prefecture;
    } else if (level === 'state') {
      code = row.City;
    }
    
    if (!month || !code) return;
    
    if (!dataByMonth[month]) {
      dataByMonth[month] = {};
    }
    
    dataByMonth[month][code] = {
      name: row.Name,
      country: row.Country || undefined,
      state: row.State || row.Region || row.Prefecture || undefined,
      city: row.City || undefined,
      region: level === 'world' ? getRegion(row.Country) : undefined,
      bio: row.Bio,
      website: row.Website,
      instagram: row.Instagram,
      videoUrl: row.VideoURL || null,
      posterUrl: row.PosterURL || null,
      monthsActive: 1 // You can calculate this if artists appear in multiple months
    };
  });
  
  return dataByMonth;
}

// Helper function to determine region from country
function getRegion(country) {
  const regions = {
    'USA': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',
    'UK': 'Europe',
    'France': 'Europe',
    'Germany': 'Europe',
    'Spain': 'Europe',
    'Italy': 'Europe',
    'Japan': 'Asia',
    'China': 'Asia',
    'Korea': 'Asia',
    'India': 'Asia',
    'Australia': 'Oceania',
    'Brazil': 'South America',
    'Argentina': 'South America',
  };
  return regions[country] || 'Other';
}

// Main function to load all data
export async function loadData() {
  try {
    const data = {
      world: {},
      countries: {},
      states: {}
    };
    
    // Load world data
    if (SHEET_URLS.world) {
      const response = await fetch(SHEET_URLS.world);
      const text = await response.text();
      const rows = parseCSV(text);
      data.world = transformSheetData(rows, 'world');
    }
    
    // Load country-specific data (USA → states, Japan → regions, etc.)
    if (SHEET_URLS.countries) {
      for (const [country, url] of Object.entries(SHEET_URLS.countries)) {
        if (url) {
          const response = await fetch(url);
          const text = await response.text();
          const rows = parseCSV(text);
          data.countries[country] = transformSheetData(rows, 'country');
        }
      }
    }
    
    // Load state-specific data (NC → cities, CA → cities, etc.)
    if (SHEET_URLS.states) {
      for (const [stateKey, url] of Object.entries(SHEET_URLS.states)) {
        if (url && !url.includes('YOUR_')) {
          const response = await fetch(url);
          const text = await response.text();
          const rows = parseCSV(text);
          data.states[stateKey] = transformSheetData(rows, 'state');
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error loading data from Google Sheets:', error);
    // Return empty data structure on error
    return {
      world: {},
      countries: {}
    };
  }
}

// Extract unique months from data for navigation
export function getAvailableMonths(data) {
  const monthsSet = new Set();
  
  // Get months from world data
  Object.keys(data.world || {}).forEach(month => monthsSet.add(month));
  
  // Get months from country data
  Object.values(data.countries || {}).forEach(countryData => {
    Object.keys(countryData).forEach(month => monthsSet.add(month));
  });
  
  // Convert to sorted array of {month, year} objects
  return Array.from(monthsSet)
    .sort()
    .map(monthStr => {
      const [year, month] = monthStr.split('-');
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      return {
        month: monthNames[parseInt(month) - 1],
        year: parseInt(year),
        key: monthStr
      };
    });
}
