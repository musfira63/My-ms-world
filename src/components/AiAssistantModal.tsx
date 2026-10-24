import React, { useState } from 'react';
import { X, Sparkles, Check, Copy, Wand2, RefreshCw } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onApplyResult: (replacementText: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  selectedText,
  onApplyResult,
}) => {
  const [activeAction, setActiveAction] = useState<string>('fix_grammar');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [inputText, setInputText] = useState<string>(selectedText || '');
  const [resultText, setResultText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync selected text when opened
  React.useEffect(() => {
    if (selectedText) {
      setInputText(selectedText);
    }
  }, [selectedText, isOpen]);

  if (!isOpen) return null;

  const handleExecute = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setResultText('');

    try {
      const response = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: activeAction,
          text: inputText,
          customPrompt: activeAction === 'custom' || activeAction === 'generate' ? customPrompt : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process AI document request.');
      }

      setResultText(data.result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error executing AI action.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (!resultText) return;
    onApplyResult(resultText);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl border border-neutral-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-neutral-800">AI Document Assistant</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Action Tabs */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1.5">Select Action</label>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Document Polish &amp; Speed
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'fix_grammar', label: 'Fix Spelling & Grammar' },
                    { id: 'proofread', label: 'In-Depth Proofread' },
                    { id: 'professional', label: 'Professional Business Tone' },
                    { id: 'summarize', label: 'Executive Summary' },
                    { id: 'concise', label: 'Make Crisp & Concise' },
                    { id: 'expand', label: 'Elaborate & Expand' },
                  ].map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActiveAction(act.id)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                        activeAction === act.id
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600 font-semibold'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">
                  Novel &amp; Creative Fiction Co-Author
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'continue_novel', label: 'Continue Story Scene' },
                    { id: 'dialogue_enhancer', label: 'Sharpen Dialogue & Beats' },
                    { id: 'plot_twist', label: 'Brainstorm 3 Plot Twists' },
                    { id: 'sensory_details', label: 'Show, Don’t Tell Enrichment' },
                    { id: 'character_generator', label: 'Generate Character Profile' },
                    { id: 'chapter_outline', label: 'Beat-by-Beat Chapter Outline' },
                    { id: 'tone_shift', label: 'Shift Literary Tone' },
                    { id: 'translate', label: 'Translate Language' },
                    { id: 'custom', label: 'Custom Instruction / Ask AI' },
                  ].map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActiveAction(act.id)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                        activeAction === act.id
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-600 font-semibold'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Custom Prompt Input if chosen or tone/translation */}
          {(activeAction === 'custom' || activeAction === 'tone_shift' || activeAction === 'translate' || activeAction === 'continue_novel') && (
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                {activeAction === 'tone_shift' 
                  ? 'Target Tone (e.g. Noir, Romantic, Gothic, Humorous, Gritty, Whimsical)'
                  : activeAction === 'translate'
                  ? 'Target Language (e.g. Spanish, French, German, Japanese, Arabic)'
                  : activeAction === 'continue_novel'
                  ? 'Scene Direction / Character Goal (Optional)'
                  : 'Custom Instruction / Prompt'}
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={
                  activeAction === 'tone_shift'
                    ? 'e.g. Atmospheric gothic suspense'
                    : activeAction === 'translate'
                    ? 'e.g. French'
                    : activeAction === 'continue_novel'
                    ? 'e.g. Julian uncovers the hidden brass key while rain pounds against the roof'
                    : 'e.g. Rewrite as a dramatic monologue, extract bullet points...'
                }
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          )}

          {/* Input text */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-neutral-700">Document Excerpt</label>
              <span className="text-[11px] text-neutral-400">
                {inputText.length} characters
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type text you wish to refine..."
              rows={4}
              className="w-full px-3 py-2 text-xs font-sans border border-neutral-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none text-neutral-800"
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleExecute}
              disabled={isLoading || (!inputText && !customPrompt)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white transition-all ${
                isLoading || (!inputText && !customPrompt)
                  ? 'bg-neutral-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Refining with Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Transform Text</span>
                </>
              )}
            </button>
          </div>

          {/* Error display */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Result view */}
          {resultText && (
            <div className="pt-3 border-t border-neutral-200">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-neutral-800">Generated Result</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-neutral-600 hover:text-neutral-900"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-md text-xs leading-relaxed text-neutral-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {resultText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-neutral-200 bg-neutral-50">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200 rounded transition-colors"
          >
            Close
          </button>
          {resultText && (
            <button
              type="button"
              onClick={handleInsert}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Replace / Insert Into Document</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
