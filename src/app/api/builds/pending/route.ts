import { db } from '@/core/db';
import { build, style, creator } from '@/config/db/schema';
import { BuildStatus } from '@/shared/models/build-types';
import { getSessionUser } from '@/shared/lib/session';
import { hasPermission } from '@/shared/services/rbac';
import { respData, respErr } from '@/shared/lib/resp';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return respErr('Unauthorized');
    }

    const isAdmin = await hasPermission(user.id, 'admin.builds');
    if (!isAdmin) {
      return respErr('Admin permission required');
    }

    const rows = await db()
      .select({
        id: build.id,
        slug: build.slug,
        title: build.title,
        description: build.description,
        images: build.images,
        status: build.status,
        lotSize: build.lotSize,
        floors: build.floors,
        bedrooms: build.bedrooms,
        bathrooms: build.bathrooms,
        budget: build.budget,
        createdAt: build.createdAt,
        updatedAt: build.updatedAt,
        styleName: style.name,
        creatorName: creator.name,
      })
      .from(build)
      .leftJoin(style, eq(build.styleId, style.id))
      .leftJoin(creator, eq(build.creatorId, creator.id))
      .where(eq(build.status, BuildStatus.PENDING))
      .orderBy(desc(build.createdAt));

    return respData({ builds: rows });
  } catch (e) {
    console.error('get pending builds failed:', e);
    return respErr('Failed to fetch pending builds');
  }
}
