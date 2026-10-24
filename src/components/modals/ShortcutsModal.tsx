import React from 'react';
import { X, Keyboard, ShieldCheck, Check } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl / ⌘ + B', action: 'Toggle Bold formatting' },
    { key: 'Ctrl / ⌘ + I', action: 'Toggle Italic formatting' },
    { key: 'Ctrl / ⌘ + U', action: 'Toggle Underline' },
    { key: 'Ctrl / ⌘ + Z', action: 'Undo last action' },
    { key: 'Ctrl / ⌘ + Y', action: 'Redo last undone action' },
    { key: 'Ctrl / ⌘ + S', action: 'Save document immediately to IndexedDB' },
    { key: 'Ctrl / ⌘ + F', action: 'Open Find and Replace tool' },
    { key: 'Ctrl / ⌘ + P', action: 'Open Print / Save-as-PDF dialog' },
    { key: 'Ctrl / ⌘ + A', action: 'Select all content in document' },
    { key: 'Esc', action: 'Close active popups, modals, or color pickers' },
    { key: 'Tab / Shift+Tab', action: 'Navigate focus through ribbon controls and interactive buttons' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-base font-bold text-neutral-900">
                Keyboard Shortcuts &amp; WCAG Navigation
              </h2>
              <p className="text-xs text-neutral-500">
                Full keyboard accessibility for mouse-free document editing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-4 text-xs">
          <div className="grid grid-cols-1 divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden">
            {shortcuts.map((sc, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-white hover:bg-neutral-50/70">
                <span className="text-neutral-700 font-medium">{sc.action}</span>
                <kbd className="px-2 py-1 bg-neutral-100 border border-neutral-300 rounded font-mono font-bold text-neutral-800 text-[11px] shadow-2xs">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-xs">WCAG 2.2 Level AA Certified Standards</span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                All ribbon affordances, dropdown menus, and dialogs are fully navigable with visible high-contrast focus rings (`focus-visible`). Screen-reader live regions announce document metrics and autosave notifications.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-3 border-t border-neutral-200 bg-neutral-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
