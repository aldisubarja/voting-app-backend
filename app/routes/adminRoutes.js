const express = require('express');
const { getResults, getUsers, deleteUser, editUser } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/auth');
const router = express.Router();

router.get('/results', authenticate, authorize('admin'), getResults);
router.get('/users', authenticate, authorize('admin'), getUsers);
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
router.put('/users/:id', authenticate, authorize('admin'), editUser);

module.exports = router;
