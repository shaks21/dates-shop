import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail", // or your provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"DateASuperfood" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirm Your Email Address",
    html: `
    <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #d97706; text-align: center;">Welcome to DateASuperfood 🍯</h2>
      <p style="font-size: 15px; line-height: 1.6;">
        Hi there, <br><br>
        Thank you for signing up with <strong>DateASuperfood</strong>. You can login and browse our products with your new account. However, to be able to proceed to checkout with your account, please verify your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" target="_blank"
        style="display: inline-block; padding: 12px 24px; background-color: #d97706; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Verify Email
        </a>

      </div>
      <p style="font-size: 13px; color: #555; line-height: 1.5;">
        If you didn't create an account with us, you can safely ignore this email.  
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #888; text-align: center;">
        &copy; ${new Date().getFullYear()} DateASuperfood. All rights reserved.
      </p>
    </div>
  `,
  });
}
