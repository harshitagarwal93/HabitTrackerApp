const { getUserStatsContainer, getAuthUser } = require("../shared/cosmos");

module.exports = async function (context, req) {
  try {
    const user = getAuthUser(req);
    if (!user) { context.res = { status: 401, body: { error: "Unauthorized" } }; return; }

    const container = getUserStatsContainer();
    let stats;
    try {
      const { resource } = await container.item("stats", user.userId).read();
      stats = resource;
    } catch { stats = null; }

    if (!stats) {
      stats = { id: "stats", userId: user.userId, currentStreak: 0, longestStreak: 0, lastActivityDate: "", totalCompleted: 0, badges: [], weeklyActivity: {}, trackStats: { azure: { completed: 0, total: 0 }, cp: { completed: 0, total: 0 }, csharp: { completed: 0, total: 0 } } };
      await container.items.upsert(stats);
    }

    context.res = { status: 200, headers: { "Content-Type": "application/json" }, body: stats };
  } catch (err) {
    context.log.error("getUserStats error:", err);
    context.res = { status: 500, body: { error: err.message } };
  }
};
