module.exports = async function (context, req) {
  const hasCS = !!process.env.COSMOS_CONNECTION_STRING;
  let cosmosOk = false;
  let cosmosError = null;

  if (hasCS) {
    try {
      const { CosmosClient } = require("@azure/cosmos");
      const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
      const { resource } = await client.database("PrepTracker").read();
      cosmosOk = !!resource;
    } catch (err) {
      cosmosError = err.message;
    }
  }

  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      status: "ok",
      timestamp: new Date().toISOString(),
      hasConnectionString: hasCS,
      cosmosConnected: cosmosOk,
      cosmosError: cosmosError,
      nodeVersion: process.version,
    },
  };
};
