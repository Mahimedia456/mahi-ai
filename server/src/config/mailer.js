import nodemailer from "nodemailer";
import { env } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: Number(env.smtpPort),
  secure: String(env.smtpSecure) === "true",
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass
  }
});

export async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: env.mailFrom,
    to,
    subject,
    html
  });
}