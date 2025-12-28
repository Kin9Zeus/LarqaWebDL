import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { nombre, apellido, email, whatsapp, service, preference, message } = await req.json();

    const data = await resend.emails.send({
      from: 'Larqa Web <info@larqa.co>',
      to: ['larqa.arquitectura@gmail.com'],
      replyTo: email,
      subject: `Nuevo Cliente Potencial - ${nombre} ${apellido}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4a4a4a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Nueva Solicitud de Contacto</h2>
          <p>Has recibido un nuevo mensaje desde el sitio web de Larqa Arquitectura.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Nombre</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${nombre} ${apellido}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">WhatsApp</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${whatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Servicio de Interés</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${service}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Preferencia de Contacto</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-transform: capitalize;">${preference === 'both' ? 'Ambos (Email y WhatsApp)' : preference}</td>
            </tr>
          </table>

          <h3 style="color: #4a4a4a; margin-top: 20px;">Mensaje:</h3>
          <p style="background-color: #f1f1f1; padding: 15px; border-radius: 5px;">${message}</p>
          
          <p style="font-size: 12px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            Este correo fue enviado automáticamente desde la web de Larqa
          </p>
        </div>
      `,
    });

    if (data.error) {
      console.error('Error sending email:', data.error);
      return NextResponse.json({ message: 'Error sending email', error: data.error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
