const { getPlanItemsContainer, getUserStatsContainer, getAuthUser } = require("../shared/cosmos");

module.exports = async function (context, req) {
  try {
    const user = getAuthUser(req);
    if (!user) { context.res = { status: 401, body: { error: "Unauthorized" } }; return; }

    // Fetch plan items and user stats in parallel — single API call from the client
    const [itemsResult, statsResult] = await Promise.all([
      getPlanItemsContainer().items.query({
        query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c["order"]',
        parameters: [{ name: "@userId", value: user.userId }],
      }).fetchAll(),
      getUserStatsContainer().item("stats", user.userId).read().catch(() => ({ resource: null })),
    ]);

    const items = itemsResult.resources;
    const stats = statsResult.resource || {
      id: "stats", userId: user.userId, currentStreak: 0, longestStreak: 0,
      lastActivityDate: "", totalCompleted: 0, badges: [], weeklyActivity: {},
      trackStats: { azure: { completed: 0, total: 0 }, cp: { completed: 0, total: 0 }, csharp: { completed: 0, total: 0 } },
    };

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { items, stats },
    };
  } catch (err) {
    context.log.error("init error:", err);
    context.res = { status: 500, headers: { "Content-Type": "application/json" }, body: { error: err.message } };
  }
};
