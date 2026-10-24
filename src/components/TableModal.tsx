import React, { useState } from 'react';
import { X, Table as TableIcon, Plus } from 'lucide-react';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTable: (rows: number, cols: number, hasHeader: boolean, tableStyle: string) => void;
}

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  onInsertTable,
}) => {
  const [hoverRows, setHoverRows] = useState(3);
  const [hoverCols, setHoverCols] = useState(3);
  const [customRows, setCustomRows] = useState(4);
  const [customCols, setCustomCols] = useState(4);
  const [hasHeader, setHasHeader] = useState(true);
  const [tableStyle, setTableStyle] = useState('modern_blue'); // 'modern_blue' | 'classic_slate' | 'minimal_bordered'

  if (!isOpen) return null;

  const handleGridClick = (r: number, c: number) => {
    onInsertTable(r, c, hasHeader, tableStyle);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInsertTable(customRows, customCols, hasHeader, tableStyle);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl border border-neutral-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-neutral-800">Insert Table</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {/* Quick Grid Selector */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-neutral-700">Quick Grid:</span>
              <span className="text-xs text-blue-600 font-mono font-medium">
                {hoverRows} &times; {hoverCols} Table
              </span>
            </div>
            <div 
              className="inline-grid grid-cols-8 gap-1 p-2 bg-neutral-50 border border-neutral-200 rounded-md"
              onMouseLeave={() => { setHoverRows(3); setHoverCols(3); }}
            >
              {Array.from({ length: 8 }).map((_, rIdx) => (
                <div key={rIdx} className="flex flex-col gap-1">
                  {Array.from({ length: 8 }).map((_, cIdx) => {
                    const r = cIdx + 1;
                    const c = rIdx + 1;
                    const isHighlighted = r <= hoverRows && c <= hoverCols;
                    return (
                      <button
                        key={cIdx}
                        type="button"
                        onMouseEnter={() => { setHoverRows(r); setHoverCols(c); }}
                        onClick={() => handleGridClick(r, c)}
                        className={`w-5 h-5 rounded-xs border transition-colors ${
                          isHighlighted
                            ? 'bg-blue-500 border-blue-600'
                            : 'bg-white border-neutral-300 hover:border-blue-400'
                        }`}
                        title={`${r} x ${c}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Style & Options */}
          <div className="pt-4 border-t border-neutral-200 space-y-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Visual Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'modern_blue', label: 'Office Blue', border: '#1F497D' },
                  { id: 'classic_slate', label: 'Dark Slate', border: '#0F172A' },
                  { id: 'minimal_bordered', label: 'Clean Minimal', border: '#CBD5E1' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setTableStyle(st.id)}
                    className={`px-2.5 py-1.5 rounded text-xs text-left border transition-all ${
                      tableStyle === st.id
                        ? 'border-blue-600 bg-blue-50/50 font-medium text-blue-900 ring-1 ring-blue-600'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <div className="w-full h-2 rounded-xs mb-1" style={{ backgroundColor: st.border }} />
                    <span className="text-[11px]">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="table-header-checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-neutral-300 focus:ring-blue-500"
              />
              <label htmlFor="table-header-checkbox" className="text-xs text-neutral-700 font-medium cursor-pointer">
                Include colored header row
              </label>
            </div>

            {/* Custom Row/Col input */}
            <form onSubmit={handleCustomSubmit} className="pt-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                <span>Rows:</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={customRows}
                  onChange={(e) => setCustomRows(parseInt(e.target.value) || 1)}
                  className="w-14 px-2 py-1 border border-neutral-300 rounded font-mono text-center text-xs"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                <span>Cols:</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={customCols}
                  onChange={(e) => setCustomCols(parseInt(e.target.value) || 1)}
                  className="w-14 px-2 py-1 border border-neutral-300 rounded font-mono text-center text-xs"
                />
              </div>
              <button
                type="submit"
                className="ml-auto flex items-center gap-1 px-3 py-1 bg-neutral-800 hover:bg-neutral-900 text-white rounded text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
