import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
// Extended email options interface for better type safety
interface CustomMailOptions extends SendMailOptions {
  to: string;
  subject: string;
  text: string;
}

// Email sending
export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport(
    // {
    //   service: 'Gmail', // Email service provider
    //   auth: {
    //     user: process.env.EMAIL_USER, // Email account for sending emails
    //     pass: process.env.EMAIL_PASS, // Password or app-specific password
    //   },
    // }
    {
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER, //yesma user name dini
        pass: process.env.EMAIL_PASS,
      },
    },
  );
  console.log('transporter from utill', transporter);
  // Configure email options
  const mailOptions: CustomMailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to, // Recipient's email
    subject, // Subject of the email
    text, // Body content of the email
  };
  console.log('mailOptions from utills:', mailOptions);
  // Send the email jun to ma path deko xa teslai
  await transporter.sendMail(mailOptions);
  console.log('Password reset email sent to:', to);
};
