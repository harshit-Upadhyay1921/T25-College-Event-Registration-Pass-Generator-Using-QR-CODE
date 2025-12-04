const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uniqueQrToken: { type: String, required: true, unique: true }, // The secret code inside QR
    isCheckedIn: { type: Boolean, default: false },
    checkInTime: { type: Date },
    paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'completed' }
});

module.exports = mongoose.model('Ticket', ticketSchema);
