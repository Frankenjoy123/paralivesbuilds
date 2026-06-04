import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { envConfigs } from '@/config';
import { isCloudflareWorker } from '@/shared/lib/env';

// Global database connection instance (singleton pattern)
let dbInstance: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof postgres> | null = null;

export function getPostgresDb() {
  let databaseUrl = envConfigs.database_url;

  let isHyperdrive = false;
  const schemaName = (envConfigs.db_schema || 'public').trim();
  const connectionSchemaOptions =
    schemaName && schemaName !== 'public'
      ? { connection: { options: `-c search_path=${schemaName}` } }
      : {};

  if (isCloudflareWorker) {
    const { env }: { env: any } = getCloudflareContext();
    // Detect if set Hyperdrive
    isHyperdrive = 'HYPERDRIVE' in env;

    if (isHyperdrive && env.HYPERDRIVE?.connectionString) {
      databaseUrl = env.HYPERDRIVE.connectionString;
      console.log('using Hyperdrive connection');
    }
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  // In Cloudflare Workers, create new connection each time or use singleton if possible
  // Note: Standard Cloudflare Workers have restrictions on long-lived connections
  if (isCloudflareWorker) {
    console.log('in Cloudflare Workers environment');
    const workerClient = postgres(databaseUrl, {
      prepare: false,
      max: 1,
      idle_timeout: 10,
      connect_timeout: 15, // Increased for Neon cold starts
      ...connectionSchemaOptions,
    });

    return drizzle(workerClient);
  }

  // Singleton mode: reuse existing connection
  if (envConfigs.db_singleton_enabled === 'true') {
    if (dbInstance) {
      return dbInstance;
    }

    client = postgres(databaseUrl, {
      prepare: false,
      max: Number(envConfigs.db_max_connections) || 1,
      idle_timeout: 30,
      connect_timeout: 15,
      ...connectionSchemaOptions,
    });

    dbInstance = drizzle(client);
    return dbInstance;
  }

  // Non-singleton mode
  const serverlessClient = postgres(databaseUrl, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 15,
    ...connectionSchemaOptions,
  });

  return drizzle(serverlessClient);
}

// Optional: Function to close database connection (useful for testing or graceful shutdown)
// Note: Only works in singleton mode
export async function closePostgresDb() {
  if (envConfigs.db_singleton_enabled && client) {
    await client.end();
    client = null;
    dbInstance = null;
  }
}
