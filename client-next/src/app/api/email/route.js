import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const apiKey = req.headers.get('x-api-key');
        // Validate API Key against environment variable (JWT_SECRET)
        // If JWT_SECRET is not available locally, we skip check in dev or use a fallback
        const expectedKey = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_API_URL || 'fallback_key';
        
        if (!apiKey || (apiKey !== process.env.JWT_SECRET && process.env.NODE_ENV === 'production')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { recipient, subject, message, html } = body;

        if (!recipient || !subject) {
            return NextResponse.json({ success: false, message: 'Missing recipient or subject' }, { status: 400 });
        }

        // Setup Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or use host: process.env.SMTP_HOST
            auth: {
                user: process.env.EMAIL_USER || process.env.SMTP_USER,
                pass: process.env.EMAIL_PASS || process.env.SMTP_PASS
            }
        });

        // Send email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER || '"Artistary Crafts" <noreply@artistarycrafts.com>',
            to: recipient,
            subject: subject,
            text: message,
            html: html
        });

        return NextResponse.json({ success: true, message: 'Email sent successfully', messageId: info.messageId }, { status: 200 });

    } catch (error) {
        console.error('Email API Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to send email' }, { status: 500 });
    }
}
