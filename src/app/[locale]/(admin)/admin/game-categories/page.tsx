import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { TableCard } from '@/shared/blocks/table';
import {
  getGameCategories,
  getGameCategoriesCount,
  type GameCategory,
} from '@/shared/models/game-category';
import { Button, Crumb } from '@/shared/types/blocks/common';
import { type Table } from '@/shared/types/blocks/table';

import { CategoryTableActions } from './components/table-actions';

export default async function GameCategoriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: number; pageSize?: number }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requirePermission({
    code: PERMISSIONS.GAME_CATEGORIES_READ,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const t = await getTranslations('admin.game-categories');

  const { page, pageSize } = await searchParams;
  const pageNum = Number(page) || 1;
  const limit = Number(pageSize) || 30;

  const crumbs: Crumb[] = [
    { title: t('list.crumbs.admin'), url: '/admin' },
    { title: t('list.crumbs.game_categories'), is_active: true },
  ];

  const total = await getGameCategoriesCount();
  const data = await getGameCategories({
    page: pageNum,
    limit,
  });

  const table: Table = {
    columns: [
      {
        name: 'slug',
        title: t('fields.slug'),
        type: 'copy',
      },
      { name: 'name', title: t('fields.name') },
      {
        name: 'status',
        title: t('fields.status'),
        type: 'label',
        metadata: { variant: 'outline' },
      },
      { name: 'sort', title: t('fields.sort') },
      { name: 'createdAt', title: t('fields.created_at'), type: 'time' },
      {
        name: 'action',
        title: '',
        callback: (item: any) => {
          return (
            <CategoryTableActions
              category={item}
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
        url: '/admin/game-categories/[id]/edit',
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
      url: '/admin/game-categories/add',
    },
  ];

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title={t('list.title')} actions={actions} />
        <TableCard table={table} />
      </Main>
    </>
  );
}
