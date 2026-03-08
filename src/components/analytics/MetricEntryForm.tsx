'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { MetricEntry } from '@/types/analytics';
import { Platform } from '@/types/common';

type MetricPlatform = Exclude<Platform, 'all'>;

interface MetricEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<MetricEntry, 'id' | 'createdAt' | 'engagementRate'>) => void;
}

export function MetricEntryForm({ isOpen, onClose, onSave }: MetricEntryFormProps) {
  const [platform, setPlatform] = useState<MetricPlatform>('instagram');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [postsCount, setPostsCount] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [shares, setShares] = useState('');
  const [views, setViews] = useState('');
  const [reach, setReach] = useState('');
  const [impressions, setImpressions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      platform,
      date,
      followers: Number(followers) || 0,
      following: Number(following) || 0,
      postsCount: Number(postsCount) || 0,
      likes: Number(likes) || 0,
      comments: Number(comments) || 0,
      shares: Number(shares) || 0,
      views: Number(views) || 0,
      reach: Number(reach) || undefined,
      impressions: Number(impressions) || undefined,
    });
    onClose();
    // Reset
    setFollowers(''); setFollowing(''); setPostsCount('');
    setLikes(''); setComments(''); setShares(''); setViews('');
    setReach(''); setImpressions('');
  };

  const previewEngagement = Number(followers) > 0
    ? (((Number(likes) + Number(comments) + Number(shares)) / Number(followers)) * 100).toFixed(2)
    : '0.00';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Metrics">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Platform"
            options={[
              { value: 'instagram', label: 'Instagram' },
              { value: 'tiktok', label: 'TikTok' },
              { value: 'youtube', label: 'YouTube' },
              { value: 'facebook', label: 'Facebook' },
            ]}
            value={platform}
            onChange={e => setPlatform(e.target.value as MetricPlatform)}
          />
          <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input label="Followers" type="number" value={followers} onChange={e => setFollowers(e.target.value)} placeholder="0" required />
          <Input label="Following" type="number" value={following} onChange={e => setFollowing(e.target.value)} placeholder="0" />
          <Input label="Posts" type="number" value={postsCount} onChange={e => setPostsCount(e.target.value)} placeholder="0" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Likes" type="number" value={likes} onChange={e => setLikes(e.target.value)} placeholder="0" />
          <Input label="Comments" type="number" value={comments} onChange={e => setComments(e.target.value)} placeholder="0" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Shares" type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="0" />
          <Input label="Views" type="number" value={views} onChange={e => setViews(e.target.value)} placeholder="0" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Reach" type="number" value={reach} onChange={e => setReach(e.target.value)} placeholder="Optional" />
          <Input label="Impressions" type="number" value={impressions} onChange={e => setImpressions(e.target.value)} placeholder="Optional" />
        </div>

        <div className="bg-surface-elevated rounded-lg p-3">
          <p className="text-xs text-zinc-500">Calculated Engagement Rate</p>
          <p className="text-lg font-bold text-violet-400">{previewEngagement}%</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm">Save Metrics</Button>
        </div>
      </form>
    </Modal>
  );
}
