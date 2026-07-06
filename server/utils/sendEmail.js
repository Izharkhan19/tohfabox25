const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // For development/testing: Automatically generate an ethereal test account
    // if SENDER_EMAIL and SENDER_PASSWORD are not provided in .env
    let transporter;

    if (process.env.SENDER_EMAIL && process.env.SENDER_PASSWORD) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.ethereal.email",
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
            },
        });
    } else {
        // Automatically generate a test account if no credentials are provided
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
        console.log('⚠️  No SENDER_EMAIL found in .env. Using auto-generated Ethereal test account.');
    }

    const message = {
        from: `${process.env.SENDER_NAME || 'Tohfabox25'} <${process.env.SENDER_EMAIL || "test@ethereal.email"}>`,
        to: options.email,
        subject: options.subject,
        text: options.message, // Fallback plain text
        html: options.html,    // Professional HTML template
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // The Preview URL is incredibly helpful for local testing
};

module.exports = sendEmail;
