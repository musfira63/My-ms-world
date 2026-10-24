import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Users, 
  Globe2, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  FileText, 
  Bookmark, 
  Feather, 
  ShieldCheck, 
  Settings2,
  Copy,
  Printer
} from 'lucide-react';
import { NovelProject, NovelChapter, NovelCharacter, NovelWorldItem, VelumDocument } from '../../types/document';
import { exportToEpub } from '../../utils/epubExporter';
import { exportToNativeDocx } from '../../utils/docxHandler';
import { exportToPdfFile } from '../../utils/exportFormats';

interface NovelPublishStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: VelumDocument;
  onUpdateDocument: (doc: VelumDocument) => void;
  onLoadChapterContent: (chapter: NovelChapter) => void;
  currentEditorHtml: string;
}

export const NovelPublishStudioModal: React.FC<NovelPublishStudioModalProps> = ({
  isOpen,
  onClose,
  document,
  onUpdateDocument,
  onLoadChapterContent,
  currentEditorHtml,
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'characters' | 'world' | 'metadata' | 'publish'>('chapters');

  // Initialize or retrieve novelData
  const [novelData, setNovelData] = useState<NovelProject>(() => {
    if (document.novelData) return document.novelData;
    return {
      penName: 'A. R. Sterling',
      genre: 'Speculative Fiction / Mystery',
      targetTotalWords: 75000,
      synopsis: 'A clandestine investigation into the forgotten archives beneath the coastal citadel unravels secrets that threaten the fragile empire.',
      chapters: [
        {
          id: 'chap-1',
          number: 1,
          title: 'The Whispering Hour',
          summary: 'Elena arrives at the harbor under a shroud of sea-fog and makes contact with the archivist.',
          contentHtml: currentEditorHtml || '<h1>Chapter 1: The Whispering Hour</h1><p>The tide was rising when the ferry cleaved through the saltwater mist...</p>',
          wordCount: 1420,
          targetWordCount: 3500,
          status: 'draft',
        },
        {
          id: 'chap-2',
          number: 2,
          title: 'Echoes in the Obsidian Vault',
          summary: 'A secret passageway reveals ciphered ledgers that should not exist.',
          contentHtml: '<h1>Chapter 2: Echoes in the Obsidian Vault</h1><p>Every stone along the corridor seemed cut to swallow sound whole...</p>',
          wordCount: 2150,
          targetWordCount: 4000,
          status: 'draft',
        },
        {
          id: 'chap-3',
          number: 3,
          title: 'The Clockwork Cipher',
          summary: 'Julian Thorne reveals his allegiance and hands Elena a key of blackened brass.',
          contentHtml: '<h1>Chapter 3: The Clockwork Cipher</h1><p>The device fit neatly in the palm of her hand, warm as living flesh...</p>',
          wordCount: 1890,
          targetWordCount: 3800,
          status: 'draft',
        }
      ],
      activeChapterId: 'chap-1',
      characters: [
        {
          id: 'char-1',
          name: 'Elena Vance',
          role: 'protagonist',
          age: '29',
          occupation: 'Investigative Cartographer & Archivist',
          archetype: 'The Reluctant Seeker',
          motivation: 'Uncover the truth behind her mentor’s sudden disappearance in the coastal citadel.',
          flaw: 'Reluctant to ask for help; assumes every ally has an undisclosed price.',
          description: 'Dark auburn hair pinned with silver needles, slate-gray eyes, ink-stained fingertips.',
        },
        {
          id: 'char-2',
          name: 'Julian Thorne',
          role: 'antagonist',
          age: '38',
          occupation: 'Antiquities Dealer & Silent Broker',
          archetype: 'The Charming Shadow',
          motivation: 'Secure the sovereign seal before the spring equinox to consolidate merchant trade.',
          flaw: 'Underestimates people driven by loyalty rather than financial gain.',
          description: 'Impeccable tailored wool coat, silver signet ring, pleasant smile that never warms his eyes.',
        }
      ],
      worldItems: [
        {
          id: 'world-1',
          name: 'The Sunken Obsidian Vaults',
          category: 'location',
          description: 'A subterranean labyrinth of tide-carved granite beneath the old district, reachable only during low tide.',
        },
        {
          id: 'world-2',
          name: 'The Silver Needle Guild',
          category: 'faction',
          description: 'An independent clandestine ring of cartographers and cryptographers bound by ancient oaths of non-disclosure.',
        }
      ],
      publishSettings: {
        trimSize: '6x9',
        dropCaps: true,
        firstParagraphIndent: true,
        sceneBreakSymbol: '❦',
        includeTitlePage: true,
        includeCopyrightPage: true,
        includeDedication: true,
        includeTableOfContents: true,
        includeAuthorBio: true,
        authorBio: 'A. R. Sterling is an author of mystery and speculative literature who writes beside cold tea and old maps.',
        isbn: '978-1-987654-32-1',
        publisherName: 'Solstice Press Imprint',
        copyrightYear: new Date().getFullYear().toString(),
        dedicationText: 'For those who search between the margins of forgotten histories.',
      }
    };
  });

  if (!isOpen) return null;

  // Calculate total words
  const totalNovelWords = novelData.chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0);
  const progressPercent = Math.min(100, Math.round((totalNovelWords / novelData.targetTotalWords) * 100));

  // Save changes to document
  const handleSaveToDoc = (updated: NovelProject) => {
    setNovelData(updated);
    onUpdateDocument({
      ...document,
      novelData: updated,
    });
  };

  // Add Chapter
  const handleAddChapter = () => {
    const nextNum = novelData.chapters.length + 1;
    const newChap: NovelChapter = {
      id: `chap-${Date.now()}`,
      number: nextNum,
      title: `Chapter ${nextNum}: New Scene`,
      summary: 'Brief description of chapter goal and character conflict.',
      contentHtml: `<h1>Chapter ${nextNum}: New Scene</h1><p>Start drafting this chapter...</p>`,
      wordCount: 0,
      targetWordCount: 3500,
      status: 'draft',
    };
    const updated = {
      ...novelData,
      chapters: [...novelData.chapters, newChap],
    };
    handleSaveToDoc(updated);
  };

  // Move Chapter
  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= novelData.chapters.length) return;
    const items = [...novelData.chapters];
    const [moved] = items.splice(index, 1);
    items.splice(newIdx, 0, moved);
    // re-number
    const renumbered = items.map((ch, idx) => ({ ...ch, number: idx + 1 }));
    handleSaveToDoc({ ...novelData, chapters: renumbered });
  };

  // Delete Chapter
  const handleDeleteChapter = (id: string) => {
    if (novelData.chapters.length <= 1) return;
    const updatedChaps = novelData.chapters
      .filter((ch) => ch.id !== id)
      .map((ch, idx) => ({ ...ch, number: idx + 1 }));
    handleSaveToDoc({ ...novelData, chapters: updatedChaps });
  };

  // Compile full novel manuscript into active document
  const handleCompileFullManuscript = () => {
    const compiledParts: string[] = [];
    
    // Title & Front matter
    compiledParts.push(`
      <div style="text-align: center; margin-top: 30vh; margin-bottom: 25vh;">
        <h1 style="font-size: 28pt; text-transform: uppercase; letter-spacing: 2px;">${document.title}</h1>
        <p style="font-size: 14pt; font-style: italic; margin-top: 16pt;">by ${novelData.penName}</p>
        <p style="font-size: 10pt; color: #64748B; margin-top: 8pt;">${novelData.genre}</p>
      </div>
      <div style="page-break-after: always;"></div>
    `);

    // Copyright
    if (novelData.publishSettings.includeCopyrightPage) {
      compiledParts.push(`
        <div style="margin-top: 35vh; text-align: center; font-size: 9pt; color: #475569;">
          <p><strong>${document.title}</strong></p>
          <p>Copyright © ${novelData.publishSettings.copyrightYear} by ${novelData.penName}. All rights reserved.</p>
          <p style="margin-top: 8pt;">ISBN: ${novelData.publishSettings.isbn || '978-0-000000-00-0'}</p>
          <p style="margin-top: 8pt; font-size: 8pt;">Published by ${novelData.publishSettings.publisherName || 'Solstice Imprint'}.</p>
        </div>
        <div style="page-break-after: always;"></div>
      `);
    }

    // Dedication
    if (novelData.publishSettings.includeDedication && novelData.publishSettings.dedicationText) {
      compiledParts.push(`
        <div style="margin-top: 35vh; text-align: center; font-style: italic; font-size: 11pt;">
          <p>${novelData.publishSettings.dedicationText}</p>
        </div>
        <div style="page-break-after: always;"></div>
      `);
    }

    // Chapters
    novelData.chapters.forEach((chap) => {
      compiledParts.push(`
        <section class="novel-chapter-section" style="margin-top: 24pt;">
          <p style="text-align: center; font-size: 10pt; text-transform: uppercase; letter-spacing: 2px; color: #64748B;">Chapter ${chap.number}</p>
          <h2 style="text-align: center; font-size: 20pt; margin-bottom: 24pt;">${chap.title}</h2>
          <div class="novel-chapter-body">
            ${chap.contentHtml}
          </div>
          <div style="text-align: center; margin: 32pt 0; font-size: 14pt; color: #64748B;">${novelData.publishSettings.sceneBreakSymbol}</div>
        </section>
        <div style="page-break-after: always;"></div>
      `);
    });

    const fullHtml = compiledParts.join('\n');
    onUpdateDocument({
      ...document,
      contentHtml: fullHtml,
      novelData,
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-linear-to-r from-indigo-900 via-slate-900 to-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-400/30">
              <BookOpen className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">DocuCraft Novel &amp; Book Studio</h2>
                <span className="text-[10pt] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30 font-medium">
                  Author Edition
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Write chapters, develop character codex, track NaNoWriMo goals, and publish to EPUB, PDF &amp; DOCX.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCompileFullManuscript}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              title="Compile all chapters into the main document workspace"
            >
              <Feather className="w-3.5 h-3.5" />
              Compile Manuscript
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition"
              aria-label="Close novel studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Novel Progress Strip */}
        <div className="px-6 py-2.5 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-neutral-500 font-medium">Novel: </span>
              <strong className="text-neutral-800">{document.title}</strong>
              <span className="text-neutral-400 mx-1">|</span>
              <span className="text-neutral-500">Pen Name: </span>
              <strong className="text-neutral-800">{novelData.penName}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">Progress:</span>
              <div className="w-32 bg-neutral-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-semibold text-neutral-700">
                {totalNovelWords.toLocaleString()} / {novelData.targetTotalWords.toLocaleString()} words ({progressPercent}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-medium">Chapters: </span>
            <span className="px-2 py-0.5 bg-white border border-neutral-300 rounded font-bold text-neutral-800">
              {novelData.chapters.length}
            </span>
            <span className="text-neutral-500 font-medium">Trim: </span>
            <span className="px-2 py-0.5 bg-white border border-neutral-300 rounded font-semibold text-neutral-800">
              {novelData.publishSettings.trimSize}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-neutral-200 bg-white">
          {[
            { id: 'chapters', label: 'Chapter Manager', icon: Layers, count: novelData.chapters.length },
            { id: 'characters', label: 'Character Codex', icon: Users, count: novelData.characters.length },
            { id: 'world', label: 'World Lore', icon: Globe2, count: novelData.worldItems.length },
            { id: 'metadata', label: 'Front Matter & ISBN', icon: Bookmark },
            { id: 'publish', label: '1-Click Publishing', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                  active
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? 'bg-indigo-200 text-indigo-800' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
          {/* TAB: CHAPTERS */}
          {activeTab === 'chapters' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Chapters &amp; Scenes</h3>
                  <p className="text-xs text-neutral-500">
                    Draft, reorder, track word counts per chapter, and load any chapter into the main editor canvas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddChapter}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Chapter
                </button>
              </div>

              <div className="space-y-2.5">
                {novelData.chapters.map((ch, idx) => {
                  const isCurrent = novelData.activeChapterId === ch.id;
                  return (
                    <div
                      key={ch.id}
                      className={`p-4 rounded-xl border bg-white transition shadow-xs ${
                        isCurrent ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs shrink-0 mt-0.5">
                            {ch.number}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ch.title}
                                onChange={(e) => {
                                  const updated = novelData.chapters.map((c) =>
                                    c.id === ch.id ? { ...c, title: e.target.value } : c
                                  );
                                  handleSaveToDoc({ ...novelData, chapters: updated });
                                }}
                                className="font-bold text-sm text-neutral-900 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5 w-72"
                              />
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                {ch.status.toUpperCase()}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={ch.summary || ''}
                              placeholder="Scene goal, conflict, or summary..."
                              onChange={(e) => {
                                const updated = novelData.chapters.map((c) =>
                                  c.id === ch.id ? { ...c, summary: e.target.value } : c
                                );
                                handleSaveToDoc({ ...novelData, chapters: updated });
                              }}
                              className="text-xs text-neutral-500 w-full mt-1 bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-indigo-400 focus:outline-none px-1"
                            />
                            <div className="flex items-center gap-4 mt-2 text-[11px] text-neutral-500">
                              <span>
                                Words: <strong className="text-neutral-700">{ch.wordCount.toLocaleString()}</strong> / {ch.targetWordCount.toLocaleString()}
                              </span>
                              <div className="w-24 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-indigo-600 h-full rounded-full"
                                  style={{ width: `${Math.min(100, Math.round((ch.wordCount / ch.targetWordCount) * 100))}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              onLoadChapterContent(ch);
                              handleSaveToDoc({ ...novelData, activeChapterId: ch.id });
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-neutral-100 hover:bg-indigo-600 hover:text-white text-neutral-700 text-xs font-semibold rounded-md border border-neutral-300 transition"
                            title="Load this chapter into main editor"
                          >
                            Edit in Canvas
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveChapter(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-30 rounded hover:bg-neutral-100"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveChapter(idx, 'down')}
                            disabled={idx === novelData.chapters.length - 1}
                            className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-30 rounded hover:bg-neutral-100"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteChapter(ch.id)}
                            disabled={novelData.chapters.length <= 1}
                            className="p-1 text-rose-400 hover:text-rose-700 disabled:opacity-30 rounded hover:bg-rose-50"
                            title="Delete chapter"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: CHARACTERS */}
          {activeTab === 'characters' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Character Codex</h3>
                  <p className="text-xs text-neutral-500">
                    Track character agency, motivations, fatal flaws, and physical traits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newChar: NovelCharacter = {
                      id: `char-${Date.now()}`,
                      name: 'New Character',
                      role: 'supporting',
                      motivation: 'What do they yearn for more than anything?',
                      flaw: 'What personal blind spot prevents them from reaching it?',
                      description: 'Distinctive visual markers and mannerisms.',
                    };
                    handleSaveToDoc({ ...novelData, characters: [...novelData.characters, newChar] });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Character
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {novelData.characters.map((char) => (
                  <div key={char.id} className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <input
                          type="text"
                          value={char.name}
                          onChange={(e) => {
                            const updated = novelData.characters.map((c) =>
                              c.id === char.id ? { ...c, name: e.target.value } : c
                            );
                            handleSaveToDoc({ ...novelData, characters: updated });
                          }}
                          className="font-bold text-sm text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <select
                        value={char.role}
                        onChange={(e) => {
                          const updated = novelData.characters.map((c) =>
                            c.id === char.id ? { ...c, role: e.target.value as any } : c
                          );
                          handleSaveToDoc({ ...novelData, characters: updated });
                        }}
                        className="text-[11px] font-semibold bg-neutral-100 rounded px-2 py-0.5 border border-neutral-200 capitalize text-neutral-700"
                      >
                        <option value="protagonist">Protagonist</option>
                        <option value="antagonist">Antagonist</option>
                        <option value="deuteragonist">Deuteragonist</option>
                        <option value="supporting">Supporting</option>
                      </select>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Core Motivation</span>
                        <input
                          type="text"
                          value={char.motivation}
                          onChange={(e) => {
                            const updated = novelData.characters.map((c) =>
                              c.id === char.id ? { ...c, motivation: e.target.value } : c
                            );
                            handleSaveToDoc({ ...novelData, characters: updated });
                          }}
                          className="w-full text-neutral-700 bg-neutral-50 px-2 py-1 rounded border border-neutral-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Fatal Flaw</span>
                        <input
                          type="text"
                          value={char.flaw}
                          onChange={(e) => {
                            const updated = novelData.characters.map((c) =>
                              c.id === char.id ? { ...c, flaw: e.target.value } : c
                            );
                            handleSaveToDoc({ ...novelData, characters: updated });
                          }}
                          className="w-full text-neutral-700 bg-neutral-50 px-2 py-1 rounded border border-neutral-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Appearance &amp; Voice</span>
                        <textarea
                          rows={2}
                          value={char.description}
                          onChange={(e) => {
                            const updated = novelData.characters.map((c) =>
                              c.id === char.id ? { ...c, description: e.target.value } : c
                            );
                            handleSaveToDoc({ ...novelData, characters: updated });
                          }}
                          className="w-full text-neutral-700 bg-neutral-50 px-2 py-1 rounded border border-neutral-200 focus:outline-none focus:border-indigo-500 resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = novelData.characters.filter((c) => c.id !== char.id);
                          handleSaveToDoc({ ...novelData, characters: updated });
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: WORLD LORE */}
          {activeTab === 'world' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">World Lore &amp; Setting Codex</h3>
                  <p className="text-xs text-neutral-500">
                    Document locations, political factions, magic systems, and world timelines.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: NovelWorldItem = {
                      id: `world-${Date.now()}`,
                      name: 'New Location / Lore',
                      category: 'location',
                      description: 'Atmosphere, architecture, cultural customs, and sensory impressions.',
                    };
                    handleSaveToDoc({ ...novelData, worldItems: [...novelData.worldItems, newItem] });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Lore Entry
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {novelData.worldItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const updated = novelData.worldItems.map((w) =>
                            w.id === item.id ? { ...w, name: e.target.value } : w
                          );
                          handleSaveToDoc({ ...novelData, worldItems: updated });
                        }}
                        className="font-bold text-sm text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-indigo-500 focus:outline-none w-64"
                      />
                      <select
                        value={item.category}
                        onChange={(e) => {
                          const updated = novelData.worldItems.map((w) =>
                            w.id === item.id ? { ...w, category: e.target.value as any } : w
                          );
                          handleSaveToDoc({ ...novelData, worldItems: updated });
                        }}
                        className="text-[11px] font-semibold bg-neutral-100 rounded px-2 py-0.5 border border-neutral-200 capitalize text-neutral-700"
                      >
                        <option value="location">Location</option>
                        <option value="faction">Faction</option>
                        <option value="magic_or_tech">Magic/Tech</option>
                        <option value="lore">Lore/History</option>
                        <option value="item">Key Artifact</option>
                      </select>
                    </div>

                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => {
                        const updated = novelData.worldItems.map((w) =>
                          w.id === item.id ? { ...w, description: e.target.value } : w
                        );
                        handleSaveToDoc({ ...novelData, worldItems: updated });
                      }}
                      className="w-full text-xs text-neutral-700 bg-neutral-50 p-2 rounded border border-neutral-200 focus:outline-none focus:border-indigo-500 resize-none"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = novelData.worldItems.filter((w) => w.id !== item.id);
                          handleSaveToDoc({ ...novelData, worldItems: updated });
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: METADATA */}
          {activeTab === 'metadata' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Publishing Metadata &amp; Front Matter</h3>
                <p className="text-xs text-neutral-500">
                  Configure ISBN, copyright page, dedication, and author credentials for distributor submission.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Author Pen Name</label>
                  <input
                    type="text"
                    value={novelData.penName}
                    onChange={(e) => handleSaveToDoc({ ...novelData, penName: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Genre</label>
                  <input
                    type="text"
                    value={novelData.genre}
                    onChange={(e) => handleSaveToDoc({ ...novelData, genre: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">ISBN-13</label>
                  <input
                    type="text"
                    value={novelData.publishSettings.isbn || ''}
                    placeholder="978-0-..."
                    onChange={(e) =>
                      handleSaveToDoc({
                        ...novelData,
                        publishSettings: { ...novelData.publishSettings, isbn: e.target.value },
                      })
                    }
                    className="w-full text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Publisher / Imprint</label>
                  <input
                    type="text"
                    value={novelData.publishSettings.publisherName || ''}
                    placeholder="Solstice Press"
                    onChange={(e) =>
                      handleSaveToDoc({
                        ...novelData,
                        publishSettings: { ...novelData.publishSettings, publisherName: e.target.value },
                      })
                    }
                    className="w-full text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Book Synopsis / Blurb</label>
                <textarea
                  rows={3}
                  value={novelData.synopsis}
                  onChange={(e) => handleSaveToDoc({ ...novelData, synopsis: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Book Dedication</label>
                <input
                  type="text"
                  value={novelData.publishSettings.dedicationText || ''}
                  onChange={(e) =>
                    handleSaveToDoc({
                      ...novelData,
                      publishSettings: { ...novelData.publishSettings, dedicationText: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Author Bio</label>
                <textarea
                  rows={2}
                  value={novelData.publishSettings.authorBio || ''}
                  onChange={(e) =>
                    handleSaveToDoc({
                      ...novelData,
                      publishSettings: { ...novelData.publishSettings, authorBio: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 rounded border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB: 1-CLICK PUBLISHING */}
          {activeTab === 'publish' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">1-Click Novel Publishing &amp; Distribution</h3>
                <p className="text-xs text-neutral-500">
                  Export complete eBook and print-ready formats adhering to Amazon KDP, IngramSpark, and Apple Books standards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* EPUB */}
                <div className="p-5 rounded-xl border border-indigo-200 bg-linear-to-br from-indigo-50/50 to-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">eBook Format</span>
                    <span className="text-[10px] text-neutral-500 font-mono">.EPUB</span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">Standard EPUB eBook</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Generates a validated EPUB package with embedded NCX navigation, drop caps, copyright page, and reflowable chapters for Kindle, Apple Books, Kobo, and Barnes &amp; Noble Nook.
                  </p>
                  <button
                    type="button"
                    onClick={() => exportToEpub(document, novelData)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    Download EPUB eBook (.epub)
                  </button>
                </div>

                {/* Print-Ready PDF */}
                <div className="p-5 rounded-xl border border-rose-200 bg-linear-to-br from-rose-50/50 to-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Print Format</span>
                    <span className="text-[10px] text-neutral-500 font-mono">.PDF</span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">Print-Ready Paperback PDF</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Paginated PDF configured for {novelData.publishSettings.trimSize} trim size with mirrored gutter margins for book spine binding, running headers, and page numbering.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const docState: any = {
                        metadata: { title: document.title },
                        contentHtml: document.contentHtml,
                        settings: document.pageSettings,
                      };
                      exportToPdfFile(docState, 'velum-document-page');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
                  >
                    <Printer className="w-4 h-4" />
                    Export Paperback PDF (.pdf)
                  </button>
                </div>

                {/* Standard Manuscript DOCX */}
                <div className="p-5 rounded-xl border border-blue-200 bg-linear-to-br from-blue-50/50 to-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Publisher Format</span>
                    <span className="text-[10px] text-neutral-500 font-mono">.DOCX</span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">Standard Submission Manuscript</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Formatted according to traditional publishing guidelines (William Shunn manuscript format): 1-inch margins, running headers with author surname, and scene break marks.
                  </p>
                  <button
                    type="button"
                    onClick={() => exportToNativeDocx(document)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    Export Submission Manuscript (.docx)
                  </button>
                </div>

                {/* Web Novel HTML */}
                <div className="p-5 rounded-xl border border-emerald-200 bg-linear-to-br from-emerald-50/50 to-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Digital Reader</span>
                    <span className="text-[10px] text-neutral-500 font-mono">.HTML</span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">Standalone Web Novel</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Single-file offline eBook with dark mode toggle, customizable reading font size, chapter drawer, and instant mobile responsiveness.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${document.title} by ${novelData.penName}</title>
  <style>
    body { max-width: 720px; margin: 40px auto; padding: 0 20px; font-family: 'Georgia', serif; line-height: 1.8; color: #1e293b; background: #fffdfa; }
    h1, h2 { text-align: center; }
    p { text-indent: 1.8em; margin: 0; }
    .title-box { text-align: center; margin: 80px 0; }
    .divider { text-align: center; margin: 30px 0; letter-spacing: 4px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="title-box">
    <h1>${document.title}</h1>
    <p style="text-indent: 0; font-style: italic;">by ${novelData.penName}</p>
  </div>
  ${document.contentHtml}
</body>
</html>`;
                      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = window.document.createElement('a');
                      a.href = url;
                      a.download = `${document.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_novel.html`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    Export Web Novel (.html)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
