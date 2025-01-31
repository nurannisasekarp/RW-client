import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useCookies } from 'react-cookie';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['access_token']);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      handleGoogleLogin(token);
      // Clear URL parameters
      window.history.replaceState({}, document.title, "/login");
    }

    if (error) {
      handleGoogleLoginError(error);
    }
  }, []);

  async function handleGoogleLogin(token) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Simpan token ke cookies sama seperti login biasa
      setCookie('access_token', token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });
  
      // Update auth context
      login({
        user: response.data,
        token
      });
  
      toast.success('Login berhasil!');
      navigate('/welcome');
    } catch (error) {
      console.error('Google login verification error:', error);
      toast.error('Gagal memverifikasi login Google');
    }
  }

  function handleGoogleLoginError(error) {
    switch(error) {
      case 'unauthorized':
        toast.error('Email tidak terdaftar');
        break;
      case 'authentication_failed':
        toast.error('Autentikasi Google gagal');
        break;
      default:
        toast.error('Terjadi kesalahan saat login');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Set the token in cookies
      setCookie('access_token', response.data.token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      // Update auth context
      login(response.data);

      toast.success('Login berhasil!');
      navigate('/welcome');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Username atau password salah');
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-300 via-blue-700 to-cyan-200">
      {/* Radial gradient overlay */}
      <div className="min-h-screen w-full relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_100%)]" />

        {/* Content */}
        <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-200 to-purple-200" />

          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex flex-col items-center">
              <div className="w-24 h-30 flex items-center justify-center mb-2">
                <img
                  src="/logo-rw.jpg"
                  alt="Logo RW"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              <h2 className="text-center text-3xl font-bold text-white mb-2">
                RW 03 Kel. Empang, Kec. Bogor Selatan, Kota Bogor
              </h2>
              <p className="mt-1 text-center text-lg text-blue-50">
                Portal Layanan Warga Digital
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
            <div className="backdrop-blur-lg bg-white/90 py-8 px-6 sm:px-10 shadow-[0_0_40px_rgba(0,0,0,0.1)] rounded-xl border border-white/30">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      required
                      className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 bg-white/80"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Masukkan username Anda"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="appearance-none block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 bg-white/80"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Masukkan kata sandi"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-indigo-500 transition-colors duration-150" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-indigo-500 transition-colors duration-150" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? 'Memproses...' : 'Masuk ke Sistem'}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-gray-300 absolute inset-0"></div>
                    <span className="px-4 text-gray-500 relative z-10">atau</span>
                  </div>

                  <a
                    href={`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/google`}
                    className="mt-6 w-full inline-flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 transform hover:scale-[1.02]"
                  >
                    <FcGoogle className="mr-2 h-6 w-6" />
                    Masuk dengan Google
                  </a>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-gray-600">
                      Belum terdaftar?{' '}
                      <a
                        href="/register"
                        className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
                      >
                        Daftar Sekarang
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                <div className="font-semibold">Sistem Informasi RW 03 © 2025</div>
                <div className="mt-1 text-xs">
                  Ramah, Rapih, Religius
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}