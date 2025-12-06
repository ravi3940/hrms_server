
import  nodemailer  from  "nodemailer"


export    const  sendEmail  = async  (to, subject, text, attachmentPath)=> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });


    const mailOptions = { from: process.env.SMTP_FROM || 'no-reply@company.com', to, subject, text };
    if (attachmentPath) mailOptions.attachments = [{ path: attachmentPath }];


    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error('Email send failed', err);
    throw err;
  }
};