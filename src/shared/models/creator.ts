import { like, and, count, desc, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { creator } from '@/config/db/schema';

export type Creator = typeof creator.$inferSelect;
export type NewCreator = typeof creator.$inferInsert;
export type UpdateCreator = Partial<Omit<NewCreator, 'id' | 'createdAt'>>;

export async function addCreator(data: NewCreator) {
  const [result] = await db().insert(creator).values(data).returning();
  return result;
}

export async function updateCreator(id: string, data: UpdateCreator) {
  const [result] = await db()
    .update(creator)
    .set(data)
    .where(eq(creator.id, id))
    .returning();
  return result;
}

export async function findCreator({
  id,
  slug,
}: {
  id?: string;
  slug?: string;
}) {
  const [result] = await db()
    .select()
    .from(creator)
    .where(
      and(
        id ? eq(creator.id, id) : undefined,
        slug ? eq(creator.slug, slug) : undefined,
        isNull(creator.deletedAt)
      )
    )
    .limit(1);
  return result;
}

export async function getCreators({
  query,
  page = 1,
  limit = 30,
}: {
  query?: string;
  page?: number;
  limit?: number;
} = {}) {
  const result = await db()
    .select()
    .from(creator)
    .where(
      and(
        query ? like(creator.name, `%${query}%`) : undefined,
        isNull(creator.deletedAt)
      )
    )
    .orderBy(desc(creator.buildsCount), desc(creator.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return result;
}

export async function getCreatorsCount({
  query,
}: {
  query?: string;
} = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(creator)
    .where(
      and(
        query ? like(creator.name, `%${query}%`) : undefined,
        isNull(creator.deletedAt)
      )
    )
    .limit(1);

  return result?.count || 0;
}

export async function incrementCreatorBuildsCount(id: string) {
  return await db()
    .update(creator)
    .set({
      buildsCount: sql`${creator.buildsCount} + 1`,
    })
    .where(eq(creator.id, id));
}

export async function decrementCreatorBuildsCount(id: string) {
  return await db()
    .update(creator)
    .set({
      buildsCount: sql`CASE WHEN ${creator.buildsCount} > 0 THEN ${creator.buildsCount} - 1 ELSE 0 END`,
    })
    .where(eq(creator.id, id));
}
