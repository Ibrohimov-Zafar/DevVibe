import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM portfolio_items ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json({ success: false, error: 'Portfolio ma\'lumotlarini yuklashda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { title, description, image, technologies, website_url, github_url, featured } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Sarlavha va tavsif majburiy' }, { status: 400 });
    }
    
    const result = await client.query(
      'INSERT INTO portfolio_items (title, description, image, technologies, website_url, github_url, featured) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, image, technologies, website_url, github_url, featured]
    );
    
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json({ success: false, error: 'Portfolio qo\'shishda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { id, title, description, image, technologies, website_url, github_url, featured } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID majburiy' }, { status: 400 });
    }
    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'Sarlavha va tavsif majburiy' }, { status: 400 });
    }
    
    const result = await client.query(
      'UPDATE portfolio_items SET title=$1, description=$2, image=$3, technologies=$4, website_url=$5, github_url=$6, featured=$7, updated_at=NOW() WHERE id=$8 RETURNING *',
      [title, description, image, technologies, website_url, github_url, featured, id]
    );
    
    if (result.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Portfolio topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json({ success: false, error: 'Portfolio yangilashda xatolik' }, { status: 500 });
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
    
    const result = await client.query('DELETE FROM portfolio_items WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Portfolio topilmadi' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Portfolio o\'chirildi' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json({ success: false, error: 'Portfolio o\'chirishda xatolik' }, { status: 500 });
  } finally {
    client.release();
  }
}
