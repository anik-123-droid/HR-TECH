const nodemailer = require('nodemailer');

const EMAIL_USER = "anikkhanpathan685@gmail.com";
const EMAIL_PASS = "abhzrwzgifmcmnsk";

async function testEmail() {
  const fallbackTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  try {
    const info = await fallbackTransporter.sendMail({
      from: `"Test Recruiter" <${EMAIL_USER}>`,
      to: "anikkhanpathan685@gmail.com",
      subject: "Test Email Fallback",
      text: "This is a test email.",
    });
    console.log("Success:", info.messageId);
  } catch (err) {
    console.error("Error:", err);
  }
}

testEmail();
