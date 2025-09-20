import express from 'express';
import { addSweetController } from '../controllers/addSweet.js';
import { deleteSweetController } from '../controllers/deleteSweet.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', authenticateJWT, requireAdmin, addSweetController); // Only admin
router.delete('/:id', authenticateJWT, requireAdmin, deleteSweetController); // Only admin


export default router;
