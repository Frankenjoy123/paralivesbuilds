
import postgres from 'postgres';

const contentTemplate = `## Game Introduction

\${title} is a thrilling skill-based action game that challenges your timing, precision, and courage. Perform daring backflips across rooftops, platforms, and extreme environments, aiming for perfect landings and stylish combos. With simple controls but demanding execution, every jump feels intense, rewarding, and dangerously fun.

## How to Play

- **Jump and Flip:** Tap or click to jump, then time your flip perfectly in mid-air to prepare for a clean landing.
- **Stick the Landing:** Rotate just enough to land on your feet—too much or too little and it’s game over.
- **Master Timing:** Precision is everything. Learn when to jump, when to flip, and when to stop.
- **Progress Through Levels:** Each level introduces new distances, heights, and challenges that test your skills.
- **Chase Perfection:** Replay levels to improve your performance and land flawless backflips.

## What Players Are Saying

> “\${title} is insanely addictive. One perfect landing makes you want to try again and again.”
> “Simple controls, but the challenge is real. Timing a perfect flip feels so satisfying.”
> “The physics feel great, and every jump keeps me on edge.”
> “It’s tough, but that’s what makes it fun. Nailing a backflip is pure adrenaline.”
> “Perfect for short sessions, but I always end up playing longer than I planned.”

## Why Play \${title}?

\${title} stands out by turning a simple idea into a pure test of skill. There are no complicated mechanics—just you, gravity, and perfect timing. Each successful flip feels earned, and every failure pushes you to try again. If you enjoy challenging, skill-driven games that reward precision and practice, \${title} delivers an intense and unforgettable experience.

- **Skill-Based Gameplay:** Easy to learn, hard to master.
- **Satisfying Physics:** Every flip and landing feels impactful.
- **Short, Intense Levels:** Ideal for quick play or repeated retries.
- **Pure Challenge:** No luck—only timing and control.

Take a deep breath, jump off the edge, and prove your skills in \${title}!

## Game Features

- Play \${title} for free online – no download required
- Instant play – start gaming immediately
- Smooth animations and responsive controls
- Works on all devices – desktop, tablet, and mobile
- No registration or sign-up needed
- Regular updates and new content`;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  try {
    const dbGames = await sql`SELECT id, title FROM game WHERE (content = '' OR content IS NULL)`;
    console.log(`Found ${dbGames.length} games with empty content.`);

    for (let i = 0; i < dbGames.length; i++) {
        const row = dbGames[i];
      const gameContent = contentTemplate.replace(/\${title}/g, row.title);
      await sql`UPDATE game SET content = ${gameContent} WHERE id = ${row.id}`;
      console.log(`[${i + 1}/${dbGames.length}] ✅ Updated content for: ${row.title}`);
    }

    console.log('Finished updating game content.');
  } catch (error) {
    console.error('Execution error:', error);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
