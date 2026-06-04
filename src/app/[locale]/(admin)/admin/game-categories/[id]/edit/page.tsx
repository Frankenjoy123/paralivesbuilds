import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { FormCard } from '@/shared/blocks/form';
import { findGameCategory, updateGameCategory, GameCategoryStatus } from '@/shared/models/game-category';
import { Crumb } from '@/shared/types/blocks/common';
import { Form } from '@/shared/types/blocks/form';

export default async function GameCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);

  await requirePermission({
    code: PERMISSIONS.GAME_CATEGORIES_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const t = await getTranslations('admin.game-categories');

  const category = await findGameCategory({ id });
  if (!category) {
    notFound();
  }

  const crumbs: Crumb[] = [
    { title: t('edit.crumbs.admin'), url: '/admin' },
    { title: t('edit.crumbs.game_categories'), url: '/admin/game-categories' },
    { title: t('edit.crumbs.edit'), is_active: true },
  ];

  const form: Form = {
    fields: [
      {
        name: 'slug',
        type: 'text',
        title: t('fields.slug'),
        validation: { required: true },
        layout: { col: 6 },
      },
      {
        name: 'name',
        type: 'text',
        title: t('fields.name'),
        validation: { required: true },
        layout: { col: 6 },
      },
      {
        name: 'status',
        type: 'select',
        title: t('fields.status'),
        options: [
          { title: 'Published', value: GameCategoryStatus.PUBLISHED },
          { title: 'Draft', value: GameCategoryStatus.DRAFT },
          { title: 'Archived', value: GameCategoryStatus.ARCHIVED },
        ],
        layout: { col: 6 },
      },
      {
        name: 'sort',
        type: 'number',
        title: t('fields.sort'),
        layout: { col: 6 },
      },
      {
        name: 'image',
        type: 'upload_image',
        title: t('fields.image'),
      },
      {
        name: 'icon',
        type: 'text',
        title: t('fields.icon'),
        layout: { col: 6 },
      },
      {
        name: 'description',
        type: 'markdown_editor',
        title: t('fields.description'),
      },
    ],
    passby: {
      id: category.id,
      type: 'game-category',
    },
    data: {
      ...category,
    },
    submit: {
      button: {
        title: t('edit.buttons.submit'),
      },
      handler: async (data) => {
        'use server';

        const result = await updateGameCategory(id, {
          slug: (data.get('slug') as string)?.trim().toLowerCase(),
          name: (data.get('name') as string)?.trim(),
          description: (data.get('description') as string)?.trim(),
          image: data.get('image') as string,
          icon: data.get('icon') as string,
          status: data.get('status') as GameCategoryStatus,
          sort: Number(data.get('sort')) || 0,
        });

        if (!result) {
          throw new Error('update category failed');
        }

        return {
          status: 'success',
          message: 'category updated',
          redirect_url: '/admin/game-categories',
        };
      },
    },
  };

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title={t('edit.title')} />
        <FormCard form={form} />
      </Main>
    </>
  );
}
