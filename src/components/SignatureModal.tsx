import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check, PenTool } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSignature: (imageDataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onInsertSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#002060'); // Classic legal dark blue
  const [lineWidth, setLineWidth] = useState(2.5);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = lineWidth;
      }
    }
  }, [isOpen, penColor, lineWidth]);

  if (!isOpen) return null;

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL('image/png');
    onInsertSignature(dataUrl);
    clearCanvas();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-neutral-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-neutral-800">Draw Digital Signature</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawing Area */}
        <div className="p-5">
          <p className="text-xs text-neutral-500 mb-2">
            Sign inside the canvas below with your mouse, trackpad, or touch screen.
          </p>

          <div className="relative border-2 border-dashed border-neutral-300 rounded-md bg-neutral-50/50 overflow-hidden cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={500}
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-44 touch-none"
            />
            <div className="absolute bottom-4 left-6 right-6 border-b border-neutral-300 flex justify-between text-[10px] text-neutral-400 pointer-events-none select-none">
              <span>Sign Above This Line</span>
              <span>&times;</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-600 font-medium">Ink:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: 'Navy Blue', color: '#002060' },
                  { name: 'Pure Black', color: '#111827' },
                  { name: 'Royal Blue', color: '#1D4ED8' },
                  { name: 'Crimson', color: '#991B1B' },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setPenColor(c.color)}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      penColor === c.color ? 'ring-2 ring-blue-500 scale-110' : 'border-neutral-300'
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                  />
                ))}
              </div>

              <div className="h-4 w-px bg-neutral-200 mx-1" />

              <span className="text-xs text-neutral-600 font-medium">Stroke:</span>
              <input
                type="range"
                min="1.5"
                max="5"
                step="0.5"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseFloat(e.target.value))}
                className="w-16 accent-blue-600 cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-neutral-200 bg-neutral-50">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasDrawn}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white rounded transition-colors ${
              hasDrawn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-neutral-300 cursor-not-allowed'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Insert Signature</span>
          </button>
        </div>
      </div>
    </div>
  );
};
