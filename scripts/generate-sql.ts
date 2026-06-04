
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  try {
    const games = await sql`SELECT id, iframe_url FROM game`;
    let sqlContent = '-- Game table update script\n';
    
    for (const game of games) {
        if (game.iframe_url) {
            // Escape single quotes for SQL
            const escapedUrl = game.iframe_url.replace(/'/g, "''");
            sqlContent += `UPDATE game SET iframe_url = '${escapedUrl}' WHERE id = '${game.id}';\n`;
        }
    }

    const outputPath = path.join(process.cwd(), 'db', 'game_update.sql');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, sqlContent);
    
    console.log(`Successfully generated ${outputPath}`);
  } catch (error) {
    console.error('Error generating SQL file:', error);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
