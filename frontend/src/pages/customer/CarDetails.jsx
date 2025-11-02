import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carService, bookingService } from '../../services';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
  });
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchCar();
  }, [id]);

  useEffect(() => {
    calculateTotal();
  }, [bookingData, car]);

  const fetchCar = async () => {
    try {
      const data = await carService.getCarById(id);
      setCar(data);
    } catch (error) {
      console.error('Error fetching car:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (bookingData.startDate && bookingData.endDate && car) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days > 0) {
        setTotalAmount(days * car.pricePerDay);
      } else {
        setTotalAmount(0);
      }
    }
  };

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await bookingService.createBooking({
        carId: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      });
      alert('Booking successful! Redirecting to payment...');
      // Simulate payment
      setTimeout(() => {
        navigate('/customer/bookings');
      }, 1000);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.message || 'Failed to create booking');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Car not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/customer/browse')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Browse
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Car Image and Info */}
        <div>
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
          <div className="mt-6 space-y-4">
            <h1 className="text-4xl font-bold">{car.name}</h1>
            <p className="text-2xl text-gray-600">{car.brand}</p>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-semibold">Transmission:</span> {car.transmission}
              </div>
              <div>
                <span className="font-semibold">Fuel Type:</span> {car.fuelType}
              </div>
              <div>
                <span className="font-semibold">Seats:</span> {car.seats}
              </div>
              {car.color && (
                <div>
                  <span className="font-semibold">Color:</span> {car.color}
                </div>
              )}
              {car.mileage && (
                <div>
                  <span className="font-semibold">Mileage:</span> {car.mileage}
                </div>
              )}
              {car.year && (
                <div>
                  <span className="font-semibold">Year:</span> {car.year}
                </div>
              )}
            </div>
            <div className="text-4xl font-bold text-blue-600">
              ₹{car.pricePerDay}/day
            </div>
            <div>
              <span
                className={`px-4 py-2 rounded text-lg font-semibold ${
                  car.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {car.available ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div>
          {car.available ? (
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Book This Car</h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleBookingChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleBookingChange}
                    required
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                {totalAmount > 0 && (
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span>Price per day:</span>
                      <span className="font-semibold">₹{car.pricePerDay}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Number of days:</span>
                      <span className="font-semibold">
                        {Math.ceil(
                          (new Date(bookingData.endDate) - new Date(bookingData.startDate)) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-xl font-bold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">₹{totalAmount}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold text-lg"
                >
                  Proceed to Payment
                </button>
              </form>

              <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a mock payment system. Your booking will be
                  sent for owner approval.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-xl text-gray-600">
                This car is currently not available for booking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
