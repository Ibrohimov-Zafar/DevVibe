import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Barcha tajriba yozuvlarini olish
export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM experience_timeline ORDER BY year DESC');
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching experience timeline:', error);
    return NextResponse.json({ success: false, error: 'Tajriba yo\'lini yuklashda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}

// Yangi tajriba yozuvini qo'shish
export async function POST(request) {
  const client = await pool.connect();
  try {
    const { year, title, description, icon } = await request.json();
    if (!year || !title) {
      return NextResponse.json({ success: false, error: 'Yil va Sarlavha majburiy' }, { status: 400 });
    }
    const result = await client.query(
      'INSERT INTO experience_timeline (year, title, description, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [year, title, description, icon]
    );
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating experience item:', error);
    return NextResponse.json({ success: false, error: 'Tajriba qo\'shishda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}

// Tajriba yozuvini yangilash
export async function PUT(request) {
  const client = await pool.connect();
  try {
    const { id, year, title, description, icon } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID majburiy' }, { status: 400 });
    }
    const result = await client.query(
      'UPDATE experience_timeline SET year=$1, title=$2, description=$3, icon=$4 WHERE id=$5 RETURNING *',
      [year, title, description, icon, id]
    );
    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Yozuv topilmadi' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating experience item:', error);
    return NextResponse.json({ success: false, error: 'Tajriba yangilashda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}

// Tajriba yozuvini o'chirish
export async function DELETE(request) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    if (!id || isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Noto\'g\'ri ID' }, { status: 400 });
    }
    
    const result = await client.query('DELETE FROM experience_timeline WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Yozuv topilmadi' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Yozuv o\'chirildi' });
  } catch (error) {
    console.error('Error deleting experience item:', error);
    return NextResponse.json({ success: false, error: 'Tajriba o\'chirishda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}