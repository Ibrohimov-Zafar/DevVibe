import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request) {
  const { telegramBotToken, telegramChatId } = config;

  if (!telegramBotToken || !telegramChatId) {
    console.error('Telegram Bot Token yoki Chat ID .env.local faylida sozlanmagan');
    return NextResponse.json(
      { success: false, error: 'Serverda konfiguratsiya xatosi.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, phone, subject, message, service, budget } = body;

    // Telegram uchun xabarni formatlash
    let text = `<b>Yangi Xabar 📬</b>\n\n`;
    text += `<b>👤 Ism:</b> ${name}\n`;
    text += `<b>📧 Email:</b> ${email}\n`;
    if (phone) text += `<b>📞 Telefon:</b> ${phone}\n`;
    if (subject) text += `<b>📄 Mavzu:</b> ${subject}\n`;
    if (service) text += `<b>🛠️ Xizmat:</b> ${service}\n`;
    if (budget) text += `<b>💰 Budjet:</b> ${budget}\n\n`;
    text += `<b>📝 Xabar:</b>\n<pre>${message}</pre>`;

    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram API xatosi:', result);
      return NextResponse.json(
        { success: false, error: 'Xabarni yuborib bo\'lmadi.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Xabar muvaffaqiyatli yuborildi!' });
  } catch (error) {
    console.error('Bog\'lanish formasida xatolik:', error);
    return NextResponse.json(
      { success: false, error: 'Serverda ichki xatolik yuz berdi.' },
      { status: 500 }
    );
  }
}
