import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { MailTemplates } from "../const/emailTemplates";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmailOtp(email: string, otp: string) {
  console.log("Sending OTP:", otp);
  const mailOptions = {
    from: `"Learn Vista" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: MailTemplates.OTP.SUBJECT,
    text: MailTemplates.OTP.TEXT(otp),
  };

  await transporter.sendMail(mailOptions);
}
