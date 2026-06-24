import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Search, History } from 'lucide-react';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-bold">
            🚂 IRCTC Tatkal
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-1 hover:text-blue-200">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link to="/search" className="flex items-center gap-1 hover:text-blue-200">
              <Search size={20} />
              <span>Search</span>
            </Link>
            <Link to="/booking-history" className="flex items-center gap-1 hover:text-blue-200">
              <History size={20} />
              <span>History</span>
            </Link>

            <div className="border-l border-blue-400 pl-6">
              <span className="text-sm">Welcome, {user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 mt-1 bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                <LogOut size={16} />
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
