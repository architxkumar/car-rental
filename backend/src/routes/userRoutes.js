import express from 'express';
import { getCustomers, getCustomerById } from '../controllers/userController.js';
import { protect, ownerOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/customers', protect, ownerOnly, getCustomers);
router.get('/customers/:id', protect, ownerOnly, getCustomerById);

export default router;
