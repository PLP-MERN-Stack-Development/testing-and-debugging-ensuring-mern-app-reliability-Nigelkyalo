const express = require('express');
const {
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
} = require('../controllers/postController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(paginationValidationRules, getPosts)
  .post(authenticate, createPostValidationRules, createPost);

router
  .route('/:id')
  .get(idValidationRules, getPostById)
  .put(authenticate, idValidationRules, updatePostValidationRules, attachPost, updatePost)
  .delete(authenticate, idValidationRules, attachPost, deletePost);

module.exports = router;

