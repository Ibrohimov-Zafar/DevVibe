import { Pool } from 'pg';

let pool;

if (!pool) {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }
  
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      // Render kabi xizmatlar uchun SSL kerak
      rejectUnauthorized: false,
    },
  });
}

export default pool;
