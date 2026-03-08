'use client';

import { useState } from 'react';
import { useApiKey } from '@/hooks/useApiKey';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Loader2, Plus, Check, MapPin, Calendar } from 'lucide-react';

interface SearchResult {
  name: string;
  date: string;
  location: string;
  state: string;
  description: string;
  time?: string;
}

interface EventSearchProps {
  onAddEvent: (event: SearchResult) => void;
}

export function EventSearch({ onAddEvent }: EventSearchProps) {
  const { apiKey } = useApiKey();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!apiKey || !query.trim()) return;
    setIsSearching(true);
    setError('');
    setResults([]);
    setAddedIds(new Set());

    try {
      const res = await fetch('/api/search-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, query }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.events || []);
        if ((data.events || []).length === 0) {
          setError('No events found. Try a different search.');
        }
      }
    } catch {
      setError('Failed to search for events.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = (event: SearchResult, index: number) => {
    onAddEvent(event);
    setAddedIds(prev => new Set(prev).add(index));
  };

  if (!apiKey) return null;

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Any vintage markets in NYC this week?"
            className="w-full bg-surface-elevated border border-zinc-300 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-violet-500"
          />
        </div>
        <Button size="sm" onClick={handleSearch} disabled={isSearching || !query.trim()}>
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Search
        </Button>
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {results.length > 0 && (
        <div className="mt-3 space-y-2">
          {results.map((event, i) => {
            const added = addedIds.has(i);
            return (
              <Card key={i} className={`!p-3 ${added ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-zinc-800">{event.name}</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}{event.time ? ` · ${event.time}` : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}{event.state ? `, ${event.state}` : ''}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                  <Button
                    variant={added ? 'ghost' : 'secondary'}
                    size="sm"
                    onClick={() => handleAdd(event, i)}
                    disabled={added}
                  >
                    {added ? <Check className="w-4 h-4 text-green-600" /> : <><Plus className="w-4 h-4" /> Add</>}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
