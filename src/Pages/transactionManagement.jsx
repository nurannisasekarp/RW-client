import React, { useState, useEffect } from 'react';
import { PlusCircle, DollarSign, TrendingUp, TrendingDown, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';


const TransactionManagement = () => {
  const navigate = useNavigate();

  const [cookies] = useCookies(['access_token']);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: 'Dana Sosial',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Dana Sosial',
  ];

  const formatCurrency = (value) => {
    if (!value) return 'IDR 0';
    const numericValue = typeof value === 'string' ? value.replace(/[^\d]/g, '') : value;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericValue);
  };

  const formatInputCurrency = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('id-ID').format(numericValue);
  };

  const axiosConfig = {
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${cookies.access_token}`
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions', axiosConfig);
      setTransactions(response.data || []);
    } catch (err) {
      console.error('Error details:', err.response);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get('/api/transactions/summary', axiosConfig);
      // Transform the array response into the expected summary format
      const summaryData = response.data.reduce((acc, item) => {
        acc[item.type] = parseInt(item.total);
        return acc;
      }, {
        income: 0,
        expense: 0
      });
      
      setSummary(summaryData);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch summary');
    }
  };

  useEffect(() => {
    if (cookies.access_token) {
      // console.log('Fetching with token:', cookies.access_token);
      fetchTransactions();
      fetchSummary();
    }
  }, [cookies.access_token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submitData = {
        ...formData,
        amount: formData.amount.replace(/[^\d]/g, '')
      };
      
      await axios.post('/api/transactions', submitData, axiosConfig);
      setShowForm(false);
      setFormData({
        type: 'income',
        amount: '',
        description: '',
        category: 'Dana Sosial',
        transaction_date: new Date().toISOString().split('T')[0]
      });
      fetchTransactions();
      fetchSummary();
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setFormData({ ...formData, amount: formatInputCurrency(value) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Iuran Warga</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah
          </button>
          <button
          onClick={() => navigate('/complaint')}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Komplain
        </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Pemasukkan</h3>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.income)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Pengeluaran</h3>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.expense)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Saldo</h3>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(summary.income - summary.expense)}
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">New Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tipe</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="income">Pemasukkan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Jumlah</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tanggal</label>
                  <input
                    type="date"
                    value={formData.transaction_date}
                    onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Transaction'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Riwayat Iuran</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : Array.isArray(transactions) && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type === 'income' ? 'Pemasukkan' : 'Pengeluaran'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm text-right whitespace-nowrap ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No transactions found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionManagement;