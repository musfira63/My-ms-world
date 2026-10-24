import { DocumentState } from '../types/document';
import jsPDF from 'jspdf';

/**
 * Downloads a Blob as a file with the given filename
 */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Convert HTML content to plain text with preserved line breaks
 */
export function htmlToPlainText(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Replace <br> and block elements with newlines
  const blocks = temp.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, tr, div');
  blocks.forEach(el => {
    el.prepend('\n');
  });

  return (temp.textContent || temp.innerText || '').trim();
}

/**
 * Convert HTML content to Markdown
 */
export function htmlToMarkdown(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;

  let md = '';

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    let inner = '';

    el.childNodes.forEach(child => {
      inner += walk(child);
    });

    switch (tag) {
      case 'h1':
        return `\n# ${inner.trim()}\n\n`;
      case 'h2':
        return `\n## ${inner.trim()}\n\n`;
      case 'h3':
        return `\n### ${inner.trim()}\n\n`;
      case 'h4':
        return `\n#### ${inner.trim()}\n\n`;
      case 'p':
        return `${inner.trim()}\n\n`;
      case 'strong':
      case 'b':
        return `**${inner}**`;
      case 'em':
      case 'i':
        return `*${inner}*`;
      case 'u':
        return `<u>${inner}</u>`;
      case 's':
      case 'strike':
        return `~~${inner}~~`;
      case 'code':
        return `\`${inner}\``;
      case 'pre':
        return `\n\`\`\`\n${inner.trim()}\n\`\`\`\n\n`;
      case 'blockquote':
        return `\n> ${inner.trim().replace(/\n/g, '\n> ')}\n\n`;
      case 'ul':
        return `\n${inner}\n`;
      case 'ol':
        return `\n${inner}\n`;
      case 'li':
        return `- ${inner.trim()}\n`;
      case 'hr':
        return `\n---\n\n`;
      case 'br':
        return `\n`;
      case 'table':
        return `\n${convertHtmlTableToMarkdown(el)}\n\n`;
      default:
        return inner;
    }
  }

  md = walk(temp);
  // Clean up excessive blank lines
  return md.replace(/\n{3,}/g, '\n\n').trim();
}

function convertHtmlTableToMarkdown(tableEl: HTMLElement): string {
  const rows = Array.from(tableEl.querySelectorAll('tr'));
  if (rows.length === 0) return '';

  const tableData: string[][] = [];
  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('th, td')).map(c => (c.textContent || '').trim());
    if (cells.length > 0) {
      tableData.push(cells);
    }
  });

  if (tableData.length === 0) return '';

  const colCount = Math.max(...tableData.map(r => r.length));
  let result = '\n';

  // Header row
  const header = tableData[0];
  result += '| ' + Array.from({ length: colCount }, (_, i) => header[i] || '').join(' | ') + ' |\n';
  result += '| ' + Array.from({ length: colCount }, () => '---').join(' | ') + ' |\n';

  // Body rows
  for (let r = 1; r < tableData.length; r++) {
    const row = tableData[r];
    result += '| ' + Array.from({ length: colCount }, (_, i) => row[i] || '').join(' | ') + ' |\n';
  }

  return result;
}

/**
 * Export document as Microsoft Word .docx / .doc compatible file
 */
export function exportToWordDoc(doc: DocumentState) {
  const fileName = `${doc.metadata.title || 'Document'}.doc`;
  
  const orientation = doc.settings.orientation;
  const isLandscape = orientation === 'landscape';

  const wordHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${doc.metadata.title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: ${isLandscape ? '11.0in 8.5in' : '8.5in 11.0in'};
      margin: ${doc.settings.margins.top}in ${doc.settings.margins.right}in ${doc.settings.margins.bottom}in ${doc.settings.margins.left}in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1F2937;
      background-color: ${doc.settings.backgroundColor || '#FFFFFF'};
    }
    h1 { font-size: 24pt; font-weight: bold; margin-bottom: 12pt; }
    h2 { font-size: 16pt; font-weight: bold; margin-bottom: 8pt; }
    h3 { font-size: 13pt; font-weight: bold; margin-bottom: 6pt; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; }
    th, td { border: 1px solid #CBD5E1; padding: 6pt 8pt; }
    th { background-color: #F1F5F9; font-weight: bold; }
  </style>
</head>
<body>
  <div class="Section1">
    ${doc.contentHtml}
  </div>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff' + wordHtml], {
    type: 'application/msword;charset=utf-8'
  });
  downloadBlob(blob, fileName);
}

