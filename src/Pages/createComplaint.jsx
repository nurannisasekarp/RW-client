import React, { useState, useRef } from 'react';
import { Camera, Upload, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const CreateComplaint = () => {
  const [cookies] = useCookies(['access_token']);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    photo: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config) => {
      if (cookies.access_token) {
        config.headers.Authorization = `Bearer ${cookies.access_token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreviewUrl(URL.createObjectURL(file));
      setShowCamera(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      setError('Gagal mengakses kamera');
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      setFormData({ ...formData, photo: file });
      setPreviewUrl(URL.createObjectURL(blob));
      setShowCamera(false);

      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
    }, 'image/jpeg');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cookies.access_token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      await api.post('/api/complaints', formDataToSend);
      toast.success('Data berhasil terkirim!');
      navigate('/complaint');
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim pengaduan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-12">
      <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-2xl shadow-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">Buat Pengaduan</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Judul Pengaduan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-3 border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition"
            >
              <Upload className="w-5 h-5" /> Upload Foto
            </button>

            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition"
            >
              <Camera className="w-5 h-5" /> Ambil Foto
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {showCamera && (
            <div className="mt-4">
              <video ref={videoRef} autoPlay className="w-full max-w-md rounded-lg" />
              <button
                type="button"
                onClick={capturePhoto}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Ambil Gambar
              </button>
            </div>
          )}

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-4 w-40 rounded-lg border shadow-md"
            />
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Mengirim...' : 'Kirim Pengaduan'}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 flex justify-center items-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Batal Pengaduan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
