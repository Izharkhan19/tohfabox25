const { Resend } = require('resend');

const sendEmail = async (options) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('⚠️  RESEND_API_KEY is not defined. Email will not be sent.');
            return;
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const payload = {
            from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
            to: options.email,
            subject: options.subject,
        };

        if (options.html) {
            payload.html = options.html;
        } else if (options.message) {
            payload.text = options.message;
        }

        const data = await resend.emails.send(payload);

        console.log('✅ Email sent successfully via Resend:', data.id);
        return data;
    } catch (error) {
        console.error('❌ Error sending email via Resend:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
