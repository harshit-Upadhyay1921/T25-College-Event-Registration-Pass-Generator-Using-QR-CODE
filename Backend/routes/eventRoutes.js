const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventStats } = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createEvent); // Admin only (add role check if needed)
router.get('/', getAllEvents);
router.get('/:id/stats', auth, getEventStats); // Admin dashboard

module.exports = router;