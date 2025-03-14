import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import semua gambar
import Img1 from "../assets/img/GotongRoyong3.jpg";
import Img2 from "../assets/img/GotongRoyong2.jpg";
import Img3 from "../assets/img/GotongRoyong3.jpg";
import Img4 from "../assets/img/GotongRoyong3.jpg";
import Img5 from "../assets/img/GotongRoyong2.jpg";
import Img6 from "../assets/img/GotongRoyong3.jpg";
import Img7 from "../assets/img/GotongRoyong2.jpg";
import Img8 from "../assets/img/GotongRoyong2.jpg";
import Img9 from "../assets/img/GotongRoyong3.jpg";
import Img10 from "../assets/img/GotongRoyong3.jpg";

const WelcomeAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();

  // Semua gambar tersedia
  const allImages = [Img1, Img2, Img3, Img4, Img5, Img6, Img7, Img8, Img9, Img10];

  useEffect(() => {
    // Pilih 3 gambar acak pertama kali
    const shuffledImages = [...allImages].sort(() => Math.random() - 0.5);
    setSelectedImages(shuffledImages.slice(0, 3));

    // Mulai slideshow dengan interval 2 detik
    const slideshowInterval = setInterval(() => {
      const newShuffled = [...allImages].sort(() => Math.random() - 0.5);
      setSelectedImages(newShuffled.slice(0, 3));
    }, 2000);

    // Loading selama 2 detik
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 2000);

    // Navigasi otomatis setelah 5 detik
    const redirectTimer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    // Cleanup interval dan timeout saat komponen unmount
    return () => {
      clearInterval(slideshowInterval);
      clearTimeout(loadingTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100 flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      {/* Animasi Loading */}
      {isLoading && (
        <div className="flex flex-col items-center space-y-4 relative">
          <div className="w-24 h-24 border-8 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-600 text-xl font-semibold tracking-wider animate-bounce">
            Memuat...
          </p>
        </div>
      )}

      {/* Konten Welcome */}
      {showContent && (
        <div className="text-center space-y-12 relative z-10 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-extrabold text-blue-600 animate-glow tracking-tight">
            Selamat Datang
          </h1>

          <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 text-transparent bg-clip-text animate-slide-up tracking-wide">
            Website Resmi RW 03
          </p>

          {/* Slideshow Gambar */}
          <div className="flex justify-center space-x-8 mt-12">
            {selectedImages.map((img, index) => (
              <div
                key={index}
                className="group flex flex-col items-center transition-transform duration-700 ease-in-out transform animate-fade-in"
              >
                <div className="p-6 bg-white rounded-full shadow-lg transform group-hover:scale-110 transition-all duration-300">
                  <img src={img} alt={`Gambar ${index + 1}`} className="w-24 h-24 object-cover rounded-full" />
                </div>
              </div>
            ))}
          </div>

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
    </div>
  );
};

export default WelcomeAnimation;
