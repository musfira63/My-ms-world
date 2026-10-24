import React, { useState, useEffect } from 'react';
import { OFFICE_THEME_COLUMNS, STANDARD_COLORS, HIGHLIGHTER_COLORS } from '../utils/colors';

interface ColorPickerPopoverProps {
  currentColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
  type: 'text' | 'highlight' | 'page';
}

export const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  currentColor,
  onSelectColor,
  onClose,
  type,
}) => {
  const [customHex, setCustomHex] = useState(currentColor.startsWith('#') ? currentColor : '#000000');

  useEffect(() => {
    const handleOutside = () => {
      onClose();
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleOutside);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleOutside);
    };
  }, [onClose]);

  return (
    <div 
      className="absolute top-full left-0 mt-1 z-50 bg-white border border-neutral-300 shadow-xl rounded-md p-3 w-64 text-xs font-sans"
      onClick={(e) => e.stopPropagation()}
    >
      {type === 'highlight' ? (
        <div>
          <div className="font-semibold text-neutral-700 mb-2">Highlighter Colors</div>
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {HIGHLIGHTER_COLORS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  onSelectColor(item.color);
                  onClose();
                }}
                className="flex items-center gap-1.5 p-1 rounded hover:bg-neutral-100 transition-colors border border-neutral-200"
                title={item.name}
              >
                <span
                  className="w-4 h-4 rounded-sm border border-neutral-300 shrink-0"
                  style={{
                    backgroundColor: item.color === 'transparent' ? '#FFFFFF' : item.color,
                    backgroundImage: item.color === 'transparent' 
                      ? 'linear-gradient(45deg, #ef4444 25%, transparent 25%, transparent 75%, #ef4444 75%, #ef4444), linear-gradient(45deg, #ef4444 25%, transparent 25%, transparent 75%, #ef4444 75%, #ef4444)' 
                      : 'none',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 4px 4px'
                  }}
                />
                <span className="truncate text-[11px] text-neutral-800">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Theme Colors Matrix (Microsoft Office style) */}
          <div className="mb-2">
            <div className="font-semibold text-neutral-700 mb-1">Theme Colors</div>
            <div className="flex gap-1 justify-between">
              {OFFICE_THEME_COLUMNS.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-1">
                  {col.colors.map((color, rowIdx) => (
                    <button
                      key={rowIdx}
                      type="button"
                      onClick={() => {
                        onSelectColor(color);
                        onClose();
                      }}
                      className={`w-5 h-5 rounded-sm border transition-transform hover:scale-110 ${
                        currentColor.toLowerCase() === color.toLowerCase() 
                          ? 'ring-2 ring-blue-600 border-white' 
                          : 'border-neutral-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`${col.name} ${rowIdx === 0 ? '(Main)' : `(Shade ${rowIdx})`}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Standard Colors */}
          <div className="mb-3 pt-2 border-t border-neutral-200">
            <div className="font-semibold text-neutral-700 mb-1">Standard Colors</div>
            <div className="flex gap-1 justify-between">
              {STANDARD_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    onSelectColor(color);
                    onClose();
                  }}
                  className={`w-5 h-5 rounded-sm border transition-transform hover:scale-110 ${
                    currentColor.toLowerCase() === color.toLowerCase() 
                      ? 'ring-2 ring-blue-600 border-white' 
                      : 'border-neutral-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Custom Color Input */}
      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between gap-2">
        <label className="text-neutral-600 text-[11px] font-medium flex items-center gap-1.5 cursor-pointer">
          <input
            type="color"
            value={customHex}
            onChange={(e) => {
              setCustomHex(e.target.value);
              onSelectColor(e.target.value);
            }}
            className="w-6 h-6 p-0 border border-neutral-300 rounded cursor-pointer"
          />
          <span>Custom Hex</span>
        </label>
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={customHex}
            onChange={(e) => {
              setCustomHex(e.target.value);
              if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                onSelectColor(e.target.value);
              }
            }}
            placeholder="#000000"
            className="w-20 px-1.5 py-0.5 border border-neutral-300 rounded font-mono text-[11px] uppercase"
          />
          <button
            type="button"
            onClick={() => {
              onSelectColor(customHex);
              onClose();
            }}
            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-medium hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
