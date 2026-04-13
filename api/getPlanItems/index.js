const { getPlanItemsContainer, getAuthUser } = require("../shared/cosmos");

module.exports = async function (context, req) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      context.res = { status: 401, body: { error: "Unauthorized" } };
      return;
    }

    const trackId = req.query.trackId;
    const container = getPlanItemsContainer();

    let query = "SELECT * FROM c WHERE c.userId = @userId";
    const parameters = [{ name: "@userId", value: user.userId }];

    if (trackId) {
      query += " AND c.trackId = @trackId";
      parameters.push({ name: "@trackId", value: trackId });
    }
    query += ' ORDER BY c["order"]';

    const { resources } = await container.items.query({ query, parameters }).fetchAll();

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: resources,
    };
  } catch (err) {
    context.log.error("getPlanItems error:", err);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: err.message, hasCosmosCS: !!process.env.COSMOS_CONNECTION_STRING },
    };
  }
};
