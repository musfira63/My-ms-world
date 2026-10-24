import React from 'react';
import { 
  X, 
  FileText, 
  FileCode, 
  FileType, 
  Download, 
  Printer, 
  FileCheck,
  Check
} from 'lucide-react';
import { VelumDocument } from '../../types/document';
import { exportToNativeDocx } from '../../utils/docxHandler';
import { 
  exportToPdfFile, 
  exportToHtmlFile, 
  exportToPlainTextFile, 
  exportToJsonProject 
} from '../../utils/exportFormats';
import { exportToEpub } from '../../utils/epubExporter';

interface VelumExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: VelumDocument;
}

export const VelumExportModal: React.FC<VelumExportModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!isOpen) return null;

  const exportOptions = [
    {
      id: 'epub',
      name: 'EPUB Novel & eBook',
      extension: '.epub',
      badge: 'Publishing Standard',
      description: 'Standard reflowable eBook package with chapters, copyright page, drop caps, and metadata for Kindle, Apple Books, and Kobo.',
      color: 'bg-indigo-600',
      action: () => exportToEpub(document, document.novelData),
    },
    {
      id: 'docx',
      name: 'Microsoft Word Document',
      extension: '.docx',
      badge: 'Native OpenXML',
      description: 'Generates a real, binary .docx file with true tables, headings, bold/italics, and margins, fully compatible with Word, Pages, and Google Docs.',
      color: 'bg-blue-600',
      action: () => exportToNativeDocx(document),
    },
    {
      id: 'pdf',
      name: 'Adobe PDF Document',
      extension: '.pdf',
      badge: 'Print Ready',
      description: 'Export as high-resolution paginated PDF honoring A4/Letter margins, watermarks, and typography.',
      color: 'bg-rose-600',
      action: () => {
        // Map VelumDocument to DocumentState format expected by exportToPdfFile
        const docState: any = {
          metadata: { title: document.title },
          contentHtml: document.contentHtml,
          settings: document.pageSettings,
        };
        exportToPdfFile(docState, 'velum-document-page');
      },
    },
    {
      id: 'html',
      name: 'Standalone HTML Document',
      extension: '.html',
      badge: 'Web Ready',
      description: 'Self-contained webpage with embedded Google Fonts, clean styling, and offline reading support.',
      color: 'bg-emerald-600',
      action: () => {
        const docState: any = {
          metadata: { title: document.title },
          contentHtml: document.contentHtml,
          settings: document.pageSettings,
        };
        exportToHtmlFile(docState);
      },
    },
    {
      id: 'txt',
      name: 'Plain Text File',
      extension: '.txt',
      badge: 'Universal',
      description: 'Clean unformatted plain text with preserved line breaks and paragraph separations.',
      color: 'bg-neutral-700',
      action: () => {
        const docState: any = {
          metadata: { title: document.title },
          contentHtml: document.contentHtml,
          settings: document.pageSettings,
        };
        exportToPlainTextFile(docState);
      },
    },
    {
      id: 'json',
      name: 'Velum Document Archive',
      extension: '.velum.json',
      badge: 'Full State Backup',
      description: 'Complete JSON archive containing document schema, Tiptap marks, margins, comments, and local metadata.',
      color: 'bg-indigo-600',
      action: () => {
        const blob = new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${document.title}.velum.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div>
            <h2 id="export-modal-title" className="text-base font-bold text-neutral-900">
              Export &amp; Document Conversion Studio
            </h2>
            <p className="text-xs text-neutral-500">
              Save &ldquo;{document.title}&rdquo; to your local storage or download in any standard document format.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-3.5 max-h-[65vh] overflow-y-auto">
          {exportOptions.map((opt) => (
            <div
              key={opt.id}
              className="p-4 rounded-lg border border-neutral-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900">{opt.name}</h3>
                    <span className="font-mono text-[10px] text-neutral-500">{opt.extension}</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                    {opt.badge}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed mb-3">
                  {opt.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    opt.action();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {opt.extension}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 bg-neutral-50">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100"
          >
            <Printer className="w-4 h-4" />
            <span>Open Browser Print Dialog</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
