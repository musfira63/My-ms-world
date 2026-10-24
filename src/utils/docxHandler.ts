import mammoth from 'mammoth';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType 
} from 'docx';
import { VelumDocument } from '../types/document';
import { downloadBlob } from './exportFormats';

/**
 * Import a .docx file and convert it into clean HTML for the editor using mammoth
 */
export async function importDocxFile(file: File): Promise<{
  title: string;
  html: string;
  warnings: string[];
}> {
  const arrayBuffer = await file.arrayBuffer();
  
  const options = {
    // Preserve style mappings where feasible
    styleMap: [
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
      "p[style-name='Heading 3'] => h3:fresh",
      "p[style-name='Title'] => h1.title:fresh",
      "p[style-name='Subtitle'] => h2.subtitle:fresh",
    ]
  };

  const result = await (mammoth as any).convertToHtml({ arrayBuffer }, options);
  const cleanTitle = file.name.replace(/\.docx$/i, '').replace(/\.doc$/i, '');
  
  const warnings = (result.messages || []).map((m: any) => m.message);

  return {
    title: cleanTitle,
    html: result.value || '<p></p>',
    warnings,
  };
}

/**
 * Export a VelumDocument into a true native Microsoft Word (.docx) binary file using the docx package
 */
export async function exportToNativeDocx(doc: VelumDocument): Promise<void> {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = doc.contentHtml || '<p></p>';

  const docChildren: (Paragraph | Table)[] = [];

  // Parse HTML elements into docx Paragraphs and Tables
  Array.from(tempDiv.children).forEach((el) => {
    const tagName = el.tagName.toLowerCase();

    if (tagName === 'h1') {
      docChildren.push(
        new Paragraph({
          text: el.textContent || '',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (tagName === 'h2') {
      docChildren.push(
        new Paragraph({
          text: el.textContent || '',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (tagName === 'h3') {
      docChildren.push(
        new Paragraph({
          text: el.textContent || '',
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 160, after: 80 },
        })
      );
    } else if (tagName === 'table') {
      const tableRows: TableRow[] = [];
      const trElements = el.querySelectorAll('tr');

      trElements.forEach((tr, rIdx) => {
        const tableCells: TableCell[] = [];
        const cellEls = tr.querySelectorAll('th, td');

        cellEls.forEach((cell) => {
          tableCells.push(
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell.textContent || '',
                      bold: rIdx === 0,
                    }),
                  ],
                }),
              ],
              width: { size: 100 / (cellEls.length || 1), type: WidthType.PERCENTAGE },
            })
          );
        });

        if (tableCells.length > 0) {
          tableRows.push(new TableRow({ children: tableCells }));
        }
      });

      if (tableRows.length > 0) {
        docChildren.push(
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
      }
    } else if (tagName === 'ul' || tagName === 'ol') {
      const liElements = el.querySelectorAll('li');
      liElements.forEach((li) => {
        docChildren.push(
          new Paragraph({
            text: li.textContent || '',
            bullet: { level: 0 },
            spacing: { after: 80 },
          })
        );
      });
    } else {
      // General paragraph with inline formatting detection
      const textRuns: TextRun[] = [];

      function parseInline(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
          textRuns.push(new TextRun({ text: node.textContent || '' }));
          return;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const elem = node as HTMLElement;
          const tag = elem.tagName.toLowerCase();
          const isBold = tag === 'strong' || tag === 'b';
          const isItalic = tag === 'em' || tag === 'i';
          const isUnderline = tag === 'u';

          textRuns.push(
            new TextRun({
              text: elem.textContent || '',
              bold: isBold,
              italics: isItalic,
              underline: isUnderline ? {} : undefined,
            })
          );
        }
      }

      Array.from(el.childNodes).forEach(parseInline);

      docChildren.push(
        new Paragraph({
          children: textRuns.length > 0 ? textRuns : [new TextRun({ text: el.textContent || '' })],
          spacing: { after: 120, line: 360 },
        })
      );
    }
  });

  const docxFile = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: (doc.pageSettings?.margins?.top || 1.0) * 1440,
              right: (doc.pageSettings?.margins?.right || 1.0) * 1440,
              bottom: (doc.pageSettings?.margins?.bottom || 1.0) * 1440,
              left: (doc.pageSettings?.margins?.left || 1.0) * 1440,
            },
          },
        },
        children: docChildren.length > 0 ? docChildren : [new Paragraph({ text: doc.title })],
      },
    ],
  });

  const blob = await Packer.toBlob(docxFile);
  downloadBlob(blob, `${doc.title || 'Document'}.docx`);
}
