import express from 'express';
import { addSweetController } from '../controllers/addSweet.js';
import { deleteSweetController } from '../controllers/deleteSweet.js';
import { viewSweetController } from '../controllers/viewSweet.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';
import { updateSweetController } from '../controllers/updateSweet.js';

const router = express.Router();



// Protected routes
router.get('/', authenticateJWT,viewSweetController);
router.post('/', authenticateJWT, requireAdmin, addSweetController); // Only admin
router.delete('/:id', authenticateJWT, requireAdmin, deleteSweetController); // Only admin
router.put('/:id', authenticateJWT, requireAdmin, updateSweetController); // Only admin


export default router;
