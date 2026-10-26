importReactfrom'react';
import{
X,
FileText,
FileCode,
FileType,
Download,
Printer,
FileCheck,
Check
}from lucide-react';
import{VelumDocument}from'../../types/document';
import{ exportToNativeDocx }from'../../utils/docxHandler';
import{
exportToPdfFile,
exportToHtmlFile,
exportToPlainTextFile,
exportToJsonProject
}from'../../utils/exportFormats';
import{ exportToEpub }from'../../utils/epubExporter';
import{ saveAsMusFile from'../../utils/musFileHandler';
interfaceVelumExportModalProps{
isopen: boolean;
onclose:
() => void;
document: VelumDocument;
}
exportconstvelumExportModal: React.FC<VelumExportModalProps> = ({
isopen,
onclose,
document,
}) => {
if(!isopen) returnnull;
const exportoptions = [
{
id: 'go',
name: 'MUS Native Document',
extension: '.mus',
badge: 'Native Format',},
extension: '.mus',
badge: 'Native Format',
description: 'Proprietary document package preserving full multi-page flow, custom fonts, margins, novel chapters, and complete document structure.',
color: 'bg-emerald-600',
action: () => saveAsMusFile (document),
id: 'epub',
name: 'EPUB Novel & eBook",
extension: .epub',
badge: 'Publishing Standard",
description: 'Standard reflowable eBook package with chapters, copyright page, drop caps, and metadata for Kindle, Apple Books, and Kobo.',
color: 'bg-indigo-600',
action: () => exportToEpub(document, document.novelData),
id: 'docx',
name: 'Microsoft Word Document',
extension: '.docx',
badge: 'Native OpenXML',
description: 'Generates a real, binary.docx file with true tables, headings, bold/italics, and margins, fully compatible with word, Pages, and Google Docs.',
color: 'bg-blue-600',
action: () => exportToNativeDocx(document),
id: 'pdf',
name: 'Adobe PDF Document',
extension: '.pdf',
badge: 'Print Ready',
description: 'Export as high-resolution paginated PDF honoring A4/Letter margins, watermarks, and typography.',
color: 'bg-rose-600',
action: () => {
// Map VelumDocument to DocumentState format expected by exportToPdfFile
const docstate: any = {
metadata: { title: document.title},
contentHtml: document.contentHtml,settings: document.pageSettings,
};
},
exportToPdfFile (docstate, 'velum-document-page');
id: 'html',
name: 'Standalone HTML Document',
extension: .html',
badge: 'Web Ready',
description: 'Self-contained webpage with embedded Google Fonts, clean styling, and offline reading support.',
color: 'bg-emerald-600',
action: () => {
const docState: any = {
};
metadata: ( title: document.title},
contentHtml: document.contentHtml,
settings: document.pageSettings,
exportToHtmlFile (docState);
id: 'txt',
name: 'Plain Text File',
extension: '.txt',
badge: 'Universal',
description: 'Clean A plain text with preserved line breaks and paragraph separations.",
color: 'bg-neutral-700',
action: () => {
const docstate: any = (
metadata: { title: document.title),
contentHtml: document.contentHtml,
settings: document.pageSettings,},
};
exportToPlainTextFile(docState);
id: 'json',
name: 'Velum Document Archive",
extension: .velum.json',
badge: 'Full State Backup',
description: 'Complete JSON archive containing document schema, Tiptap marks, margins, comments, and local metadata.',
color: 'bg-indigo-600',
action: () => {
const blob newBlob ([JSON.stringify(document, null, 2)], (type: 'application/json'));
const url = URL.createobjectURL (blob);
const a window.document.createElement('a');
a.href = url;
a.download ${document.title} .velum.json";
a.click();
URL.revokeObjectURL(url);
},
return(
<div
className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
onClick(onClose)
<div
className="bg-white rounded-x1 shadow-2x1 border border-neutral-300 w-full max-w-2x1 overflow-hidden flex flex-col"
role="dialog"
aria-modal="true"
aria-labelledby="export-modal-title"onclick= {(e) => e.stopPropagation ()}
<div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
<div>
<h2 id="export-modal-title" className="text-base font-bold text-neutral-900">
Export & DocumentConversionstudio
</h2>
<p className="text-xs text-neutral-500">
Save "{document.title)" to your local storage or download inany standard document format.
</p>
</div>
<button
type="button"
onclick={onClose]
className="text-neutral-400 hover: text-neutral-700 p-1.5 rounded-1g hover:bg-neutral-200"
<X className="w-5 h-5" />
</button>
</div>
<div className="p-6 grid grid-cols-2 gap-3.5 max-h-[65vh] overflow-y-auto">
[exportoptions.map((opt) => (
<div
key={opt.id}
className="p-4 rounded-1g border border-neutral-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between"
<div>
<div className="flex items-start justify-between gap-2 mb-2">
<div>
<h3 className="text-xs font-bold text-neutral-900">{opt.name}</h3>
<span className="font-mono text-[10px] text-neutral-500">(opt.extension)</span>
</div>
<span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
(opt.badge)
</span>
</div><p className="text-[11px] text-neutral-600 leading-relaxed mb-3">
{opt.description}
</p>
</div>
<div className="pt-2 border-t border-neutral-100 flex justify-end">
<button
type="button"
onclick={() => {
opt.action();
onClose();
}}
className="flex items-cenA</div>
</div>
);
};
