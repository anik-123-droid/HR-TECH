const getEmailTemplate = ({
  candidate_name,
  job_role,
  company_name,
  status,
  action_url = "#",
}) => {
  let headerText = "";
  let mainMessage = "";
  let ctaText = "";

  switch (status) {
    case "approved":
      headerText = "Application Approved!";
      mainMessage = `Great news! Your application for the <strong>${job_role}</strong> position at <strong>${company_name}</strong> has been reviewed and approved by our team. We were very impressed with your profile.`;
      ctaText = "View Application Status";
      break;
    case "interview_scheduled":
      headerText = "Interview Scheduled";
      mainMessage = `Congratulations! We would like to invite you for an interview for the <strong>${job_role}</strong> role at <strong>${company_name}</strong>. Please click the button below to view your schedule and confirm your availability.`;
      ctaText = "Schedule Interview";
      break;
    case "mcq_test":
      headerText = "Assessment Invitation";
      mainMessage = `You have been selected to take the next step in our recruitment process for the <strong>${job_role}</strong> position at <strong>${company_name}</strong>. Please complete the MCQ Assessment using the link below.`;
      ctaText = "Start MCQ Test";
      break;
    default:
      headerText = "Application Update";
      mainMessage = `There is an update regarding your application for the <strong>${job_role}</strong> position at <strong>${company_name}</strong>.`;
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
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
            color: #1f2937;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
            background-color: #ffffff;
            padding: 32px 40px 24px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            font-size: 24px;
            font-weight: 800;
            color: #111827;
            letter-spacing: -0.5px;
            margin: 0;
        }
        .logo span {
            color: #2563EB;
        }
        .content {
            padding: 40px;
        }
        h1 {
            color: #111827;
            font-size: 24px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 24px;
            text-align: center;
        }
        p {
            margin-bottom: 24px;
            font-size: 16px;
            color: #4b5563;
        }
        .cta-container {
            text-align: center;
            margin-top: 32px;
            margin-bottom: 16px;
        }
        .cta-button {
            display: inline-block;
            background-color: #2563EB;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.2s;
            box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }
        .cta-button:hover {
            background-color: #1d4ed8;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 0;
            font-size: 14px;
            color: #6b7280;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 32px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <p class="logo">Match<span>Intel</span></p>
        </div>
        <div class="content">
            <h1>${headerText}</h1>
            <p>Hi ${candidate_name},</p>
            <p>${mainMessage}</p>
            
            <div class="cta-container">
                <a href="${action_url}" class="cta-button">${ctaText}</a>
            </div>
            
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

module.exports = { getEmailTemplate };
