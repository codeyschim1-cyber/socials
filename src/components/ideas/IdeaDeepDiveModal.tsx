'use client';

import { useState, useEffect } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { useMediaKit } from '@/hooks/useMediaKit';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, Copy, Check, Camera, MessageSquare, FileText } from 'lucide-react';
import { GeneratedIdea, IdeaDeepDive } from '@/types/ideas';

interface IdeaDeepDiveModalProps {
  idea: GeneratedIdea | null;
  isOpen: boolean;
  onClose: () => void;
}

const HOOK_LABELS: Record<string, string> = {
  question: 'Question',
  bold_statement: 'Bold Statement',
  story: 'Story',
  relatable: 'Relatable',
  pattern_interrupt: 'Pattern Interrupt',
};

const TAB_IDS = ['shots', 'hooks', 'script'] as const;
type TabId = typeof TAB_IDS[number];

export function IdeaDeepDiveModal({ idea, isOpen, onClose }: IdeaDeepDiveModalProps) {
  const { apiKey } = useApiKey();
  const { mediaKit } = useMediaKit();
  const [activeTab, setActiveTab] = useState<TabId>('shots');
  const [deepDive, setDeepDive] = useState<IdeaDeepDive | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && idea && apiKey) {
      setDeepDive(null);
      setActiveTab('shots');
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
    { id: 'shots' as const, label: 'Shots', icon: Camera },
    { id: 'hooks' as const, label: 'Hooks', icon: MessageSquare },
    { id: 'script' as const, label: 'Script', icon: FileText },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={idea?.title || 'Deep Dive'} maxWidth="max-w-2xl">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          <p className="text-sm text-zinc-400">Generating production plan...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-sm text-red-400 mb-3">{error}</p>
          <Button size="sm" onClick={fetchDeepDive}>Retry</Button>
        </div>
      ) : deepDive ? (
        <div>
          {/* Tab navigation */}
          <div className="flex gap-1 mb-4 bg-zinc-800/50 rounded-lg p-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Shot List */}
          {activeTab === 'shots' && (
            <div className="space-y-2">
              {deepDive.shotList.map((shot, i) => (
                <Card key={i} className="py-2.5 px-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-violet-400 bg-violet-500/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-zinc-200">{shot.shot}</h4>
                        <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">{shot.duration}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{shot.description}</p>
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
                      <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">
                        {HOOK_LABELS[hook.type] || hook.type}
                      </span>
                      <p className="text-xs text-zinc-200 mt-1">&ldquo;{hook.text}&rdquo;</p>
                    </div>
                    <button
                      onClick={() => copyText(hook.text, `hook-${i}`)}
                      className="p-1.5 text-zinc-500 hover:text-violet-400 transition-colors shrink-0"
                    >
                      {copiedIndex === `hook-${i}` ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
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
            <div>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyText(deepDive.script, 'script')}
                >
                  {copiedIndex === 'script' ? (
                    <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy Script</>
                  )}
                </Button>
              </div>
              <div className="bg-surface-elevated rounded-lg p-4 border border-zinc-700">
                <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">{deepDive.script}</p>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
}
