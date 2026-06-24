import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await window.electron.login(formData);

      if (result.success) {
        toast.success(result.message);
        onLogin(result.token, result.user);
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-96">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">🚂 IRCTC Tatkal</h1>
        <p className="text-center text-gray-600 mb-6">Railway Ticket Booking Software</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="flex-1 ml-2 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="flex-1 ml-2 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
