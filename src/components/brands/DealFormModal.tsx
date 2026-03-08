'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { BrandDeal, DealStatus } from '@/types/brands';
import { Platform } from '@/types/common';
import { PLATFORM_OPTIONS } from '@/lib/constants';
import { Trash2 } from 'lucide-react';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Omit<BrandDeal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<BrandDeal>) => void;
  onDelete?: (id: string) => void;
  editDeal?: BrandDeal | null;
}

export function DealFormModal({ isOpen, onClose, onSave, onUpdate, onDelete, editDeal }: DealFormModalProps) {
  const [brandName, setBrandName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [platform, setPlatform] = useState<Platform>('all');
  const [status, setStatus] = useState<DealStatus>('outreach');
  const [deliverables, setDeliverables] = useState('');
  const [rate, setRate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editDeal) {
      setBrandName(editDeal.brandName);
      setContactName(editDeal.contactName || '');
      setContactEmail(editDeal.contactEmail || '');
      setPlatform(editDeal.platform);
      setStatus(editDeal.status);
      setDeliverables(editDeal.deliverables);
      setRate(String(editDeal.rate));
      setDeadline(editDeal.deadline || '');
      setNotes(editDeal.notes);
    } else {
      setBrandName(''); setContactName(''); setContactEmail('');
      setPlatform('all'); setStatus('outreach'); setDeliverables('');
      setRate(''); setDeadline(''); setNotes('');
    }
  }, [editDeal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      brandName,
      contactName: contactName || undefined,
      contactEmail: contactEmail || undefined,
      platform,
      status,
      deliverables,
      rate: Number(rate) || 0,
      currency: 'USD',
      deadline: deadline || undefined,
      notes,
    };
    if (editDeal && onUpdate) {
      onUpdate(editDeal.id, data);
    } else {
      onSave(data);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editDeal ? 'Edit Deal' : 'New Brand Deal'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Brand Name" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Brand name" required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Contact Name" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Optional" />
          <Input label="Contact Email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Optional" type="email" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Platform" options={PLATFORM_OPTIONS} value={platform} onChange={e => setPlatform(e.target.value as Platform)} />
          <Select label="Status" options={[
            { value: 'outreach', label: 'Outreach' }, { value: 'negotiation', label: 'Negotiation' },
            { value: 'confirmed', label: 'Confirmed' }, { value: 'completed', label: 'Completed' },
          ]} value={status} onChange={e => setStatus(e.target.value as DealStatus)} />
        </div>
        <Textarea label="Deliverables" value={deliverables} onChange={e => setDeliverables(e.target.value)} placeholder="e.g. 1 Reel + 2 Stories" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Rate ($)" type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="0" />
          <Input label="Deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
        </div>
        <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." />
        <div className="flex justify-between pt-2">
          <div>{editDeal && onDelete && (
            <Button type="button" variant="danger" size="sm" onClick={() => { onDelete(editDeal.id); onClose(); }}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          )}</div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">{editDeal ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
