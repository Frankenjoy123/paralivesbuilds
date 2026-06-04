'use server';

import { getLocale } from 'next-intl/server';
import { revalidatePath } from 'next/cache';
import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { updateTaxonomy, deleteTaxonomy, TaxonomyStatus } from '@/shared/models/taxonomy';

export async function publishTaxonomyAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.CATEGORIES_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await updateTaxonomy(id, { status: TaxonomyStatus.PUBLISHED });
  revalidatePath('/[locale]/(admin)/admin/categories', 'page');
  return { success: true };
}

export async function unpublishTaxonomyAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.CATEGORIES_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await updateTaxonomy(id, { status: TaxonomyStatus.DRAFT });
  revalidatePath('/[locale]/(admin)/admin/categories', 'page');
  return { success: true };
}

export async function deleteTaxonomyAction(id: string) {
  const locale = await getLocale();
  await requirePermission({
    code: PERMISSIONS.CATEGORIES_DELETE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  await deleteTaxonomy(id);
  revalidatePath('/[locale]/(admin)/admin/categories', 'page');
  return { success: true };
}
