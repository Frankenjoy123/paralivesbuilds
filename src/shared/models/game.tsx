import { like, and, count, desc, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { game, gameCategory } from '@/config/db/schema';

export type Game = typeof game.$inferSelect;
export type NewGame = typeof game.$inferInsert;
export type UpdateGame = Partial<Omit<NewGame, 'id' | 'createdAt'>>;

import { GameStatus } from './game-types';
export { GameStatus };

export async function addGame(data: NewGame) {
  const [result] = await db().insert(game).values(data).returning();
  return result;
}

export async function updateGame(id: string, data: UpdateGame) {
  const [result] = await db()
    .update(game)
    .set(data)
    .where(eq(game.id, id))
    .returning();
  return result;
}

export async function deleteGame(id: string) {
  const result = await updateGame(id, {
    status: GameStatus.ARCHIVED,
    deletedAt: new Date(),
  });
  return result;
}

export async function findGame({
  id,
  slug,
  status,
}: {
  id?: string;
  slug?: string;
  status?: GameStatus;
}) {
  const [result] = await db()
    .select({
      id: game.id,
      categoryId: game.categoryId,
      slug: game.slug,
      title: game.title,
      description: game.description,
      image: game.image,
      content: game.content,
      iframeUrl: game.iframeUrl,
      plays: game.plays,
      likes: game.likes,
      status: game.status,
      sort: game.sort,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
      categoryName: gameCategory.name,
      categorySlug: gameCategory.slug,
    })
    .from(game)
    .leftJoin(gameCategory, eq(game.categoryId, gameCategory.id))
    .where(
      and(
        id ? eq(game.id, id) : undefined,
        slug ? eq(game.slug, slug) : undefined,
        status ? eq(game.status, status) : undefined,
        isNull(game.deletedAt)
      )
    )
    .limit(1);
  return result;
}

export async function getGames({
  categoryId,
  categorySlug,
  status,
  query,
  page = 1,
  limit = 30,
}: {
  categoryId?: string;
  categorySlug?: string;
  status?: GameStatus;
  query?: string;
  page?: number;
  limit?: number;
} = {}): Promise<(Game & { categoryName?: string; categorySlug?: string })[]> {
  const dbQuery = db()
    .select({
      id: game.id,
      categoryId: game.categoryId,
      slug: game.slug,
      title: game.title,
      description: game.description,
      image: game.image,
      content: game.content,
      iframeUrl: game.iframeUrl,
      plays: game.plays,
      likes: game.likes,
      status: game.status,
      sort: game.sort,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
      categoryName: gameCategory.name,
      categorySlug: gameCategory.slug,
    })
    .from(game)
    .leftJoin(gameCategory, eq(game.categoryId, gameCategory.id))
    .where(
      and(
        categoryId ? eq(game.categoryId, categoryId) : undefined,
        categorySlug ? eq(gameCategory.slug, categorySlug) : undefined,
        status ? eq(game.status, status) : undefined,
        query ? like(game.title, `%${query}%`) : undefined,
        isNull(game.deletedAt)
      )
    )
    .orderBy(desc(game.sort), desc(game.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  const result = await dbQuery;
  return result;
}

export async function getGamesCount({
  categoryId,
  categorySlug,
  status,
  query,
}: {
  categoryId?: string;
  categorySlug?: string;
  status?: GameStatus;
  query?: string;
} = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(game)
    .leftJoin(gameCategory, eq(game.categoryId, gameCategory.id))
    .where(
      and(
        categoryId ? eq(game.categoryId, categoryId) : undefined,
        categorySlug ? eq(gameCategory.slug, categorySlug) : undefined,
        status ? eq(game.status, status) : undefined,
        query ? like(game.title, `%${query}%`) : undefined,
        isNull(game.deletedAt)
      )
    )
    .limit(1);

  return result?.count || 0;
}

export async function incrementPlays(id: string) {
  return await db()
    .update(game)
    .set({
      plays: sql`${game.plays} + 1`,
    })
    .where(eq(game.id, id));
}

export async function incrementLikes(id: string) {
  return await db()
    .update(game)
    .set({
      likes: sql`${game.likes} + 1`,
    })
    .where(eq(game.id, id));
}

export async function decrementLikes(id: string) {
  return await db()
    .update(game)
    .set({
      likes: sql`CASE WHEN ${game.likes} > 0 THEN ${game.likes} - 1 ELSE 0 END`,
    })
    .where(eq(game.id, id));
}

export async function searchGames({
  query,
  status,
  limit = 20,
}: {
  query: string;
  status?: GameStatus;
  limit?: number;
}) {
  const result = await db()
    .select({
      id: game.id,
      slug: game.slug,
      title: game.title,
      image: game.image,
      categoryName: gameCategory.name,
      categorySlug: gameCategory.slug,
    })
    .from(game)
    .leftJoin(gameCategory, eq(game.categoryId, gameCategory.id))
    .where(
      and(
        sql`${game.title} LIKE ${`%${query}%`}`,
        status ? eq(game.status, status) : undefined,
        isNull(game.deletedAt)
      )
    )
    .orderBy(desc(game.sort), desc(game.createdAt))
    .limit(limit);

  return result;
}
