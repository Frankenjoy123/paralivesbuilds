import { nanoid } from 'nanoid';

import { db } from '@/core/db';
import { creator, style, tag, build, buildTag } from '@/config/db/schema';
import { BuildStatus } from '@/shared/models/build-types';

const stylesData = [
  { name: 'Modern', slug: 'modern', sortOrder: 1 },
  { name: 'Cottage', slug: 'cottage', sortOrder: 2 },
  { name: 'Minimalist', slug: 'minimalist', sortOrder: 3 },
  { name: 'Industrial', slug: 'industrial', sortOrder: 4 },
  { name: 'Rustic', slug: 'rustic', sortOrder: 5 },
  { name: 'Victorian', slug: 'victorian', sortOrder: 6 },
  { name: 'Tropical', slug: 'tropical', sortOrder: 7 },
  { name: 'Suburban', slug: 'suburban', sortOrder: 8 },
  { name: 'Farmhouse', slug: 'farmhouse', sortOrder: 9 },
  { name: 'Bohemian', slug: 'bohemian', sortOrder: 10 },
];

const creatorsData = [
  {
    name: 'Paralives Team',
    slug: 'paralives-official',
    bio: 'Official Paralives game team showcasing featured builds.',
  },
  {
    name: 'AlexBuilds',
    slug: 'alexbuilds',
    bio: 'Passionate builder creating modern and minimalist homes.',
  },
  {
    name: 'CozyCottage',
    slug: 'cozycottage',
    bio: 'Specializing in warm, inviting cottage-style homes.',
  },
];

const tagsData = [
  { name: 'Starter Home', slug: 'starter-home' },
  { name: 'Family Friendly', slug: 'family-friendly' },
  { name: 'Budget Friendly', slug: 'budget-friendly' },
  { name: 'Large Lot', slug: 'large-lot' },
  { name: 'Single Floor', slug: 'single-floor' },
  { name: 'Multi-Story', slug: 'multi-story' },
  { name: 'Garden', slug: 'garden' },
  { name: 'Pool', slug: 'pool' },
];

const buildsData = [
  {
    title: 'Cozy Cottage Starter Home',
    slug: 'cozy-cottage-starter',
    description: 'A perfect starter home for new Paralives players. Features a warm living room, compact kitchen, and a charming garden.',
    styleSlug: 'cottage',
    lotSize: '20×15',
    floors: 1,
    bedrooms: 2,
    bathrooms: 1,
    budget: 18000,
    creatorSlug: 'paralives-official',
    featured: true,
    likesCount: 128,
    viewsCount: 2048,
    tagSlugs: ['starter-home', 'budget-friendly', 'family-friendly'],
  },
  {
    title: 'Modern Glass Loft',
    slug: 'modern-glass-loft',
    description: 'A stunning modern glass loft featuring floor-to-ceiling windows, open-concept living, and a rooftop terrace.',
    styleSlug: 'modern',
    lotSize: '30×20',
    floors: 2,
    bedrooms: 3,
    bathrooms: 2,
    budget: 45000,
    creatorSlug: 'alexbuilds',
    featured: true,
    likesCount: 342,
    viewsCount: 5620,
    tagSlugs: ['large-lot', 'multi-story', 'pool'],
  },
  {
    title: 'Minimalist Zen Retreat',
    slug: 'minimalist-zen-retreat',
    description: 'Find peace in this minimalist home with clean lines, natural materials, and a serene courtyard.',
    styleSlug: 'minimalist',
    lotSize: '25×20',
    floors: 1,
    bedrooms: 2,
    bathrooms: 1,
    budget: 28000,
    creatorSlug: 'alexbuilds',
    featured: false,
    likesCount: 95,
    viewsCount: 1540,
    tagSlugs: ['single-floor', 'garden'],
  },
  {
    title: 'Rustic Farmhouse',
    slug: 'rustic-farmhouse',
    description: 'A charming farmhouse with a wrap-around porch, large kitchen, and plenty of space for a big family.',
    styleSlug: 'farmhouse',
    lotSize: '40×30',
    floors: 2,
    bedrooms: 4,
    bathrooms: 3,
    budget: 62000,
    creatorSlug: 'cozycottage',
    featured: true,
    likesCount: 256,
    viewsCount: 4200,
    tagSlugs: ['family-friendly', 'large-lot', 'garden'],
  },
  {
    title: 'Tropical Beach Villa',
    slug: 'tropical-beach-villa',
    description: 'Escape to paradise with this tropical villa featuring a private pool, outdoor shower, and ocean views.',
    styleSlug: 'tropical',
    lotSize: '35×25',
    floors: 1,
    bedrooms: 3,
    bathrooms: 2,
    budget: 55000,
    creatorSlug: 'paralives-official',
    featured: false,
    likesCount: 189,
    viewsCount: 3100,
    tagSlugs: ['pool', 'single-floor'],
  },
  {
    title: 'Victorian Manor',
    slug: 'victorian-manor',
    description: 'An elegant Victorian-era home with ornate details, a grand staircase, and a beautiful library.',
    styleSlug: 'victorian',
    lotSize: '30×25',
    floors: 3,
    bedrooms: 5,
    bathrooms: 4,
    budget: 85000,
    creatorSlug: 'cozycottage',
    featured: true,
    likesCount: 412,
    viewsCount: 7890,
    tagSlugs: ['multi-story', 'family-friendly', 'large-lot'],
  },
  {
    title: 'Industrial Warehouse',
    slug: 'industrial-warehouse',
    description: 'Converted warehouse living with exposed brick, steel beams, and an expansive open floor plan.',
    styleSlug: 'industrial',
    lotSize: '30×20',
    floors: 1,
    bedrooms: 2,
    bathrooms: 2,
    budget: 38000,
    creatorSlug: 'alexbuilds',
    featured: false,
    likesCount: 76,
    viewsCount: 1280,
    tagSlugs: ['single-floor'],
  },
  {
    title: 'Suburban Family Home',
    slug: 'suburban-family-home',
    description: 'The perfect suburban home with a backyard, garage, and room for the whole family to grow.',
    styleSlug: 'suburban',
    lotSize: '25×20',
    floors: 2,
    bedrooms: 4,
    bathrooms: 2,
    budget: 42000,
    creatorSlug: 'cozycottage',
    featured: false,
    likesCount: 145,
    viewsCount: 2340,
    tagSlugs: ['family-friendly', 'garden'],
  },
  {
    title: 'Bohemian Treehouse',
    slug: 'bohemian-treehouse',
    description: 'A whimsical treehouse-inspired home with eclectic decor, hanging plants, and cozy nooks.',
    styleSlug: 'bohemian',
    lotSize: '20×15',
    floors: 2,
    bedrooms: 2,
    bathrooms: 1,
    budget: 25000,
    creatorSlug: 'alexbuilds',
    featured: false,
    likesCount: 203,
    viewsCount: 3450,
    tagSlugs: ['starter-home', 'garden'],
  },
  {
    title: 'Modern Eco Home',
    slug: 'modern-eco-home',
    description: 'Sustainable living at its finest with solar panels, rainwater collection, and a green roof.',
    styleSlug: 'modern',
    lotSize: '25×20',
    floors: 2,
    bedrooms: 3,
    bathrooms: 2,
    budget: 52000,
    creatorSlug: 'paralives-official',
    featured: true,
    likesCount: 298,
    viewsCount: 4780,
    tagSlugs: ['family-friendly', 'garden', 'multi-story'],
  },
];

