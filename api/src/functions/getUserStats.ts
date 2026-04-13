import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { getOrCreateStats } from '../services/statsService.js';
import { getAuthUser } from '../middleware/auth.js';

async function getUserStats(req: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  const user = getAuthUser(req);
  if (!user) {
    return { status: 401, jsonBody: { error: 'Unauthorized' } };
  }

  const stats = await getOrCreateStats(user.userId);
  return { jsonBody: stats };
}

app.http('getUserStats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'user-stats',
  handler: getUserStats,
});
