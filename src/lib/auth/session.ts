import type { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import type { Session } from '@/lib/auth';
import { auth } from '@/lib/auth';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors';

const LOGIN_ROUTE = '/login' as Route;

type RequireAuthRedirectOptions = {
  redirectTo?: Route;
  callbackURL?: Route;
};

/** Get session - cached per request */
export const getCurrentSession = cache(async (): Promise<Session | null> => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

/** Require auth or throw - cached */
export const requireAuthOrThrow = cache(async (): Promise<Session> => {
  const session = await getCurrentSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
});

/** Require auth or redirect - cached */
export const requireAuthOrRedirect = cache(
  async (options?: RequireAuthRedirectOptions): Promise<Session> => {
    const session = await getCurrentSession();
    if (session) {
      return session;
    }

    const loginPath = options?.redirectTo ?? LOGIN_ROUTE;
    if (options?.callbackURL !== undefined) {
      redirect(`${loginPath}?redirect=${encodeURIComponent(options.callbackURL)}`);
    }
    redirect(loginPath);
  }
);

export const getCurrentUserOrThrow = cache(async () => {
  return (await requireAuthOrThrow()).user;
});

export const getCurrentUserOrRedirect = cache(async (options?: RequireAuthRedirectOptions) => {
  return (await requireAuthOrRedirect(options)).user;
});

export const requireOwnerOrThrow = cache(async (resourceOwnerId: string) => {
  const session = await requireAuthOrThrow();
  if (session.user.id !== resourceOwnerId) {
    throw new ForbiddenError();
  }
  return session;
});

export function assertOwner(currentUserId: string, ownerId: string) {
  if (currentUserId !== ownerId) {
    throw new ForbiddenError();
  }
}
