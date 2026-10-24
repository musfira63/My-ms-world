import React, { useMemo } from 'react';
import { 
  X, 
  ListTree, 
  FileText, 
  Hash, 
  Search, 
  BookOpen, 
  BarChart2, 
  HelpCircle 
} from 'lucide-react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  contentHtml: string;
  wordCount: number;
  charCount: number;
  onNavigateHeading?: (text: string) => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  isOpen,
  onClose,
  contentHtml,
  wordCount,
  charCount,
  onNavigateHeading,
}) => {
  const headings = useMemo<HeadingItem[]>(() => {
    const temp = document.createElement('div');
    temp.innerHTML = contentHtml;
    const headingEls = temp.querySelectorAll('h1, h2, h3, h4');
    const items: HeadingItem[] = [];

    headingEls.forEach((el, idx) => {
      const tag = el.tagName.toLowerCase();
      const level = parseInt(tag.replace('h', ''), 10) || 1;
      const text = el.textContent?.trim() || '';
      if (text) {
        items.push({
          id: `heading-${idx}`,
          text,
          level,
        });
      }
    });

    return items;
  }, [contentHtml]);

  if (!isOpen) return null;

  return (
    <aside 
      className="w-72 bg-white border-r border-neutral-200 flex flex-col h-full select-none z-20 shadow-sm animate-in slide-in-from-left-2 duration-150"
      aria-label="Document Outline & Navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50/70">
        <div className="flex items-center gap-2">
          <ListTree className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Document Outline
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-700 p-1 rounded hover:bg-neutral-200"
          aria-label="Close outline sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Headings tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
        {headings.length === 0 ? (
          <div className="p-6 text-center text-neutral-400 text-xs">
            <Hash className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-neutral-600">No headings yet</p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Add Heading 1, 2, or 3 from the Home ribbon to populate your navigation outline.
            </p>
          </div>
        ) : (
          headings.map((h) => {
            const indentClass = 
              h.level === 1 ? 'pl-2 font-bold text-neutral-900' :
              h.level === 2 ? 'pl-5 font-semibold text-neutral-800' :
              h.level === 3 ? 'pl-8 font-medium text-neutral-600' :
              'pl-10 text-neutral-500';

            return (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  if (onNavigateHeading) {
                    onNavigateHeading(h.text);
                  }
                }}
                className={`w-full text-left py-1.5 pr-2 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors truncate block text-xs ${indentClass}`}
              >
                {h.text}
              </button>
            );
          })
        )}
      </div>

      {/* Document telemetry metrics */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-xs text-neutral-600 space-y-1.5">
        <div className="font-bold text-[11px] uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1">
          <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Document Metrics</span>
        </div>
        <div className="flex justify-between">
          <span>Words:</span>
          <span className="font-mono font-bold text-neutral-900 tabular-nums">{wordCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Characters:</span>
          <span className="font-mono font-bold text-neutral-900 tabular-nums">{charCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Reading time:</span>
          <span className="font-mono font-bold text-neutral-900 tabular-nums">~{Math.max(1, Math.ceil(wordCount / 200))} min</span>
        </div>
        <div className="flex justify-between">
          <span>Headings:</span>
          <span className="font-mono font-bold text-neutral-900 tabular-nums">{headings.length}</span>
        </div>
      </div>
    </aside>
  );
};