/**
 * Export document as Standalone HTML file
 */
export function exportToHtmlFile(doc: DocumentState) {
  const fileName = `${doc.metadata.title || 'Document'}.html`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.metadata.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 40px 20px;
      background-color: #F3F4F6;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #111827;
      display: flex;
      justify-content: center;
    }
    .document-page {
      background-color: ${doc.settings.backgroundColor || '#FFFFFF'};
      width: ${doc.settings.orientation === 'landscape' ? '11in' : '8.5in'};
      min-height: ${doc.settings.orientation === 'landscape' ? '8.5in' : '11in'};
      padding: ${doc.settings.margins.top}in ${doc.settings.margins.right}in ${doc.settings.margins.bottom}in ${doc.settings.margins.left}in;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      box-sizing: border-box;
      position: relative;
    }
    ${doc.settings.watermarkText ? `
    .document-page::after {
      content: "${doc.settings.watermarkText}";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 72pt;
      font-weight: 800;
      color: ${doc.settings.watermarkColor || 'rgba(0,0,0,0.06)'};
      pointer-events: none;
      user-select: none;
      white-space: nowrap;
    }
    ` : ''}
    table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    th, td { border: 1px solid #E5E7EB; padding: 8px 12px; }
    th { background: #F9FAFB; }
    @media print {
      body { background: transparent; padding: 0; }
      .document-page { box-shadow: none; width: 100%; min-height: auto; }
    }
  </style>
</head>
<body>
  <div class="document-page">
    ${doc.contentHtml}
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, fileName);
}

/**
 * Export document as Markdown (.md)
 */
export function exportToMarkdownFile(doc: DocumentState) {
  const fileName = `${doc.metadata.title || 'Document'}.md`;
  const mdContent = htmlToMarkdown(doc.contentHtml);
  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, fileName);
}

/**
 * Export document as Plain Text (.txt)
 */
export function exportToPlainTextFile(doc: DocumentState) {
  const fileName = `${doc.metadata.title || 'Document'}.txt`;
  const textContent = htmlToPlainText(doc.contentHtml);
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, fileName);
}

/**
 * Export document as JSON backup
 */
export function exportToJsonProject(doc: DocumentState) {
  const fileName = `${doc.metadata.title || 'Document'}.docucraft.json`;
  const jsonContent = JSON.stringify(doc, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  downloadBlob(blob, fileName);
}

/**
 * Export document as PDF file using jsPDF html renderer
 */
export async function exportToPdfFile(doc: DocumentState, elementId: string = 'document-page-canvas'): Promise<void> {
  const fileName = `${doc.metadata.title || 'Document'}.pdf`;
  const element = document.getElementById(elementId);

  if (!element) {
    // Fallback to print
    window.print();
    return;
  }

  const isLandscape = doc.settings.orientation === 'landscape';
  const pdf = new jsPDF({
    orientation: isLandscape ? 'l' : 'p',
    unit: 'pt',
    format: doc.settings.size === 'a4' ? 'a4' : 'letter',
  });

  try {
    await pdf.html(element, {
      callback: (docObj) => {
        docObj.save(fileName);
      },
      x: 10,
      y: 10,
      width: isLandscape ? 770 : 590,
      windowWidth: 800,
      autoPaging: 'text',
    });
  } catch (err) {
    console.error('jsPDF generation failed, falling back to window.print():', err);
    window.print();
  }
}
