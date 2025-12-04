const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const sendTicketEmail = async (email, ticketData) => {
    try {
        // 1. Generate QR Code as Data URL (Base64)
        const qrCodeUrl = await QRCode.toDataURL(ticketData.uniqueQrToken);

        // 2. Setup Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or use 'smtp.ethereal.email' for testing
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 3. Email Content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Your Ticket for ${ticketData.eventName}`,
            html: `
                <h1>Ticket Confirmation</h1>
                <p>Hello,</p>
                <p>You have successfully registered for <strong>${ticketData.eventName}</strong>.</p>
                <p>Your unique Ticket ID is: <b>${ticketData.uniqueQrToken}</b></p>
                <p>Please show the QR code attached below at the entry gate.</p>
                <br/>
                <img src="cid:uniqueqrcode" alt="QR Code" width="200" />
            `,
            attachments: [
                {
                    filename: 'ticket_qr.png',
                    path: qrCodeUrl,
                    cid: 'uniqueqrcode' // Same as in html img src
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email Error:', error);
    }
};

module.exports = sendTicketEmail;
