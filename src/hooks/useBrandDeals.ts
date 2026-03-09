'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { BrandDeal } from '@/types/brands';

function mapRow(r: Record<string, unknown>): BrandDeal {
  return {
    id: r.id as string,
    brandName: r.brand_name as string,
    contactName: (r.contact_name as string) || undefined,
    contactEmail: (r.contact_email as string) || undefined,
    platform: r.platform as BrandDeal['platform'],
    status: r.status as BrandDeal['status'],
    deliverables: (r.deliverables as string) || '',
    rate: Number(r.rate) || 0,
    currency: (r.currency as string) || 'USD',
    deadline: (r.deadline as string) || undefined,
    notes: (r.notes as string) || '',
    results: r.results as BrandDeal['results'] | undefined,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export function useBrandDeals() {
  const { user } = useAuthContext();
  const [deals, setDeals] = useState<BrandDeal[]>([]);

  const fetchDeals = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('brand_deals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setDeals(data.map(mapRow));
  }, [user]);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  const addDeal = useCallback(async (deal: Omit<BrandDeal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    const { data } = await supabase
      .from('brand_deals')
      .insert({
        user_id: user.id,
        brand_name: deal.brandName,
        contact_name: deal.contactName,
        contact_email: deal.contactEmail,
        platform: deal.platform,
        status: deal.status,
        deliverables: deal.deliverables,
        rate: deal.rate,
        currency: deal.currency,
        deadline: deal.deadline,
        notes: deal.notes,
        results: deal.results,
      })
      .select()
      .single();
    if (data) setDeals(prev => [mapRow(data), ...prev]);
  }, [user]);

  const updateDeal = useCallback(async (id: string, updates: Partial<BrandDeal>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.brandName !== undefined) dbUpdates.brand_name = updates.brandName;
    if (updates.contactName !== undefined) dbUpdates.contact_name = updates.contactName;
    if (updates.contactEmail !== undefined) dbUpdates.contact_email = updates.contactEmail;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.deliverables !== undefined) dbUpdates.deliverables = updates.deliverables;
    if (updates.rate !== undefined) dbUpdates.rate = updates.rate;
    if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.results !== undefined) dbUpdates.results = updates.results;

    const { data } = await supabase
      .from('brand_deals')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (data) setDeals(prev => prev.map(d => d.id === id ? mapRow(data) : d));
  }, [user]);

  const deleteDeal = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from('brand_deals').delete().eq('id', id).eq('user_id', user.id);
    setDeals(prev => prev.filter(d => d.id !== id));
  }, [user]);

  return { deals, addDeal, updateDeal, deleteDeal };
}
