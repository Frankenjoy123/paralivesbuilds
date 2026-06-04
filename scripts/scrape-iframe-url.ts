
import postgres from 'postgres';

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getGamesData() {
  console.log('Fetching main page to find entry JS...');
  const mainPage = await fetch('https://gamiary.com/').then(r => r.text());
  const entryMatch = mainPage.match(/src="\/assets\/index-([a-zA-Z0-9]+)\.js"/);
  if (!entryMatch) {
    throw new Error('Could not find entry JS');
  }
  const entryUrl = `https://gamiary.com/assets/index-${entryMatch[1]}.js`;
  console.log(`Fetching entry JS: ${entryUrl}`);
  const entryJs = await fetch(entryUrl).then(r => r.text());
  
  const dataMatch = entryJs.match(/assets\/games_data-([a-zA-Z0-9]+)\.js/);
  if (!dataMatch) {
    throw new Error('Could not find games_data JS');
  }
  const dataUrl = `https://gamiary.com/assets/games_data-${dataMatch[1]}.js`;
  console.log(`Fetching games data: ${dataUrl}`);
  const dataJs = await fetch(dataUrl).then(r => r.text());

  // Parse the dataJs. It's an array of objects like {id:"...", title:"...", game_url:"..."}
  // We'll use a regex to extract id and game_url
  const games: Record<string, string> = {};
  const regex = /id:"([^"]+)",title:"[^"]*",thumbnail_url:"[^"]*",cover_url:"[^"]*",game_url:"([^"]+)"/g;
  let match;
  while ((match = regex.exec(dataJs)) !== null) {
    const slug = match[1].toLowerCase().replace(/_/g, '-');
    games[slug] = match[2];
  }
  
  console.log(`Found ${Object.keys(games).length} games in data file.`);
  return games;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  try {
    const gamiaryData = await getGamesData();
    
    const dbGames = await sql`SELECT id, slug, iframe_url FROM game WHERE (iframe_url = '' OR iframe_url IS NULL)`;
    console.log(`Found ${dbGames.length} games in DB to update.`);

    let updatedCount = 0;
    for (let i = 0; i < dbGames.length; i++) {
      const row = dbGames[i];
      const iframeUrl = gamiaryData[row.slug];

      if (iframeUrl) {
        await sql`UPDATE game SET iframe_url = ${iframeUrl} WHERE id = ${row.id}`;
        console.log(`[${i + 1}/${dbGames.length}] ✅ Updated ${row.slug}`);
        updatedCount++;
      } else {
        console.warn(`[${i + 1}/${dbGames.length}] ❌ Could not find iframe URL for ${row.slug} in Gamiary data`);
        // Fallback or skip
      }

      // Small delay for DB
      await delay(100);
    }

    console.log(`Finished. Updated ${updatedCount} games.`);
  } catch (error) {
    console.error('Main execution error:', error);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
