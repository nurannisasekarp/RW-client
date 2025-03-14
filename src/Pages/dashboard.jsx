import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Sidebar from '../component/sidebar';

const Dashboard = () => {
  const [cookies] = useCookies(['access_token']);
  const [monthlyData, setMonthlyData] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosConfig = {
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${cookies.access_token}`
    }
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions/summary', axiosConfig);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyData = async () => {
    const dummyData = [
      { month: 'January', iuran: 20000 },
      { month: 'February', iuran: 15000 },
      { month: 'Maret', iuran: 50000 },
      { month: 'April', iuran: 43000 },
      { month: 'Mei', iuran: 75000 },
      // Add other months here or fetch dynamically if available.
    ];
    setMonthlyData(dummyData);
  };

  useEffect(() => {
    if (cookies.access_token) {
      fetchSummary();
      fetchMonthlyData();
    }
  }, [cookies.access_token]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const saldo = summary.income - summary.expense;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Pemasukan</h3>
              <p className="text-2xl font-bold text-green-500 mt-4">{formatCurrency(summary.income)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Pengeluaran</h3>
              <p className="text-2xl font-bold text-red-500 mt-4">{formatCurrency(summary.expense)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Saldo</h3>
              <p className="text-2xl font-bold text-blue-500 mt-4">{formatCurrency(saldo)}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Grafik Iuran Warga</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="iuran" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
