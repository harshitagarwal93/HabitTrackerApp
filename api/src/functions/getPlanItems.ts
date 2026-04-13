import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { getPlanItemsContainer } from '../services/cosmosClient.js';
import { getAuthUser } from '../middleware/auth.js';
import type { PlanItem } from '../types/plan.js';

async function getPlanItems(req: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  const user = getAuthUser(req);
  if (!user) {
    return { status: 401, jsonBody: { error: 'Unauthorized' } };
  }

  const trackId = req.query.get('trackId');
  const container = getPlanItemsContainer();

  let query = 'SELECT * FROM c WHERE c.userId = @userId';
  const parameters: Array<{ name: string; value: string }> = [
    { name: '@userId', value: user.userId },
  ];

  if (trackId) {
    query += ' AND c.trackId = @trackId';
    parameters.push({ name: '@trackId', value: trackId });
  }

  query += ' ORDER BY c.order';

  const { resources } = await container.items
    .query<PlanItem>({ query, parameters })
    .fetchAll();

  return { jsonBody: resources };
}

app.http('getPlanItems', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'plan-items',
  handler: getPlanItems,
});
