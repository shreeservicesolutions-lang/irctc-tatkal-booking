import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Lock, ArrowRight, Zap } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

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
      toast.error('❌ Passwords do not match');
      return;
    }

    if (formData.phone.length < 10) {
      toast.error('❌ Phone number must be 10 digits');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await window.electron.register(userData);

      if (result.success) {
        toast.success('✅ ' + result.message);
        onRegister(result.token, result.user);
        navigate('/dashboard');
      } else {
        toast.error('❌ ' + result.message);
      }
    } catch (error) {
      toast.error('❌ Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
              <User size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Join IRCTC</h1>
            <p className="text-blue-100 text-sm">Create your account to book trains</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Full Name</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-4 text-blue-300" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-2.5 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-4 text-blue-300" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-2.5 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Phone</label>
              <div className="relative">
                <Phone size={20} className="absolute left-4 top-4 text-blue-300" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-2.5 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-4 text-blue-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-2.5 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm">Confirm Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-4 text-blue-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-12 py-2.5 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-blue-300"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg hover:shadow-2xl hover:from-green-600 hover:to-emerald-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? 'Creating Account...' : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-center text-blue-100 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-300 font-bold hover:text-blue-100 transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
