import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM!;
const BUSINESS = process.env.BUSINESS_NAME!;
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL!;
const BUSINESS_PHONE = process.env.BUSINESS_PHONE!;

export async function sendBookingConfirmation(appt: {
  customer_name: string;
  customer_email: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  address?: string;
}) {
  const date = new Date(appt.preferred_date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  await resend.emails.send({
    from: FROM,
    to: appt.customer_email,
    subject: `Appointment Request Received — ${BUSINESS}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:#1d4ed8;padding:24px 32px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">${BUSINESS}</h1>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
          <p style="font-size:16px">Hi ${appt.customer_name},</p>
          <p>We received your request and will confirm your appointment within 2 hours.</p>
          <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0">
            <p style="margin:0 0 8px;font-weight:600">Appointment Details</p>
            <p style="margin:4px 0;color:#475569"><strong>Service:</strong> ${appt.service}</p>
            <p style="margin:4px 0;color:#475569"><strong>Date:</strong> ${date}</p>
            <p style="margin:4px 0;color:#475569"><strong>Time:</strong> ${appt.preferred_time}</p>
            ${appt.address ? `<p style="margin:4px 0;color:#475569"><strong>Address:</strong> ${appt.address}</p>` : ""}
          </div>
          <p>Questions? Call or text us at <strong>${BUSINESS_PHONE}</strong>.</p>
          <p style="color:#94a3b8;font-size:13px">— The ${BUSINESS} Team</p>
        </div>
      </div>
    `,
  });
}

export async function sendOwnerNotification(appt: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  address?: string;
  notes?: string;
  id: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  await resend.emails.send({
    from: FROM,
    to: BUSINESS_EMAIL,
    subject: `New Booking: ${appt.customer_name} — ${appt.service}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;color:#1e293b">
        <h2>New Appointment Request</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#64748b">Name</td><td><strong>${appt.customer_name}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Email</td><td>${appt.customer_email}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Phone</td><td>${appt.customer_phone}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Service</td><td>${appt.service}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Date</td><td>${appt.preferred_date}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Time</td><td>${appt.preferred_time}</td></tr>
          ${appt.address ? `<tr><td style="padding:8px 0;color:#64748b">Address</td><td>${appt.address}</td></tr>` : ""}
          ${appt.notes ? `<tr><td style="padding:8px 0;color:#64748b">Notes</td><td>${appt.notes}</td></tr>` : ""}
        </table>
        <a href="${siteUrl}/admin?key=${process.env.ADMIN_KEY}" style="display:inline-block;margin-top:20px;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
          Open Admin →
        </a>
      </div>
    `,
  });
}

export async function sendInvoice(appt: {
  customer_name: string;
  customer_email: string;
  service: string;
  invoice_amount: number;
  stripe_payment_link: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: appt.customer_email,
    subject: `Invoice from ${BUSINESS} — $${appt.invoice_amount}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:#1d4ed8;padding:24px 32px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">${BUSINESS}</h1>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
          <p>Hi ${appt.customer_name},</p>
          <p>Thanks for choosing ${BUSINESS}! Here's your invoice for <strong>${appt.service}</strong>.</p>
          <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0;text-align:center">
            <p style="margin:0;color:#475569">Total Due</p>
            <p style="margin:8px 0 0;font-size:36px;font-weight:700;color:#1d4ed8">$${appt.invoice_amount}</p>
          </div>
          <a href="${appt.stripe_payment_link}" style="display:block;text-align:center;background:#1d4ed8;color:#fff;padding:14px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">
            Pay Now →
          </a>
          <p style="margin-top:20px;color:#64748b;font-size:13px">Secure payment powered by Stripe.</p>
          <p style="color:#94a3b8;font-size:13px">Questions? ${BUSINESS_PHONE}</p>
        </div>
      </div>
    `,
  });
}

export async function sendReviewRequest(appt: {
  customer_name: string;
  customer_email: string;
  service: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: appt.customer_email,
    subject: `How did we do? — ${BUSINESS}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:#1d4ed8;padding:24px 32px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">${BUSINESS}</h1>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
          <p>Hi ${appt.customer_name},</p>
          <p>We hope your <strong>${appt.service}</strong> turned out great! We'd love to hear how it went.</p>
          <p>Would you mind leaving us a quick review? It helps other homeowners find us and only takes 60 seconds.</p>
          <a href="https://g.page/r/review" style="display:block;text-align:center;background:#f59e0b;color:#fff;padding:14px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;margin:24px 0">
            ⭐ Leave a Review
          </a>
          <p style="color:#94a3b8;font-size:13px">— The ${BUSINESS} Team · ${BUSINESS_PHONE}</p>
        </div>
      </div>
    `,
  });
}

export async function sendRebookingReminder(appt: {
  customer_name: string;
  customer_email: string;
  service: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  await resend.emails.send({
    from: FROM,
    to: appt.customer_email,
    subject: `Time for your next cleaning? — ${BUSINESS}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:#1d4ed8;padding:24px 32px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">${BUSINESS}</h1>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 8px 8px">
          <p>Hi ${appt.customer_name},</p>
          <p>It's been about 6 months since your last <strong>${appt.service}</strong> — which means it's the perfect time for a refresh before buildup sets in.</p>
          <p>Existing customers always get priority scheduling. Book now and we'll get you on the calendar.</p>
          <a href="${siteUrl}/#book" style="display:block;text-align:center;background:#1d4ed8;color:#fff;padding:14px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;margin:24px 0">
            Book My Next Cleaning →
          </a>
          <p style="color:#94a3b8;font-size:13px">— The ${BUSINESS} Team · ${BUSINESS_PHONE}</p>
        </div>
      </div>
    `,
  });
}
