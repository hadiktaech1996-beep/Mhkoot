import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

export interface MailResult { sent: boolean; reason?: string }

let transporter: Transporter | null = null;

export async function sendMail(opts: { to: string | string[]; subject: string; html: string; text: string; replyTo?: string }): Promise<MailResult> {
  const host = process.env.SMTP_HOST;
  if (!host) {
    console.info(`[mail] SMTP not configured — email NOT sent. Subject: ${opts.subject}`);
    return { sent: false, reason: "smtp_not_configured" };
  }
  try {
    transporter ||= nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, ...opts });
    return { sent: true };
  } catch (e) {
    console.error("[mail] send failed", e);
    return { sent: false, reason: "send_failed" };
  }
}

export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
