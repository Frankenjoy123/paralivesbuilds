'use client';

import { useTransition } from 'react';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import {
  publishPostAction,
  unpublishPostAction,
  deletePostAction,
} from '../actions';
import { PostStatus } from '@/shared/models/post-types';

interface TableActionsProps {
  post: any;
  translations: {
    edit: string;
    view: string;
    publish: string;
    unpublish: string;
    delete: string;
    success: string;
    error: string;
    confirmDelete: string;
  };
}

export function PostTableActions({ post, translations }: TableActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (
    actionFn: (id: string) => Promise<{ success: boolean; error?: string }>,
    confirmMessage?: string
  ) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    startTransition(async () => {
      try {
        const res = await actionFn(post.id);
        if (res.success) {
          toast.success(translations.success);
        } else {
          toast.error(res.error || translations.error);
        }
      } catch (err: any) {
        toast.error(translations.error);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal />}
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* Edit Action */}
        <DropdownMenuItem asChild>
          <Link
            href={`/admin/posts/${post.id}/edit`}
            className="flex w-full items-center gap-2 cursor-pointer"
          >
            <SmartIcon name="RiEditLine" className="h-4 w-4" />
            {translations.edit}
          </Link>
        </DropdownMenuItem>

        {/* View Action */}
        <DropdownMenuItem asChild>
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="flex w-full items-center gap-2 cursor-pointer"
          >
            <SmartIcon name="RiEyeLine" className="h-4 w-4" />
            {translations.view}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Publish/Unpublish Action */}
        {post.status === PostStatus.PUBLISHED ? (
          <DropdownMenuItem
            className="flex w-full items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleAction(unpublishPostAction);
            }}
          >
            <SmartIcon name="RiEyeCloseLine" className="h-4 w-4" />
            {translations.unpublish}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="flex w-full items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleAction(publishPostAction);
            }}
          >
            <SmartIcon name="RiSendPlaneLine" className="h-4 w-4" />
            {translations.publish}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Delete Action */}
        <DropdownMenuItem
          className="flex w-full items-center gap-2 cursor-pointer text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          onClick={(e) => {
            e.preventDefault();
            handleAction(deletePostAction, translations.confirmDelete);
          }}
        >
          <SmartIcon name="RiDeleteBinLine" className="h-4 w-4" />
          {translations.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
