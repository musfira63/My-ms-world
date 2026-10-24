import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  PenTool, 
  Eraser, 
  Highlighter, 
  RotateCcw, 
  Download, 
  Check, 
  Palette, 
  Maximize2 
} from 'lucide-react';

interface DrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (dataUrl: string) => void;
}

export const DrawingModal: React.FC<DrawingModalProps> = ({
  isOpen,
  onClose,
  onInsertImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'pencil' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#1E293B');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const colors = [
    '#1E293B', // Charcoal Slate
    '#2563EB', // Blue
    '#DC2626', // Crimson Red
    '#16A34A', // Forest Green
    '#D97706', // Amber
    '#7C3AED', // Purple
    '#F59E0B', // Highlighter Yellow
    '#EC4899', // Pink
  ];

  useEffect(() => {
    if (isOpen) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = lineWidth * 4;
      ctx.globalAlpha = 1.0;
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color === '#1E293B' ? '#FACC15' : color;
      ctx.lineWidth = lineWidth * 5;
      ctx.globalAlpha = 0.4;
    } else if (tool === 'pencil') {
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, lineWidth / 2);
      ctx.globalAlpha = 0.8;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = 1.0;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleInsert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onInsertImage(dataUrl);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-neutral-800">Drawing, Ink &amp; Map Sketch Canvas</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-neutral-100 border-b border-neutral-200 text-xs">
          <div className="flex items-center gap-2">
            {/* Tools */}
            <div className="flex items-center bg-white border border-neutral-300 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setTool('pen')}
                className={`p-1.5 rounded flex items-center gap-1 font-semibold ${
                  tool === 'pen' ? 'bg-blue-600 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" /> Pen
              </button>
              <button
                type="button"
                onClick={() => setTool('highlighter')}
                className={`p-1.5 rounded flex items-center gap-1 font-semibold ${
                  tool === 'highlighter' ? 'bg-amber-500 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" /> Marker
              </button>
              <button
                type="button"
                onClick={() => setTool('pencil')}
                className={`p-1.5 rounded flex items-center gap-1 font-semibold ${
                  tool === 'pencil' ? 'bg-neutral-800 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Pencil
              </button>
              <button
                type="button"
                onClick={() => setTool('eraser')}
                className={`p-1.5 rounded flex items-center gap-1 font-semibold ${
                  tool === 'eraser' ? 'bg-rose-600 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" /> Eraser
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1 pl-2 border-l border-neutral-300">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full border transition-all ${
                    color === c ? 'scale-115 ring-2 ring-blue-500 ring-offset-1 border-white' : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Thickness */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-500 font-medium">Stroke:</span>
              <input
                type="range"
                min="1"
                max="16"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-20 accent-blue-600 cursor-pointer"
              />
              <span className="w-4 text-[11px] font-mono text-neutral-700">{lineWidth}px</span>
            </div>

            {/* Clear */}
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-md bg-white hover:bg-neutral-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="p-4 bg-neutral-200/60 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={420}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="bg-white rounded-lg shadow-md border border-neutral-300 cursor-crosshair touch-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-200 bg-neutral-50">
          <span className="text-xs text-neutral-500">
            Draw ink annotations, sketches, or fantasy novel maps. Click Insert to place into document.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInsert}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Insert Drawing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
