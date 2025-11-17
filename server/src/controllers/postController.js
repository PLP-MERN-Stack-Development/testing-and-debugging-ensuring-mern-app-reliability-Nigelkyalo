const { validationResult, body, param, query } = require('express-validator');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');

const createPostValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Category must be a valid ObjectId'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Invalid status value'),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings')
];

const updatePostValidationRules = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('category')
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Category must be a valid ObjectId'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Invalid status value'),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings')
];

const paginationValidationRules = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('category').optional().custom((value) => mongoose.Types.ObjectId.isValid(value)),
  query('search').optional().isString()
];

const idValidationRules = [param('id').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid id')];

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Validation failed', details: errors.array() });
    return false;
  }
  return true;
}

const createPost = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;

  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    tags: req.body.tags,
    status: req.body.status || 'draft',
    author: req.user.id
  });

  res.status(201).json(post);
});

const getPosts = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;

  const { page = 1, limit = 10, category, search } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { content: new RegExp(search, 'i') }
    ];
  }

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json(posts);
});

const getPostById = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  return res.status(200).json(post);
});

const attachPost = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  req.post = post;
  return next();
});

const updatePost = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;

  if (req.post.author.toString() !== req.user.id) {
    return res.status(403).json({ error: 'You do not have permission to update this post' });
  }

  const updates = {
    title: req.body.title ?? req.post.title,
    content: req.body.content ?? req.post.content,
    status: req.body.status ?? req.post.status,
    tags: req.body.tags ?? req.post.tags
  };

  if (req.body.category) {
    updates.category = req.body.category;
  }

  const updatedPost = await Post.findByIdAndUpdate(req.post._id, updates, {
    new: true,
    runValidators: true
  });

  return res.status(200).json(updatedPost);
});

const deletePost = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;

  if (req.post.author.toString() !== req.user.id) {
    return res.status(403).json({ error: 'You do not have permission to delete this post' });
  }

  await req.post.deleteOne();

  return res.status(200).json({ message: 'Post deleted successfully' });
});

module.exports = {
  createPostValidationRules,
  updatePostValidationRules,
  paginationValidationRules,
  idValidationRules,
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  attachPost
};

