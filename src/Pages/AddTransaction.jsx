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

      await axios.post(
        '/api/transactions',
        submitData,
        {
          baseURL: 'http://localhost:3000',
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.access_token}`
          }
        }
      );

      toast.success('Data berhasil terkirim!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal membuat transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-8">Tambah Transaksi</h2>

        {error && (
          <div className="text-red-500 text-center mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipe Transaksi */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Tipe Transaksi</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>

          {/* Jumlah */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Jumlah</label>
            <input
              type="text"
              value={formData.amount}
              onChange={handleAmountChange}
              placeholder="Masukkan jumlah"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Deskripsi</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Masukkan deskripsi"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Tanggal Transaksi</label>
            <input
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
