import express from 'express';
import { createComment, deleteComment, likeComment } from '../controllers/commentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createComment);
router.delete('/:id', authenticate, deleteComment);
router.post('/:id/like', authenticate, likeComment);

export default router;
