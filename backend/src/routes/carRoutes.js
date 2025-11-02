import express from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getBrands
} from '../controllers/carController.js';
import { protect, ownerOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/brands/list', getBrands);
router.route('/')
  .get(getCars)
  .post(protect, ownerOnly, createCar);

router.route('/:id')
  .get(getCarById)
  .put(protect, ownerOnly, updateCar)
  .delete(protect, ownerOnly, deleteCar);

export default router;
