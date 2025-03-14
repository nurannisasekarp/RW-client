import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AddTransaction = () => {
  const [cookies] = useCookies(['access_token']);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: 'Dana Sosial',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Dana Sosial'];

  const formatInputCurrency = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('id-ID').format(numericValue);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setFormData({ ...formData, amount: formatInputCurrency(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submitData = {
        ...formData,
        amount: formData.amount.replace(/[^\d]/g, '')
      };
      const axiosConfig = {
        baseURL: 'http://localhost:3000',
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cookies.access_token}`
        }
      };
      await axios.post('/api/transactions', submitData, axiosConfig);
      
      // Alert setelah transaksi berhasil
      toast.success('Data berhasil terkirim!');
            
      // Pindah ke halaman dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <h2 className="text-xl font-semibold mb-4">Tambah Transaksi Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Tipe</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="income">Pemasukkan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Jumlah</label>
            <input
              type="text"
              value={formData.amount}
              onChange={handleAmountChange}
              className="w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan jumlah"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan deskripsi"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Tanggal</label>
            <input
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              className="w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </div>
    </div>

  );
};

export default AddTransaction;
