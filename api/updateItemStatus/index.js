const { getPlanItemsContainer, getUserStatsContainer, getAuthUser } = require("../shared/cosmos");

const VALID_STATUSES = ["not-started", "in-progress", "completed"];

module.exports = async function (context, req) {
  try {
    const user = getAuthUser(req);
    if (!user) { context.res = { status: 401, body: { error: "Unauthorized" } }; return; }

    const id = context.bindingData.id;
    if (!id) { context.res = { status: 400, body: { error: "Missing id" } }; return; }

    const body = req.body;
    if (!body || !body.status || !VALID_STATUSES.includes(body.status)) {
      context.res = { status: 400, body: { error: "Invalid status" } }; return;
    }

    const container = getPlanItemsContainer();
    const { resource: existing } = await container.item(id, user.userId).read();
    if (!existing) { context.res = { status: 404, body: { error: "Not found" } }; return; }

    const updated = {
      ...existing,
      status: body.status,
      completedAt: body.status === "completed" ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.item(id, user.userId).replace(updated);

    // Update stats
    await recalculateStats(user.userId, container);

    context.res = { status: 200, headers: { "Content-Type": "application/json" }, body: resource };
  } catch (err) {
    context.log.error("updateItemStatus error:", err);
    context.res = { status: 500, body: { error: err.message } };
  }
};

async function recalculateStats(userId, planContainer) {
  const statsContainer = getUserStatsContainer();
  let stats;
  try {
    const { resource } = await statsContainer.item("stats", userId).read();
    stats = resource;
  } catch { stats = null; }

  if (!stats) {
    stats = { id: "stats", userId, currentStreak: 0, longestStreak: 0, lastActivityDate: "", totalCompleted: 0, badges: [], weeklyActivity: {}, trackStats: { azure: { completed: 0, total: 0 }, cp: { completed: 0, total: 0 }, csharp: { completed: 0, total: 0 } } };
  }

  const { resources: items } = await planContainer.items.query({ query: 'SELECT * FROM c WHERE c.userId = @userId AND c.type = "topic"', parameters: [{ name: "@userId", value: userId }] }).fetchAll();

  const trackStats = { azure: { completed: 0, total: 0 }, cp: { completed: 0, total: 0 }, csharp: { completed: 0, total: 0 } };
  for (const item of items) {
    if (trackStats[item.trackId]) {
      trackStats[item.trackId].total++;
      if (item.status === "completed") trackStats[item.trackId].completed++;
    }
  }

  const today = new Date().toISOString().split("T")[0];
  let currentStreak = stats.currentStreak;
  let longestStreak = stats.longestStreak;
  if (stats.lastActivityDate !== today) {
    const last = stats.lastActivityDate ? new Date(stats.lastActivityDate) : null;
    const todayDate = new Date(today);
    if (last) {
      const diff = Math.floor((todayDate - last) / 86400000);
      currentStreak = diff === 1 ? currentStreak + 1 : diff > 1 ? 1 : currentStreak;
    } else { currentStreak = 1; }
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  const totalCompleted = Object.values(trackStats).reduce((s, t) => s + t.completed, 0);
  const weeklyActivity = { ...stats.weeklyActivity };
  weeklyActivity[today] = (weeklyActivity[today] || 0) + 1;

  const updated = { ...stats, trackStats, totalCompleted, currentStreak, longestStreak, lastActivityDate: today, weeklyActivity };
  await statsContainer.items.upsert(updated);
}
