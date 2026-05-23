const { MongoClient } = require('mongodb');

const DB_TO_DELETE = ['down', 'house_rental', 'price', 'pricepulse'];
const URL = 'mongodb://localhost:27017';

async function cleanup() {
  const client = new MongoClient(URL);
  try {
    await client.connect();
    console.log('🚀 Connected to MongoDB for Heavy-Duty Cleanup...');

    for (const dbName of DB_TO_DELETE) {
      const db = client.db(dbName);
      console.log(`🗑️  Dropping database: ${dbName}...`);
      await db.dropDatabase();
    }

    console.log('✅ CLEANUP COMPLETE! All old databases are gone.');
  } catch (error) {
    console.error('❌ Cleanup Failed:', error.message);
  } finally {
    await client.close();
    process.exit(0);
  }
}

cleanup();
