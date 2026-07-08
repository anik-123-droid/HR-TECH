const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const { getEmailTemplate } = require('./emailTemplate');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Nodemailer Transporter Configuration (Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use host: 'smtp.gmail.com', port: 465, secure: true
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD, // Your Gmail App Password
  },
});

/**
 * @route POST /api/send-email/status-update
 * @desc Send dynamic email based on candidate status (approved, interview_scheduled, mcq_test, etc.)
 */
app.post('/api/send-email/status-update', async (req, res) => {
  const { 
    candidate_email, 
    candidate_name, 
    status, 
    job_role = "Software Engineer", 
    company_name = "MatchIntel",
    action_url = "https://matchintel.ai/dashboard",
    admin_email,
    admin_name
  } = req.body;

  if (!candidate_email || !candidate_name || !status) {
    return res.status(400).json({ error: 'Missing required fields: candidate_email, candidate_name, status' });
  }

  try {
    // Generate the HTML content dynamically
    const htmlContent = getEmailTemplate({
      candidate_name,
      job_role,
      company_name,
      status,
      action_url
    });

    // Determine subject based on status
    let subject = "Application Update - MatchIntel";
    if (status === "approved") subject = "Application Approved! - MatchIntel";
    else if (status === "interview_scheduled") subject = "Interview Scheduled - MatchIntel";
    else if (status === "mcq_test") subject = "Action Required: MCQ Assessment - MatchIntel";

    // Mail options
    const mailOptions = {
      from: `"${admin_name || 'MatchIntel Recruiting'}" <${process.env.EMAIL_USER}>`,
      replyTo: admin_email || process.env.EMAIL_USER,
      to: candidate_email,
      subject: subject,
      html: htmlContent,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send email',
      details: error.message
    });
  }
});

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Email Service is running' });
});

app.listen(PORT, () => {
  console.log(`Email Service running on port ${PORT}`);
});
