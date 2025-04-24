import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Send, Filter, MapPin, Calendar, ThumbsUp, Eye, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../component/sidebar';

const ComplaintManagement = () => {
  const [cookies] = useCookies(['access_token']);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // votes, date, view_count
  const [filterType, setFilterType] = useState('all'); // all, pending, in_progress, resolved
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [userProfile, setUserProfile] = useState(null);
  const [statusUpdateComment, setStatusUpdateComment] = useState('');
  const [complaintIdToUpdate, setComplaintIdToUpdate] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  // Tambahkan state untuk melacak filter "my complaints"
  const [filterMy, setFilterMy] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

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
    fetchUserProfile();
    fetchComplaints();
  }, [cookies.access_token, navigate, sortBy, filterType, filterMy, pagination.currentPage]);
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/profile/getProfile');
      setUserProfile(response.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      
      let url = `/api/complaints`;
      const params = new URLSearchParams();
  
      // Add pagination
      params.append('page', pagination.currentPage);
      params.append('limit', 10);
  
      // Add sorting
      if (sortBy === 'votes') {
        params.append('sortBy', 'likes_count');
        params.append('sortOrder', 'DESC');
      } else if (sortBy === 'date') {
        params.append('sortBy', 'created_at');
        params.append('sortOrder', 'DESC');
      } else if (sortBy === 'view_count') {
        params.append('sortBy', 'view_count');
        params.append('sortOrder', 'DESC');
      }
  
      // Add type filter (if not 'all')
      if (filterType !== 'all') {
        params.append('status', filterType);
      }
      
      // Add "my complaints" filter
      if (filterMy) {
        params.append('filter', 'me');
      }
  
      const response = await api.get(`${url}?${params.toString()}`);
      
      setComplaints(response.data);
      // If your API returns pagination info, update it here
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
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

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  // Check if user has authorization to update complaint status
  const canUpdateStatus = () => {
    if (!userProfile) return false;
    const authorizedRoles = ['rt', 'rw', 'admin'];
    return authorizedRoles.includes(userProfile.role);
  };

  // Function to handle complaint status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setComplaintIdToUpdate(id);
      setShowStatusModal(true);
    } catch (err) {
      handleError(err);
    }
  };

  // Function to submit status update with comment
  const submitStatusUpdate = async () => {
    try {
      const selectedStatus = document.querySelector('input[name="status"]:checked').value;

      await api.patch(`/api/complaints/${complaintIdToUpdate}/status`, {
        status: selectedStatus,
        comment: statusUpdateComment
      });

      setShowStatusModal(false);
      setStatusUpdateComment('');
      setComplaintIdToUpdate(null);

      // Refresh complaints after update
      fetchComplaints();
    } catch (err) {
      handleError(err);
    }
  };

  // Format status text for display
  const formatStatus = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'in_progress': return 'Diproses';
      case 'resolved': return 'Selesai';
      case 'rejected': return 'Ditolak';
      default: return 'Tidak diketahui';
    }
  };

  // Format status class for color coding
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status indicator color
  const getStatusIndicatorClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with styled enhancement */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 relative">
            Pengaduan
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              Baru
            </span>
          </h1>
          <p className="text-gray-600 mt-1">Pantau pengaduan masyarakat RW 03</p>
        </div>

        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate('/createcomplaint')}
            className="btn bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center"
          >
            <span className="mr-2">Buat Pengaduan Baru</span>
            <span className="inline-block animate-bounce">+</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Information Alert */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-md shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Informasi Pengaduan</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Anda dapat melacak status pengaduan yang telah dibuat</li>
                <li>Pengaduan yang sudah diproses tidak dapat dihapus</li>
                <li>Anda dapat berintekasi dengan pengaduan lain nya untuk menyurakan perubahan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Controls with enhanced styling */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-t-4 border-primary">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-700 hover:text-primary transition-colors duration-300"
            >
              <Filter className={`mr-2 ${showFilters ? 'text-primary' : ''}`} />
              <span className="font-medium">Filter & Urutkan</span>
              <span className={`ml-2 transition-transform duration-300 ${showFilters ? 'transform rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setSortBy('votes')}
              className={`px-3 py-1 rounded-md transition-all duration-300 ${sortBy === 'votes' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Terpopuler
            </button>

            {/* Tambahkan button untuk filter "Pengaduan Saya" */}
            <button
              onClick={() => setFilterMy(!filterMy)}
              className={`px-3 py-1 rounded-md transition-all duration-300 ${filterMy ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {filterMy ? 'Semua Pengaduan' : 'Pengaduan Saya'}
            </button>

            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1 rounded-md transition-all duration-300 ${sortBy === 'date' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Terbaru
            </button>
          </div>
        </div>

        {/* Advanced Filters with animation */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-24 opacity-100 mt-4 pt-4 border-t border-gray-200' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md transition-all duration-300 ${filterType === 'all' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1 rounded-md transition-all duration-300 ${filterType === 'pending' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Menunggu
            </button>
            <button
              onClick={() => setFilterType('in_progress')}
              className={`px-3 py-1 rounded-md transition-all duration-300 ${filterType === 'in_progress' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Diproses
            </button>
            <button
              onClick={() => setFilterType('resolved')}
              className={`px-3 py-1 rounded-md transition-all duration-300 ${filterType === 'resolved' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Selesai
            </button>
            <button
              onClick={() => setFilterType('rejected')}
              className={`px-3 py-1 rounded-md transition-all duration-300 ${filterType === 'rejected' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Ditolak
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Perbarui Status Pengaduan</h2>

            <div className="mb-4">
              <p className="font-medium mb-2">Pilih Status:</p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="status" value="in_progress" className="mr-2" defaultChecked />
                  <span className="text-blue-600">Sedang Diproses</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="status" value="resolved" className="mr-2" />
                  <span className="text-green-600">Selesai</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="status" value="rejected" className="mr-2" />
                  <span className="text-red-600">Ditolak</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Komentar (Opsional):</label>
              <textarea
                value={statusUpdateComment}
                onChange={(e) => setStatusUpdateComment(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 h-24"
                placeholder="Berikan komentar tentang perubahan status ini..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={submitStatusUpdate}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaints List with enhanced card styling */}
      {!loading && (
        <div className="space-y-6">
          {complaints.map(complaint => (
            <div
              key={complaint.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Complaint Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={complaint.user?.avatar || '/default-avatar.png'}
                        alt={complaint.user?.name || 'User'}
                        className="w-10 h-10 rounded-full mr-3 border-2 border-primary"
                      />
                      <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{complaint.reporter_name || 'Anda'}</h3>
                      <div className="flex flex-wrap items-center text-sm text-gray-500">
                        <div className="flex items-center mr-2">
                          <MapPin className="mr-1 text-gray-400 w-4 h-4" />
                          <span>{complaint.location || '-'}</span>
                        </div>
                        <span className="mx-1 hidden md:inline">•</span>
                        <div className="flex items-center">
                          <Calendar className="mr-1 text-gray-400 w-4 h-4" />
                          <span>{complaint.formatted_date || new Date(complaint.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span
                      className={`px-2 py-1 rounded-full inline-flex items-center ${getStatusClass(complaint.status)}`}
                    >
                      <span className={`mr-1 h-2 w-2 rounded-full ${getStatusIndicatorClass(complaint.status)}`}></span>
                      {formatStatus(complaint.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complaint Content */}
              <Link
                to={`/complaints/${complaint.id}`}
                className="block"
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <span className="mr-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                      {complaint.category || 'Umum'}
                    </span>
                    <h2 className="text-xl font-bold mb-2">{complaint.title || 'Pengaduan'}</h2>
                  </div>
                  <p className="text-gray-700">
                    {complaint.description?.length > 150
                      ? `${complaint.description.substring(0, 150)}...`
                      : complaint.description || 'Tidak ada deskripsi'}
                  </p>
                </div>

                {/* Complaint Image with hover effect */}
                {/* {complaint.photo_url && (
                  <div className="w-full overflow-hidden">
                    <img
                      src={complaint.photo_url}
                      alt={complaint.title || 'Gambar pengaduan'}
                      className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/default-image.png';
                      }}
                    />
                  </div>
                )} */}
              </Link>

              {/* Complaint Footer with enhanced interactive elements */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <div className="flex space-x-6">
                    {/* Vote count */}
                    <div className="flex items-center text-gray-700 group">
                      <ThumbsUp className="mr-2 group-hover:text-primary transition-colors duration-300 w-4 h-4" />
                      <span>{complaint.likes_count || 0}</span>
                    </div>


                    {/* Comment Count */}
                    <div className="flex items-center text-gray-700 group">
                      <MessageSquare className="mr-2 group-hover:text-primary transition-colors duration-300 w-4 h-4" />
                      <span>{complaint.response_count || 0}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {/* Status Update Button - Only visible to authorized users */}
                    {canUpdateStatus() && complaint.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusUpdate(complaint.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Perbarui Status
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-3 py-1 rounded-md ${pagination.currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  &laquo; Prev
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded-md ${pagination.currentPage === i + 1
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-3 py-1 rounded-md ${pagination.currentPage === pagination.totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Next &raquo;
                </button>
              </div>
            </div>
          )}

          {/* If no complaints found - with enhanced styling */}
          {complaints.length === 0 && !loading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-dashed border-gray-300">
              <div className="flex flex-col items-center">
                <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 text-lg mb-4">
                  Tidak ada pengaduan yang ditemukan
                </p>
                <button
                  onClick={() => navigate('/createcomplaint')}
                  className="text-primary hover:underline"
                >
                  Buat pengaduan baru sekarang
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes vote-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        .bg-primary {
          background-color: #3b82f6;
        }

        .text-primary {
          color: #3b82f6;
        }

        .border-primary {
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default ComplaintManagement;