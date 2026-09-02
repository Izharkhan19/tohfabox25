const getWelcomeEmailTemplate = (name, promoCode) => {
    return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px; border-radius: 12px;">
        <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
            <h1 style="color: #1e293b; margin-bottom: 20px; font-size: 28px;">Welcome to Tohfabox25!</h1>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hi <strong>${name}</strong>,<br><br>
                Thank you for joining Tohfabox25! We are thrilled to have you as part of our community. Explore our exquisite collection of handmade resin art pieces designed specifically for meaningful spaces.
            </p>
            
            <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 24px; margin: 30px 0;">
                <p style="color: #475569; font-size: 15px; margin-bottom: 15px; margin-top: 0;">As a special thank you for joining, enjoy <strong>10% OFF</strong> your first order!</p>
                <div style="display: inline-block; background-color: #e2e8f0; color: #0f172a; font-family: monospace; font-size: 22px; font-weight: bold; padding: 10px 20px; border-radius: 6px; letter-spacing: 2px;">
                    ${promoCode}
                </div>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 15px; margin-bottom: 0;">*Valid for one-time use only on your first purchase.</p>
            </div>

            <a href="${process.env.CLIENT_URL || 'https://tohfabox25.vercel.app'}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: bold; font-size: 16px; letter-spacing: 1px; text-transform: uppercase;">
                Explore Gallery
            </a>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                If you have any questions, feel free to reply to this email.<br>
                Best regards, <br><strong>The Tohfabox25 Team</strong>
            </p>
        </div>
    </div>
    `;
};

module.exports = { getWelcomeEmailTemplate };
