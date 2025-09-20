import express from 'express';
import { addSweetController } from '../controllers/addSweet.js';

import { authenticateJWT, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', authenticateJWT, requireAdmin, addSweetController); // Only admin


export default router;
