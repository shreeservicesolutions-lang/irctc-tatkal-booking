import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Clock, Plus, Trash2 } from 'lucide-react';

function TatkalSetupPage() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'M' }]);
  const [seatClass, setSeatClass] = useState('AC2');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const handleAddPassenger = () => {
    setPassengers([...passengers, { name: '', age: '', gender: 'M' }]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSetupTatkal = async (e) => {
    e.preventDefault();

    if (passengers.some(p => !p.name || !p.age)) {
      toast.error('Please fill all passenger details');
      return;
    }

    setLoading(true);

    try {
      const trainData = {
        userId: user.userId,
        trainId,
        trainName: 'Sample Train',
        from: 'NDLS',
        to: 'CSMT',
        date: new Date().toISOString().split('T')[0],
        seatClass,
        passengers,
        price: 3500
      };

      const result = await window.electron.setupTatkalReminder(trainData);

      if (result.success) {
        toast.success(`✅ Tatkal reminder set for ${result.tatkalTime}!`);
        toast.info('Your booking will be attempted automatically at the scheduled time');
        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Setup failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Clock size={32} className="text-orange-600" />
          Tatkal Auto-Booking Setup
        </h1>
        <p className="text-gray-600 mb-6">Set up automatic Tatkal booking for maximum success</p>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>⏰ Tatkal Timings:</strong> AC: 10:00 AM | Non-AC: 11:00 AM
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSetupTatkal} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Seat Class</label>
              <select
                value={seatClass}
                onChange={(e) => setSeatClass(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
              >
                <option value="AC1">AC First Class</option>
                <option value="AC2">AC Second Class</option>
                <option value="AC3">AC Third Class</option>
                <option value="SL">Sleeper</option>
                <option value="CC">Chair Car</option>
              </select>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4">Passenger Details</h2>

            {passengers.map((passenger, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Passenger {index + 1}</h3>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 outline-none"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    min="0"
                    max="120"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 outline-none"
                    required
                  />
                  <select
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 outline-none"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddPassenger}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              <Plus size={20} />
              Add Another Passenger
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-700">
                ✅ Your booking request will be submitted automatically at the Tatkal opening time
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-400 text-white font-semibold py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 text-white font-semibold py-2 rounded hover:bg-orange-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Clock size={20} />
                {loading ? 'Setting up...' : 'Setup Tatkal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TatkalSetupPage;
