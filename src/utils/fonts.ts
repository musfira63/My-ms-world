export interface FontItem {
  id: string;
  name: string;
  category: 'Modern Sans' | 'Editorial Serif' | 'Display' | 'Monospace' | 'Handwriting' | 'Decorative';
  family: string;
  preview: string;
  googleFontSlug?: string;
}

export const AVAILABLE_FONTS: FontItem[] = [
  // ==========================================
  // 1. MODERN SANS-SERIF
  // ==========================================
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', category: 'Modern Sans', family: '"Plus Jakarta Sans", sans-serif', preview: 'Executive & Contemporary' },
  { id: 'outfit', name: 'Outfit', category: 'Modern Sans', family: '"Outfit", sans-serif', preview: 'Geometric Precision' },
  { id: 'manrope', name: 'Manrope', category: 'Modern Sans', family: '"Manrope", sans-serif', preview: 'Balanced High Legibility' },
  { id: 'dm-sans', name: 'DM Sans', category: 'Modern Sans', family: '"DM Sans", sans-serif', preview: 'Clean Professional Tone' },
  { id: 'urbanist', name: 'Urbanist', category: 'Modern Sans', family: '"Urbanist", sans-serif', preview: 'Sleek Minimalist Sans' },
  { id: 'inter', name: 'Inter', category: 'Modern Sans', family: '"Inter", sans-serif', preview: 'Digital Screen Standard' },
  { id: 'poppins', name: 'Poppins', category: 'Modern Sans', family: '"Poppins", sans-serif', preview: 'Friendly Geometric Rounded' },
  { id: 'montserrat', name: 'Montserrat', category: 'Modern Sans', family: '"Montserrat", sans-serif', preview: 'Urban Architectural' },
  { id: 'public-sans', name: 'Public Sans', category: 'Modern Sans', family: '"Public Sans", sans-serif', preview: 'Official Public Sector' },
  { id: 'work-sans', name: 'Work Sans', category: 'Modern Sans', family: '"Work Sans", sans-serif', preview: 'Warm Optimistic Grotesque' },
  { id: 'raleway', name: 'Raleway', category: 'Modern Sans', family: '"Raleway", sans-serif', preview: 'Sophisticated Elegant Sans' },
  { id: 'quicksand', name: 'Quicksand', category: 'Modern Sans', family: '"Quicksand", sans-serif', preview: 'Soft Rounded Friendly' },
  { id: 'figtree', name: 'Figtree', category: 'Modern Sans', family: '"Figtree", sans-serif', preview: 'Crisp Modern Editorial' },
  { id: 'jost', name: 'Jost', category: 'Modern Sans', family: '"Jost", sans-serif', preview: 'Futura Inspired Bauhaus' },
  { id: 'nunito', name: 'Nunito', category: 'Modern Sans', family: '"Nunito", sans-serif', preview: 'Smooth Humane Curves' },
  { id: 'system-sans', name: 'Calibri / Arial', category: 'Modern Sans', family: 'Calibri, Arial, sans-serif', preview: 'Classic Office Native' },

  // ==========================================
  // 2. EDITORIAL SERIF & CLASSIC
  // ==========================================
  { id: 'playfair', name: 'Playfair Display', category: 'Editorial Serif', family: '"Playfair Display", serif', preview: 'High-Fashion & Luxury' },
  { id: 'merriweather', name: 'Merriweather', category: 'Editorial Serif', family: '"Merriweather", serif', preview: 'Long-Form Reading Comfort' },
  { id: 'lora', name: 'Lora', category: 'Editorial Serif', family: '"Lora", serif', preview: 'Calligraphic Literary Flow' },
  { id: 'cormorant', name: 'Cormorant Garamond', category: 'Editorial Serif', family: '"Cormorant Garamond", serif', preview: 'Regal Renaissance Elegance' },
  { id: 'cinzel', name: 'Cinzel', category: 'Editorial Serif', family: '"Cinzel", serif', preview: 'Classical Roman Inscription' },
  { id: 'eb-garamond', name: 'EB Garamond', category: 'Editorial Serif', family: '"EB Garamond", serif', preview: 'Timeless Academic Standard' },
  { id: 'libre-baskerville', name: 'Libre Baskerville', category: 'Editorial Serif', family: '"Libre Baskerville", serif', preview: 'Traditional Bookmaking' },
  { id: 'source-serif', name: 'Source Serif 4', category: 'Editorial Serif', family: '"Source Serif 4", serif', preview: 'Formal Publishing Face' },
  { id: 'bodoni-moda', name: 'Bodoni Moda', category: 'Editorial Serif', family: '"Bodoni Moda", serif', preview: 'High Contrast Drama' },
  { id: 'fraunces', name: 'Fraunces', category: 'Editorial Serif', family: '"Fraunces", serif', preview: 'Warm Retro Wonky Serif' },
  { id: 'spectral', name: 'Spectral', category: 'Editorial Serif', family: '"Spectral", serif', preview: 'Screen-Optimized Serif' },
  { id: 'bitter', name: 'Bitter', category: 'Editorial Serif', family: '"Bitter", serif', preview: 'Sturdy Slab Serif' },
  { id: 'newsreader', name: 'Newsreader', category: 'Editorial Serif', family: '"Newsreader", serif', preview: 'Journalism & Broadsheet' },
  { id: 'prata', name: 'Prata', category: 'Editorial Serif', family: '"Prata", serif', preview: 'Teardrop Terminals Luxury' },
  { id: 'system-serif', name: 'Georgia / Times', category: 'Editorial Serif', family: 'Georgia, "Times New Roman", serif', preview: 'Universal System Serif' },

  // ==========================================
  // 3. DISPLAY & IMPACT
  // ==========================================
  { id: 'bricolage', name: 'Bricolage Grotesque', category: 'Display', family: '"Bricolage Grotesque", sans-serif', preview: 'Audacious Expressive Quirks' },
  { id: 'archivo', name: 'Archivo', category: 'Display', family: '"Archivo", sans-serif', preview: 'High-Impact Industrial' },
  { id: 'oswald', name: 'Oswald', category: 'Display', family: '"Oswald", sans-serif', preview: 'Tall Condensed Headline' },
  { id: 'bebas-neue', name: 'Bebas Neue', category: 'Display', family: '"Bebas Neue", sans-serif', preview: 'Bold All-Caps Statement' },
  { id: 'anton', name: 'Anton', category: 'Display', family: '"Anton", sans-serif', preview: 'Maximum Heavy Poster Impact' },
  { id: 'big-shoulders', name: 'Big Shoulders Display', category: 'Display', family: '"Big Shoulders Display", sans-serif', preview: 'Chicago Architecture Grotesque' },
  { id: 'righteous', name: 'Righteous', category: 'Display', family: '"Righteous", cursive', preview: 'Retro Art Deco Modern' },
  { id: 'syne', name: 'Syne', category: 'Display', family: '"Syne", sans-serif', preview: 'Avant-Garde Futuristic' },
  { id: 'abril-fatface', name: 'Abril Fatface', category: 'Display', family: '"Abril Fatface", cursive', preview: '19th Century Titling Poster' },

  // ==========================================
  // 4. MONOSPACE & CODE
  // ==========================================
  { id: 'jetbrains', name: 'JetBrains Mono', category: 'Monospace', family: '"JetBrains Mono", monospace', preview: 'Developer Syntax Excellence' },
  { id: 'space-mono', name: 'Space Mono', category: 'Monospace', family: '"Space Mono", monospace', preview: 'Geometric Scientific Monospace' },
  { id: 'fira-code', name: 'Fira Code', category: 'Monospace', family: '"Fira Code", monospace', preview: 'Ligatures & Programming' },
  { id: 'ibm-plex-mono', name: 'IBM Plex Mono', category: 'Monospace', family: '"IBM Plex Mono", monospace', preview: 'Corporate Engineering Data' },
  { id: 'source-code-pro', name: 'Source Code Pro', category: 'Monospace', family: '"Source Code Pro", monospace', preview: 'Balanced Terminal Code' },
  { id: 'roboto-mono', name: 'Roboto Mono', category: 'Monospace', family: '"Roboto Mono", monospace', preview: 'Clean Reading Fixed Width' },
  { id: 'courier-prime', name: 'Courier Prime', category: 'Monospace', family: '"Courier Prime", monospace', preview: 'Screenplay & Typewriter Standard' },
  { id: 'system-mono', name: 'Consolas / Courier', category: 'Monospace', family: 'Consolas, "Courier New", monospace', preview: 'Windows System Monospace' },

  // ==========================================
  // 5. HANDWRITING, SCRIPT & SIGNATURE
  // ==========================================
  { id: 'caveat', name: 'Caveat', category: 'Handwriting', family: '"Caveat", cursive', preview: 'Natural Pen Signature' },
  { id: 'dancing-script', name: 'Dancing Script', category: 'Handwriting', family: '"Dancing Script", cursive', preview: 'Bouncy Flowing Cursive' },
  { id: 'pacific', name: 'Pacifico', category: 'Handwriting', family: '"Pacifico", cursive', preview: '1950s American Surf Script' },
  { id: 'great-vibes', name: 'Great Vibes', category: 'Handwriting', family: '"Great Vibes", cursive', preview: 'Formal Calligraphic Invitation' },
  { id: 'sacramento', name: 'Sacramento', category: 'Handwriting', family: '"Sacramento", cursive', preview: 'Slender Delicate Monoline' },
  { id: 'satisfy', name: 'Satisfy', category: 'Handwriting', family: '"Satisfy", cursive', preview: 'Timeless Brush Lettering' },
  { id: 'alex-brush', name: 'Alex Brush', category: 'Handwriting', family: '"Alex Brush", cursive', preview: 'Classic Flowing Signature' },
  { id: 'kalam', name: 'Kalam', category: 'Handwriting', family: '"Kalam", cursive', preview: 'Ballpoint Pen Note' },
  { id: 'indie-flower', name: 'Indie Flower', category: 'Handwriting', family: '"Indie Flower", cursive', preview: 'Carefree Bubbly Handwriting' },
  { id: 'shadows-into-light', name: 'Shadows Into Light', category: 'Handwriting', family: '"Shadows Into Light", cursive', preview: 'Edgy Felt Tip Pen' },

  // ==========================================
  // 6. DECORATIVE & NOVELTY
  // ==========================================
  { id: 'lobster', name: 'Lobster', category: 'Decorative', family: '"Lobster", cursive', preview: 'Retro Script Bold' },
  { id: 'comfortaa', name: 'Comfortaa', category: 'Decorative', family: '"Comfortaa", cursive', preview: 'Ultra-Rounded Minimal' },
  { id: 'permanent-marker', name: 'Permanent Marker', category: 'Decorative', family: '"Permanent Marker", cursive', preview: 'Heavy Sharpie Marker' },
];

export const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72, 96
];

/**
 * Ensures any Google Font is loaded dynamically into the browser DOM
 */
export function ensureFontLoaded(fontFamily: string) {
  // Strip quotes
  const cleanName = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
  const fontId = `gfont-${cleanName.toLowerCase().replace(/\s+/g, '-')}`;

  if (document.getElementById(fontId)) return;

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanName)}:ital,wght@0,400;0,600;0,700;1,400&display=swap`;
  document.head.appendChild(link);
}
