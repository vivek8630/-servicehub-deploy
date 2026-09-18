import { createClient } from '@libsql/client';
import fs from 'fs';

async function main() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!url || !authToken) {
    console.error("Missing URL or token");
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const sql = fs.readFileSync('turso-migration.sql', 'utf8');
  
  console.log("Executing migration on Turso database...");
  await client.executeMultiple(sql);
  console.log("Migration applied successfully!");
}

main().catch(console.error);
