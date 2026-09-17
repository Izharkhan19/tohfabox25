const sendEmail = async (options) => {
    // We are routing the email request to the Vercel frontend API.
    // This bypasses the Render Free Tier SMTP port block (Ports 25, 465, 587)
    // by making a standard HTTP POST request (Port 443) to Vercel, 
    // which then securely uses Nodemailer + Gmail to send the email.

    const clientUrl = process.env.CLIENT_URL || 'https://tohfabox25.vercel.app';
    const emailApiUrl = `${clientUrl}/api/email`;

    try {
        console.log(`🔄 Relaying email request to Vercel API: ${emailApiUrl}`);
        
        const response = await fetch(emailApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // We pass the JWT_SECRET as an API key to securely authenticate the request 
                // between Render and Vercel, preventing unauthorized access.
                'x-api-key': process.env.JWT_SECRET,
            },
            body: JSON.stringify({
                recipient: options.email,
                subject: options.subject,
                message: options.message || options.text || '',
                html: options.html || ''
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Vercel API Relay Error:', data.message || 'Unknown Error');
            throw new Error(data.message || 'Failed to send email via Vercel Relay');
        }

        console.log('✅ Email successfully relayed and sent via Vercel:', data.messageId);
        return data;

    } catch (error) {
        console.error('❌ Error during Vercel Email Relay:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
