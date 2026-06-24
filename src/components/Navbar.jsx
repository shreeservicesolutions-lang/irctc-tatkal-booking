import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Search, History, Zap } from 'lucide-react';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2 text-3xl font-bold hover:scale-105 transition">
            <Zap className="text-yellow-300" size={32} />
            <span className="bg-gradient-to-r from-yellow-200 to-yellow-100 text-transparent bg-clip-text">IRCTC Tatkal</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-yellow-300 transition duration-300 group">
              <Home size={22} className="group-hover:rotate-12" />
              <span className="font-semibold">Home</span>
            </Link>
            <Link to="/search" className="flex items-center gap-2 hover:text-yellow-300 transition duration-300 group">
              <Search size={22} className="group-hover:scale-110" />
              <span className="font-semibold">Search</span>
            </Link>
            <Link to="/booking-history" className="flex items-center gap-2 hover:text-yellow-300 transition duration-300 group">
              <History size={22} className="group-hover:animate-pulse" />
              <span className="font-semibold">History</span>
            </Link>

            <div className="border-l-2 border-blue-400 pl-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 text-blue-900 flex items-center justify-center font-bold">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-blue-200">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold transition duration-300 transform hover:scale-105 shadow-lg"
              >
                <LogOut size={18} className="inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
