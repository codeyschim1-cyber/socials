'use client';

import { useState, useMemo } from 'react';
import { useBrandDeals } from '@/hooks/useBrandDeals';
import { useIncome } from '@/hooks/useIncome';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge, PlatformBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { BarChartWrapper } from '@/components/charts/BarChartWrapper';
import { PieChartWrapper } from '@/components/charts/PieChartWrapper';
import { DealFormModal } from './DealFormModal';
import { DealResultsModal } from './DealResultsModal';
import { InvoiceModal } from './InvoiceModal';
import { InvoiceBuilder } from './InvoiceBuilder';
import { AIManager } from './AIManager';
import { BrandDeal, DealStatus, DealResults, IncomeEntry } from '@/types/brands';
import { DEAL_STATUS_COLORS, DEAL_STATUS_LABELS, PLATFORM_COLORS, INCOME_CATEGORIES, CHART_COLORS } from '@/lib/constants';
import { getMonthlyRevenue, getYearlyRevenue, getRevenueByMonth, getRevenueByCategory, getGoalProgress } from '@/lib/revenue-utils';
import { calculateRates } from '@/lib/rate-calculator';
import { Plus, Handshake, DollarSign, Calculator, Trash2, BarChart3, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const TABS = [
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'income', label: 'Income' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'ai-manager', label: 'AI Manager' },
  { id: 'calculator', label: 'Rate Calculator' },
];

const DEAL_COLUMNS: DealStatus[] = ['outreach', 'negotiation', 'confirmed', 'completed'];

