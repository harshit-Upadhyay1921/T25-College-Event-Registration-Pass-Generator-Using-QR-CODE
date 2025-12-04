const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, createdBy: req.user.id });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin Dashboard Logic
exports.getEventStats = async (req, res) => {
    try {
        const { id } = req.params;
        const totalRegistrations = await Ticket.countDocuments({ eventId: id });
        const actualCheckins = await Ticket.countDocuments({ eventId: id, isCheckedIn: true });

        res.json({ totalRegistrations, actualCheckins });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
