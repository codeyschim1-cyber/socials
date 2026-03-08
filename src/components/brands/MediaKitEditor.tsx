'use client';

import { useState, useMemo } from 'react';
import { useMediaKit } from '@/hooks/useMediaKit';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { PLATFORM_COLORS } from '@/lib/constants';
import { Save, User, AtSign, MapPin, Globe, Mail, DollarSign, Building2, Plus, X, Sparkles } from 'lucide-react';

export function MediaKitEditor() {
  const { mediaKit, updateMediaKit } = useMediaKit();
  const { entries: analyticsEntries } = useAnalytics();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(mediaKit);
  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [editingRateValue, setEditingRateValue] = useState('');
  const [newNiche, setNewNiche] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCreatorHandle, setNewCreatorHandle] = useState('');
  const [newCreatorPlatform, setNewCreatorPlatform] = useState('');
  const [newCreatorNote, setNewCreatorNote] = useState('');

  // Pull latest analytics data per platform for auto-sync
  const liveStats = useMemo(() => {
    const getLatest = (platform: string) => {
      const platformEntries = analyticsEntries
        .filter(e => e.platform === platform)
        .sort((a, b) => b.date.localeCompare(a.date));
      return platformEntries[0] || null;
    };
    return {
      instagram: getLatest('instagram'),
      tiktok: getLatest('tiktok'),
      youtube: getLatest('youtube'),
      facebook: getLatest('facebook'),
    };
  }, [analyticsEntries]);

  // Helper: use live data if available, otherwise fall back to mediaKit values
  const getStat = (platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook', field: 'followers' | 'engagementRate') => {
    const entry = liveStats[platform];
    if (entry) {
      if (field === 'followers') return entry.followers;
      if (field === 'engagementRate') return entry.engagementRate ?? 0;
    }
    // Fallback to media kit values
    const map: Record<string, number> = {
      'instagram-followers': mediaKit.instagramFollowers,
      'instagram-engagementRate': mediaKit.instagramEngagementRate,
      'tiktok-followers': mediaKit.tiktokFollowers,
      'tiktok-engagementRate': mediaKit.tiktokEngagementRate,
      'youtube-followers': mediaKit.youtubeSubscribers,
      'youtube-engagementRate': mediaKit.youtubeEngagementRate,
      'facebook-followers': mediaKit.facebookFollowers,
      'facebook-engagementRate': mediaKit.facebookEngagementRate,
    };
    return map[`${platform}-${field}`] ?? 0;
  };

  const startEditing = () => {
    setForm(mediaKit);
    setEditing(true);
  };

  const handleSave = () => {
    updateMediaKit(form);
    setEditing(false);
  };

  const addNiche = () => {
    if (newNiche.trim()) {
      setForm(prev => ({ ...prev, niche: [...prev.niche, newNiche.trim()] }));
      setNewNiche('');
    }
  };

  const removeNiche = (index: number) => {
    setForm(prev => ({ ...prev, niche: prev.niche.filter((_, i) => i !== index) }));
  };

  const addBrand = () => {
    if (newBrand.trim()) {
      setForm(prev => ({ ...prev, pastBrands: [...prev.pastBrands, newBrand.trim()] }));
      setNewBrand('');
    }
  };

  const removeBrand = (index: number) => {
    setForm(prev => ({ ...prev, pastBrands: prev.pastBrands.filter((_, i) => i !== index) }));
  };

  const addCreator = () => {
    if (newCreatorHandle.trim()) {
      setForm(prev => ({
        ...prev,
        inspirationCreators: [...(prev.inspirationCreators || []), { handle: newCreatorHandle.trim(), platform: newCreatorPlatform.trim() || 'Instagram', note: newCreatorNote.trim() }],
      }));
      setNewCreatorHandle(''); setNewCreatorPlatform(''); setNewCreatorNote('');
    }
  };

  const removeCreator = (index: number) => {
    setForm(prev => ({ ...prev, inspirationCreators: (prev.inspirationCreators || []).filter((_, i) => i !== index) }));
  };

  if (!editing) {
    // Display mode
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex justify-end">
          <Button size="sm" onClick={startEditing}>Edit Media Kit</Button>
        </div>

        {/* Profile header */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {mediaKit.displayName ? mediaKit.displayName.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-zinc-900">{mediaKit.displayName || 'Your Name'}</h2>
              <p className="text-sm text-zinc-400 mt-1">{mediaKit.bio || 'Add a bio to tell brands about yourself'}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {mediaKit.niche.map(n => (
                  <Badge key={n} className="bg-violet-100 text-violet-600">{n}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-zinc-400">
                {mediaKit.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{mediaKit.email}</span>}
                {mediaKit.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{mediaKit.location}</span>}
                {mediaKit.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{mediaKit.website}</span>}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats — auto-synced from analytics when available */}
        <div className="grid grid-cols-2 gap-4">
          {([
            { key: 'instagram' as const, handle: mediaKit.instagramHandle, label: 'followers' },
            { key: 'tiktok' as const, handle: mediaKit.tiktokHandle, label: 'followers' },
            { key: 'youtube' as const, handle: mediaKit.youtubeHandle, label: 'subscribers' },
            { key: 'facebook' as const, handle: mediaKit.facebookHandle, label: 'followers' },
          ]).map(({ key, handle, label }) => {
            const isLive = !!liveStats[key];
            return (
              <Card key={key} className={`border ${PLATFORM_COLORS[key].border}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AtSign className={`w-4 h-4 ${PLATFORM_COLORS[key].text}`} />
                    <span className="text-sm text-zinc-700">{handle || '@handle'}</span>
                  </div>
                  {isLive && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-zinc-900">{getStat(key, 'followers').toLocaleString()}</p>
                <p className="text-xs text-zinc-400">{label} &middot; {getStat(key, 'engagementRate').toFixed(1)}% eng.</p>
              </Card>
            );
          })}
        </div>

        {/* Rates — inline editable */}
        <Card>
          <h3 className="text-sm font-semibold text-zinc-800 mb-1 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-600" /> Rate Card</h3>
          <p className="text-[10px] text-zinc-400 mb-3">Click any rate to edit inline</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {([
              { label: 'IG Post', key: 'instagramPost' as const },
              { label: 'IG Story', key: 'instagramStory' as const },
              { label: 'IG Reel', key: 'instagramReel' as const },
              { label: 'TT Video', key: 'tiktokVideo' as const },
              { label: 'YT Video', key: 'youtubeVideo' as const },
              { label: 'YT Short', key: 'youtubeShort' as const },
              { label: 'FB Post', key: 'facebookPost' as const },
              { label: 'FB Reel', key: 'facebookReel' as const },
            ] as const).map(r => (
              <div key={r.label} className="bg-surface-elevated rounded-lg p-3 text-center">
                <p className="text-xs text-zinc-400 mb-1">{r.label}</p>
                {editingRate === r.key ? (
                  <input
                    autoFocus
                    type="number"
                    value={editingRateValue}
                    onChange={e => setEditingRateValue(e.target.value)}
                    onBlur={() => {
                      updateMediaKit({ rates: { ...mediaKit.rates, [r.key]: Number(editingRateValue) || 0 } });
                      setEditingRate(null);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        updateMediaKit({ rates: { ...mediaKit.rates, [r.key]: Number(editingRateValue) || 0 } });
                        setEditingRate(null);
                      }
                    }}
                    className="w-full text-center text-lg font-bold text-zinc-900 bg-white border border-violet-400 rounded px-2 py-0.5 outline-none"
                  />
                ) : (
                  <p
                    onClick={() => { setEditingRate(r.key); setEditingRateValue(String(mediaKit.rates[r.key])); }}
                    className="text-lg font-bold text-zinc-900 cursor-pointer hover:text-violet-600 transition-colors"
                  >
                    ${mediaKit.rates[r.key].toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
          {(mediaKit.rates.bundleRate || editingRate === 'bundleRate') && (
            <div className="mt-3 bg-violet-100 rounded-lg p-3 text-center">
              <p className="text-xs text-zinc-400 mb-1">Bundle Rate</p>
              {editingRate === 'bundleRate' ? (
                <input
                  autoFocus
                  type="number"
                  value={editingRateValue}
                  onChange={e => setEditingRateValue(e.target.value)}
                  onBlur={() => {
                    updateMediaKit({ rates: { ...mediaKit.rates, bundleRate: Number(editingRateValue) || undefined } });
                    setEditingRate(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      updateMediaKit({ rates: { ...mediaKit.rates, bundleRate: Number(editingRateValue) || undefined } });
                      setEditingRate(null);
                    }
                  }}
                  className="w-full text-center text-xl font-bold text-violet-600 bg-white border border-violet-400 rounded px-2 py-0.5 outline-none"
                />
              ) : (
                <p
                  onClick={() => { setEditingRate('bundleRate'); setEditingRateValue(String(mediaKit.rates.bundleRate || 0)); }}
                  className="text-xl font-bold text-violet-600 cursor-pointer hover:text-violet-800 transition-colors"
                >
                  ${(mediaKit.rates.bundleRate || 0).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Past brands */}
        {mediaKit.pastBrands.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-violet-600" /> Past Collaborations</h3>
            <div className="flex flex-wrap gap-2">
              {mediaKit.pastBrands.map(brand => (
                <Badge key={brand} className="bg-zinc-100 text-zinc-700">{brand}</Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Inspiration Creators */}
        {mediaKit.inspirationCreators?.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-600" /> Inspiration Creators</h3>
            <p className="text-xs text-zinc-400 mb-3">AI uses these creators as style inspiration when generating ideas.</p>
            <div className="space-y-2">
              {mediaKit.inspirationCreators.map((creator, i) => (
                <div key={i} className="flex items-center gap-3 bg-surface-elevated rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-violet-600">{creator.handle}</span>
                  <span className="text-xs text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{creator.platform}</span>
                  {creator.note && <span className="text-xs text-zinc-400 flex-1 truncate">{creator.note}</span>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Demographics */}
        {mediaKit.demographics && (
          <Card>
            <h3 className="text-sm font-semibold text-zinc-800 mb-2">Audience Demographics</h3>
            <p className="text-sm text-zinc-400 whitespace-pre-wrap">{mediaKit.demographics}</p>
          </Card>
        )}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Edit Media Kit</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave}><Save className="w-4 h-4" /> Save</Button>
        </div>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-700 mb-3">Profile</h3>
        <div className="space-y-3">
          <Input label="Display Name" value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} placeholder="Your name" />
          <Textarea label="Bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell brands about yourself..." rows={3} />
          <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Location" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
            <Input label="Website" value={form.website || ''} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Niche</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.niche.map((n, i) => (
                <span key={i} className="flex items-center gap-1 bg-violet-100 text-violet-600 text-xs px-2 py-1 rounded-full">
                  {n} <button onClick={() => removeNiche(i)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newNiche} onChange={e => setNewNiche(e.target.value)} placeholder="Add niche..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addNiche())} />
              <Button type="button" variant="secondary" size="sm" onClick={addNiche}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-700 mb-3">Social Accounts</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Instagram Handle" value={form.instagramHandle} onChange={e => setForm({ ...form, instagramHandle: e.target.value })} placeholder="@handle" />
            <Input label="TikTok Handle" value={form.tiktokHandle} onChange={e => setForm({ ...form, tiktokHandle: e.target.value })} placeholder="@handle" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="YouTube Handle" value={form.youtubeHandle || ''} onChange={e => setForm({ ...form, youtubeHandle: e.target.value })} placeholder="@handle" />
            <Input label="Facebook Handle" value={form.facebookHandle || ''} onChange={e => setForm({ ...form, facebookHandle: e.target.value })} placeholder="@handle" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="IG Followers" type="number" value={String(form.instagramFollowers)} onChange={e => setForm({ ...form, instagramFollowers: Number(e.target.value) })} />
            <Input label="TT Followers" type="number" value={String(form.tiktokFollowers)} onChange={e => setForm({ ...form, tiktokFollowers: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="YT Subscribers" type="number" value={String(form.youtubeSubscribers || 0)} onChange={e => setForm({ ...form, youtubeSubscribers: Number(e.target.value) })} />
            <Input label="FB Followers" type="number" value={String(form.facebookFollowers || 0)} onChange={e => setForm({ ...form, facebookFollowers: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="IG Engagement %" type="number" step="0.1" value={String(form.instagramEngagementRate)} onChange={e => setForm({ ...form, instagramEngagementRate: Number(e.target.value) })} />
            <Input label="TT Engagement %" type="number" step="0.1" value={String(form.tiktokEngagementRate)} onChange={e => setForm({ ...form, tiktokEngagementRate: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="YT Engagement %" type="number" step="0.1" value={String(form.youtubeEngagementRate || 0)} onChange={e => setForm({ ...form, youtubeEngagementRate: Number(e.target.value) })} />
            <Input label="FB Engagement %" type="number" step="0.1" value={String(form.facebookEngagementRate || 0)} onChange={e => setForm({ ...form, facebookEngagementRate: Number(e.target.value) })} />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-700 mb-3">Rates ($)</h3>
        <div className="grid grid-cols-2 gap-3">
          <Input label="IG Post" type="number" value={String(form.rates.instagramPost)} onChange={e => setForm({ ...form, rates: { ...form.rates, instagramPost: Number(e.target.value) } })} />
          <Input label="IG Story" type="number" value={String(form.rates.instagramStory)} onChange={e => setForm({ ...form, rates: { ...form.rates, instagramStory: Number(e.target.value) } })} />
          <Input label="IG Reel" type="number" value={String(form.rates.instagramReel)} onChange={e => setForm({ ...form, rates: { ...form.rates, instagramReel: Number(e.target.value) } })} />
          <Input label="TT Video" type="number" value={String(form.rates.tiktokVideo)} onChange={e => setForm({ ...form, rates: { ...form.rates, tiktokVideo: Number(e.target.value) } })} />
          <Input label="YT Video" type="number" value={String(form.rates.youtubeVideo || 0)} onChange={e => setForm({ ...form, rates: { ...form.rates, youtubeVideo: Number(e.target.value) } })} />
          <Input label="YT Short" type="number" value={String(form.rates.youtubeShort || 0)} onChange={e => setForm({ ...form, rates: { ...form.rates, youtubeShort: Number(e.target.value) } })} />
          <Input label="FB Post" type="number" value={String(form.rates.facebookPost || 0)} onChange={e => setForm({ ...form, rates: { ...form.rates, facebookPost: Number(e.target.value) } })} />
          <Input label="FB Reel" type="number" value={String(form.rates.facebookReel || 0)} onChange={e => setForm({ ...form, rates: { ...form.rates, facebookReel: Number(e.target.value) } })} />
        </div>
        <div className="mt-3">
          <Input label="Bundle Rate (optional)" type="number" value={String(form.rates.bundleRate || '')} onChange={e => setForm({ ...form, rates: { ...form.rates, bundleRate: Number(e.target.value) || undefined } })} placeholder="Package deal rate" />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-700 mb-3">Past Collaborations</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.pastBrands.map((brand, i) => (
            <span key={i} className="flex items-center gap-1 bg-zinc-100 text-zinc-700 text-xs px-2 py-1 rounded-full">
              {brand} <button onClick={() => removeBrand(i)}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newBrand} onChange={e => setNewBrand(e.target.value)} placeholder="Add brand name..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addBrand())} />
          <Button type="button" variant="secondary" size="sm" onClick={addBrand}><Plus className="w-4 h-4" /></Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-700 mb-3">Inspiration Creators</h3>
        <p className="text-xs text-zinc-400 mb-3">Add creators whose content style you admire. AI will use these as inspiration.</p>
        <div className="space-y-2 mb-3">
          {(form.inspirationCreators || []).map((creator, i) => (
            <div key={i} className="flex items-center gap-2 bg-surface-elevated rounded-lg px-3 py-2">
              <span className="text-sm font-medium text-violet-600">{creator.handle}</span>
              <span className="text-xs text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{creator.platform}</span>
              <span className="text-xs text-zinc-400 flex-1 truncate">{creator.note}</span>
              <button onClick={() => removeCreator(i)} className="text-zinc-400 hover:text-red-600 transition-colors shrink-0"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input value={newCreatorHandle} onChange={e => setNewCreatorHandle(e.target.value)} placeholder="@handle" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCreator())} />
          <Input value={newCreatorPlatform} onChange={e => setNewCreatorPlatform(e.target.value)} placeholder="Platform" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCreator())} />
          <div className="flex gap-2">
            <Input value={newCreatorNote} onChange={e => setNewCreatorNote(e.target.value)} placeholder="Note about their style" className="flex-1" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCreator())} />
            <Button type="button" variant="secondary" size="sm" onClick={addCreator}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>

      <Card>
        <Textarea label="Audience Demographics" value={form.demographics || ''} onChange={e => setForm({ ...form, demographics: e.target.value })} placeholder="Describe your audience... (age range, gender split, location, interests)" rows={4} />
      </Card>
    </div>
  );
}
