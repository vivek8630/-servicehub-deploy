import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

async function main() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!url || !authToken) {
    console.error("Missing URL or token");
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  
  const coupons = [
    { code: 'AC10', discount: 10 },
    { code: 'CLEAN20', discount: 20 },
    { code: 'FIXIT15', discount: 15 }
  ];

  for (const c of coupons) {
    try {
      await client.execute({
        sql: `INSERT INTO "Coupon" (id, code, discount, isActive, updatedAt) VALUES (?, ?, ?, ?, ?)`,
        args: [crypto.randomUUID(), c.code, c.discount, 1, new Date().toISOString()]
      });
      console.log(`Added coupon ${c.code}`);
    } catch (e) {
      console.log(`Coupon ${c.code} already exists or error:`, e.message);
    }
  }
}

main().catch(console.error);
