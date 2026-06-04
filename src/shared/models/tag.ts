import { like, and, count, desc, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { tag, buildTag } from '@/config/db/schema';

export type Tag = typeof tag.$inferSelect;
export type NewTag = typeof tag.$inferInsert;
export type UpdateTag = Partial<Omit<NewTag, 'id' | 'createdAt'>>;

export async function addTag(data: NewTag) {
  const [result] = await db().insert(tag).values(data).returning();
  return result;
}

export async function updateTag(id: string, data: UpdateTag) {
  const [result] = await db()
    .update(tag)
    .set(data)
    .where(eq(tag.id, id))
    .returning();
  return result;
}

export async function findTag({
  id,
  slug,
}: {
  id?: string;
  slug?: string;
}) {
  const [result] = await db()
    .select()
    .from(tag)
    .where(
      and(
        id ? eq(tag.id, id) : undefined,
        slug ? eq(tag.slug, slug) : undefined,
      )
    )
    .limit(1);
  return result;
}

export async function getTags({
  query,
  limit = 100,
}: {
  query?: string;
  limit?: number;
} = {}) {
  const result = await db()
    .select()
    .from(tag)
    .where(
      query ? like(tag.name, `%${query}%`) : undefined
    )
    .orderBy(desc(tag.buildCount), desc(tag.createdAt))
    .limit(limit);

  return result;
}

export async function getTagsCount({
  query,
}: {
  query?: string;
} = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(tag)
    .where(
      query ? like(tag.name, `%${query}%`) : undefined
    )
    .limit(1);

  return result?.count || 0;
}

export async function getBuildTags(buildId: string) {
  const result = await db()
    .select({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })
    .from(buildTag)
    .leftJoin(tag, eq(buildTag.tagId, tag.id))
    .where(eq(buildTag.buildId, buildId));

  return result;
}

export async function addBuildTag(buildId: string, tagId: string) {
  const [result] = await db()
    .insert(buildTag)
    .values({ buildId, tagId })
    .returning();
  return result;
}

export async function removeBuildTag(buildId: string, tagId: string) {
  const result = await db()
    .delete(buildTag)
    .where(
      and(
        eq(buildTag.buildId, buildId),
        eq(buildTag.tagId, tagId)
      )
    );
  return result;
}

export async function removeAllBuildTags(buildId: string) {
  const result = await db()
    .delete(buildTag)
    .where(eq(buildTag.buildId, buildId));
  return result;
}

export async function incrementTagBuildCount(id: string) {
  return await db()
    .update(tag)
    .set({
      buildCount: sql`${tag.buildCount} + 1`,
    })
    .where(eq(tag.id, id));
}

export async function decrementTagBuildCount(id: string) {
  return await db()
    .update(tag)
    .set({
      buildCount: sql`CASE WHEN ${tag.buildCount} > 0 THEN ${tag.buildCount} - 1 ELSE 0 END`,
    })
    .where(eq(tag.id, id));
}
