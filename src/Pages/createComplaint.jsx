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
    photo: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
  });

  api.interceptors.request.use(
    (config) => {
      if (cookies.access_token) {
        config.headers.Authorization =`Bearer ${cookies.access_token}`;
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
      stream.getTracks().forEach(track => track.stop());
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Pengaduan Baru</h1>
      {error && <div className="bg-red-50 text-red-700 p-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input type="text" placeholder="Judul" value={formData.title} 
               onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border" required />
        <textarea placeholder="Deskripsi" value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border" required />
        <input type="text" placeholder="Lokasi" value={formData.location} 
               onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full p-2 border" required />

        <div>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="mr-2 bg-gray-300 p-2">Upload Foto</button>
          <button type="button" onClick={startCamera} className="bg-gray-300 p-2">Ambil Foto</button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 w-32" />}
        <button type="submit" className="w-full bg-blue-600 text-white p-2">{loading ? 'Mengirim...' : 'Kirim Pengaduan'}</button>
      </form>
    </div>
  );
};

export default CreateComplaint;