import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to CarRental
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your trusted partner for car rentals
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
            <p className="text-gray-600">
              Choose from a variety of cars to suit your needs
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Best Prices</h3>
            <p className="text-gray-600">
              Competitive rates with no hidden charges
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
            <p className="text-gray-600">
              Simple and fast booking process online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
