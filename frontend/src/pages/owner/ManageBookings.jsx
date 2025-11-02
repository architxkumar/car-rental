import { useState, useEffect } from 'react';
import { bookingService } from '../../services';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>

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
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-md ${
            filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Pending ({bookings.filter((b) => b.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-md ${
            filter === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Approved ({bookings.filter((b) => b.status === 'approved').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{booking.car?.name}</h3>
                <p className="text-gray-600">Customer: {booking.customer?.name}</p>
                <p className="text-gray-600">Email: {booking.customer?.email}</p>
                <p className="text-gray-600">Phone: {booking.customer?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">
                  Start Date: {new Date(booking.startDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  End Date: {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Total Days: {booking.totalDays}</p>
                <p className="text-xl font-bold text-blue-600">
                  Total: ₹{booking.totalAmount}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className={`px-3 py-1 rounded ${getStatusColor(booking.status)}`}>
                {booking.status.toUpperCase()}
              </span>
              {booking.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'approved')}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
              {booking.status === 'approved' && (
                <button
                  onClick={() => handleStatusUpdate(booking._id, 'completed')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Mark as Completed
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

export default ManageBookings;
