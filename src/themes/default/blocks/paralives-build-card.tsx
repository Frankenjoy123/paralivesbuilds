'use client';

import Image from 'next/image';
import { Link } from '@/core/i18n/navigation';

interface BuildCardProps {
  slug: string;
  title: string;
  style?: string;
  styleSlug?: string;
  lotSize?: string;
  image?: string;
  creatorName?: string;
  creatorSlug?: string;
  likesCount?: number;
  viewsCount?: number;
  badge?: string;
  tall?: boolean;
}

export function ParalivesBuildCard({
  slug,
  title,
  style,
  styleSlug,
  lotSize,
  image,
  creatorName,
  likesCount = 0,
  viewsCount = 0,
  badge,
  tall = false,
}: BuildCardProps) {
  const formatNumber = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
  };

  const coverImage = image || '/imgs/placeholder-build.webp';

  return (
    <Link
      href={`/builds/${slug}`}
      className="group block bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
    >
      <div className={`relative overflow-hidden ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-400 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold uppercase tracking-wider rounded-full">
            {badge}
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-[15px] leading-tight mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-white/85 text-xs">
            {style && (
              <>
                <span>{style}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-white/60" />
              </>
            )}
            {lotSize && <span>{lotSize}</span>}
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e07a5f] to-[#f2cc8f] flex items-center justify-center text-[10px] text-white font-semibold">
            {creatorName?.[0] || '?'}
          </div>
          <span className="text-[13px] text-[#6b6b6b] font-medium">
            {creatorName || 'Unknown'}
          </span>
        </div>
        <div className="flex gap-3 text-xs text-[#9a9a9a]">
          <span className="flex items-center gap-1">❤️ {formatNumber(likesCount)}</span>
          <span className="flex items-center gap-1">👁 {formatNumber(viewsCount)}</span>
        </div>
      </div>
    </Link>
  );
}
