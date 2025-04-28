import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AddUser = () => {
  const [cookies] = useCookies(['access_token']);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: '',
    rt_number: ''
  });

  const roles = ['warga', 'admin', 'bendahara', 'rt', 'rw'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const axiosConfig = {
        baseURL: 'http://localhost:3000',
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cookies.access_token}`
        }
      };

      const submitData = { ...formData };
      if (!submitData.rt_number) {
        delete submitData.rt_number;
      }

      await axios.post('/api/user', submitData, axiosConfig);

      toast.success('User berhasil ditambahkan!');
      navigate('/user-management');  // Arahkan ke halaman /user-management setelah sukses
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal menambahkan user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full sm:max-w-md bg-white p-6 rounded-lg shadow-lg">

        {/* Error message */}
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <h2 className="text-2xl font-semibold text-center mb-6">Tambah User Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan username"
              required
            />
          </div>

          {/* Nama */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan email"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Pilih Role --</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* RT Number (optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">RT Number (opsional)</label>
            <input
              type="number"
              value={formData.rt_number}
              onChange={(e) => setFormData({ ...formData, rt_number: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nomor RT (jika ada)"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
