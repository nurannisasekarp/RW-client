import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Home, HandshakeIcon } from 'lucide-react';

const WelcomeAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 2000);

    setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100 flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Loading Animation */}
      {isLoading && (
        <div className="flex flex-col items-center space-y-4 relative">
          <div className="w-24 h-24 border-8 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="flex items-center space-x-2">
            <p className="text-blue-600 text-xl font-semibold animate-pulse tracking-wider">Memuat</p>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
            <span className="animate-bounce delay-300">.</span>
          </div>
        </div>
      )}

      {/* Welcome Content with Enhanced Animations */}
      {showContent && (
        <div className="text-center space-y-12 relative z-10 animate-fade-in">
          {/* Main Title with Enhanced Typography */}
          <h1 className="text-6xl md:text-8xl font-extrabold text-blue-600 animate-glow tracking-tight">
            Selamat Datang
          </h1>

          {/* Subtitle with Enhanced Typography */}
          <div className="overflow-hidden">
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 text-transparent bg-clip-text animate-slide-up tracking-wide">
              Website Resmi RW 03
            </p>
          </div>

          {/* Animated Icons Section */}
          <div className="flex justify-center space-x-16 mt-12">
            <div className="group flex flex-col items-center animate-float-delayed-1">
              <div className="p-6 bg-white rounded-full shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <Home className="w-12 h-12 text-blue-600 group-hover:text-blue-800 transition-colors" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                Rumah Kita
              </p>
            </div>
            
            <div className="group flex flex-col items-center animate-float-delayed-2">
              <div className="p-6 bg-white rounded-full shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <Users className="w-12 h-12 text-blue-600 group-hover:text-blue-800 transition-colors" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                Warga
              </p>
            </div>
            
            <div className="group flex flex-col items-center animate-float-delayed-3">
              <div className="p-6 bg-white rounded-full shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <HandshakeIcon className="w-12 h-12 text-blue-600 group-hover:text-blue-800 transition-colors" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                Gotong Royong
              </p>
            </div>
          </div>

          {/* Slogan with Enhanced Typography */}
          <p className="text-2xl font-semibold text-gray-700 animate-wave tracking-wider">
            Ramah, Rapih, Religius
          </p>

          {/* Progress Bar */}
          <div className="mt-8 w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-blue-500 animate-progress rounded-full" />
          </div>
          
          <p className="text-sm font-medium text-gray-500 animate-pulse tracking-wide">
            Mengarahkan ke Dashboard dalam beberapa detik...
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes glow {
          0% { text-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
          100% { text-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-float-delayed-1 {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed-2 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 0.2s;
        }

        .animate-float-delayed-3 {
          animation: float 3s ease-in-out infinite;
          animation-delay: 0.4s;
        }

        .animate-progress {
          animation: progress 5s linear forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default WelcomeAnimation;