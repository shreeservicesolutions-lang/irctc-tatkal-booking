import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Download, Trash2, MapPin, Users, Calendar, Ticket } from 'lucide-react';

function BookingHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      const result = await window.electron.getBookingHistory();

      if (result.success) {
        setBookings(result.bookings);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch bookings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const result = await window.electron.cancelBooking(bookingId);

        if (result.success) {
          toast.success(result.message);
          fetchBookingHistory();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Cancellation failed: ' + error.message);
      }
    }
  };

  const handleDownloadTicket = (booking) => {
    toast.info('E-ticket will be downloaded shortly');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 Booking History</h1>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <Ticket size={16} /> PNR
                    </p>
                    <p className="font-bold text-lg">{booking.pnr}</p>
                    <p className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-2 ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <MapPin size={16} /> Route
                    </p>
                    <p className="font-semibold">{booking.trainName}</p>
                    <p className="text-gray-700">{booking.from_station} → {booking.to_station}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <Calendar size={16} /> Date
                    </p>
                    <p className="font-semibold">{new Date(booking.journeyDate).toLocaleDateString()}</p>
                    <p className="text-gray-700">Class: {booking.seatClass}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <Users size={16} /> Passengers
                    </p>
                    <p className="font-semibold">{booking.passengers?.length || 0} person(s)</p>
                    <p className="text-gray-700">₹{booking.totalPrice}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleDownloadTicket(booking)}
                      className="flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm"
                    >
                      <Download size={16} />
                      E-Ticket
                    </button>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
                      >
                        <Trash2 size={16} />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No bookings found</p>
            <p className="text-gray-500">Start by searching and booking a train</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingHistoryPage;
