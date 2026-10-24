export type FontCategory = 
  | 'Accessibility-Focused' 
  | 'Sans-Serif' 
  | 'Serif' 
  | 'Monospace' 
  | 'Handwriting & Script';

export type FontSource = 'Google Fonts' | 'System Font' | 'Bundled';

export interface AccessibleFontItem {
  id: string;
  name: string;
  family: string;
  category: FontCategory;
  source: FontSource;
  description: string;
  bestFor: string;
  isPopular?: boolean;
}

export const ACCESSIBLE_FONTS: AccessibleFontItem[] = [
  // 1. Accessibility-Focused
  {
    id: 'atkinson-hyperlegible',
    name: 'Atkinson Hyperlegible',
    family: '"Atkinson Hyperlegible", sans-serif',
    category: 'Accessibility-Focused',
    source: 'Google Fonts',
    description: 'Designed by the Braille Institute to maximize character recognition with distinct letterforms (e.g. O vs 0, l vs 1 vs I).',
    bestFor: 'Low vision, visual crowding, high legibility reading',
    isPopular: true,
  },
  {
    id: 'lexend',
    name: 'Lexend',
    family: '"Lexend", sans-serif',
    category: 'Accessibility-Focused',
    source: 'Google Fonts',
    description: 'Engineered by educational researchers to significantly reduce visual stress and improve words-per-minute reading comprehension.',
    bestFor: 'Fluency, visual tracking, dyslexia-friendly preference',
    isPopular: true,
  },
  {
    id: 'opendyslexic',
    name: 'OpenDyslexic',
    family: '"OpenDyslexic", "OpenDyslexic-Regular", sans-serif',
    category: 'Accessibility-Focused',
    source: 'Bundled',
    description: 'High asymmetry letterforms with weighted gravity bottoms engineered to mitigate letter inversion, flipping, and rotation.',
    bestFor: 'Dyslexia-specific reading, letter stabilization',
    isPopular: true,
  },

  // 2. Common Office Standards (System Fonts)
  {
    id: 'aptos',
    name: 'Aptos',
    family: 'Aptos, "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    category: 'Sans-Serif',
    source: 'System Font',
    description: 'Modern default neo-grotesque with warm humanist contours and open apertures.',
    bestFor: 'General modern business documents',
    isPopular: true,
  },
  {
    id: 'calibri',
    name: 'Calibri',
    family: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif',
    category: 'Sans-Serif',
    source: 'System Font',
    description: 'Classic office standard with subtle rounded corners and clean metrics.',
    bestFor: 'Corporate letters, reports, everyday typing',
    isPopular: true,
  },
  {
    id: 'arial',
    name: 'Arial',
    family: 'Arial, Helvetica, "Nimbus Sans L", sans-serif',
    category: 'Sans-Serif',
    source: 'System Font',
    description: 'Ubiquitous sans-serif with neutral proportions and universal cross-device availability.',
    bestFor: 'Universal cross-platform compatibility',
  },
  {
    id: 'times-new-roman',
    name: 'Times New Roman',
    family: '"Times New Roman", Times, Georgia, serif',
    category: 'Serif',
    source: 'System Font',
    description: 'The global standard for academic papers, legal filings, and formal journals.',
    bestFor: 'Legal briefs, university submissions, manuscripts',
    isPopular: true,
  },
  {
    id: 'georgia',
    name: 'Georgia',
    family: 'Georgia, Cambria, "Times New Roman", serif',
    category: 'Serif',
    source: 'System Font',
    description: 'Screen-optimized serif with generous x-height and elegant calligraphic terminals.',
    bestFor: 'Long-form editorial reading on digital displays',
    isPopular: true,
  },
  {
    id: 'verdana',
    name: 'Verdana',
    family: 'Verdana, Geneva, sans-serif',
    category: 'Sans-Serif',
    source: 'System Font',
    description: 'Designed specifically for low-resolution displays with extra-wide letter spacing and clear counterforms.',
    bestFor: 'Maximum digital clarity at smaller sizes',
  },
  {
    id: 'tahoma',
    name: 'Tahoma',
    family: 'Tahoma, Verdana, Segoe, sans-serif',
    category: 'Sans-Serif',
    source: 'System Font',
    description: 'Compact sans-serif with narrow letter spacing and tight apertures.',
    bestFor: 'Tables, dense figures, sidebars',
  },
  {
    id: 'trebuchet-ms',
    name: 'Trebuchet MS',
    family: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", sans-serif',
    category: 'Sans-Serif',
    source: 'System Font',
    description: 'Humanist sans with open loops and distinctive character cuts.',
    bestFor: 'Headings, presentation summaries',
  },
  {
    id: 'courier-new',
    name: 'Courier New',
    family: '"Courier New", Courier, monospace',
    category: 'Monospace',
    source: 'System Font',
    description: 'Classic typewriter monospaced face with fixed-pitch character widths.',
    bestFor: 'Screenplays, draft manuscripts, tabular data',
  },

  // 3. Web & Display Sans-Serif
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", sans-serif',
    category: 'Sans-Serif',
    source: 'Google Fonts',
    description: 'Geometric yet friendly modern grotesque with clean optical balancing.',
    bestFor: 'Executive reports, pitch decks, resumes',
    isPopular: true,
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    family: '"DM Sans", sans-serif',
    category: 'Sans-Serif',
    source: 'Google Fonts',
    description: 'Low-contrast geometric sans tailored for high-density document scanning.',
    bestFor: 'Financial statements, proposal documents',
  },
  {
    id: 'inter',
    name: 'Inter',
    family: '"Inter", sans-serif',
    category: 'Sans-Serif',
    source: 'Google Fonts',
    description: 'Tall x-height crafted specially for user interfaces and crisp text rendering.',
    bestFor: 'Documentation, multi-column articles',
  },

  {
    id: 'outfit',
    name: 'Outfit',
    family: '"Outfit", sans-serif',
    category: 'Sans-Serif',
    source: 'Google Fonts',
    description: 'Clean, modern geometric sans designed for modern branding and tech whitepapers.',
    bestFor: 'Modern tech proposals, pitch decks, contemporary briefs',
    isPopular: true,
  },
  {
    id: 'manrope',
    name: 'Manrope',
    family: '"Manrope", sans-serif',
    category: 'Sans-Serif',
    source: 'Google Fonts',
    description: 'Semi-geometric grotesque engineered for maximum numerical clarity and legibility.',
    bestFor: 'Financial reports, data tables, metrics summaries',
    isPopular: true,
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: '"Montserrat", sans-serif',
    category: 'Sans-Serif',
    source: 'Google Fonts',
    description: 'Inspired by traditional urban signage of Buenos Aires with wide geometric proportions.',
    bestFor: 'Impactful titles, headings, cover pages',
    isPopular: true,
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: '"Poppins", sans-serif',
    category: 'Sans-Serif',
    source: 'Google Fonts',
    description: 'Geometric sans-serif with friendly circular curves and balanced stems.',
    bestFor: 'Marketing collateral, user guides, presentations',
    isPopular: true,
  },
  {
    id: 'segoe-ui',
    name: 'Segoe UI',
    family: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
    category: 'Sans-Serif',
    source: 'System Font',
    description: 'Clean, neutral humanist sans-serif used in modern enterprise operating systems.',
    bestFor: 'Everyday corporate documentation, memos',
  },

  // 4. Classic & Editorial Serif
  {
    id: 'playfair',
    name: 'Playfair Display',
    family: '"Playfair Display", serif',
    category: 'Serif',
    source: 'Google Fonts',
    description: 'High-contrast transitional serif with sharp bracketed serifs and dramatic ball terminals.',
    bestFor: 'Article titles, certificate headings, formal covers',
  },
  {
    id: 'cormorant-garamond',
    name: 'Cormorant Garamond',
    family: '"Cormorant Garamond", serif',
    category: 'Serif',
    source: 'Google Fonts',
    description: 'Extravagant traditional serif inspired by Claude Garamont with elegant calligraphic drama.',
    bestFor: 'Formal certificates, literary publications, awards',
  },
  {
    id: 'eb-garamond',
    name: 'EB Garamond',
    family: '"EB Garamond", serif',
    category: 'Serif',
    source: 'Google Fonts',
    description: 'Classic humanist renaissance serif prized for continuous long-form reading.',
    bestFor: 'Academic theses, book manuscripts, formal publishing',
    isPopular: true,
  },
  {
    id: 'palatino',
    name: 'Palatino / Book Antiqua',
    family: '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif',
    category: 'Serif',
    source: 'System Font',
    description: 'Calligraphic serif designed by Hermann Zapf with broad pen strokes and graceful proportions.',
    bestFor: 'Executive summaries, printed reports, legal opinions',
  },
  {
    id: 'cinzel',
    name: 'Cinzel Decorative',
    family: '"Cinzel", serif',
    category: 'Serif',
    source: 'Google Fonts',
    description: 'Inscriptional Roman capitals reflecting classical antiquity proportions.',
    bestFor: 'Cover titles, certificates, legal charter banners',
  },

  // 5. Monospace & Code
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    family: '"JetBrains Mono", monospace',
    category: 'Monospace',
    source: 'Google Fonts',
    description: 'Engineered for developers with increased letter height and distinctive code glyphs.',
    bestFor: 'Code snippets, technical specs, financial tables',
    isPopular: true,
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    family: '"Fira Code", monospace',
    category: 'Monospace',
    source: 'Google Fonts',
    description: 'Monospaced font with programming ligatures and high contrast punctuation.',
    bestFor: 'Technical documentation, formulas, architecture specs',
  },
  {
    id: 'space-mono',
    name: 'Space Mono',
    family: '"Space Mono", monospace',
    category: 'Monospace',
    source: 'Google Fonts',
    description: 'Geometric monospace font with retro-futuristic character.',
    bestFor: 'Technical metrics, telemetry logs',
  },
  {
    id: 'lucida-console',
    name: 'Lucida Console',
    family: '"Lucida Console", Monaco, monospace',
    category: 'Monospace',
    source: 'System Font',
    description: 'Clear fixed-width font with large x-height and sturdy shapes.',
    bestFor: 'Data dumps, monospace tabular alignment',
  },

  // 6. Handwriting & Signature
  {
    id: 'caveat',
    name: 'Caveat',
    family: '"Caveat", cursive',
    category: 'Handwriting & Script',
    source: 'Google Fonts',
    description: 'Organic handwritten brush with natural variations and open loop terminals.',
    bestFor: 'Digital signatures, personal annotations, sticky notes',
  },
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    family: '"Dancing Script", cursive',
    category: 'Handwriting & Script',
    source: 'Google Fonts',
    description: 'Lively casual script where letters bounce gently along the baseline.',
    bestFor: 'Informal greetings, invitations, endorsements',
  },
];

export const FONT_SIZES = [
  8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72
];
