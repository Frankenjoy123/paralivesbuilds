'use server';

import { getLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { updateGame, deleteGame } from '@/shared/models/game';
import { GameStatus } from '@/shared/models/game-types';

export async function publishGameAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.GAMES_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await updateGame(id, { status: GameStatus.PUBLISHED });
  revalidatePath('/[locale]/(admin)/admin/games', 'page');
  return { success: true };
}

export async function unpublishGameAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.GAMES_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await updateGame(id, { status: GameStatus.DRAFT });
  revalidatePath('/[locale]/(admin)/admin/games', 'page');
  return { success: true };
}

export async function deleteGameAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.GAMES_DELETE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await deleteGame(id);
  revalidatePath('/[locale]/(admin)/admin/games', 'page');
  return { success: true };
}
