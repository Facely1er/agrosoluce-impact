/**
 * Run RLS fix script against the database.
 * Requires: DATABASE_URL in .env (postgresql://user:pass@host:5432/postgres)
 *
 * Usage: npx tsx scripts/run-fix-rls.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Load .env manually (no dotenv dep)
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = val;
      }
    }
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env');
    console.error('   Add: DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres');
    process.exit(1);
  }

  // Dynamic import pg (may not be installed)
  let pg: typeof import('pg');
  try {
    pg = await import('pg');
  } catch {
    console.error('❌ pg package not found. Install with: npm install pg');
    process.exit(1);
  }

  const connConfig = {
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('supabase.co') ? { rejectUnauthorized: false } : undefined,
  };
  const client = new pg.Client(connConfig);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const sqlPath = path.join(__dirname, '../packages/database/scripts/fix_rls_linter_0024.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    await client.query(sql);
    console.log('✅ RLS policies updated successfully');
  } catch (err) {
    console.error('❌ Error:', (err as Error).message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
