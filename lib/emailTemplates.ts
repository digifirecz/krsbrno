// Plain inline-styled HTML for transactional emails — no external CSS/JS,
// since email clients (Outlook especially) strip <style> blocks and modern
// CSS unreliably. Every element carries its own style attribute on purpose.
const ACCENT = '#c93838';

// A fixed-height empty row — unlike CSS padding on a <td>, this reliably
// renders as real space in every email client (Outlook/webmail included,
// several of which strip or ignore padding on wrapping tables).
function spacer(height: number): string {
  return `<tr><td style="height:${height}px;line-height:${height}px;font-size:1px;">&nbsp;</td></tr>`;
}

function shell(bodyHtml: string): string {
  return `<!doctype html>
<html lang="cs">
  <body style="margin:0;padding:0;background-color:#f5f5f4;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f4;">
      ${spacer(40)}
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e7e5e4;">
            <tr>
              <td style="background-color:${ACCENT};padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:bold;font-family:Georgia,'Times New Roman',serif;">Křesťanský sbor Brno</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;color:#292524;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#fafaf9;border-top:1px solid #e7e5e4;">
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#a8a29e;">Křesťanský sbor Brno &middot; Šámalova 15a, Brno</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ${spacer(40)}
    </table>
  </body>
</html>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="border-radius:10px;background-color:${ACCENT};">
        <a href="${href}" style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

export function resetPasswordEmailHtml(link: string): string {
  return shell(`
    <h1 style="margin:0 0 12px;font-size:20px;font-family:Georgia,'Times New Roman',serif;color:#1c1917;">Obnova hesla</h1>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;">Pro nastavení nového hesla klikněte na tlačítko níže. Odkaz je <strong>platný 1 hodinu</strong>.</p>
    ${button(link, 'Nastavit nové heslo')}
    <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#78716c;">Pokud jste o obnovu hesla nežádali, tento e-mail ignorujte — vaše heslo zůstane beze změny.</p>
  `);
}
