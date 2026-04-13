import type { HttpRequest } from '@azure/functions';

export interface ClientPrincipal {
  userId: string;
  userDetails: string;
  userRoles: string[];
  identityProvider: string;
}

export function getAuthUser(req: HttpRequest): ClientPrincipal | null {
  const header = req.headers.get('x-ms-client-principal');
  if (!header) {
    // Local dev fallback
    return {
      userId: 'local-dev-user',
      userDetails: 'developer',
      userRoles: ['authenticated', 'anonymous'],
      identityProvider: 'github',
    };
  }

  try {
    const decoded = Buffer.from(header, 'base64').toString('utf8');
    return JSON.parse(decoded) as ClientPrincipal;
  } catch {
    return null;
  }
}
