const express = require('express');
const postRoutes = require('./postRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

module.exports = router;

