import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get('approved') === 'true';

    let query = 'SELECT * FROM testimonials';
    const queryParams = [];

    if (approvedOnly) {
      query += ' WHERE approved = $1';
      queryParams.push(true);
    }

    query += ' ORDER BY created_at DESC';

    const result = await client.query(query, queryParams);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ success: false, error: 'Mijozlar fikrini yuklashda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { name, position, text, avatar, rating } = body;

    if (!name || !text || !rating) {
      return NextResponse.json({ success: false, error: 'Ism, matn va reyting majburiy' }, { status: 400 });
    }
    
    const result = await client.query(
      'INSERT INTO testimonials (name, position, text, avatar, rating, approved) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, position, text, avatar, parseInt(rating), true]
    );
    
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ success: false, error: 'Mijoz fikrini qo\'shishda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { id, name, position, text, avatar, rating, approved } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID majburiy' }, { status: 400 });
    }
    
    const result = await client.query(
      'UPDATE testimonials SET name=$1, position=$2, text=$3, avatar=$4, rating=$5, approved=$6 WHERE id=$7 RETURNING *',
      [name, position, text, avatar, parseInt(rating), approved, id]
    );
    
    if (result.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Mijoz fikri topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ success: false, error: 'Mijoz fikrini yangilashda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(request) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    if (!id || isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Noto\'g\'ri ID' }, { status: 400 });
    }
    
    const result = await client.query('DELETE FROM testimonials WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Mijoz fikri topilmadi' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Mijoz fikri o\'chirildi' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ success: false, error: 'Mijoz fikrini o\'chirishda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}
