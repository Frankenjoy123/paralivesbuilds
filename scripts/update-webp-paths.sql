UPDATE build SET images = REPLACE(images, '.png",', '.webp",') WHERE images LIKE '%.png%';
UPDATE build SET images = REPLACE(images, '.png"]', '.webp"]') WHERE images LIKE '%.png%';
