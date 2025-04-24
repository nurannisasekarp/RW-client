import React, { useEffect, useState, useRef } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Semua gambar tersedia
  const allImages = [Img1, Img2, Img3, Img4, Img5, Img6, Img7, Img8, Img9, Img10];
  
  // Efek loading dan inisialisasi
  useEffect(() => {
    // Loading selama 3 detik untuk menikmati animasi RW03
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 2000);

    // Navigasi otomatis setelah 10 detik
    const redirectTimer = setTimeout(() => {
      navigate("/dashboard");
    }, 10000);

    // Cleanup timeout saat komponen unmount
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  // Efek autoplay carousel dengan swipe premium
  useEffect(() => {
    if (!showContent) return;
    
    const slideInterval = setInterval(() => {
      if (!isTransitioning) {
        handleNextSlide();
      }
    }, 1500);

    return () => clearInterval(slideInterval);
  }, [showContent, isTransitioning]);

  const handleNextSlide = () => {
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % allImages.length);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handlePrevSlide = () => {
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      {/* Overlay pattern for premium look */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMDYiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzAwMDAwMDA5IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-10"></div>

      {/* Animasi Loading Super Premium */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-8 relative z-10">
          {/* RW03 Ultra Premium Animation */}
          <div className="relative w-40 h-40">
            {/* Circular gradient background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg shadow-blue-900/50 animate-pulse-subtle"></div>
            
            {/* Outer rings */}
            <div className="absolute inset-0 border-4 border-white opacity-10 rounded-full animate-reverse-spin"></div>
            <div className="absolute inset-0 border border-white opacity-20 rounded-full scale-110 animate-ping-slow"></div>
            <div className="absolute inset-0 border-2 border-white opacity-5 rounded-full scale-125 animate-ping-slow animation-delay-300"></div>
            <div className="absolute inset-0 border border-white opacity-10 rounded-full scale-150 animate-ping-slower"></div>
            
            {/* Animated particles around the circle */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-300 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 30}deg) translateY(-75px)`,
                  animation: `orbit 8s linear infinite ${i * 0.2}s`
                }}
              ></div>
            ))}
            
            {/* Rotating segments */}
            <div className="absolute inset-2 rounded-full overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400"
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(i * Math.PI / 3)}% ${50 + 50 * Math.sin(i * Math.PI / 3)}%, ${50 + 50 * Math.cos((i + 1) * Math.PI / 3)}% ${50 + 50 * Math.sin((i + 1) * Math.PI / 3)}%)`,
                    opacity: 0.2 + (i * 0.1),
                    animation: `segment-pulse 2s ease-in-out infinite ${i * 0.3}s`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Spinning line accent */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-white opacity-30 animate-spin"></div>
              <div className="w-1 h-full bg-white opacity-30 animate-spin animation-delay-500"></div>
            </div>
            
            {/* Inner glow effect */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-200 to-white opacity-60 blur-sm animate-pulse"></div>
            
            {/* RW03 Text with special effects */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Text shadow/glow effect */}
                <span className="absolute font-extrabold text-3xl text-white blur-sm opacity-70">RW 03</span>
                
                {/* Main text */}
                <span className="relative font-extrabold text-3xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow">RW 03</span>
                
                {/* Individual letter animations */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="relative flex">
                    <span className="text-3xl font-extrabold text-transparent animate-letter-float animation-delay-0">R</span>
                    <span className="text-3xl font-extrabold text-transparent animate-letter-float animation-delay-200">W</span>
                    <span className="text-3xl font-extrabold text-transparent animate-letter-float animation-delay-400">0</span>
                    <span className="text-3xl font-extrabold text-transparent animate-letter-float animation-delay-600">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading text with fancy animation */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <span className="text-blue-100 text-lg font-light uppercase tracking-widest">Loading</span>
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-150"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-300"></span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-px w-full scale-x-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scale-x"></div>
          </div>
        </div>
      )}

      {/* Konten Welcome */}
      {showContent && (
        <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto z-10">
          {/* Welcome Text dengan animasi */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4">
              <span className="inline-block transform transition-all duration-700 ease-out">S</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-75">e</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-100">l</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-125">a</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-150">m</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-175">a</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-200">t</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-225"> </span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-250">D</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-275">a</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-300">t</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-325">a</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-350">n</span>
              <span className="inline-block transform transition-all duration-700 ease-out delay-375">g</span>
            </h1>
            
            <div className="overflow-hidden h-12 relative">
              <h2 className="text-2xl md:text-3xl font-medium text-blue-200 tracking-wide uppercase absolute w-full animate-slide-up">
                Website Resmi RW 03
              </h2>
            </div>
            
            {/* Divider Line */}
            <div className="flex items-center justify-center mt-8 mb-6">
              <div className="h-px w-12 bg-blue-400 opacity-30"></div>
              <div className="mx-4">
                <div className="w-2 h-2 bg-blue-400 rotate-45 transform"></div>
              </div>
              <div className="h-px w-12 bg-blue-400 opacity-30"></div>
            </div>

            <p className="text-xl font-light text-blue-100 tracking-wide">
              <span className="opacity-80">Ramah</span>
              <span className="mx-4 text-xs opacity-50">●</span>
              <span className="opacity-80">Rapih</span>
              <span className="mx-4 text-xs opacity-50">●</span>
              <span className="opacity-80">Religius</span>
            </p>
          </div>

          {/* Premium Image Carousel dengan efek swipe */}
          <div className="w-full relative overflow-hidden py-8 animate-fade-in">
            {/* Carousel dengan efek gesture sensitive */}
            <div 
              ref={carouselRef} 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 33.33}%)` }}
            >
              {/* Render semua gambar dalam bentuk slide */}
              {allImages.map((img, index) => (
                <div 
                  key={index} 
                  className="min-w-[33.33%] px-2 flex justify-center"
                >
                  <div 
                    className={`relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ${
                      index === activeIndex 
                        ? "w-64 h-64 scale-100 opacity-100 border-2 border-white border-opacity-20"
                        : "w-56 h-56 scale-90 opacity-70"
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`RW 03 - ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 ${
                      index === activeIndex ? "opacity-60" : "opacity-40"
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center mt-6 space-x-3">
              <button 
                onClick={handlePrevSlide}
                disabled={isTransitioning}
                className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              {/* Dot indicators */}
              <div className="flex items-center space-x-2">
                {allImages.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => {
                      setIsTransitioning(true);
                      setActiveIndex(index);
                      setTimeout(() => setIsTransitioning(false), 600);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeIndex 
                        ? "bg-white w-6" 
                        : "bg-white bg-opacity-40 hover:bg-opacity-60"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={handleNextSlide}
                disabled={isTransitioning}
                className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          {/* Progress Bar dan Redirect Info */}
          <div className="w-full max-w-md mt-12 animate-fade-in-up animation-delay-500">
            <div className="w-full h-1 bg-white bg-opacity-10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full animate-progress-smooth"></div>
            </div>
            <p className="text-blue-200 text-sm font-light mt-3 text-center tracking-wider">
              Mengarahkan ke Dashboard dalam beberapa saat...
            </p>
          </div>
        </div>
      )}

      {/* animated background elements */}
      <div className="fixed inset-0 z-0 opacity-20">
        {/* Diagonal lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-px bg-white bg-opacity-30"
              style={{
                height: '200%',
                left: `${i * 20}%`, 
                top: '-50%',
                transform: 'rotate(35deg)',
                animation: `pulse-fade 10s infinite alternate ${i * 1.5}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`p-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `float-premium ${Math.random() * 15 + 20}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeAnimation;