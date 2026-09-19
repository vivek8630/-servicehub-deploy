import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!url || !authToken) {
    console.error("Missing URL or token");
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  
  const sql = `
    ALTER TABLE "User" ADD COLUMN "resetToken" TEXT;
    CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");
    ALTER TABLE "User" ADD COLUMN "resetTokenExpiry" DATETIME;

    CREATE TABLE "Coupon" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "code" TEXT NOT NULL,
        "discount" REAL NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "expiryDate" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
    );
    CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
  `;
  
  console.log("Executing migration on Turso database...");
  await client.executeMultiple(sql);
  console.log("Migration applied successfully!");
}

main().catch(console.error);
