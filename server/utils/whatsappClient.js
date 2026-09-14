const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let isReady = false;

const initWhatsAppClient = () => {
    console.log('Initializing WhatsApp Client...');

    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        console.log('=====================================================================');
        console.log('⚠️  PLEASE SCAN THIS QR CODE WITH YOUR WHATSAPP TO LINK THE BOT ⚠️');
        console.log('=====================================================================');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        isReady = true;
        console.log('✅ WhatsApp Client is Ready!');
    });

    client.on('authenticated', () => {
        console.log('✅ WhatsApp Client Authenticated successfully!');
    });

    client.on('auth_failure', msg => {
        console.error('❌ WhatsApp Authentication failure:', msg);
    });

    client.on('disconnected', (reason) => {
        isReady = false;
        console.log('❌ WhatsApp Client was disconnected:', reason);
    });

    client.initialize();
};

/**
 * Sends a WhatsApp message to a specific phone number
 * @param {string} phone - The phone number (should contain country code, e.g., 919876543210)
 * @param {string} message - The message body
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
const sendWhatsAppMessage = async (phone, message) => {
    if (!isReady || !client) {
        console.warn('⚠️ WhatsApp client is not ready. Message not sent.');
        return false;
    }

    try {
        // Format phone number to WhatsApp ID format
        // Example: 919876543210@c.us
        const cleanPhone = phone.replace(/\D/g, ''); // Remove all non-numeric characters
        const chatId = `${cleanPhone}@c.us`;

        // Check if the number is registered on WhatsApp
        const isRegistered = await client.isRegisteredUser(chatId);
        
        if (!isRegistered) {
            console.warn(`⚠️ The number ${cleanPhone} is not registered on WhatsApp.`);
            return false;
        }

        await client.sendMessage(chatId, message);
        console.log(`✅ WhatsApp message sent to ${cleanPhone}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending WhatsApp message:', error.message);
        return false;
    }
};

module.exports = {
    initWhatsAppClient,
    sendWhatsAppMessage
};
