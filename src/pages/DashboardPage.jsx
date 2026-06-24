import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, BookOpen, BarChart3, ArrowRight } from 'lucide-react';

function DashboardPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search size={48} />,
      title: 'Search Trains',
      description: 'Find trains between any stations',
      action: () => navigate('/search'),
      color: 'from-blue-500 to-cyan-500',
      badge: '🔍'
    },
    {
      icon: <Clock size={48} />,
      title: 'Tatkal Booking',
      description: 'Auto-book tickets at Tatkal time',
      action: () => navigate('/search'),
      color: 'from-orange-500 to-red-500',
      badge: '⚡'
    },
    {
      icon: <BookOpen size={48} />,
      title: 'My Bookings',
      description: 'View all your train bookings',
      action: () => navigate('/booking-history'),
      color: 'from-green-500 to-emerald-500',
      badge: '📋'
    },
    {
      icon: <BarChart3 size={48} />,
      title: 'Statistics',
      description: 'Track your booking history',
      action: () => navigate('/booking-history'),
      color: 'from-purple-500 to-pink-500',
      badge: '📊'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">🚂 Welcome Back!</h1>
          <p className="text-xl text-blue-200">Ready to book your next train journey?</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={feature.action}
              className="group cursor-pointer relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"`}></div>
              <div className="relative bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/30 transition duration-300 h-full">
                <div className="absolute top-4 right-4 text-3xl">{feature.badge}</div>
                <div className={`inline-block p-3 bg-gradient-to-br ${feature.color} rounded-xl text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition">
                  <span className="text-sm font-semibold">Explore</span>
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tatkal Info */}
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold text-orange-300 mb-4">⏰ Tatkal Timings</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <span className="text-2xl">🎫</span>
                <div>
                  <p className="text-white font-semibold">AC Classes</p>
                  <p className="text-orange-200 text-sm">Available at 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <span className="text-2xl">🛏️</span>
                <div>
                  <p className="text-white font-semibold">Non-AC Classes</p>
                  <p className="text-orange-200 text-sm">Available at 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-white font-semibold">Quota</p>
                  <p className="text-orange-200 text-sm">Limited seats available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Info */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold text-blue-300 mb-4">✨ Why Choose Us?</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <p className="text-blue-100"><strong>Secure:</strong> Bank-level encryption</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <p className="text-blue-100"><strong>Fast:</strong> Lightning quick bookings</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <p className="text-blue-100"><strong>Smart:</strong> Auto-booking features</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <p className="text-blue-100"><strong>Affordable:</strong> Best prices guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
