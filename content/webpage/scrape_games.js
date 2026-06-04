const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://gamiary.com';

const R2_CONFIG = {
  publicDomain: 'https://img-gamiary.16781678.xyz'
};

const categories = [
  { id: 'cat_action', slug: 'action', name: 'Action' },
  { id: 'cat_puzzle', slug: 'puzzle', name: 'Puzzle' },
  { id: 'cat_racing', slug: 'racing', name: 'Racing' },
  { id: 'cat_sports', slug: 'sports', name: 'Sports' },
  { id: 'cat_strategy', slug: 'strategy', name: 'Strategy' },
  { id: 'cat_clicker', slug: 'clicker', name: 'Clicker' },
  { id: 'cat_music', slug: 'music', name: 'Music' },
  { id: 'cat_adventure', slug: 'adventure', name: 'Adventure' },
  { id: 'cat_beauty', slug: 'beauty', name: 'Beauty' },
  { id: 'cat_horror', slug: 'horror', name: 'Horror' }
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      } else { reject(new Error(`Status: ${res.statusCode}`)); }
    }).on('error', reject);
  });
}

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseGamesFromPageJSON(html, categoryId) {
  const games = [];
  // 查找注入到页面的 JSON 数据。gamiary 通常在脚本中包含页面状态。
  // 我们尝试寻找类似 "games":[...] 的结构
  try {
    const dataMatch = html.match(/const\s+data\s*=\s*({[\s\S]*?});/i) || html.match(/window\.__PRELOADED_STATE__\s*=\s*({[\s\S]*?});/i);
    if (dataMatch) {
      const jsonData = JSON.parse(dataMatch[1]);
      // ... 进一步解析 jsonData ...
    }
  } catch(e) {}

  // 如果找不到 JSON，我们使用一种更通用的正则，尝试在代码中寻找游戏对象的定义
  // 匹配类似 { slug: "...", title: "...", image: "..." }
  const itemRegex = /\{[^}]*slug\s*:\s*"([^"]+)"[^}]*title\s*:\s*"([^"]+)"[^}]*image\s*:\s*"([^"]+)"[^}]*plays\s*:\s*"([^"]+)"[^}]*\}/g;
  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    const slug = match[1];
    const title = match[2];
    const rawImage = match[3];
    const playsStr = match[4];

    games.push({
      id: `game_${slug.replace(/-/g, '_')}`,
      categoryId,
      slug,
      title,
      rawImage,
      imageName: `${slug}.${rawImage.split('.').pop() || 'avif'}`,
      plays: playsStr.includes('k') ? parseFloat(playsStr) * 1000 : parseInt(playsStr) || 0
    });
  }
  return games;
}

// 针对你之前保存的 home.html 的回退逻辑
function parseFromLocalHome(categoryId) {
  const localHomePath = path.join(__dirname, 'home.html');
  if (!fs.existsSync(localHomePath)) return [];
  const html = fs.readFileSync(localHomePath, 'utf8');
  // 匹配首页 HTML 中的卡片
  const cardRegex = /href="\/game\/([^/"]+)\/"[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]+)"[\s\S]*?<span>([^<]+)<\/span>/g;
  const results = [];
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const slug = match[1];
    const rawImage = match[2];
    const alt = match[3];
    const playsStr = match[4];
    results.push({
      id: `game_${slug.replace(/-/g, '_')}`,
      categoryId,
      slug,
      title: alt.replace(/^Play /, '').split(' - ')[0],
      rawImage,
      imageName: `${slug}.${rawImage.split('.').pop() || 'avif'}`,
      plays: playsStr.includes('k') ? parseFloat(playsStr) * 1000 : parseInt(playsStr) || 0
    });
  }
  return results;
}

async function start() {
  const imagesDir = path.join(__dirname, 'images');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
  console.log('--- Starting Stable Gamiary Crawl ---');
  let allSql = '-- Gamiary Games Seed Data\n';

  for (const cat of categories) {
    console.log(`\n[Category: ${cat.name}]`);
    let games = [];
    
    // 尝试1: 线上抓取
    try {
      const html = await fetchHtml(`${BASE_URL}/category/${cat.slug}/`);
      games = parseGamesFromPageJSON(html, cat.id);
    } catch(e) {}

    // 尝试2: 如果线上拿不到带图片的，从你提供的本地 home.html 提取 (如果是该分类的)
    if (games.length === 0) {
      console.log('  -> Falling back to local home.html parsing...');
      games = parseFromLocalHome(cat.id);
    }

    console.log(`  -> Found ${games.length} games with images.`);
    
    for (const game of games) {
      process.stdout.write(`    Processing ${game.slug}... `);
      try {
        const localPath = path.join(imagesDir, game.imageName);
        if (!fs.existsSync(localPath)) {
          await downloadImage(game.rawImage, localPath);
        }
        
        const r2Url = `${R2_CONFIG.publicDomain}/${game.imageName}`;
        allSql += `INSERT INTO "game" ("id", "category_id", "slug", "title", "image", "iframe_url", "plays", "status", "sort", "created_at", "updated_at")\n`;
        allSql += `VALUES ('${game.id}', '${game.categoryId}', '${game.slug}', '${game.title.replace(/'/g, "''")}', '${r2Url}', '', ${game.plays}, 'published', 0, now(), now())\n`;
        allSql += `ON CONFLICT (slug) DO NOTHING;\n`;
        process.stdout.write('OK\n');
      } catch (e) { process.stdout.write(`FAILED: ${e.message}\n`); }
    }
    
    await new Promise(r => setTimeout(r, 2000));
  }

  fs.writeFileSync(path.join(__dirname, '..', '..', 'src/config/db/migrations/0002_seed_gamiary_games.sql'), allSql);
  console.log('\n--- CRAWL COMPLETE ---');
}

start();
