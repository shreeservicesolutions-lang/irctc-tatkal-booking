import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, BookOpen, CreditCard } from 'lucide-react';

function DashboardPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search size={40} />,
      title: 'Search Trains',
      description: 'Find trains between stations',
      action: () => navigate('/search'),
      color: 'blue'
    },
    {
      icon: <Clock size={40} />,
      title: 'Tatkal Booking',
      description: 'Auto-book Tatkal tickets',
      action: () => navigate('/search'),
      color: 'orange'
    },
    {
      icon: <BookOpen size={40} />,
      title: 'Booking History',
      description: 'View your bookings',
      action: () => navigate('/booking-history'),
      color: 'green'
    },
    {
      icon: <CreditCard size={40} />,
      title: 'My Wallet',
      description: 'Manage payment methods',
      action: () => null,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome! 🚂</h1>
        <p className="text-gray-600 mb-8">Start booking your railway tickets instantly</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={feature.action}
              className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105 border-t-4 border-${feature.color}-500`}
            >
              <div className={`text-${feature.color}-600 mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">💡 About Tatkal Booking</h2>
          <ul className="space-y-2">
            <li>• <strong>AC Classes:</strong> Available at 10:00 AM</li>
            <li>• <strong>Non-AC Classes:</strong> Available at 11:00 AM</li>
            <li>• <strong>Quota:</strong> Limited to next day bookings</li>
            <li>• <strong>Auto-Booking:</strong> Set reminders and book automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
