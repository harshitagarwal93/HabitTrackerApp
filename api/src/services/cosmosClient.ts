import { CosmosClient, type Container, type Database } from '@azure/cosmos';

let client: CosmosClient | null = null;
let database: Database | null = null;

function getClient(): CosmosClient {
  if (!client) {
    const connectionString = process.env.COSMOS_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('COSMOS_CONNECTION_STRING environment variable is required');
    }
    client = new CosmosClient(connectionString);
  }
  return client;
}

function getDatabase(): Database {
  if (!database) {
    database = getClient().database('PrepTracker');
  }
  return database;
}

export function getPlanItemsContainer(): Container {
  return getDatabase().container('planItems');
}

export function getUserStatsContainer(): Container {
  return getDatabase().container('userStats');
}

export async function ensureDatabase(): Promise<void> {
  const client = getClient();
  await client.databases.createIfNotExists({ id: 'PrepTracker' });
  const db = client.database('PrepTracker');
  await db.containers.createIfNotExists({
    id: 'planItems',
    partitionKey: { paths: ['/userId'] },
  });
  await db.containers.createIfNotExists({
    id: 'userStats',
    partitionKey: { paths: ['/userId'] },
  });
}
