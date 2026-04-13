import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { getPlanItemsContainer } from '../services/cosmosClient';
import { getAuthUser } from '../middleware/auth';
import { recalculateStats, getOrCreateStats, checkBadges } from '../services/statsService';
import type { PlanItem, Status } from '../types/plan';

const VALID_STATUSES: Status[] = ['not-started', 'in-progress', 'completed'];

async function updateItemStatus(req: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  const user = getAuthUser(req);
  if (!user) {
    return { status: 401, jsonBody: { error: 'Unauthorized' } };
  }

  const id = req.params.id;
  if (!id) {
    return { status: 400, jsonBody: { error: 'Missing item id' } };
  }

  const body = await req.json() as { status?: string };
  if (!body.status || !VALID_STATUSES.includes(body.status as Status)) {
    return { status: 400, jsonBody: { error: 'Invalid status. Must be: not-started, in-progress, or completed' } };
  }

  const container = getPlanItemsContainer();

  try {
    const { resource: existing } = await container.item(id, user.userId).read<PlanItem>();
    if (!existing) {
      return { status: 404, jsonBody: { error: 'Item not found' } };
    }

    const updated: PlanItem = {
      ...existing,
      status: body.status as Status,
      completedAt: body.status === 'completed' ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.item(id, user.userId).replace(updated);

    // Recalculate stats and check for new badges
    const stats = await recalculateStats(user.userId);
    const allItems = (await container.items
      .query<PlanItem>({
        query: 'SELECT * FROM c WHERE c.userId = @userId',
        parameters: [{ name: '@userId', value: user.userId }],
      })
      .fetchAll()).resources;

    const newBadges = await checkBadges(stats, allItems);

    return {
      jsonBody: {
        ...resource,
        _newBadges: newBadges,
        _stats: stats,
      },
    };
  } catch (err: unknown) {
    const error = err as { code?: number };
    if (error.code === 404) {
      return { status: 404, jsonBody: { error: 'Item not found' } };
    }
    throw err;
  }
}

app.http('updateItemStatus', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'plan-items/{id}',
  handler: updateItemStatus,
});
