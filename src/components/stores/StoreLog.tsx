'use client';

import { useState, useMemo } from 'react';
import { useStoreLog } from '@/hooks/useStoreLog';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Search, Store, Star, MapPin, Trash2, RotateCcw, Check, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { StoreType, StoreEntry } from '@/types/stores';

const STORE_TYPE_OPTIONS = [
  { value: 'thrift', label: 'Thrift Store' },
  { value: 'vintage', label: 'Vintage Shop' },
  { value: 'flea_market', label: 'Flea Market' },
  { value: 'estate_sale', label: 'Estate Sale' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'consignment', label: 'Consignment' },
  { value: 'antique', label: 'Antique Shop' },
  { value: 'other', label: 'Other' },
];

const STORE_TYPE_LABELS: Record<StoreType, string> = {
  thrift: 'Thrift', vintage: 'Vintage', flea_market: 'Flea Market', estate_sale: 'Estate Sale',
  wholesale: 'Wholesale', consignment: 'Consignment', antique: 'Antique', other: 'Other',
};

const PRICE_RANGE_OPTIONS = [
  { value: 'budget', label: 'Budget ($)' },
  { value: 'moderate', label: 'Moderate ($$)' },
  { value: 'premium', label: 'Premium ($$$)' },
  { value: 'mixed', label: 'Mixed' },
];

const PRICE_LABELS: Record<string, string> = {
  budget: '$', moderate: '$$', premium: '$$$', mixed: 'Mixed',
};

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={`${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star className={`w-4 h-4 ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-300'}`} />
        </button>
      ))}
    </div>
  );
}

export function StoreLog() {
  const { stores, addStore, deleteStore } = useStoreLog();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<StoreType>('thrift');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [dateVisited, setDateVisited] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(3);
  const [knownFor, setKnownFor] = useState('');
  const [bestSections, setBestSections] = useState('');
  const [priceRange, setPriceRange] = useState<'budget' | 'moderate' | 'premium' | 'mixed'>('moderate');
  const [worthReturning, setWorthReturning] = useState(true);
  const [contentMade, setContentMade] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setName(''); setType('thrift'); setLocation(''); setState('');
    setDateVisited(new Date().toISOString().split('T')[0]); setRating(3);
    setKnownFor(''); setBestSections(''); setPriceRange('moderate');
    setWorthReturning(true); setContentMade(''); setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStore({ name, type, location, state, dateVisited, rating, knownFor, bestSections, priceRange, worthReturning, contentMade, notes });
    resetForm();
    setIsFormOpen(false);
  };

  const filteredStores = useMemo(() => {
    return stores.filter(s => {
      if (typeFilter !== 'all' && s.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.knownFor.toLowerCase().includes(q) || s.state.toLowerCase().includes(q);
      }
      return true;
    });
  }, [stores, search, typeFilter]);

  const topStores = stores.filter(s => s.rating >= 4 && s.worthReturning).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-zinc-400 mb-1">Stores Logged</p>
          <p className="text-2xl font-bold text-zinc-900">{stores.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-zinc-400 mb-1">Top Rated</p>
          <p className="text-2xl font-bold text-yellow-500">{topStores}</p>
        </Card>
        <Card>
          <p className="text-xs text-zinc-400 mb-1">Unique Locations</p>
          <p className="text-2xl font-bold text-violet-600">{new Set(stores.map(s => s.state)).size}</p>
          <p className="text-xs text-zinc-400">states</p>
        </Card>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search stores, locations..."
            className="w-full bg-surface-elevated border border-zinc-300 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-violet-500"
          />
        </div>
        <Select
          options={[{ value: 'all', label: 'All Types' }, ...STORE_TYPE_OPTIONS]}
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="!w-auto"
        />
        <Button size="sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4" /> Add Store
        </Button>
      </div>

      {/* Store list */}
      {filteredStores.length === 0 ? (
        <EmptyState
          icon={Store}
          title={stores.length === 0 ? "No stores logged yet" : "No stores match your search"}
          description={stores.length === 0 ? "Start building your store database — it feeds into AI recommendations and content planning." : "Try adjusting your filters."}
          action={stores.length === 0 ? <Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="w-4 h-4" /> Add First Store</Button> : undefined}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredStores.map(store => (
            <Card key={store.id} className="!p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-zinc-800 truncate">{store.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 shrink-0">{STORE_TYPE_LABELS[store.type]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{store.location}{store.state ? `, ${store.state}` : ''}</span>
                    <span>&middot;</span>
                    <span>{format(parseISO(store.dateVisited), 'MMM d, yyyy')}</span>
                    <span>&middot;</span>
                    <span>{PRICE_LABELS[store.priceRange]}</span>
                  </div>
                  <StarRating rating={store.rating} />
                  {store.knownFor && <p className="text-xs text-zinc-500 mt-2"><span className="font-medium">Known for:</span> {store.knownFor}</p>}
                  {store.bestSections && <p className="text-xs text-zinc-500 mt-1"><span className="font-medium">Best sections:</span> {store.bestSections}</p>}
                  {store.contentMade && <p className="text-xs text-violet-600 mt-1"><span className="font-medium">Content:</span> {store.contentMade}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    {store.worthReturning ? (
                      <span className="text-[10px] flex items-center gap-1 text-emerald-600"><Check className="w-3 h-3" /> Worth returning</span>
                    ) : (
                      <span className="text-[10px] flex items-center gap-1 text-zinc-400"><X className="w-3 h-3" /> Skip next time</span>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteStore(store.id)} className="text-zinc-400 hover:text-red-600 transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add form modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Store">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Store Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. L Train Vintage" required />

          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={STORE_TYPE_OPTIONS} value={type} onChange={e => setType(e.target.value as StoreType)} />
            <Select label="Price Range" options={PRICE_RANGE_OPTIONS} value={priceRange} onChange={e => setPriceRange(e.target.value as typeof priceRange)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="City/neighborhood" required />
            <Input label="State" value={state} onChange={e => setState(e.target.value)} placeholder="NY" />
            <Input label="Date Visited" type="date" value={dateVisited} onChange={e => setDateVisited(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Rating</label>
            <StarRating rating={rating} onChange={setRating} />
          </div>

          <Input label="Known For" value={knownFor} onChange={e => setKnownFor(e.target.value)} placeholder="e.g. Vintage denim, designer bags, bulk bins" />
          <Input label="Best Sections" value={bestSections} onChange={e => setBestSections(e.target.value)} placeholder="e.g. Menswear upstairs, shoes in back" />
          <Input label="Content Made Here" value={contentMade} onChange={e => setContentMade(e.target.value)} placeholder="e.g. Filmed haul reel, TikTok walkthrough" />
          <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything else worth remembering..." rows={2} />

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={worthReturning} onChange={e => setWorthReturning(e.target.checked)} className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500" />
            <span className="text-sm text-zinc-700 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Worth returning</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={!name.trim()}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
