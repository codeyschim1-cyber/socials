'use client';

import { useState, useEffect } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { useMediaKit } from '@/hooks/useMediaKit';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, Copy, Check, Camera, MessageSquare, FileText, BarChart3, ClipboardList } from 'lucide-react';
import { GeneratedIdea, IdeaDeepDive } from '@/types/ideas';

interface IdeaDeepDiveModalProps {
  idea: GeneratedIdea | null;
  isOpen: boolean;
  onClose: () => void;
  referenceLinks?: string[];
}

const HOOK_LABELS: Record<string, string> = {
  question: 'Question',
  bold_statement: 'Bold Statement',
  story: 'Story',
  relatable: 'Relatable',
  pattern_interrupt: 'Pattern Interrupt',
  scale_superlative: 'Scale / Superlative',
  value_price: 'Value / Price',
  secret_hidden: 'Secret / Hidden',
  authority: 'Authority',
  geographic_pilgrimage: 'Geographic Pilgrimage',
  inventory_superlative: 'Inventory Superlative',
  personal_superlative: 'Personal Superlative',
};

const TIER_COLORS: Record<string, string> = {
  S: 'bg-violet-100 text-violet-700 border-violet-300',
  A: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  B: 'bg-amber-100 text-amber-700 border-amber-300',
  C: 'bg-zinc-100 text-zinc-500 border-zinc-300',
};

const TAB_IDS = ['shots', 'hooks', 'script', 'overview'] as const;
type TabId = typeof TAB_IDS[number];

