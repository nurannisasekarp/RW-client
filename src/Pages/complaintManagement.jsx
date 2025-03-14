import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Send } from 'lucide-react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const ComplaintManagement = () => {
  const [cookies] = useCookies(['access_token']);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  // const [formData, setFormData] = useState({
  //   title: '',
  //   description: '',
  //   location: '',
  //   photo: null
  // });
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  // Create axios instance with default config
  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
  });

  // Add request interceptor to add token to all requests
  api.interceptors.request.use(
    (config) => {
      if (cookies.access_token) {
        config.headers.Authorization = `Bearer ${cookies.access_token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle token expiration
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Redirect to login page if token is invalid or expired
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    // Check for authentication on component mount
    if (!cookies.access_token) {
      navigate('/login');
      return;
    }
    fetchComplaints();
  }, [cookies.access_token, navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/complaints');
      setComplaints(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err) => {
    if (err.response) {
      switch (err.response.status) {
        case 401:
          setError('Sesi anda telah berakhir. Silakan login kembali.');
          navigate('/login');
          break;
        case 403:
          setError('Anda tidak memiliki izin untuk melakukan tindakan ini.');
          break;
        default:
          setError(err.response.data?.message || 'Terjadi kesalahan pada server');
      }
    } else if (err.request) {
      setError('Gagal terhubung ke server. Periksa koneksi anda.');
    } else {
      setError('Terjadi kesalahan');
    }
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData({ ...formData, photo: file });
  //     setPreviewUrl(URL.createObjectURL(file));
  //     setShowCamera(false);
  //   }
  // };

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

  // const capturePhoto = () => {
  //   const canvas = document.createElement('canvas');
  //   canvas.width = videoRef.current.videoWidth;
  //   canvas.height = videoRef.current.videoHeight;
  //   canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    
  //   canvas.toBlob((blob) => {
  //     const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
  //     setFormData({ ...formData, photo: file });
  //     setPreviewUrl(URL.createObjectURL(blob));
  //     setShowCamera(false);
      
  //     // Stop camera stream
  //     const stream = videoRef.current.srcObject;
  //     const tracks = stream.getTracks();
  //     tracks.forEach(track => track.stop());
  //   }, 'image/jpeg');
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cookies.access_token) {
      navigate('/login');
      return;
    }
  
    // try {
    //   setLoading(true);
    //   const formDataToSend = new FormData();
    //   formDataToSend.append('title', formData.title);
    //   formDataToSend.append('description', formData.description);
    //   formDataToSend.append('location', formData.location);
    //   if (formData.photo) {
    //     formDataToSend.append('photo', formData.photo);
    //   }
  
    //   const response = await api.post('/api/complaints', formDataToSend);
  
    //   if (response.status === 200 || response.status === 201) {
    //     setShowForm(false);
    //     setFormData({
    //       title: '',
    //       description: '',
    //       location: '',
    //       photo: null
    //     });
    //     setPreviewUrl(null);
    //     fetchComplaints();
    //   }
    // } catch (err) {
    //   handleError(err);
    // } finally {
    //   setLoading(false);
    // }
  };

  // Render component UI (same as before)
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Pengaduan Warga</h1>
          <button
            onClick={() => navigate('/createcomplaint')} // Arahkan ke CreateComplaint
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Buat Pengaduan
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Pengaduan Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Judul</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 mt-1 h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Foto</label>
                <div className="mt-1 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Foto
                  </button>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Ambil Foto
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
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full max-w-md rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Ambil Foto
                    </button>
                  </div>
                )}
                {previewUrl && (
                  <div className="mt-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full max-w-md rounded-lg"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                {loading ? 'Mengirim...' : 'Kirim Pengaduan'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Daftar Pengaduan</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : complaints.length > 0 ? (
              <div className="space-y-6">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{complaint.title}</h3>
                        <p className="text-sm text-gray-600">{complaint.location}</p>
                        <p className="text-sm text-gray-500">
                          Dilaporkan oleh: {complaint.reporter_name} pada {complaint.formatted_date}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {complaint.status === 'pending' ? 'Menunggu' :
                         complaint.status === 'in_progress' ? 'Diproses' :
                         'Selesai'}
                      </span>
                    </div>
                    <p className="mt-2">{complaint.description}</p>
                    {complaint.photo_url && (
                      <img
                        src={complaint.photo_url}
                        alt="Complaint"
                        className="mt-4 max-w-md rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Belum ada pengaduan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;