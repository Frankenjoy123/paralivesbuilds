DELETE FROM build_tag;
DELETE FROM build;
DELETE FROM tag;
DELETE FROM creator;
DELETE FROM style;

INSERT INTO style (id, name, slug, build_count, sort_order, created_at, updated_at) VALUES
('style_modern', 'Modern', 'modern', 0, 1, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('style_cottage', 'Cottage', 'cottage', 0, 2, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('style_minimalist', 'Minimalist', 'minimalist', 0, 3, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('style_industrial', 'Industrial', 'industrial', 0, 4, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('style_rustic', 'Rustic', 'rustic', 0, 5, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('style_victorian', 'Victorian', 'victorian', 0, 6, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('style_tropical', 'Tropical', 'tropical', 0, 7, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('style_suburban', 'Suburban', 'suburban', 0, 8, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('style_farmhouse', 'Farmhouse', 'farmhouse', 0, 9, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('style_bohemian', 'Bohemian', 'bohemian', 0, 10, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER));

INSERT INTO creator (id, slug, name, bio, builds_count, created_at) VALUES
('creator_official', 'paralives-official', 'Paralives Team', 'Official Paralives game team showcasing featured builds.', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('creator_alex', 'alexbuilds', 'AlexBuilds', 'Passionate builder creating modern and minimalist homes.', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('creator_cozy', 'cozycottage', 'CozyCottage', 'Specializing in warm, inviting cottage-style homes.', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER));

INSERT INTO tag (id, name, slug, build_count, created_at, updated_at) VALUES
('tag_starter', 'Starter Home', 'starter-home', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('tag_family', 'Family Friendly', 'family-friendly', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('tag_budget', 'Budget Friendly', 'budget-friendly', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('tag_large', 'Large Lot', 'large-lot', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('tag_single', 'Single Floor', 'single-floor', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('tag_multi', 'Multi-Story', 'multi-story', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('tag_garden', 'Garden', 'garden', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('tag_pool', 'Pool', 'pool', 0, CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER));

INSERT INTO build (id, slug, title, description, style_id, lot_size, floors, bedrooms, bathrooms, budget, images, workshop_url, video_url, creator_id, featured, likes_count, views_count, status, created_at, updated_at) VALUES
('build_1', 'cozy-cottage-starter', 'Cozy Cottage Starter Home', 'A perfect starter home for new Paralives players. Features a warm living room, compact kitchen, and a charming garden.', 'style_cottage', '20×15', 1, 2, 1, 18000, '["/imgs/builds/cozy-cottage-starter.webp"]', NULL, NULL, 'creator_official', 1, 128, 2048, 'published', CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('build_2', 'modern-glass-loft', 'Modern Glass Loft', 'A stunning modern glass loft featuring floor-to-ceiling windows, open-concept living, and a rooftop terrace.', 'style_modern', '30×20', 2, 3, 2, 45000, '["/imgs/builds/modern-glass-loft.webp"]', NULL, NULL, 'creator_alex', 1, 342, 5620, 'published', CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('build_3', 'minimalist-zen-retreat', 'Minimalist Zen Retreat', 'Find peace in this minimalist home with clean lines, natural materials, and a serene courtyard.', 'style_minimalist', '25×20', 1, 2, 1, 28000, '["/imgs/builds/minimalist-zen-retreat.webp"]', NULL, NULL, 'creator_alex', 0, 95, 1540, 'published', CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('build_4', 'rustic-farmhouse', 'Rustic Farmhouse', 'A charming farmhouse with a wrap-around porch, large kitchen, and plenty of space for a big family.', 'style_farmhouse', '40×30', 2, 4, 3, 62000, '["/imgs/builds/rustic-farmhouse.webp"]', NULL, NULL, 'creator_cozy', 1, 256, 4200, 'published', CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('build_5', 'tropical-beach-villa', 'Tropical Beach Villa', 'Escape to paradise with this tropical villa featuring a private pool, outdoor shower, and ocean views.', 'style_tropical', '35×25', 1, 3, 2, 55000, '["/imgs/builds/tropical-beach-villa.webp"]', NULL, NULL, 'creator_official', 0, 189, 3100, 'published', CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('build_6', 'victorian-manor', 'Victorian Manor', 'An elegant Victorian-era home with ornate details, a grand staircase, and a beautiful library.', 'style_victorian', '30×25', 3, 5, 4, 85000, '["/imgs/builds/victorian-manor.webp"]', NULL, NULL, 'creator_cozy', 1, 412, 7890, 'published', CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('build_7', 'industrial-warehouse', 'Industrial Warehouse', 'Converted warehouse living with exposed brick, steel beams, and an expansive open floor plan.', 'style_industrial', '30×20', 1, 2, 2, 38000, '["/imgs/builds/industrial-warehouse.webp"]', NULL, NULL, 'creator_alex', 0, 76, 1280, 'published', CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('build_8', 'suburban-family-home', 'Suburban Family Home', 'The perfect suburban home with a backyard, garage, and room for the whole family to grow.', 'style_suburban', '25×20', 2, 4, 2, 42000, '["/imgs/builds/suburban-family-home.webp"]', NULL, NULL, 'creator_cozy', 0, 145, 2340, 'published', CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('build_9', 'bohemian-treehouse', 'Bohemian Treehouse', 'A whimsical treehouse-inspired home with eclectic decor, hanging plants, and cozy nooks.', 'style_bohemian', '20×15', 2, 2, 1, 25000, '["/imgs/builds/bohemian-treehouse.webp"]', NULL, NULL, 'creator_alex', 0, 203, 3450, 'published', CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
('build_10', 'modern-eco-home', 'Modern Eco Home', 'Sustainable living at its finest with solar panels, rainwater collection, and a green roof.', 'style_modern', '25×20', 2, 3, 2, 52000, '["/imgs/builds/modern-eco-home.webp"]', NULL, NULL, 'creator_official', 1, 298, 4780, 'published', CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER));

INSERT INTO build_tag (build_id, tag_id) VALUES
('build_1', 'tag_starter'), ('build_1', 'tag_budget'), ('build_1', 'tag_family'),
('build_2', 'tag_large'), ('build_2', 'tag_multi'), ('build_2', 'tag_pool'),
('build_3', 'tag_single'), ('build_3', 'tag_garden'),
('build_4', 'tag_family'), ('build_4', 'tag_large'), ('build_4', 'tag_garden'),
('build_5', 'tag_pool'), ('build_5', 'tag_single'),
('build_6', 'tag_multi'), ('build_6', 'tag_family'), ('build_6', 'tag_large'),
('build_7', 'tag_single'),
('build_8', 'tag_family'), ('build_8', 'tag_garden'),
('build_9', 'tag_starter'), ('build_9', 'tag_garden'),
('build_10', 'tag_family'), ('build_10', 'tag_garden'), ('build_10', 'tag_multi');
