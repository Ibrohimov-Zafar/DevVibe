import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const validateProjectData = (data) => {
  const { name, description } = data;
  if (!name || !description) {
    return { valid: false, error: 'Nom va tavsif majburiy' };
  }
  return { valid: true };
};

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM projects ORDER BY created_at DESC');
      return NextResponse.json({ success: true, data: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Loyihalarni yuklashda xatolik' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validateProjectData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      progress,
      budget,
      client: clientName,
      technologies,
      team_members,
    } = body;

    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO projects (name, description, status, priority, start_date, end_date, progress, budget, client, technologies, team_members) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [
          name,
          description,
          status || 'planning',
          priority || 'medium',
          startDate,
          endDate,
          parseInt(progress) || 0,
          parseFloat(budget) || 0,
          clientName,
          technologies,
          team_members,
        ]
      );
      return NextResponse.json({ success: true, data: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Loyiha qo‘shishda xatolik' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      progress,
      budget,
      client: clientName,
      technologies,
      team_members,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID majburiy' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE projects SET name=$1, description=$2, status=$3, priority=$4, start_date=$5, end_date=$6, progress=$7, budget=$8, client=$9, technologies=$10, team_members=$11, updated_at=NOW() WHERE id=$12 RETURNING *',
        [
          name,
          description,
          status,
          priority,
          startDate,
          endDate,
          parseInt(progress),
          parseFloat(budget),
          clientName,
          technologies,
          team_members,
          id,
        ]
      );

      if (result.rowCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Loyiha topilmadi' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Loyiha yangilashda xatolik' },
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
        { success: false, error: 'Noto‘g‘ri ID' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);

      if (result.rowCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Loyiha topilmadi' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, message: 'Loyiha o‘chirildi' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Loyiha o‘chirishda xatolik' },
      { status: 500 }
    );
  }
}