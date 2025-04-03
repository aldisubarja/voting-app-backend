const express = require('express');
const { getResults, getUsers } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/auth');
const router = express.Router();

router.get('/results', authenticate, authorize('admin'), getResults);
router.get('/users', authenticate, authorize('admin'), getUsers);

module.exports = router;
