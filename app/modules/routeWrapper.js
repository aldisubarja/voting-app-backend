const express = require('express');
const router = express.Router();
const authRoutes = require('../routes/authRoutes');
const voteRoutes = require('../routes/voteRoutes');
const adminRoutes = require('../routes/adminRoutes');

router.use('/api/auth', authRoutes);
router.use('/api/vote', voteRoutes);
router.use('/api/admin', adminRoutes);

module.exports = router;
