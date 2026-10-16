import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/posts/:postId/comments', protect, async (req, res, next) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({ message: 'El comentario es obligatorio' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'La publicación no existe' });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name email');
    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
});

router.put('/comments/:id', protect, async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar este comentario' });
    }

    comment.content = content || comment.content;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate('author', 'name email');
    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
});

router.delete('/comments/:id', protect, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    next(error);
  }
});

export default router;
