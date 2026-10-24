import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, Check, AlertCircle } from 'lucide-react';

interface ImageAltModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (src: string, alt: string) => void;
}

export const ImageAltModal: React.FC<ImageAltModalProps> = ({
  isOpen,
  onClose,
  onInsertImage,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewSrc(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    onInsertImage(imageUrl, altText.trim() || 'Document image');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-md overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <h3 id="image-modal-title" className="text-sm font-bold text-neutral-800">
              Insert Image with Alt Text
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleInsert} className="p-5 space-y-4 text-xs">
          {/* File picker */}
          <div>
            <label className="font-semibold text-neutral-700 block mb-1.5">Upload Image</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 border-2 border-dashed border-neutral-300 hover:border-emerald-500 rounded-lg text-neutral-600 hover:text-emerald-700 transition-colors flex items-center justify-center gap-2 bg-neutral-50/50"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Image from Disk</span>
            </button>
          </div>

          <div className="text-center text-neutral-400 font-medium">or paste image URL</div>

          <div>
            <input
              type="url"
              value={imageUrl.startsWith('data:') ? '' : imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewSrc(e.target.value);
              }}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Accessible Alternative Text Field (WCAG AA Requirement) */}
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg space-y-1.5">
            <label className="font-bold text-blue-900 block text-xs flex items-center gap-1">
              <span>Alternative Text (Alt Text)</span>
              <span className="text-[10px] text-blue-600 font-normal">&middot; WCAG AA</span>
            </label>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Describe the content or purpose of this image for readers using screen readers or when images fail to render.
            </p>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g., Quarterly growth bar chart showing a 24% revenue increase in Q3"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-blue-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none text-neutral-800"
              required
            />
          </div>

          {/* Image preview */}
          {previewSrc && (
            <div className="border border-neutral-200 rounded p-1 max-h-36 overflow-hidden flex items-center justify-center bg-neutral-50">
              <img src={previewSrc} alt={altText || 'Preview'} className="max-h-32 object-contain rounded" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 font-medium text-neutral-600 hover:bg-neutral-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!imageUrl}
              className="flex items-center gap-1.5 px-4 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded disabled:opacity-40 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Insert Accessible Image</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
