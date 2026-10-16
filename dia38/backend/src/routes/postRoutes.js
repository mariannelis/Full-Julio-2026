import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const validImage = v => typeof v === 'string' && /^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(v) && v.length < 5_000_000;

const formatPostsWithComments = async (posts) => {
  const postIds = posts.map((post) => post._id);

  const comments = await Comment.find({ post: { $in: postIds } })
    .populate('author', 'name email')
    .sort({ createdAt: 1 })
    .lean();

  const commentMap = comments.reduce((acc, comment) => {
    const postId = comment.post.toString();
    if (!acc[postId]) acc[postId] = [];
    acc[postId].push(comment);
    return acc;
  }, {});

  return posts.map((post) => ({
    ...post,
    comments: commentMap[post._id.toString()] || [],
  }));
};

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const postsWithComments = await formatPostsWithComments(posts);
    res.json(postsWithComments);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email').lean();

    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const [postWithComments] = await formatPostsWithComments([post]);
    res.json(postWithComments);
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { title, content, image } = req.body;

    if (!String(title || '').trim() || !String(content || '').trim() || !validImage(image)) {
      return res.status(400).json({ message: 'Título, contenido e imagen son obligatorios' });
    }

    const post = await Post.create({
      title,
      content,
      image,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name email');
    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const { title, content, image } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta publicación' });
    }

    if (title !== undefined && !String(title).trim()) return res.status(400).json({ message: 'Título vacío.' });
    if (content !== undefined && !String(content).trim()) return res.status(400).json({ message: 'Contenido vacío.' });
    if (image !== undefined && !validImage(image)) return res.status(400).json({ message: 'Imagen Base64 inválida o demasiado grande.' });
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (image !== undefined) post.image = image;

    await post.save();

    const updatedPost = await Post.findById(post._id).populate('author', 'name email');
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    next(error);
  }
});

export default router;
