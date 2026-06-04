import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { FormCard } from '@/shared/blocks/form';
import { getUuid } from '@/shared/lib/hash';
import { addGameCategory, GameCategoryStatus } from '@/shared/models/game-category';
import { Crumb } from '@/shared/types/blocks/common';
import { Form } from '@/shared/types/blocks/form';

export default async function GameCategoryAddPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requirePermission({
    code: PERMISSIONS.GAME_CATEGORIES_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const t = await getTranslations('admin.game-categories');

  const crumbs: Crumb[] = [
    { title: t('add.crumbs.admin'), url: '/admin' },
    { title: t('add.crumbs.game_categories'), url: '/admin/game-categories' },
    { title: t('add.crumbs.add'), is_active: true },
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
      type: 'game-category',
    },
    data: {
      sort: 0,
    },
    submit: {
      button: {
        title: t('add.buttons.submit'),
      },
      handler: async (data) => {
        'use server';

        const slug = data.get('slug') as string;
        const name = data.get('name') as string;
        const description = data.get('description') as string;
        const image = data.get('image') as string;
        const icon = data.get('icon') as string;
        const sort = Number(data.get('sort')) || 0;

        if (!slug || !name) {
          throw new Error('slug and name are required');
        }

        const result = await addGameCategory({
          id: getUuid(),
          slug: slug.trim().toLowerCase(),
          name: name.trim(),
          description: description?.trim(),
          image,
          icon,
          status: GameCategoryStatus.PUBLISHED,
          sort,
        });

        if (!result) {
          throw new Error('add category failed');
        }

        return {
          status: 'success',
          message: 'category added',
          redirect_url: '/admin/game-categories',
        };
      },
    },
  };

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title={t('add.title')} />
        <FormCard form={form} />
      </Main>
    </>
  );
}
