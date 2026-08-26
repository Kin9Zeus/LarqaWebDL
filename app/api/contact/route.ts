import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

type Payload = {
  nombre: string;
  apellido: string;
  email: string;
  whatsapp: string;
  service: string;
  preference: string;
  message: string;
  locale?: string;
};

const MAX = { short: 120, message: 4000 };

/** Everything below is interpolated into an HTML email, so it must be escaped. */
function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clean(value: unknown, limit: number): string {
  return String(value ?? '').trim().slice(0, limit);
}

function validate(body: Partial<Payload>): { ok: true; data: Payload } | { ok: false; error: string } {
  const data: Payload = {
    nombre: clean(body.nombre, MAX.short),
    apellido: clean(body.apellido, MAX.short),
    email: clean(body.email, MAX.short),
    whatsapp: clean(body.whatsapp, MAX.short),
    service: clean(body.service, MAX.short),
    preference: clean(body.preference, 20),
    message: clean(body.message, MAX.message),
    locale: clean(body.locale, 5) || 'es',
  };

  for (const key of ['nombre', 'apellido', 'email', 'message'] as const) {
    if (!data[key]) return { ok: false, error: `Missing field: ${key}` };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
    return { ok: false, error: 'Invalid email' };
  }
  return { ok: true, data };
}

function buildHtml(d: Payload): string {
  const preferenceLabel =
    d.preference === 'both'
      ? 'Ambos (Email y WhatsApp)'
      : d.preference === 'whatsapp'
        ? 'WhatsApp'
        : 'Email';

  const rows: Array<[string, string]> = [
    ['Nombre', `${d.nombre} ${d.apellido}`],
    ['Email', d.email],
    ['WhatsApp', d.whatsapp || '—'],
    ['Servicio de interés', d.service || '—'],
    ['Prefiere contacto por', preferenceLabel],
    ['Idioma del sitio', d.locale === 'en' ? 'Inglés' : 'Español'],
  ];

  const tableRows = rows
    .map(
      ([label, value], i) => `
        <tr style="background-color:${i % 2 === 0 ? '#f7f7f5' : '#ffffff'};">
          <td style="padding:12px 14px;border:1px solid #e6e4e0;font-weight:600;width:38%;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border:1px solid #e6e4e0;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');

  return `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1a1a1a;max-width:640px;margin:0 auto;">
      <h2 style="font-size:20px;border-bottom:2px solid #e4a853;padding-bottom:12px;margin:0 0 20px;">
        Nueva solicitud desde larqa.co
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${tableRows}</table>
      <h3 style="font-size:15px;margin:28px 0 10px;">Mensaje</h3>
      <p style="background:#f7f7f5;padding:16px;border-left:3px solid #e4a853;white-space:pre-wrap;font-size:14px;line-height:1.6;margin:0;">${escapeHtml(d.message)}</p>
      <p style="font-size:12px;color:#8e8c88;margin-top:28px;border-top:1px solid #eee;padding-top:12px;">
        Enviado automáticamente desde el formulario de LARQA.
      </p>
    </div>`;
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return NextResponse.json({ message: 'Email service unavailable' }, { status: 503 });
  }

  let body: Partial<Payload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }
  const d = result.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'Larqa Web <info@larqa.co>',
      to: ['larqa.arquitectura@gmail.com'],
      replyTo: d.email,
      subject: `Nueva solicitud — ${d.nombre} ${d.apellido} · ${d.service || 'Sin servicio'}`,
      html: buildHtml(d),
    });

    if (error) {
      console.error('Resend rejected the message:', error);
      return NextResponse.json({ message: 'Email provider error' }, { status: 502 });
    }

    return NextResponse.json({ message: 'Sent' }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error sending contact email:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
