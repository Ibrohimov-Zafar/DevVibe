import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const client = await pool.connect();
    try {
      const { searchParams } = new URL(request.url);
      const featuredOnly = searchParams.get('featured') === 'true';

      let query = 'SELECT * FROM skills';
      const queryParams = [];

      if (featuredOnly) {
        query += ' WHERE featured = $1';
        queryParams.push(true);
      }

      query += ' ORDER BY level DESC';
      
      const result = await client.query(query, queryParams);
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Ko\'nikmalarni yuklashda xatolik' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await pool.connect();
    try {
      const { name, icon } = await request.json();
      if (!name || !icon) {
        return NextResponse.json(
          { success: false, error: 'Barcha maydonlar to\'ldirilishi shart' },
          { status: 400 }
        );
      }
      const result = await client.query(
        'INSERT INTO skills (name, icon, user_id) VALUES ($1, $2, 1) RETURNING *',
        [name, icon]
      );
      return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
    } catch (error) {
      console.error('Error creating skill:', error);
      return NextResponse.json({ success: false, error: 'Server xatoligi' }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Ko\'nikma qo\'shishda xatolik' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, level, icon, category, description, experience, projects_count, color, featured } = body;

    // Validatsiya
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID majburiy' }, { status: 400 });
    }
    if (!name || name.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Nom kamida 3 belgi bo\'lishi kerak' },
        { status: 400 }
      );
    }
    if (level === undefined || isNaN(level) || level < 0 || level > 100) {
      return NextResponse.json(
        { success: false, error: 'Daraja 0 dan 100 gacha bo\'lishi kerak' },
        { status: 400 }
      );
    }
    if (description && description.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Tavsif kamida 5 belgi bo\'lishi kerak' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE skills 
         SET name=$1, icon=$2, level=$3, category=$4, description=$5, experience=$6, 
             projects_count=$7, color=$8, featured=$9, updated_at=NOW() 
         WHERE id=$10 
         RETURNING *`,
        [
          name,
          icon || null,
          parseInt(level),
          category || null,
          description || null,
          experience || null,
          parseInt(projects_count) || 0,
          color || null,
          featured || false,
          id,
        ]
      );

      if (result.rowCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Ko\'nikma topilmadi' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Ko\'nikma muvaffaqiyatli yangilandi',
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Ko\'nikma yangilashda xatolik' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Noto\'g\'ri ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM skills WHERE id = $1 RETURNING id', [id]);
      if (result.rowCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Ko\'nikma topilmadi' },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Ko\'nikma muvaffaqiyatli o\'chirildi',
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { success: false, error: 'Ko\'nikma o\'chirishda xatolik' },
      { status: 500 }
    );
  }
}