import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Receipt, Plus, DollarSign, X } from 'lucide-react';

export const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'RENT',
    amount: '',
    notes: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses/');
      setExpenses(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses/', formData);
      setShowModal(false);
      setFormData({ title: '', category: 'RENT', amount: '', notes: '' });
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record expense');
    }
  };

  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-espresso-800">Operational Expenses</h1>
          <p className="text-xs text-mutedGray">Record rent, utilities, maintenance, and staff salaries for net profit calculation</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso-800 text-cream-100 text-sm font-bold shadow-md hover:bg-espresso-900 transition-all"
        >
          <Plus className="w-4 h-4 text-brass-400" />
          <span>Record Expense</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-sand shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase text-mutedGray tracking-wider">Total Recorded Expenses</span>
          <p className="font-heading text-3xl font-bold text-statusRed-text mt-1">₹{totalExpenseAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-sand overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-sand text-espresso-800 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-mutedGray">Loading expenses...</td>
                </tr>
              ) : expenses.length > 0 ? (
                expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-cream-50 transition-colors">
                    <td className="p-4 font-bold text-espresso-800">{e.title}</td>
                    <td className="p-4 font-medium">{e.category_display}</td>
                    <td className="p-4 font-bold text-statusRed-text">₹{e.amount}</td>
                    <td className="p-4 text-mutedGray">{e.expense_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-mutedGray">No operational expenses recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sand space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-sand pb-4">
              <h3 className="font-heading text-xl font-bold text-espresso-800">Record Operational Expense</h3>
              <button onClick={() => setShowModal(false)} className="text-mutedGray hover:text-espresso-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  placeholder="e.g. Floor Rent - August"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                  >
                    <option value="RENT">Gym Rent</option>
                    <option value="ELECTRICITY">Electricity & Water</option>
                    <option value="EQUIPMENT">Equipment Maintenance</option>
                    <option value="SALARY">Trainer Salary</option>
                    <option value="MARKETING">Marketing & Ads</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-espresso-800 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand bg-cream-50 text-xs font-medium"
                    placeholder="35000"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-sand text-xs font-bold text-espresso-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-espresso-800 text-cream-100 text-xs font-bold shadow-md hover:bg-espresso-900"
                >
                  Save Expense Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
