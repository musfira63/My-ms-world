import React, { useState, useRef } from 'react';
import { 
  X, 
  FolderOpen, 
  FileText, 
  Plus, 
  Trash2, 
  Copy, 
  Upload, 
  Clock, 
  Search, 
  AlertTriangle,
  Download
} from 'lucide-react';
import { VelumDocument } from '../../types/document';
import { importDocxFile } from '../../utils/docxHandler';
import { parseMusFile, saveAsMusFile } from '../../utils/musFileHandler';

interface VelumDocManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: VelumDocument[];
  currentDocId: string;
  onSelectDocument: (doc: VelumDocument) => void;
  onCreateNewDocument: () => void;
  onDuplicateDocument: (docId: string) => void;
  onDeleteDocument: (docId: string) => void;
  onImportDocument: (title: string, html: string) => void;
  onLoadFullDocument?: (doc: VelumDocument) => void;
}

export const VelumDocManagerModal: React.FC<VelumDocManagerModalProps> = ({
  isOpen,
  onClose,
  documents,
  currentDocId,
  onSelectDocument,
  onCreateNewDocument,
  onDuplicateDocument,
  onDeleteDocument,
  onImportDocument,
  onLoadFullDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.mus')) {
      try {
        const parsedDoc = await parseMusFile(file);
        if (onLoadFullDocument) {
          onLoadFullDocument(parsedDoc);
        } else {
          onImportDocument(parsedDoc.title, parsedDoc.contentHtml);
        }
        onClose();
      } catch (err) {
        console.error('Failed to import .mus file:', err);
        alert(`Failed to open .mus document: ${(err as Error).message}`);
      }
    } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      try {
        const { title, html, warnings } = await importDocxFile(file);
        if (warnings.length > 0) {
          console.warn('Docx import messages:', warnings);
        }
        onImportDocument(title, html);
        onClose();
      } catch (err) {
        console.error('Failed to import docx:', err);
      }
    } else if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.title && (parsed.contentHtml || parsed.contentJson)) {
            onImportDocument(parsed.title, parsed.contentHtml || '<p></p>');
            onClose();
          }
        } catch (e) {
          console.error('Invalid JSON document:', e);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manager-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="manager-modal-title" className="text-base font-bold text-neutral-900">
                Document Library (IndexedDB Storage)
              </h2>
              <p className="text-xs text-neutral-500">
                Manage your local documents, open drafts, or import a Word (.docx) document.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 border-b border-neutral-200 bg-white flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your documents..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onCreateNewDocument();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Document</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept=".mus,.docx,.doc,.json,.html"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold"
            title="Open or import a native .mus or .docx document"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Open .mus / DOCX</span>
          </button>
        </div>

        {/* Documents list */}
        <div className="p-4 overflow-y-auto max-h-[55vh] divide-y divide-neutral-100">
          {filteredDocs.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No documents found.
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isActive = doc.id === currentDocId;
              const isDeleting = deleteConfirmId === doc.id;

              return (
                <div
                  key={doc.id}
                  className={`py-3 px-3 flex items-center justify-between rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50/70 border border-blue-200' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900 truncate">
                          {doc.title}
                        </span>
                        <span className="text-[9px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                          .mus
                        </span>
                        {isActive && (
                          <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Last saved: {new Date(doc.updatedAt).toLocaleDateString()} {new Date(doc.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    {isDeleting ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-md border border-red-200 animate-in fade-in">
                        <span className="text-[11px] font-semibold text-red-700 px-1">Confirm delete?</span>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteDocument(doc.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-0.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectDocument(doc);
                              onClose();
                            }}
                            className="px-3 py-1 bg-neutral-900 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors"
                          >
                            Open
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => saveAsMusFile(doc)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded"
                          title="Save / Download as .mus file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicateDocument(doc.id)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded"
                          title="Duplicate document"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {documents.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(doc.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200 bg-neutral-50 text-xs text-neutral-500">
          <span>{documents.length} local document(s) stored in IndexedDB</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
