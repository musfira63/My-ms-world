import React, { useState } from 'react';
import { X, LayoutTemplate, ArrowRight, Check } from 'lucide-react';
import { DOCUMENT_TEMPLATES, TemplateItem } from '../utils/templates';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplateItem) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Business', 'Legal & Finance', 'Personal'];
  const filteredTemplates = selectedCategory === 'All'
    ? DOCUMENT_TEMPLATES
    : DOCUMENT_TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-neutral-300 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <LayoutTemplate className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-neutral-900">Microsoft Office Document Templates</h3>
              <p className="text-xs text-neutral-500">
                Choose a professionally formatted layout or start with a blank canvas.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-md hover:bg-neutral-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Tab Bar */}
        <div className="px-6 py-2.5 border-b border-neutral-200 bg-white flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto bg-neutral-50/50">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onSelectTemplate(template);
                onClose();
              }}
              className="group bg-white border border-neutral-200 hover:border-blue-500 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    {template.title}
                  </h4>
                  <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                    {template.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
                  {template.description}
                </p>

                {/* Visual miniature preview box */}
                <div className="bg-neutral-50 border border-neutral-200 rounded p-2.5 text-[10px] text-neutral-600 font-mono line-clamp-3 leading-relaxed">
                  {template.previewSnippet}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 font-medium">
                  Font: {template.suggestedFont.split(',')[0].replace(/['"]/g, '')}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end px-6 py-3 border-t border-neutral-200 bg-neutral-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
