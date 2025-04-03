const express = require('express');
const { vote, getExistingCandidates } = require('../controllers/voteController');
const { authenticate, authorize } = require('../middlewares/auth');
const router = express.Router();

router.get('/exist', authenticate, authorize('user'), getExistingCandidates);
router.post('/', authenticate, authorize('user'), vote);

module.exports = router;
