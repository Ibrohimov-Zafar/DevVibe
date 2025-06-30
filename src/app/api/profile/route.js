import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

// Standart foydalanuvchi va profilni ta'minlash uchun yordamchi funksiya
async function ensureDefaultUserAndProfile(client, userId) {
  const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [userId]);
  if (userCheck.rowCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('zafar27112004', salt);
    await client.query(
      "INSERT INTO users (id, name, email, password_hash) VALUES ($1, 'Admin User', 'ibragimovzafar001@gmail.com', $2)",
      [userId, hashedPassword]
    );
  }
  const profileCheck = await client.query('SELECT user_id FROM profiles WHERE user_id = $1', [userId]);
  if (profileCheck.rowCount === 0) {
    await client.query("INSERT INTO profiles (user_id, name, email) VALUES ($1, 'Admin User', 'ibragimovzafar001@gmail.com')", [userId]);
  }
}

export async function GET() {
  const client = await pool.connect();
  try {
    const userId = 1;
    await ensureDefaultUserAndProfile(client, userId);
    
    // Hozircha birinchi foydalanuvchi profilini olamiz (user_id = 1)
    const result = await client.query('SELECT * FROM profiles WHERE user_id = $1 LIMIT 1', [userId]);

    if (result.rows.length === 0) {
      // Bu holat ensureDefaultUserAndProfile tufayli yuzaga kelmasligi kerak
      return NextResponse.json({ success: false, error: 'Profil topilmadi' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Profil ma\'lumotlarini yuklashda xatolik' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(request) {
  const client = await pool.connect();
  try {
    const userId = 1;
    await ensureDefaultUserAndProfile(client, userId);

    const body = await request.json();
    const { name, email, phone, avatar, bio, profession, location, website, birth_date, experience, education, social_github, social_linkedin, social_telegram, social_instagram } = body;
    
    const result = await client.query(
      `UPDATE profiles SET 
        name = $1, email = $2, phone = $3, avatar = $4, bio = $5, profession = $6, 
        location = $7, website = $8, birth_date = $9, experience = $10, education = $11, 
        social_github = $12, social_linkedin = $13, social_telegram = $14, social_instagram = $15, 
        updated_at = NOW() 
      WHERE user_id = $16 RETURNING *`,
      [name, email, phone, avatar, bio, profession, location, website, birth_date, experience, education, social_github, social_linkedin, social_telegram, social_instagram, userId]
    );
    
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Profil muvaffaqiyatli yangilandi'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Profil yangilashda xatolik' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

