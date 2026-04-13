import type { Badge, UserStats, PlanItem } from '@/types/plan';

export interface BadgeDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  check: (stats: UserStats, items: PlanItem[]) => boolean;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    icon: '👣',
    description: 'Complete your first item',
    check: (stats) => stats.totalCompleted >= 1,
  },
  {
    id: 'getting-warm',
    name: 'Getting Warm',
    icon: '🔥',
    description: 'Complete 10 items',
    check: (stats) => stats.totalCompleted >= 10,
  },
  {
    id: 'halfway-there',
    name: 'Halfway There',
    icon: '⚡',
    description: 'Reach 50% overall completion',
    check: (stats) => {
      const total = Object.values(stats.trackStats).reduce((sum, t) => sum + t.total, 0);
      const completed = Object.values(stats.trackStats).reduce((sum, t) => sum + t.completed, 0);
      return total > 0 && completed >= total * 0.5;
    },
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    icon: '🗡️',
    description: 'Maintain a 7-day streak',
    check: (stats) => stats.longestStreak >= 7,
  },
  {
    id: 'month-master',
    name: 'Month Master',
    icon: '👑',
    description: 'Maintain a 30-day streak',
    check: (stats) => stats.longestStreak >= 30,
  },
  {
    id: 'azure-apprentice',
    name: 'Azure Apprentice',
    icon: '☁️',
    description: 'Complete Azure Phase 1',
    check: (_stats, items) => {
      const azurePhase1Topics = items.filter(
        i => i.trackId === 'azure' && i.type === 'topic' && i.parentId !== null
      );
      const phase1Parent = items.find(
        i => i.trackId === 'azure' && i.type === 'phase' && i.order === 1
      );
      if (!phase1Parent) return false;
      const phase1Topics = azurePhase1Topics.filter(i => i.parentId === phase1Parent.id);
      return phase1Topics.length > 0 && phase1Topics.every(i => i.status === 'completed');
    },
  },
  {
    id: 'algorithm-initiate',
    name: 'Algorithm Initiate',
    icon: '🧮',
    description: 'Complete CP Phase 1',
    check: (_stats, items) => {
      const cpPhase1Parent = items.find(
        i => i.trackId === 'cp' && i.type === 'phase' && i.order === 1
      );
      if (!cpPhase1Parent) return false;
      const cpPhase1Topics = items.filter(i => i.parentId === cpPhase1Parent.id && i.type === 'topic');
      return cpPhase1Topics.length > 0 && cpPhase1Topics.every(i => i.status === 'completed');
    },
  },
  {
    id: 'track-finisher',
    name: 'Track Finisher',
    icon: '🏆',
    description: 'Complete an entire track',
    check: (stats) =>
      Object.values(stats.trackStats).some(t => t.total > 0 && t.completed === t.total),
  },
  {
    id: 'completionist',
    name: 'Completionist',
    icon: '🌟',
    description: '100% completion across all tracks',
    check: (stats) => {
      const total = Object.values(stats.trackStats).reduce((sum, t) => sum + t.total, 0);
      const completed = Object.values(stats.trackStats).reduce((sum, t) => sum + t.completed, 0);
      return total > 0 && completed === total;
    },
  },
];

export function evaluateBadges(stats: UserStats, items: PlanItem[]): Badge[] {
  const earnedIds = new Set(stats.badges.map(b => b.id));
  const newBadges: Badge[] = [];

  for (const def of BADGE_DEFINITIONS) {
    if (!earnedIds.has(def.id) && def.check(stats, items)) {
      newBadges.push({
        id: def.id,
        name: def.name,
        icon: def.icon,
        description: def.description,
        earnedAt: new Date().toISOString(),
      });
    }
  }

  return newBadges;
}
