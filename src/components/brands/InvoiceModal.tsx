'use client';

import { useRef, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { BrandDeal } from '@/types/brands';
import { format } from 'date-fns';
import { Download } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: BrandDeal;
}

export function InvoiceModal({ isOpen, onClose, deal }: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceNumber] = useState(() => `INV-${Date.now().toString(36).toUpperCase()}`);
  const [issueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return format(d, 'yyyy-MM-dd');
  });
  const [notes, setNotes] = useState('');

  const deliverableLines = deal.deliverables
    .split(/[,\n+]/)
    .map(d => d.trim())
    .filter(Boolean);

  const ratePerItem = deliverableLines.length > 0 ? deal.rate / deliverableLines.length : deal.rate;

  const handleDownloadPDF = async () => {
    const el = invoiceRef.current;
    if (!el) return;
    // Use browser print as PDF fallback
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #1a1a1a; padding: 40px; }
            .invoice { max-width: 700px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #8b5cf6; padding-bottom: 20px; }
            .brand { font-size: 24px; font-weight: 700; color: #8b5cf6; }
            .meta { text-align: right; font-size: 13px; color: #666; }
            .meta strong { color: #1a1a1a; display: block; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px; }
            .bill-to { font-size: 14px; }
            .bill-to strong { display: block; font-size: 16px; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin: 24px 0; }
            th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
            td { padding: 12px; border-bottom: 1px solid #f1f3f5; font-size: 14px; }
            td:last-child, th:last-child { text-align: right; }
            .total-row { border-top: 2px solid #1a1a1a; }
            .total-row td { font-weight: 700; font-size: 18px; padding-top: 16px; }
            .notes { font-size: 13px; color: #666; background: #f8f9fa; padding: 16px; border-radius: 8px; margin-top: 24px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <div>
                <div class="brand">Codey James</div>
                <div style="font-size: 13px; color: #666; margin-top: 4px;">@codey___ &middot; NYC</div>
              </div>
              <div class="meta">
                <strong>${invoiceNumber}</strong>
                Issue: ${format(new Date(issueDate), 'MMM d, yyyy')}<br/>
                Due: ${format(new Date(dueDate), 'MMM d, yyyy')}
              </div>
            </div>
            <div class="section">
              <div class="section-title">Bill To</div>
              <div class="bill-to">
                <strong>${deal.brandName}</strong>
                ${deal.contactName ? deal.contactName + '<br/>' : ''}
                ${deal.contactEmail || ''}
              </div>
            </div>
            <table>
              <thead>
                <tr><th>Deliverable</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
              </thead>
              <tbody>
                ${deliverableLines.map(d => `
                  <tr>
                    <td>${d}</td>
                    <td>1</td>
                    <td>$${ratePerItem.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>$${ratePerItem.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="3">Total</td>
                  <td>$${deal.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
            ${notes ? `<div class="notes"><strong>Notes:</strong> ${notes}</div>` : ''}
            <div class="footer">Thank you for your partnership!</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice" maxWidth="max-w-2xl">
      <div ref={invoiceRef} className="space-y-4">
        {/* Invoice header */}
        <div className="flex justify-between items-start pb-4 border-b-2 border-violet-500">
          <div>
            <h2 className="text-xl font-bold text-violet-600">Codey James</h2>
            <p className="text-xs text-zinc-500">@codey___ &middot; NYC</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-zinc-800">{invoiceNumber}</p>
            <p className="text-xs text-zinc-500">Issue: {format(new Date(issueDate), 'MMM d, yyyy')}</p>
            <div className="mt-1">
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="!w-auto text-xs" />
            </div>
          </div>
        </div>

        {/* Bill to */}
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Bill To</p>
          <p className="text-sm font-semibold text-zinc-800">{deal.brandName}</p>
          {deal.contactName && <p className="text-xs text-zinc-500">{deal.contactName}</p>}
          {deal.contactEmail && <p className="text-xs text-zinc-500">{deal.contactEmail}</p>}
        </div>

        {/* Line items */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="text-left py-2 text-[10px] text-zinc-500 uppercase">Deliverable</th>
              <th className="text-right py-2 text-[10px] text-zinc-500 uppercase">Qty</th>
              <th className="text-right py-2 text-[10px] text-zinc-500 uppercase">Rate</th>
              <th className="text-right py-2 text-[10px] text-zinc-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {deliverableLines.map((d, i) => (
              <tr key={i} className="border-b border-zinc-100">
                <td className="py-2 text-zinc-700">{d}</td>
                <td className="py-2 text-right text-zinc-500">1</td>
                <td className="py-2 text-right text-zinc-500">${ratePerItem.toFixed(2)}</td>
                <td className="py-2 text-right text-zinc-800 font-medium">${ratePerItem.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-zinc-800">
              <td colSpan={3} className="py-3 font-bold text-zinc-800">Total</td>
              <td className="py-3 text-right text-lg font-bold text-zinc-800">${deal.rate.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment terms, special instructions..." />

        <div className="flex justify-end pt-2">
          <Button size="sm" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}
