import { useState, useEffect } from 'react';
import { bookingService } from '../../services';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(id);
        fetchBookings();
        alert('Booking cancelled successfully');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'approved'].includes(booking.status);
    if (filter === 'past') return ['completed', 'cancelled', 'rejected'].includes(booking.status);
    return true;
  });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-md ${
            filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Active ({bookings.filter((b) => ['pending', 'approved'].includes(b.status)).length})
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-md ${
            filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Past (
          {
            bookings.filter((b) =>
              ['completed', 'cancelled', 'rejected'].includes(b.status)
            ).length
          }
          )
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <img
                  src={booking.car?.image}
                  alt={booking.car?.name}
                  className="w-32 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="text-xl font-bold">{booking.car?.name}</h3>
                  <p className="text-gray-600">{booking.car?.brand}</p>
                  <p className="text-sm text-gray-500">
                    Booking ID: {booking._id.slice(-8)}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded ${getStatusColor(booking.status)}`}>
                {booking.status.toUpperCase()}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-semibold">
                  {new Date(booking.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-semibold">
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-semibold text-blue-600 text-xl">
                  ₹{booking.totalAmount}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Booked on: {new Date(booking.createdAt).toLocaleDateString()}
              </p>
              {['pending', 'approved'].includes(booking.status) && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No bookings found with the selected filter.
        </div>
      )}
    </div>
  );
};

export default MyBookings;
