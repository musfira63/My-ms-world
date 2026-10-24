/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, Plus } from 'lucide-react';
import { VelumDocument, RibbonTab, SaveStatus, AppMode, PageSettings } from './types/document';
import { 
  createNewDocument, 
  saveDocumentLocally, 
  getDocumentLocally, 
  listLocalDocuments, 
  deleteDocumentLocally, 
  duplicateDocumentLocally, 
  getLastActiveDocument 
} from './db/indexedDb';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { TopBar } from './components/topbar/TopBar';
import { Ribbon } from './components/ribbon/Ribbon';
import { VelumEditor, VelumEditorRef } from './components/editor/VelumEditor';
import { StatusBar } from './components/statusbar/StatusBar';
import { NavigationSidebar } from './components/sidebar/NavigationSidebar';
import { AccessibleFontModal } from './components/font/AccessibleFontModal';
import { AccessibilityPanelModal } from './components/accessibility/AccessibilityPanelModal';
import { VelumDocManagerModal } from './components/modals/VelumDocManagerModal';
import { VelumExportModal } from './components/modals/VelumExportModal';
import { TableModal } from './components/TableModal';
import { ImageAltModal } from './components/modals/ImageAltModal';
import { LinkModal } from './components/modals/LinkModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';
import { FindReplaceModal } from './components/FindReplaceModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { PdfEditor } from './components/PdfEditor';
import { importDocxFile } from './utils/docxHandler';
import { NovelPublishStudioModal } from './components/novel/NovelPublishStudioModal';
import { DrawingModal } from './components/modals/DrawingModal';
import { SymbolsModal } from './components/modals/SymbolsModal';
import { PageSetupModal } from './components/modals/PageSetupModal';
import { SpeechVoiceService } from './utils/speechVoiceService';
import { NovelChapter } from './types/document';

