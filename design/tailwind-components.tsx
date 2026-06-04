
// ============================================
// ParalivesBuilds — Tailwind + shadcn 组件代码
// ============================================

// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#e07a5f",
          hover: "#c96a52",
          light: "rgba(224,122,95,0.1)",
        },
        background: "#faf9f7",
        card: "#ffffff",
        "text-primary": "#1a1a1a",
        "text-secondary": "#6b6b6b",
        "text-muted": "#9a9a9a",
        border: "#e8e6e3",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.06)",
        hover: "0 8px 32px rgba(0,0,0,0.12)",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};

// Tailwind config reference (not a real module)
// ============================================
// components/BuildCard.tsx
// ============================================
"use client";

import Image from "next/image";
import Link from "next/link";

interface BuildCardProps {
  slug: string;
  title: string;
  style: string;
  lotSize: string;
  image: string;
  creator: {
    name: string;
    slug: string;
    avatar?: string;
  };
  likes: number;
  views: number;
  badge?: string;
  tall?: boolean;
}

export function BuildCard({
  slug,
  title,
  style,
  lotSize,
  image,
  creator,
  likes,
  views,
  badge,
  tall = false,
}: BuildCardProps) {
  const formatNumber = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return n.toString();
  };

  return (
    <Link
      href={`/builds/${slug}`}
      className="group block bg-card rounded-lg shadow-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
    >
      <div className={`relative overflow-hidden ${tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
        <Image
          src={image}
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
            <span>{style}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-white/60" />
            <span>{lotSize}</span>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-[#f2cc8f] flex items-center justify-center text-[10px] text-white font-semibold">
            {creator.name[0]}
          </div>
          <span className="text-[13px] text-text-secondary font-medium">
            {creator.name}
          </span>
        </div>
        <div className="flex gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">❤️ {formatNumber(likes)}</span>
          <span className="flex items-center gap-1">👁 {formatNumber(views)}</span>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// components/MasonryGrid.tsx
// ============================================
"use client";

import { ReactNode } from "react";

interface MasonryGridProps {
  children: ReactNode;
}

export function MasonryGrid({ children }: MasonryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
      {children}
    </div>
  );
}

// ============================================
// components/StyleChip.tsx
// ============================================
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface StyleChipProps {
  name: string;
  slug: string;
  icon?: string;
  active?: boolean;
}

export function StyleChip({ name, slug, icon = "🏠", active = false }: StyleChipProps) {
  return (
    <Link
      href={`/styles/${slug}`}
      className={cn(
        "flex-shrink-0 px-5 py-2.5 bg-card border border-border rounded-full text-sm font-medium transition-all duration-200 hover:-translate-y-0.5",
        active
          ? "bg-accent text-white border-accent"
          : "text-text-secondary hover:border-accent hover:text-accent"
      )}
    >
      <span className="mr-1.5">{icon}</span>
      {name}
    </Link>
  );
}

// ============================================
// components/Navbar.tsx
// ============================================
"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/92 backdrop-blur-xl border-b border-border">
      <div className="max-w-container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-text-primary">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#f2cc8f] flex items-center justify-center text-base">
            🏠
          </div>
          ParalivesBuilds
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-accent">Home</Link>
          <Link href="/builds" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Browse</Link>
          <Link href="/creators" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Creators</Link>
          <Link href="/guides" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Guides</Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search builds..."
              className={`pl-9 pr-4 py-2 bg-card border border-border rounded-full text-sm outline-none transition-all duration-200 focus:border-accent ${
                searchFocused ? "w-[280px]" : "w-[240px]"
              }`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-50">🔍</span>
          </div>
          <Link
            href="/upload"
            className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-md hover:bg-accent-hover transition-all duration-200 hover:-translate-y-0.5"
          >
            Submit Build
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ============================================
// components/ImageGallery.tsx
// ============================================
"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="sticky top-20">
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-border mb-3">
        <Image
          src={images[activeIndex]}
          alt={`${title} - View ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative w-20 h-[60px] rounded-md overflow-hidden border-2 transition-all duration-200",
              activeIndex === i
                ? "border-accent opacity-100"
                : "border-transparent opacity-70 hover:opacity-100"
            )}
          >
            <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// components/InfoGrid.tsx
// ============================================
"use client";

interface InfoItem {
  label: string;
  value: string | number;
}

interface InfoGridProps {
  items: InfoItem[];
}

