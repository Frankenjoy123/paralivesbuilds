import { nanoid } from 'nanoid';

import { db } from '@/core/db';
import { build, creator } from '@/config/db/schema';
import { BuildStatus } from '@/shared/models/build-types';
import { getSessionUser } from '@/shared/lib/session';
import { generateUniqueSlug } from '@/shared/lib/slug';
import { respData, respErr } from '@/shared/lib/resp';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return respErr('Please sign in to submit a build');
    }

    const body = await req.json();
    const {
      title,
      description,
      styleId,
      lotSize,
      floors,
      bedrooms,
      bathrooms,
      budget,
      images,
      workshopUrl,
      videoUrl,
    } = body;

    if (!title || !description || !styleId || !images || images.length === 0) {
      return respErr('Title, description, style and at least one image are required');
    }

    // Get or create creator for this user
    const userEmail = user.email || '';
    const userName = user.name || userEmail.split('@')[0] || 'Anonymous';

    let creatorRecord = await db()
      .select()
      .from(creator)
      .where(eq(creator.slug, user.id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!creatorRecord) {
      const newCreatorId = nanoid();
      await db().insert(creator).values({
        id: newCreatorId,
        slug: user.id,
        name: userName,
        bio: '',
        buildsCount: 0,
      });
      creatorRecord = { id: newCreatorId } as any;
    }

    // Generate unique slug
    const existingSlugs = await db()
      .select({ slug: build.slug })
      .from(build);
    const slug = generateUniqueSlug(title, existingSlugs.map((r) => r.slug));

    const now = new Date();
    const newBuildId = nanoid();

    await db().insert(build).values({
      id: newBuildId,
      slug,
      title,
      description,
      styleId,
      lotSize: lotSize || null,
      floors: floors ? Number(floors) : null,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      budget: budget ? Number(budget) : null,
      images: JSON.stringify(images),
      workshopUrl: workshopUrl || null,
      videoUrl: videoUrl || null,
      creatorId: creatorRecord.id,
      featured: false,
      likesCount: 0,
      viewsCount: 0,
      status: BuildStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    });

    return respData({
      id: newBuildId,
      slug,
      message: 'Build submitted successfully! It will be reviewed shortly.',
    });
  } catch (e) {
    console.error('submit build failed:', e);
    return respErr('Failed to submit build');
  }
}
