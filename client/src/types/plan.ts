export type Status = 'not-started' | 'in-progress' | 'completed';
export type TrackId = 'azure' | 'cp' | 'csharp';
export type PlanItemType = 'track' | 'phase' | 'topic';
export type ResourceType = 'book' | 'docs' | 'video' | 'blog' | 'platform' | 'github';

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  notes?: string;
}

export interface PlanItem {
  id: string;
  userId: string;
  trackId: TrackId;
  parentId: string | null;
  type: PlanItemType;
  title: string;
  description: string;
  status: Status;
  order: number;
  weekRange: string | null;
  resources: Resource[];
  architecturalNotes: string[];
  practiceItems: string[];
  completedAt: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedAt: string;
  description: string;
}

export interface TrackStats {
  completed: number;
  total: number;
}

export interface UserStats {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalCompleted: number;
  badges: Badge[];
  weeklyActivity: Record<string, number>;
  trackStats: Record<TrackId, TrackStats>;
}

export interface TreeNode extends PlanItem {
  children: TreeNode[];
  computedStatus: Status;
  completedCount: number;
  totalCount: number;
}

export interface AuthInfo {
  clientPrincipal: {
    userId: string;
    userDetails: string;
    userRoles: string[];
    identityProvider: string;
    claims: Array<{ typ: string; val: string }>;
  } | null;
}
