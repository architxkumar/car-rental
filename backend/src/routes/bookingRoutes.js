import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} from '../controllers/bookingController.js';
import { protect, ownerOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, ownerOnly, getAllBookings);

router.get('/my-bookings', protect, getMyBookings);
router.get('/stats', protect, ownerOnly, getBookingStats);
router.put('/:id/status', protect, ownerOnly, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
