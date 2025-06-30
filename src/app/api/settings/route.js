import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

// Ma'lumotlarni bazadan front-endga mos formatga o'tkazish
const formatSettingsForFrontend = (dbRow) => {
  return {
    id: dbRow.id,
    user_id: dbRow.user_id,
    theme: dbRow.theme,
    language: dbRow.language,
    notifications: {
      email: dbRow.notifications_email,
      push: dbRow.notifications_push,
    },
    privacy: {
      profileVisibility: dbRow.privacy_profile_visibility,
    },
    security: {
      sessionTimeout: dbRow.security_session_timeout || 30,
    },
    display: {
      postsPerPage: dbRow.display_posts_per_page,
      showAnimations: dbRow.display_animations || true,
    },
    created_at: dbRow.created_at,
    updated_at: dbRow.updated_at,
  };
};

// Ensure default user exists
async function ensureDefaultUser(client) {
  const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [1]);
  if (userCheck.rowCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('zafar27112004', salt);
    await client.query(
      "INSERT INTO users (id, name, email, password_hash) VALUES ($1, 'Admin User', 'ibragimovzafar001@gmail.com', $2)",
      [1, hashedPassword]
    );
  }
}

export async function GET() {
  const client = await pool.connect();
  try {
    await ensureDefaultUser(client);
    
    let result = await client.query('SELECT * FROM settings WHERE user_id = 1 LIMIT 1');
    
    // Agar sozlamalar topilmasa, standart sozlamalarni yaratamiz
    if (result.rows.length === 0) {
      console.log('Foydalanuvchi uchun sozlamalar topilmadi. Standart sozlamalar yaratilmoqda...');
      // Faqat mavjud ustunlar bilan INSERT
      const insertResult = await client.query(
        `INSERT INTO settings (
          user_id, theme, language, notifications_email, notifications_push,
          privacy_profile_visibility, display_posts_per_page
        ) VALUES (
          1, 'auto', 'uz', true, true, 'public', 10
        ) RETURNING *`
      );
      result = insertResult;
    }

    // Ma'lumotlarni front-end uchun formatlab yuborish
    const formattedData = formatSettingsForFrontend(result.rows[0]);
    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Sozlamalarni yuklashda xatolik' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(request) {
  const client = await pool.connect();
  try {
    await ensureDefaultUser(client);
    
    const body = await request.json();
    const {
      theme,
      language,
      notifications,
      privacy,
      security,
      display,
    } = body;

    // Minimal validatsiya
    if (!theme || !language) {
      return NextResponse.json(
        { success: false, error: 'Tema va til majburiy' },
        { status: 400 }
      );
    }

    // Faqat mavjud ustunlarni yangilash
    const result = await client.query(
      `UPDATE settings SET 
        theme = $1, 
        language = $2, 
        notifications_email = $3, 
        notifications_push = $4, 
        privacy_profile_visibility = $5, 
        display_posts_per_page = $6,
        updated_at = NOW() 
      WHERE user_id = 1 RETURNING *`,
      [
        theme,
        language,
        notifications?.email ?? true,
        notifications?.push ?? true,
        privacy?.profileVisibility ?? 'public',
        parseInt(display?.postsPerPage) || 10,
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Sozlamalar topilmadi' },
        { status: 404 }
      );
    }
    
    // Ma'lumotlarni front-end uchun formatlab yuborish
    const formattedData = formatSettingsForFrontend(result.rows[0]);
    return NextResponse.json({
      success: true,
      data: formattedData,
      message: 'Sozlamalar muvaffaqiyatli saqlandi',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Sozlamalarni saqlashda xatolik' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}