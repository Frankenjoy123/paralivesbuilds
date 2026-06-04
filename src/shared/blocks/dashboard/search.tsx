'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search as SearchType } from '@/shared/types/blocks/common';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

export function Search({ search }: { search: SearchType }) {
  const [value, setValue] = useState(search.value || '');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = () => {
    if (value === search.value) {
      return;
    }

    setValue(value);

    const params = new URLSearchParams(searchParams.toString());

    params.set(search.name, value);

    if (value) {
      params.set(search.name, value);
    } else {
      params.delete(search.name);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        placeholder={search.placeholder || ''}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="w-full"
        disabled={isPending}
      />
      <Button
        size="icon"
        variant="outline"
        onClick={handleSearch}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SearchIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