async function seed() {
  console.log('🌱 Starting ParalivesBuilds seed...\n');

  // Clear existing data first (for clean seed)
  console.log('🧹 Clearing existing data...');
  await db().delete(buildTag);
  await db().delete(build);
  await db().delete(tag);
  await db().delete(creator);
  await db().delete(style);

  const now = new Date();

  // 1. Insert styles
  console.log('\n📋 Inserting styles...');
  const styleMap = new Map<string, string>();
  for (const s of stylesData) {
    const id = nanoid();
    await db().insert(style).values({ id, ...s, createdAt: now, updatedAt: now });
    styleMap.set(s.slug, id);
    console.log(`  ✓ ${s.name}`);
  }

  // 2. Insert creators
  console.log('\n👤 Inserting creators...');
  const creatorMap = new Map<string, string>();
  for (const c of creatorsData) {
    const id = nanoid();
    await db().insert(creator).values({ id, ...c, createdAt: now });
    creatorMap.set(c.slug, id);
    console.log(`  ✓ ${c.name}`);
  }

  // 3. Insert tags
  console.log('\n🏷️  Inserting tags...');
  const tagMap = new Map<string, string>();
  for (const t of tagsData) {
    const id = nanoid();
    await db().insert(tag).values({ id, ...t, createdAt: now, updatedAt: now });
    tagMap.set(t.slug, id);
    console.log(`  ✓ ${t.name}`);
  }

  // 4. Insert builds
  console.log('\n🏠 Inserting builds...');
  for (const b of buildsData) {
    const styleId = styleMap.get(b.styleSlug);
    const creatorId = creatorMap.get(b.creatorSlug);

    if (!styleId || !creatorId) {
      console.log(`  ⚠ Skipping ${b.title} - missing style or creator`);
      continue;
    }

    const id = nanoid();
    await db()
      .insert(build)
      .values({
        id,
        title: b.title,
        slug: b.slug,
        description: b.description,
        styleId,
        lotSize: b.lotSize,
        floors: b.floors,
        bedrooms: b.bedrooms,
        bathrooms: b.bathrooms,
        budget: b.budget,
        images: JSON.stringify([`/imgs/builds/${b.slug}.webp`]),
        creatorId,
        featured: b.featured,
        likesCount: b.likesCount,
        viewsCount: b.viewsCount,
        status: BuildStatus.PUBLISHED,
        createdAt: now,
        updatedAt: now,
      });

    // Insert build-tag associations
    for (const tagSlug of b.tagSlugs) {
      const tagId = tagMap.get(tagSlug);
      if (tagId) {
        await db().insert(buildTag).values({ buildId: id, tagId });
      }
    }

    console.log(`  ✓ ${b.title}`);
  }

  console.log('\n✅ Seed completed successfully!');
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
