import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const activeBookings = bookings.filter((b) =>
    ['pending', 'approved'].includes(b.status)
  );
  const pastBookings = bookings.filter((b) =>
    ['completed', 'cancelled', 'rejected'].includes(b.status)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/customer/browse"
          className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700"
        >
          <h3 className="text-xl font-bold mb-2">Browse Cars</h3>
          <p>Find and rent your perfect car</p>
        </Link>
        <Link
          to="/customer/bookings"
          className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700"
        >
          <h3 className="text-xl font-bold mb-2">My Bookings</h3>
          <p>View all your bookings</p>
        </Link>
      </div>

      {/* Active Bookings */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Bookings ({activeBookings.length})</h2>
        {activeBookings.length > 0 ? (
          <div className="grid gap-4">
            {activeBookings.slice(0, 3).map((booking) => (
              <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{booking.car?.name}</h3>
                    <p className="text-gray-600">
                      {new Date(booking.startDate).toLocaleDateString()} -{' '}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-blue-600 font-bold">₹{booking.totalAmount}</p>
                  </div>
                  <span className={`px-3 py-1 rounded ${getStatusColor(booking.status)}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
            No active bookings. Browse cars to make a reservation!
          </div>
        )}
      </div>

      {/* Booking Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-800">Total Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-800">Completed</h3>
          <p className="text-3xl font-bold text-green-600">
            {bookings.filter((b) => b.status === 'completed').length}
          </p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-yellow-800">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === 'pending').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
