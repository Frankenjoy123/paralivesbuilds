import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { FormCard } from '@/shared/blocks/form';
import { findGame, updateGame, GameStatus } from '@/shared/models/game';
import { getGameCategories, GameCategoryStatus } from '@/shared/models/game-category';
import { Crumb } from '@/shared/types/blocks/common';
import { Form } from '@/shared/types/blocks/form';

export default async function GameEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);

  await requirePermission({
    code: PERMISSIONS.GAMES_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const t = await getTranslations('admin.games');

  const gameResult = await findGame({ id });
  if (!gameResult) {
    notFound();
  }
  const gameData = gameResult;

  const crumbs: Crumb[] = [
    { title: t('edit.crumbs.admin'), url: '/admin' },
    { title: t('edit.crumbs.games'), url: '/admin/games' },
    { title: t('edit.crumbs.edit'), is_active: true },
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
        name: 'status',
        type: 'select',
        title: t('fields.status'),
        options: [
          { title: 'Published', value: GameStatus.PUBLISHED },
          { title: 'Draft', value: GameStatus.DRAFT },
          { title: 'Archived', value: GameStatus.ARCHIVED },
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
      id: gameData.id,
      type: 'game',
    },
    data: {
      ...gameData,
      game_url: gameData.iframeUrl,
    },
    submit: {
      button: {
        title: t('edit.buttons.submit'),
      },
      handler: async (data) => {
        'use server';

        const result = await updateGame(id, {
          slug: (data.get('slug') as string)?.trim().toLowerCase(),
          title: (data.get('title') as string)?.trim(),
          categoryId: data.get('categoryId') as string,
          iframeUrl: (data.get('game_url') as string)?.trim(),
          description: '',
          content: (data.get('content') as string)?.trim(),
          image: data.get('image') as string,
          status: data.get('status') as GameStatus,
          sort: Number(data.get('sort')) || 0,
        });

        if (!result) {
          throw new Error('update game failed');
        }

        return {
          status: 'success',
          message: 'game updated',
          redirect_url: '/admin/games',
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
