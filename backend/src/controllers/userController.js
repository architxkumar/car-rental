import User from '../models/User.js';

// @desc    Get all customers
// @route   GET /api/users/customers
// @access  Private/Owner
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer with booking history
// @route   GET /api/users/customers/:id
// @access  Private/Owner
export const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get customer's bookings
    const Booking = (await import('../models/Booking.js')).default;
    const bookings = await Booking.find({ customer: req.params.id })
      .populate('car')
      .sort({ createdAt: -1 });

    res.json({
      customer,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
