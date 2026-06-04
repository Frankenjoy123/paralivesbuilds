import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { TableCard } from '@/shared/blocks/table';
import {
  getGames,
  getGamesCount,
  type Game,
} from '@/shared/models/game';
import { Button, Crumb } from '@/shared/types/blocks/common';
import { type Table } from '@/shared/types/blocks/table';

import { GameTableActions } from './components/table-actions';

export default async function GamesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: number; pageSize?: number; q?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requirePermission({
    code: PERMISSIONS.GAMES_READ,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const t = await getTranslations('admin.games');

  const { page, pageSize, q } = await searchParams;
  const pageNum = Number(page) || 1;
  const limit = Number(pageSize) || 30;
  const query = typeof q === 'string' ? q : undefined;

  const crumbs: Crumb[] = [
    { title: t('list.crumbs.admin'), url: '/admin' },
    { title: t('list.crumbs.games'), is_active: true },
  ];

  const total = await getGamesCount({ query });
  const data = (
    await getGames({
      page: pageNum,
      limit,
      query,
    })
  ).map((item) => ({
    ...item,
    plays: item.plays || 0,
    likes: item.likes || 0,
  }));

  const table: Table = {
    columns: [
      { name: 'title', title: t('fields.title') },
      {
        name: 'slug',
        title: t('fields.slug'),
        type: 'copy',
      },
      { name: 'categoryName', title: t('fields.category') },
      { name: 'plays', title: t('fields.plays') },
      { name: 'likes', title: t('fields.likes') },
      {
        name: 'status',
        title: t('fields.status'),
        type: 'label',
        metadata: { variant: 'outline' },
      },
      { name: 'createdAt', title: t('fields.created_at'), type: 'time' },
      {
        name: 'action',
        title: '',
        callback: (item: any) => {
          return (
            <GameTableActions
              game={item}
              translations={{
                edit: t('list.buttons.edit'),
                publish: t('list.buttons.publish'),
                unpublish: t('list.buttons.unpublish'),
                delete: t('list.buttons.delete'),
                confirmDelete: t('list.buttons.confirm_delete'),
                success: t('list.messages.success'),
                error: t('list.messages.error'),
              }}
            />
          );
        },
      },
    ],
    actions: [
      {
        id: 'edit',
        title: t('list.buttons.edit'),
        icon: 'RiEditLine',
        url: '/admin/games/[id]/edit',
      },
    ],
    data,
    pagination: {
      total,
      page: pageNum,
      limit,
    },
  };

  const actions: Button[] = [
    {
      id: 'add',
      title: t('list.buttons.add'),
      icon: 'RiAddLine',
      url: '/admin/games/add',
    },
  ];

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader
          title={t('list.title')}
          actions={actions}
          search={{
            name: 'q',
            value: query,
            placeholder: t('list.search_placeholder'),
          }}
        />
        <TableCard table={table} />
      </Main>
    </>
  );
}
