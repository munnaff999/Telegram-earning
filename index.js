
/**
 * Firebase Cloud Function: Withdrawal Email Notification
 * Trigger: Firestore onCreate for 'withdrawals/{id}'
 * 
 * SETUP INSTRUCTIONS:
 * 1. Run: npm install nodemailer
 * 2. Set config: firebase functions:config:set admin.email="YOUR_ADMIN_EMAIL@GMAIL.COM" admin.pass="YOUR_GMAIL_APP_PASSWORD"
 * 3. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure the email transport using Gmail
// Note: Use an "App Password" if using Gmail with 2FA
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().admin.email, 
    pass: functions.config().admin.pass, 
  },
});

exports.onWithdrawalCreated = functions.firestore
  .document('withdrawals/{withdrawalId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const withdrawalId = context.params.withdrawalId;
    const projectId = admin.instanceId().app.options.projectId;

    const adminEmail = functions.config().admin.email;
    const firestoreLink = `https://console.firebase.google.com/project/${projectId}/firestore/data/~2Fwithdrawals~2F${withdrawalId}`;

    const mailOptions = {
      from: '"XDevil Earning System" <noreply@xdevil.com>',
      to: adminEmail,
      subject: `🚨 New Withdrawal Request: ₹${data.amount}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Withdrawal Submission</h2>
          <hr />
          <p><strong>User UID:</strong> ${data.userId}</p>
          <p><strong>Amount:</strong> <span style="font-size: 1.2em; color: #059669; font-weight: bold;">₹${data.amount}</span></p>
          <p><strong>Method:</strong> ${data.method}</p>
          <p><strong>UPI ID / Number:</strong> ${data.upiId}</p>
          <p><strong>Status:</strong> <span style="text-transform: uppercase; color: #d97706;">${data.status}</span></p>
          <p><strong>Date:</strong> ${data.createdAt ? data.createdAt.toDate().toLocaleString() : 'Just now'}</p>
          <br />
          <a href="${firestoreLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
             View in Firebase Console
          </a>
          <p style="font-size: 0.8em; color: #666; margin-top: 20px;">
            Note: This is an automated notification from XDevil Earning Backend.
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Notification email sent for withdrawal: ${withdrawalId}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
