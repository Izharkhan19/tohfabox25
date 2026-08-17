const { google } = require('googleapis');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'];

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // standard redirect URI for manual token generation
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer for local temporary storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Upload image to Google Drive
const uploadToGoogleDrive = async (filePath) => {
    try {
        if (!process.env.GOOGLE_DRIVE_CLIENT_ID || !process.env.GOOGLE_DRIVE_REFRESH_TOKEN || !FOLDER_ID) {
            throw new Error('Google Drive OAuth credentials or Folder ID are missing in .env');
        }

        const fileMetadata = {
            name: path.basename(filePath),
            parents: [FOLDER_ID]
        };

        const ext = path.extname(filePath).toLowerCase();
        let mimeType = 'image/jpeg';
        if (ext === '.png') mimeType = 'image/png';
        if (ext === '.gif') mimeType = 'image/gif';
        if (ext === '.webp') mimeType = 'image/webp';

        const readStream = fs.createReadStream(filePath);
        readStream.on('error', (err) => {
            console.warn('ReadStream error (ignored):', err.message);
        });

        const media = {
            mimeType: mimeType,
            body: readStream
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink',
            supportsAllDrives: true
        });

        const fileId = response.data.id;

        // Make file publicly readable
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            },
            supportsAllDrives: true
        });

        fs.unlinkSync(filePath);

        return {
            url: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
            publicId: fileId // Keeping 'publicId' key name to avoid changing the Product model schema
        };
    } catch (error) {
        console.error('Google Drive upload error:', error);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error;
    }
};

// Delete image from Google Drive
const deleteFromGoogleDrive = async (fileId) => {
    try {
        if (!process.env.GOOGLE_DRIVE_CLIENT_ID) return false;
        await drive.files.delete({
            fileId: fileId,
            supportsAllDrives: true
        });
        return true;
    } catch (error) {
        console.error('Google Drive delete error:', error);
        return false;
    }
};

module.exports = {
    drive,
    upload,
    uploadToGoogleDrive: uploadToGoogleDrive,
    deleteFromGoogleDrive: deleteFromGoogleDrive
};
