// grids.js - All grid definitions in one clean file
// Import this into App.jsx with: import { worldGridBase, usStatesMapGrid, indiaStateGrid } from './grids';

// ========================================
// WORLD GRID
// ========================================
export const worldGridBase = {
  // NORTH AMERICA (3 countries, 9 tiles)
  'Canada-1':[0,1], 'Canada-2':[0,2],
  'USA-1':[1,0], 'USA-2':[1,1], 'USA-3':[1,2],
  'USA-4':[2,1], 'USA-5':[2,2],
  'Mexico-1':[2,0],
  'Mexico-2':[3,1],
  
  // CENTRAL/SOUTH AMERICA (6 countries, 7 tiles)
  'Costa Rica-1':[4,2],
  'Venezuela-1':[5,2],
  'Colombia-1':[5,3],
  'Brazil-1':[6,2], 'Brazil-2':[6,3],
  'Peru-1':[6,1],
  'Argentina-1':[7,2],
  
  // EUROPE (7 countries, 7 tiles)
  'UK-1':[1,5],
  'France-1':[2,5],
  'Portugal-1':[3,4],
  'Spain-1':[3,5],
  'Germany-1':[2,6],
  'Italy-1':[3,6],
  'Poland-1':[2,7],
  
  // RUSSIA (1 country, 4 tiles)
  'Russia-1':[0,8], 'Russia-2':[0,9], 'Russia-3':[0,10],
  'Russia-4':[1,9],
  
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
  'China-3':[1,10],
  'India-1':[4,8], 'India-2':[5,8],
  'Japan-1':[2,11],
  'Korea-1':[2,10],
  
  // SOUTHEAST ASIA (3 countries, 3 tiles)
  'Thailand-1':[3,9],
  'Vietnam-1':[3,10],
  'Indonesia-1':[4,10],
  
  // OCEANIA (2 countries, 3 tiles)
  'Australia-1':[6,10], 'Australia-2':[6,11],
  'New Zealand-1':[7,11]
};

// ========================================
// USA STATES GRID
// ========================================
export const usStatesMapGrid = {
  'WA': [0, 0], 'ME': [0, 11],
  'OR': [1, 0], 'ID': [1, 1], 'MT': [1, 2], 'ND': [1, 3], 'MN': [1, 4], 'WI': [1, 5], 'MI': [1, 6], 'VT': [1, 9], 'NH': [1, 10],
  'CA': [2, 0], 'NV': [2, 1], 'WY': [2, 2], 'SD': [2, 3], 'IA': [2, 4], 'IL': [2, 5], 'IN': [2, 6], 'OH': [2, 7], 'PA': [2, 8], 'NY': [2, 9], 'MA': [2, 10], 'CT': [2, 11], 'RI': [2, 12],
  'UT': [3, 1], 'CO': [3, 2], 'NE': [3, 3], 'MO': [3, 4], 'KY': [3, 5], 'WV': [3, 6], 'VA': [3, 7], 'MD': [3, 8], 'DE': [3, 9], 'NJ': [3, 10],
  'AZ': [4, 3], 'NM': [4, 4], 'KS': [4, 5], 'AR': [4, 6], 'TN': [4, 7], 'NC': [4, 8],
  'OK': [5, 3], 'LA': [5, 4], 'MS': [5, 5], 'AL': [5, 6], 'GA': [5, 7], 'SC': [5, 8],
  'TX': [6, 4], 'FL': [6, 9],
  'AK': [8, 0], 'HI': [8, 1]
};

// ========================================
// INDIA STATES GRID
// ========================================
export const indiaStateGrid = {
  // Far North
  'Ladakh-1': [0, 3],
  
  // North
  'Jammu and Kashmir-1': [1, 3],
  'Chandigarh-1': [1, 2],
  
  'Punjab-1': [2, 2],
  'Himachal Pradesh-1': [2, 3],
  'Uttarakhand-1': [2, 4],
  'Sikkim-1': [2, 6],
  'Arunachal Pradesh-1': [2, 9],
  
  // North-Central
  'Haryana-1': [3, 2],
  'Delhi-1': [3, 3],
  'Uttar Pradesh-1': [3, 4],
  'Bihar-1': [3, 5],
  'West Bengal-1': [3, 6],
  'Assam-1': [3, 7],
  'Nagaland-1': [3, 8],
  
  // Central
  'Gujarat-1': [4, 1],
  'Rajasthan-1': [4, 2],
  'Madhya Pradesh-1': [4, 3],
  'Jharkhand-1': [4, 4],
  'Kolkata-1': [4, 5],
  'Meghalaya-1': [4, 7],
  'Manipur-1': [4, 8],
  
  // Central-South
  'Dadra and Nagar Haveli-1': [5, 2],
  'Chhattisgarh-1': [5, 3],
  'Telangana-1': [5, 4],
  'Odisha-1': [5, 5],
  'Tripura-1': [5, 7],
  'Mizoram-1': [5, 8],
  
  // South
  'Mumbai-1': [6, 2],
  'Maharashtra-1': [6, 3],
  'Andhra Pradesh-1': [6, 4],
  
  // Far South
  'Lakshadweep-1': [7, 0],
  'Goa-1': [7, 2],
  'Bengaluru-1': [7, 3],
  'Puducherry-1': [7, 4],
  
  // Bottom
  'Karnataka-1': [8, 3],
  'Tamil Nadu-1': [8, 4],
  'Andaman and Nicobar-1': [8, 6],
  
  // Very bottom
  'Kerala-1': [9, 3]
};
