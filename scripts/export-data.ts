
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

async function exportTableToSql(sql: any, tableName: string, outputFileName: string) {
  console.log(`Exporting table: ${tableName}...`);
  const rows = await sql`SELECT * FROM ${sql(tableName)}`;
  if (rows.length === 0) {
    console.log(`Table ${tableName} is empty.`);
    return;
  }

  const columns = Object.keys(rows[0]);
  let sqlContent = `-- Data for table: ${tableName}\n`;
  
  // Optional: Add a TRUNCATE or DELETE if you want to clear old data
  // sqlContent += `TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;\n\n`;

  for (const row of rows) {
    const values = columns.map(col => {
      const val = row[col];
      if (val === null) return 'NULL';
      if (typeof val === 'string') {
        return `'${val.replace(/'/g, "''")}'`;
      }
      if (val instanceof Date) {
        return `'${val.toISOString()}'`;
      }
      if (typeof val === 'object') {
        return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
      }
      return val;
    });

    sqlContent += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
  }

  const outputPath = path.join(process.cwd(), 'db', outputFileName);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, sqlContent);
  console.log(`✅ Generated ${outputPath}`);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  try {
    await exportTableToSql(sql, 'game', 'game.sql');
    await exportTableToSql(sql, 'game_category', 'game_category.sql');
    console.log('Finished exporting all tables.');
  } catch (error) {
    console.error('Export error:', error);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
