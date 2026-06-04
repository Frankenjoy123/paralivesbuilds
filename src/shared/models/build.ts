import { like, and, count, desc, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { build, creator, style, tag, buildTag } from '@/config/db/schema';

export type Build = typeof build.$inferSelect;
export type NewBuild = typeof build.$inferInsert;
export type UpdateBuild = Partial<Omit<NewBuild, 'id' | 'createdAt'>>;

import { BuildStatus } from './build-types';
export { BuildStatus };

export async function addBuild(data: NewBuild) {
  const [result] = await db().insert(build).values(data).returning();
  return result;
}

export async function updateBuild(id: string, data: UpdateBuild) {
  const [result] = await db()
    .update(build)
    .set(data)
    .where(eq(build.id, id))
    .returning();
  return result;
}

export async function deleteBuild(id: string) {
  const result = await updateBuild(id, {
    status: BuildStatus.ARCHIVED,
    deletedAt: new Date(),
  });
  return result;
}

export async function findBuild({
  id,
  slug,
  status,
}: {
  id?: string;
  slug?: string;
  status?: BuildStatus;
}) {
  const [result] = await db()
    .select({
      id: build.id,
      slug: build.slug,
      title: build.title,
      description: build.description,
      styleId: build.styleId,
      lotSize: build.lotSize,
      floors: build.floors,
      bedrooms: build.bedrooms,
      bathrooms: build.bathrooms,
      budget: build.budget,
      images: build.images,
      workshopUrl: build.workshopUrl,
      videoUrl: build.videoUrl,
      creatorId: build.creatorId,
      featured: build.featured,
      likesCount: build.likesCount,
      viewsCount: build.viewsCount,
      status: build.status,
      createdAt: build.createdAt,
      updatedAt: build.updatedAt,
      creatorName: creator.name,
      creatorSlug: creator.slug,
      creatorAvatar: creator.avatar,
      styleName: style.name,
      styleSlug: style.slug,
    })
    .from(build)
    .leftJoin(creator, eq(build.creatorId, creator.id))
    .leftJoin(style, eq(build.styleId, style.id))
    .where(
      and(
        id ? eq(build.id, id) : undefined,
        slug ? eq(build.slug, slug) : undefined,
        status ? eq(build.status, status) : undefined,
        isNull(build.deletedAt)
      )
    )
    .limit(1);
  return result;
}

export async function getBuilds({
  styleId,
  styleSlug,
  tagSlug,
  creatorId,
  featured,
  status,
  query,
  sort = 'newest',
  page = 1,
  limit = 24,
}: {
  styleId?: string;
  styleSlug?: string;
  tagSlug?: string;
  creatorId?: string;
  featured?: boolean;
  status?: BuildStatus;
  query?: string;
  sort?: 'newest' | 'popular' | 'featured';
  page?: number;
  limit?: number;
} = {}): Promise<
  (Build & {
    creatorName?: string;
    creatorSlug?: string;
    creatorAvatar?: string;
    styleName?: string;
    styleSlug?: string;
  })[]
> {
  let dbQuery = db()
    .select({
      id: build.id,
      slug: build.slug,
      title: build.title,
      description: build.description,
      styleId: build.styleId,
      lotSize: build.lotSize,
      floors: build.floors,
      bedrooms: build.bedrooms,
      bathrooms: build.bathrooms,
      budget: build.budget,
      images: build.images,
      workshopUrl: build.workshopUrl,
      videoUrl: build.videoUrl,
      creatorId: build.creatorId,
      featured: build.featured,
      likesCount: build.likesCount,
      viewsCount: build.viewsCount,
      status: build.status,
      createdAt: build.createdAt,
      updatedAt: build.updatedAt,
      creatorName: creator.name,
      creatorSlug: creator.slug,
      creatorAvatar: creator.avatar,
      styleName: style.name,
      styleSlug: style.slug,
    })
    .from(build)
    .leftJoin(creator, eq(build.creatorId, creator.id))
    .leftJoin(style, eq(build.styleId, style.id))
    .where(
      and(
        styleId ? eq(build.styleId, styleId) : undefined,
        styleSlug ? eq(style.slug, styleSlug) : undefined,
        creatorId ? eq(build.creatorId, creatorId) : undefined,
        featured !== undefined ? eq(build.featured, featured) : undefined,
        status ? eq(build.status, status) : undefined,
        query ? like(build.title, `%${query}%`) : undefined,
        isNull(build.deletedAt)
      )
    );

  // Apply tag filter with join if needed
  if (tagSlug) {
    dbQuery = dbQuery
      .leftJoin(buildTag, eq(build.id, buildTag.buildId))
      .leftJoin(tag, eq(buildTag.tagId, tag.id))
      .where(
        and(
          eq(tag.slug, tagSlug),
          isNull(build.deletedAt)
        )
      ) as any;
  }

  // Apply sorting
  if (sort === 'popular') {
    dbQuery = dbQuery.orderBy(desc(build.likesCount), desc(build.createdAt));
  } else if (sort === 'featured') {
    dbQuery = dbQuery.orderBy(desc(build.featured), desc(build.createdAt));
  } else {
    dbQuery = dbQuery.orderBy(desc(build.createdAt));
  }

  dbQuery = dbQuery.limit(limit).offset((page - 1) * limit);

  const result = await dbQuery;
  return result;
}

export async function getBuildsCount({
  styleId,
  styleSlug,
  tagSlug,
  creatorId,
  featured,
  status,
  query,
}: {
  styleId?: string;
  styleSlug?: string;
  tagSlug?: string;
  creatorId?: string;
  featured?: boolean;
  status?: BuildStatus;
  query?: string;
} = {}): Promise<number> {
  let dbQuery = db()
    .select({ count: count() })
    .from(build)
    .leftJoin(creator, eq(build.creatorId, creator.id))
    .leftJoin(style, eq(build.styleId, style.id))
    .where(
      and(
        styleId ? eq(build.styleId, styleId) : undefined,
        styleSlug ? eq(style.slug, styleSlug) : undefined,
        creatorId ? eq(build.creatorId, creatorId) : undefined,
        featured !== undefined ? eq(build.featured, featured) : undefined,
        status ? eq(build.status, status) : undefined,
        query ? like(build.title, `%${query}%`) : undefined,
        isNull(build.deletedAt)
      )
    );

  if (tagSlug) {
    dbQuery = dbQuery
      .leftJoin(buildTag, eq(build.id, buildTag.buildId))
      .leftJoin(tag, eq(buildTag.tagId, tag.id))
      .where(
        and(
          eq(tag.slug, tagSlug),
          isNull(build.deletedAt)
        )
      ) as any;
  }

  const [result] = await dbQuery.limit(1);
  return result?.count || 0;
}

export async function getFeaturedBuilds(limit = 12) {
  return getBuilds({
    featured: true,
    status: BuildStatus.PUBLISHED,
    sort: 'featured',
    limit,
    page: 1,
  });
}

export async function searchBuilds({
  query,
  status = BuildStatus.PUBLISHED,
  limit = 20,
}: {
  query: string;
  status?: BuildStatus;
  limit?: number;
}) {
  const result = await db()
    .select({
      id: build.id,
      slug: build.slug,
      title: build.title,
      description: build.description,
      images: build.images,
      likesCount: build.likesCount,
      viewsCount: build.viewsCount,
      creatorName: creator.name,
      creatorSlug: creator.slug,
      styleName: style.name,
      styleSlug: style.slug,
    })
    .from(build)
    .leftJoin(creator, eq(build.creatorId, creator.id))
    .leftJoin(style, eq(build.styleId, style.id))
    .where(
      and(
        sql`${build.title} LIKE ${`%${query}%`}`,
        status ? eq(build.status, status) : undefined,
        isNull(build.deletedAt)
      )
    )
    .orderBy(desc(build.createdAt))
    .limit(limit);

  return result;
}

export async function incrementBuildViews(id: string) {
  return await db()
    .update(build)
    .set({
      viewsCount: sql`${build.viewsCount} + 1`,
    })
    .where(eq(build.id, id));
}

export async function incrementBuildLikes(id: string) {
  return await db()
    .update(build)
    .set({
      likesCount: sql`${build.likesCount} + 1`,
    })
    .where(eq(build.id, id));
}

export async function decrementBuildLikes(id: string) {
  return await db()
    .update(build)
    .set({
      likesCount: sql`CASE WHEN ${build.likesCount} > 0 THEN ${build.likesCount} - 1 ELSE 0 END`,
    })
    .where(eq(build.id, id));
}
