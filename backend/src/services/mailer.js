import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];

const ensureEmailConfig = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Email not configured. Missing: ${missing.join(', ')}`);
  }
};

const createTransport = () => {
  ensureEmailConfig();

  const secure = process.env.SMTP_SECURE === 'true';
  const port = Number(process.env.SMTP_PORT || (secure ? 465 : 587));

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendTicketEmail = async ({ to, ticket, event }) => {
  const transporter = createTransport();

  const qrPayload = {
    ticketId: ticket.id,
    eventId: ticket.eventId,
    name: `${ticket.firstName} ${ticket.lastName}`.trim(),
    email: ticket.email,
    phone: ticket.phone,
    timestamp: ticket.timestamp,
  };

  const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="color: #0f766e;">Your Ticket for ${event?.title || 'Event'}</h2>
      <p>Hi ${ticket.firstName},</p>
      <p>Your ticket request has been received. Show this QR code at the entrance:</p>
      <div style="margin: 16px 0;">
        <img src="${qrDataUrl}" alt="Ticket QR Code" style="width: 180px; height: 180px;" />
      </div>
      <h3 style="margin-bottom: 4px;">Ticket Details</h3>
      <ul style="padding-left: 16px;">
        <li><strong>Event:</strong> ${event?.title || 'Event'}</li>
        <li><strong>Date:</strong> ${event?.date || 'TBA'} at ${event?.time || ''}</li>
        <li><strong>Location:</strong> ${event?.location || 'TBA'}</li>
        <li><strong>Name:</strong> ${ticket.firstName} ${ticket.lastName}</li>
        <li><strong>Phone:</strong> ${ticket.phone}</li>
        <li><strong>Email:</strong> ${ticket.email}</li>
      </ul>
      <p style="margin-top: 12px;">Keep this email safe. See you at the event!</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject: `Your Ticket for ${event?.title || 'Event'}`,
    html,
  });
};
