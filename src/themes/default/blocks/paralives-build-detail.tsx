'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/core/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ParalivesBuildCard } from './paralives-build-card';
import { ParalivesMasonryGrid } from './paralives-masonry-grid';
import { Heart, Eye, ExternalLink, Share2 } from 'lucide-react';

export function ParalivesBuildDetail({
  build,
  tags = [],
  relatedBuilds = [],
}: {
  build: any;
  tags?: any[];
  relatedBuilds?: any[];
}) {
  const t = useTranslations('paralives');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const rawImages = build.images ? JSON.parse(build.images) : [];
  const images = rawImages.map((img: string) =>
    img.startsWith('http') || img.startsWith('/') ? img : `/api/images/${img}`
  );
  const infoItems = [
    { label: t('lot_size') || 'Lot Size', value: build.lotSize || '-' },
    { label: t('floors') || 'Floors', value: build.floors || '-' },
    { label: t('bedrooms') || 'Bedrooms', value: build.bedrooms || '-' },
    { label: t('bathrooms') || 'Bathrooms', value: build.bathrooms || '-' },
    { label: t('budget') || 'Budget', value: build.budget ? `§${build.budget.toLocaleString()}` : '-' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#9a9a9a] mb-6">
        <Link href="/" className="hover:text-[#e07a5f]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/builds" className="hover:text-[#e07a5f]">Browse</Link>
        <span className="mx-2">/</span>
        {build.styleName && (
          <>
            <Link href={`/styles/${build.styleSlug}`} className="hover:text-[#e07a5f]">{build.styleName}</Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-[#1a1a1a]">{build.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
        {/* Left: Image Gallery */}
        <div>
          <div className="relative aspect-[16/10] rounded-[14px] overflow-hidden bg-[#f0eeeb] mb-3">
            {images.length > 0 ? (
              <Image
                src={images[activeImageIndex]}
                alt={`${build.title} - View ${activeImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🏠
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative w-20 h-[60px] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    activeImageIndex === i
                      ? 'border-[#e07a5f] opacity-100'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">{build.title}</h1>

          {/* Creator */}
          {build.creatorName && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e07a5f] to-[#f2cc8f] flex items-center justify-center text-sm text-white font-semibold">
                {build.creatorName[0]}
              </div>
              <div>
                <Link
                  href={`/creators/${build.creatorSlug}`}
                  className="text-sm font-semibold text-[#1a1a1a] hover:text-[#e07a5f]"
                >
                  {build.creatorName}
                </Link>
                <p className="text-xs text-[#9a9a9a]">{build.creatorBio || 'Creator'}</p>
              </div>
            </div>
          )}

          {/* Style Tag */}
          {build.styleName && (
            <Link
              href={`/styles/${build.styleSlug}`}
              className="inline-block px-3 py-1 bg-[rgba(224,122,95,0.1)] text-[#e07a5f] text-xs font-semibold rounded-full mb-4"
            >
              {build.styleName}
            </Link>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {infoItems.map((item, i) => (
              <div key={i} className="p-4 bg-[#faf9f7] rounded-lg border border-[#e8e6e3]">
                <span className="block text-[11px] text-[#9a9a9a] uppercase tracking-wider mb-1">
                  {item.label}
                </span>
                <span className="block text-base font-semibold text-[#1a1a1a]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            {build.workshopUrl && (
              <a
                href={build.workshopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#e07a5f] text-white font-semibold rounded-lg hover:bg-[#c96a52] transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                {t('download_steam') || 'Download on Steam'}
              </a>
            )}
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-[#e8e6e3] rounded-lg hover:bg-white transition-all">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">{build.likesCount}</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-[#e8e6e3] rounded-lg hover:bg-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-[#9a9a9a] mb-6">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {build.viewsCount?.toLocaleString() || 0} views
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {build.likesCount?.toLocaleString() || 0} likes
            </span>
          </div>

          {/* Description */}
          {build.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
                {t('about_this_build') || 'About This Build'}
              </h3>
              <p className="text-[#6b6b6b] leading-relaxed whitespace-pre-line">
                {build.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
                {t('tags') || 'Tags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-[#faf9f7] border border-[#e8e6e3] rounded-full text-xs text-[#6b6b6b]"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Builds */}
      {relatedBuilds.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
            {t('related_builds') || 'Related Builds'}
          </h2>
          <ParalivesMasonryGrid>
            {relatedBuilds.slice(0, 4).map((build, i) => (
              <ParalivesBuildCard
                key={build.id}
                slug={build.slug}
                title={build.title}
                style={build.styleName}
                styleSlug={build.styleSlug}
                lotSize={build.lotSize}
                image={build.images ? JSON.parse(build.images)[0] : undefined}
                creatorName={build.creatorName}
                likesCount={build.likesCount}
                viewsCount={build.viewsCount}
                tall={[1, 3].includes(i)}
              />
            ))}
          </ParalivesMasonryGrid>
        </section>
      )}
    </div>
  );
}
