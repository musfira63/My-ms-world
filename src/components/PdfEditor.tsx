import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  FileCheck, 
  Type, 
  PenTool, 
  Highlighter, 
  ShieldAlert, 
  Stamp, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  FileText,
  CheckCircle,
  Plus
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PdfAnnotation } from '../types/document';
import { 
  renderPdfPageToCanvas, 
  extractTextFromPdf, 
  exportAnnotatedPdf 
} from '../utils/pdfProcessor';
import { SignatureModal } from './SignatureModal';
import { FontPickerDropdown } from './FontPickerDropdown';

interface PdfEditorProps {
  onConvertToWordDocument: (extractedTextHtml: string, fileName: string) => void;
}

export const PdfEditor: React.FC<PdfEditorProps> = ({
  onConvertToWordDocument,
}) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string>('Document.pdf');
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1.25);
  const [annotations, setAnnotations] = useState<PdfAnnotation[]>([]);
  const [selectedTool, setSelectedTool] = useState<'select' | 'text' | 'signature' | 'highlight' | 'stamp' | 'redact'>('select');
  const [activeStamp, setActiveStamp] = useState<'APPROVED' | 'CONFIDENTIAL' | 'DRAFT' | 'REVIEWED' | 'VOID'>('APPROVED');
  const [currentPdfFont, setCurrentPdfFont] = useState<string>('"Plus Jakarta Sans", sans-serif');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [savedSignatureDataUrl, setSavedSignatureDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample PDF if none loaded yet
  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      setPdfFile(file);
      setPdfBytes(bytes);
      setFileName(file.name);
      setCurrentPage(1);
      setAnnotations([]);

      // Get page count using pdfjs
      const pdfjsLib = await import('pdfjs-dist');
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      setNumPages(doc.numPages);
    } catch (err) {
      console.error('Error loading PDF file:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSamplePdf = async () => {
    setIsProcessing(true);
    try {
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.28, 841.89]); // A4
      const helvetica = await doc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
      
      page.drawText('ENTERPRISE CONSULTING & SERVICE AGREEMENT', { 
        x: 50, 
        y: 780, 
        size: 16, 
        font: helveticaBold, 
        color: rgb(0.12, 0.16, 0.24) 
      });
      page.drawText('Document ID: VELUM-2026-X94  |  Classification: Formal Business  |  Effective: October 2026', { 
        x: 50, 
        y: 755, 
        size: 9.5, 
        font: helvetica, 
        color: rgb(0.4, 0.45, 0.5) 
      });
      page.drawLine({ 
        start: { x: 50, y: 745 }, 
        end: { x: 545, y: 745 }, 
        thickness: 1, 
        color: rgb(0.8, 0.85, 0.9) 
      });
      
      page.drawText('1. Scope of Deliverables & Objectives', { 
        x: 50, 
        y: 715, 
        size: 12.5, 
        font: helveticaBold, 
        color: rgb(0.12, 0.16, 0.24) 
      });
      page.drawText('The consultant agrees to design and deliver high-accessibility typography systems,', { 
        x: 50, 
        y: 695, 
        size: 10.5, 
        font: helvetica, 
        color: rgb(0.2, 0.2, 0.2) 
      });
      page.drawText('full WCAG 2.2 AA compliance audits, and real OpenXML document interoperability.', { 
        x: 50, 
        y: 680, 
        size: 10.5, 
        font: helvetica, 
        color: rgb(0.2, 0.2, 0.2) 
      });
      
      page.drawText('2. Data Confidentiality & Non-Disclosure', { 
        x: 50, 
        y: 645, 
        size: 12.5, 
        font: helveticaBold, 
        color: rgb(0.12, 0.16, 0.24) 
      });
      page.drawText('All parties shall protect proprietary documentation, encrypted data payloads, and trade secrets.', { 
        x: 50, 
        y: 625, 
        size: 10.5, 
        font: helvetica, 
        color: rgb(0.2, 0.2, 0.2) 
      });
      page.drawText('No excerpts shall be distributed without verified written consensus from the governance committee.', { 
        x: 50, 
        y: 610, 
        size: 10.5, 
        font: helvetica, 
        color: rgb(0.2, 0.2, 0.2) 
      });

      page.drawText('3. Digital Execution & Approval Stamping', { 
        x: 50, 
        y: 575, 
        size: 12.5, 
        font: helveticaBold, 
        color: rgb(0.12, 0.16, 0.24) 
      });
      page.drawText('Authorized signatories may append verifiable electronic signatures and approval stamps below.', { 
        x: 50, 
        y: 555, 
        size: 10.5, 
        font: helvetica, 
        color: rgb(0.2, 0.2, 0.2) 
      });

      const generatedBytes = await doc.save();
      setPdfBytes(generatedBytes);
      setFileName('Sample_Consulting_Agreement.pdf');
      setCurrentPage(1);
      setNumPages(1);
      setAnnotations([]);
    } catch (err) {
      console.error('Failed to create sample PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };


  // Render current page when bytes, page or scale changes
  useEffect(() => {
    if (pdfBytes && canvasRef.current) {
      renderPdfPageToCanvas(pdfBytes, currentPage, canvasRef.current, zoomScale).catch(err => {
        console.error('Canvas render error:', err);
      });
    }
  }, [pdfBytes, currentPage, zoomScale]);

  // Handle clicking on PDF canvas area to place annotations
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool === 'select' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (x < 0 || x > 100 || y < 0 || y > 100) return;

    const newId = `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    if (selectedTool === 'text') {
      const newAnn: PdfAnnotation = {
        id: newId,
        type: 'text',
        pageIndex: currentPage - 1,
        x,
        y,
        text: 'Click to edit text',
        fontSize: 14,
        fontFamily: currentPdfFont,
        color: '#000000',
      };
      setAnnotations([...annotations, newAnn]);
      setSelectedTool('select');
    } else if (selectedTool === 'stamp') {
      const newAnn: PdfAnnotation = {
        id: newId,
        type: 'stamp',
        pageIndex: currentPage - 1,
        x,
        y,
        stampType: activeStamp,
      };
      setAnnotations([...annotations, newAnn]);
      setSelectedTool('select');
    } else if (selectedTool === 'highlight') {
      const newAnn: PdfAnnotation = {
        id: newId,
        type: 'highlight',
        pageIndex: currentPage - 1,
        x,
        y,
        width: 35,
        height: 3,
        bgColor: '#FFFF00',
      };
      setAnnotations([...annotations, newAnn]);
      setSelectedTool('select');
    } else if (selectedTool === 'redact') {
      const newAnn: PdfAnnotation = {
        id: newId,
        type: 'redact',
        pageIndex: currentPage - 1,
        x,
        y,
        width: 30,
        height: 3.5,
      };
      setAnnotations([...annotations, newAnn]);
      setSelectedTool('select');
    } else if (selectedTool === 'signature') {
      if (savedSignatureDataUrl) {
        const newAnn: PdfAnnotation = {
          id: newId,
          type: 'signature',
          pageIndex: currentPage - 1,
          x,
          y,
          width: 25,
          imageData: savedSignatureDataUrl,
        };
        setAnnotations([...annotations, newAnn]);
        setSelectedTool('select');
      } else {
        setIsSignatureModalOpen(true);
      }
    }
  };

  const handleUpdateAnnotationText = (id: string, text: string) => {
    setAnnotations(
      annotations.map((a) => (a.id === id ? { ...a, text } : a))
    );
  };

  const handleDeleteAnnotation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnnotations(annotations.filter((a) => a.id !== id));
  };

  // Convert PDF to Word Document
  const handleConvertToWord = async () => {
    if (!pdfBytes) return;
    setIsProcessing(true);
    try {
      const pages = await extractTextFromPdf(pdfBytes);
      let html = `<h1 style="font-size: 22pt; font-weight: bold; color: #1E293B; margin-bottom: 14pt;">${fileName.replace('.pdf', '')}</h1>`;
      
      pages.forEach((p) => {
        html += `
          <div style="margin-bottom: 24pt; padding-bottom: 12pt; border-bottom: 1px solid #E2E8F0;">
            <p style="font-size: 9.5pt; text-transform: uppercase; color: #64748B; font-weight: 600; margin-bottom: 6pt;">Extracted PDF Page ${p.pageNumber}</p>
            <p style="font-size: 11pt; line-height: 1.65; color: #334155;">${p.text || 'No machine-readable text found on this page.'}</p>
          </div>
        `;
      });

      onConvertToWordDocument(html, fileName.replace('.pdf', ''));
    } catch (err) {
      console.error('Failed to convert PDF to Word:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Export annotated PDF
  const handleExportEditedPdf = async () => {
    if (!pdfBytes) return;
    setIsProcessing(true);
    try {
      await exportAnnotatedPdf(
        pdfBytes,
        annotations,
        `Edited_${fileName}`
      );
    } catch (err) {
      console.error('Failed to export annotated PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const pageAnnotations = annotations.filter((a) => a.pageIndex === currentPage - 1);

  return (
    <div className="flex-1 flex flex-col bg-[#E5E7EB] overflow-hidden select-none">
      {/* PDF Studio Toolbar */}
      <div className="bg-white border-b border-neutral-300 px-6 py-2.5 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Open Any PDF</span>
          </button>

          {pdfBytes && (
            <button
              type="button"
              onClick={handleConvertToWord}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors shadow-xs"
              title="Extract text and edit directly in Microsoft Word Canvas"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Convert to Word Document</span>
            </button>
          )}
        </div>

        {/* Annotation Tools */}
        {pdfBytes && (
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={() => setSelectedTool('select')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedTool === 'select'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Select / Move
            </button>

            <button
              type="button"
              onClick={() => setSelectedTool('text')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedTool === 'text'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Add text anywhere on PDF"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Add Text</span>
            </button>

            {/* Font Selector for PDF Text */}
            <div className="hidden sm:block">
              <FontPickerDropdown
                currentFont={currentPdfFont}
                onSelectFont={setCurrentPdfFont}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (savedSignatureDataUrl) {
                  setSelectedTool('signature');
                } else {
                  setIsSignatureModalOpen(true);
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedTool === 'signature'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Place digital signature"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Sign</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTool('highlight')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedTool === 'highlight'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Highlight area on PDF"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>Highlight</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTool('redact')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedTool === 'redact'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Redact / Blackout sensitive text"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Redact</span>
            </button>

            {/* Stamp dropdown */}
            <div className="flex items-center gap-1 pl-1 border-l border-neutral-300">
              <select
                value={activeStamp}
                onChange={(e) => {
                  setActiveStamp(e.target.value as any);
                  setSelectedTool('stamp');
                }}
                className="text-xs bg-white border border-neutral-300 rounded px-1.5 py-1 text-neutral-800"
              >
                <option value="APPROVED">Stamp: APPROVED</option>
                <option value="CONFIDENTIAL">Stamp: CONFIDENTIAL</option>
                <option value="DRAFT">Stamp: DRAFT</option>
                <option value="REVIEWED">Stamp: REVIEWED</option>
                <option value="VOID">Stamp: VOID</option>
              </select>
              <button
                type="button"
                onClick={() => setSelectedTool('stamp')}
                className={`p-1 rounded ${selectedTool === 'stamp' ? 'bg-rose-600 text-white' : 'text-neutral-600 hover:bg-neutral-200'}`}
                title="Place Stamp"
              >
                <Stamp className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Right Action: Download Edited PDF */}
        {pdfBytes && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportEditedPdf}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Edited PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Main PDF Viewport Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex flex-col items-center py-6 px-4 relative"
      >
        {!pdfBytes ? (
          <div className="my-auto max-w-md w-full bg-white border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              DocuCraft PDF Studio &amp; Editor
            </h3>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Upload any PDF to edit text, sign contracts, add official stamps, highlight clauses, redact sensitive data, or convert directly into a Word document.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Select PDF File to Edit</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSamplePdf}
                disabled={isProcessing}
                className="w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-neutral-600" />
                <span>Try Sample Business Agreement</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Page Navigation & Zoom Floating Strip */}
            <div className="sticky top-2 z-40 bg-white/95 backdrop-blur-xs border border-neutral-300 rounded-md shadow-md px-3 py-1.5 flex items-center gap-4 text-xs mb-4">
              <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-neutral-900 font-bold tabular-nums">
                  Page {currentPage} of {numPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= numPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="h-4 w-px bg-neutral-200" />

              <div className="flex items-center gap-1 text-neutral-600">
                <button
                  type="button"
                  onClick={() => setZoomScale(Math.max(0.75, zoomScale - 0.25))}
                  className="p-1 rounded hover:bg-neutral-100"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] w-12 text-center tabular-nums">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale(Math.min(2.5, zoomScale + 0.25))}
                  className="p-1 rounded hover:bg-neutral-100"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Page canvas with annotation overlays */}
            <div 
              className={`relative shadow-2xl rounded-xs bg-white border border-neutral-300 overflow-hidden ${
                selectedTool !== 'select' ? 'cursor-crosshair' : 'cursor-default'
              }`}
              onClick={handlePageClick}
            >
              <canvas ref={canvasRef} className="block max-w-full" />

              {/* Annotation Overlays for current page */}
              {pageAnnotations.map((ann) => (
                <div
                  key={ann.id}
                  className="absolute group"
                  style={{
                    left: `${ann.x}%`,
                    top: `${ann.y}%`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Delete button on hover */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteAnnotation(ann.id, e)}
                    className="absolute -top-3 -right-3 z-30 bg-red-600 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove annotation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  {/* Text box */}
                  {ann.type === 'text' && (
                    <div className="bg-white/90 border border-blue-400 p-1 rounded shadow-xs">
                      <input
                        type="text"
                        value={ann.text || ''}
                        onChange={(e) => handleUpdateAnnotationText(ann.id, e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-neutral-900"
                        style={{
                          fontSize: `${(ann.fontSize || 14) * zoomScale}px`,
                          color: ann.color || '#000000',
                          fontFamily: ann.fontFamily || currentPdfFont,
                        }}
                      />
                    </div>
                  )}

                  {/* Stamp */}
                  {ann.type === 'stamp' && (
                    <div className="transform -rotate-12 select-none border-2 border-red-600 text-red-600 bg-red-50/80 px-3 py-1 rounded font-black text-sm tracking-widest shadow-md">
                      {ann.stampType}
                    </div>
                  )}

                  {/* Highlight */}
                  {ann.type === 'highlight' && (
                    <div
                      className="bg-yellow-400/40 rounded-xs pointer-events-none"
                      style={{
                        width: `${(ann.width || 30) * 8 * zoomScale}px`,
                        height: `${(ann.height || 3) * 8 * zoomScale}px`,
                      }}
                    />
                  )}

                  {/* Redact */}
                  {ann.type === 'redact' && (
                    <div
                      className="bg-black rounded-xs select-none"
                      style={{
                        width: `${(ann.width || 30) * 8 * zoomScale}px`,
                        height: `${(ann.height || 3.5) * 8 * zoomScale}px`,
                      }}
                    />
                  )}

                  {/* Signature */}
                  {ann.type === 'signature' && ann.imageData && (
                    <img
                      src={ann.imageData}
                      alt="Signature"
                      className="max-w-[160px] pointer-events-none drop-shadow-xs"
                      style={{
                        width: `${(ann.width || 25) * 6 * zoomScale}px`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onInsertSignature={(dataUrl) => {
          setSavedSignatureDataUrl(dataUrl);
          setSelectedTool('signature');
        }}
      />
    </div>
  );
};
