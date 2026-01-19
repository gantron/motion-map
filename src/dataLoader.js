// src/dataLoader.js
// This file handles loading data from Google Sheets

const SHEET_URLS = {
  world: https://docs.google.com/spreadsheets/d/e/2PACX-1vSNm8Ske4pUlToMxmtWvB0mdv2OUzPxMZZruAMAZJCF6p8vhYaVeXU02CXVRxwumlvSXPEA2QYHWGVh/pubhtml, // Replace with your published CSV URL
  USA: https://docs.google.com/spreadsheets/d/e/2PACX-1vSNm8Ske4pUlToMxmtWvB0mdv2OUzPxMZZruAMAZJCF6p8vhYaVeXU02CXVRxwumlvSXPEA2QYHWGVh/pubhtml,     // Replace with your USA sheet CSV URL (optional)
  // Add more countries as needed:
  // Japan: https://docs.google.com/spreadsheets/d/e/2PACX-1vSNm8Ske4pUlToMxmtWvB0mdv2OUzPxMZZruAMAZJCF6p8vhYaVeXU02CXVRxwumlvSXPEA2QYHWGVh/pubhtml,
  // UK: https://docs.google.com/spreadsheets/d/e/2PACX-1vSNm8Ske4pUlToMxmtWvB0mdv2OUzPxMZZruAMAZJCF6p8vhYaVeXU02CXVRxwumlvSXPEA2QYHWGVh/pubhtml,
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
function transformSheetData(rows, isWorldView = true) {
  const dataByMonth = {};
  
  rows.forEach(row => {
    const month = row.Month; // Format: 2026-01
    const code = isWorldView ? row.Country : row.State;
    
    if (!month || !code) return;
    
    if (!dataByMonth[month]) {
      dataByMonth[month] = {};
    }
    
    dataByMonth[month][code] = {
      name: row.Name,
      country: isWorldView ? row.Country : 'USA',
      state: isWorldView ? undefined : row.State,
      region: isWorldView ? getRegion(row.Country) : undefined,
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
      countries: {}
    };
    
    // Load world data
    if (SHEET_URLS.world && SHEET_URLS.world !== https://docs.google.com/spreadsheets/d/e/2PACX-1vSNm8Ske4pUlToMxmtWvB0mdv2OUzPxMZZruAMAZJCF6p8vhYaVeXU02CXVRxwumlvSXPEA2QYHWGVh/pubhtml) {
      const response = await fetch(SHEET_URLS.world);
      const text = await response.text();
      const rows = parseCSV(text);
      data.world = transformSheetData(rows, true);
    }
    
    // Load country-specific data (USA, etc.)
    for (const [country, url] of Object.entries(SHEET_URLS)) {
      if (country !== 'world' && url && !url.includes('YOUR_')) {
        const response = await fetch(url);
        const text = await response.text();
        const rows = parseCSV(text);
        data.countries[country] = transformSheetData(rows, false);
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
