import type { UserStats, PlanItem, Badge, TrackId } from '../types/plan.js';
import { getUserStatsContainer, getPlanItemsContainer } from './cosmosClient.js';

function getWeekKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - jan1.getTime()) / 86400000);
  const weekNumber = Math.ceil((days + jan1.getDay() + 1) / 7);
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export async function getOrCreateStats(userId: string): Promise<UserStats> {
  const container = getUserStatsContainer();
  try {
    const { resource } = await container.item('stats', userId).read<UserStats>();
    if (resource) return resource;
  } catch {
    // Does not exist yet
  }

  const initial: UserStats = {
    id: 'stats',
    userId,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    totalCompleted: 0,
    badges: [],
    weeklyActivity: {},
    trackStats: {
      azure: { completed: 0, total: 0 },
      cp: { completed: 0, total: 0 },
    },
  };

  await container.items.upsert(initial);
  return initial;
}

export async function recalculateStats(userId: string): Promise<UserStats> {
  const stats = await getOrCreateStats(userId);
  const container = getPlanItemsContainer();

  const { resources: items } = await container.items
    .query<PlanItem>({
      query: 'SELECT * FROM c WHERE c.userId = @userId AND c.type = "topic"',
      parameters: [{ name: '@userId', value: userId }],
    })
    .fetchAll();

  // Track stats
  const trackStats: Record<TrackId, { completed: number; total: number }> = {
    azure: { completed: 0, total: 0 },
    cp: { completed: 0, total: 0 },
  };

  for (const item of items) {
    if (item.trackId in trackStats) {
      trackStats[item.trackId].total++;
      if (item.status === 'completed') {
        trackStats[item.trackId].completed++;
      }
    }
  }

  const totalCompleted = Object.values(trackStats).reduce((s, t) => s + t.completed, 0);

  // Streak calculation
  const today = getTodayStr();
  let currentStreak = stats.currentStreak;
  let longestStreak = stats.longestStreak;

  if (stats.lastActivityDate !== today) {
    const lastDate = stats.lastActivityDate ? new Date(stats.lastActivityDate) : null;
    const todayDate = new Date(today);

    if (lastDate) {
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
  }

  // Weekly activity
  const weekKey = getWeekKey();
  const weeklyActivity = { ...stats.weeklyActivity };
  weeklyActivity[weekKey] = (weeklyActivity[weekKey] || 0) + 1;

  const updated: UserStats = {
    ...stats,
    trackStats,
    totalCompleted,
    currentStreak,
    longestStreak,
    lastActivityDate: today,
    weeklyActivity,
  };

  await getUserStatsContainer().items.upsert(updated);
  return updated;
}

export async function checkBadges(stats: UserStats, items: PlanItem[]): Promise<Badge[]> {
  const earnedIds = new Set(stats.badges.map(b => b.id));
  const newBadges: Badge[] = [];

  const definitions = [
    { id: 'first-steps', name: 'First Steps', icon: '👣', desc: 'Complete your first item', check: () => stats.totalCompleted >= 1 },
    { id: 'getting-warm', name: 'Getting Warm', icon: '🔥', desc: 'Complete 10 items', check: () => stats.totalCompleted >= 10 },
    {
      id: 'halfway-there', name: 'Halfway There', icon: '⚡', desc: 'Reach 50% completion',
      check: () => {
        const total = Object.values(stats.trackStats).reduce((s, t) => s + t.total, 0);
        const done = Object.values(stats.trackStats).reduce((s, t) => s + t.completed, 0);
        return total > 0 && done >= total * 0.5;
      },
    },
    { id: 'week-warrior', name: 'Week Warrior', icon: '🗡️', desc: '7-day streak', check: () => stats.longestStreak >= 7 },
    { id: 'month-master', name: 'Month Master', icon: '👑', desc: '30-day streak', check: () => stats.longestStreak >= 30 },
    {
      id: 'azure-apprentice', name: 'Azure Apprentice', icon: '☁️', desc: 'Complete Azure Phase 1',
      check: () => {
        const p1 = items.find(i => i.trackId === 'azure' && i.type === 'phase' && i.order === 1);
        if (!p1) return false;
        const topics = items.filter(i => i.parentId === p1.id && i.type === 'topic');
        return topics.length > 0 && topics.every(i => i.status === 'completed');
      },
    },
    {
      id: 'algorithm-initiate', name: 'Algorithm Initiate', icon: '🧮', desc: 'Complete CP Phase 1',
      check: () => {
        const p1 = items.find(i => i.trackId === 'cp' && i.type === 'phase' && i.order === 1);
        if (!p1) return false;
        const topics = items.filter(i => i.parentId === p1.id && i.type === 'topic');
        return topics.length > 0 && topics.every(i => i.status === 'completed');
      },
    },
    {
      id: 'track-finisher', name: 'Track Finisher', icon: '🏆', desc: 'Complete an entire track',
      check: () => Object.values(stats.trackStats).some(t => t.total > 0 && t.completed === t.total),
    },
    {
      id: 'completionist', name: 'Completionist', icon: '🌟', desc: '100% completion',
      check: () => {
        const total = Object.values(stats.trackStats).reduce((s, t) => s + t.total, 0);
        const done = Object.values(stats.trackStats).reduce((s, t) => s + t.completed, 0);
        return total > 0 && done === total;
      },
    },
  ];

  for (const def of definitions) {
    if (!earnedIds.has(def.id) && def.check()) {
      newBadges.push({ id: def.id, name: def.name, icon: def.icon, description: def.desc, earnedAt: new Date().toISOString() });
    }
  }

  if (newBadges.length > 0) {
    const updated = { ...stats, badges: [...stats.badges, ...newBadges] };
    await getUserStatsContainer().items.upsert(updated);
  }

  return newBadges;
}
