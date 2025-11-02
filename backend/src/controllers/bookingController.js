import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    // Check if car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (!car.available) {
      return res.status(400).json({ message: 'Car is not available' });
    }

    // Calculate total days and amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (totalDays <= 0) {
      return res.status(400).json({ message: 'Invalid date range' });
    }

    const totalAmount = totalDays * car.pricePerDay;

    // Create booking
    const booking = await Booking.create({
      car: carId,
      customer: req.user._id,
      startDate,
      endDate,
      totalDays,
      totalAmount
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('car')
      .populate('customer', '-password');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (owner)
// @route   GET /api/bookings
// @access  Private/Owner
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('car')
      .populate('customer', '-password')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Owner
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status;
      
      // If approved, mark car as unavailable
      if (status === 'approved') {
        await Car.findByIdAndUpdate(booking.car, { available: false });
      }
      
      // If cancelled or rejected or completed, mark car as available
      if (['cancelled', 'rejected', 'completed'].includes(status)) {
        await Car.findByIdAndUpdate(booking.car, { available: true });
      }

      const updatedBooking = await booking.save();
      const populatedBooking = await Booking.findById(updatedBooking._id)
        .populate('car')
        .populate('customer', '-password');
      
      res.json(populatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Only allow cancellation if status is pending or approved
    if (!['pending', 'approved'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Make car available again
    await Car.findByIdAndUpdate(booking.car, { available: true });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('car')
      .populate('customer', '-password');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private/Owner
export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    
    const revenueResult = await Booking.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['approved', 'completed'] },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalBookings,
      pendingBookings,
      approvedBookings,
      completedBookings,
      totalRevenue,
      monthlyRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