export function BrandsView() {
  const { deals, addDeal, updateDeal, deleteDeal } = useBrandDeals();
  const { entries: incomeEntries, goals, addEntry: addIncome, deleteEntry: deleteIncome, addGoal, deleteGoal } = useIncome();
  const [activeTab, setActiveTab] = useState('pipeline');
  const [isDealFormOpen, setIsDealFormOpen] = useState(false);
  const [editDeal, setEditDeal] = useState<BrandDeal | null>(null);
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [resultsDeal, setResultsDeal] = useState<BrandDeal | null>(null);
  const [invoiceDeal, setInvoiceDeal] = useState<BrandDeal | null>(null);

  // Income form state
  const [incSource, setIncSource] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incDate, setIncDate] = useState(new Date().toISOString().split('T')[0]);
  const [incCategory, setIncCategory] = useState<IncomeEntry['category']>('sponsorship');
  const [incNotes, setIncNotes] = useState('');

  // Goal form state
  const [goalAmount, setGoalAmount] = useState('');
  const [goalPeriod, setGoalPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Calculator state
  const [calcFollowers, setCalcFollowers] = useState('');
  const [calcEngagement, setCalcEngagement] = useState('');

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const monthlyRevenue = getMonthlyRevenue(incomeEntries, currentYear, currentMonth);
  const yearlyRevenue = getYearlyRevenue(incomeEntries, currentYear);
  const revenueByMonth = getRevenueByMonth(incomeEntries, currentYear);
  const revenueByCategory = getRevenueByCategory(incomeEntries);

  const currentGoal = goals.find(g => g.period === 'monthly' && g.year === currentYear && g.month === currentMonth)
    || goals.find(g => g.period === 'yearly' && g.year === currentYear);

  const rates = useMemo(() => {
    if (!calcFollowers || !calcEngagement) return null;
    return calculateRates({ followers: Number(calcFollowers), engagementRate: Number(calcEngagement) });
  }, [calcFollowers, calcEngagement]);

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    addIncome({ source: incSource, amount: Number(incAmount), currency: 'USD', date: incDate, category: incCategory, notes: incNotes });
    setIncSource(''); setIncAmount(''); setIncNotes(''); setIsIncomeFormOpen(false);
  };

  const handleSaveResults = (id: string, results: DealResults) => {
    updateDeal(id, { results });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal({
      period: goalPeriod,
      targetAmount: Number(goalAmount),
      currency: 'USD',
      year: currentYear,
      month: goalPeriod === 'monthly' ? currentMonth : undefined,
    });
    setGoalAmount(''); setIsGoalFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* Pipeline */}
      {activeTab === 'pipeline' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 text-sm">
              <span className="text-zinc-400">Total Deals: <span className="text-zinc-800 font-medium">{deals.length}</span></span>
              <span className="text-zinc-400">Pipeline Value: <span className="text-emerald-600 font-medium">${deals.filter(d => d.status !== 'completed').reduce((s, d) => s + d.rate, 0).toLocaleString()}</span></span>
            </div>
            <Button size="sm" onClick={() => { setEditDeal(null); setIsDealFormOpen(true); }}>
              <Plus className="w-4 h-4" /> New Deal
            </Button>
          </div>

          {deals.length === 0 ? (
            <EmptyState
              icon={Handshake}
              title="No brand deals yet"
              description="Start tracking your brand partnerships and sponsorships."
              action={<Button size="sm" onClick={() => setIsDealFormOpen(true)}><Plus className="w-4 h-4" /> Add Deal</Button>}
            />
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              {DEAL_COLUMNS.map(status => {
                const columnDeals = deals.filter(d => d.status === status);
                const colors = DEAL_STATUS_COLORS[status];
                return (
                  <div key={status}>
                    <div className={`flex items-center justify-between mb-3 px-2`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>{DEAL_STATUS_LABELS[status]}</span>
                        <span className="text-xs text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{columnDeals.length}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {columnDeals.map(deal => (
                        <Card key={deal.id} onClick={() => { setEditDeal(deal); setIsDealFormOpen(true); }} className="!p-3">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-zinc-800">{deal.brandName}</h4>
                            <PlatformBadge platform={deal.platform} />
                          </div>
                          <p className="text-lg font-bold text-emerald-600">${deal.rate.toLocaleString()}</p>
                          {deal.deliverables && <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{deal.deliverables}</p>}
                          {deal.deadline && <p className="text-[10px] text-zinc-400 mt-1">Due: {format(parseISO(deal.deadline), 'MMM d')}</p>}
                          {/* ROI summary for deals with results */}
                          {deal.results && (
                            <div className="mt-2 bg-emerald-50 rounded px-2 py-1.5 text-[10px]">
                              <span className="text-emerald-700 font-medium">
                                {deal.results.views.toLocaleString()} views &middot; CPM ${deal.results.views > 0 ? ((deal.rate / deal.results.views) * 1000).toFixed(2) : '—'}
                              </span>
                            </div>
                          )}
                          {/* Action buttons */}
                          <div className="flex gap-1.5 mt-2" onClick={e => e.stopPropagation()}>
                            {status === 'completed' && (
                              <button
                                onClick={() => setResultsDeal(deal)}
                                className="flex items-center gap-1 text-[10px] font-medium text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-2 py-1 rounded transition-colors"
                              >
                                <BarChart3 className="w-3 h-3" /> {deal.results ? 'Edit Results' : 'Log Results'}
                              </button>
                            )}
                            <button
                              onClick={() => setInvoiceDeal(deal)}
                              className="flex items-center gap-1 text-[10px] font-medium text-zinc-600 hover:text-zinc-800 bg-zinc-100 hover:bg-zinc-200 px-2 py-1 rounded transition-colors"
                            >
                              <FileText className="w-3 h-3" /> Invoice
                            </button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <DealFormModal
            isOpen={isDealFormOpen}
            onClose={() => { setIsDealFormOpen(false); setEditDeal(null); }}
            onSave={addDeal}
            onUpdate={updateDeal}
            onDelete={deleteDeal}
            editDeal={editDeal}
          />

          {resultsDeal && (
            <DealResultsModal
              isOpen={!!resultsDeal}
              onClose={() => setResultsDeal(null)}
              deal={resultsDeal}
              onSave={handleSaveResults}
            />
          )}

          {invoiceDeal && (
            <InvoiceModal
              isOpen={!!invoiceDeal}
              onClose={() => setInvoiceDeal(null)}
              deal={invoiceDeal}
            />
          )}
        </div>
      )}

      {/* Income */}
      {activeTab === 'income' && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <p className="text-xs text-zinc-400 mb-1">This Month</p>
              <p className="text-2xl font-bold text-emerald-600">${monthlyRevenue.toLocaleString()}</p>
            </Card>
            <Card>
              <p className="text-xs text-zinc-400 mb-1">This Year</p>
              <p className="text-2xl font-bold text-zinc-900">${yearlyRevenue.toLocaleString()}</p>
            </Card>
            <Card>
              <p className="text-xs text-zinc-400 mb-1">Goal Progress</p>
              {currentGoal ? (
                <div>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-violet-600">{Math.round(getGoalProgress(incomeEntries, currentGoal))}%</p>
                    <p className="text-xs text-zinc-400 mb-1">of ${currentGoal.targetAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-2 mt-2">
                    <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(getGoalProgress(incomeEntries, currentGoal), 100)}%` }} />
                  </div>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setIsGoalFormOpen(true)}>Set Goal</Button>
              )}
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold text-zinc-800 mb-4">Monthly Revenue ({currentYear})</h3>
              <BarChartWrapper
                data={revenueByMonth}
                bars={[{ dataKey: 'revenue', fill: CHART_COLORS.success, name: 'Revenue ($)' }]}
                xAxisKey="month"
                height={250}
              />
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-zinc-800 mb-4">Revenue by Category</h3>
              {revenueByCategory.length > 0 ? (
                <PieChartWrapper data={revenueByCategory} height={250} />
              ) : (
                <p className="text-sm text-zinc-400 text-center py-8">Add income entries to see breakdown</p>
              )}
            </Card>
          </div>

          {/* Income entries */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-800">Income Log</h3>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsGoalFormOpen(true)}>Set Goal</Button>
                <Button size="sm" onClick={() => setIsIncomeFormOpen(true)}><Plus className="w-4 h-4" /> Add Income</Button>
              </div>
            </div>
            {incomeEntries.length === 0 ? (
              <p className="text-sm text-zinc-400 text-center py-6">No income entries yet</p>
            ) : (
              <div className="space-y-2">
                {incomeEntries.sort((a, b) => b.date.localeCompare(a.date)).map(entry => (
                  <div key={entry.id} className="flex items-center justify-between bg-surface-elevated rounded-lg px-3 py-2">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-sm text-zinc-800">{entry.source}</p>
                        <p className="text-xs text-zinc-400">{format(parseISO(entry.date), 'MMM d, yyyy')} &middot; {INCOME_CATEGORIES[entry.category]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-emerald-600">${entry.amount.toLocaleString()}</span>
                      <button onClick={() => deleteIncome(entry.id)} className="text-zinc-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Add Income Modal */}
          <Modal isOpen={isIncomeFormOpen} onClose={() => setIsIncomeFormOpen(false)} title="Add Income">
            <form onSubmit={handleAddIncome} className="space-y-4">
              <Input label="Source" value={incSource} onChange={e => setIncSource(e.target.value)} placeholder="Brand name or source" required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Amount ($)" type="number" value={incAmount} onChange={e => setIncAmount(e.target.value)} placeholder="0" required />
                <Input label="Date" type="date" value={incDate} onChange={e => setIncDate(e.target.value)} required />
              </div>
              <Select label="Category" options={Object.entries(INCOME_CATEGORIES).map(([v, l]) => ({ value: v, label: l }))} value={incCategory} onChange={e => setIncCategory(e.target.value as IncomeEntry['category'])} />
              <Input label="Notes" value={incNotes} onChange={e => setIncNotes(e.target.value)} placeholder="Optional notes" />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsIncomeFormOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm">Save</Button>
              </div>
            </form>
          </Modal>

          {/* Set Goal Modal */}
          <Modal isOpen={isGoalFormOpen} onClose={() => setIsGoalFormOpen(false)} title="Set Income Goal">
            <form onSubmit={handleAddGoal} className="space-y-4">
              <Select label="Period" options={[{ value: 'monthly', label: 'This Month' }, { value: 'yearly', label: 'This Year' }]} value={goalPeriod} onChange={e => setGoalPeriod(e.target.value as 'monthly' | 'yearly')} />
              <Input label="Target Amount ($)" type="number" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} placeholder="5000" required />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsGoalFormOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm">Set Goal</Button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* Invoice Builder */}
      {activeTab === 'invoice' && <InvoiceBuilder />}

      {/* AI Manager */}
      {activeTab === 'ai-manager' && <AIManager />}

      {/* Rate Calculator */}
      {activeTab === 'calculator' && (
        <div className="max-w-xl">
          <Card>
            <h3 className="text-sm font-semibold text-zinc-800 mb-1 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-violet-600" /> Sponsorship Rate Calculator
            </h3>
            <p className="text-xs text-zinc-400 mb-4">Estimate your rates based on follower count and engagement rate.</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Input label="Follower Count" type="number" value={calcFollowers} onChange={e => setCalcFollowers(e.target.value)} placeholder="10000" />
              <Input label="Engagement Rate (%)" type="number" step="0.1" value={calcEngagement} onChange={e => setCalcEngagement(e.target.value)} placeholder="3.5" />
            </div>

            {rates && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Suggested Rates</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Instagram Post', value: rates.instagramPost, platform: 'instagram' as const },
                    { label: 'Instagram Story', value: rates.instagramStory, platform: 'instagram' as const },
                    { label: 'Instagram Reel', value: rates.instagramReel, platform: 'instagram' as const },
                    { label: 'TikTok Video', value: rates.tiktokVideo, platform: 'tiktok' as const },
                    { label: 'YouTube Video', value: rates.youtubeVideo, platform: 'youtube' as const },
                    { label: 'YouTube Short', value: rates.youtubeShort, platform: 'youtube' as const },
                    { label: 'Facebook Post', value: rates.facebookPost, platform: 'facebook' as const },
                    { label: 'Facebook Reel', value: rates.facebookReel, platform: 'facebook' as const },
                  ].map(item => (
                    <div key={item.label} className={`border ${PLATFORM_COLORS[item.platform].border} rounded-lg p-3`}>
                      <p className="text-xs text-zinc-400">{item.label}</p>
                      <p className="text-xl font-bold text-zinc-900">${item.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-400 mt-2">* Estimates based on industry averages. Adjust based on your niche, content quality, and audience demographics.</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
