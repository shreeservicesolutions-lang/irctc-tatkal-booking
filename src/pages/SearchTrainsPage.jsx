import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapPin, Calendar, Users, Zap } from 'lucide-react';

function SearchTrainsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: 'NDLS',
    to: 'CSMT',
    date: new Date().toISOString().split('T')[0],
    class: 'AC2'
  });
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const trainClasses = ['AC1', 'AC2', 'AC3', 'SL', 'CC'];
  const stations = ['NDLS', 'CSMT', 'AGRA', 'JAIPUR', 'BANGALORE', 'HYDERABAD'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const result = await window.electron.searchTrains(formData);

      if (result.success) {
        setTrains(result.trains);
        if (result.trains.length === 0) {
          toast.info('No trains found for your search');
        } else {
          toast.success(`Found ${result.trains.length} trains`);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🔍 Search Trains</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">From</label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                <MapPin size={18} className="text-blue-600" />
                <select
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  className="flex-1 ml-2 outline-none"
                >
                  {stations.map(station => (
                    <option key={station} value={station}>{station}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">To</label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                <MapPin size={18} className="text-blue-600" />
                <select
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  className="flex-1 ml-2 outline-none"
                >
                  {stations.map(station => (
                    <option key={station} value={station}>{station}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date</label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                <Calendar size={18} className="text-blue-600" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="flex-1 ml-2 outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Class</label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                <Users size={18} className="text-blue-600" />
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="flex-1 ml-2 outline-none"
                >
                  {trainClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {searched && (
          <div className="space-y-4">
            {trains.length > 0 ? (
              trains.map(train => (
                <div key={train.trainId} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Train</p>
                      <p className="font-semibold text-lg">{train.trainId}</p>
                      <p className="text-gray-700">{train.trainName}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Route</p>
                      <p className="font-semibold">{train.fromStation} → {train.toStation}</p>
                      <p className="text-gray-600">{train.distance} km</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Time</p>
                      <p className="font-semibold">{train.departureTime} - {train.arrivalTime}</p>
                      <p className="text-gray-600">{train.duration}</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Availability</p>
                      <p className="font-semibold text-green-600">{train.selectedClassSeats} seats</p>
                      <p className="text-gray-600">₹{train.selectedClassPrice}</p>
                    </div>

                    <div className="flex gap-2 items-end">
                      <button
                        onClick={() => navigate(`/booking/${train.trainId}`)}
                        className="flex-1 bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
                      >
                        Book Now
                      </button>
                      <button
                        onClick={() => navigate(`/tatkal-setup/${train.trainId}`)}
                        className="flex-1 bg-orange-600 text-white font-semibold py-2 rounded hover:bg-orange-700 transition flex items-center justify-center gap-2"
                      >
                        <Zap size={18} />
                        Tatkal
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-gray-700">No trains found. Try different search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchTrainsPage;
