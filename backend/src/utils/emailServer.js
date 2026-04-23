import nodemailer from "nodemailer";
import { getEnv } from "src/config/env/getEnv";
import { secure } from "./AuthHelper";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 587,
  secure: secure,
  auth: {
    user: getEnv.EMAIL_SMTP,
    pass: getEnv.EMAIL_SMTP_PASSWORD,
  },
});

const SendOtpMailer = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: getEnv.EMAIL_SMTP,
      to,
      subject: "Reset Your Password",
      html: `<p>your OTP for reset password <b>${otp}</b>. it expires in 5 minutes </p>`,
    });
  } catch (error) {}
};
