import React, { useState } from 'react';
import { X, Link as LinkIcon, Check, Unlink } from 'lucide-react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  onApplyLink: (url: string) => void;
  onRemoveLink: () => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  initialUrl = '',
  onApplyLink,
  onRemoveLink,
}) => {
  const [url, setUrl] = useState(initialUrl);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      let finalUrl = url.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }
      onApplyLink(finalUrl);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-sm overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-blue-600" />
            <h3 id="link-modal-title" className="text-sm font-bold text-neutral-800">
              Insert Hyperlink
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-neutral-700 block mb-1">Destination Web Address (URL)</label>
            <input
              type="text"
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/report"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none text-xs"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
            {initialUrl ? (
              <button
                type="button"
                onClick={() => {
                  onRemoveLink();
                  onClose();
                }}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold text-xs"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Remove Link</span>
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 font-medium text-neutral-600 hover:bg-neutral-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Link</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
