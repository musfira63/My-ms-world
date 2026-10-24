import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { PdfAnnotation } from '../types/document';
import { downloadBlob } from './exportFormats';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

export interface ExtractedPdfPage {
  pageNumber: number;
  text: string;
}

/**
 * Extract all text from an uploaded PDF file
 */
export async function extractTextFromPdf(fileBytes: Uint8Array): Promise<ExtractedPdfPage[]> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: fileBytes });
    const pdfDoc = await loadingTask.promise;
    const pages: ExtractedPdfPage[] = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      pages.push({
        pageNumber: i,
        text: pageText,
      });
    }

    return pages;
  } catch (err) {
    console.error('Failed to extract text using pdfjs:', err);
    return [];
  }
}

/**
 * Render a single PDF page to a canvas element
 */
export async function renderPdfPageToCanvas(
  fileBytes: Uint8Array,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.5
): Promise<{ width: number; height: number }> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: fileBytes });
    const pdfDoc = await loadingTask.promise;
    const page = await pdfDoc.getPage(pageNumber);

    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      canvas: canvas,
    };

    await (page.render as any)(renderContext).promise;
    return { width: viewport.width, height: viewport.height };
  } catch (err) {
    console.error(`Error rendering PDF page ${pageNumber}:`, err);
    throw err;
  }
}

/**
 * Parse hex color (#RRGGBB) to pdf-lib rgb(r, g, b)
 */
function hexToPdfRgb(hex: string = '#000000') {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
  return rgb(r, g, b);
}

/**
 * Apply annotations to original PDF bytes and download edited PDF
 */
export async function exportAnnotatedPdf(
  originalBytes: Uint8Array,
  annotations: PdfAnnotation[],
  outputFileName: string = 'Edited_Document.pdf'
): Promise<void> {
  try {
    const pdfDoc = await PDFDocument.load(originalBytes);
    const pages = pdfDoc.getPages();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const ann of annotations) {
      if (ann.pageIndex < 0 || ann.pageIndex >= pages.length) continue;
      const page = pages[ann.pageIndex];
      const { width: pWidth, height: pHeight } = page.getSize();

      // Convert percentage coordinates (origin top-left in web UI) to PDF coordinates (origin bottom-left in PDF)
      const x = (ann.x / 100) * pWidth;
      const topY = (ann.y / 100) * pHeight;
      const y = pHeight - topY; // bottom-left reference

      if (ann.type === 'text' && ann.text) {
        const fontSize = ann.fontSize || 12;
        page.drawText(ann.text, {
          x: x,
          y: y - fontSize,
          size: fontSize,
          font: helveticaNormal,
          color: hexToPdfRgb(ann.color || '#000000'),
        });
      } else if (ann.type === 'highlight') {
        const w = ((ann.width || 20) / 100) * pWidth;
        const h = ((ann.height || 4) / 100) * pHeight;
        page.drawRectangle({
          x: x,
          y: y - h,
          width: w,
          height: h,
          color: hexToPdfRgb(ann.bgColor || '#FFFF00'),
          opacity: 0.35,
        });
      } else if (ann.type === 'redact') {
        const w = ((ann.width || 20) / 100) * pWidth;
        const h = ((ann.height || 4) / 100) * pHeight;
        page.drawRectangle({
          x: x,
          y: y - h,
          width: w,
          height: h,
          color: rgb(0, 0, 0),
          opacity: 1.0,
        });
      } else if (ann.type === 'stamp' && ann.stampType) {
        const text = ann.stampType;
        const fontSize = 18;
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
        const padding = 10;
        
        // Draw stamp border
        page.drawRectangle({
          x: x - padding,
          y: y - fontSize - padding,
          width: textWidth + padding * 2,
          height: fontSize + padding * 2,
          borderColor: rgb(0.8, 0.1, 0.1),
          borderWidth: 2,
          color: rgb(1, 0.95, 0.95),
          opacity: 0.85,
        });

        // Draw stamp text
        page.drawText(text, {
          x: x,
          y: y - fontSize,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.8, 0.1, 0.1),
        });
      } else if (ann.type === 'signature' && ann.imageData) {
        // Embed signature image (PNG data URL)
        try {
          const pngImage = await pdfDoc.embedPng(ann.imageData);
          const w = ((ann.width || 25) / 100) * pWidth;
          const h = (pngImage.height / pngImage.width) * w;
          page.drawImage(pngImage, {
            x: x,
            y: y - h,
            width: w,
            height: h,
          });
        } catch (e) {
          console.warn('Could not embed PNG signature:', e);
        }
      }
    }

    const modifiedBytes = await pdfDoc.save();
    const blob = new Blob([modifiedBytes as unknown as BlobPart], { type: 'application/pdf' });
    downloadBlob(blob, outputFileName);
  } catch (error) {
    console.error('Failed to export annotated PDF:', error);
    throw error;
  }
}
