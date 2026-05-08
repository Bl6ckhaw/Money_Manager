export const lightTheme = {
  // backgrounds
  background: '#f5f5f5',
  card: '#ffffff',
  input: '#fafafa',
  bgTabs: '#ffffff',

  // text
  text: '#222222',
  textSecondary: '#888888',
  textTertiary: '#aaaaaa',
  textTabs: '#222222',
  textTabsSecondary: '#888888',

  // brand
  primary: '#6366f1',
  primaryLight: '#ede9fe',

  // status
  income: '#22c55e',
  expense: '#ef4444',

  // ui
  border: '#eeeeee',
  divider: '#f1f1f1',
  overlay: 'rgba(0,0,0,0.5)',
  cardHighlight: 'rgba(255,255,255,0.15)',
};

export const darkTheme: typeof lightTheme = {
  // backgrounds
  background: '#0f0f0f',
  card: '#1c1c1e',
  input: '#2c2c2e',
  bgTabs: '#1c1c1e',
  // text
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  textTertiary: '#666666',
  textTabs: '#ffffff',
  textTabsSecondary: '#aaaaaa',

  // brand
  primary: '#818cf8',
  primaryLight: '#312e81',

  // status
  income: '#4ade80',
  expense: '#f87171',

  // ui
  border: '#2c2c2e',
  divider: '#2c2c2e',
  overlay: 'rgba(0,0,0,0.7)',
  cardHighlight: 'rgba(255,255,255,0.08)',
};

export type Theme = typeof lightTheme;

export const COLORBLIND_PALETTES = {
  deuteranopia: {
    Food: '#0072B2',      
    Transport: '#E69F00',   
    Salary: '#56B4E9',     
    Entertainment: '#CC79A7', 
    Health: '#F0E442',     
    Investment: '#009E73', 
    Other: '#617C8A',  
  },
  protanopia: {
    Food: '#0072B2',       
    Transport: '#56B4E9',   
    Salary: '#009E73',     
    Entertainment: '#F0E442',
    Health: '#CC79A7',      
    Investment: '#E69F00',   
    Other: '#607D8B',    
  },
  tritanopia: {
    Food: '#D55E00',       
    Transport: '#CC79A7', 
    Salary: '#E69F00',      
    Entertainment: '#999999', 
    Health: '#7D8B3D',   
    Investment: '#F0E442',      
    Other: '#8B0000',       
  },
} as const;

export type ColorBlindType = keyof typeof COLORBLIND_PALETTES;