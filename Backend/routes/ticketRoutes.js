const express = require('express');
const router = express.Router();
const { purchaseTicket, verifyTicket } = require('../controllers/ticketController');
const auth = require('../middleware/authMiddleware');

router.post('/purchase', auth, purchaseTicket);
router.post('/verify', verifyTicket); // Used by scanner (Volunteer)

module.exports = router;
