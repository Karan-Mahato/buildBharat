import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.log(
    'Missing or empty DATABASE_URL. Set DATABASE_URL in backend/.env or the environment. ' +
    'Example: postgres://user:password@host:5432/dbname. If your password has special chars, URL-encode them (e.g. # => %23).'
  );
}


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false},
});

(async ()=>{
    try{
        const res = await pool.query(`
            CREATE TABLE IF NOT EXISTS district_data (
            id SERIAL PRIMARY KEY,
            district_name TEXT UNIQUE,
            data JSONB,
            last_updated TIMESTAMP DEFAULT NOW()
        );    
        `);
        console.log("PostgreSQL connection & schema ready", res.rows[0]);
    }catch(err){
        console.log("PostgreSQL erro:",err);
    }
})();

export default pool;