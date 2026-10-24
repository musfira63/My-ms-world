import React from 'react';
import { 
  X, 
  FileText, 
  FileCode, 
  FileType, 
  Download, 
  Printer, 
  FileCheck,
  Code
} from 'lucide-react';
import { DocumentState } from '../types/document';
import {
  exportToWordDoc,
  exportToPdfFile,
  exportToHtmlFile,
  exportToMarkdownFile,
  exportToPlainTextFile,
  exportToJsonProject
} from '../utils/exportFormats';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentState: DocumentState;
  canvasElementId?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  documentState,
  canvasElementId = 'document-page-canvas'
}) => {
  if (!isOpen) return null;

  const exportOptions = [
    {
      id: 'docx',
      name: 'Microsoft Word Document',
      extension: '.doc / .docx',
      icon: FileText,
      badge: 'Word Format',
      description: 'Standard Microsoft Word file preserving headings, colors, fonts, tables, and page margins.',
      color: 'bg-blue-600',
      action: () => exportToWordDoc(documentState),
    },
    {
      id: 'pdf',
      name: 'Adobe PDF Document',
      extension: '.pdf',
      icon: FileCheck,
      badge: 'Print Ready',
      description: 'High-resolution paginated PDF document with embedded fonts, watermarks, and exact print geometry.',
      color: 'bg-rose-600',
      action: () => exportToPdfFile(documentState, canvasElementId),
    },
    {
      id: 'html',
      name: 'Standalone Webpage',
      extension: '.html',
      icon: FileCode,
      badge: 'Self-Contained',
      description: 'Single-file webpage with embedded CSS and Google Fonts that renders identically in any browser.',
      color: 'bg-emerald-600',
      action: () => exportToHtmlFile(documentState),
    },
    {
      id: 'md',
      name: 'Markdown Document',
      extension: '.md',
      icon: Code,
      badge: 'Developer & Docs',
      description: 'Clean Markdown syntax converted from headings, tables, bold/italics, and bullet lists.',
      color: 'bg-neutral-800',
      action: () => exportToMarkdownFile(documentState),
    },
    {
      id: 'txt',
      name: 'Plain Text File',
      extension: '.txt',
      icon: FileType,
      badge: 'Universal',
      description: 'Clean unformatted plain text with paragraph line breaks preserved.',
      color: 'bg-neutral-600',
      action: () => exportToPlainTextFile(documentState),
    },
    {
      id: 'json',
      name: 'DocuCraft Project Backup',
      extension: '.docucraft.json',
      icon: Download,
      badge: 'Full State',
      description: 'Complete project archive containing document structure, styles, margins, and metadata for future reload.',
      color: 'bg-indigo-600',
      action: () => exportToJsonProject(documentState),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-neutral-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-neutral-50">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Export &amp; Turn Into Any File</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Save &ldquo;{documentState.metadata.title}&rdquo; to your computer in any industry-standard format.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-md hover:bg-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formats Grid */}
        <div className="p-5 grid grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
          {exportOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.id}
                className="border border-neutral-200 rounded-lg p-3.5 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-md ${opt.color} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">{opt.name}</h4>
                        <span className="font-mono text-[10px] text-neutral-500">{opt.extension}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      opt.action();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {opt.extension}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Print Option Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-200 bg-neutral-50">
          <button
            type="button"
            onClick={() => {
              window.print();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 px-3 py-1.5 rounded border border-neutral-300 hover:bg-neutral-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Open Browser Print Dialog</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
