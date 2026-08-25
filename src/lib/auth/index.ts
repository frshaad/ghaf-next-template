import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth/minimal';
import { nextCookies } from 'better-auth/next-js';
import { haveIBeenPwned, lastLoginMethod } from 'better-auth/plugins';

import { env } from '@/env';
import prisma from '@/lib/prisma';

import { hashPassword as hash, verifyPassword as verify } from './argon2';

const SESSION = {
  expiresIn: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 1 day
  freshAge: 15 * 60, // 15 minutes
  cookieCacheMaxAge: 5 * 60, // 5 minutes
} as const;

const PASSWORD_RESET = {
  tokenExpiresIn: 60 * 60, // 1 hour
} as const;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  session: {
    expiresIn: SESSION.expiresIn,
    updateAge: SESSION.updateAge,
    freshAge: SESSION.freshAge,

    cookieCache: {
      enabled: true,
      maxAge: SESSION.cookieCacheMaxAge,
    },
  },

  emailAndPassword: {
    enabled: true,
    password: { hash, verify },
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: PASSWORD_RESET.tokenExpiresIn,
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github'],
    },
  },

  experimental: { joins: true },

  plugins: [
    lastLoginMethod(),

    haveIBeenPwned({
      enabled: process.env.NODE_ENV === 'production',
      customPasswordCompromisedMessage: 'Please choose a more secure password.',
    }),

    nextCookies(),
  ],

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
});

export type Session = typeof auth.$Infer.Session;
export type Provider = keyof typeof auth.options.socialProviders;
