import { and, count, desc, eq, inArray, isNull } from 'drizzle-orm';

import { db } from '@/core/db';
import { gameCategory } from '@/config/db/schema';
import { GameCategoryStatus } from './game-category-types';

export type GameCategory = typeof gameCategory.$inferSelect;
export type NewGameCategory = typeof gameCategory.$inferInsert;
export type UpdateGameCategory = Partial<Omit<NewGameCategory, 'id' | 'createdAt'>>;
export { GameCategoryStatus } from './game-category-types';

export async function addGameCategory(data: NewGameCategory) {
  const [result] = await db().insert(gameCategory).values(data).returning();
  return result;
}

export async function updateGameCategory(id: string, data: UpdateGameCategory) {
  const [result] = await db()
    .update(gameCategory)
    .set(data)
    .where(eq(gameCategory.id, id))
    .returning();
  return result;
}

export async function deleteGameCategory(id: string) {
  const result = await updateGameCategory(id, {
    status: GameCategoryStatus.ARCHIVED,
    deletedAt: new Date(),
  });
  return result;
}

export async function findGameCategory({
  id,
  slug,
  status,
}: {
  id?: string;
  slug?: string;
  status?: GameCategoryStatus;
}) {
  const [result] = await db()
    .select()
    .from(gameCategory)
    .where(
      and(
        id ? eq(gameCategory.id, id) : undefined,
        slug ? eq(gameCategory.slug, slug) : undefined,
        status ? eq(gameCategory.status, status) : undefined,
        isNull(gameCategory.deletedAt)
      )
    )
    .limit(1);
  return result;
}

export async function getGameCategories({
  status,
  page = 1,
  limit = 30,
}: {
  status?: GameCategoryStatus;
  page?: number;
  limit?: number;
} = {}): Promise<GameCategory[]> {
  const result = await db()
    .select()
    .from(gameCategory)
    .where(
      and(
        status ? eq(gameCategory.status, status) : undefined,
        isNull(gameCategory.deletedAt)
      )
    )
    .orderBy(gameCategory.sort, gameCategory.createdAt)
    .limit(limit)
    .offset((page - 1) * limit);

  return result;
}

export async function getGameCategoriesCount({
  status,
}: {
  status?: GameCategoryStatus;
} = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(gameCategory)
    .where(
      and(
        status ? eq(gameCategory.status, status) : undefined,
        isNull(gameCategory.deletedAt)
      )
    )
    .limit(1);

  return result?.count || 0;
}
