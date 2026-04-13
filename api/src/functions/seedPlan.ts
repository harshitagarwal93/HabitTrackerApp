import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { getPlanItemsContainer, ensureDatabase } from '../services/cosmosClient.js';
import { getOrCreateStats } from '../services/statsService.js';
import { getAuthUser } from '../middleware/auth.js';
import type { PlanItem } from '../types/plan.js';

async function seedPlan(req: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  const user = getAuthUser(req);
  if (!user) {
    return { status: 401, jsonBody: { error: 'Unauthorized' } };
  }

  await ensureDatabase();

  const container = getPlanItemsContainer();

  // Check if user already has items
  const { resources: existing } = await container.items
    .query<PlanItem>({
      query: 'SELECT TOP 1 c.id FROM c WHERE c.userId = @userId',
      parameters: [{ name: '@userId', value: user.userId }],
    })
    .fetchAll();

  if (existing.length > 0) {
    return { jsonBody: { seeded: false, count: 0, message: 'User already has plan data' } };
  }

  const body = await req.json() as { items: Omit<PlanItem, 'userId'>[] };
  if (!body.items || !Array.isArray(body.items)) {
    return { status: 400, jsonBody: { error: 'Missing items array' } };
  }

  let count = 0;
  for (const item of body.items) {
    const doc: PlanItem = {
      ...item as PlanItem,
      userId: user.userId,
    };
    await container.items.upsert(doc);
    count++;
  }

  // Initialize stats
  await getOrCreateStats(user.userId);

  return { jsonBody: { seeded: true, count } };
}

app.http('seedPlan', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'seed',
  handler: seedPlan,
});
