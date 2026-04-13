const { CosmosClient } = require("@azure/cosmos");

// Eagerly initialize on module load to avoid cold-start penalty on first request
const cs = process.env.COSMOS_CONNECTION_STRING;
const client = cs ? new CosmosClient(cs) : null;
const database = client ? client.database("PrepTracker") : null;

function getClient() {
  if (!client) throw new Error("COSMOS_CONNECTION_STRING not set");
  return client;
}

function getPlanItemsContainer() {
  return database.container("planItems");
}

function getUserStatsContainer() {
  return database.container("userStats");
}

async function ensureDatabase() {
  const c = getClient();
  await c.databases.createIfNotExists({ id: "PrepTracker" });
  const db = c.database("PrepTracker");
  await db.containers.createIfNotExists({ id: "planItems", partitionKey: { paths: ["/userId"] } });
  await db.containers.createIfNotExists({ id: "userStats", partitionKey: { paths: ["/userId"] } });
}

function getAuthUser(req) {
  const header = req.headers["x-ms-client-principal"];
  if (!header) {
    return { userId: "local-dev-user", userDetails: "developer" };
  }
  try {
    const decoded = Buffer.from(header, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

module.exports = { getClient, getPlanItemsContainer, getUserStatsContainer, ensureDatabase, getAuthUser };
