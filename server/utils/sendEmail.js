const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;

    if (process.env.SENDER_EMAIL && process.env.SENDER_PASSWORD) {
        const isGmail = process.env.SENDER_EMAIL.toLowerCase().includes('@gmail.com');
        if (process.env.SMTP_SERVICE === 'gmail' || (!process.env.SMTP_SERVICE && isGmail)) {
            transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_PASSWORD,
                },
            });
        } else if (process.env.SMTP_SERVICE) {
            transporter = nodemailer.createTransport({
                service: process.env.SMTP_SERVICE,
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_PASSWORD,
                },
            });
        } else {
            const port = parseInt(process.env.SMTP_PORT || 587);
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || "smtp.ethereal.email",
                port: port,
                secure: port === 465,
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_PASSWORD,
                },
            });
        }
    } else {
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log('⚠️  No SENDER_EMAIL found in .env. Using auto-generated Ethereal test account.');
    }

    const message = {
        from: `${process.env.SENDER_NAME || 'Tohfabox25'} <${process.env.SENDER_EMAIL || "test@ethereal.email"}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('✅ Email sent successfully via Nodemailer: %s', info.messageId);
        if (!process.env.SENDER_EMAIL) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        return info;
    } catch (error) {
        console.error('❌ Error sending email via Nodemailer:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
