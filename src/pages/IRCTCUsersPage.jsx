import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Eye, EyeOff, Save, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

function IRCTCUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    passengerName: '',
    gender: 'M',
    age: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await window.electron.irctcUser.getAll(currentUser.userId);
      if (result.success) {
        setUsers(result.users);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.fullName || !formData.passengerName || !formData.age) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        const result = await window.electron.irctcUser.update({
          id: editingId,
          ...formData
        });
        if (result.success) {
          toast.success('User updated successfully');
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await window.electron.irctcUser.add({
          userId: currentUser.userId,
          ...formData
        });
        if (result.success) {
          toast.success('User added successfully');
        } else {
          toast.error(result.message);
        }
      }

      setFormData({
        username: '',
        password: '',
        fullName: '',
        passengerName: '',
        gender: 'M',
        age: ''
      });
      setShowForm(false);
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await window.electron.irctcUser.delete(id);
        if (result.success) {
          toast.success('User deleted successfully');
          fetchUsers();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Error: ' + error.message);
      }
    }
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      password: '',
      fullName: user.fullName,
      passengerName: user.passengerName,
      gender: user.gender || 'M',
      age: user.age || ''
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <p className="text-gray-600">Loading IRCTC Users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔐 IRCTC User Management</h1>
          <p className="text-blue-200">Manage your IRCTC account credentials for auto-booking</p>
        </div>

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add New IRCTC User
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? '✏️ Edit User' : '➕ Add New User'}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">IRCTC Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your IRCTC login ID"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">IRCTC Password</label>
                <div className="relative">
                  <input
                    type={showPasswords[editingId || 'new'] ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your IRCTC password"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({
                      ...prev,
                      [editingId || 'new']: !prev[editingId || 'new']
                    }))}
                    className="absolute right-3 top-2.5 text-blue-300"
                  >
                    {showPasswords[editingId || 'new'] ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Passenger Name (as per ID)</label>
                <input
                  type="text"
                  name="passengerName"
                  value={formData.passengerName}
                  onChange={handleChange}
                  placeholder="Name on your ticket"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  min="0"
                  max="120"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingId ? 'Update User' : 'Add User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      username: '',
                      password: '',
                      fullName: '',
                      passengerName: '',
                      gender: 'M',
                      age: ''
                    });
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <div
                key={user.id}
                className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/30 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{user.fullName}</h3>
                      <p className="text-blue-200 text-sm">@{user.username}</p>
                    </div>
                  </div>
                  <Lock size={20} className="text-blue-400" />
                </div>

                <div className="space-y-2 mb-6 pb-6 border-b border-white/10">
                  <p className="text-gray-300 text-sm">
                    <strong>Passenger:</strong> {user.passengerName}
                  </p>
                  <p className="text-gray-300 text-sm">
                    <strong>Gender:</strong> {user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : 'Other'}
                  </p>
                  <p className="text-gray-300 text-sm">
                    <strong>Age:</strong> {user.age}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-1"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
            <Lock size={48} className="mx-auto text-blue-400 mb-4" />
            <p className="text-gray-300 text-lg">No IRCTC users added yet</p>
            <p className="text-gray-400 text-sm">Add your IRCTC credentials to enable auto-booking</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IRCTCUsersPage;
