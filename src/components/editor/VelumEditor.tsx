import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import FontFamily from '@tiptap/extension-font-family';
import { Pagination, createPageLayout } from 'tiptap-a4-pagination';
import 'tiptap-a4-pagination/styles.css';
import { PageSettings, AccessibilitySettings } from '../../types/document';

export interface VelumEditorRef {
  getEditor: () => ReturnType<typeof useEditor>;
  getHtml: () => string;
  getJSON: () => any;
  setHtml: (html: string) => void;
}

interface VelumEditorProps {
  initialContent: string;
  onChange: (html: string, json: any) => void;
  pageSettings: PageSettings;
  accessibility: AccessibilitySettings;
  zoomLevel: number;
  onSelectionChange?: (selectedText: string) => void;
  onEditorReady?: (editor: any) => void;
  onPageCountChange?: (count: number) => void;
}

export const VelumEditor = forwardRef<VelumEditorRef, VelumEditorProps>(({
  initialContent,
  onChange,
  pageSettings,
  accessibility,
  zoomLevel,
  onSelectionChange,
  onEditorReady,
  onPageCountChange,
}, ref) => {
  const [pageCount, setPageCount] = useState<number>(1);
  const lastAppliedExternalContentRef = useRef<string | null>(null);

  const editor = useEditor({
    editable: true,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Subscript,
      Superscript,
      FontFamily,
      Pagination.configure({
        pageSelector: '#velum-document-page',
      }),
    ],
    content: initialContent || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
    },
    onSelectionUpdate: ({ editor }) => {
      if (onSelectionChange) {
        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to, ' ');
        onSelectionChange(text);
      }
    },
    editorProps: {
      attributes: {
        class: 'velum-prosemirror-content outline-none focus:outline-none min-h-[700px] leading-relaxed',
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': 'Document Editor Workspace',
      },
    },
  });

  useImperativeHandle(ref, () => ({
    getEditor: () => editor,
    getHtml: () => editor?.getHTML() || '',
    getJSON: () => editor?.getJSON() || {},
    setHtml: (html: string) => {
      const nextHtml = html || '<p></p>';
      lastAppliedExternalContentRef.current = nextHtml;
      editor?.commands.setContent(nextHtml, { emitUpdate: false });
    },
  }));

  // Update content only when the parent intentionally provides new external content.
  useEffect(() => {
    if (!editor) return;

    const nextContent = initialContent || '<p></p>';

    if (lastAppliedExternalContentRef.current === nextContent) {
      return;
    }

    lastAppliedExternalContentRef.current = nextContent;
    editor.commands.setContent(nextContent, { emitUpdate: false });
  }, [initialContent, editor]);

  // Notify parent component when editor instance is initialized
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Configure pagination layout dynamically when editor initializes or pageSettings change
  useEffect(() => {
    if (!editor) return;

    const mappedSize: 'A4' | 'Letter' | 'Legal' | 'A5' =
      pageSettings.size === 'letter' ? 'Letter' :
      pageSettings.size === 'legal' ? 'Legal' :
      pageSettings.size === 'executive' ? 'A5' : 'A4';

    const layout = createPageLayout({
      size: mappedSize,
      orientation: pageSettings.orientation,
      marginTop: pageSettings.margins.top * 25.4,
      marginBottom: pageSettings.margins.bottom * 25.4,
      gap: 28,
    });

    try {
      editor.commands.setPageLayout(layout);
    } catch (e) {
      console.warn('Pagination layout error:', e);
    }
  }, [editor, pageSettings.size, pageSettings.orientation, pageSettings.margins.top, pageSettings.margins.bottom]);

  // Track page count changes dynamically
  useEffect(() => {
    if (!editor) return;

    const checkPageCount = () => {
      const count = editor.storage?.pagination?.pageCount || 1;
      setPageCount((prev) => {
        if (prev !== count) {
          onPageCountChange?.(count);
          return count;
        }
        return prev;
      });
    };

    checkPageCount();
    editor.on('transaction', checkPageCount);
    return () => {
      editor.off('transaction', checkPageCount);
    };
  }, [editor, onPageCountChange]);

  // Dimensions based on page size and orientation (A4 baseline: 210mm x 297mm @ 96 DPI: ~794px x ~1123px)
  const isLandscape = pageSettings.orientation === 'landscape';
  let widthInches = 8.27; // A4 default
  let heightInches = 11.69;

  if (pageSettings.size === 'letter') {
    widthInches = 8.5;
    heightInches = 11.0;
  } else if (pageSettings.size === 'legal') {
    widthInches = 8.5;
    heightInches = 14.0;
  } else if (pageSettings.size === 'executive') {
    widthInches = 7.25;
    heightInches = 10.5;
  }

  if (isLandscape) {
    const temp = widthInches;
    widthInches = heightInches;
    heightInches = temp;
  }

  const dpi = 96;
  const paperWidthPx = widthInches * dpi;
  const paperMinHeightPx = heightInches * dpi;

  // Determine reading theme colors
  let pageBg = pageSettings.backgroundColor || '#FFFFFF';
  let pageTextColor = '#0F172A';
  let workspaceBg = '#E2E8F0';

  if (accessibility.readingTheme === 'sepia') {
    pageBg = '#FBF0D9';
    pageTextColor = '#382A1B';
    workspaceBg = '#EFE4CD';
  } else if (accessibility.readingTheme === 'dark') {
    pageBg = '#1E293B';
    pageTextColor = '#F1F5F9';
    workspaceBg = '#0F172A';
  } else if (accessibility.readingTheme === 'high_contrast') {
    pageBg = '#000000';
    pageTextColor = '#FFFF00'; // High contrast yellow on black (WCAG AAA)
    workspaceBg = '#121212';
  } else if (accessibility.readingTheme === 'solarized') {
    pageBg = '#FDF6E3';
    pageTextColor = '#586E75';
    workspaceBg = '#EEE8D5';
  }

  // Dyslexia friendly font override or document base font
  let activeFontFamily = pageSettings.defaultFontFamily || 'Calibri, Arial, sans-serif';

  if (accessibility.dyslexiaFriendly) {
    if (accessibility.dyslexiaFontPreference === 'opendyslexic') {
      activeFontFamily = '"OpenDyslexic", "OpenDyslexic-Regular", sans-serif';
    } else if (accessibility.dyslexiaFontPreference === 'lexend') {
      activeFontFamily = '"Lexend", sans-serif';
    } else {
      activeFontFamily = '"Atkinson Hyperlegible", "Lexend", sans-serif';
    }
  }

  return (
    <div
      className="flex-1 overflow-auto flex flex-col items-center py-8 px-4 transition-colors select-text relative cursor-default"
      style={{
        backgroundColor: workspaceBg,
        ['--workspace-bg' as any]: workspaceBg,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          editor?.commands.focus();
        }
      }}
    >
      {/* Visual Page Ruler (if enabled) */}
      {pageSettings.showRuler && !accessibility.focusMode && (
        <div
          className="bg-white border border-neutral-300 shadow-xs mb-3 flex items-end h-6 select-none rounded-t-xs text-[9px] text-neutral-400 font-mono relative overflow-hidden"
          style={{ width: `${paperWidthPx * (zoomLevel / 100)}px` }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex justify-between px-2 items-center">
            {Array.from({ length: Math.ceil(widthInches) }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span>{idx}</span>
                <div className="h-2 w-px bg-neutral-300" />
              </div>
            ))}
          </div>
          {/* Margin markers */}
          <div
            className="absolute top-0 bottom-0 bg-neutral-100/70 border-r border-blue-400"
            style={{ width: `${pageSettings.margins.left * dpi * (zoomLevel / 100)}px` }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 bg-neutral-100/70 border-l border-blue-400"
            style={{ width: `${pageSettings.margins.right * dpi * (zoomLevel / 100)}px` }}
          />
        </div>
      )}

      {/* Realistic Paper Page Canvas */}
      <div
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
          transition: accessibility.reducedMotion ? 'none' : 'transform 0.12s ease-out',
        }}
      >
        <div
          id="velum-document-page"
          className="document-page relative shadow-xl border border-neutral-300/80 rounded-xs transition-colors cursor-text"
          onClick={() => {
            if (!editor?.isFocused) {
              editor?.commands.focus();
            }
          }}
          style={{
            width: `${paperWidthPx}px`,
            minHeight: `${(paperMinHeightPx * Math.max(1, pageCount)) + (28 * (Math.max(1, pageCount) - 1))}px`,
            backgroundColor: pageBg,
            color: pageTextColor,
            paddingTop: `${pageSettings.margins.top}in`,
            paddingRight: `${pageSettings.margins.right}in`,
            paddingBottom: `${pageSettings.margins.bottom}in`,
            paddingLeft: `${pageSettings.margins.left}in`,
            boxSizing: 'border-box',
            fontFamily: activeFontFamily,
            letterSpacing: accessibility.customLetterSpacing ? `${accessibility.customLetterSpacing}em` : undefined,
            wordSpacing: accessibility.customWordSpacing ? `${accessibility.customWordSpacing}em` : undefined,
            lineHeight: accessibility.customLineHeight || undefined,
            ['--custom-paragraph-spacing' as any]: `${accessibility.customParagraphSpacing || 8}pt`,
            ['--workspace-bg' as any]: workspaceBg,
          }}
        >
          {/* Header if configured */}
          {pageSettings.headerText && (
            <div className="absolute top-4 left-8 right-8 text-xs text-neutral-400 border-b border-neutral-200 pb-1 select-none flex justify-between pointer-events-none">
              <span>{pageSettings.headerText}</span>
              <span>{pageSettings.size.toUpperCase()}</span>
            </div>
          )}

          {/* Watermark if configured */}
          {pageSettings.watermarkText && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
              style={{
                color: 'rgba(0, 0, 0, 0.05)',
                transform: 'rotate(-45deg)',
                fontSize: '76pt',
                fontWeight: 900,
                letterSpacing: '0.1em',
              }}
              aria-hidden="true"
            >
              {pageSettings.watermarkText}
            </div>
          )}

          {/* ProseMirror Editor Content */}
          <div className="relative z-10 w-full min-h-[700px] cursor-text">
            <EditorContent editor={editor} className="w-full min-h-[700px]" />
          </div>

          {/* Footer if configured */}
          {(pageSettings.showPageNumbers || pageSettings.footerText) && (
            <div className="absolute bottom-4 left-8 right-8 text-xs text-neutral-400 border-t border-neutral-200 pt-1 select-none flex justify-between pointer-events-none">
              <span>{pageSettings.footerText || ''}</span>
              {pageSettings.showPageNumbers && <span>Page 1 of {pageCount}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