export function InfoGrid({ items }: InfoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className="p-4 bg-background rounded-md">
          <span className="block text-[11px] text-text-muted uppercase tracking-wider mb-1">
            {item.label}
          </span>
          <span className="block text-base font-semibold text-text-primary">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================
// app/page.tsx (首页)
// ============================================
import { Navbar } from "@/components/Navbar";
import { BuildCard } from "@/components/BuildCard";
import { MasonryGrid } from "@/components/MasonryGrid";
import { StyleChip } from "@/components/StyleChip";
import Link from "next/link";

const styles = [
  { name: "All", slug: "all", icon: "🏠", active: true },
  { name: "Modern", slug: "modern", icon: "🏢" },
  { name: "Cottage", slug: "cottage", icon: "🌿" },
  { name: "Minimalist", slug: "minimalist", icon: "⬜" },
  { name: "Industrial", slug: "industrial", icon: "🏭" },
  { name: "Rustic", slug: "rustic", icon: "🪵" },
  { name: "Victorian", slug: "victorian", icon: "🏛️" },
  { name: "Tropical", slug: "tropical", icon: "🌴" },
  { name: "Suburban", slug: "suburban", icon: "🏘️" },
  { name: "Farmhouse", slug: "farmhouse", icon: "🚜" },
];

const featuredBuilds = [
  {
    slug: "modern-glass-loft",
    title: "Modern Glass Loft",
    style: "Modern",
    lotSize: "30×20",
    image: "/builds/modern-glass-loft/cover.webp",
    creator: { name: "AlexBuilds", slug: "alexbuilds" },
    likes: 1248,
    views: 8532,
    badge: "Featured",
  },
  // ... more builds
];

export default function HomePage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="text-center py-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold leading-tight tracking-tight mb-4">
          Discover Amazing{" "}
          <span className="bg-gradient-to-r from-accent to-[#f2cc8f] bg-clip-text text-transparent">
            Paralives Builds
          </span>
        </h1>
        <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
          Find inspiration for your next home. Browse modern cottages, minimalist lofts, 
          and creative designs from the Paralives community.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/builds" className="px-6 py-3 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition-all hover:-translate-y-0.5">
            🔥 Browse Builds
          </Link>
          <Link href="/upload" className="px-6 py-3 border border-border rounded-md font-medium hover:bg-card transition-all">
            📤 Submit Your Build
          </Link>
        </div>
      </section>

      {/* Style Strip */}
      <div className="max-w-container mx-auto px-6 mb-10">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
          Browse by Style
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {styles.map((s) => (
            <StyleChip key={s.slug} {...s} />
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="max-w-container mx-auto px-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">🔥 Featured Builds</h2>
          <Link href="/builds" className="text-sm font-semibold text-accent">
            View all →
          </Link>
        </div>
        <MasonryGrid>
          {featuredBuilds.map((build, i) => (
            <BuildCard key={build.slug} {...build} tall={[1, 4, 7].includes(i)} />
          ))}
        </MasonryGrid>
      </div>
    </main>
  );
}

// ============================================
// app/builds/[slug]/page.tsx (详情页)
// ============================================
import { Navbar } from "@/components/Navbar";
import { ImageGallery } from "@/components/ImageGallery";
import { InfoGrid } from "@/components/InfoGrid";
import { BuildCard } from "@/components/BuildCard";
import Link from "next/link";

// Mock data - replace with DB query
const build = {
  slug: "modern-glass-loft",
  title: "Modern Glass Loft",
  description: "A stunning modern glass loft featuring floor-to-ceiling windows...",
  style: "Modern",
  lotSize: "30×20",
  floors: 2,
  bedrooms: 3,
  bathrooms: 2,
  budget: 45000,
  likes: 1248,
  views: 8532,
  images: [
    "/builds/modern-glass-loft/1.webp",
    "/builds/modern-glass-loft/2.webp",
    "/builds/modern-glass-loft/3.webp",
    "/builds/modern-glass-loft/4.webp",
  ],
  creator: {
    name: "AlexBuilds",
    slug: "alexbuilds",
    avatar: "/creators/alexbuilds/avatar.webp",
    builds: 128,
    followers: 45000,
  },
  tags: ["Modern", "Residential", "Budget: §45,000", "EA Release"],
  workshopUrl: "https://steamcommunity.com/sharedfiles/...",
};

const infoItems = [
  { label: "Lot Size", value: build.lotSize },
  { label: "Floors", value: build.floors },
  { label: "Bedrooms", value: build.bedrooms },
  { label: "Bathrooms", value: build.bathrooms },
  { label: "Likes", value: build.likes.toLocaleString() },
  { label: "Views", value: build.views.toLocaleString() },
];

export default function BuildDetailPage() {
  return (
    <main>
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-container mx-auto px-6 py-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/builds" className="hover:text-accent">Browse</Link>
        <span className="mx-2">/</span>
        <Link href={`/styles/${build.style.toLowerCase()}`} className="hover:text-accent">{build.style}</Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">{build.title}</span>
      </div>

      {/* Detail Hero */}
      <div className="max-w-container mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
        <ImageGallery images={build.images} title={build.title} />

        <div>
          <h1 className="text-3xl font-bold mb-2">{build.title}</h1>

          {/* Creator */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-[#f2cc8f] flex items-center justify-center text-sm text-white font-semibold">
              {build.creator.name[0]}
            </div>
            <div>
              <h4 className="text-[15px] font-semibold">{build.creator.name}</h4>
              <p className="text-[13px] text-text-muted">
                {build.creator.builds} builds · {build.creator.followers >= 1000 
                  ? (build.creator.followers / 1000).toFixed(0) + "k" 
                  : build.creator.followers} followers
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {build.tags.map((tag, i) => (
              <span
                key={i}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium ${
                  i === 0
                    ? "bg-accent-light text-accent border border-accent/20"
                    : "bg-background text-text-secondary border border-border"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Info Grid */}
          <InfoGrid items={infoItems} />

          {/* Actions */}
          <div className="flex gap-3 my-6">
            <a
              href={build.workshopUrl}
              target="_blank"
              className="flex-1 flex justify-center items-center gap-2 px-6 py-3.5 bg-accent text-white font-semibold rounded-md hover:bg-accent-hover transition-all"
            >
              🎮 Download on Steam
            </a>
            <button className="px-5 py-3.5 border border-border rounded-md hover:bg-card transition-all">
              ❤️ 1.2k
            </button>
            <button className="px-5 py-3.5 border border-border rounded-md hover:bg-card transition-all">
              📤 Share
            </button>
          </div>

          {/* Description */}
          <div className="text-[15px] leading-relaxed text-text-secondary">
            <h3 className="text-lg font-semibold text-text-primary mt-6 mb-3">About This Build</h3>
            <p className="mb-4">{build.description}</p>

            <h3 className="text-lg font-semibold text-text-primary mt-6 mb-3">Features</h3>
            <ul className="space-y-1 mb-4">
              <li>• Open-concept kitchen and living area</li>
              <li>• Master suite with en-suite bathroom</li>
              <li>• Home office with city views</li>
              <li>• Rooftop garden and entertainment area</li>
            </ul>

            <h3 className="text-lg font-semibold text-text-primary mt-6 mb-3">Requirements</h3>
            <ul className="space-y-1">
              <li>• Base Game only</li>
              <li>• No custom content required</li>
              <li>• Built on {build.lotSize} lot</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="max-w-container mx-auto px-6 mt-16">
        <h3 className="text-xl font-bold mb-5">You Might Also Like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {/* Related BuildCards */}
        </div>
      </div>
    </main>
  );
}

// ============================================
// app/builds/page.tsx (浏览页)
// ============================================
import { Navbar } from "@/components/Navbar";
import { BuildCard } from "@/components/BuildCard";
import { MasonryGrid } from "@/components/MasonryGrid";

export default function BrowsePage() {
  return (
    <main>
      <Navbar />

      <div className="text-center py-10 px-6">
        <h1 className="text-4xl font-bold mb-3">
          Browse All <span className="text-accent">Builds</span>
        </h1>
        <p className="text-text-secondary">Filter by style, size, or search for your perfect home design.</p>
      </div>

      {/* Filter Bar */}
      <div className="max-w-container mx-auto px-6 py-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-[13px] text-text-muted font-medium">Style:</label>
          <select className="px-4 py-2 bg-card border border-border rounded-md text-sm outline-none focus:border-accent">
            <option>All Styles</option>
            <option>Modern</option>
            <option>Cottage</option>
            <option>Minimalist</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[13px] text-text-muted font-medium">Lot Size:</label>
          <select className="px-4 py-2 bg-card border border-border rounded-md text-sm outline-none focus:border-accent">
            <option>Any Size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[13px] text-text-muted font-medium">Sort:</label>
          <select className="px-4 py-2 bg-card border border-border rounded-md text-sm outline-none focus:border-accent">
            <option>Newest</option>
            <option>Most Popular</option>
            <option>Most Viewed</option>
          </select>
        </div>
        <span className="ml-auto text-sm text-text-muted">
          Showing <strong className="text-text-primary">1-20</strong> of <strong className="text-text-primary">156</strong> builds
        </span>
      </div>

      {/* Grid */}
      <div className="max-w-container mx-auto px-6 pb-16">
        <MasonryGrid>
          {/* BuildCards */}
        </MasonryGrid>
      </div>
    </main>
  );
}
