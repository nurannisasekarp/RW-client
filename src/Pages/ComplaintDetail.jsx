import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { MapPin, Calendar, ThumbsUp, ThumbsDown, MessageSquare, ArrowLeft, Send, Eye } from 'lucide-react';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token']);
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);

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

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (!cookies.access_token) {
      navigate('/login');
      return;
    }

    fetchComplaintDetails();
    fetchUserProfile();
  }, [id, cookies.access_token, navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/profile/getProfile');
      setUserProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/complaints/${id}`);
      setComplaint(response.data);
      setUserVote(response.data.userVote);
      fetchComments();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await api.get(`/api/complaints/${id}/comments`);
      setComments(response.data || []);
    } catch (err) {
      handleError(err);
    } finally {
      setCommentsLoading(false);
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

  const submitComment = async () => {
    if (!commentText.trim()) return;

    try {
      setCommentSubmitting(true);
      await api.post(`/api/complaints/${id}/comments`, { content: commentText });
      setCommentText('');
      fetchComments();
      fetchComplaintDetails();
      setShowCommentModal(false);
    } catch (err) {
      handleError(err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleVote = async (voteType) => {
    try {
      const response = await api.post(`/api/complaints/${id}/vote`, { voteType });
      setComplaint((prev) => ({
        ...prev,
        upvotes: response.data.upvotes,
        downvotes: response.data.downvotes,
      }));
      setUserVote(response.data.userVote);
    } catch (err) {
      handleError(err);
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'in_progress': return 'Diproses';
      case 'resolved': return 'Selesai';
      case 'rejected': return 'Ditolak';
      default: return 'Tidak diketahui';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/complaint')}
        className="flex items-center text-gray-600 mb-6 hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2" />
        Kembali ke Daftar Pengaduan
      </button>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md shadow-sm">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        complaint && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              {/* Complaint Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                      {complaint.category || 'Umum'}
                    </span>
                    <span className={`px-2 py-1 rounded-full inline-flex items-center ${getStatusClass(complaint.status)}`}>
                      <span className={`mr-1 h-2 w-2 rounded-full ${
                        complaint.status === 'pending' ? 'bg-yellow-500' :
                        complaint.status === 'in_progress' ? 'bg-blue-500' :
                        complaint.status === 'resolved' ? 'bg-green-500' :
                        complaint.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      {formatStatus(complaint.status)}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold mb-4">{complaint.title}</h1>
                  <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center mr-4 mb-2">
                      <MapPin className="mr-1 w-4 h-4" />
                      {complaint.location || '-'}
                    </div>
                    <div className="flex items-center mr-4 mb-2">
                      <Calendar className="mr-1 w-4 h-4" />
                      {formatDate(complaint.created_at)}
                    </div>
                    <div className="flex items-center mb-2">
                      <Eye className="mr-1 w-4 h-4" />
                      {complaint.view_count || 0} dilihat
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={complaint.user?.avatar || '/default-avatar.png'}
                      alt={complaint.user?.name || 'User'}
                      className="w-12 h-12 rounded-full mr-3 border-2 border-primary"
                    />
                    <div>
                      <h3 className="font-semibold">{complaint.reporter_name || 'Anonim'}</h3>
                      <p className="text-gray-500 text-sm">Pelapor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-line mb-6">{complaint.description}</p>
              {complaint.photo_url && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Foto Pendukung:</h3>
                  <img src={complaint.photo_url} alt={complaint.title || 'Foto'} className="w-full object-cover rounded-md border" />
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <div className="flex space-x-6">
                <button onClick={() => handleVote('upvote')} className={`flex items-center group ${userVote === 'upvote' ? 'text-green-600' : 'text-gray-700'}`}>
                  <ThumbsUp className="mr-2" />
                  <span>{complaint.upvotes || 0} Mendukung</span>
                </button>
                <button onClick={() => handleVote('downvote')} className={`flex items-center group ${userVote === 'downvote' ? 'text-red-600' : 'text-gray-700'}`}>
                  <ThumbsDown className="mr-2" />
                  <span>{complaint.downvotes || 0} Tidak Mendukung</span>
                </button>
              </div>
              <button
                onClick={() => setShowCommentModal(true)}
                className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <MessageSquare className="mr-2" /> Tambah Komentar
              </button>
            </div>

            {/* COMMENTS SECTION */}
            <div className="px-6 py-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Komentar</h2>
              {commentsLoading ? (
                <div className="text-center text-gray-500">Memuat komentar...</div>
              ) : comments.length > 0 ? (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment.id} className="bg-gray-50 border border-gray-200 rounded-md p-4">
                      <p className="text-gray-800 whitespace-pre-line">{comment.content}</p>
                      <p className="text-sm text-gray-500 mt-2">{comment.user?.name || 'Anonim'} • {formatDate(comment.created_at)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Belum ada komentar.</p>
              )}
            </div>
          </div>
        )
      )}

      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tambahkan Komentar</h2>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 h-32 mb-4"
              placeholder="Tulis komentar Anda..."
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowCommentModal(false)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Batal</button>
              <button
                onClick={submitComment}
                disabled={commentSubmitting || !commentText.trim()}
                className={`px-4 py-2 ${commentSubmitting || !commentText.trim() ? 'bg-gray-400' : 'bg-primary hover:bg-blue-600'} text-white rounded-md flex items-center`}
              >
                {commentSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
                    Mengirim...
                  </>
                ) : (
                  <>Kirim</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;
