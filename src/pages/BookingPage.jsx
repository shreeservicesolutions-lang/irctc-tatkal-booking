import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';

function BookingPage() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'M' }]);
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

  const handleBooking = async (e) => {
    e.preventDefault();

    if (passengers.some(p => !p.name || !p.age)) {
      toast.error('Please fill all passenger details');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        userId: user.userId,
        trainId,
        trainName: 'Sample Train',
        date: new Date().toISOString().split('T')[0],
        passengers,
        seatClass: 'AC2',
        price: 3500,
        from: 'NDLS',
        to: 'CSMT'
      };

      const result = await window.electron.bookTicket(bookingData);

      if (result.success) {
        toast.success('Booking created! PNR: ' + result.pnr);
        const paymentResult = await window.electron.initiatePayment({
          bookingId: result.bookingId,
          userId: user.userId,
          amount: 3500
        });

        if (paymentResult.success) {
          toast.info('Proceed to payment');
          setTimeout(() => navigate('/booking-history'), 2000);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Booking failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Book Your Ticket</h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>

          <form onSubmit={handleBooking} className="space-y-4">
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

            <div className="border-t pt-4 mt-6">
              <p className="text-gray-700 mb-4">
                <strong>Total Price:</strong> ₹{3500 * passengers.length}
              </p>

              <div className="flex gap-3">
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
                  className="flex-1 bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
