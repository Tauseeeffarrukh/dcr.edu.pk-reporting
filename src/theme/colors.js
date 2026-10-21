// Dar-e-Arqam Schools Monitoring & Evaluation System
// Etoile Contrast Palette: #082052 (Deep Midnight Navy) and #F8F0E5 (Warm Alabaster Linen)
// Based on: https://i.pinimg.com/736x/3d/32/be/3d32be736246bcd2c36235638664c840.jpg

export const colors = {
  // Brand Core: The Two Official Palette Colors
  navy: '#082052',            // Primary Brand Midnight Navy
  cream: '#F8F0E5',           // Primary Brand Warm Alabaster Canvas
  white: '#ffffff',           // Pure White Surface

  // Navy Tonal Spectrum
  navyDark: '#041029',        // Darkest tone for headers/footers
  navyHover: '#0e2e6e',       // Interactive hover
  navyLight: '#153e8a',       // Secondary interactive blue
  navySurface: '#edf3fa',     // Very soft cool-tint for badges

  // Alabaster Tonal Spectrum
  creamCard: '#ffffff',       // Pure white cards floating on warm alabaster canvas
  creamSurface: '#f1e7d8',    // Warm alabaster tinted surface for subtle headers/stripes
  creamHover: '#ede0ce',      // Warm alabaster hover state
  creamBorder: '#e2d5c1',     // Elegant warm hairline border
  creamBorderDark: '#cdbfa7', // Deeper warm border

  // Celestial Star / Etoile Gold Accent (inspired by the 4-pointed star motif)
  gold: '#C59B27',
  goldHover: '#ad871f',
  goldLight: '#faf3df',

  // High-Legibility Typography
  textPrimary: '#082052',     // Editorial titles and bold numbers in Brand Navy
  textBody: '#222d3d',        // Long reading text in readable slate charcoal
  textSecondary: '#5a677a',   // Muted labels and secondary descriptions
  textMuted: '#7f8c9f',       // Quiet metadata
  textOnNavy: '#F8F0E5',      // Warm alabaster text on midnight navy surfaces

  // Canvas & Structure
  background: '#F8F0E5',      // Warm Alabaster Canvas
  backgroundCream: '#F8F0E5',
  cardBackground: '#ffffff',
  cardHover: '#faf6f0',
  divider: '#e2d5c1',
  border: '#e2d5c1',
  borderLight: '#eee5d7',

  // Aliases for legacy component compatibility
  primary: '#082052',
  primaryDark: '#041029',
  primaryLight: '#153e8a',
  primarySurface: '#f1e7d8',
  primaryMuted: '#153e8a',
  accent: '#C59B27',
  accentHover: '#ad871f',
  accentLight: '#faf3df',
  cyan: '#153e8a',
  charcoal: '#222d3d',

  // Workflow Status Colors
  statusDraft: '#5a677a',
  statusInProgress: '#153e8a',
  statusSubmitted: '#C59B27',
  statusUnderReview: '#4f46e5',
  statusReturned: '#9e2a2b',
  statusResubmitted: '#153e8a',
  statusApproved: '#082052',
  statusRejected: '#dc2626',
  statusArchived: '#475569',

  // Performance Rating Category Colors
  highlyEffective: '#082052', // Deep Midnight Navy (A1)
  effective: '#1c499c',       // Royal Indigo (A)
  moderatelyEffective: '#C59B27', // Etoile Amber/Gold (B)
  lessEffective: '#d97706',   // Warm Ochre (C)
  ineffective: '#9e2a2b',     // Deep Crimson (D)

  // Functional Semantic Colors
  success: '#082052',
  warning: '#C59B27',
  danger: '#9e2a2b',
  info: '#153e8a',

  // Dark Mode Overrides (Deep Midnight Navy Canvas)
  dark: {
    background: '#041029',
    backgroundCard: '#082052',
    cardBackground: '#082052',
    cardHover: '#0d2b6b',
    border: '#153675',
    textPrimary: '#F8F0E5',
    textSecondary: '#d8cebe',
    textMuted: '#9aa5b5',
    divider: '#153675',
  },
};

export default colors;
