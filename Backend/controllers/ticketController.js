const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const sendTicketEmail = require('../utils/emailService');

// 1. Student Purchases Ticket
exports.purchaseTicket = async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user.id; // From JWT middleware

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Generate a unique token for the QR code
        const uniqueQrToken = uuidv4();

        // Create Ticket
        const ticket = await Ticket.create({
            eventId,
            userId,
            uniqueQrToken,
            paymentStatus: 'completed' // Mocking successful payment
        });

        const user = await User.findById(userId);

        // Send Email Async
        sendTicketEmail(user.email, {
            eventName: event.name,
            uniqueQrToken: uniqueQrToken
        });

        res.status(201).json({ message: 'Ticket purchased, check your email!', ticket });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Volunteer Scans Ticket (Logic for Green/Red signal)
exports.verifyTicket = async (req, res) => {
    const { qrToken } = req.body; // Token scanned from QR

    try {
        // Find ticket by the unique token
        const ticket = await Ticket.findOne({ uniqueQrToken: qrToken }).populate('userId', 'name college');

        if (!ticket) {
            return res.status(404).json({ valid: false, message: 'Invalid Ticket / Fake QR' });
        }

        // Check if already used
        if (ticket.isCheckedIn) {
            return res.status(409).json({ 
                valid: false, 
                message: 'Duplicate Entry! Ticket already used.', 
                checkInTime: ticket.checkInTime 
            });
        }

        // Mark as Present
        ticket.isCheckedIn = true;
        ticket.checkInTime = new Date();
        await ticket.save();

        res.json({ 
            valid: true, 
            message: 'Access Granted', 
            attendee: {
                name: ticket.userId.name,
                college: ticket.userId.college
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};