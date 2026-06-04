'use client';

import { Link } from '@/core/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Home, Heart, Eye } from 'lucide-react';
import Image from 'next/image';

export function ParalivesCreatorHero({ creator, totalCount }: { creator: any; totalCount: number }) {
  const t = useTranslations('paralives');

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <nav className="text-sm text-[#9a9a9a] mb-6">
        <Link href="/" className="hover:text-[#e07a5f]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/builds" className="hover:text-[#e07a5f]">Browse</Link>
        <span className="mx-2">/</span>
        <span className="text-[#1a1a1a]">{creator.name}</span>
      </nav>

      <div className="flex items-start gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#e07a5f] to-[#f2cc8f] flex items-center justify-center text-2xl text-white font-bold flex-shrink-0">
          {creator.avatar ? (
            <Image src={creator.avatar} alt={creator.name} width={80} height={80} className="rounded-full object-cover" />
          ) : (
            creator.name?.[0] || '?'
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">{creator.name}</h1>
          {creator.bio && <p className="text-[#6b6b6b] mb-3">{creator.bio}</p>}
          <div className="flex items-center gap-4 text-sm text-[#9a9a9a]">
            <span>{totalCount} {totalCount === 1 ? 'build' : 'builds'}</span>
            {creator.steamId && (
              <a href={`https://steamcommunity.com/profiles/${creator.steamId}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#e07a5f]">
                Steam
              </a>
            )}
            {creator.youtubeChannel && (
              <a href={creator.youtubeChannel} target="_blank" rel="noopener noreferrer" className="hover:text-[#e07a5f]">
                YouTube
              </a>
            )}
            {creator.patreonUrl && (
              <a href={creator.patreonUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#e07a5f]">
                Patreon
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
