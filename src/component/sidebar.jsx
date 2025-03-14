import React, { useState } from 'react';
import { Grid, DollarSign, Crown, CreditCard, Repeat, User, Users, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // Full sidebar
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <Grid className="w-5 h-5" />, route: '/dashboard' },
    { name: 'Tentang Kami', icon: <Users className="w-5 h-5" />, route: '/tentangKami' },
    { name: 'Iuran Warga', icon: <DollarSign className="w-5 h-5" />, route: '/iuran-warga' },
    { name: 'Account Tier', icon: <Crown className="w-5 h-5" />, route: '/account-tier' },
    { name: 'Virtual Card', icon: <CreditCard className="w-5 h-5" />, route: '/virtual-card' },
    { name: 'Transactions', icon: <Repeat className="w-5 h-5" />, route: '/transactions' },
    { name: 'Profile Settings', icon: <User className="w-5 h-5" />, route: '/profile-settings' },
  ];

  const handleMenuClick = (item) => {
    setActiveItem(item.name); // Set item sebagai aktif
    navigate(item.route);
  };

  const handleLogout = () => {
    navigate('/login'); // Arahkan pengguna ke halaman login atau halaman lain setelah logout
  };

  return (
    <div className="h-screen bg-white shadow-md flex flex-col sticky top-0">
      {/* Sidebar */}
      <div className={`bg-white shadow-md flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} overflow-y-auto h-full`}>
        <div className="flex items-center justify-between p-4">
          {isOpen && (
            <div className="flex justify-center flex-1">
              <img
                src="/logo-rw.jpg"
                alt="Logo RW"
                className="w-16 h-16 object-contain rounded-full"
              />
            </div>
          )}
          <div className={`text-gray-600 cursor-pointer ${isOpen ? '' : 'ml-auto'}`}>
            <Menu
              className="w-6 h-6"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all cursor-pointer ${
                activeItem === item.name ? 'bg-purple-100 text-purple-600 font-semibold' : ''
              }`}
              onClick={() => handleMenuClick(item)}
            >
              <div className="flex justify-center w-12">
                {item.icon}
              </div>
              {isOpen && <span>{item.name}</span>}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto p-4">
          <div
            className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-all"
            onClick={handleLogout}
          >
            <div className="flex justify-center w-12">
              <LogOut className="w-5 h-5" />
            </div>
            {isOpen && <span>Logout</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
