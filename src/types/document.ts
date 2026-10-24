export type PageSize = 'a4' | 'letter' | 'legal' | 'executive';
export type PageOrientation = 'portrait' | 'landscape';

export interface PageMargins {
  top: number; // inches
  right: number;
  bottom: number;
  left: number;
}

export interface PageSettings {
  size: PageSize;
  orientation: PageOrientation;
  margins: PageMargins;
  backgroundColor: string;
  showRuler: boolean;
  showPageNumbers: boolean;
  defaultFontFamily?: string;
  defaultFontSize?: number;
  defaultLineHeight?: number;
  headerText?: string;
  footerText?: string;
  watermarkText?: string;
  watermarkColor?: string;
}

export interface DocumentComment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
  selectionText?: string;
  resolved: boolean;
}

export interface VelumDocument {
  id: string;
  schemaVersion: 1;
  title: string;
  contentHtml: string;
  contentJson?: any;
  createdAt: number;
  updatedAt: number;
  lastSavedAt: number;
  localRevision: number;
  cloudRevision: number;
  ownerId?: string;
  pageSettings: PageSettings;
  comments: DocumentComment[];
  trackChanges: boolean;
  novelData?: NovelProject;
}

export interface DocMetadata {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  version?: number;
}

export interface DocumentState {
  metadata: DocMetadata;
  contentHtml: string;
  settings: PageSettings;
}

export type ActiveRibbonTab = 
  | 'file'
  | 'home' 
  | 'insert' 
  | 'layout' 
  | 'references'
  | 'review' 
  | 'view' 
  | 'pdf' 
  | 'export'
  | 'help'
  | 'pdf_studio';


export type SaveStatus = 
  | 'idle' 
  | 'saving' 
  | 'saved_local' 
  | 'syncing' 
  | 'synced_cloud' 
  | 'error';

export type RibbonTab = 
  | 'file' 
  | 'home' 
  | 'insert' 
  | 'layout' 
  | 'references' 
  | 'review' 
  | 'view' 
  | 'novel'
  | 'help'
  | 'pdf_studio';

export interface NovelChapter {
  id: string;
  number: number;
  title: string;
  summary?: string;
  contentHtml: string;
  wordCount: number;
  targetWordCount: number;
  status: 'draft' | 'revised' | 'final';
}

export interface NovelCharacter {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'deuteragonist' | 'supporting';
  age?: string;
  occupation?: string;
  archetype?: string;
  motivation: string;
  flaw: string;
  description: string;
}

export interface NovelWorldItem {
  id: string;
  name: string;
  category: 'location' | 'faction' | 'magic_or_tech' | 'lore' | 'item';
  description: string;
}

export interface NovelPublishSettings {
  trimSize: '6x9' | '5.5x8.5' | '5x8' | 'a5' | 'letter';
  dropCaps: boolean;
  firstParagraphIndent: boolean;
  sceneBreakSymbol: '* * *' | '❦' | '◆ ◆ ◆' | '— — —' | '• • •';
  includeTitlePage: boolean;
  includeCopyrightPage: boolean;
  includeDedication: boolean;
  includeTableOfContents: boolean;
  includeAuthorBio: boolean;
  authorBio?: string;
  isbn?: string;
  publisherName?: string;
  copyrightYear?: string;
  dedicationText?: string;
}

export interface NovelProject {
  penName: string;
  genre: string;
  targetTotalWords: number;
  synopsis: string;
  chapters: NovelChapter[];
  activeChapterId?: string;
  characters: NovelCharacter[];
  worldItems: NovelWorldItem[];
  publishSettings: NovelPublishSettings;
}

export interface AccessibilitySettings {
  uiScale: 90 | 100 | 110 | 125;
  readingTheme: 'default' | 'sepia' | 'dark' | 'high_contrast' | 'solarized';
  dyslexiaFriendly: boolean;
  dyslexiaFontPreference?: 'atkinson' | 'lexend' | 'opendyslexic';
  focusMode: boolean;
  reducedMotion: boolean;
  disableAnimations: boolean;
  customLetterSpacing: number; // in em (e.g. 0 to 0.2)
  customWordSpacing: number; // in em (e.g. 0 to 0.4)
  customLineHeight: number; // e.g. 1.2 to 2.2
  customParagraphSpacing: number; // in pt (e.g. 4 to 20)
  speechRate?: number; // for read aloud
}

export type AppMode = 'word' | 'pdf_studio';

export interface PdfAnnotation {
  id: string;
  type: 'text' | 'signature' | 'stamp' | 'highlight' | 'redact';
  pageIndex: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bgColor?: string;
  stampType?: 'APPROVED' | 'CONFIDENTIAL' | 'DRAFT' | 'REVIEWED' | 'VOID';
  imageData?: string;
}

