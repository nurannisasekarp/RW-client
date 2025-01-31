import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Lock, UserCircle, Building2 } from 'lucide-react';
// import axios from 'axios';

const RT_OPTIONS = [
  { value: 1, label: 'RT 01 - Ketua RT 01' },
  { value: 2, label: 'RT 02 - Ketua RT 02' }
];

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'warga', // Default role set to warga
    rt_number: null
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/register`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registrasi gagal');
      }
  
      const data = await response.json();
      
      toast.success('Registrasi berhasil!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Registrasi Warga
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500" />
            <input
              type="text"
              required
              className="w-full pl-10 p-2 border rounded-lg"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Username"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500" />
            <input
              type="password"
              required
              className="w-full pl-10 p-2 border rounded-lg"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Password"
            />
          </div>

          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500" />
            <input
              type="text"
              className="w-full pl-10 p-2 border rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nama Lengkap"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;