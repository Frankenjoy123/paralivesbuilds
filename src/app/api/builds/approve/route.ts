import { db } from '@/core/db';
import { build } from '@/config/db/schema';
import { BuildStatus } from '@/shared/models/build-types';
import { getSessionUser } from '@/shared/lib/session';
import { hasPermission } from '@/shared/services/rbac';
import { respData, respErr } from '@/shared/lib/resp';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return respErr('Unauthorized');
    }

    const isAdmin = await hasPermission(user.id, 'admin.builds');
    if (!isAdmin) {
      return respErr('Admin permission required');
    }

    const body = await req.json();
    const { buildId } = body;

    if (!buildId) {
      return respErr('Build ID is required');
    }

    await db()
      .update(build)
      .set({ status: BuildStatus.PUBLISHED, updatedAt: new Date() })
      .where(eq(build.id, buildId));

    return respData({ message: 'Build approved successfully' });
  } catch (e) {
    console.error('approve build failed:', e);
    return respErr('Failed to approve build');
  }
}
