import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Award, Plus, Search, Receipt, Printer, X } from 'lucide-react';

export const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [formData, setFormData] = useState({
    member_id: '',
    amount_paid: '',
    total_amount: '',
    payment_method: 'UPI',
    notes: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchMembers();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments/');
      setPayments(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members/');
      setMembers(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCollectPayment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments/', {
        member: formData.member_id,
        amount_paid: formData.amount_paid,
        total_amount: formData.total_amount || formData.amount_paid,
        payment_method: formData.payment_method,
        payment_status: 'PAID',
        notes: formData.notes
      });
      setShowCollectModal(false);
      setFormData({ member_id: '', amount_paid: '', total_amount: '', payment_method: 'UPI', notes: '' });
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record payment');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Fee Collections & Receipts</h1>
          <p className="text-xs text-mutedGray">Record member fee payments, track pending dues, and issue digital receipts</p>
        </div>
        <button
          onClick={() => setShowCollectModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso-800 text-cream-100 text-sm font-bold shadow-md hover:bg-espresso-900 transition-all"
        >
          <Plus className="w-4 h-4 text-brass-400" />
          <span>Collect Fee Payment</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-sand overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-sand text-espresso-800 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Receipt No</th>
                <th className="p-4">Member Name</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount Paid</th>
                <th className="p-4">Due Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-mutedGray">Loading payments...</td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-brass-600">{p.receipt_no}</td>
                    <td className="p-4 font-bold text-espresso-800">{p.member_name} ({p.member_code})</td>
                    <td className="p-4 font-medium">{p.payment_method}</td>
                    <td className="p-4 font-bold text-statusGreen-text bg-statusGreen-bg/50 px-2.5 py-1 rounded-md inline-block my-2">
                      ₹{p.amount_paid}
                    </td>
                    <td className="p-4 font-semibold text-statusRed-text">
                      ₹{p.due_amount || 0}
                    </td>
                    <td className="p-4 text-mutedGray">{p.payment_date}</td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brass-600 hover:underline"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-mutedGray">No payment records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sand space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-sand pb-4">
              <h3 className="font-heading text-xl font-bold text-espresso-800">Collect Member Fee</h3>
              <button onClick={() => setShowCollectModal(false)} className="text-mutedGray hover:text-espresso-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCollectPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Select Member</label>
                <select
                  required
                  value={formData.member_id}
                  onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                >
                  <option value="">Choose Member</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.full_name} ({m.member_id_code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount_paid}
                    onChange={(e) => setFormData({ ...formData, amount_paid: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                    placeholder="1500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="ONLINE">Online Gateway</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-sand text-xs font-bold text-espresso-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-espresso-800 text-cream-100 text-xs font-bold shadow-md hover:bg-espresso-900"
                >
                  Record Payment & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-sand space-y-6 shadow-2xl text-center">
            <div className="space-y-1">
              <span className="font-heading text-2xl font-bold text-espresso-800">GymSuite Receipt</span>
              <p className="text-[10px] text-brass-600 font-bold uppercase">{selectedReceipt.receipt_no}</p>
            </div>

            <div className="bg-cream-100 rounded-2xl p-4 text-left text-xs space-y-2 border border-sand">
              <div className="flex justify-between">
                <span className="text-mutedGray">Member:</span>
                <span className="font-bold text-espresso-800">{selectedReceipt.member_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mutedGray">Payment Method:</span>
                <span className="font-bold">{selectedReceipt.payment_method}</span>
              </div>
              <div className="flex justify-between border-t border-sand pt-2 font-bold text-sm">
                <span>Amount Paid:</span>
                <span className="text-statusGreen-text">₹{selectedReceipt.amount_paid}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-espresso-800 text-cream-100 text-xs font-bold"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
