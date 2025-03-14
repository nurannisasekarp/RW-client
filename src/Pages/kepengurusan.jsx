import React, { useState } from "react";
import { Camera, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../component/sidebar";

const PengurusRT_RW = () => {
  const pengurus = [
    { nama: "Budi Santoso", jabatan: "Ketua RT" },
    { nama: "Siti Aisyah", jabatan: "Sekretaris RT" },
    { nama: "Rahmat Hidayat", jabatan: "Bendahara RT" },
    { nama: "Agus Suryanto", jabatan: "Ketua RW" },
    { nama: "Lia Marlina", jabatan: "Anggota RT" },
    { nama: "Hendra Saputra", jabatan: "Anggota RT" },
    { nama: "Dewi Lestari", jabatan: "Anggota RT" },
    { nama: "Wawan Setiawan", jabatan: "Anggota RW" },
    { nama: "Fitria Prasetya", jabatan: "Anggota RW" },
    { nama: "Bayu Firmansyah", jabatan: "Anggota RW" },
    { nama: "Ahmad Zaki", jabatan: "Ketua Bidang Kebersihan" },
    { nama: "Teguh Wibowo", jabatan: "Sekretaris RW" },
    { nama: "Ayu Puspa", jabatan: "Bendahara RW" },
    { nama: "Rina Kurnia", jabatan: "Anggota Bidang Keamanan" },
    { nama: "Eka Hartati", jabatan: "Anggota Bidang Keamanan" },
    { nama: "Rizal Fauzan", jabatan: "Anggota Bidang Pendidikan" },
    { nama: "Linda Wahyuni", jabatan: "Anggota Bidang Sosial" },
    { nama: "Putri Permata", jabatan: "Anggota Bidang Kesehatan" },
    { nama: "Anton Sugiarto", jabatan: "Anggota Bidang Kesejahteraan" },
    { nama: "Dian Firmansyah", jabatan: "Anggota Bidang Pembangunan" },
  ];

  const [pageIndex, setPageIndex] = useState(0); 

  const itemsPerPage = 6;
  const maxPages = Math.ceil(pengurus.length / itemsPerPage) - 1;

  const handleNextPage = () => {
    if (pageIndex < maxPages) setPageIndex(pageIndex + 1);
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  const startIndex = pageIndex * itemsPerPage;
  const currentItems = pengurus.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-grow p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
          Profil Kepengurusan <span className="text-blue-600">RT/RW</span>
        </h1>
        <p className="text-center mb-10 text-gray-600">
          Selamat datang di halaman profil RT/RW. Kami berkomitmen untuk menjaga kebersihan, keamanan, dan kesejahteraan lingkungan bersama.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Pengurus RT/RW</h2>
          <p className="mb-6 text-gray-500">Berikut adalah orang-orang yang mengemban tanggung jawab untuk memajukan lingkungan kita:</p>

          <div className="relative">
          <div className="relative px-12"> 
            <button
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors ${
                pageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ zIndex: 10 }} 
              onClick={handlePrevPage}
              disabled={pageIndex === 0}
            >
              <ChevronLeft />
            </button>

            <div className="grid grid-rows-2 grid-cols-3 gap-6">
              {currentItems.map((person, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105"
                >
                  <h3 className="text-xl font-semibold text-gray-800">{person.nama}</h3>
                  <p className="text-gray-600">{person.jabatan}</p>
                </div>
              ))}
            </div>

            {/* Tombol Next */}
            <button
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors ${
                pageIndex === maxPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ zIndex: 10 }} 
              onClick={handleNextPage}
              disabled={pageIndex === maxPages}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        </section>

        {/* Prestasi */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
            <Trophy className="mr-2 text-yellow-500" /> Prestasi
          </h2>
          <p className="mb-6 text-gray-500">Kami bangga dengan pencapaian yang telah diraih oleh warga kami.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
              <h3 className="text-xl font-semibold text-gray-800">2023</h3>
              <p className="text-gray-600">RT terbaik dalam kebersihan lingkungan</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
              <h3 className="text-xl font-semibold text-gray-800">2022</h3>
              <p className="text-gray-600">Juara 1 Lomba HUT Kemerdekaan</p>
            </div>
          </div>
        </section>

        {/* Dokumentasi */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
            <Camera className="mr-2 text-blue-600" /> Dokumentasi Kegiatan
          </h2>
          <p className="mb-6 text-gray-500">Berikut adalah dokumentasi kegiatan yang telah kami lakukan bersama warga.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
              <img src="/gotongroyong.jpg" alt="Kegiatan Gotong Royong" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Kegiatan Gotong Royong</h3>
                <p className="text-gray-600">Kegiatan gotong royong bersama warga untuk membersihkan lingkungan.</p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
              <img src="/hutRI.jpg" alt="Lomba HUT Kemerdekaan" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Lomba HUT Kemerdekaan</h3>
                <p className="text-gray-600">Perlombaan seru dalam rangka HUT Kemerdekaan RI bersama warga.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PengurusRT_RW;
