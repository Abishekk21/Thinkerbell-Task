import express from 'express';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

// Mount health routes
router.use('/', healthRoutes);

// Add additional routes here as the application grows
// Example:
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);

export default router;
