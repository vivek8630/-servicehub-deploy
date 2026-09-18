const { execSync } = require('child_process');
console.log('Generating migration...');
try {
  const output = execSync('npx prisma migrate dev --name init --skip-seed', { 
    env: { ...process.env, PRISMA_TELEMETRY_DISABLED: '1', CI: '1' },
    stdio: 'inherit'
  });
  console.log('Migration generated successfully.');
} catch (error) {
  console.error('Error generating migration:', error);
}
