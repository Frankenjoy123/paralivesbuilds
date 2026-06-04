'use server';

import {
  getBuilds,
  getBuildsCount,
  getFeaturedBuilds,
  incrementBuildViews,
  incrementBuildLikes,
  decrementBuildLikes,
  searchBuilds,
} from '@/shared/models/build';
import { BuildStatus } from '@/shared/models/build-types';

export async function searchBuildsAction(query: string) {
  if (!query || query.length < 1) return [];

  return await searchBuilds({
    query,
    status: BuildStatus.PUBLISHED,
    limit: 8,
  });
}

export async function incrementBuildViewsAction(id: string) {
  try {
    await incrementBuildViews(id);
    return { success: true };
  } catch (error) {
    console.error('Failed to increment views:', error);
    return { success: false };
  }
}

export async function incrementBuildLikesAction(id: string) {
  try {
    await incrementBuildLikes(id);
    return { success: true };
  } catch (error) {
    console.error('Failed to increment likes:', error);
    return { success: false };
  }
}

export async function decrementBuildLikesAction(id: string) {
  try {
    await decrementBuildLikes(id);
    return { success: true };
  } catch (error) {
    console.error('Failed to decrement likes:', error);
    return { success: false };
  }
}

export async function fetchMoreBuilds({
  page,
  limit = 24,
  styleId,
  tagSlug,
  creatorId,
  sort = 'newest',
}: {
  page: number;
  limit?: number;
  styleId?: string;
  tagSlug?: string;
  creatorId?: string;
  sort?: 'newest' | 'popular' | 'featured';
}) {
  const builds = await getBuilds({
    page,
    limit,
    styleId,
    tagSlug,
    creatorId,
    sort,
    status: BuildStatus.PUBLISHED,
  });

  return builds;
}

export async function fetchFeaturedBuilds(limit = 12) {
  const builds = await getFeaturedBuilds(limit);
  return builds;
}
