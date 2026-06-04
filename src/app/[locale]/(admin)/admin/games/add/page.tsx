import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { FormCard } from '@/shared/blocks/form';
import { getUuid } from '@/shared/lib/hash';
import { addGame, GameStatus } from '@/shared/models/game';
import { getGameCategories, GameCategoryStatus } from '@/shared/models/game-category';
import { Crumb } from '@/shared/types/blocks/common';
import { Form } from '@/shared/types/blocks/form';

export default async function GameAddPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requirePermission({
    code: PERMISSIONS.GAMES_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const t = await getTranslations('admin.games');

  const crumbs: Crumb[] = [
    { title: t('add.crumbs.admin'), url: '/admin' },
    { title: t('add.crumbs.games'), url: '/admin/games' },
    { title: t('add.crumbs.add'), is_active: true },
  ];

  const categories = await getGameCategories({
    status: GameCategoryStatus.PUBLISHED,
  });
  
  const categoryOptions = categories.map(c => ({
    title: c.name,
    value: c.id
  }));

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
        name: 'title',
        type: 'text',
        title: t('fields.title'),
        validation: { required: true },
        layout: { col: 6 },
      },
      {
        name: 'categoryId',
        type: 'select',
        title: t('fields.category'),
        options: categoryOptions,
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
        name: 'game_url',
        type: 'text',
        title: t('fields.game_url'),
        validation: { required: true },
      },
      {
        name: 'image',
        type: 'upload_image',
        title: t('fields.image'),
      },
      {
        name: 'content',
        type: 'markdown_editor',
        title: t('fields.content'),
      },
    ],
    passby: {
      type: 'game',
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
        const title = data.get('title') as string;
        const categoryId = data.get('categoryId') as string;
        const game_url = data.get('game_url') as string;
        const content = data.get('content') as string;
        const image = data.get('image') as string;
        const sort = Number(data.get('sort')) || 0;

        if (!slug || !title || !categoryId || !game_url) {
          throw new Error('Missing required fields');
        }

        const result = await addGame({
          id: getUuid(),
          slug: slug.trim().toLowerCase(),
          title: title.trim(),
          categoryId,
          iframeUrl: game_url.trim(),
          description: '',
          content: content?.trim(),
          image,
          status: GameStatus.PUBLISHED,
          sort,
          plays: 0,
          likes: 0,
        });

        if (!result) {
          throw new Error('add game failed');
        }

        return {
          status: 'success',
          message: 'game added',
          redirect_url: '/admin/games',
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
