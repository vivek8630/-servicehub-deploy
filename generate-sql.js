const { execSync } = require('child_process');
const fs = require('fs');

console.log('Generating migration SQL...');
const sql = execSync('npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script').toString();
fs.writeFileSync('turso-migration.sql', sql);
console.log('Successfully generated turso-migration.sql (' + sql.length + ' bytes)');
