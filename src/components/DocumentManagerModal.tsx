import React, { useRef } from 'react';
import { 
  X, 
  FolderOpen, 
  FileText, 
  Trash2, 
  Copy, 
  Upload, 
  Plus, 
  Clock 
} from 'lucide-react';
import { DocumentState } from '../types/document';

interface DocumentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDocuments: DocumentState[];
  currentDocId: string;
  onOpenDocument: (doc: DocumentState) => void;
  onDeleteDocument: (docId: string) => void;
  onDuplicateDocument: (doc: DocumentState) => void;
  onCreateNewDocument: () => void;
  onImportFile: (importedDoc: DocumentState) => void;
}

export const DocumentManagerModal: React.FC<DocumentManagerModalProps> = ({
  isOpen,
  onClose,
  savedDocuments,
  currentDocId,
  onOpenDocument,
  onDeleteDocument,
  onDuplicateDocument,
  onCreateNewDocument,
  onImportFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          if (parsed.contentHtml && parsed.metadata) {
            onImportFile(parsed);
            onClose();
            return;
          }
        } catch (err) {
          console.error('Invalid JSON file:', err);
        }
      }

      // If it's a markdown, text, or html file:
      let formattedHtml = content;
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        formattedHtml = content
          .split('\n')
          .map((line) => `<p style="margin-bottom: 8pt;">${line || '&nbsp;'}</p>`)
          .join('');
      }

      const importedDoc: DocumentState = {
        metadata: {
          id: `doc-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          version: 1,
        },
        contentHtml: formattedHtml,
        settings: {
          size: 'letter',
          orientation: 'portrait',
          margins: { top: 1.0, right: 1.0, bottom: 1.0, left: 1.0 },
          backgroundColor: '#FFFFFF',
          showRuler: true,
          showPageNumbers: true,
        },
      };

      onImportFile(importedDoc);
      onClose();
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-neutral-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-neutral-900">Document Library</h3>
              <p className="text-xs text-neutral-500">
                Manage your saved drafts, open recent files, or import an existing document.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-md hover:bg-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action strip */}
        <div className="px-6 py-3 border-b border-neutral-200 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onCreateNewDocument();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Blank Document</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json,.txt,.md,.html,.doc"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-700 rounded text-xs font-medium transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Document (.json, .md, .txt)</span>
          </button>
        </div>

        {/* Document list */}
        <div className="p-6 max-h-[55vh] overflow-y-auto divide-y divide-neutral-100">
          {savedDocuments.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              No saved documents yet. Documents are automatically saved as you write.
            </div>
          ) : (
            savedDocuments.map((doc) => {
              const isCurrent = doc.metadata.id === currentDocId;
              return (
                <div
                  key={doc.metadata.id}
                  className={`py-3 px-3 flex items-center justify-between rounded-lg transition-colors ${
                    isCurrent ? 'bg-blue-50/70 border border-blue-200' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-neutral-900">
                          {doc.metadata.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-600 text-white font-medium px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          Modified: {new Date(doc.metadata.updatedAt).toLocaleDateString()} {new Date(doc.metadata.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenDocument(doc);
                          onClose();
                        }}
                        className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-medium transition-colors"
                      >
                        Open
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDuplicateDocument(doc)}
                      className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded"
                      title="Duplicate Document"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteDocument(doc.metadata.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-3 border-t border-neutral-200 bg-neutral-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
