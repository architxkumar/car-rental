import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carService, bookingService } from '../../services';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, carsData] = await Promise.all([
        bookingService.getBookingStats(),
        carService.getCars(),
      ]);
      setStats(statsData);
      setCars(carsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const chartData = stats?.monthlyRevenue?.map((item) => ({
    name: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
    bookings: item.count,
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-800">Total Cars</h3>
          <p className="text-3xl font-bold text-blue-600">{cars.length}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-800">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">₹{stats?.totalRevenue || 0}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-yellow-800">Pending Bookings</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats?.pendingBookings || 0}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-purple-800">Total Bookings</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalBookings || 0}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Revenue Overview (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (₹)" />
              <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/owner/cars"
          className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 text-center"
        >
          <h3 className="text-xl font-bold mb-2">Manage Cars</h3>
          <p>Add, edit or delete cars</p>
        </Link>
        <Link
          to="/owner/bookings"
          className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 text-center"
        >
          <h3 className="text-xl font-bold mb-2">Manage Bookings</h3>
          <p>View and manage all bookings</p>
        </Link>
        <Link
          to="/owner/customers"
          className="bg-purple-600 text-white p-6 rounded-lg shadow hover:bg-purple-700 text-center"
        >
          <h3 className="text-xl font-bold mb-2">View Customers</h3>
          <p>See customer profiles and history</p>
        </Link>
      </div>
    </div>
  );
};

export default OwnerDashboard;
