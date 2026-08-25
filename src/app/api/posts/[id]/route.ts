import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireOwnerOrThrow } from '@/lib/auth/session';
import { UnauthorizedError } from '@/lib/errors';

export async function GET(req: NextRequest, ctx: RouteContext<'/api/posts/[id]'>) {
  const params = await ctx.params;

  try {
    const _session = await requireOwnerOrThrow(params.id);
    // ...
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    throw error;
  }
}
