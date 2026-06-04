'use server';

import { getLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { updatePost, deletePost, PostStatus } from '@/shared/models/post';

export async function publishPostAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.POSTS_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await updatePost(id, { status: PostStatus.PUBLISHED });
  revalidatePath('/[locale]/(admin)/admin/posts', 'page');
  return { success: true };
}

export async function unpublishPostAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.POSTS_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await updatePost(id, { status: PostStatus.DRAFT });
  revalidatePath('/[locale]/(admin)/admin/posts', 'page');
  return { success: true };
}

export async function deletePostAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.POSTS_DELETE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await deletePost(id);
  revalidatePath('/[locale]/(admin)/admin/posts', 'page');
  return { success: true };
}
