import nodemailer from 'nodemailer';

const getEmailTemplate = ({
  candidate_name,
  job_role,
  company_name,
  status,
  action_url = "#",
  interview_date,
  interview_time,
  interview_link
}) => {
  let headerText = "";
  let mainMessage = "";
  let ctaText = "";

  switch (status) {
    case "welcome":
      headerText = "Welcome to Venika HR-TECH!";
      mainMessage = `<p>Thank you for creating an account at <strong>${company_name}</strong>. Your profile is now successfully set up, and you are one step closer to discovering your next big career opportunity with us.</p>
                     <p>Our platform uses advanced AI to match your unique skills and experience with the most suitable roles. We encourage you to keep your profile and resume updated so that we can provide you with the best possible job recommendations.</p>`;
      ctaText = "Go to Dashboard";
      break;
    case "applied":
      headerText = "Application Received!";
      mainMessage = `<p>Thank you for submitting your application for the <strong>${job_role}</strong> position at <strong>${company_name}</strong>. We have successfully received your profile and resume.</p>
                     <p>Our talent acquisition team and AI screening systems are currently reviewing your qualifications. We will notify you of any updates or next steps regarding your candidacy.</p>`;
      ctaText = "View Application Status";
      break;
    case "signin":
      headerText = "New Sign-in Alert";
      mainMessage = `<p>You have successfully signed in to your <strong>${company_name}</strong> candidate portal. We are thrilled to see you back and actively managing your career journey with us.</p>
                     <p>If this was you, no further action is needed and you can continue exploring new job matches. If you did not authorize this login, please contact our support team immediately to secure your account.</p>`;
      ctaText = "Go to Dashboard";
      break;
    case "approved":
      headerText = "Application Approved!";
      mainMessage = `<p>Great news! Your application for the <strong>${job_role}</strong> position at <strong>${company_name}</strong> has been reviewed and approved by our talent acquisition team. We were highly impressed with your background, skills, and the unique value you bring.</p>
                     <p>This means you have successfully passed the initial screening phase. Our team is currently preparing the next steps of the recruitment process, and we will be in touch with you very soon with further instructions.</p>`;
      ctaText = "View Application Status";
      break;
    case "interview_scheduled": {
      const dateText = interview_date ? `<strong>Date:</strong> ${interview_date}<br>` : '';
      const timeText = interview_time ? `<strong>Time:</strong> ${interview_time}<br>` : '';
      const linkText = interview_link ? `<strong>Meeting Link:</strong> <a href="${interview_link}">${interview_link}</a><br>` : '';
      const details = (dateText || timeText || linkText) ? `<div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #e2e8f0;">${dateText}${timeText}${linkText}</div>` : '';

      headerText = "Interview Scheduled";
      mainMessage = `<p>Congratulations! We are excited to invite you for an interview for the <strong>${job_role}</strong> role at <strong>${company_name}</strong>. Your profile stood out among many applicants, and our hiring managers are eager to learn more about your experience.</p>
                     ${details}
                     <p>Please click the button below to join the meeting at the scheduled time. We recommend reviewing the job description and preparing any questions you might have for us.</p>`;
      ctaText = "Join Meeting";
      break;
    }
    case "mcq_test":
      headerText = "Assessment Invitation";
      mainMessage = `<p>Congratulations on reaching the next step in our recruitment process for the <strong>${job_role}</strong> position at <strong>${company_name}</strong>! To help us better evaluate your technical skills and domain knowledge, we would like you to complete a brief MCQ Assessment.</p>
                     <p>This assessment is a crucial part of our selection process and will give you a chance to demonstrate your expertise. Please ensure you are in a quiet environment with a stable internet connection before starting.</p>`;
      ctaText = "Start MCQ Test";
      break;
    case "rejected":
      headerText = "Application Update";
      mainMessage = `<p>Thank you for taking the time to apply for the <strong>${job_role}</strong> position at <strong>${company_name}</strong>. We appreciate your interest in joining our team and the effort you put into your application.</p>
                     <p>After careful consideration and reviewing your profile against our current requirements, we have decided to move forward with other candidates at this time. We will keep your resume in our database for future opportunities.</p>`;
      ctaText = "View Other Roles";
      break;
    case "shortlisted":
      headerText = "You've been Shortlisted!";
      mainMessage = `<p>Excellent news! Your application for the <strong>${job_role}</strong> position at <strong>${company_name}</strong> has been reviewed and you have been shortlisted for the next round. Your profile aligns perfectly with what we are looking for.</p>
                     <p>Our team will contact you shortly with the next steps in the recruitment process. Please keep an eye on your email and candidate portal.</p>`;
      ctaText = "Go to Dashboard";
      break;
    case "mcq_passed":
      headerText = "Assessment Passed!";
      mainMessage = `<p>Congratulations! You have successfully passed the MCQ Assessment for the <strong>${job_role}</strong> position at <strong>${company_name}</strong>.</p>
                     <p>Your strong performance demonstrates your capability, and we are excited to move you forward in the process. We will reach out to you soon regarding the next steps.</p>`;
      ctaText = "View Results";
      break;
    case "hired":
      headerText = "Congratulations, You're Hired!";
      mainMessage = `<p>We are absolutely thrilled to inform you that you have been selected for the <strong>${job_role}</strong> position at <strong>${company_name}</strong>! We were incredibly impressed by your skills and experience throughout the interview process.</p>
                     <p>Welcome to the team! Our HR department will be sending you the official offer letter and onboarding details shortly. We are excited to have you on board.</p>`;
      ctaText = "View Offer Details";
      break;
    default:
      headerText = "Application Update";
      mainMessage = `<p>There is an update regarding your application for the <strong>${job_role}</strong> position at <strong>${company_name}</strong>.</p>
                     <p>Please click the button below to view the latest status and any required next steps in your candidate portal.</p>`;
      ctaText = "View Update";
      break;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headerText}</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f3f4f6; color: #1f2937; line-height: 1.6; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .header { background-color: #ffffff; padding: 32px 40px 24px; text-align: center; border-bottom: 1px solid #e5e7eb; }
        .logo { font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.5px; margin: 0; }
        .logo span { color: #2563EB; }
        .content { padding: 40px; }
        h1 { color: #111827; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 24px; text-align: center; }
        p { margin-bottom: 24px; font-size: 16px; color: #4b5563; }
        .cta-container { text-align: center; margin-top: 32px; margin-bottom: 16px; }
        .cta-button { display: inline-block; background-color: #2563EB; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
        .cta-button:hover { background-color: #1d4ed8; }
        .footer { background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { margin: 0; font-size: 14px; color: #6b7280; }
        .divider { height: 1px; background-color: #e5e7eb; margin: 32px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <p class="logo">Venika <span>HR-TECH</span></p>
        </div>
        <div class="content">
            <h1>${headerText}</h1>
            <p>Hi ${candidate_name},</p>
            ${mainMessage}
            ${status !== 'rejected' ? `
            <div class="cta-container">
                <a href="${action_url}" class="cta-button">${ctaText}</a>
            </div>` : ''}
            <div class="divider"></div>
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
                If you have any questions, simply reply to this email. We're here to help!
            </p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${company_name}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    candidate_email,
    candidate_name,
    status,
    job_role = "Professional Role",
    company_name = "Venika HR-TECH",
    action_url = "https://ai-hr-tech.vercel.app",
    admin_email,
    admin_name,
    google_access_token,
    interview_date,
    interview_time,
    interview_link
  } = req.body;

  if (!candidate_email || !candidate_name || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Hardcoded for testing since user requested it
  const EMAIL_USER = "anikkhanpathan685@gmail.com";
  const EMAIL_PASS = "akccfigvfjrauoiz";

  try {
    const htmlContent = getEmailTemplate({ candidate_name, job_role, company_name, status, action_url, interview_date, interview_time, interview_link });

    let subject = "Application Update - Venika HR-TECH";
    if (status === "approved" || status === "shortlisted") subject = "Application Approved! - Venika HR-TECH";
    else if (status === "interview_scheduled") subject = "Interview Scheduled - Venika HR-TECH";
    else if (status === "mcq_test") subject = "Action Required: MCQ Assessment - Venika HR-TECH";
    else if (status === "mcq_passed") subject = "Assessment Passed! - Venika HR-TECH";
    else if (status === "rejected") subject = "Application Update - Venika HR-TECH";
    else if (status === "applied") subject = "Application Received - Venika HR-TECH";
    else if (status === "welcome") subject = "Welcome to Venika HR-TECH!";
    else if (status === "signin") subject = "New Sign-in Alert - Venika HR-TECH";
    else if (status === "hired") subject = "Congratulations! You're Hired - Venika HR-TECH";

    let info;

    if (google_access_token && admin_email) {
      try {
        const oauthTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: admin_email,
            accessToken: google_access_token,
          },
        });
        info = await oauthTransporter.sendMail({
          from: `"${admin_name || 'Recruiting'}" <${admin_email}>`,
          replyTo: admin_email,
          to: candidate_email,
          subject: subject,
          html: htmlContent,
        });
        return res.status(200).json({ success: true, messageId: info.messageId, method: 'oauth2' });
      } catch (oauthError) {
        console.error('OAuth2 failed (token might be expired or missing permissions). Falling back to system email...', oauthError.message);
        // Will fall through to fallback below
      }
    }

    // Fallback or System Default
    const fallbackTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    info = await fallbackTransporter.sendMail({
      from: `"${admin_name || 'Venika HR-TECH Recruiting'}" <${EMAIL_USER}>`,
      replyTo: admin_email || EMAIL_USER,
      to: candidate_email,
      subject: subject,
      html: htmlContent,
    });

    return res.status(200).json({ success: true, messageId: info.messageId, method: 'system_fallback' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
