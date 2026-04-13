import type { PlanItem, UserStats, Status, TrackId, AuthInfo } from '@/types/plan';

const BASE = '';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getAuthInfo: () =>
    request<AuthInfo>('/.auth/me'),

  // Combined init call — fetches items + stats in a single round trip
  init: () =>
    request<{ items: PlanItem[]; stats: UserStats }>('/api/init'),

  getPlanItems: (trackId?: TrackId) => {
    const params = trackId ? `?trackId=${trackId}` : '';
    return request<PlanItem[]>(`/api/plan-items${params}`);
  },

  updateItemStatus: (id: string, status: Status) =>
    request<PlanItem>(`/api/plan-items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getUserStats: () =>
    request<UserStats>('/api/user-stats'),

  seedPlan: (items: Omit<PlanItem, 'userId'>[]) =>
    request<{ seeded: boolean; count: number }>('/api/seed', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
};
