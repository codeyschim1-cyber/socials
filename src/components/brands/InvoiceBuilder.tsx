'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Plus, Trash2, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export function InvoiceBuilder() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(() => `INV-${Date.now().toString(36).toUpperCase()}`);
  const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return format(d, 'yyyy-MM-dd');
  });
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0 },
  ]);

  // Inline editing state for preview
  const [editingField, setEditingField] = useState<string | null>(null);

  const addLineItem = () => {
    setLineItems(prev => [...prev, { id: String(Date.now()), description: '', quantity: 1, rate: 0 }]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(139, 92, 246);
    doc.text('INVOICE', margin, y);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(invoiceNumber, 190, y, { align: 'right' });
    y += 8;
    doc.text(`Issue: ${format(new Date(issueDate), 'MMM d, yyyy')}`, 190, y, { align: 'right' });
    y += 5;
    doc.text(`Due: ${format(new Date(dueDate), 'MMM d, yyyy')}`, 190, y, { align: 'right' });

    // Divider
    y += 8;
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, y, 190, y);

    // Bill To
    y += 10;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('BILL TO', margin, y);
    y += 6;
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(clientName || 'Client Name', margin, y);
    if (clientEmail) {
      y += 5;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(clientEmail, margin, y);
    }

    // Table header
    y += 14;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('DESCRIPTION', margin, y);
    doc.text('QTY', 120, y, { align: 'right' });
    doc.text('RATE', 150, y, { align: 'right' });
    doc.text('AMOUNT', 190, y, { align: 'right' });
    y += 3;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(margin, y, 190, y);

    // Line items
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    for (const item of lineItems) {
      y += 8;
      doc.text(item.description || '—', margin, y);
      doc.text(String(item.quantity), 120, y, { align: 'right' });
      doc.text(`$${item.rate.toFixed(2)}`, 150, y, { align: 'right' });
      doc.text(`$${(item.quantity * item.rate).toFixed(2)}`, 190, y, { align: 'right' });
    }

    // Total
    y += 6;
    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.5);
    doc.line(margin, y, 190, y);
    y += 8;
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text('Total', margin, y);
    doc.text(`$${subtotal.toFixed(2)}`, 190, y, { align: 'right' });

    // Notes
    if (notes) {
      y += 14;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('NOTES', margin, y);
      y += 5;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const splitNotes = doc.splitTextToSize(notes, 170);
      doc.text(splitNotes, margin, y);
    }

    doc.save(`${invoiceNumber}.pdf`);
  };

  const InlineEdit = ({ value, onChange, field, className = '' }: {
    value: string; onChange: (v: string) => void; field: string; className?: string;
  }) => {
    if (editingField === field) {
      return (
        <input
          autoFocus
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={() => setEditingField(null)}
          onKeyDown={e => e.key === 'Enter' && setEditingField(null)}
          className={`bg-transparent border-b border-violet-400 outline-none ${className}`}
        />
      );
    }
    return (
      <span onClick={() => setEditingField(field)} className={`cursor-pointer hover:text-violet-600 transition-colors ${className}`}>
        {value || 'Click to edit'}
      </span>
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Form */}
      <div className="space-y-4">
        <Card>
          <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-600" /> Invoice Details
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Brand name" />
              <Input label="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="email@brand.com" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Invoice #" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
              <Input label="Issue Date" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
              <Input label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-zinc-800 mb-3">Line Items</h3>
          <div className="space-y-2">
            {lineItems.map(item => (
              <div key={item.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label="Description"
                    value={item.description}
                    onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                    placeholder="Deliverable description"
                  />
                </div>
                <div className="w-16">
                  <Input
                    label="Qty"
                    type="number"
                    value={String(item.quantity)}
                    onChange={e => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="w-24">
                  <Input
                    label="Rate ($)"
                    type="number"
                    value={String(item.rate)}
                    onChange={e => updateLineItem(item.id, 'rate', Number(e.target.value))}
                  />
                </div>
                <button
                  onClick={() => removeLineItem(item.id)}
                  className="text-zinc-400 hover:text-red-600 transition-colors pb-2"
                  disabled={lineItems.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={addLineItem} className="mt-2">
            <Plus className="w-4 h-4" /> Add Line Item
          </Button>
        </Card>

        <Card>
          <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment terms, special instructions..." />
        </Card>
      </div>

      {/* Live Preview */}
      <div>
        <Card className="sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-800">Preview</h3>
            <Button size="sm" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>

          <div ref={previewRef} className="border border-zinc-200 rounded-lg p-6 bg-white">
            {/* Invoice header */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-violet-500">
              <div>
                <h2 className="text-lg font-bold text-violet-600">INVOICE</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-800">
                  <InlineEdit value={invoiceNumber} onChange={setInvoiceNumber} field="invoiceNumber" />
                </p>
                <p className="text-xs text-zinc-500">Issue: {format(new Date(issueDate), 'MMM d, yyyy')}</p>
                <p className="text-xs text-zinc-500">Due: {format(new Date(dueDate), 'MMM d, yyyy')}</p>
              </div>
            </div>

            {/* Bill to */}
            <div className="mt-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Bill To</p>
              <p className="text-sm font-semibold text-zinc-800">
                <InlineEdit value={clientName} onChange={setClientName} field="clientName" />
              </p>
              {clientEmail && <p className="text-xs text-zinc-500">{clientEmail}</p>}
            </div>

            {/* Line items */}
            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-2 text-[10px] text-zinc-500 uppercase">Description</th>
                  <th className="text-right py-2 text-[10px] text-zinc-500 uppercase">Qty</th>
                  <th className="text-right py-2 text-[10px] text-zinc-500 uppercase">Rate</th>
                  <th className="text-right py-2 text-[10px] text-zinc-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map(item => (
                  <tr key={item.id} className="border-b border-zinc-100">
                    <td className="py-2 text-zinc-700">{item.description || '—'}</td>
                    <td className="py-2 text-right text-zinc-500">{item.quantity}</td>
                    <td className="py-2 text-right text-zinc-500">${item.rate.toFixed(2)}</td>
                    <td className="py-2 text-right text-zinc-800 font-medium">${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-zinc-800">
                  <td colSpan={3} className="py-3 font-bold text-zinc-800">Total</td>
                  <td className="py-3 text-right text-lg font-bold text-zinc-800">${subtotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            {notes && (
              <div className="mt-4 bg-zinc-50 rounded p-3">
                <p className="text-[10px] text-zinc-500 uppercase mb-1">Notes</p>
                <p className="text-xs text-zinc-600">{notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
