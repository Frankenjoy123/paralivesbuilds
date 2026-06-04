import { like, and, count, desc, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { style } from '@/config/db/schema';

export type Style = typeof style.$inferSelect;
export type NewStyle = typeof style.$inferInsert;
export type UpdateStyle = Partial<Omit<NewStyle, 'id' | 'createdAt'>>;

export async function addStyle(data: NewStyle) {
  const [result] = await db().insert(style).values(data).returning();
  return result;
}

export async function updateStyle(id: string, data: UpdateStyle) {
  const [result] = await db()
    .update(style)
    .set(data)
    .where(eq(style.id, id))
    .returning();
  return result;
}

export async function findStyle({
  id,
  slug,
}: {
  id?: string;
  slug?: string;
}) {
  const [result] = await db()
    .select()
    .from(style)
    .where(
      and(
        id ? eq(style.id, id) : undefined,
        slug ? eq(style.slug, slug) : undefined,
      )
    )
    .limit(1);
  return result;
}

export async function getStyles({
  query,
  limit = 100,
}: {
  query?: string;
  limit?: number;
} = {}) {
  const result = await db()
    .select()
    .from(style)
    .where(
      query ? like(style.name, `%${query}%`) : undefined
    )
    .orderBy(style.sortOrder, desc(style.buildCount))
    .limit(limit);

  return result;
}

export async function getStylesCount({
  query,
}: {
  query?: string;
} = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(style)
    .where(
      query ? like(style.name, `%${query}%`) : undefined
    )
    .limit(1);

  return result?.count || 0;
}

export async function incrementStyleBuildCount(id: string) {
  return await db()
    .update(style)
    .set({
      buildCount: sql`${style.buildCount} + 1`,
    })
    .where(eq(style.id, id));
}

export async function decrementStyleBuildCount(id: string) {
  return await db()
    .update(style)
    .set({
      buildCount: sql`CASE WHEN ${style.buildCount} > 0 THEN ${style.buildCount} - 1 ELSE 0 END`,
    })
    .where(eq(style.id, id));
}
