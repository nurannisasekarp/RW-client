import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Sistem Kas RW</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <p className="text-gray-600">Selamat datang di sistem manajemen kas RW</p>
      </main>
    </div>
  );
};

export default Dashboard;