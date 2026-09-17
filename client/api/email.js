export const runtime = 'nodejs';

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Security Check: Ensure the request is coming from our own Render backend
  // We check if the provided API key matches the JWT_SECRET
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.JWT_SECRET) {
      return res.status(401).json({ success: false, message: 'Unauthorized Request. Invalid API Key.' });
  }

  const { recipient, subject, message, html } = req.body;

  // Basic validation
  if (!recipient || !subject) {
    return res.status(400).json({ success: false, message: 'Recipient and subject are required' });
  }

  // Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recipient)) {
    return res.status(400).json({ success: false, message: 'Invalid recipient email format' });
  }

  try {
    let transporter;
    
    // Configure Nodemailer (Since Vercel doesn't block SMTP, this works flawlessly)
    if (process.env.SMTP_HOST || process.env.SMTP_SERVICE) {
        if (process.env.SMTP_SERVICE) {
            transporter = nodemailer.createTransport({
                service: process.env.SMTP_SERVICE,
                auth: {
                    user: process.env.SMTP_USER || process.env.SENDER_EMAIL,
                    pass: process.env.SMTP_PASS || process.env.SENDER_PASSWORD,
                },
            });
        } else {
            const port = parseInt(process.env.SMTP_PORT || 587);
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: port,
                secure: port === 465,
                auth: {
                    user: process.env.SMTP_USER || process.env.SENDER_EMAIL,
                    pass: process.env.SMTP_PASS || process.env.SENDER_PASSWORD,
                },
            });
        }
    } else {
        // Fallback to Ethereal if no SMTP credentials are provided (for testing)
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
    }

    // Determine the email content body
    let finalHtml = html;
    if (!finalHtml && message) {
        finalHtml = `<p>${message.replace(/\n/g, '<br>')}</p>`;
    }

    const mailOptions = {
        from: `${process.env.SENDER_NAME || 'Tohfabox25'} <${process.env.SENDER_EMAIL || "test@ethereal.email"}>`,
        to: recipient,
        subject: subject,
        text: message || '',
        html: finalHtml,
    };

    // Await the sendMail function to ensure serverless function doesn't terminate early
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully via Vercel Nodemailer API: %s', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully via Vercel',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Error sending email via Vercel API:', error.message);
    return res.status(500).json({ 
        success: false, 
        message: 'Failed to send email. Ensure SMTP configuration is correct.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
