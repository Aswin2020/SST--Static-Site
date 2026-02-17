// ========================================
// SHRI SELVAM TILES & GRANITES
// Node.js Backend Server (Alternative)
// ========================================

/*
Setup Instructions:
1. Install required packages:
   npm install express cors nodemailer dotenv

2. Create a .env file in the backend folder with:
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   RECIPIENT_EMAIL=info@shriselvamtiles.com

3. Run the server:
   node server.js

4. Server will run on http://localhost:5000
*/

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_SERVER || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Shri Selvam Tiles Backend Server',
    timestamp: new Date().toISOString(),
  });
});

// Handle contact form submission
app.post('/send-enquiry', async (req, res) => {
  try {
    const { name, mobile, email, message } = req.body;

    // Validate required fields
    if (!name || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, mobile, and email are required',
      });
    }

    // Email template
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a1a1a; color: #d4af37; padding: 20px; text-align: center; }
              .content { background: #f5f5f5; padding: 20px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #1a1a1a; }
              .value { color: #555; }
              .footer { background: #1a1a1a; color: #d4af37; padding: 15px; text-align: center; font-size: 12px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>New Customer Enquiry</h2>
                  <p>Shri Selvam Tiles & Granites</p>
              </div>
              <div class="content">
                  <p>You have received a new enquiry from your website:</p>
                  
                  <div class="field">
                      <span class="label">Name:</span>
                      <span class="value">${name}</span>
                  </div>
                  
                  <div class="field">
                      <span class="label">Mobile:</span>
                      <span class="value">${mobile}</span>
                  </div>
                  
                  <div class="field">
                      <span class="label">Email:</span>
                      <span class="value">${email}</span>
                  </div>
                  
                  <div class="field">
                      <span class="label">Message:</span>
                      <div class="value">${message || 'No message provided'}</div>
                  </div>
                  
                  <div class="field">
                      <span class="label">Received On:</span>
                      <span class="value">${new Date().toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                  </div>
              </div>
              <div class="footer">
                  <p>This email was sent from the Shri Selvam Tiles website contact form.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: process.env.RECIPIENT_EMAIL || 'info@shriselvamtiles.com',
      subject: `New Enquiry from ${name} - Shri Selvam Tiles`,
      html: htmlEmail,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Enquiry email sent: ${name} (${email})`);

    res.json({
      success: true,
      message: 'Enquiry sent successfully',
    });
  } catch (error) {
    console.error('Error sending enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send enquiry. Please try again.',
    });
  }
});

// Save quotation PDF to assets/Quotation
const QUOTATION_DIR = path.join(__dirname, '..', 'assets', 'Quotation');

function sanitizeFileName(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  const safe = trimmed.replace(/[^a-zA-Z0-9._-]/g, '-');
  return safe.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function resolveUniqueFileName(baseName) {
  if (!fs.existsSync(QUOTATION_DIR)) {
    fs.mkdirSync(QUOTATION_DIR, { recursive: true });
  }

  const parsed = path.parse(baseName);
  const safeBase = parsed.name || `quotation-${timestampSlug()}`;
  const ext = parsed.ext && parsed.ext.toLowerCase() === '.pdf' ? parsed.ext : '.pdf';

  let candidate = `${safeBase}${ext}`;
  let counter = 1;
  while (fs.existsSync(path.join(QUOTATION_DIR, candidate))) {
    candidate = `${safeBase}-${counter}${ext}`;
    counter += 1;
  }

  return candidate;
}

app.post('/save-quotation', (req, res) => {
  try {
    const { dataUrl, fileName } = req.body || {};

    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Missing PDF data.'
      });
    }

    const prefix = 'data:application/pdf;base64,';
    if (!dataUrl.startsWith(prefix)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PDF data format.'
      });
    }

    const safeName = sanitizeFileName(fileName);
    const finalName = resolveUniqueFileName(safeName || `quotation-${timestampSlug()}.pdf`);
    const filePath = path.join(QUOTATION_DIR, finalName);
    const base64 = dataUrl.slice(prefix.length);

    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));

    return res.json({
      success: true,
      fileName: finalName,
      publicPath: `/assets/Quotation/${finalName}`
    });
  } catch (error) {
    console.error('Error saving quotation PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save quotation PDF.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('Shri Selvam Tiles & Granites - Backend Server');
  console.log('='.repeat(50));
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`SMTP Server: ${process.env.SMTP_SERVER || 'smtp.gmail.com'}`);
  console.log(
    `SMTP Username: ${process.env.SMTP_USERNAME || 'Not configured'}`
  );
  console.log('='.repeat(50) + '\n');
});
