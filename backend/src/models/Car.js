import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Car+Image'
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual'],
    default: 'Manual'
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    default: 'Petrol'
  },
  seats: {
    type: Number,
    default: 5
  },
  color: {
    type: String,
    trim: true
  },
  mileage: {
    type: String
  },
  features: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Car = mongoose.model('Car', carSchema);

export default Car;