export function IdeaDeepDiveModal({ idea, isOpen, onClose, referenceLinks }: IdeaDeepDiveModalProps) {
  const { apiKey } = useApiKey();
  const { mediaKit } = useMediaKit();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [deepDive, setDeepDive] = useState<IdeaDeepDive | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && idea && apiKey) {
      setDeepDive(null);
      setActiveTab('overview');
      setError('');
      fetchDeepDive();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, idea?.title]);

  const fetchDeepDive = async () => {
    if (!idea || !apiKey) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          title: idea.title,
          description: idea.description,
          platform: idea.platform,
          category: idea.category,
          niche: mediaKit.niche.length > 0 ? mediaKit.niche.join(', ') : undefined,
          creatorBio: mediaKit.bio || undefined,
          referenceLinks: referenceLinks && referenceLinks.length > 0 ? referenceLinks : undefined,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setDeepDive(data);
      }
    } catch {
      setError('Failed to generate deep dive. Check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'shots' as const, label: 'Shots', icon: Camera },
    { id: 'hooks' as const, label: 'Hooks', icon: MessageSquare },
    { id: 'script' as const, label: 'Script', icon: FileText },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={idea?.title || 'Deep Dive'} maxWidth="max-w-2xl">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          <p className="text-sm text-zinc-400">Generating production plan...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <Button size="sm" onClick={fetchDeepDive}>Retry</Button>
        </div>
      ) : deepDive ? (
        <div>
          {/* Tab navigation */}
          <div className="flex gap-1 mb-4 bg-zinc-100/50 rounded-lg p-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {deepDive.viralityScore && (
                <Card className="py-3 px-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Virality Matrix</h4>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {[
                      { label: 'Scale', value: deepDive.viralityScore.scale },
                      { label: 'Geography', value: deepDive.viralityScore.geography },
                      { label: 'Value Gap', value: deepDive.viralityScore.valueDisconnect },
                    ].map(v => (
                      <div key={v.label} className="text-center">
                        <p className="text-lg font-bold text-violet-600">{v.value}<span className="text-xs text-zinc-400">/5</span></p>
                        <p className="text-[10px] text-zinc-500">{v.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between bg-zinc-50 rounded-lg px-3 py-2">
                    <span className="text-xs text-zinc-600">Total: <span className="font-bold text-zinc-800">{deepDive.viralityScore.total}/15</span></span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      deepDive.viralityScore.total >= 12 ? 'bg-emerald-100 text-emerald-700' :
                      deepDive.viralityScore.total >= 8 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{deepDive.viralityScore.prediction}</span>
                  </div>
                  {deepDive.viralityScore.angleAdvice && (
                    <p className="text-[11px] text-zinc-500 mt-2">{deepDive.viralityScore.angleAdvice}</p>
                  )}
                </Card>
              )}

              {deepDive.viralityChecklist && (
                <Card className="py-3 px-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5" /> Virality Checklist
                    </h4>
                    <span className="text-xs font-bold text-violet-600">{deepDive.viralityChecklist.passCount}</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { key: 'hookPayloadBy4s', label: 'Hook delivers payload by 4s' },
                      { key: 'extremeValueClaim', label: 'Extreme value claim present' },
                      { key: 'voiceoverUnder85Words', label: 'Voiceover under 85 words' },
                      { key: 'noLogisticsInVO', label: 'No logistics in voiceover' },
                      { key: 'approvedCloseType', label: 'Approved close type' },
                    ].map(item => {
                      const passed = deepDive.viralityChecklist?.[item.key as keyof typeof deepDive.viralityChecklist];
                      return (
                        <div key={item.key} className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                            passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                          }`}>{passed ? '✓' : '✗'}</span>
                          <span className="text-xs text-zinc-700">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-3">
                {deepDive.templateSelected && (
                  <Card className="py-2.5 px-3">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Template</p>
                    <p className="text-xs font-semibold text-zinc-800 mt-0.5">{deepDive.templateSelected.replace(/_/g, ' ')}</p>
                    {deepDive.templateReason && <p className="text-[10px] text-zinc-500 mt-1">{deepDive.templateReason}</p>}
                  </Card>
                )}
                {deepDive.estimatedLength && (
                  <Card className="py-2.5 px-3">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Length</p>
                    <p className="text-xs font-semibold text-zinc-800 mt-0.5">{deepDive.estimatedLength}</p>
                    {deepDive.voiceoverWordCount && <p className="text-[10px] text-zinc-500 mt-1">{deepDive.voiceoverWordCount} words VO</p>}
                  </Card>
                )}
                {deepDive.closeType && (
                  <Card className="py-2.5 px-3">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Close Type</p>
                    <p className="text-xs font-semibold text-zinc-800 mt-0.5">{deepDive.closeType.replace(/_/g, ' ')}</p>
                  </Card>
                )}
                {deepDive.audioVibe && (
                  <Card className="py-2.5 px-3">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Audio</p>
                    <p className="text-xs font-semibold text-zinc-800 mt-0.5">{deepDive.audioVibe}</p>
                  </Card>
                )}
              </div>

              {deepDive.instagramCaption && (
                <Card className="py-3 px-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Instagram Caption</h4>
                    <button
                      onClick={() => copyText(deepDive.instagramCaption || '', 'caption')}
                      className="p-1 text-zinc-400 hover:text-violet-600 transition-colors"
                    >
                      {copiedIndex === 'caption' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-700 whitespace-pre-wrap leading-relaxed bg-zinc-50 rounded-lg p-3">{deepDive.instagramCaption}</p>
                </Card>
              )}

              {deepDive.performanceNotes && deepDive.performanceNotes.length > 0 && (
                <Card className="py-3 px-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Performance Notes</h4>
                  <ul className="space-y-1">
                    {deepDive.performanceNotes.map((note, i) => (
                      <li key={i} className="text-[11px] text-zinc-600 flex items-start gap-1.5">
                        <span className="text-violet-500 mt-0.5">•</span>{note}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}

          {/* Shot List */}
          {activeTab === 'shots' && (
            <div className="space-y-2">
              {deepDive.shotList.map((shot, i) => (
                <Card key={i} className="py-2.5 px-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-violet-600 bg-violet-100 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-zinc-800">{shot.shot}</h4>
                        <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{shot.duration}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 whitespace-pre-wrap">{shot.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Hooks */}
          {activeTab === 'hooks' && (
            <div className="space-y-2">
              {deepDive.hooks.map((hook, i) => (
                <Card key={i} className="py-2.5 px-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-violet-600 uppercase tracking-wider">
                          {HOOK_LABELS[hook.type] || hook.type.replace(/_/g, ' ')}
                        </span>
                        {hook.tier && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TIER_COLORS[hook.tier] || TIER_COLORS.B}`}>
                            {hook.tier}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-800 mt-1">&ldquo;{hook.text}&rdquo;</p>
                    </div>
                    <button
                      onClick={() => copyText(hook.text, `hook-${i}`)}
                      className="p-1.5 text-zinc-400 hover:text-violet-600 transition-colors shrink-0"
                    >
                      {copiedIndex === `hook-${i}` ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Script */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              {/* Full script by phase — structured view */}
              {deepDive.shotList.length > 0 && (
                <div className="space-y-3">
                  {deepDive.shotList.map((shot, i) => {
                    const lines = shot.description.split('\n');
                    const visual = lines.find(l => l.startsWith('Text overlay:') === false && l.startsWith('VO:') === false) || '';
                    const overlay = lines.find(l => l.startsWith('Text overlay:'))?.replace('Text overlay: ', '') || '';
                    const vo = lines.find(l => l.startsWith('VO:'))?.replace('VO: ', '').replace(/^"|"$/g, '') || '';

                    return (
                      <Card key={i} className="py-3 px-4 border-l-4 border-l-violet-500">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-violet-700 uppercase tracking-wider">{shot.shot}</h4>
                          <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">{shot.duration}</span>
                        </div>

                        {visual && (
                          <div className="mb-2">
                            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Visual Direction</span>
                            <p className="text-xs text-zinc-700 mt-0.5">{visual}</p>
                          </div>
                        )}

                        {overlay && (
                          <div className="mb-2">
                            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Text Overlay</span>
                            <p className="text-xs font-bold text-zinc-900 mt-0.5 bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block">{overlay}</p>
                          </div>
                        )}

                        {vo && (
                          <div>
                            <span className="text-[10px] font-semibold text-zinc-400 uppercase">Voiceover</span>
                            <div className="flex items-start justify-between gap-2 mt-0.5">
                              <p className="text-xs text-zinc-800 italic bg-violet-50 border border-violet-200 rounded px-2 py-1.5 flex-1">&ldquo;{vo}&rdquo;</p>
                              <button
                                onClick={() => copyText(vo, `vo-${i}`)}
                                className="p-1 text-zinc-400 hover:text-violet-600 transition-colors shrink-0 mt-0.5"
                              >
                                {copiedIndex === `vo-${i}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Full voiceover script — copy all */}
              <Card className="py-3 px-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Voiceover Script</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const voScript = deepDive.shotList
                        .map(s => {
                          const voLine = s.description.split('\n').find(l => l.startsWith('VO:'));
                          return voLine?.replace('VO: ', '').replace(/^"|"$/g, '') || '';
                        })
                        .filter(Boolean)
                        .join(' ');
                      copyText(voScript, 'full-vo');
                    }}
                  >
                    {copiedIndex === 'full-vo' ? (
                      <><Check className="w-3.5 h-3.5 text-green-600" /> Copied</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy VO</>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 rounded-lg p-3">
                  {deepDive.shotList
                    .map(s => {
                      const voLine = s.description.split('\n').find(l => l.startsWith('VO:'));
                      return voLine?.replace('VO: ', '').replace(/^"|"$/g, '') || '';
                    })
                    .filter(Boolean)
                    .join(' ')}
                </p>
                {deepDive.voiceoverWordCount && (
                  <p className="text-[10px] text-zinc-400 mt-1">{deepDive.voiceoverWordCount} words</p>
                )}
              </Card>

              {/* Audio direction */}
              {deepDive.audioVibe && (
                <Card className="py-2.5 px-4">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">Music Direction</span>
                  <p className="text-xs text-zinc-700 mt-0.5">{deepDive.audioVibe}</p>
                </Card>
              )}

              {/* Caption */}
              {deepDive.instagramCaption && (
                <Card className="py-3 px-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Instagram Caption</h4>
                    <button
                      onClick={() => copyText(deepDive.instagramCaption || '', 'caption-script')}
                      className="p-1 text-zinc-400 hover:text-violet-600 transition-colors"
                    >
                      {copiedIndex === 'caption-script' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-700 whitespace-pre-wrap leading-relaxed bg-zinc-50 rounded-lg p-3">{deepDive.instagramCaption}</p>
                </Card>
              )}
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
}
