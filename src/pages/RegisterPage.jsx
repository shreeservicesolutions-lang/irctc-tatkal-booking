import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Lock } from 'lucide-react';

function RegisterPage({ onRegister }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await window.electron.register(userData);

      if (result.success) {
        toast.success(result.message);
        onRegister(result.token, result.user);
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-96">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">🚂 Register</h1>
        <p className="text-center text-gray-600 mb-6">Create your IRCTC Tatkal account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="flex-1 ml-2 outline-none"
              />
            </div>
          </div>

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
            <label className="block text-gray-700 font-semibold mb-2">Phone</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <Phone size={18} className="text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
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

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
