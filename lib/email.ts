interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  // Optional styled version — text stays required as the fallback for
  // clients that don't render HTML (and for the local console.log path).
  html?: string;
}

// Bez nastaveného RESEND_API_KEY / SMTP_HOST se e-mail jen zaloguje do
// konzole serveru — použitelné pro lokální test, dokud není napojený reálný
// provider (stačí doplnit env vars, kód se měnit nemusí).
export async function sendEmail({ to, subject, text, html }: SendEmailOptions): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject,
      text,
      ...(html ? { html } : {}),
    });
    return;
  }

  if (process.env.SMTP_HOST) {
    const nodemailer = await import('nodemailer');
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await transport.sendMail({ from: process.env.EMAIL_FROM, to, subject, text, ...(html ? { html } : {}) });
    return;
  }

  console.log(`[email:noop] to=${to} subject=${subject}\n${text}`);
}
