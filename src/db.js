const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL belum di-set, pastikan environment sudah benar.");
}

const pool = new Pool({
  connectionString,
});

async function initDb() {
  // Create table if not exists
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        is_done BOOLEAN DEFAULT FALSE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query("COMMIT");
    console.log("Inisialisasi database selesai.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error initDb:", err);
    throw err;
  } finally {
    client.release();
  }
}

function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
  initDb,
};


