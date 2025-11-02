# Car Rental Management System

A complete full-stack web application for managing a car rental business with separate dashboards for owners and customers.

## 🚀 Features

### Owner Dashboard
- ✅ Secure login for owners
- ✅ Complete car management (Add, Edit, Delete)
- ✅ View all available and booked cars
- ✅ Booking management (Approve/Reject requests)
- ✅ Revenue statistics with interactive charts
- ✅ Customer management with booking history

### Customer Dashboard
- ✅ User registration and login
- ✅ Browse cars with advanced filters (Brand, Price, Transmission, Availability)
- ✅ Detailed car information view
- ✅ Car rental booking with date selection
- ✅ Mock payment checkout system
- ✅ View booking history and active rentals
- ✅ Cancel bookings

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd car-rental
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://localhost:27017/car-rental
# JWT_SECRET=your-secret-key

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with backend API URL (default is already set)
# VITE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your-secret-key-change-this-in-production
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🗄️ Database Models

### User
- name, email, password (hashed)
- role (customer/owner)
- phone, createdAt

### Car
- name, brand, model, year
- pricePerDay, available
- image, transmission, fuelType
- seats, color, mileage, features

### Booking
- car (ref), customer (ref)
- startDate, endDate, totalDays
- totalAmount, status
- paymentStatus, paymentMethod

## 👥 Default Users

You can register new users through the registration page. To create an owner account, select "Owner" in the role dropdown during registration.

## 🎯 Usage

1. **Register** as a customer or owner
2. **Login** with your credentials
3. **Owners** can:
   - Add new cars to the inventory
   - Manage bookings and approve/reject requests
   - View revenue statistics
   - Manage customer information
4. **Customers** can:
   - Browse available cars
   - Filter cars by brand, price, transmission
   - Book cars for specific dates
   - View and manage their bookings

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create car (Owner only)
- `PUT /api/cars/:id` - Update car (Owner only)
- `DELETE /api/cars/:id` - Delete car (Owner only)
- `GET /api/cars/brands/list` - Get all brands

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get all bookings (Owner only)
- `GET /api/bookings/my-bookings` - Get user's bookings (Protected)
- `PUT /api/bookings/:id/status` - Update booking status (Owner only)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Protected)
- `GET /api/bookings/stats` - Get booking statistics (Owner only)

### Users
- `GET /api/users/customers` - Get all customers (Owner only)
- `GET /api/users/customers/:id` - Get customer details (Owner only)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas for production database
2. Deploy to platforms like Heroku, Railway, or Render
3. Set environment variables in production

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Update `VITE_API_URL` to point to production backend

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For any queries, please reach out to the project maintainers.