function WordProcessorApp() {
  const { settings: accessibility, updateSettings } = useAccessibility();
  
  // App mode: Word Processor vs PDF Studio
  const [appMode, setAppMode] = useState<AppMode>('word');

  // Document state
  const [currentDocument, setCurrentDocument] = useState<VelumDocument>(() => 
    createNewDocument('Executive Briefing & Strategic Overview')
  );
  const [documentsList, setDocumentsList] = useState<VelumDocument[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved_local');
  const [lastSavedAt, setLastSavedAt] = useState<number>(Date.now());

  // Workspace UI state
  const [activeTab, setActiveTab] = useState<RibbonTab>('home');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');

  // Modals
  const [isFontModalOpen, setIsFontModalOpen] = useState<boolean>(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState<boolean>(false);
  const [isDocManagerModalOpen, setIsDocManagerModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [isFindReplaceModalOpen, setIsFindReplaceModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isNovelModalOpen, setIsNovelModalOpen] = useState<boolean>(false);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState<boolean>(false);
  const [isSymbolsModalOpen, setIsSymbolsModalOpen] = useState<boolean>(false);
  const [isPageSetupModalOpen, setIsPageSetupModalOpen] = useState<boolean>(false);

  // Voice Typing & Read Aloud Audio State
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const editorRef = useRef<VelumEditorRef>(null);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and load last active document from IndexedDB
  useEffect(() => {
    async function loadInitial() {
      try {
        const lastActive = await getLastActiveDocument();
        const all = await listLocalDocuments();
        setDocumentsList(all);

        if (lastActive) {
          setCurrentDocument(lastActive);
          setLastSavedAt(lastActive.lastSavedAt || Date.now());
          setSaveStatus('saved_local');
        } else {
          // Seed with rich executive template
          const initial = createNewDocument('Executive Briefing & Strategic Overview', `
            <h1>Executive Briefing &amp; Strategic Roadmap</h1>
            <p>Welcome to <strong>Velum Writer Pro</strong>, a premium accessible document studio designed for high-clarity typography, native DOCX fidelity, and WCAG 2.2 AA accessibility.</p>
            <h2>1. Document Architecture &amp; Core Highlights</h2>
            <p>During the current reporting cycle, key operational improvements were delivered across distributed data nodes with zero service degradation:</p>
            <ul>
              <li>High-throughput IndexedDB local persistence with automatic crash recovery.</li>
              <li>Searchable Accessible Font Engine featuring <em>Atkinson Hyperlegible</em>, <em>Lexend</em>, and classic office typefaces.</li>
              <li>Real native DOCX OpenXML binary export and Mammoth DOCX import.</li>
            </ul>
            <h2>2. Key Performance Indicators</h2>
            <p>Review the cross-functional metrics below for the upcoming operational phase:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 12pt 0;">
              <thead>
                <tr style="background-color: #1E293B; color: #FFFFFF;">
                  <th style="padding: 8pt; border: 1px solid #CBD5E1; text-align: left;">Strategic Initiative</th>
                  <th style="padding: 8pt; border: 1px solid #CBD5E1; text-align: left;">Target Deadline</th>
                  <th style="padding: 8pt; border: 1px solid #CBD5E1; text-align: left;">Compliance Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8pt; border: 1px solid #CBD5E1;">WCAG 2.2 Level AA Full Verification</td>
                  <td style="padding: 8pt; border: 1px solid #CBD5E1;">October 2026</td>
                  <td style="padding: 8pt; border: 1px solid #CBD5E1; color: #16A34A; font-weight: bold;">Verified</td>
                </tr>
                <tr>
                  <td style="padding: 8pt; border: 1px solid #CBD5E1;">Native OpenXML .docx Export Engine</td>
                  <td style="padding: 8pt; border: 1px solid #CBD5E1;">October 2026</td>
                  <td style="padding: 8pt; border: 1px solid #CBD5E1; color: #16A34A; font-weight: bold;">Verified</td>
                </tr>
              </tbody>
            </table>
            <p>Select any paragraph to experiment with accessible fonts, high contrast modes, and spacing micro-adjustments.</p>
          `);
          await saveDocumentLocally(initial);
          setCurrentDocument(initial);
          const updatedList = await listLocalDocuments();
          setDocumentsList(updatedList);
        }
      } catch (err) {
        console.error('Initialization error from IndexedDB:', err);
      }
    }
    loadInitial();
  }, []);

  // Real IndexedDB Save Execution
  const performSave = useCallback(async (docToSave: VelumDocument) => {
    setSaveStatus('saving');
    try {
      await saveDocumentLocally(docToSave);
      const all = await listLocalDocuments();
      setDocumentsList(all);
      setLastSavedAt(Date.now());
      setSaveStatus('saved_local');
    } catch (err) {
      console.error('Failed to save document to IndexedDB:', err);
      setSaveStatus('error');
    }
  }, []);

  // Debounced Autosave on editor change
  const handleEditorChange = useCallback((html: string, json: any) => {
    setSaveStatus('saving');
    setCurrentDocument((prev) => {
      const updated: VelumDocument = {
        ...prev,
        contentHtml: html,
        contentJson: json,
        updatedAt: Date.now(),
      };

      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }

      autosaveTimeoutRef.current = setTimeout(() => {
        performSave(updated);
      }, 1500);

      return updated;
    });
  }, [performSave]);

  // Document Title Change
  const handleUpdateTitle = (newTitle: string) => {
    setCurrentDocument((prev) => {
      const updated = { ...prev, title: newTitle, updatedAt: Date.now() };
      performSave(updated);
      return updated;
    });
  };

  // Document Switching
  const handleSelectDocument = (doc: VelumDocument) => {
    setCurrentDocument(doc);
    setLastSavedAt(doc.lastSavedAt || doc.updatedAt);
    setSaveStatus('saved_local');
  };

  const handleCreateNewDocument = async () => {
    const newDoc = createNewDocument('Untitled Document');
    await performSave(newDoc);
    setCurrentDocument(newDoc);
  };

  const handleDuplicateDocument = async (docId: string) => {
    try {
      const duplicated = await duplicateDocumentLocally(docId);
      const all = await listLocalDocuments();
      setDocumentsList(all);
      setCurrentDocument(duplicated);
    } catch (err) {
      console.error('Failed to duplicate document:', err);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await deleteDocumentLocally(docId);
      const all = await listLocalDocuments();
      setDocumentsList(all);
      if (currentDocument.id === docId && all.length > 0) {
        setCurrentDocument(all[0]);
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const handleImportDocument = async (title: string, html: string) => {
    const importedDoc = createNewDocument(title, html);
    await performSave(importedDoc);
    setCurrentDocument(importedDoc);
  };

  // Direct DOCX upload shortcut from Ribbon
  const handleDirectImportDocx = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx,.doc';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        try {
          const { title, html } = await importDocxFile(file);
          handleImportDocument(title, html);
        } catch (err) {
          console.error('Error importing docx file:', err);
        }
      }
    };
    input.click();
  };

  // Convert extracted PDF text to editable Word document
  const handleConvertPdfToWord = async (html: string, fileName: string) => {
    const title = fileName ? fileName.replace(/\.pdf$/i, '') : 'Converted PDF Document';
    const importedDoc = createNewDocument(title, html);
    await performSave(importedDoc);
    setCurrentDocument(importedDoc);
    setAppMode('word');
    setActiveTab('home');
  };

  // Page Settings updater
  const handleUpdatePageSettings = (settings: Partial<PageSettings>) => {
    setCurrentDocument((prev) => {
      const updated = {
        ...prev,
        pageSettings: { ...prev.pageSettings, ...settings },
        updatedAt: Date.now(),
      };
      performSave(updated);
      return updated;
    });
  };

  // Font application to editor selection or entire document
  const handleApplyFont = (
    fontFamily: string, 
    size?: number, 
    spacing?: { letter?: number; word?: number; lineHeight?: number },
    applyToDocument?: boolean
  ) => {
    const editor = editorInstance || editorRef.current?.getEditor();
    const shouldApplyAll = applyToDocument || !selectedText;

    if (editor) {
      if (shouldApplyAll) {
        editor.chain().focus().selectAll().setFontFamily(fontFamily).run();
      } else {
        editor.chain().focus().setFontFamily(fontFamily).run();
      }
      if (size) {
        if (shouldApplyAll) {
          editor.chain().focus().selectAll().setMark('textStyle', { fontSize: `${size}pt` }).run();
        } else {
          editor.chain().focus().setMark('textStyle', { fontSize: `${size}pt` }).run();
        }
      }
    }

    if (shouldApplyAll) {
      handleUpdatePageSettings({
        defaultFontFamily: fontFamily,
        defaultFontSize: size || currentDocument.pageSettings.defaultFontSize || 11,
      });
    }

    if (spacing) {
      updateSettings({
        customLetterSpacing: spacing.letter ?? 0,
        customWordSpacing: spacing.word ?? 0,
        customLineHeight: spacing.lineHeight ?? 1.5,
      });
    }
  };

  // Metrics calculation
  const getMetrics = () => {
    const temp = document.createElement('div');
    temp.innerHTML = currentDocument.contentHtml || '';
    const text = (temp.textContent || temp.innerText || '').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    return { words, chars };
  };

  const { words: wordCount, chars: charCount } = getMetrics();

  // Voice dictation & read aloud
  const handleToggleDictation = () => {
    if (isDictating) {
      SpeechVoiceService.stopDictation();
      setIsDictating(false);
    } else {
      const started = SpeechVoiceService.startDictation(
        (transcript, isFinal) => {
          if (isFinal) {
            editorRef.current?.getEditor()?.chain().focus().insertContent(transcript + ' ').run();
          }
        },
        (err) => {
          console.warn('Dictation notice:', err);
          setIsDictating(false);
        },
        (listening) => {
          setIsDictating(listening);
        }
      );
      if (!started) {
        setIsDictating(false);
      }
    }
  };

  const handleToggleReadAloud = () => {
    if (isSpeaking) {
      SpeechVoiceService.stopSpeech();
      setIsSpeaking(false);
    } else {
      const editor = editorRef.current?.getEditor();
      const textToRead = selectedText || editor?.getText() || '';
      if (!textToRead.trim()) return;
      setIsSpeaking(true);
      SpeechVoiceService.speakText(
        textToRead, 
        accessibility.speechRate || 1.0, 
        undefined, 
        () => setIsSpeaking(false)
      );
    }
  };

  const handleLoadChapterContent = (chapter: NovelChapter) => {
    editorRef.current?.setHtml(chapter.contentHtml);
    setCurrentDocument((prev) => ({
      ...prev,
      contentHtml: chapter.contentHtml,
    }));
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        performSave(currentDocument);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setIsExportModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setIsFindReplaceModalOpen(true);
      } else if (e.key === 'Escape') {
        setIsFontModalOpen(false);
        setIsAccessibilityModalOpen(false);
        setIsDocManagerModalOpen(false);
        setIsExportModalOpen(false);
        setIsTableModalOpen(false);
        setIsImageModalOpen(false);
        setIsLinkModalOpen(false);
        setIsShortcutsModalOpen(false);
        setIsFindReplaceModalOpen(false);
        setIsAiModalOpen(false);
        setIsNovelModalOpen(false);
        setIsDrawingModalOpen(false);
        setIsSymbolsModalOpen(false);
        setIsPageSetupModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDocument, performSave]);

  const activeEditor = editorInstance || editorRef.current?.getEditor();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-100 font-sans">
      {/* 1. Universal Top Title Bar */}
      <TopBar
        title={appMode === 'pdf_studio' ? 'PDF Studio & Annotation Canvas' : currentDocument.title}
        onUpdateTitle={handleUpdateTitle}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        onSaveNow={() => performSave(currentDocument)}
        onOpenDocManager={() => setIsDocManagerModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenNovelStudio={() => setIsNovelModalOpen(true)}
        onOpenPageSetup={() => setIsPageSetupModalOpen(true)}
        appMode={appMode}
        onToggleAppMode={setAppMode}
      />

      {/* Focus Mode Exit Control */}
      {accessibility.focusMode && (
        <div className="fixed top-3 right-4 z-50 flex items-center gap-2 bg-slate-900/95 text-white px-3 py-1.5 rounded-full shadow-2xl border border-slate-700 text-xs animate-in fade-in duration-150">
          <span className="font-medium text-slate-300">Focus Mode</span>
          <button
            type="button"
            onClick={() => updateSettings({ focusMode: false })}
            className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition text-[11px]"
          >
            Show Ribbon
          </button>
        </div>
      )}

      {/* 2. Ribbon Toolbar (Active in Word Document Mode & hidden in Focus Mode) */}
      {appMode === 'word' && !accessibility.focusMode && (
        <Ribbon
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          editor={activeEditor}
          pageSettings={currentDocument.pageSettings}
          onUpdatePageSettings={handleUpdatePageSettings}
          onOpenFontModal={() => setIsFontModalOpen(true)}
          onOpenAccessibilityModal={() => setIsAccessibilityModalOpen(true)}
          onOpenTableModal={() => setIsTableModalOpen(true)}
          onOpenImageModal={() => setIsImageModalOpen(true)}
          onOpenLinkModal={() => setIsLinkModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenDocManagerModal={() => setIsDocManagerModalOpen(true)}
          onOpenFindReplaceModal={() => setIsFindReplaceModalOpen(true)}
          onOpenAiAssistantModal={() => setIsAiModalOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
          onImportDocx={handleDirectImportDocx}
          onOpenPdfStudio={() => setAppMode('pdf_studio')}
          onOpenNovelModal={() => setIsNovelModalOpen(true)}
          onOpenDrawingModal={() => setIsDrawingModalOpen(true)}
          onOpenSymbolsModal={() => setIsSymbolsModalOpen(true)}
          onOpenPageSetupModal={() => setIsPageSetupModalOpen(true)}
          isDictating={isDictating}
          onToggleDictation={handleToggleDictation}
          isSpeaking={isSpeaking}
          onToggleReadAloud={handleToggleReadAloud}
          zoomLevel={zoomLevel}
          onUpdateZoom={setZoomLevel}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          wordCount={wordCount}
          charCount={charCount}
        />
      )}

      {/* 2.5 Document Tabs & Productivity Strip */}
      {appMode === 'word' && !accessibility.focusMode && (
        <div className="flex items-center justify-between px-4 py-1 bg-neutral-200/80 border-b border-neutral-300 text-xs select-none">
          {/* Active & Recent Document Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[70vw] py-0.5">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border-t-2 border-blue-600 rounded-t shadow-2xs font-semibold text-neutral-900 border-x border-neutral-300">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate max-w-[180px]">{currentDocument.title}</span>
            </div>

            {documentsList
              .filter((d) => d.id !== currentDocument.id)
              .slice(0, 3)
              .map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleSelectDocument(doc)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 hover:bg-neutral-50 rounded-t text-neutral-600 hover:text-neutral-900 border border-transparent hover:border-neutral-300 transition"
                >
                  <FileText className="w-3 h-3 text-neutral-400" />
                  <span className="truncate max-w-[140px]">{doc.title}</span>
                </button>
              ))}

            <button
              type="button"
              onClick={handleCreateNewDocument}
              className="p-1 px-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-300 rounded font-bold"
              title="New Blank Document"
            >
              +
            </button>
          </div>

          {/* Quick Metrics & Reading Time */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-neutral-500 font-medium">
            <span>
              Words: <strong className="text-neutral-800 font-bold">{wordCount.toLocaleString()}</strong>
            </span>
            <span>•</span>
            <span>
              Read time: <strong className="text-neutral-800 font-bold">{Math.max(1, Math.ceil(wordCount / 225))} min</strong>
            </span>
          </div>
        </div>
      )}

      {/* 3. Main Workspace: Word Canvas or PDF Studio */}
      <main className="flex-1 flex overflow-hidden relative">
        {appMode === 'pdf_studio' ? (
          <PdfEditor onConvertToWordDocument={handleConvertPdfToWord} />
        ) : (
          <>
            {/* Navigation Outline Sidebar */}
            <NavigationSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              contentHtml={currentDocument.contentHtml}
              wordCount={wordCount}
              charCount={charCount}
            />

            {/* Paginated Tiptap Editor */}
            <VelumEditor
              ref={editorRef}
              initialContent={currentDocument.contentHtml}
              onChange={handleEditorChange}
              pageSettings={currentDocument.pageSettings}
              accessibility={accessibility}
              zoomLevel={zoomLevel}
              onSelectionChange={setSelectedText}
              onEditorReady={setEditorInstance}
              onPageCountChange={setTotalPages}
            />
          </>
        )}
      </main>

      {/* 4. Bottom Status Bar */}
      <StatusBar
        wordCount={wordCount}
        charCount={charCount}
        pageSettings={currentDocument.pageSettings}
        zoomLevel={zoomLevel}
        onUpdateZoom={setZoomLevel}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        appMode={appMode}
        totalPages={totalPages}
      />

      {/* 5. Modals & Dialogs */}
      <AccessibleFontModal
        isOpen={isFontModalOpen}
        onClose={() => setIsFontModalOpen(false)}
        currentFont={activeEditor?.getAttributes('textStyle').fontFamily || 'Plus Jakarta Sans'}
        onApplyFont={handleApplyFont}
        sampleText={selectedText || undefined}
      />

      <AccessibilityPanelModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
      />

      <VelumDocManagerModal
        isOpen={isDocManagerModalOpen}
        onClose={() => setIsDocManagerModalOpen(false)}
        documents={documentsList}
        currentDocId={currentDocument.id}
        onSelectDocument={handleSelectDocument}
        onCreateNewDocument={handleCreateNewDocument}
        onDuplicateDocument={handleDuplicateDocument}
        onDeleteDocument={handleDeleteDocument}
        onImportDocument={handleImportDocument}
      />

      <VelumExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        document={currentDocument}
      />

      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onInsertTable={(rows, cols, hasHeader) => {
          activeEditor?.chain().focus().insertTable({ rows, cols, withHeaderRow: hasHeader }).run();
        }}
      />

      <ImageAltModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsertImage={(src, alt) => {
          activeEditor?.chain().focus().setImage({ src, alt, title: alt }).run();
        }}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        initialUrl={activeEditor?.getAttributes('link').href || ''}
        onApplyLink={(url) => {
          activeEditor?.chain().focus().setLink({ href: url }).run();
        }}
        onRemoveLink={() => {
          activeEditor?.chain().focus().unsetLink().run();
        }}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <FindReplaceModal
        isOpen={isFindReplaceModalOpen}
        onClose={() => setIsFindReplaceModalOpen(false)}
        onFind={(query, matchCase) => {
          const text = activeEditor?.getText() || '';
          const flags = matchCase ? 'g' : 'gi';
          const matches = text.match(new RegExp(query, flags));
          return matches ? matches.length : 0;
        }}
        onReplace={(query, replacement, matchCase) => {
          const html = activeEditor?.getHTML() || '';
          const flags = matchCase ? '' : 'i';
          const newHtml = html.replace(new RegExp(query, flags), replacement);
          editorRef.current?.setHtml(newHtml);
        }}
        onReplaceAll={(query, replacement, matchCase) => {
          const html = activeEditor?.getHTML() || '';
          const flags = matchCase ? 'g' : 'gi';
          const matches = html.match(new RegExp(query, flags)) || [];
          const newHtml = html.replace(new RegExp(query, flags), replacement);
          editorRef.current?.setHtml(newHtml);
          return matches.length;
        }}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        selectedText={selectedText}
        onApplyResult={(newText) => {
          if (selectedText) {
            activeEditor?.chain().focus().insertContent(newText).run();
          } else {
            activeEditor?.chain().focus().insertContent(`<p>${newText}</p>`).run();
          }
        }}
      />

      <NovelPublishStudioModal
        isOpen={isNovelModalOpen}
        onClose={() => setIsNovelModalOpen(false)}
        document={currentDocument}
        onUpdateDocument={(doc) => {
          setCurrentDocument(doc);
          performSave(doc);
        }}
        onLoadChapterContent={handleLoadChapterContent}
        currentEditorHtml={currentDocument.contentHtml}
      />

      <DrawingModal
        isOpen={isDrawingModalOpen}
        onClose={() => setIsDrawingModalOpen(false)}
        onInsertImage={(dataUrl) => {
          activeEditor?.chain().focus().setImage({ src: dataUrl, alt: 'Novel Map / Sketch Canvas' }).run();
        }}
      />

      <SymbolsModal
        isOpen={isSymbolsModalOpen}
        onClose={() => setIsSymbolsModalOpen(false)}
        onInsertSymbol={(sym) => {
          activeEditor?.chain().focus().insertContent(sym).run();
        }}
      />

      <PageSetupModal
        isOpen={isPageSetupModalOpen}
        onClose={() => setIsPageSetupModalOpen(false)}
        pageSettings={currentDocument.pageSettings}
        onSavePageSettings={handleUpdatePageSettings}
      />
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <WordProcessorApp />
    </AccessibilityProvider>
  );
}
