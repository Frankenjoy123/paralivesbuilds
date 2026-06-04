'use server';

import { getLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { updateGameCategory, deleteGameCategory, GameCategoryStatus } from '@/shared/models/game-category';

export async function publishCategoryAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.GAME_CATEGORIES_WRITE, // Assuming writing to categories uses this; often perms follow this pattern.
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await updateGameCategory(id, { status: GameCategoryStatus.PUBLISHED });
  revalidatePath('/[locale]/(admin)/admin/game-categories', 'page');
  return { success: true };
}

export async function unpublishCategoryAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.GAME_CATEGORIES_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await updateGameCategory(id, { status: GameCategoryStatus.DRAFT });
  revalidatePath('/[locale]/(admin)/admin/game-categories', 'page');
  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.GAME_CATEGORIES_DELETE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await deleteGameCategory(id);
  revalidatePath('/[locale]/(admin)/admin/game-categories', 'page');
  return { success: true };
}
