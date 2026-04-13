const { CosmosClient } = require("@azure/cosmos");

let client = null;
let database = null;

function getClient() {
  if (!client) {
    const cs = process.env.COSMOS_CONNECTION_STRING;
    if (!cs) throw new Error("COSMOS_CONNECTION_STRING not set");
    client = new CosmosClient(cs);
  }
  return client;
}

function getDatabase() {
  if (!database) database = getClient().database("PrepTracker");
  return database;
}

function getPlanItemsContainer() {
  return getDatabase().container("planItems");
}

function getUserStatsContainer() {
  return getDatabase().container("userStats");
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

module.exports = { getPlanItemsContainer, getUserStatsContainer, ensureDatabase, getAuthUser };
