import JSZip from 'jszip';
import { NovelProject, VelumDocument } from '../types/document';

/**
 * Clean HTML for EPUB XHTML compatibility
 */
function sanitizeForXhtml(html: string): string {
  if (!html) return '<p></p>';
  return html
    .replace(/<br>/gi, '<br />')
    .replace(/<hr>/gi, '<hr />')
    .replace(/&nbsp;/g, '&#160;')
    .replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />');
}

/**
 * Generate a standard, validated EPUB eBook file from document or novel project
 */
export async function exportToEpub(
  document: VelumDocument,
  novel?: NovelProject
): Promise<void> {
  const zip = new JSZip();

  const title = novel?.synopsis ? document.title : document.title || 'Untitled Novel';
  const author = novel?.penName || 'Author';
  const genre = novel?.genre || 'Fiction';
  const year = novel?.publishSettings?.copyrightYear || new Date().getFullYear().toString();
  const isbn = novel?.publishSettings?.isbn || '978-0-000000-00-0';
  const bookUuid = `urn:uuid:${document.id || Date.now().toString()}`;

  // 1. mimetype (Must be first, uncompressed)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  zip.folder('META-INF')?.file(
    'container.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  const oebps = zip.folder('OEBPS');
  if (!oebps) return;

  // 3. OEBPS/style.css with publishing book typography
  oebps.file(
    'style.css',
    `body {
  font-family: "Georgia", "Times New Roman", serif;
  margin: 5%;
  line-height: 1.6;
  color: #1a1a1a;
  text-align: justify;
}
h1, h2, h3 {
  text-align: center;
  font-weight: normal;
  margin-top: 2em;
  margin-bottom: 1em;
  font-family: "Palatino", "Georgia", serif;
}
h1.book-title {
  font-size: 2.2em;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 30vh;
}
p.author {
  text-align: center;
  font-size: 1.3em;
  font-style: italic;
  margin-bottom: 40vh;
}
p.copyright {
  font-size: 0.85em;
  text-align: center;
  color: #555;
  margin-top: 40vh;
}
.chapter-num {
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.9em;
  color: #777;
  margin-bottom: 0.5em;
}
.chapter-title {
  text-align: center;
  font-size: 1.8em;
  margin-bottom: 2em;
}
p {
  text-indent: 1.5em;
  margin: 0;
  padding: 0;
}
p.first-paragraph {
  text-indent: 0;
}
p.first-paragraph::first-letter {
  float: left;
  font-size: 3.2em;
  line-height: 0.8;
  padding-top: 4px;
  padding-right: 8px;
  padding-bottom: 2px;
  font-family: "Georgia", serif;
}
.scene-divider {
  text-align: center;
  margin: 2em 0;
  font-size: 1.2em;
  color: #666;
  letter-spacing: 0.5em;
}`
  );

  // 4. Determine chapters
  const chapters: { id: string; title: string; filename: string; content: string }[] = [];

  // Title Page
  const titleHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
  <div style="text-align: center;">
    <h1 class="book-title">${title}</h1>
    <p class="author">by ${author}</p>
    <p style="text-align:center; font-size: 0.9em; color: #888;">${genre}</p>
  </div>
</body>
</html>`;
  oebps.file('titlepage.xhtml', titleHtml);
  chapters.push({ id: 'titlepage', title: 'Title Page', filename: 'titlepage.xhtml', content: titleHtml });

  // Copyright Page
  const copyrightHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Copyright</title>
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
  <div class="copyright">
    <p>${title}</p>
    <p>Copyright © ${year} by ${author}. All rights reserved.</p>
    <p style="margin-top: 1em;">ISBN: ${isbn}</p>
    <p style="margin-top: 1em; font-size: 0.8em;">Published with DocuCraft Novel Studio.<br />No part of this publication may be reproduced, stored in a retrieval system, or transmitted in any form without prior written permission of the publisher.</p>
  </div>
</body>
</html>`;
  oebps.file('copyright.xhtml', copyrightHtml);
  chapters.push({ id: 'copyright', title: 'Copyright', filename: 'copyright.xhtml', content: copyrightHtml });

  // Dedication if available
  if (novel?.publishSettings?.includeDedication && novel.publishSettings.dedicationText) {
    const dedicationHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Dedication</title>
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
  <div style="margin-top: 35vh; text-align: center; font-style: italic;">
    <p>${novel.publishSettings.dedicationText}</p>
  </div>
</body>
</html>`;
    oebps.file('dedication.xhtml', dedicationHtml);
    chapters.push({ id: 'dedication', title: 'Dedication', filename: 'dedication.xhtml', content: dedicationHtml });
  }

  // Manuscript / Novel Chapters
  if (novel && novel.chapters && novel.chapters.length > 0) {
    novel.chapters.forEach((chap, idx) => {
      const chapFilename = `chapter_${idx + 1}.xhtml`;
      const sanitized = sanitizeForXhtml(chap.contentHtml);
      const chHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${chap.title}</title>
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
  <div class="chapter-num">Chapter ${chap.number || idx + 1}</div>
  <h2 class="chapter-title">${chap.title}</h2>
  <div class="chapter-body">
    ${sanitized}
  </div>
</body>
</html>`;
      oebps.file(chapFilename, chHtml);
      chapters.push({
        id: `chap_${idx + 1}`,
        title: chap.title || `Chapter ${idx + 1}`,
        filename: chapFilename,
        content: chHtml,
      });
    });
  } else {
    // Single document export
    const sanitized = sanitizeForXhtml(document.contentHtml);
    const mainHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
  <h2 class="chapter-title">${title}</h2>
  <div class="chapter-body">
    ${sanitized}
  </div>
</body>
</html>`;
    oebps.file('content.xhtml', mainHtml);
    chapters.push({ id: 'content', title, filename: 'content.xhtml', content: mainHtml });
  }

  // 5. OEBPS/toc.ncx (for EPUB 2/3 readers)
  const navPoints = chapters
    .map(
      (ch, idx) => `
    <navPoint id="navPoint-${idx + 1}" playOrder="${idx + 1}">
      <navLabel><text>${ch.title}</text></navLabel>
      <content src="${ch.filename}"/>
    </navPoint>`
    )
    .join('');

  const ncxContent = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${bookUuid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${title}</text></docTitle>
  <docAuthor><text>${author}</text></docAuthor>
  <navMap>${navPoints}
  </navMap>
</ncx>`;
  oebps.file('toc.ncx', ncxContent);

  // 6. OEBPS/content.opf
  const manifestItems = chapters
    .map((ch) => `<item id="${ch.id}" href="${ch.filename}" media-type="application/xhtml+xml"/>`)
    .join('\n    ');

  const spineItems = chapters.map((ch) => `<itemref idref="${ch.id}"/>`).join('\n    ');

  const opfContent = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${title}</dc:title>
    <dc:creator opf:role="aut">${author}</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="BookId">${bookUuid}</dc:identifier>
    <dc:date>${year}</dc:date>
    <dc:publisher>${novel?.publishSettings?.publisherName || 'Self-Published'}</dc:publisher>
    <dc:subject>${genre}</dc:subject>
    <dc:description>${novel?.synopsis || 'Published with DocuCraft Novel Studio'}</dc:description>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="style" href="style.css" media-type="text/css"/>
    ${manifestItems}
  </manifest>
  <spine toc="ncx">
    ${spineItems}
  </spine>
</package>`;
  oebps.file('content.opf', opfContent);

  // 7. Generate and download .epub
  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.epub`;
  window.document.body.appendChild(a);
  a.click();
  window.document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
