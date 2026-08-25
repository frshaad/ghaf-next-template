import { betterAuth } from '@next-safe-action/adapter-better-auth';
import { createSafeActionClient } from 'next-safe-action';
import z from 'zod';

import { auth } from '@/lib/auth';

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string().min(1),
    });
  },
  handleServerError(error) {
    console.error('Server action error:', error);
    return 'An unexpected error occurred. Please try again.';
  },
});

export const authClient = actionClient.use(betterAuth(auth));
