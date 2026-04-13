/**
 * CLI seed script for local development.
 * Usage: npx tsx scripts/seed.ts
 *
 * Requires COSMOS_CONNECTION_STRING environment variable or
 * defaults to the local Cosmos emulator.
 */

const API_URL = process.env.API_URL || 'http://localhost:7071';

async function seed() {
  console.log('🌱 Seeding plan data via API...');

  // Dynamic import the seed data (TS module)
  const { seedPlanData } = await import('../client/src/data/seedPlan.js');

  const res = await fetch(`${API_URL}/api/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: seedPlanData }),
  });

  if (!res.ok) {
    console.error(`❌ Seed failed: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.error(body);
    process.exit(1);
  }

  const result = await res.json();
  console.log(`✅ Seed complete:`, result);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
