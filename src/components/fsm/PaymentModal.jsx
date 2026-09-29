import React, { useState } from 'react';
import { IndianRupee, QrCode, CheckCircle2, X, Receipt, Smartphone } from 'lucide-react';
import { DataTag } from '../common/DataTag';

export const PaymentModal = ({ request, isOpen, onClose, onRecordPayment }) => {
  const [paymentMode, setPaymentMode] = useState('UPI'); // UPI or CASH
  const [cashCollectorName, setCashCollectorName] = useState('GP Operator / Driver');
  const [receiptBookNo, setReceiptBookNo] = useState(`RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [upiRef, setUpiRef] = useState(`UPI${Math.floor(100000000 + Math.random() * 900000000)}`);

  if (!isOpen || !request) return null;

  const vendorVpa = 'mahamaya.fssm@sbi';
  const payeeName = 'CG Rural Sanitation PSSO';
  const amount = request.estimatedCost || 1200;

  // Real UPI deep link format as specified in PRD §11:
  // upi://pay?pa=vendor@upi&pn=Name&am=Amount&cu=INR
  const upiDeepLink = `upi://pay?pa=${vendorVpa}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`FSSM-${request.requestNo}`)}`;

  const handleSubmit = () => {
    onRecordPayment(
      request.id,
      paymentMode,
      paymentMode === 'UPI' ? upiRef : receiptBookNo
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border border-slate-200 dark:border-teal-500/30 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-cg-green/20 text-emerald-700 dark:text-cg-green flex items-center justify-center border border-emerald-200 dark:border-transparent">
              <IndianRupee size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                FSSM Tariff Settlement
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 font-mono">
                {request.requestNo} • ₹{amount}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setPaymentMode('UPI')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              paymentMode === 'UPI'
                ? 'bg-cg-teal text-white shadow-md'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            <Smartphone size={14} />
            <span>UPI Deep Link / QR</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMode('CASH')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              paymentMode === 'CASH'
                ? 'bg-cg-teal text-white shadow-md'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            <Receipt size={14} />
            <span>Physical Cash Receipt</span>
          </button>
        </div>

        {paymentMode === 'UPI' ? (
          <div className="space-y-4 text-center">
            {/* QR box */}
            <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-md border border-slate-200 dark:border-white/10">
              <div className="w-36 h-36 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-200">
                <QrCode size={120} className="text-slate-900" />
              </div>
              <div className="text-[11px] font-mono text-slate-900 font-bold mt-2">
                Scan to Pay ₹{amount}
              </div>
            </div>

            <div className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
              <div>VPA: <strong className="text-sky-700 dark:text-cg-cyan">{vendorVpa}</strong></div>
              <div>AMOUNT: <strong className="text-slate-900 dark:text-white">₹{amount}.00</strong></div>
            </div>

            <a
              href={upiDeepLink}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-50 dark:bg-cg-cyan/20 border border-sky-300 dark:border-cg-cyan/40 text-sky-800 dark:text-cg-cyan hover:bg-sky-100 text-xs font-bold flex items-center justify-center gap-2 transition-colors block"
            >
              <Smartphone size={15} />
              <span>Open in PhonePe / GPay / Paytm</span>
            </a>

            <div className="text-left space-y-1 pt-2">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-mono font-medium">Bank Transaction Reference / UTR</label>
              <input
                type="text"
                value={upiRef}
                onChange={(e) => setUpiRef(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-left">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">Official GP Desludging Cash Receipt</div>
              <div>Tariff Amount: <strong className="text-teal-700 dark:text-cg-teal">₹{amount}.00</strong></div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Authorized by Gram Panchayat By-Laws & SBM-G</div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-mono font-medium">Cash Receipt Voucher No.</label>
              <input
                type="text"
                value={receiptBookNo}
                onChange={(e) => setReceiptBookNo(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-mono font-medium">Collecting Official / Driver</label>
              <input
                type="text"
                value={cashCollectorName}
                onChange={(e) => setCashCollectorName(e.target.value)}
                className="w-full bg-white dark:bg-cg-navy border border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-teal-600"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold dark:text-white border border-slate-200 dark:border-transparent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md flex items-center gap-1.5"
          >
            <CheckCircle2 size={16} />
            <span>Confirm Payment Settlement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
