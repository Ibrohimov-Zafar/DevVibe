import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

// Input validation helper function
const validatePostData = (data) => {
  const { title, content, excerpt, image, category, tags, status, featured } = data;
  if (!title || !content) {
    return { valid: false, error: 'Title and content are required' };
  }
  if (status && !['draft', 'published'].includes(status)) {
    return { valid: false, error: 'Invalid status value' };
  }
  return { valid: true };
};

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM posts ORDER BY created_at DESC');
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Postlarni yuklashda xatolik' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const validation = validatePostData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { title, content, excerpt, image, category, tags, status, featured } = body;
    const author_id = 1; // TODO: Keyinchalik autentifikatsiyadan olinadi
    const published_at = status === 'published' ? new Date() : null;

    // Foydalanuvchi mavjudligini tekshirish va kerak bo'lsa yaratish
    const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [author_id]);
    if (userCheck.rowCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('zafar27112004', salt);
      await client.query(
        "INSERT INTO users (id, name, email, password_hash) VALUES ($1, 'Admin User', 'ibragimovzafar001@gmail.com', $2)",
        [author_id, hashedPassword]
      );
    }

    const result = await client.query(
      'INSERT INTO posts (title, content, excerpt, image, category, tags, status, featured, author_id, published_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [title, content, excerpt, image, category, tags, status, featured, author_id, published_at]
    );
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Post qo\'shishda xatolik' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing post ID' },
        { status: 400 }
      );
    }

    const validation = validatePostData(updateData);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { title, content, excerpt, image, category, tags, status, featured } = updateData;
    
    // published_at ni to'g'ri boshqarish
    let published_at = null;
    if (status === 'published') {
      // Agar status 'published' ga o'zgartirilsa, hozirgi vaqtni qo'yish
      published_at = new Date();
    } else {
      // Agar draft ga qaytarilsa, oldingi published_at ni saqlash
      const oldPost = await client.query('SELECT published_at FROM posts WHERE id = $1', [id]);
      published_at = oldPost.rows[0]?.published_at || null;
    }

    const result = await client.query(
      'UPDATE posts SET title = $1, content = $2, excerpt = $3, image = $4, category = $5, tags = $6, status = $7, featured = $8, updated_at = NOW(), published_at = $9 WHERE id = $10 RETURNING *',
      [title, content, excerpt, image, category, tags, status, featured, published_at, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Post topilmadi' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Post yangilashda xatolik' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing post ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Post topilmadi' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: 'Post o\'chirildi' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Post o\'chirishda xatolik' },
      { status: 500 }
    );
  }
}