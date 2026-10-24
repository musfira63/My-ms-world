import { openDB, IDBPDatabase } from 'idb';
import { VelumDocument, PageSettings } from '../types/document';

const DB_NAME = 'velum_writer_db';
const DB_VERSION = 1;
const STORE_DOCUMENTS = 'documents';
const STORE_METADATA = 'app_metadata';

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  size: 'a4', // Default per specification
  orientation: 'portrait',
  margins: {
    top: 1.0,
    right: 1.0,
    bottom: 1.0,
    left: 1.0,
  },
  backgroundColor: '#FFFFFF',
  showRuler: true,
  showPageNumbers: true,
  defaultFontFamily: 'Calibri, Arial, sans-serif',
  defaultFontSize: 11,
  defaultLineHeight: 1.5,
  headerText: '',
  footerText: '',
};

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_DOCUMENTS)) {
          const store = db.createObjectStore(STORE_DOCUMENTS, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
          store.createIndex('title', 'title');
        }
        if (!db.objectStoreNames.contains(STORE_METADATA)) {
          db.createObjectStore(STORE_METADATA, { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveDocumentLocally(doc: VelumDocument): Promise<void> {
  const db = await getDb();
  const tx = db.transaction([STORE_DOCUMENTS, STORE_METADATA], 'readwrite');
  const now = Date.now();
  const updatedDoc: VelumDocument = {
    ...doc,
    updatedAt: now,
    lastSavedAt: now,
    localRevision: (doc.localRevision || 0) + 1,
  };

  await tx.objectStore(STORE_DOCUMENTS).put(updatedDoc);
  await tx.objectStore(STORE_METADATA).put({
    key: 'last_active_document_id',
    value: doc.id,
    timestamp: now,
  });
  await tx.done;
}

export async function getDocumentLocally(id: string): Promise<VelumDocument | undefined> {
  const db = await getDb();
  return db.get(STORE_DOCUMENTS, id);
}

export async function listLocalDocuments(): Promise<VelumDocument[]> {
  const db = await getDb();
  const tx = db.transaction(STORE_DOCUMENTS, 'readonly');
  const index = tx.store.index('updatedAt');
  const docs = await index.getAll();
  // Sort newest first
  return docs.reverse();
}

export async function deleteDocumentLocally(id: string): Promise<void> {
  const db = await getDb();
  const tx = db.transaction([STORE_DOCUMENTS, STORE_METADATA], 'readwrite');
  await tx.objectStore(STORE_DOCUMENTS).delete(id);
  
  const lastActive = await tx.objectStore(STORE_METADATA).get('last_active_document_id');
  if (lastActive && lastActive.value === id) {
    await tx.objectStore(STORE_METADATA).delete('last_active_document_id');
  }
  await tx.done;
}

export async function duplicateDocumentLocally(docId: string): Promise<VelumDocument> {
  const db = await getDb();
  const original = await db.get(STORE_DOCUMENTS, docId);
  if (!original) {
    throw new Error('Original document not found');
  }

  const now = Date.now();
  const duplicated: VelumDocument = {
    ...original,
    id: `doc_${now}_${Math.random().toString(36).substring(2, 7)}`,
    title: `${original.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
    lastSavedAt: now,
    localRevision: 1,
    cloudRevision: 0,
  };

  await saveDocumentLocally(duplicated);
  return duplicated;
}

export async function getLastActiveDocument(): Promise<VelumDocument | undefined> {
  try {
    const db = await getDb();
    const meta = await db.get(STORE_METADATA, 'last_active_document_id');
    if (meta && meta.value) {
      const doc = await db.get(STORE_DOCUMENTS, meta.value);
      if (doc) return doc;
    }
    // Fallback to most recently updated document
    const all = await listLocalDocuments();
    return all.length > 0 ? all[0] : undefined;
  } catch (err) {
    console.error('Failed to load last active document:', err);
    return undefined;
  }
}

export function createNewDocument(title: string = 'Untitled Document', initialHtml?: string): VelumDocument {
  const now = Date.now();
  return {
    id: `doc_${now}_${Math.random().toString(36).substring(2, 7)}`,
    schemaVersion: 1,
    title,
    contentHtml: initialHtml || `<h1>${title}</h1><p>Start writing your document here...</p>`,
    createdAt: now,
    updatedAt: now,
    lastSavedAt: now,
    localRevision: 1,
    cloudRevision: 0,
    pageSettings: DEFAULT_PAGE_SETTINGS,
    comments: [],
    trackChanges: false,
  };
}
