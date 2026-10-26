import { VelumDocument, PageSettings } from '../types/document';

export interface MusDocumentMetadata {
  title: string;
  author: string;
  generator: string;
  exportedAt: string;
  version: string;
  wordCount?: number;
  charCount?: number;
}

export interface MusPackage {
  format: 'MUS_DOCUMENT';
  version: '1.0';
  generator: string;
  exportedAt: string;
  metadata: MusDocumentMetadata;
  document: VelumDocument;
}

/**
 * Computes plain text word and character counts from an HTML string
 */
function getDocumentMetrics(html: string) {
  if (typeof window === 'undefined') return { words: 0, chars: 0 };
  const temp = document.createElement('div');
  temp.innerHTML = html || '';
  const text = (temp.textContent || temp.innerText || '').trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const chars = text.length;
  return { words, chars };
}

/**
 * Saves a VelumDocument into its own native .mus format and triggers a download.
 */
export function saveAsMusFile(
  doc: VelumDocument, 
  author: string = 'musfirasiddiqui36@gmail.com'
): void {
  const metrics = getDocumentMetrics(doc.contentHtml);
  
  const musPackage: MusPackage = {
    format: 'MUS_DOCUMENT',
    version: '1.0',
    generator: 'Velum Writer Pro & MUS Studio',
    exportedAt: new Date().toISOString(),
    metadata: {
      title: doc.title || 'Untitled Document',
      author,
      generator: 'DocuCraft Pro (MUS Specification 1.0)',
      exportedAt: new Date().toISOString(),
      version: '1.0',
      wordCount: metrics.words,
      charCount: metrics.chars,
    },
    document: {
      ...doc,
      updatedAt: Date.now(),
      lastSavedAt: Date.now(),
    },
  };

  const jsonString = JSON.stringify(musPackage, null, 2);
  const blob = new Blob([jsonString], { type: 'application/x-mus-document;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const safeTitle = (doc.title || 'Untitled')
    .replace(/[/\\?%*:|"<>]/g, '_')
    .replace(/\.mus$/i, '')
    .trim();

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${safeTitle}.mus`;
  downloadLink.setAttribute('aria-hidden', 'true');
  document.body.appendChild(downloadLink);
  downloadLink.click();
  
  setTimeout(() => {
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }, 250);
}

/**
 * Reads and validates a selected .mus file, returning the hydrated VelumDocument.
 */
export async function parseMusFile(file: File): Promise<VelumDocument> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Case 1: Valid .mus package format
        if (parsed.format === 'MUS_DOCUMENT' && parsed.document) {
          const doc = parsed.document as VelumDocument;
          const cleanDoc: VelumDocument = {
            id: doc.id || `doc-${Date.now()}`,
            schemaVersion: 1,
            title: doc.title || file.name.replace(/\.mus$/i, '') || 'Imported MUS Document',
            contentHtml: doc.contentHtml || '<p></p>',
            contentJson: doc.contentJson || null,
            pageSettings: doc.pageSettings || {
              size: 'a4',
              orientation: 'portrait',
              margins: { top: 1, bottom: 1, left: 1, right: 1 },
              backgroundColor: '#FFFFFF',
              showRuler: true,
              showPageNumbers: true,
              defaultFontFamily: 'Plus Jakarta Sans',
              defaultFontSize: 11,
            },
            comments: doc.comments || [],
            trackChanges: !!doc.trackChanges,
            novelData: doc.novelData,
            localRevision: doc.localRevision || 1,
            cloudRevision: doc.cloudRevision || 0,
            createdAt: doc.createdAt || Date.now(),
            updatedAt: Date.now(),
            lastSavedAt: Date.now(),
          };
          resolve(cleanDoc);
          return;
        }

        // Case 2: Direct Velum document object saved as .mus
        if (parsed.title && (parsed.contentHtml !== undefined || parsed.contentJson !== undefined)) {
          const cleanDoc: VelumDocument = {
            id: parsed.id || `doc-${Date.now()}`,
            schemaVersion: 1,
            title: parsed.title || file.name.replace(/\.mus$/i, ''),
            contentHtml: parsed.contentHtml || '<p></p>',
            contentJson: parsed.contentJson || null,
            pageSettings: parsed.pageSettings || {
              size: 'a4',
              orientation: 'portrait',
              margins: { top: 1, bottom: 1, left: 1, right: 1 },
              backgroundColor: '#FFFFFF',
              showRuler: true,
              showPageNumbers: true,
              defaultFontFamily: 'Plus Jakarta Sans',
              defaultFontSize: 11,
            },
            comments: parsed.comments || [],
            trackChanges: !!parsed.trackChanges,
            novelData: parsed.novelData,
            localRevision: parsed.localRevision || 1,
            cloudRevision: parsed.cloudRevision || 0,
            createdAt: parsed.createdAt || Date.now(),
            updatedAt: Date.now(),
            lastSavedAt: Date.now(),
          };
          resolve(cleanDoc);
          return;
        }

        reject(new Error('The chosen file does not have a recognized .mus document structure.'));
      } catch (err) {
        reject(new Error(`Failed to parse .mus file: ${(err as Error).message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('File reading failed.'));
    };

    reader.readAsText(file);
  });
}

/**
 * Triggers a file picker specifically for .mus files and calls the onLoaded callback.
 */
export function openMusFileDialog(onLoaded: (doc: VelumDocument) => void): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.mus,application/x-mus-document,application/json';
  input.style.display = 'none';

  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    try {
      const doc = await parseMusFile(file);
      onLoaded(doc);
    } catch (err) {
      alert(`Could not open .mus document: ${(err as Error).message}`);
    } finally {
      document.body.removeChild(input);
    }
  };

  document.body.appendChild(input);
  input.click();
}
