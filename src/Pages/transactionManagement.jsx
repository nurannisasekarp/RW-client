import React, { useState, useEffect } from 'react';
import { PlusCircle, DollarSign, TrendingUp, TrendingDown, MessageCircle, Calendar, Filter, ChevronDown, Search } from 'lucide-react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../component/sidebar'; 

const TransactionManagement = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token']);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: 'Dana Sosial',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  // Generate array of years (current year and 5 years back)
  const years = Array.from({length: 6}, (_, i) => new Date().getFullYear() - i);

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
      const response = await axios.get(
        `/api/transactions?year=${selectedYear}&search=${searchQuery}`, 
        axiosConfig
      );
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
      const response = await axios.get(`/api/transactions/summary?year=${selectedYear}`, axiosConfig);
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
      fetchTransactions();
      fetchSummary();
    }
  }, [cookies.access_token, selectedYear, searchQuery]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submitData = {
        ...formData,
        amount: formData.amount.replace(/[^\d]/g, '')
      };
      
      await axios.post('/api/transactions', submitData, axiosConfig);
      fetchTransactions();
      fetchSummary();
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  // Apply search filtering to transactions
  const filteredTransactions = Array.isArray(transactions) 
    ? transactions.filter(transaction => 
        transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        transaction.category?.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex">
      <Sidebar />
      <div className="flex-1">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm mb-6 animate-pulse">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-blue-500 p-2 rounded-lg mr-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Iuran Warga</h1>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Search Box */}
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Year Filter */}
                <div className="relative inline-block text-left">
                  <div className="flex">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                      <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                      {selectedYear}
                      <ChevronDown className="w-4 h-4 ml-2 mt-0.5 text-gray-500" />
                    </button>
                  </div>

                  {isFilterOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {years.map(year => (
                          <button
                            key={year}
                            onClick={() => {
                              setSelectedYear(year);
                              setIsFilterOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              selectedYear === year ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            role="menuitem"
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mb-6">
              <button
                onClick={() => navigate('/add-transaction')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Tambah Iuran
              </button>
              <button
                onClick={() => navigate('/complaint')}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Komplain
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-green-800">Total Pemasukkan</h3>
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(summary.income)}
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-red-800">Total Pengeluaran</h3>
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-700">
                  {formatCurrency(summary.expense)}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-blue-800">Saldo</h3>
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(summary.income - summary.expense)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">Riwayat Iuran {selectedYear}</h2>
              </div>
              <div className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-blue-500 animate-spin"></div>
                  </div>
                ) : Array.isArray(filteredTransactions) && filteredTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tipe</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Deskripsi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tanggal</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.type === 'income' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.type === 'income' ? 'Pemasukkan' : 'Pengeluaran'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{transaction.description || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {new Date(transaction.transaction_date).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </td>
                            <td className={`px-6 py-4 text-sm font-medium text-right whitespace-nowrap ${
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
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m-6-8h6M9 20h6M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    </svg>
                    <p className="text-lg font-medium">Tidak ada transaksi ditemukan</p>
                    <p className="text-sm text-gray-400 mt-1">Coba ubah tahun atau tambahkan transaksi baru</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default TransactionManagement;