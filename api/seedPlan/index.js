const { getPlanItemsContainer, getUserStatsContainer, ensureDatabase, getAuthUser } = require("../shared/cosmos");

module.exports = async function (context, req) {
  try {
    const user = getAuthUser(req);
    if (!user) { context.res = { status: 401, body: { error: "Unauthorized" } }; return; }

    await ensureDatabase();
    const container = getPlanItemsContainer();

    // Check if user already has items
    const { resources: existing } = await container.items.query({
      query: "SELECT TOP 1 c.id FROM c WHERE c.userId = @userId",
      parameters: [{ name: "@userId", value: user.userId }],
    }).fetchAll();

    if (existing.length > 0) {
      context.res = { status: 200, headers: { "Content-Type": "application/json" }, body: { seeded: false, count: 0, message: "Already seeded" } };
      return;
    }

    const body = req.body;
    if (!body || !body.items || !Array.isArray(body.items)) {
      context.res = { status: 400, body: { error: "Missing items array" } }; return;
    }

    let count = 0;
    for (const item of body.items) {
      await container.items.upsert({ ...item, userId: user.userId });
      count++;
    }

    // Init stats
    const statsContainer = getUserStatsContainer();
    await statsContainer.items.upsert({
      id: "stats", userId: user.userId, currentStreak: 0, longestStreak: 0, lastActivityDate: "",
      totalCompleted: 0, badges: [], weeklyActivity: {},
      trackStats: { azure: { completed: 0, total: 0 }, cp: { completed: 0, total: 0 }, csharp: { completed: 0, total: 0 } },
    });

    context.res = { status: 200, headers: { "Content-Type": "application/json" }, body: { seeded: true, count } };
  } catch (err) {
    context.log.error("seedPlan error:", err);
    context.res = { status: 500, body: { error: err.message } };
  }
};
