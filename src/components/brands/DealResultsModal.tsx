'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BrandDeal, DealResults } from '@/types/brands';

interface DealResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: BrandDeal;
  onSave: (id: string, results: DealResults) => void;
}

export function DealResultsModal({ isOpen, onClose, deal, onSave }: DealResultsModalProps) {
  const [views, setViews] = useState(String(deal.results?.views ?? ''));
  const [impressions, setImpressions] = useState(String(deal.results?.impressions ?? ''));
  const [clicks, setClicks] = useState(String(deal.results?.clicks ?? ''));
  const [saves, setSaves] = useState(String(deal.results?.saves ?? ''));
  const [reach, setReach] = useState(String(deal.results?.reach ?? ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(deal.id, {
      views: Number(views) || 0,
      impressions: Number(impressions) || 0,
      clicks: Number(clicks) || 0,
      saves: Number(saves) || 0,
      reach: Number(reach) || 0,
    });
    onClose();
  };

  const totalViews = Number(views) || 0;
  const cpm = totalViews > 0 ? ((deal.rate / totalViews) * 1000).toFixed(2) : '—';
  const engRate = totalViews > 0 ? (((Number(clicks) + Number(saves)) / totalViews) * 100).toFixed(2) : '—';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Log Results — ${deal.brandName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Views" type="number" value={views} onChange={e => setViews(e.target.value)} placeholder="0" />
          <Input label="Impressions" type="number" value={impressions} onChange={e => setImpressions(e.target.value)} placeholder="0" />
          <Input label="Clicks" type="number" value={clicks} onChange={e => setClicks(e.target.value)} placeholder="0" />
          <Input label="Saves" type="number" value={saves} onChange={e => setSaves(e.target.value)} placeholder="0" />
          <Input label="Reach" type="number" value={reach} onChange={e => setReach(e.target.value)} placeholder="0" />
        </div>

        <div className="grid grid-cols-2 gap-3 bg-zinc-50 rounded-lg p-3">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase">Delivered CPM</p>
            <p className="text-lg font-bold text-zinc-800">${cpm}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase">Engagement Rate</p>
            <p className="text-lg font-bold text-zinc-800">{engRate}%</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">Save Results</Button>
        </div>
      </form>
    </Modal>
  );
}
