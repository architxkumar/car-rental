import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import ManageCustomers from './pages/owner/ManageCustomers';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BrowseCars from './pages/customer/BrowseCars';
import CarDetails from './pages/customer/CarDetails';
import MyBookings from './pages/customer/MyBookings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Owner Routes */}
            <Route
              path="/owner/dashboard"
              element={
                <PrivateRoute ownerOnly={true}>
                  <OwnerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/owner/cars"
              element={
                <PrivateRoute ownerOnly={true}>
                  <ManageCars />
                </PrivateRoute>
              }
            />
            <Route
              path="/owner/bookings"
              element={
                <PrivateRoute ownerOnly={true}>
                  <ManageBookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/owner/customers"
              element={
                <PrivateRoute ownerOnly={true}>
                  <ManageCustomers />
                </PrivateRoute>
              }
            />
            
            {/* Customer Routes */}
            <Route
              path="/customer/dashboard"
              element={
                <PrivateRoute>
                  <CustomerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/browse"
              element={
                <PrivateRoute>
                  <BrowseCars />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/car/:id"
              element={
                <PrivateRoute>
                  <CarDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/bookings"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
