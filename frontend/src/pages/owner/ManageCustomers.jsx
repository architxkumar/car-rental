import { useState, useEffect } from 'react';
import { userService } from '../../services';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await userService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewCustomerDetails = async (customerId) => {
    try {
      const data = await userService.getCustomerById(customerId);
      setCustomerDetails(data);
      setSelectedCustomer(customerId);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Customers</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customers List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">All Customers ({customers.length})</h2>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div
                key={customer._id}
                className={`bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition ${
                  selectedCustomer === customer._id ? 'border-2 border-blue-600' : ''
                }`}
                onClick={() => viewCustomerDetails(customer._id)}
              >
                <h3 className="text-lg font-bold">{customer.name}</h3>
                <p className="text-gray-600">{customer.email}</p>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          {customers.length === 0 && (
            <div className="text-center text-gray-500 py-12">No customers found.</div>
          )}
        </div>

        {/* Customer Details */}
        <div>
          {customerDetails ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold mb-2">{customerDetails.customer.name}</h3>
                <p className="text-gray-600">Email: {customerDetails.customer.email}</p>
                <p className="text-gray-600">
                  Phone: {customerDetails.customer.phone || 'N/A'}
                </p>
                <p className="text-gray-600">
                  Member Since:{' '}
                  {new Date(customerDetails.customer.createdAt).toLocaleDateString()}
                </p>
              </div>

              <h3 className="text-xl font-bold mb-4">
                Booking History ({customerDetails.bookings.length})
              </h3>
              <div className="space-y-4">
                {customerDetails.bookings.map((booking) => (
                  <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="font-bold">{booking.car?.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.startDate).toLocaleDateString()} -{' '}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-blue-600 font-bold">
                        ₹{booking.totalAmount}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          booking.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'approved'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
                {customerDetails.bookings.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No booking history available.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 p-12 rounded-lg text-center text-gray-500">
              Select a customer to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCustomers;
